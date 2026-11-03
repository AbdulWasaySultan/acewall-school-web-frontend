"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Loader, X } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import AssessmentResultCard from "@/CustomComponent/Assessment/AssessmentResultCard";
import { Input } from "@/components/ui/input";
import BackButton from "@/CustomComponent/BackButton";

const AssessmentSubmissionPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const navigate = useNavigate();

  // console.log(totalFileSize, "total file size");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const allowedTypes = [
      "application/pdf",
      ...["image/png", "image/jpeg", "image/jpg"].map(
        (type) => `image/${type}`
      ),
    ];

    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error(
        `${invalidFiles[0].name}: Only PDF and image files are allowed`
      );
      return;
    }

    const newTotalFileSize =
      totalFileSize + selectedFiles.reduce((sum, file) => sum + file.size, 0);

    if (newTotalFileSize > 5 * 1024 * 1024) {
      toast.error("Total file size must be less than 5MB");
      return;
    }

    setTotalFileSize(newTotalFileSize);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemove = (index) => {
    const newTotalFileSize = totalFileSize - files[index].size;
    setTotalFileSize(newTotalFileSize);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await axiosInstance.get(`/assessment/${id}`);
        setAssessment(res.data.assessment);

        // If there's already a submission, set it and mark as submitted
        if (res.data.submission) {
          setResult(res.data.submission);
          setSubmitted(true);
        }
      } catch (err) {
        setError("Failed to load assessment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  const createValidationSchema = (assessment) => {
    if (!assessment || !assessment.questions) return z.object({});
    const schemaShape = {};
    assessment.questions.forEach((question) => {
      const key = `question-${question._id}`;
      if (question.type === "mcq" || question.type === "truefalse") {
        schemaShape[key] = z.string().min(1, "Please select an answer");
      } else if (question.type === "qa") {
        schemaShape[key] = z.string().min(1, "Answer cannot be empty");
      }
    });
    return z.object(schemaShape);
  };

  const form = useForm({
    resolver: zodResolver(createValidationSchema(assessment)),
    defaultValues: { studentId: "" },
  });

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true); // ✅ Disable the button right away

    let answers;
    const formData = new FormData();

    if (assessment.assessmentType === "file") {
      if (files.length === 0) {
        toast.error("Please upload at least one file");
        setSubmitting(false); // Reset on error
        return;
      }

      files.forEach((file) => {
        formData.append("files", file);
      });

      const questionIds = assessment.questions.map((question) => question._id);
      formData.append("questionId", questionIds);
    } else {
      answers = assessment.questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: data[`question-${question._id}`],
      }));
    }

    try {
      const res = await axiosInstance.post(
        `/assessmentSubmission/submission/${assessment._id}`,
        assessment.assessmentType === "file" ? formData : { answers },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const submission = res.data.submission;
      const isGraded = submission.graded;

      setSubmitted(true);
      setResult(submission);

      if (isGraded) {
        toast.success("Assessment graded and submitted successfully!");
      } else {
        toast.success("Submission recorded. Awaiting manual review.");
      }

      navigate(`/student/assessment`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
      setSubmitting(false); // Reset on failure
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader
          aria-hidden="true"
          className="h-8 w-8 animate-spin text-primary"
        />
      </div>
    );
  }

  // Show error if assessment couldn't be loaded
  if (error && !assessment) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Show error if assessment not found
  if (!assessment && !result) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertDescription>Assessments not found</AlertDescription>
      </Alert>
    );
  }

  // Render the result card if we have a result
  if (submitted && result) {
    return <AssessmentResultCard submission={result} />;
  }

  return (
    <>
      <BackButton className="mb-10" />

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <section>
                {assessment.files && assessment.files.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 border rounded-lg w-40 p-4 ml-5">
                    <FileText aria-hidden="true" className="text-green-500" />
                    <span className="text-sm font-medium text-gray-800">
                      {assessment.files.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {file.filename}
                        </a>
                      ))}
                    </span>
                  </div>
                )}
              </section>
              <CardContent>
                <div className="space-y-6 ">
                  {assessment?.questions?.map((question, index) => (
                    <Card key={question._id} className="border shadow-sm">
                      <CardHeader className="">
                        <div className="flex justify-between items-start">
                          <CardTitle asChild className="text-base">
                            Question {index + 1}
                          </CardTitle>
                          <span className="text-sm text-muted-foreground">
                            Points: {question.points}
                          </span>
                        </div>
                        <p
                          className="text-sm font-medium text-gray-800 mb-2"
                          dangerouslySetInnerHTML={{
                            __html: ` ${question.question}`,
                          }}
                        />
                        <CardDescription className="text-base font-medium text-foreground mt-2">
                          {question.text}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {question.type === "mcq" && (
                          <FormField
                            control={form.control}
                            name={`question-${question._id}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    aria-labelledby={`question-${question._id}-label`}
                                    className="space-y-2"
                                  >
                                    {question.options.map(
                                      (option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center space-x-2"
                                        >
                                          <RadioGroupItem
                                            value={option}
                                            id={`q${question._id}-opt${optIndex}`}
                                          />
                                          <Label
                                            htmlFor={`q${question._id}-opt${optIndex}`}
                                          >
                                            {option}
                                          </Label>
                                        </div>
                                      )
                                    )}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {question.type === "truefalse" && (
                          <FormField
                            control={form.control}
                            name={`question-${question._id}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="space-y-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="true"
                                        id={`q${question._id}-true`}
                                      />
                                      <Label htmlFor={`q${question._id}-true`}>
                                        True
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="false"
                                        id={`q${question._id}-false`}
                                      />
                                      <Label htmlFor={`q${question._id}-false`}>
                                        False
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {question.type === "qa" && (
                          <FormField
                            control={form.control}
                            name={`question-${question._id}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder="Type your answer here..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        {question.type === "file" && (
                          <FormField
                            control={form.control}
                            name={`question-${question._id}`}
                            render={({ field }) => (
                              <FormItem>
                                {question.files.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 mb-1 border p-2 w-fit rounded-lg bg-blue-50"
                                  >
                                    <FileText
                                      aria-hidden="true"
                                      className="text-blue-500"
                                    />
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {file.filename}
                                    </a>
                                  </div>
                                ))}
                                <FormControl>
                                  <section>
                                    <label
                                      className="sr-only"
                                      htmlFor="assessment-files"
                                    >
                                      Upload your answer files
                                    </label>
                                    <Input
                                      id="assessment-files"
                                      type="file"
                                      multiple
                                      onChange={handleFileChange}
                                    />

                                    {files.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-4">
                                        {files.map((file, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-2 mb-1 border p-2 w-fit rounded-lg bg-blue-50"
                                          >
                                            <FileText
                                              aria-hidden="true"
                                              className="text-red-500"
                                            />
                                            <span>{file.name}</span>
                                            <button
                                              type="button"
                                              aria-label={`Remove file ${file.name}`}
                                              onClick={() =>
                                                handleRemove(index)
                                              }
                                              onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                handleRemove(index)
                                              }
                                            >
                                              <X size={16} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </section>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              {error && (
                <Alert variant="destructive" role="alert" className="mx-6 mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <CardFooter className="flex justify-end">
                {submitting && (
                  <span className="sr-only">Submitting assessment...</span>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  aria-disabled={submitting} // ADA: communicates disabled state
                  aria-busy={submitting} // ADA: indicates a task is in progress
                  aria-live="polite" // ADA: announces text changes to screen readers
                  className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                >
                  {submitting ? (
                    <>
                      <Loader
                        className="mr-2 h-4 w-4 animate-spin"
                        role="status"
                        aria-label="Submitting"
                      />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Assessment</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AssessmentSubmissionPage;
