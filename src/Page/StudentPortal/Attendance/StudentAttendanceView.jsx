import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import avatarDefault from "@/assets/avatar.png";

const StudentAttendanceView = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const fetchMyAttendance = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/attendance/my-attendance");
      if (res.data?.success) {
        setAttendanceData(res.data.attendance || []);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      toast.error("Could not load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const filteredData = useMemo(() => {
    return (attendanceData || []).filter((item) =>
      item?.course?.courseTitle
        ?.toLowerCase()
        .includes(filterText.toLowerCase())
    );
  }, [attendanceData, filterText]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Attendance History
          </h1>
          <p className="text-sm text-gray-500">
            View your daily presence record
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by course..."
            className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none w-64"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Reports</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-20 font-medium text-gray-400"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-20 text-gray-500"
                  >
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-gray-100 overflow-hidden border">
                          {record.course?.thumbnail?.url ? (
                            <img
                              src={record.course.thumbnail.url}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            <BookOpen className="w-full h-full p-1 text-gray-300" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {record.course?.courseTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              record.course?.createdby?.profileImg?.url ||
                              avatarDefault
                            }
                          />
                          <AvatarFallback>
                            {record.course?.createdby?.firstName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">
                          {record.course?.createdby?.firstName}{" "}
                          {record.course?.createdby?.lastName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-[10px] py-1 px-3 rounded-full uppercase font-bold border ${
                          record.status === "present"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100"
                        onClick={() =>
                          navigate(
                            `/student/attendance/monthly/${record.course?._id}`,
                            {
                              state: {
                                courseTitle: record.course?.courseTitle,
                              },
                            }
                          )
                        }
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-xs">Monthly Report</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceView;
