"use client";

import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Search, Filter, BookOpenCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ParentCourseByCard() {
  const { studentId } = useParams();
  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  useEffect(() => {
    const fetchChildCourses = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        // Using your specific API endpoint for enrolled courses
        const response = await axiosInstance.get(
          `/parent/child-courses/${studentId}`
        );
        
        if (response.data.success) {
          setStudentName(response.data.studentName);
          
          // Mapping the enrolledCourses array to a simpler structure for the UI
          const courseList = response.data.enrolledCourses.map((enrollment) => ({
            _id: enrollment.course?._id,
            title: enrollment.course?.courseTitle || "Untitled Course",
            thumbnail: enrollment.course?.thumbnail?.url || "https://via.placeholder.com/300x170",
            category: enrollment.course?.category?.title,
            instructor: `${enrollment.course?.createdby?.firstName} ${enrollment.course?.createdby?.lastName}`
          }));

          setCourses(courseList);
        }
      } catch (error) {
        console.error("Error fetching child enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildCourses();
  }, [studentId]);

  // Client-side filtering based on search text and dropdown selection
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDropdown =
        selectedCourse === "all" || course._id === selectedCourse;
      return matchesSearch && matchesDropdown;
    });
  }, [courses, search, selectedCourse]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader className="animate-spin text-green-600" size={40} />
        <p className="text-gray-500 font-medium italic">
          Loading curriculum for {studentName || "student"}...
        </p>
      </div>
    );
  }

  return (
    <main className="w-full p-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <BookOpenCheck size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">
            Academic Progress
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Course Assessments
        </h1>
        <p className="text-gray-500 mt-1">
          Select a course to view detailed assessment results for{" "}
          <span className="font-bold text-gray-700">{studentName}</span>.
        </p>
      </header>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-end">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 border-gray-200 focus-visible:ring-green-500 rounded-xl shadow-sm"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <BookOpenCheck className="mx-auto text-gray-200 mb-4" size={64} />
          <p className="text-gray-500 font-medium text-lg">No courses found.</p>
          <p className="text-gray-400 text-sm">The student may not be enrolled in any active courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course) => (
            <Link key={course._id} to={`${course._id}`} className="group block">
              <Card className="border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden bg-white rounded-2xl h-full flex flex-col">
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={course.thumbnail}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={course.title}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                  {course.category && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm text-green-700">
                            {course.category}
                        </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                        {course.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 font-medium italic">Instructor: {course.instructor}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-green-600">
                      View Assessments
                    </span>
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                      →
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}