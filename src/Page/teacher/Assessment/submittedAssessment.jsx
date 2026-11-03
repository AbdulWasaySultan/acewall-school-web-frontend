"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  FileText,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useParams } from "react-router-dom";
import avatar from "@/assets/avatar.png";
import { toast } from "sonner";

const AssessmentReview = () => {
  const { id } = useParams();
  const [manualGrades, setManualGrades] = useState({});
  const [totalCourseMarks, setTotalCourseMarks] = useState();
  const [submission, setSubmission] = useState(null);
  const [totalScore, setTotalScore] = useState(
    submission?.answers?.reduce(
      (total, answer) => total + (answer.pointsAwarded || 0),
      0
    )
  );
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingLoading, setFetchingLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      await axiosInstance
        .get(`/assessmentSubmission/submission/${id}`)
        .then((response) => {
          setSubmission(response.data.submission);
          console.log(response.data.submission, "submission data");

          setFetchingLoading(false);
        })

        .catch((error) => {
          console.error("Error fetching submission:", error);
          setFetchingLoading(false);
        });
    };
    fetchSubmission();
  }, [loading, id]);

  useEffect(() => {
    if (submission?.answers?.length > 0) {
      const totalMarks = submission.answers.reduce((sum, ans) => {
        return sum + (ans?.questionDetails?.points || 0);
      }, 0);

      setTotalCourseMarks(totalMarks);
    }
  }, [submission]);

  const handleGradeChange = (questionId, points, maxPoints) => {
    const newGrades = {
      ...manualGrades,
      [questionId]: {
        awardedPoints: Number(points),
        maxPoints: Number(maxPoints),
      },
    };
    setManualGrades(newGrades);

    const newTotal = submission.answers.reduce((total, answer) => {
      if (answer.requiresManualCheck) {
        return total + (newGrades[answer.questionId]?.awardedPoints || 0);
      }
      return total + (answer.pointsAwarded || 0);
    }, 0);

    setTotalScore(newTotal);
  };

  const handleSubmitGrades = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/assessmentSubmission/teacherGrading/${id}`,
        manualGrades,
        { params: { totalCourseMarks } }
      );
      console.log(response.data);

      toast.success("Grades submitted and student notified via email.");

      setManualGrades({});
      setError({});
      setSubmission(response.data.submission);
    } catch (error) {
      console.error("Error submitting grades:", error);
      toast.error("Failed to submit grades.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { hour12: true });
  };

  const manualCheckCount =
    submission?.answers?.filter((a) => a.requiresManualCheck).length || 0;
  const autoGradedCount =
    submission?.answers?.filter((a) => !a.requiresManualCheck).length || 0;

  if (fetchingLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-screen">
          <Loader
            className="animate-spin"
            role="status"
            aria-label="Loading submission details"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="w-full">
        {/* Header */}
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Student Info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                <AvatarImage
                  src={submission?.studentId?.profileImg?.url || avatar}
                  alt={`Profile picture of ${submission?.studentId?.firstName} ${submission?.studentId?.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback>
                  {submission?.studentId?.firstName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="text-lg font-semibold text-gray-800 flex gap-1">
                  <span>{submission?.studentId?.firstName}</span>
                  <span>{submission?.studentId?.lastName}</span>
                </div>
                <CardDescription>
                  {submission?.studentId?.email}
                </CardDescription>
              </div>
            </div>

            {/* Status & Date */}
            <div className="text-right space-y-1">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <Badge
                  variant={
                    submission?.status === "before due date"
                      ? "success"
                      : "destructive"
                  }
                  aria-label={`Submission status: ${submission?.status}`}
                >
                  {submission?.status}
                </Badge>
                <Badge
                  variant={submission?.graded ? "outline" : "secondary"}
                  aria-label={`Grading status: ${
                    submission?.graded ? "Graded" : "Needs Grading"
                  }`}
                >
                  {submission?.graded ? "Graded" : "Needs Grading"}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                <time dateTime={submission?.createdAt}>
                  Submitted on: {formatDate(submission?.createdAt)}
                </time>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-6 space-y-6">
          {/* Summary */}
          <section aria-labelledby="assessment-summary-heading">
            <h3
              id="assessment-summary-heading"
              className="text-lg font-semibold mb-2"
            >
              Assessment Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
              <div>
                <p className="text-sm text-muted-foreground">Assessment ID</p>
                <p className="font-medium">{submission?.assessment}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p
                  className="font-medium"
                  aria-label={`Total score: ${submission?.totalScore} points`}
                >
                  {submission?.totalScore} points
                </p>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList
              className="flex-wrap justify-start gap-2 mb-4"
              role="tablist"
              aria-label="Question filter tabs"
            >
              <TabsTrigger
                value="all"
                role="tab"
                aria-label={`All Questions, ${
                  submission?.answers?.length || 0
                } total`}
              >
                All Questions ({submission?.answers?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                role="tab"
                aria-label={`Questions needing grading, ${manualCheckCount} total`}
              >
                Needs Grading ({manualCheckCount})
              </TabsTrigger>
              <TabsTrigger
                value="auto"
                role="tab"
                aria-label={`Auto-graded questions, ${autoGradedCount} total`}
              >
                Graded ({autoGradedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" role="tabpanel" aria-label="All questions">
              <div className="space-y-6">
                {submission?.answers?.map((answer, index) => (
                  <QuestionCard
                    key={answer._id || index}
                    answer={answer}
                    index={index}
                    manualGrades={manualGrades}
                    onGradeChange={handleGradeChange}
                    setError={setError}
                    error={error}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="manual"
              role="tabpanel"
              aria-label="Questions requiring manual grading"
            >
              <div className="space-y-6">
                {submission?.answers
                  ?.filter((a) => a.requiresManualCheck)
                  .map((answer, index) => (
                    <QuestionCard
                      key={answer._id || index}
                      answer={answer}
                      index={index}
                      manualGrades={manualGrades}
                      onGradeChange={handleGradeChange}
                      setError={setError}
                      error={error}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent
              value="auto"
              role="tabpanel"
              aria-label="Auto-graded questions"
            >
              <div className="space-y-6">
                {submission?.answers
                  ?.filter((a) => !a.requiresManualCheck)
                  .map((answer, index) => (
                    <QuestionCard
                      key={answer._id || index}
                      answer={answer}
                      index={index}
                      manualGrades={manualGrades}
                      onGradeChange={handleGradeChange}
                      setError={setError}
                      error={error}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-4 border-t p-6">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            onClick={handleSubmitGrades}
            disabled={manualCheckCount === 0 || loading}
            aria-label="Submit all grades and notify student"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" aria-hidden="true" />
                <span>Submitting...</span>
              </>
            ) : (
              "Submit Grades"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const QuestionCard = ({
  answer,
  index,
  manualGrades,
  onGradeChange,
  setError = () => {},
  error = {},
}) => {
  const questionType = answer?.questionDetails?.type || "unknown";
  const maxPoints = answer?.questionDetails?.points || 0;

  const handleError = (questionId, message) => {
    setError((prevErrors) => {
      if (!message) {
        const { [questionId]: _, ...rest } = prevErrors;
        return rest;
      }
      return {
        ...prevErrors,
        [questionId]: message,
      };
    });
  };

  const getQuestionTypeLabel = () => {
    switch (questionType) {
      case "mcq":
        return "Multiple Choice";
      case "truefalse":
        return "True/False";
      case "qa":
        return "Question & Answer";
      case "file":
        return "File Upload";
      default:
        return "Unknown Type";
    }
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-gray-800">
              Question {index + 1}
            </CardTitle>
            <CardDescription className="capitalize text-sm text-gray-500">
              {getQuestionTypeLabel()}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            {answer?.requiresManualCheck ? (
              <Badge
                variant="warning"
                className="bg-yellow-100 text-yellow-800"
                aria-label="Status: Needs Manual Grading"
              >
                <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                Needs Manual Grading
              </Badge>
            ) : answer?.isCorrect ? (
              <Badge
                variant="success"
                className="bg-green-100 text-green-800"
                aria-label="Status: Answer is correct"
              >
                <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                Correct
              </Badge>
            ) : (
              <Badge
                variant="destructive"
                className="bg-red-100 text-red-800"
                aria-label="Status: Answer is incorrect"
              >
                <XCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                Incorrect
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-sm"
              aria-label={`Points awarded: ${
                answer?.pointsAwarded || 0
              } out of ${maxPoints}`}
            >
              {`${answer?.pointsAwarded || 0}/${maxPoints} pts`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        {answer.questionDetails?.type !== "file" ? (
          <section aria-labelledby={`question-${index}-text`}>
            <h4
              id={`question-${index}-text`}
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Question:
            </h4>
            <div
              className="p-3 rounded-md bg-gray-50 border text-sm text-gray-800"
              dangerouslySetInnerHTML={{
                __html:
                  answer?.questionDetails?.question || "<i>No question</i>",
              }}
              role="region"
              aria-label="Question text"
            />
          </section>
        ) : (
          <div className="space-y-2">
            <section aria-labelledby={`instruction-${index}`}>
              <h4
                id={`instruction-${index}`}
                className="font-medium text-sm text-gray-700 mb-1"
              >
                Instruction:
              </h4>
              <div
                className="p-3 rounded-md bg-gray-50 border text-sm text-gray-800"
                dangerouslySetInnerHTML={{
                  __html:
                    answer?.questionDetails?.question ||
                    "<i>No instruction</i>",
                }}
                role="region"
                aria-label="Instruction text"
              />
            </section>

            <section aria-labelledby={`files-${index}`}>
              <h4
                id={`files-${index}`}
                className="font-medium text-sm text-gray-700 mb-1"
              >
                Files:
              </h4>
              <div className="p-3 rounded-md bg-gray-50 border text-sm text-gray-800">
                <ul className="flex flex-wrap items-center gap-3" role="list">
                  {answer?.questionDetails?.file?.map((file, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <FileText
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                      />
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                        aria-label={`Download file: ${file.filename}`}
                      >
                        {file.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* Answer */}
        <section aria-labelledby={`answer-${index}`}>
          <h4
            id={`answer-${index}`}
            className="font-medium text-sm text-gray-700 mb-1"
          >
            Student's Answer:
          </h4>
          <div className="p-3 rounded-md bg-gray-50 border text-sm text-gray-800">
            {questionType === "truefalse" ? (
              <span className="font-semibold">
                {answer?.selectedAnswer === "true" ? "True" : "False"}
              </span>
            ) : questionType === "mcq" ? (
              <span className="font-semibold">
                Option: {answer?.selectedAnswer}
              </span>
            ) : questionType === "file" ? (
              <ul className="flex flex-wrap items-center gap-3" role="list">
                {answer?.file?.map((file, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <FileText
                      className="h-4 w-4 text-gray-500"
                      aria-hidden="true"
                    />
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      aria-label={`View submitted file: ${file.filename}`}
                    >
                      {file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: answer?.selectedAnswer || "<i>No answer provided</i>",
                }}
                role="region"
                aria-label="Student answer text"
              />
            )}
          </div>
        </section>

        {/* Manual Grading */}
        {answer.requiresManualCheck && (
          <section aria-labelledby={`grading-${index}`}>
            <h4
              id={`grading-${index}`}
              className="font-medium text-sm text-gray-700 mb-1"
            >
              Assign Points:
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor={`points-input-${answer?.questionId}`}
                className="sr-only"
              >
                Enter points for question {index + 1}, maximum {maxPoints}{" "}
                points
              </label>
              <Input
                id={`points-input-${answer?.questionId}`}
                type="number"
                min="0"
                max={maxPoints}
                value={manualGrades[answer?.questionId]?.awardedPoints || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value > maxPoints) {
                    handleError(
                      answer?.questionId,
                      `Points cannot exceed ${maxPoints}`
                    );
                    return;
                  } else if (value < 0) {
                    handleError(
                      answer?.questionId,
                      `Points cannot be negative`
                    );
                    return;
                  } else {
                    handleError(answer?.questionId, null);
                  }

                  onGradeChange(answer?.questionId, value, maxPoints);
                }}
                className="w-24 focus:ring-2 focus:ring-blue-400"
                aria-required="true"
                aria-invalid={!!error?.[answer?.questionId]}
                aria-describedby={
                  error?.[answer?.questionId]
                    ? `error-${answer?.questionId}`
                    : `points-max-${answer?.questionId}`
                }
              />
              <span
                id={`points-max-${answer?.questionId}`}
                className="text-sm text-muted-foreground"
              >
                / {maxPoints} pts
              </span>

              {error?.[answer?.questionId] && (
                <p
                  id={`error-${answer?.questionId}`}
                  className="text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {error[answer?.questionId]}
                </p>
              )}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentReview;
