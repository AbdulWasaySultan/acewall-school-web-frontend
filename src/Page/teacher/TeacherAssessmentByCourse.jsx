"use client";

import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function TeacherAssessmentByCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("all");
  const [allCourseNames, setAllCourseNames] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get("assessment/allAssessmentByTeacher");
        const data = response.data;

        // Extract unique courses
        const uniqueCourses = [];
        const courseNamesSet = new Set();

        data.forEach((item) => {
          if (item.course?._id) {
            if (!uniqueCourses.some((c) => c._id === item.course._id)) {
              uniqueCourses.push({
                _id: item.course._id,
                title: item.course.courseTitle,
                thumbnail: item.course.thumbnail || { url: "https://via.placeholder.com/150" },
                category: item.course.category,
                createdby: item.course.createdby,
                language: item.course.language,
              });
            }
            courseNamesSet.add(item.course.courseTitle);
          }
        });

        setCourses(uniqueCourses);
        setAllCourseNames([...courseNamesSet].sort());
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesDropdown =
        selectedCourseName === "all" || course.title === selectedCourseName;
      return matchesSearch && matchesDropdown;
    });
  }, [courses, searchText, selectedCourseName]);

  return (
    <main className="w-full p-6">
      <h1 className="text-xl py-4 mb-6 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
        Assessments by Course
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by course name..."
          className="border rounded-lg px-3 py-2 w-full md:w-1/3"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Select value={selectedCourseName} onValueChange={setSelectedCourseName}>
          <SelectTrigger className="w-full md:w-1/3" aria-label="Course filter">
            {selectedCourseName === "all" ? "All Courses" : selectedCourseName}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {allCourseNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Courses */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <p className="text-center text-gray-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <article key={course._id} role="listitem">
              <Link
                to={`/teacher/assessments/bycourse/${course._id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 rounded-lg"
                aria-label={`View assessments for ${course.title}`}
              >
                <Card className="pb-6 pt-0 w-full overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={course?.thumbnail?.url || "https://via.placeholder.com/300x170"}
                      alt={
                        course?.thumbnail?.url
                          ? `${course.title} course thumbnail`
                          : "Course thumbnail placeholder"
                      }
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>

                  <CardHeader className="space-y-2">
                    {course.category?.title && (
                      <div className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium w-fit px-2 rounded">
                        <span aria-label={`Category: ${course.category.title}`}>
                          {course.category.title}
                        </span>
                      </div>
                    )}
                    <CardTitle>
                      <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                    </CardTitle>
                    {course.createdby?.firstName && (
                      <p className="text-xs text-muted-foreground">
                        <span className="sr-only">Instructor:</span>
                        Teacher: {course.createdby.firstName}
                      </p>
                    )}
                  </CardHeader>

                  {course.language && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        <span className="sr-only">Course language:</span>
                        Language: {course.language}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
