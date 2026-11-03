import { TabsContent } from "@/components/ui/tabs";
import { BookOpenCheck } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";

const AssessmentTablist = ({ chapter, lessonAssessments }) => {
  const { courseId } = useParams();

  return (
    <TabsContent
      value="Assessments"
      className="p-6 bg-white rounded-lg shadow-md"
      role="tabpanel"
      aria-labelledby="assessments-tab"
    >
      <div className="space-y-6">
        <section aria-labelledby="lesson-assessments-title">
          <h2
            id="lesson-assessments-title"
            className="text-lg font-semibold text-gray-700 my-4"
          >
            Lesson Assessments
          </h2>

          <div className="flex flex-col gap-4">
            {!lessonAssessments || lessonAssessments.length === 0 ? (
              <p className="text-sm text-gray-400 my-4">
                No lesson assessments available
              </p>
            ) : (
              lessonAssessments.map((assessment, index) => {
                const label = `Open lesson assessment: ${assessment.title}`;

                return (
                  <Link
                    key={assessment._id || index}
                    to={`/student/assessment/submission/${assessment._id}?courseId=${courseId}`}
                    aria-label={label}
                    className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                  >
                    <div className="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-md">
                      <div className="flex items-center gap-4">
                        <BookOpenCheck
                          className="h-5 w-5 text-green-500"
                          aria-hidden="true"
                          focusable="false"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {assessment.title}
                        </h3>
                      </div>

                      <p className="text-gray-700 mt-4 text-sm">
                        {assessment.description}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Chapter Assessments */}
        {chapter?.chapterAssessments?.length > 0 && (
          <section
            className="mt-6 pt-6 border-t border-gray-200 flex flex-col gap-3"
            aria-labelledby="chapter-assessment-title"
          >
            <h2
              id="chapter-assessment-title"
              className="text-lg font-semibold text-gray-700 mb-4"
            >
              Chapter Assessment
            </h2>

            {chapter.chapterAssessments.map((assessment, i) => {
              const label = `Open chapter assessment: ${assessment.title}`;

              return (
                <Link
                  key={assessment._id || i}
                  to={`/student/assessment/submission/${assessment._id}?courseId=${courseId}`}
                  aria-label={label}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                >
                  <div className="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-md">
                    <div className="flex items-center gap-4">
                      <BookOpenCheck
                        className="h-5 w-5 text-green-500"
                        aria-hidden="true"
                        focusable="false"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {assessment.title}
                      </h3>
                    </div>

                    <p className="text-gray-700 mt-4 text-sm">
                      {assessment.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </TabsContent>
  );
};

export default AssessmentTablist;
