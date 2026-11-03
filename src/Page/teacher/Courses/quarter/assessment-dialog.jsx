import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Loader, Settings } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditAssessmentDialog from "@/CustomComponent/CreateCourse/EditAssessment";
import AssessmentReminderDialog from "@/CustomComponent/Assessment/ReminderDialog";

function QuestionDisplay({ question, index }) {
  return (
    <article
      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
      aria-labelledby={`question-${question._id}-title`}
      role="article"
    >
      {question.type === "file" ? (
        <section aria-label={`File question ${index + 1}`}>
          <div className="font-medium text-gray-800 mb-3 flex gap-2 flex-col">
            <p className="text-xl font-bold">Instruction:</p>
            <p id={`question-${question._id}-title`} className="text-lg">
              {question?.question}
            </p>
          </div>

          <div className="text-sm text-gray-700 bg-green-50 p-2 rounded">
            {Array.isArray(question?.files) && question.files.length > 0 ? (
              question.files.map((file, i) => (
                <div key={file.url + i} className="mb-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-600 rounded p-1"
                    aria-label={`Open file ${file.filename} in a new tab`}
                  >
                    <FileText
                      size={20}
                      className="text-blue-500 mr-3"
                      aria-hidden
                    />
                    <span>{file.filename}</span>
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-700">No files attached.</p>
            )}
          </div>
        </section>
      ) : (
        <section aria-label={`Question ${index + 1}`}>
          <p className="text-xl font-bold">Question:</p>
          <div
            id={`question-${question._id}-title`}
            className="text-lg font-medium text-gray-800 mb-3"
            // keep rendering HTML if you need it — ensure content is sanitized upstream
            dangerouslySetInnerHTML={{ __html: `${question.question}` }}
            aria-live="polite"
          />
        </section>
      )}

      <div className="flex gap-1 flex-col mt-4">
        <h4 className="text-xl font-bold">Concept:</h4>
        <p className="text-gray-600 text-lg">
          {question.concept || "No concept provided."}
        </p>
      </div>

      {question.type === "mcq" && (
        <ul
          className="list-disc ml-5 text-sm text-gray-700 space-y-1 mt-3"
          role="list"
        >
          {question.options?.map((opt, i) => (
            <li
              key={i}
              className={
                question.correctAnswer === opt
                  ? "font-semibold text-green-600 bg-green-50 p-1 rounded"
                  : ""
              }
            >
              <span>{opt}</span>
              {question.correctAnswer === opt && (
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs"
                  aria-label="Correct answer"
                >
                  Correct
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}

      {question.type === "qa" && (
        <div
          className="text-sm text-gray-700 bg-green-50 p-2 rounded mt-3"
          aria-label="Answer"
        >
          <span className="font-semibold text-green-800">Answer:</span>{" "}
          <span>{question.correctAnswer ?? "No answer provided."}</span>
        </div>
      )}

      {question.type === "truefalse" && (
        <div
          className="text-sm text-gray-700 bg-green-50 p-2 rounded mt-3"
          aria-label="True or false answer"
        >
          <span className="font-semibold text-green-800">Answer:</span>{" "}
          <span>{question.correctAnswer === "true" ? "True" : "False"}</span>
        </div>
      )}
    </article>
  );
}

export function AssessmentPage() {
  const { assessmentid } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingReminder, setLoadingReminder] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // visible + accessible status

  const handleSendReminder = async () => {
    if (!assessment?._id) return;

    try {
      setLoadingReminder(true);
      const res = await axiosInstance.post(
        `/assessment/${assessment._id}/send-reminder`,
      );

      const { message, data } = res.data;

      // Keep console log for dev debugging
      console.log("📬 Reminder Details:", data);

      // Show both a visual status and a developer alert (you can remove alerts if you prefer)
      setStatusMessage({ type: "success", text: message || "Reminder sent." });
      alert(message || "Reminder sent.");

      // Build the student list message for debugging / quick view
      if (data?.enrolledStudents?.length) {
        const studentList = data.enrolledStudents
          .map((s) => `• ${s.name} (${s.email})`)
          .join("\n");
        // show developer alert; also set as status for screen readers
        alert(
          `Assessment ID: ${data.assessmentId}\n\nEnrolled Students:\n${studentList}`,
        );
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
      const errMsg = err?.response?.data?.message || "Failed to send reminder.";
      setStatusMessage({ type: "error", text: errMsg });
      alert(errMsg);
    } finally {
      setLoadingReminder(false);
    }
  };

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `assessment/assessmentforTeacher/${assessmentid}`,
      );
      setAssessment(res.data.assessment ?? null);
    } catch (err) {
      console.error(err);
      setAssessment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
    // clear status message on id change
    setStatusMessage(null);
  }, [assessmentid]);

  const questionsByType =
    assessment?.questions?.reduce((groups, question) => {
      const type = question.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push(question);
      return groups;
    }, {}) || {};

  if (loading) {
    return (
      <div
        className="flex justify-center items-center py-10"
        role="status"
        aria-live="polite"
      >
        <section className="flex justify-center items-center h-full w-full">
          <Loader
            className="animate-spin"
            aria-hidden={false}
            aria-label="Loading assessment"
          />
        </section>
      </div>
    );
  }

  if (assessment == null) {
    return (
      <div
        className="flex justify-center items-center py-10"
        role="status"
        aria-live="polite"
      >
        <section className="flex justify-center items-center h-full w-full">
          <p className="text-center text-gray-500">Assessments not found</p>
        </section>
      </div>
    );
  }

  // safe due date formatting
  const formattedDueDate = (() => {
    try {
      const dateStr = assessment?.dueDate?.date;
      const timeStr = assessment?.dueDate?.time;
      if (!dateStr) return "No due date";
      let dateObj;
      if (timeStr) {
        const datePart = new Date(dateStr).toISOString().split("T")[0];
        dateObj = new Date(`${datePart}T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`);
      } else {
        dateObj = new Date(dateStr);
      }
      return dateObj.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
      });
    } catch {
      return "Invalid date";
    }
  })();

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Accessible status region for actions like send reminder */}
      <div aria-live="polite" role="status" className="mb-4">
        {statusMessage && (
          <div
            className={`p-3 rounded ${
              statusMessage.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-3 focus:ring-2 focus:ring-blue-600"
        aria-label="Go back"
      >
        <ArrowLeft size={16} aria-hidden />
        <span>Back</span>
      </Button>

      <div className="mb-6 border-b pb-4 flex items-center justify-between">
        <section>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>{assessment?.title}</span>
            {assessment?.category?.name && (
              <Badge
                variant="outline"
                aria-label={`Category: ${assessment.category.name}`}
              >
                {assessment.category.name}
              </Badge>
            )}
          </h1>
          <div className="text-sm text-gray-500">
            <span className="sr-only">Due date:</span>
            <span aria-hidden>Due date:</span>{" "}
            <time dateTime={assessment?.dueDate?.date || ""}>
              {formattedDueDate}
            </time>
          </div>
        </section>

        <section className="flex items-center gap-2">
          <EditAssessmentDialog
            assessment={assessment}
            fetchAssessment={fetchAssessment}
          />

          <Button
            variant="primary"
            className="bg-blue-300 focus:ring-2 focus:ring-blue-600"
            disabled={loadingReminder}
            onClick={handleSendReminder}
            aria-disabled={loadingReminder}
            aria-label="Send reminder to enrolled students"
          >
            {loadingReminder ? (
              <>
                <Loader className="animate-spin mr-2" size={16} aria-hidden />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Reminder</span>
            )}
          </Button>

          <AssessmentReminderDialog assessmentId={assessment?._id} />
          <Button variant="primary" className="bg-blue-600 text-white" asChild>
            <Link
              to={`/teacher/courses/assessment/${assessment?._id}/setting?courseId=${assessment?.course}`}
            >
              <Settings className="mr-2" size={16} aria-hidden />
              Settings
            </Link>
          </Button>
        </section>
      </div>

      {assessment?.description && (
        <div
          className="bg-blue-50 p-4 rounded-lg mb-6"
          aria-label="Assessment description"
        >
          <h4 className="font-semibold text-blue-900 mb-2">Description</h4>
          <p className="text-sm text-blue-800">{assessment.description}</p>
        </div>
      )}

      <section aria-labelledby="questions-heading">
        <h4
          id="questions-heading"
          className="text-sm font-semibold text-gray-700 mb-3"
        >
          Questions
        </h4>

        {Array.isArray(assessment.questions) &&
        assessment.questions.length === 0 ? (
          <p className="text-sm text-gray-500">No questions found</p>
        ) : (
          <Accordion
            type="multiple"
            className="w-full"
            aria-label="Questions by type"
          >
            {["mcq", "qa", "truefalse", "file"].map((type) => {
              const group = questionsByType[type];
              if (!group || group.length === 0) return null;

              // unique ids for aria-controls / content
              const contentId = `accordion-content-${assessmentid}-${type}`;

              return (
                <AccordionItem key={type} value={type}>
                  {/* The AccordionTrigger should support forwarded props; we add aria-controls for better a11y */}
                  <AccordionTrigger
                    className="text-left text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    aria-controls={contentId}
                    aria-expanded={undefined} // if your AccordionTrigger supports expanded state, pass a boolean here
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{type.toUpperCase()}</Badge>
                      <span>({group.length} questions)</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent id={contentId} className="space-y-4">
                    {group.map((question, idx) => (
                      <QuestionDisplay
                        key={question._id ?? idx}
                        question={question}
                        index={idx}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>
    </div>
  );
}
