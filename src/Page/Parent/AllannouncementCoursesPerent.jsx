"use client";

import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Bell, Megaphone, Filter, Users, Loader } from "lucide-react";

const AllAnnouncementCoursesParent = () => {
  const { studentId } = useParams(); // URL: /parent/:studentId/announcements
  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const navigate = useNavigate();

  const fetchEnrolledCourses = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/parent/child-courses/${studentId}`);
      if (res.data.success) {
        setStudentName(res.data.studentName);

        const courseList = res.data.enrolledCourses.map((enroll) => ({
          _id: enroll.course?._id,
          courseTitle: enroll.course?.courseTitle || "Untitled Course",
          thumbnail:
            enroll.course?.thumbnail?.url ||
            "https://via.placeholder.com/300x170",
        }));
        setCourses(courseList);
      }
    } catch (err) {
      console.error("Error fetching child courses for announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, [studentId]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.courseTitle
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesDropdown =
        selectedCourseId === "all" || course._id === selectedCourseId;
      return matchesSearch && matchesDropdown;
    });
  }, [courses, searchText, selectedCourseId]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader className="animate-spin text-green-600" size={40} />
        <p className="text-gray-500 font-medium italic">Syncing curriculum updates...</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Context Badge */}
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-white shadow-sm w-fit px-4 py-1.5 rounded-full border border-green-100">
        <Users size={14} className="text-green-600" />
        <span>Monitoring Updates: <strong className="text-gray-800">{studentName || "Student"}</strong></span>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <Megaphone size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Course Announcements</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Recent Notifications
        </h1>
        <p className="text-gray-500 mt-1 max-w-2xl">
          Select a course below to view official updates, assignments, and reminders posted by instructors for {studentName.split(' ')[0]}.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-end">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by course name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 h-11 border-gray-200 focus-visible:ring-green-500 rounded-xl"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="h-11 bg-white border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <SelectValue placeholder="All Courses" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Enrolled Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.courseTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Content */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
          <Bell className="mx-auto text-gray-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-800">No courses found</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            We couldn't find any courses matching your search criteria for this student.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredCourses.map((course) => (
            <Card
              key={course._id}
              className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-none shadow-sm overflow-hidden bg-white rounded-2xl"
              onClick={() =>
                navigate(`/parent/${studentId}/announcements/${course._id}`, {
                  state: { courseTitle: course.courseTitle },
                })
              }
            >
              <AspectRatio ratio={16 / 9} className="overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.courseTitle}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              </AspectRatio>
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                  {course.courseTitle}
                </CardTitle>
                <div className="pt-4 flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-widest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Read Updates <Megaphone size={14} />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAnnouncementCoursesParent;