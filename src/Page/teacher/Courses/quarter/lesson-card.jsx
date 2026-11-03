"use client";

import { useState, useId } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Youtube,
  Link2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  File,
} from "lucide-react";
import { Link } from "react-router-dom";
import EditLessonModal from "@/CustomComponent/CreateCourse/EditLesson";
import { AssessmentCard } from "./assessment-card";
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal";

export function LessonCard({
  lesson,
  lessonIndex,
  courseId,
  quarterStartDate,
  quarterEndDate,
  semesterId,
  quarterId,
  onDelete,
  onDeleteAssessment,
  fetchQuarterDetail,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardId = useId();
  const triggerId = useId();
  const contentId = useId();
  const descriptionId = useId();
  const resourcesId = useId();
  const assessmentsId = useId();

  const lessonNumber = lessonIndex + 1;
  const hasPdfs = lesson.pdfFiles && lesson.pdfFiles.length > 0;
  const hasYoutube = !!lesson.youtubeLinks;
  const hasOtherLink = !!lesson.otherLink;
  const hasResources = hasPdfs || hasYoutube || hasOtherLink;
  const hasAssessments =
    lesson.lesson_assessments && lesson.lesson_assessments.length > 0;

  const handleToggleExpand = (e) => {
    if (e) e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      id={cardId}
      className="overflow-hidden shadow-sm border-l-4 border-l-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
    >
      {/* Header / Trigger */}
      <button
        id={triggerId}
        className="w-full flex justify-between items-center p-4 text-left cursor-pointer hover:bg-gray-100 focus:bg-gray-50 focus:outline-none transition-colors group"
        onClick={() => handleToggleExpand()}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-label={`${
          isExpanded ? "Collapse" : "Expand"
        } lesson ${lessonNumber}: ${lesson.title}`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 font-semibold flex-shrink-0"
            aria-label={`Lesson ${lessonNumber}`}
          >
            L {lessonNumber}
          </Badge>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {lesson.title}
            </h3>
            {lesson.description && (
              <p className="text-xs text-gray-500 truncate">
                {lesson.description.substring(0, 50)}...
              </p>
            )}
          </div>
        </div>

        {/* Expand/Collapse Chevron */}
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronUp
              className="h-5 w-5 text-gray-400 transition-transform"
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              className="h-5 w-5 text-gray-400 transition-transform"
              aria-hidden="true"
            />
          )}
        </div>
      </button>

      {/* Header Actions - Outside Trigger */}
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-2 bg-gray-50 border-t border-gray-100"
        role="group"
        aria-label="Lesson actions"
      >
        <DeleteModal
          what="Lesson"
          deleteFunc={() => onDelete(lesson._id)}
          aria-label={`Delete lesson ${lessonNumber}: ${lesson.title}`}
        />
        <EditLessonModal
          lesson={lesson}
          fetchQuarterDetail={fetchQuarterDetail}
          aria-label={`Edit lesson ${lessonNumber}: ${lesson.title}`}
        />
        <Link
          to={`/teacher/assessments/create/lesson/${lesson._id}/${courseId}/${quarterStartDate}/${quarterEndDate}?semester=${semesterId}&quarter=${quarterId}`}
          aria-label={`Add assessment to lesson ${lessonNumber}`}
        >
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 bg-transparent hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            + Add Assessment
          </Button>
        </Link>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <CardContent
          id={contentId}
          className="border-t pt-4 bg-white space-y-4"
          role="region"
          aria-labelledby={triggerId}
        >
          {/* Description */}
          {lesson.description && (
            <div
              id={descriptionId}
              className="p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <p className="text-sm text-blue-900 leading-relaxed">
                {lesson.description}
              </p>
            </div>
          )}

          {/* Resources Section */}
          {hasResources ? (
            <section aria-labelledby={resourcesId}>
              <h4
                id={resourcesId}
                className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"
              >
                <File className="w-4 h-4" aria-hidden="true" />
                Resources
              </h4>
              <div
                className="flex flex-wrap gap-2"
                role="list"
                aria-label="Lesson resources"
              >
                {/* PDF Files */}
                {hasPdfs &&
                  lesson.pdfFiles.map(
                    (pdf, i) =>
                      pdf?.url &&
                      pdf?.filename && (
                        <a
                          key={`pdf-${i}`}
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors shadow-sm"
                          aria-label={`Download PDF: ${pdf.filename}`}
                          role="listitem"
                        >
                          <FileText
                            className="h-4 w-4 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">{pdf.filename}</span>
                        </a>
                      )
                  )}

                {/* YouTube Link */}
                {hasYoutube && (
                  <a
                    href={lesson.youtubeLinks}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors shadow-sm"
                    aria-label="Watch lesson on YouTube (opens in new window)"
                    role="listitem"
                  >
                    <Youtube
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Watch Video
                  </a>
                )}

                {/* Other Link */}
                {hasOtherLink && (
                  <a
                    href={lesson.otherLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-purple-600 hover:bg-purple-50 hover:border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors shadow-sm"
                    aria-label="Visit external resource (opens in new window)"
                    role="listitem"
                  >
                    <Link2
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    External Link
                  </a>
                )}
              </div>
            </section>
          ) : (
            <div
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start gap-2"
              role="status"
            >
              <AlertCircle
                className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-gray-600">
                No resources attached to this lesson.
              </p>
            </div>
          )}

          {/* Assessments Section */}
          <section aria-labelledby={assessmentsId}>
            <div id={assessmentsId} className="sr-only">
              Lesson Assessments
            </div>
            <AssessmentCard
              assessments={lesson.lesson_assessments || []}
              title="Lesson Assessments"
              badgeColor="bg-green-50"
              onDelete={onDeleteAssessment}
            />
          </section>

          {/* Screen Reader Summary */}
          <div className="sr-only" role="complementary" aria-live="polite">
            Lesson {lessonNumber}: {lesson.title}.
            {hasResources
              ? `Contains ${hasPdfs ? "PDF files" : ""}${
                  hasYoutube ? (hasPdfs ? ", " : "") + "YouTube video" : ""
                }${
                  hasOtherLink
                    ? (hasPdfs || hasYoutube ? ", " : "") + "external link"
                    : ""
                }.`
              : "No resources attached."}
            {hasAssessments
              ? ` Has ${lesson.lesson_assessments.length} assessment${
                  lesson.lesson_assessments.length !== 1 ? "s" : ""
                }.`
              : ""}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
