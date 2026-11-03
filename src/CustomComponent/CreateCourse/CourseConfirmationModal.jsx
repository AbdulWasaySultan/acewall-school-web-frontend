import { useContext, useState, useId } from "react";
import {
  ArrowRight,
  Loader,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CourseContext } from "@/Context/CoursesProvider";

export default function CourseConfirmationModal({ submit, chapters }) {
  const [open, setOpen] = useState(false);
  const { courseLoading } = useContext(CourseContext);

  const dialogId = useId();
  const descriptionId = useId();
  const checkedListId = useId();

  // Validate course structure
  const hasChapters = chapters && chapters.length > 0;
  const hasLessons = hasChapters && chapters[0]?.lessons?.length > 0;
  const hasAssessment = hasChapters && chapters[0]?.Assessment;
  const isValid = hasChapters && hasLessons && hasAssessment;

  const totalChapters = chapters?.length || 0;
  const totalLessons =
    chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0;
  const totalAssessments = chapters?.filter((ch) => ch.Assessment).length || 0;

  const disabledReason = !hasChapters
    ? "No chapters added"
    : !hasLessons
    ? "First chapter has no lessons"
    : !hasAssessment
    ? "First chapter has no assessment"
    : null;

  const handleConfirm = async () => {
    if (isValid) {
      await submit();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!isValid}
          className={`flex items-center gap-2 transition-all focus:ring-2 focus:ring-green-700 focus:outline-none focus:ring-offset-2 ${
            isValid
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          aria-label={
            isValid
              ? "Open dialog to confirm and create course"
              : `Cannot create course: ${disabledReason}`
          }
          title={disabledReason || "Create this course"}
        >
          Create Course
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md focus:ring-2 focus:ring-blue-500"
        role="alertdialog"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={descriptionId}
      >
        <DialogHeader>
          <DialogTitle id={`${dialogId}-title`}>
            Confirm Course Creation
          </DialogTitle>
          <DialogDescription
            id={descriptionId}
            className="flex items-start gap-2 mt-2"
          >
            <AlertCircle
              className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              Please review your course details below. This action cannot be
              undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Course Summary */}
        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Course Summary
            </h3>
            <ul id={checkedListId} className="space-y-2" role="list">
              <li className="flex items-center gap-2 text-sm" role="listitem">
                <CheckCircle2
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-gray-700">
                  <span className="font-semibold">{totalChapters}</span> Chapter
                  {totalChapters !== 1 ? "s" : ""}
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm" role="listitem">
                <CheckCircle2
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-gray-700">
                  <span className="font-semibold">{totalLessons}</span> Lesson
                  {totalLessons !== 1 ? "s" : ""} total
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm" role="listitem">
                <CheckCircle2
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-gray-700">
                  <span className="font-semibold">{totalAssessments}</span>{" "}
                  Assessment{totalAssessments !== 1 ? "s" : ""}
                </span>
              </li>
            </ul>
          </div>

          {/* Validation Checklist */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Validation Status
            </h3>
            <ul className="space-y-2" role="list">
              <li
                className="flex items-center gap-2 text-sm"
                role="listitem"
                aria-label={`Chapters added: ${hasChapters ? "yes" : "no"}`}
              >
                {hasChapters ? (
                  <CheckCircle2
                    className="w-4 h-4 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertCircle
                    className="w-4 h-4 text-red-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={hasChapters ? "text-gray-700" : "text-red-600"}
                >
                  Chapters added
                </span>
              </li>

              <li
                className="flex items-center gap-2 text-sm"
                role="listitem"
                aria-label={`First chapter has lessons: ${
                  hasLessons ? "yes" : "no"
                }`}
              >
                {hasLessons ? (
                  <CheckCircle2
                    className="w-4 h-4 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertCircle
                    className="w-4 h-4 text-red-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className={hasLessons ? "text-gray-700" : "text-red-600"}>
                  First chapter has lessons
                </span>
              </li>

              <li
                className="flex items-center gap-2 text-sm"
                role="listitem"
                aria-label={`First chapter has assessment: ${
                  hasAssessment ? "yes" : "no"
                }`}
              >
                {hasAssessment ? (
                  <CheckCircle2
                    className="w-4 h-4 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertCircle
                    className="w-4 h-4 text-red-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={hasAssessment ? "text-gray-700" : "text-red-600"}
                >
                  First chapter has assessment
                </span>
              </li>
            </ul>
          </div>

          {/* Warning Message */}
          {!isValid && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertCircle
                className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-red-600 font-medium">
                <span className="block font-semibold mb-1">
                  Cannot create course:
                </span>
                {disabledReason}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 flex flex-col sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={courseLoading}
            className="focus:ring-2 focus:ring-gray-500 focus:outline-none"
            aria-label="Cancel and close the confirmation dialog"
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid || courseLoading}
            className={`flex items-center gap-2 transition-all focus:ring-2 focus:ring-green-700 focus:outline-none focus:ring-offset-2 ${
              isValid && !courseLoading
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleConfirm}
            aria-busy={courseLoading}
            aria-label={
              courseLoading
                ? "Creating course, please wait..."
                : isValid
                ? "Confirm and create the course"
                : "Cannot create course - requirements not met"
            }
          >
            {courseLoading ? (
              <>
                <Loader className="animate-spin h-4 w-4" aria-hidden="true" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                Confirm & Create
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
