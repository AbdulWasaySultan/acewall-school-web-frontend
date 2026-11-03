import { TabsContent } from "@/components/ui/tabs";
import { DiscussionCard } from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";

const DiscussionTablist = ({ chapter, lesson }) => {
  const [chapterDiscussion, setChapterDiscussion] = useState([]);
  const [lessonDiscussion, setLessonDiscussion] = useState([]);

  const getDiscussionForChapter = async () => {
    try {
      const response = await axiosInstance.get(
        `/discussion/chapter/${chapter._id}`
      );
      setChapterDiscussion(response.data.discussion);
    } catch (error) {
      console.error("Error fetching chapter discussion:", error);
    }
  };

  const getDiscussionForLesson = async () => {
    if (!lesson) return;
    try {
      const res = await axiosInstance.get(
        `/discussion/lesson/${lesson._id}`
      );
      setLessonDiscussion(res.data.discussion);
    } catch (error) {
      console.error("Error fetching lesson discussion:", error);
    }
  };

  useEffect(() => {
    getDiscussionForChapter();
    getDiscussionForLesson();
  }, [lesson]);

  return (
    <section aria-labelledby="discussion-section-title">
      <TabsContent
        value="Discussions"
        className="p-6 bg-white rounded-lg shadow-md"
        role="tabpanel"
        aria-labelledby="discussions-tab"
      >
        {/* Chapter Discussion Section */}
        <section aria-labelledby="chapter-discussion-title">
          <h2
            id="chapter-discussion-title"
            className="text-lg font-semibold text-gray-700 mb-4"
          >
            Chapter Discussion
          </h2>

          {chapterDiscussion.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">
              No discussion found for this chapter
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapterDiscussion.map((discussion) => (
                <DiscussionCard
                  key={discussion._id}
                  discussion={discussion}
                  link={`/student/discussions/${discussion._id}`}
                  aria-label={`Open chapter discussion: ${discussion.title}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Lesson Discussion Section */}
        <section
          aria-labelledby="lesson-discussion-title"
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <h2
            id="lesson-discussion-title"
            className="text-lg font-semibold text-gray-700 mb-4"
          >
            Lesson Discussion
          </h2>

          {!lesson || lessonDiscussion.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">
              No discussion found for this lesson
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonDiscussion.map((discussion) => (
                <DiscussionCard
                  key={discussion._id}
                  discussion={discussion}
                  link={`/student/discussions/${discussion._id}`}
                  aria-label={`Open lesson discussion: ${discussion.title}`}
                />
              ))}
            </div>
          )}
        </section>
      </TabsContent>
    </section>
  );
};

export default DiscussionTablist;
