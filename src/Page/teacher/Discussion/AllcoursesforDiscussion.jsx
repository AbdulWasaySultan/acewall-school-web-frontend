import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Globe,
  Code,
  AlertCircle,
  Loader,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link } from "react-router-dom";

const TeacherCoursesForDiscussion = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    // Replace with your actual API endpoint
    await axiosInstance
      .get("conversation/getTeacherCourses")
      .then((res) => {
        console.log(res, "res");
        setCourses(res.data.courses || []);
        setTotalCourses(res.totalCourses || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);

        console.error("Error fetching courses:", err);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader className="animate-spin text-green-700"></Loader>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Error Loading Courses
                </h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Courses</h1>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-500">
              Start creating your first course to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  {course.thumbnail?.url ? (
                    <img
                      src={course.thumbnail.url}
                      alt={course.courseTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.published
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {course.published ? "Published" : "Unpublished"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {course.courseTitle}
                  </h3>

                  {/* Course Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Code className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="font-mono font-semibold">
                        {course.courseCode}
                      </span>
                    </div>
                  </div>

                  {/* Category & Subcategory */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.category?.name && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {course.category.name}
                      </span>
                    )}
                    {course.subcategory?.name && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {course.subcategory.name}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link to={`/teacher/discussions/course/${course._id}?type=course&&typeId=${course._id}`}>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      View Discussions
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCoursesForDiscussion;
