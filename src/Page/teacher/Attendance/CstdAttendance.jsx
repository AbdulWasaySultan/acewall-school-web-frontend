import { useContext, useEffect, useState, useMemo } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import avatarDefault from "@/assets/avatar.png";
import { toast } from "sonner";

const CstdAttendance = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const stateCourseTitle = location.state?.courseTitle || "";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseTitle, setCourseTitle] = useState(stateCourseTitle);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Records state holds: { [studentId]: { status: "present", note: "i was present..." } }
  const [attendanceRecords, setAttendanceRecords] = useState({});

  const isToday = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return selectedDate === todayStr;
  }, [selectedDate]);

  // 1. Fetch Students enrolled in the course
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/course/getallCoursesforTeacher", {
        params: { courseId, limit: 100 },
      });

      const allStudents = res.data.students || [];

      // FILTER LOGIC: Only keep students enrolled in this specific courseId
      const filteredByCourse = allStudents.filter((student) =>
        student.courses?.some((course) => course._id === courseId)
      );

      setStudents(filteredByCourse);

      // Set course title from the first matching student's course list
      if (!courseTitle && filteredByCourse.length > 0) {
        const course = filteredByCourse[0].courses?.find(
          (c) => c._id === courseId
        );
        if (course) setCourseTitle(course.courseTitle);
      }
    } catch (err) {
      console.error("Fetch students error:", err);
      toast.error("Failed to load student list");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Attendance records (Updated to map status and note correctly)
  const fetchExistingAttendance = async () => {
    try {
      const res = await axiosInstance.get(
        `/attendance/get-attendance/${courseId}/${selectedDate}`
      );

      const updatedRecords = {};
      // Initialize state for all students
      students.forEach((s) => {
        updatedRecords[s._id] = { status: null, note: "" };
      });

      if (res.data.success && res.data.attendance) {
        const existingData = res.data.attendance;

        Object.keys(existingData).forEach((sId) => {
          if (updatedRecords[sId]) {
            // Mapping the note and status from your object structure
            updatedRecords[sId] = {
              status: existingData[sId].status || null,
              note: existingData[sId].note || "",
            };
          }
        });
      }
      setAttendanceRecords(updatedRecords);
    } catch (err) {
      console.error("Fetch attendance error:", err);
      // Reset records on error
      const resetRecords = {};
      students.forEach(
        (s) => (resetRecords[s._id] = { status: null, note: "" })
      );
      setAttendanceRecords(resetRecords);
    }
  };

  useEffect(() => {
    if (courseId) fetchStudents();
  }, [courseId]);

  useEffect(() => {
    if (courseId && students.length > 0) {
      fetchExistingAttendance();
    }
  }, [selectedDate, students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [students, searchText]);

  // Teacher can change status for any date
  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId]?.status === status ? null : status,
      },
    }));
  };

  const saveAttendance = async () => {
    try {
      const payload = {
        courseId,
        date: selectedDate,
        records: attendanceRecords,
      };

      const res = await axiosInstance.post(
        "/attendance/mark-attendance",
        payload
      );

      if (res.data.success) {
        toast.success(`Attendance updated for ${selectedDate}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to update attendance");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {courseTitle || "Course"} Attendance
          </h1>
          <p className="text-sm text-gray-500">
            {isToday
              ? "Marking today's records"
              : `Viewing/Editing records for ${selectedDate}`}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
          <label className="text-sm font-semibold text-gray-600 ml-2">
            History:
          </label>
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-none focus:ring-0 outline-none text-sm cursor-pointer font-medium text-blue-600"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search student..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border p-2 rounded-lg w-full max-sm text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4 text-center">Present</th>
                <th className="px-6 py-4 text-center">Absent</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Student's Note (Read-Only)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-400 italic"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const record = attendanceRecords[student._id] || {
                    status: null,
                    note: "",
                  };

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage
                              src={student.profileImg?.url || avatarDefault}
                            />
                            <AvatarFallback>
                              {student.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-gray-700">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-green-600 cursor-pointer"
                          checked={record.status === "present"}
                          onChange={() =>
                            handleStatusChange(student._id, "present")
                          }
                        />
                      </td>

                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-red-600 cursor-pointer"
                          checked={record.status === "absent"}
                          onChange={() =>
                            handleStatusChange(student._id, "absent")
                          }
                        />
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-[10px] py-1 px-2 rounded-full uppercase font-bold ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700"
                              : record.status === "absent"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {record.status || "Not Marked"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className={`p-2 rounded border text-xs min-h-[40px] max-w-[300px] ${
                            record.note
                              ? "bg-amber-50 border-amber-200 text-amber-900"
                              : "bg-gray-50 text-gray-400 italic"
                          }`}
                        >
                          {record.note || "No note provided by student"}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tight">
            Teacher Portal • {selectedDate}
          </p>
          <Button
            onClick={saveAttendance}
            className="px-10 shadow-md bg-green-600 hover:bg-green-700 text-white"
          >
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CstdAttendance;
