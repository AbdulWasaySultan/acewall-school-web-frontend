import { BookOpen, Trash2, FileText } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FinalCourseAssessmentCard({
  assessment,
  handleDeleteAssessment,
}) {
  if (!assessment) return null;

  const getQuestionTypeLabel = (type) => {
    const labels = {
      mcq: "Multiple Choice Questions",
      qa: "Question and Answer",
      truefalse: "True/False Questions",
    };
    return labels[type] || type.toUpperCase();
  };

  return (
    <Card className="mt-6">
      <CardHeader className="py-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50" role="status">
            Final {assessment?.category?.name || "Final Assessment"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="py-2">
        <div className="pl-4 border-l-2 border-green-400">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800">
              {assessment.title}
            </h3>

            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Assessment actions"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-gray-500 hover:text-blue-600"
                    aria-label={`View details for ${assessment.title}`}
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">View</span>
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-2xl max-h-[90vh] overflow-y-auto"
                  aria-describedby="assessment-details-description"
                >
                  <DialogHeader>
                    <DialogTitle id="assessment-details-title">
                      {assessment.title}
                    </DialogTitle>
                  </DialogHeader>

                  <div
                    id="assessment-details-description"
                    className="mt-2 space-y-4"
                  >
                    {assessment.files?.length > 0 && (
                      <section aria-labelledby="files-heading">
                        <h4
                          id="files-heading"
                          className="text-sm font-semibold text-gray-600 mb-2"
                        >
                          Files ({assessment.files.length})
                        </h4>
                        <div className="flex flex-wrap gap-2" role="list">
                          {assessment.files.map((file, i) => (
                            <a
                              key={file._id}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                              aria-label={`Download ${
                                file.filename || `PDF ${i + 1}`
                              }, opens in new tab`}
                              role="listitem"
                            >
                              <FileText
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                              {file.filename || `PDF ${i + 1}`}
                            </a>
                          ))}
                        </div>
                      </section>
                    )}

                    {assessment.questions?.length > 0 && (
                      <section aria-labelledby="questions-heading">
                        <h4 id="questions-heading" className="sr-only">
                          Assessment Questions
                        </h4>
                        <Accordion type="multiple" className="w-full">
                          {["mcq", "qa", "truefalse"].map((type) => {
                            const group = assessment.questions.filter(
                              (q) => q.type === type
                            );
                            if (group.length === 0) return null;

                            return (
                              <AccordionItem key={type} value={type}>
                                <AccordionTrigger
                                  className="text-left text-sm font-medium text-gray-700"
                                  aria-label={`${getQuestionTypeLabel(type)}, ${
                                    group.length
                                  } questions`}
                                >
                                  {getQuestionTypeLabel(type)} ({group.length})
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                  {group.map((q, idx) => (
                                    <article
                                      key={q._id}
                                      className="border border-gray-200 rounded-lg p-4"
                                      aria-labelledby={`question-${q._id}`}
                                    >
                                      <h5
                                        id={`question-${q._id}`}
                                        className="text-sm font-medium text-gray-800 mb-2"
                                      >
                                        <strong>Q{idx + 1}:</strong>{" "}
                                        {q.question}
                                      </h5>
                                      {type === "mcq" && (
                                        <ul
                                          className="list-disc ml-5 text-sm text-gray-700 space-y-1"
                                          aria-label="Answer options"
                                        >
                                          {q.options?.map((opt, i) => (
                                            <li
                                              key={i}
                                              className={
                                                q.correctAnswer ===
                                                (i + 1).toString()
                                                  ? "font-semibold text-green-700"
                                                  : ""
                                              }
                                              aria-current={
                                                q.correctAnswer ===
                                                (i + 1).toString()
                                                  ? "true"
                                                  : "false"
                                              }
                                            >
                                              {opt}
                                              {q.correctAnswer ===
                                                (i + 1).toString() && (
                                                <span
                                                  className="ml-1"
                                                  aria-label="This is the correct answer"
                                                >
                                                  (Correct)
                                                </span>
                                              )}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                      {type === "qa" && (
                                        <div className="text-sm text-gray-700">
                                          <span className="font-semibold">
                                            Answer:
                                          </span>{" "}
                                          {q.correctAnswer}
                                        </div>
                                      )}
                                      {type === "truefalse" && (
                                        <div className="text-sm text-gray-700">
                                          <span className="font-semibold">
                                            Answer:
                                          </span>{" "}
                                          {q.correctAnswer === "true"
                                            ? "True"
                                            : "False"}
                                        </div>
                                      )}
                                    </article>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </section>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-gray-500 hover:text-red-600"
                onClick={() => handleDeleteAssessment(assessment._id)}
                aria-label={`Delete ${assessment.title}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>

          {assessment.description && (
            <p className="text-xs text-gray-600 mt-1">
              {assessment.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
