"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader,
  Download,
  BarChart2,
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
              Topics{" "}
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
                  <Badge variant="outline" className="text-xs">
                    {assessment.category || "Uncategorized"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {assessment.studentPoints != null
                    ? assessment.studentPoints
                    : "Pending"}
                </TableCell>
                <TableCell>
                  {assessment.maxPoints != null
                    ? assessment.maxPoints
                    : "Pending"}
                </TableCell>
                <TableCell>
                  {percentage === "Pending" ? (
                    <span className="text-gray-500 italic">Pending</span>
                  ) : (
                    <span
                      className={`font-medium ${
                        parseFloat(percentage) >= 90
                          ? "text-green-600"
                          : parseFloat(percentage) >= 80
                            ? "text-blue-600"
                            : parseFloat(percentage) >= 70
                              ? "text-yellow-600"
                              : parseFloat(percentage) >= 60
                                ? "text-orange-600"
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
  if (["A", "A-", "A+"].includes(letterGrade)) {
    return "bg-green-100 text-green-800";
  } else if (["B", "B-", "B+"].includes(letterGrade)) {
    return "bg-blue-100 text-blue-800";
  } else if (["C", "C-", "C+"].includes(letterGrade)) {
    return "bg-yellow-100 text-yellow-800";
  } else if (["D", "D-", "D+"].includes(letterGrade)) {
    return "bg-orange-100 text-orange-800";
  } else {
    return "bg-red-100 text-red-800";
  }
};

// 📘 Main Component
export default function Gradebook() {
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [coursesPerPage] = useState(5);

  const fetchGradeData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `gradebook/getStudentGradebooksFormatted`,
      );
      setGradeData(res.data);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalCourses(res.data.totalCourses);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGradeData(currentPage);
  }, [currentPage]);

  const toggleCourseExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
    setExpandedSemester(null);
  };

  const toggleSemesterExpand = (semesterId) => {
    setExpandedSemester(expandedSemester === semesterId ? null : semesterId);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setExpandedCourseId(null);
      setExpandedSemester(null);
    }
  };

  const handlePreviousPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  if (loading) {
    return (
      <div className="justify-center items-center flex h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <h1 className="text-2xl font-bold">Student Grade Report</h1>
        <Alert variant="destructive">
          <AlertDescription>Error loading grade data: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!gradeData) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <h1 className="text-2xl font-bold">Student Grade Report</h1>
        <Alert>
          <AlertDescription>No grade data available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Grade Report</h1>
      </div>

      {/* Overall GPA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">
            Overall Academic Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* {gradeData.overallGPA ? (
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {gradeData.overallGPA === 0
                    ? "__"
                    : gradeData.overallGPA !== null &&
                      gradeData.overallGPA !== undefined
                    ? gradeData.overallGPA.toFixed(2)
                    : "--"}
                </div>
                <div className="text-sm text-muted-foreground">Overall GPA</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {gradeData.overallGPA === 0
                    ? "__"
                    : gradeData.overallGPA !== null &&
                      gradeData.overallGPA !== undefined
                    ? gradeData.overallGPA.toFixed(2)
                    : "--"}
                </div>
                <div className="text-sm text-muted-foreground">Overall Points</div>
              </div>
            )} */}

            <div>
              <div className="text-2xl font-bold text-blue-600">
                {totalCourses}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Course{totalCourses !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Details</CardTitle>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Semesters</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeData.courses.map((course) => (
                  <>
                    <TableRow key={course.courseId}>
                      <TableCell className="font-medium">
                        {course.courseName}
                      </TableCell>
                      <TableCell>
                        {course.semesters.length} semester
                        {course.semesters.length !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2"></div>
                        <Link to={`/student/analytics/${course.courseId}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            aria-label={`View analytics for ${course.courseName}`}
                          >
                            <BarChart2 className="h-4 w-4" />
                            Analytics
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-expanded={expandedCourseId === course.courseId}
                          aria-controls={`course-details-${course.courseId}`}
                          onClick={() => toggleCourseExpand(course.courseId)}
                          className="flex items-center gap-2"
                        >
                          {expandedCourseId === course.courseId ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          {expandedCourseId === course.courseId
                            ? "Hide"
                            : "Show"}{" "}
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedCourseId === course.courseId && (
                      <TableRow>
                        <TableCell colSpan={3} className="p-0">
                          <div className="bg-muted/30 p-6 space-y-4">
                            {course.semesters.map((semester) => (
                              <div
                                key={semester.semesterId}
                                className="space-y-3"
                                id={`semester-${semester.semesterId}`}
                                role="region"
                                aria-labelledby={`semester-title-${semester.semesterId}`}
                              >
                                <div className="flex items-center justify-between">
                                  <h3
                                    className="text-lg font-semibold text-gray-800"
                                    id={`semester-title-${semester.semesterId}`}
                                  >
                                    {semester.semesterTitle}
                                  </h3>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      toggleSemesterExpand(semester.semesterId)
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    {expandedSemester ===
                                    semester.semesterId ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    {semester.quarters.length} Quarter
                                    {semester.quarters.length !== 1 ? "s" : ""}
                                  </Button>
                                </div>

                                {expandedSemester === semester.semesterId && (
                                  <div className="space-y-4">
                                    {semester.quarters.map((quarter) => (
                                      <Card
                                        key={quarter.quarterId}
                                        className="bg-white"
                                      >
                                        <CardHeader className="pb-3">
                                          <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">
                                              {quarter.quarterTitle}
                                            </CardTitle>
                                            <div className="flex items-center gap-4">
                                              <div className="flex items-center gap-4">
                                                <div className="text-sm">
                                                  <span className="font-medium">
                                                    Percentage:{" "}
                                                  </span>
                                                  <span className="text-green-600 font-bold">
                                                    {quarter.grade === 0
                                                      ? "Pending"
                                                      : quarter.grade != null
                                                        ? `${quarter.grade}%`
                                                        : "__"}
                                                  </span>
                                                </div>
                                              </div>
                                              {course.gradingSystem ===
                                              "normalGrading" ? (
                                                <div className="flex items-center gap-2">
                                                  <div className="text-sm">
                                                    <span className="font-medium">
                                                      GPA:{" "}
                                                    </span>
                                                    <span className="text-blue-600 font-bold">
                                                      {quarter.gpa === 0
                                                        ? "Pending"
                                                        : quarter.gpa}
                                                    </span>
                                                  </div>
                                                  <Badge
                                                    className={`${getLetterGradeColor(
                                                      quarter.letterGrade,
                                                    )}`}
                                                  >
                                                    {quarter.letterGrade ||
                                                      "N/A"}
                                                  </Badge>
                                                </div>
                                              ) : (
                                                <section className="flex items-center gap-4">
                                                  <div className="flex items-center gap-2">
                                                    <div className="text-sm">
                                                      <span className="font-medium">
                                                        Points:{" "}
                                                      </span>
                                                      <span className="text-blue-600 font-bold">
                                                        {quarter.standardGrade
                                                          ?.grade || "Pending"}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="flex items-center gap-2">
                                                    <div className="text-sm">
                                                      <span className="font-medium">
                                                        remark:{" "}
                                                      </span>
                                                      <span className="text-blue-600 font-bold">
                                                        {quarter.standardGrade
                                                          ?.remark || "Pending"}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </section>
                                              )}
                                            </div>
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <AssessmentTable
                                            assessments={quarter.assessments}
                                          />
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}

                {gradeData.courses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      you haven't perform any assessment
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * coursesPerPage + 1} to{" "}
                {Math.min(currentPage * coursesPerPage, totalCourses)} of{" "}
                {totalCourses} courses
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
