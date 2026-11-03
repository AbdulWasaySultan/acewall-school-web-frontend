import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal";
import { AssessmentDialog } from "../Models/AssessmentFields";
import { useId } from "react";
import { AlertCircle } from "lucide-react";

export function AssessmentCard({ assessments, title, badgeColor, onDelete }) {
  const headingId = useId();
  const sectionId = useId();
  const emptyStateId = useId();

  if (!assessments || assessments.length === 0) {
    return (
      <div
        id={emptyStateId}
        className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start gap-3"
        role="status"
        aria-live="polite"
      >
        <AlertCircle
          className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-gray-500">
          <span className="font-medium">
            No {title.toLowerCase()} added yet.
          </span>{" "}
          Create your first {title.toLowerCase()} to get started.
        </p>
      </div>
    );
  }

  return (
    <Card className="mt-4 focus-within:ring-2 focus-within:ring-blue-500">
      <CardHeader className="py-4 pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle
            id={headingId}
            className="text-base font-semibold flex items-center gap-2"
          >
            <Badge
              variant="outline"
              className={`${badgeColor} font-semibold`}
              aria-label={title}
            >
              {title}
            </Badge>
            <span
              className="text-sm text-gray-500 font-normal"
              aria-label={`${assessments.length} assessment${
                assessments.length !== 1 ? "s" : ""
              }`}
            >
              ({assessments.length})
            </span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent
        className="py-2 space-y-3"
        role="region"
        aria-labelledby={headingId}
      >
        <div
          role="list"
          aria-label={`${assessments.length} ${title.toLowerCase()} item${
            assessments.length !== 1 ? "s" : ""
          }`}
        >
          {assessments.map((assessment, index) => (
            <article
              key={assessment._id || index}
              className="border-l-4 border-blue-400 pl-4 py-3 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
              role="listitem"
              aria-label={`Assessment: ${assessment.title}`}
            >
              {/* Header with Title and Category */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 flex-shrink-0"
                    aria-label={`Category: ${
                      assessment.category?.name || "Uncategorized"
                    }`}
                  >
                    {assessment.category?.name || "Uncategorized"}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 text-sm break-words">
                    {assessment.title}
                  </h3>
                </div>

                {/* Action Buttons */}
                <div
                  className="flex items-center gap-2 flex-shrink-0"
                  role="group"
                  aria-label="Assessment actions"
                >
                  <AssessmentDialog
                    assessment={assessment}
                    aria-label={`Edit assessment: ${assessment.title}`}
                  />
                  <DeleteModal
                    what="Assessment"
                    deleteFunc={() => onDelete(assessment._id)}
                    aria-label={`Delete assessment: ${assessment.title}`}
                  />
                </div>
              </div>

              {/* Description */}
              {assessment.description && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {assessment.description}
                </p>
              )}

              {/* Metadata */}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                {assessment.createdAt && (
                  <span>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </span>
                )}
                {assessment.totalQuestions && (
                  <span
                    aria-label={`Total questions: ${assessment.totalQuestions}`}
                  >
                    <span className="font-medium">Questions:</span>{" "}
                    {assessment.totalQuestions}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Summary for Screen Readers */}
        <div className="sr-only" role="complementary" aria-live="polite">
          {title} section with {assessments.length} item
          {assessments.length !== 1 ? "s" : ""}. Use arrow keys to navigate
          through the list.
        </div>
      </CardContent>
    </Card>
  );
}
