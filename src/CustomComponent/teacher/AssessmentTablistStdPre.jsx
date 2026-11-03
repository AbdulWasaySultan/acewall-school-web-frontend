import { TabsContent } from "@/components/ui/tabs";
import { BookOpenCheck } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const AssessmentTablistStdPre = ({ chapter, lessonAssessments }) => {
  const renderAssessmentItem = (assessment) => (
    <Link
      key={assessment._id}
      to={`/student/assessment/submission/${assessment._id}`}
      className="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      role="button"
      tabIndex={0}
      aria-label={`Open assessment titled ${assessment.title}. Description: ${assessment.description}`}
    >
      <div className="flex items-center gap-4">
        <BookOpenCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-800">
          {assessment.title}
        </h3>
      </div>
      <p className="text-gray-700 mt-2 text-sm">{assessment.description}</p>
    </Link>
  );

  return (
    <TabsContent
      value="Assessments"
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <div className="space-y-6">
        <p className="text-lg font-semibold text-gray-700 my-4">
          Lesson Assessments
        </p>
        <div className="flex flex-col gap-4">
          {!lessonAssessments || lessonAssessments.length === 0 ? (
            <p className="text-sm text-gray-400 my-4" aria-live="polite">
              No lesson assessments available
            </p>
          ) : (
            lessonAssessments.map(renderAssessmentItem)
          )}
        </div>
      </div>

      {chapter?.chapterAssessments?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Chapter Assessment
          </h3>
          {chapter.chapterAssessments.map(renderAssessmentItem)}
        </div>
      )}
    </TabsContent>
  );
};

export default AssessmentTablistStdPre;
