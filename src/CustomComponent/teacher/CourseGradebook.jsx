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
import { ChevronDown, ChevronRight, Loader } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CourseGradebook = ({ title }) => {
  const { courseId } = useParams();
  const [gradebook, setGradebook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [semesterExpanded, setSemesterExpanded] = useState({});
  const [quarterExpanded, setQuarterExpanded] = useState({});
  const [gradingSystem, setGradingSystem] = useState("");
  const [emptyGrade, setEmptyGrade] = useState(false);

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        const res = await axiosInstance.get(
          `gradebook/getGradebooksOfCourseFormatted/${courseId}`
        );
        setGradebook(res.data.gradebook);
        setGradingSystem(res.data.gradingSystem);
        setLoading(false);
        if (!res.data.gradebook.length) {
          setEmptyGrade(true);
        }
      } catch (error) {
        console.error("Failed to fetch gradebook", error);
        setLoading(false);
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

      {loading ? (
        <div className="flex justify-center items-center" aria-live="polite">
          <Loader className="animate-spin" />
          <span className="sr-only">Loading gradebook...</span>
        </div>
      ) : emptyGrade ? (
        <Alert severity="info" aria-live="polite">
          <AlertDescription>No Gradebook Available</AlertDescription>
        </Alert>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-4" />
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Final percentage</TableHead>
                {gradingSystem === "normalGrading" ? (
                  <>
                    <TableHead className="text-center">Letter Grade</TableHead>
                    <TableHead className="text-center">GPA</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="text-center">Points</TableHead>
                    <TableHead className="text-center">Remarks</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradebook?.map((student, index) => (
                <Fragment key={`${student.studentId}-${index}`}>
                  <TableRow>
                    <TableCell className="w-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpand(student.studentId)}
                        aria-expanded={expanded[student.studentId] || false}
                        aria-controls={`student-${student.studentId}-details`}
                        aria-label={`Toggle details for ${student.studentName}`}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      {student.finalGrade || student.standardGrade.finalGrade}%
                    </TableCell>
                    {gradingSystem === "normalGrading" ? (
                      <>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {student.letterGrade}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {student.gpa}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {student.standardGrade.points}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {student.standardGrade.remarks}
                        </TableCell>
                      </>
                    )}
                  </TableRow>

                  {expanded[student.studentId] && (
                    <TableRow id={`student-${student.studentId}-details`}>
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
                                  aria-controls={`semester-${semester.semesterId}-details`}
                                  aria-label={`Toggle ${semester.semesterTitle} details for ${student.studentName}`}
                                  className="p-1 h-6 w-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                  id={`semester-${semester.semesterId}-details`}
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
                                          aria-controls={`quarter-${quarter.quarterId}-details`}
                                          aria-label={`Toggle ${quarter.quarterTitle} details for ${student.studentName}`}
                                          className="p-1 h-5 w-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            {quarter.grade ||
                                              quarter.standardGrade.grade}
                                            %
                                          </span>
                                          {gradingSystem ===
                                          "StandardGrading" ? (
                                            <>
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                {quarter.standardGrade.points}
                                              </span>
                                              <span className="text-sm font-medium">
                                                {quarter.standardGrade.remarks}
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {quarter.letterGrade}
                                              </span>
                                              <span className="text-sm text-muted-foreground">
                                                GPA: {quarter.gpa}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      {quarterExpanded[
                                        `${student.studentId}-${semester.semesterId}-${quarter.quarterId}`
                                      ] && (
                                        <div
                                          id={`quarter-${quarter.quarterId}-details`}
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
      )}
    </Card>
  );
};

export default CourseGradebook;
