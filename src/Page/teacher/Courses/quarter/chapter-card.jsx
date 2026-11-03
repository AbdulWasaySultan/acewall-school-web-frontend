import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useId } from "react";
import { LessonCard } from "./lesson-card";
import { AssessmentCard } from "./assessment-card";
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal";
import EditChapterDialog from "@/CustomComponent/CreateCourse/EditChapter";
import LessonModal from "@/CustomComponent/CreateCourse/LessonModal";
import { AlertCircle, ChevronDown } from "lucide-react";

export function ChapterCard({
  chapter,
  chapterIndex,
  courseId,
  quarterStartDate,
  quarterEndDate,
  onDeleteChapter,
  onDeleteAssessment,
  onDeleteLesson,
  fetchQuarterDetail,
}) {
  const chapterId = useId();
  const descriptionId = useId();
  const lessonsHeadingId = useId();
  const lessonsListId = useId();
  const actionsGroupId = useId();

  const chapterNumber = chapterIndex + 1;
  const hasLessons = chapter.lessons && chapter.lessons.length > 0;
  const hasAssessments =
    chapter.chapter_assessments && chapter.chapter_assessments.length > 0;
  const lessonCount = chapter.lessons?.length || 0;
  const assessmentCount = chapter.chapter_assessments?.length || 0;

  return (
    <AccordionItem
      value={`chapter-${chapterIndex}`}
      className="border rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all"
    >
      <AccordionTrigger
        className="text-left px-6 py-4 hover:bg-gray-100 focus:bg-gray-50 transition-all focus:outline-none group"
        aria-expanded="false"
        aria-controls={`chapter-${chapterIndex}-content`}
        id={`${chapterId}-trigger`}
      >
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 font-semibold flex-shrink-0"
              aria-label={`Chapter ${chapterNumber}`}
            >
              Ch {chapterNumber}
            </Badge>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {chapter.title}
              </h2>
              <p className="text-xs text-gray-500">
                {lessonCount} Lesson{lessonCount !== 1 ? "s" : ""} •{" "}
                {assessmentCount} Assessment{assessmentCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-5 h-5 text-gray-400 group-data-[state=open]:rotate-180 transition-transform flex-shrink-0"
            aria-hidden="true"
          />
        </div>
      </AccordionTrigger>

      <AccordionContent
        id={`chapter-${chapterIndex}-content`}
        className="px-6 pb-6 space-y-6 bg-white"
        role="region"
        aria-labelledby={`${chapterId}-trigger`}
      >
        {/* Chapter Description */}
        <div
          className="bg-orange-50 p-4 rounded-lg border border-orange-200"
          aria-label="Chapter description"
        >
          <p
            id={descriptionId}
            className="text-sm text-orange-900 leading-relaxed"
          >
            {chapter.description || "No description provided."}
          </p>
        </div>

        {/* Action Buttons Group */}
        <div
          id={actionsGroupId}
          className="flex flex-wrap items-center gap-3"
          role="group"
          aria-label="Chapter actions"
        >
          <DeleteModal
            what="Chapter"
            deleteFunc={() => onDeleteChapter(chapter._id)}
            aria-label={`Delete chapter ${chapterNumber}: ${chapter.title}`}
          />
          <EditChapterDialog
            chapterId={chapter._id}
            title={chapter.title}
            description={chapter.description}
            fetchQuarterDetail={fetchQuarterDetail}
            aria-label={`Edit chapter ${chapterNumber}: ${chapter.title}`}
          />
          <LessonModal
            chapterID={chapter._id}
            fetchQuarterDetail={fetchQuarterDetail}
            aria-label={`Add lesson to chapter ${chapterNumber}`}
          />
          <Link
            to={`/teacher/assessments/create/chapter/${chapter._id}/${courseId}/${quarterStartDate}/${quarterEndDate}?semester=${chapter.semester._id}&quarter=${chapter.quarter._id}`}
            aria-label={`Add assessment to chapter ${chapterNumber}`}
          >
            <Button
              variant="outline"
              className="text-green-600 bg-transparent hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              + Add Assessment
            </Button>
          </Link>
        </div>

        {/* Chapter Assessments Section */}
        <section aria-label="Chapter assessments">
          <AssessmentCard
            assessments={chapter.chapter_assessments || []}
            title="Chapter Assessments"
            badgeColor="bg-orange-50"
            onDelete={onDeleteAssessment}
          />
        </section>

        {/* Lessons Section */}
        {hasLessons ? (
          <section aria-labelledby={lessonsHeadingId}>
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
                aria-label={`Lessons section`}
              >
                Lessons
              </Badge>
              <span
                className="text-sm text-gray-500 font-medium"
                aria-label={`${lessonCount} lesson${
                  lessonCount !== 1 ? "s" : ""
                }`}
              >
                ({lessonCount})
              </span>
            </div>

            <div
              id={lessonsListId}
              className="space-y-3"
              role="list"
              aria-label={`${lessonCount} lesson${
                lessonCount !== 1 ? "s" : ""
              } in chapter ${chapterNumber}`}
            >
              {chapter.lessons.map((lesson, lessonIndex) => (
                <div key={lesson._id} role="listitem">
                  <LessonCard
                    lesson={lesson}
                    lessonIndex={lessonIndex}
                    courseId={courseId}
                    quarterStartDate={quarterStartDate}
                    quarterEndDate={quarterEndDate}
                    semesterId={chapter.semester._id}
                    quarterId={chapter.quarter._id}
                    onDelete={onDeleteLesson}
                    onDeleteAssessment={onDeleteAssessment}
                    fetchQuarterDetail={fetchQuarterDetail}
                    aria-label={`Lesson ${lessonIndex + 1}: ${lesson.title}`}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div
            className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3"
            role="status"
            aria-live="polite"
          >
            <AlertCircle
              className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-blue-900 font-medium">
                No lessons added yet.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Use the "Add Lesson" button above to create your first lesson.
              </p>
            </div>
          </div>
        )}

        {/* Summary for Screen Readers */}
        <div className="sr-only" role="complementary" aria-live="polite">
          Chapter {chapterNumber}: {chapter.title}. Contains {lessonCount}{" "}
          lesson{lessonCount !== 1 ? "s" : ""} and {assessmentCount} assessment
          {assessmentCount !== 1 ? "s" : ""}. Use tab key to navigate through
          lessons and assessments.
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
