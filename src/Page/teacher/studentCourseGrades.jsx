"use client";

import { axiosInstance } from "@/lib/AxiosInstance";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentCourseGrades = () => {
  const { studentId, courseId } = useParams();
  const [gradeData, setGradeData] = useState(null);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [expandedSemesters, setExpandedSemesters] = useState(new Set());
  const [expandedQuarters, setExpandedQuarters] = useState(new Set());

  /** ACCESSIBLE TOGGLE CLICK + KEYBOARD SUPPORT **/
  const handleToggle = (callback, id) => (e) => {
    if (e.type === "click" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback(id);
    }
  };

  const toggleSubjectExpand = (courseId) => {
    setExpandedSubjectId((prev) => (prev === courseId ? null : courseId));
  };

  const toggleSemesterExpand = (semesterId) => {
    const newExpanded = new Set(expandedSemesters);
    newExpanded.has(semesterId)
      ? newExpanded.delete(semesterId)
      : newExpanded.add(semesterId);
    setExpandedSemesters(newExpanded);
  };

  const toggleQuarterExpand = (quarterId) => {
    const newExpanded = new Set(expandedQuarters);
    newExpanded.has(quarterId)
      ? newExpanded.delete(quarterId)
      : newExpanded.add(quarterId);
    setExpandedQuarters(newExpanded);
  };

  const groupAssessmentsByCategory = (assessments) => {
    const grouped = {};
    assessments.forEach((assessment) => {
      const category = assessment.category || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(assessment);
    });
    return grouped;
  };

  useEffect(() => {
    const fetchStudentGradeforCourse = async () => {
      try {
        const res = await axiosInstance.get(
          `gradebook/getGradebook/${studentId}/${courseId}`,
        );
        setGradeData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStudentGradeforCourse();
  }, [studentId, courseId]);

  const tableHead = ["Course", "Average", "Grade"];

  if (!gradeData) {
    return (
      <div className="p-4" role="status" aria-live="polite">
        Loading student grades...
      </div>
    );
  }

  return (
    <div role="region" aria-label="Student Course Grades">
      <div className="mb-6 p-4 bg-white shadow-md rounded-2xl">
        <h2 className="font-extrabold text-2xl text-gray-800 mb-2">
          {gradeData?.course?.courseTitle}
        </h2>
        <Link to={`/teacher/analytics/${courseId}/${studentId}`}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <BarChart2 className="h-4 w-4" />
            View Analytics
          </Button>
        </Link>
        {gradeData?.course?.thumbnail?.url && (
          <div className="overflow-hidden rounded-lg flex justify-center">
            <img
              src={gradeData.course.thumbnail.url || "/placeholder.svg"}
              alt={`${gradeData.course.courseTitle} Course Thumbnail`}
              className="w-[300px] h-auto object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        {gradeData?.course?.courseDescription && (
          <p className="text-gray-600 mt-4 leading-relaxed">
            {gradeData.course.courseDescription}
          </p>
        )}
      </div>

      <div className="rounded-md border">
        <Table role="table">
          <TableHeader>
            <TableRow>
              {tableHead.map((item, idx) => (
                <TableHead key={idx}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* MAIN COURSE ROW */}
            <TableRow className="text-xs md:text-sm">
              <TableCell className="font-medium">
                <button
                  onClick={handleToggle(toggleSubjectExpand, courseId)}
                  onKeyDown={handleToggle(toggleSubjectExpand, courseId)}
                  aria-expanded={expandedSubjectId === courseId}
                  aria-controls={`subject-${courseId}`}
                  className="cursor-pointer flex items-center gap-2 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                >
                  {expandedSubjectId === courseId ? (
                    <ChevronDown aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                  )}
                  <span>{gradeData?.courseName}</span>
                </button>
              </TableCell>

              <TableCell>{gradeData?.grade?.toFixed(2)}%</TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    gradeData?.letterGrade?.startsWith("A")
                      ? "bg-green-100 text-green-800"
                      : gradeData?.letterGrade?.startsWith("B")
                        ? "bg-blue-100 text-blue-800"
                        : gradeData?.letterGrade?.startsWith("C")
                          ? "bg-yellow-100 text-yellow-800"
                          : gradeData?.letterGrade?.startsWith("D")
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {gradeData?.letterGrade}
                </span>
              </TableCell>
            </TableRow>

            {/* EXPANDED SUBJECT */}
            {expandedSubjectId === courseId && (
              <TableRow id={`subject-${courseId}`} className="bg-muted/50">
                <TableCell colSpan={3} className="p-0">
                  <div className="p-4 space-y-6">
                    {gradeData?.semesters?.map((semester) => (
                      <div key={semester.semesterId} className="space-y-4">
                        {/* SEMESTER HEADER */}
                        <button
                          onClick={handleToggle(
                            toggleSemesterExpand,
                            semester.semesterId,
                          )}
                          onKeyDown={handleToggle(
                            toggleSemesterExpand,
                            semester.semesterId,
                          )}
                          aria-expanded={expandedSemesters.has(
                            semester.semesterId,
                          )}
                          aria-controls={`semester-${semester.semesterId}`}
                          className="cursor-pointer flex items-center gap-2 font-medium text-lg hover:text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                        >
                          {expandedSemesters.has(semester.semesterId) ? (
                            <ChevronDown
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          ) : (
                            <ChevronRight
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          )}
                          <span>{semester.semesterTitle}</span>
                        </button>

                        {/* SEMESTER CONTENT */}
                        {expandedSemesters.has(semester.semesterId) && (
                          <div
                            id={`semester-${semester.semesterId}`}
                            className="ml-6 space-y-4"
                          >
                            {semester.quarters?.map((quarter) => (
                              <div
                                key={quarter.quarterId}
                                className="space-y-2"
                              >
                                {/* QUARTER HEADER */}
                                <button
                                  onClick={handleToggle(
                                    toggleQuarterExpand,
                                    quarter.quarterId,
                                  )}
                                  onKeyDown={handleToggle(
                                    toggleQuarterExpand,
                                    quarter.quarterId,
                                  )}
                                  aria-expanded={expandedQuarters.has(
                                    quarter.quarterId,
                                  )}
                                  aria-controls={`quarter-${quarter.quarterId}`}
                                  className="cursor-pointer flex items-center gap-2 font-medium hover:text-green-600 focus:ring-2 focus:ring-green-500 rounded"
                                >
                                  {expandedQuarters.has(quarter.quarterId) ? (
                                    <ChevronDown
                                      aria-hidden="true"
                                      className="h-4 w-4"
                                    />
                                  ) : (
                                    <ChevronRight
                                      aria-hidden="true"
                                      className="h-4 w-4"
                                    />
                                  )}
                                  <span>{quarter.quarterTitle}</span>
                                </button>

                                {/* QUARTER CONTENT */}
                                {expandedQuarters.has(quarter.quarterId) && (
                                  <div
                                    id={`quarter-${quarter.quarterId}`}
                                    className="ml-6"
                                  >
                                    {Object.entries(
                                      groupAssessmentsByCategory(
                                        quarter.assessments || [],
                                      ),
                                    ).map(([category, assessments]) => (
                                      <AssessmentTable
                                        key={`${quarter.quarterId}-${category}`}
                                        title={category}
                                        items={assessments}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {(!gradeData?.semesters ||
                      gradeData.semesters.length === 0) && (
                      <div className="text-center py-6 text-gray-500">
                        No assessments found for this course.
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const AssessmentTable = ({ title, items = [] }) => {
  if (!items.length) {
    return (
      <div
        className="text-sm text-gray-500 italic mb-4"
        role="note"
        aria-label={`No ${title} assessments available`}
      >
        No {title.toLowerCase()} available
      </div>
    );
  }

  return (
    <div
      className="space-y-2 mb-6"
      role="region"
      aria-label={`${title} assessments`}
    >
      <h4 className="font-medium text-sm text-gray-700">{title}</h4>

      <div className="border rounded-lg overflow-hidden">
        <Table role="table">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Assessment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Max Points</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, index) => {
              const percentage =
                item.maxPoints > 0
                  ? ((item.studentPoints / item.maxPoints) * 100).toFixed(1)
                  : 0;

              return (
                <TableRow key={`${item.assessmentId}-${index}`}>
                  <TableCell className="font-medium">
                    {item.assessmentTitle}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.studentPoints}</TableCell>
                  <TableCell>{item.maxPoints}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        percentage >= 90
                          ? "bg-green-100 text-green-800"
                          : percentage >= 80
                            ? "bg-blue-100 text-blue-800"
                            : percentage >= 70
                              ? "bg-yellow-100 text-yellow-800"
                              : percentage >= 60
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentCourseGrades;
