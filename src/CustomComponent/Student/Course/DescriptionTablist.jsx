import { TabsContent } from "@/components/ui/tabs";
import React from "react";

const DescriptionTablist = ({
  chapter,
  activeLesson,
  isLessonVisible,
  toggleLessonVisibility,
}) => {
  return (
    <TabsContent
      value="description"
      className="p-6 bg-white rounded-lg shadow-md"
      role="tabpanel"
      aria-labelledby="description-tab"
    >
      <div className="space-y-6">

        {/* Chapter Title and Description */}
        <section aria-labelledby="chapter-title">
          <h3
            id="chapter-title"
            className="text-xl font-semibold text-gray-800"
          >
            {chapter.title}
          </h3>

          <p className="text-gray-700 mt-4 text-sm">{chapter.description}</p>
        </section>

        {/* Active Lesson Toggle */}
        {activeLesson && (
          <section
            className="mt-8 pt-6 border-t border-gray-200"
            aria-labelledby="current-lesson-title"
          >
            <button
              onClick={toggleLessonVisibility}
              aria-expanded={isLessonVisible}
              aria-controls="lesson-description"
              className="text-xl font-semibold text-gray-800 w-full text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
            >
              <span id="current-lesson-title">
                Current Lesson: <br /> {activeLesson.title}
              </span>

              {/* Decorative arrow icon */}
              <svg
                aria-hidden="true"
                className={`w-5 h-5 transition-transform duration-200 ${
                  isLessonVisible ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Lesson Description */}
            {isLessonVisible && (
              <section
                id="lesson-description"
                className="text-gray-600 mt-3 text-sm"
                aria-label="Lesson description"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeLesson.description,
                  }}
                />
              </section>
            )}
          </section>
        )}
      </div>
    </TabsContent>
  );
};

export default DescriptionTablist;
