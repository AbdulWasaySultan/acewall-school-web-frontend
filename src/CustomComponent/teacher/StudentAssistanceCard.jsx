"use client";

import { useEffect, useState, Fragment } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useParams } from "react-router-dom";

const StudentAssistanceCard = ({ title }) => {
  const { courseId } = useParams();
  const [gradebook, setGradebook] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [semesterExpanded, setSemesterExpanded] = useState({});
  const [quarterExpanded, setQuarterExpanded] = useState({});

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        const { data } = await axiosInstance.get(
          `gradebook/course/${courseId}`
        );
        setGradebook(data.gradebook);
      } catch (error) {
        console.error("Failed to fetch gradebook", error);
      }
    };
    fetchGradebook();
  }, [courseId]);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSemesterExpand = (studentId, semesterId) => {
    const key = `${studentId}-${semesterId}`;
    setSemesterExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleQuarterExpand = (studentId, semesterId, quarterId) => {
    const key = `${studentId}-${semesterId}-${quarterId}`;
    setQuarterExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="p-6 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-4" />
              <TableHead>Student</TableHead>
              <TableHead className="text-center">Final Grade</TableHead>
              <TableHead className="text-center">Letter Grade</TableHead>
              <TableHead className="text-center">GPA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradebook
              ?.filter((student) => student.finalGrade < 70)
              .map((student) => (
                <Fragment key={student.studentId}>
                  <TableRow>
                    <TableCell className="w-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpand(student.studentId)}
                        aria-expanded={expanded[student.studentId] || false}
                        aria-controls={`student-details-${student.studentId}`}
                        aria-label={
                          expanded[student.studentId]
                            ? `Collapse details for ${student.studentName}`
                            : `Expand details for ${student.studentName}`
                        }
                      >
                        {expanded[student.studentId] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.studentName}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {student.finalGrade}%
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.letterGrade}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {student.gpa}
                    </TableCell>
                  </TableRow>

                  {expanded[student.studentId] && (
                    <TableRow id={`student-details-${student.studentId}`}>
                      <TableCell colSpan={5} className="bg-muted/20 px-6 py-4">
                        <div className="space-y-4">
                          <p className="text-sm font-medium text-muted-foreground mb-3">
                            Academic Performance Breakdown
                          </p>

                          {student?.semesters?.map((semester) => (
                            <div
                              key={semester.semesterId}
                              className="border rounded-lg p-4 bg-white"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleSemesterExpand(
                                      student.studentId,
                                      semester.semesterId
                                    )
                                  }
                                  aria-expanded={
                                    semesterExpanded[
                                      `${student.studentId}-${semester.semesterId}`
                                    ] || false
                                  }
                                  aria-controls={`semester-details-${student.studentId}-${semester.semesterId}`}
                                  aria-label={
                                    semesterExpanded[
                                      `${student.studentId}-${semester.semesterId}`
                                    ]
                                      ? `Collapse ${semester.semesterTitle}`
                                      : `Expand ${semester.semesterTitle}`
                                  }
                                >
                                  {semesterExpanded[
                                    `${student.studentId}-${semester.semesterId}`
                                  ] ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </Button>
                                <h4 className="font-semibold text-lg">
                                  {semester.semesterTitle}
                                </h4>
                              </div>

                              {semesterExpanded[
                                `${student.studentId}-${semester.semesterId}`
                              ] && (
                                <div
                                  id={`semester-details-${student.studentId}-${semester.semesterId}`}
                                  className="ml-6 space-y-3"
                                >
                                  {semester?.quarters?.map((quarter) => (
                                    <div
                                      key={quarter.quarterId}
                                      className="border-l-2 border-gray-200 pl-4"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            toggleQuarterExpand(
                                              student.studentId,
                                              semester.semesterId,
                                              quarter.quarterId
                                            )
                                          }
                                          aria-expanded={
                                            quarterExpanded[
                                              `${student.studentId}-${semester.semesterId}-${quarter.quarterId}`
                                            ] || false
                                          }
                                          aria-controls={`quarter-details-${student.studentId}-${semester.semesterId}-${quarter.quarterId}`}
                                          aria-label={
                                            quarterExpanded[
                                              `${student.studentId}-${semester.semesterId}-${quarter.quarterId}`
                                            ]
                                              ? `Collapse ${quarter.quarterTitle}`
                                              : `Expand ${quarter.quarterTitle}`
                                          }
                                        >
                                          {quarterExpanded[
                                            `${student.studentId}-${semester.semesterId}-${quarter.quarterId}`
                                          ] ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                        </Button>
                                        <h5 className="font-medium">
                                          {quarter.quarterTitle}
                                        </h5>
                                        <div className="flex items-center gap-2 ml-auto">
                                          <span className="text-sm font-medium">
                                            {quarter.grade}%
                                          </span>
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {quarter.letterGrade}
                                          </span>
                                          <span className="text-sm text-muted-foreground">
                                            GPA: {quarter.gpa}
                                          </span>
                                        </div>
                                      </div>

                                      {quarterExpanded[
                                        `${student.studentId}-${semester.semesterId}-${quarter.quarterId}`
                                      ] && (
                                        <div
                                          id={`quarter-details-${student.studentId}-${semester.semesterId}-${quarter.quarterId}`}
                                          className="mt-3"
                                        >
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead className="text-xs">
                                                  Assessment
                                                </TableHead>
                                                <TableHead className="text-xs">
                                                  Category
                                                </TableHead>
                                                <TableHead className="text-center text-xs">
                                                  Score
                                                </TableHead>
                                                <TableHead className="text-center text-xs">
                                                  Percentage
                                                </TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {quarter?.assessments?.map(
                                                (assessment) => (
                                                  <TableRow
                                                    key={
                                                      assessment.assessmentId
                                                    }
                                                  >
                                                    <TableCell className="text-sm">
                                                      {
                                                        assessment.assessmentTitle
                                                      }
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {assessment.category}
                                                      </span>
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm font-medium">
                                                      {assessment.studentPoints}
                                                      /{assessment.maxPoints}
                                                    </TableCell>
                                                    <TableCell className="text-center text-sm">
                                                      {assessment.maxPoints > 0
                                                        ? `${(
                                                            (assessment.studentPoints /
                                                              assessment.maxPoints) *
                                                            100
                                                          ).toFixed(1)}%`
                                                        : "N/A"}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      )}
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
                </Fragment>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentAssistanceCard;
