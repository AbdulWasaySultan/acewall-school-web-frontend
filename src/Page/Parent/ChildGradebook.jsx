"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Loader,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/lib/AxiosInstance";
import { BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
// ✅ Updated AssessmentTable
const AssessmentTable = ({ assessments = [] }) => {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-4">
        No assessments available
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden mt-2">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead scope="col" className="text-xs">
              Assessment
            </TableHead>
            <TableHead scope="col" className="text-xs">
              Category
            </TableHead>
            <TableHead scope="col" className="text-xs">
              Score
            </TableHead>
            <TableHead scope="col" className="text-xs">
              Max Points
            </TableHead>
            <TableHead scope="col" className="text-xs">
              Percentage
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments?.map((assessment, index) => {
            const hasValidPoints =
              assessment.studentPoints != null &&
              assessment.maxPoints != null &&
              assessment.maxPoints > 0;

            let percentage = "Pending";
            if (hasValidPoints) {
              const calcPercentage =
                (assessment.studentPoints / assessment.maxPoints) * 100;
              percentage = calcPercentage.toFixed(1);
            }

            return (
              <TableRow key={index} className="text-xs">
                <TableCell className="font-medium">
                  {assessment.assessmentTitle || "Untitled"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {assessment.category || "Uncategorized"}
                  </Badge>
                </TableCell>
                <TableCell>{assessment.studentPoints ?? "Pending"}</TableCell>
                <TableCell>{assessment.maxPoints ?? "Pending"}</TableCell>
                <TableCell>
                  {percentage === "Pending" ? (
                    <span className="text-gray-400 italic">Pending</span>
                  ) : (
                    <span
                      className={`font-medium ${
                        parseFloat(percentage) >= 70
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {percentage}%
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// 🟢 Grade Color Helper
const getLetterGradeColor = (letterGrade) => {
  if (["A", "A-", "A+"].includes(letterGrade))
    return "bg-green-100 text-green-800 border-green-200";
  if (["B", "B-", "B+"].includes(letterGrade))
    return "bg-blue-100 text-blue-800 border-blue-200";
  if (["C", "C-", "C+"].includes(letterGrade))
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
};

// 📘 Main Component
export default function ChildGradebook() {
  const { studentId } = useParams(); // Get ID from URL /parent/child-gradebook/:studentId
  const navigate = useNavigate();

  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGradeData = async () => {
    setLoading(true);
    try {
      // ✅ Using the parent-specific endpoint with the URL studentId
      const res = await axiosInstance.get(
        `/parent/child-gradebook/${studentId}`,
      );
      setGradeData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load gradebook data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchGradeData();
    }
  }, [studentId]);

  const toggleCourseExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
    setExpandedSemester(null);
  };

  const toggleSemesterExpand = (semesterId) => {
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Loader className="animate-spin h-10 w-10 text-blue-600" />
        <p className="text-gray-500 font-medium">
          Loading child's academic record...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to My Children
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Navigation Header */}
      <div className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/parent/MyChildren")}
          className="w-fit -ml-2 text-gray-500 hover:text-black"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to My Children
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold">
            Grade Report: {gradeData?.studentName}
          </h1>
        </div>
      </div>

      {/* Performance Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-indigo-800 text-sm uppercase tracking-wider">
            Academic Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
              <div className="text-3xl font-black text-indigo-700">
                {gradeData?.overallGPA > 0
                  ? gradeData.overallGPA.toFixed(2)
                  : "N/A"}
              </div>
              <div className="text-xs text-muted-foreground font-bold uppercase mt-1">
                Cumulative GPA
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
              <div className="text-3xl font-black text-indigo-700">
                {gradeData?.totalCourses || 0}
              </div>
              <div className="text-xs text-muted-foreground font-bold uppercase mt-1">
                Enrolled Courses
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Details Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-lg">Course Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Course</TableHead>
                <TableHead>Final Grade</TableHead>
                <TableHead className="text-right pr-6">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradeData?.courses.map((course) => (
                <React.Fragment key={course.courseId}>
                  <TableRow className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-semibold pl-6">
                      {course.courseName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getLetterGradeColor(course.letterGrade)}
                      >
                        {course.letterGrade ||
                          (course.standardGrade
                            ? `${course.standardGrade} Pts`
                            : "Pending")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end items-center gap-2">
                        {/* NEW ANALYTICS BUTTON */}
                        <Link
                          to={`/parent/${studentId}/analytics/${course.courseId}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          >
                            <BarChart2 className="h-4 w-4" />
                            Analytics
                          </Button>
                        </Link>

                        {/* EXISTING VIEW/HIDE BUTTON */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCourseExpand(course.courseId)}
                          className="text-blue-600 font-medium"
                        >
                          {expandedCourseId === course.courseId
                            ? "Hide"
                            : "View"}
                          {expandedCourseId === course.courseId ? (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Semesters */}
                  {expandedCourseId === course.courseId && (
                    <TableRow>
                      <TableCell colSpan={3} className="bg-gray-50/80 p-6">
                        <div className="space-y-4">
                          {course.semesters.map((semester) => (
                            <div
                              key={semester.semesterId}
                              className="border rounded-xl bg-white overflow-hidden shadow-sm"
                            >
                              <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  toggleSemesterExpand(semester.semesterId)
                                }
                              >
                                <span className="font-bold text-gray-700">
                                  {semester.semesterTitle}
                                </span>
                                <div className="flex items-center gap-4">
                                  <Badge className="bg-gray-100 text-gray-700">
                                    {semester.letterGrade ||
                                      `${semester.semesterPercentage}%`}
                                  </Badge>
                                  {expandedSemester === semester.semesterId ? (
                                    <ChevronDown size={18} />
                                  ) : (
                                    <ChevronRight size={18} />
                                  )}
                                </div>
                              </div>

                              {expandedSemester === semester.semesterId && (
                                <div className="p-4 border-t bg-gray-50/30 space-y-6">
                                  {semester.quarters.map((quarter) => (
                                    <div
                                      key={quarter.quarterId}
                                      className="space-y-2"
                                    >
                                      <div className="flex justify-between items-end border-b pb-2">
                                        <h4 className="font-bold text-sm text-blue-800">
                                          {quarter.quarterTitle}
                                        </h4>
                                        <div className="text-xs font-bold text-gray-500">
                                          SCORE:{" "}
                                          <span className="text-green-600">
                                            {quarter.grade}%
                                          </span>
                                        </div>
                                      </div>
                                      <AssessmentTable
                                        assessments={quarter.assessments}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}

              {(!gradeData.courses || gradeData.courses.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-12 text-gray-500"
                  >
                    No academic records found for this student.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
