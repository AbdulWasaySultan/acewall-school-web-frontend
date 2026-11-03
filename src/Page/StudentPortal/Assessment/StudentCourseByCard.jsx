"use client";

import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function StudentCourseByCard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get(
          "assessment/getAllassessmentforStudent"
        );
        const data = response.data;

        // Extract unique courses
        const uniqueCourses = [];
        data.forEach((item) => {
          if (item.course?._id) {
            if (!uniqueCourses.some((c) => c._id === item.course._id)) {
              uniqueCourses.push({
                _id: item.course._id,
                title: item.course.courseTitle,
                thumbnail:
                  item.course.thumbnail?.url || "https://via.placeholder.com/150",
              });
            }
          }
        });

        setCourses(uniqueCourses);
      } catch (error) {
        console.error("Error fetching student assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Filter courses based on search and dropdown
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

  return (
    <main className="w-full p-6">
      <h1 className="text-xl py-4 mb-6 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
        Student Assessments by Course
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        {/* Search Filter */}
        <Input
          placeholder="Search by course title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* Dropdown Filter */}
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Link key={course._id} to={`course/${course._id}`} className="block">
              <Card className="hover:shadow-md hover:border-green-300 transition cursor-pointer">
                <CardContent className="p-4 space-y-3">
                  <img
                    src={course.thumbnail}
                    className="w-full h-36 object-cover rounded-lg"
                    alt={course.title}
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
