"use client";

import { useContext, useEffect, useState } from "react";
import { BookOpen, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Link, useParams } from "react-router-dom";
import LoadingLoader from "@/CustomComponent/LoadingLoader";

export default function ParentDashboard() {
  const { studentId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(GlobalContext);

  useEffect(() => {
    let mounted = true;
    const fetchChildCourses = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(`parent/child-courses/${studentId}`);
        console.log(res);
        
        if (mounted && res.data.success) {
          setEnrollments(res.data.enrolledCourses || []);
          setStudentName(res.data.studentName || "Student");
        }
      } catch (err) {
        console.error("Error fetching child courses:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchChildCourses();
    return () => { mounted = false; };
  }, [studentId]);

  if (loading) return <LoadingLoader />;

  return (
    <div className="min-h-screen pb-12">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-green-100 text-green-700 p-2 rounded-lg w-10 h-10 flex items-center justify-center">
            {studentName.charAt(0)}
          </span>
          {studentName}'s Academic Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1 ml-12">
          Monitoring enrollment status and academic performance.
        </p>
      </div>

      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Total Enrolled Courses
              </CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen size={20} className="text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {enrollments.length}
              </div>
              <p className="text-xs text-gray-400 mt-1">Active learning paths</p>
            </CardContent>
          </Card>

          <Link 
            to={`/parent/${studentId}/child-gradebook`} 
            className="group block"
          >
            <Card className="border-none shadow-sm bg-white group-hover:ring-2 group-hover:ring-green-500 transition-all cursor-pointer overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Academic Performance
                </CardTitle>
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <FileText size={20} className="text-green-600 group-hover:text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-gray-800 group-hover:text-green-600">View Gradebook</div>
                    <p className="text-xs text-gray-400 mt-1">Check scores and assessments</p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Course List Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Course List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enroll) => (
            <div key={enroll._id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={enroll.course?.thumbnail?.url || "/placeholder.svg"} 
                  alt="Course" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-gray-800 truncate">
                  {enroll.course?.courseTitle || "Untitled Course"}
                </h3>
                <p className="text-xs text-gray-500">
                  {enroll.course?.category?.title || "Academic"}
                </p>
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <p className="text-gray-400 text-sm italic col-span-full">No courses found for this student.</p>
          )}
        </div>
      </section>
    </div>
  );
}