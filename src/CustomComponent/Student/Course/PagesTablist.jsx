import { TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";

const PagesTablist = ({ chapter, lesson }) => {
  const [chapterPages, setChapterPages] = useState([]);
  const [lessonPages, setLessonPages] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const getPagesForChapter = async () => {
    try {
      const response = await axiosInstance.get(
        `pages/getChapterPages/${chapter._id}`
      );
      setChapterPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  const getPagesForLesson = async () => {
    if (!lesson) return;
    try {
      const res = await axiosInstance.get(
        `/pages/getLessonPages/${lesson._id}`
      );
      setLessonPages(res.data.pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  };

  useEffect(() => {
    getPagesForChapter();
    getPagesForLesson();
  }, [lesson]);

  // Handle keyboard activation for cards
  const handleCardKeyDown = (event, post) => {
    if (event.key === "Enter" || event.key === " ") {
      setSelectedPost(post);
    }
  };

  return (
    <section aria-labelledby="pages-section-title">
      <TabsContent
        value="Pages"
        className="p-6 bg-white rounded-lg shadow-md"
        role="tabpanel"
        aria-labelledby="pages-tab"
      >
        {/* Chapter Pages */}
        <section aria-labelledby="chapter-pages-title">
          <h2
            id="chapter-pages-title"
            className="text-lg font-semibold text-gray-700 mb-4"
          >
            Chapter Pages
          </h2>

          {chapterPages.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">
              No pages found for this chapter
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapterPages.map((post) => (
                <div
                  key={post._id}
                  id={`page-${post._id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(post)}
                  onKeyDown={(e) => handleCardKeyDown(e, post)}
                  className="bg-white border rounded-lg shadow-sm p-4 space-y-4 hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={`Open page: ${post.title}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold truncate max-w-[80%]">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">
                    {post.description}
                  </p>
                  {post.image?.url && (
                    <img
                      src={post.image.url}
                      alt={post.image.alt || `Visual for ${post.title}`}
                      className="w-full h-48 object-cover rounded-md border"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lesson Pages */}
        <section
          aria-labelledby="lesson-pages-title"
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <h2
            id="lesson-pages-title"
            className="text-lg font-semibold text-gray-700 mb-4"
          >
            Lesson Pages
          </h2>

          {!lesson || lessonPages.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">
              No pages found for this lesson
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonPages.map((post) => (
                <div
                  key={post._id}
                  id={`page-${post._id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(post)}
                  onKeyDown={(e) => handleCardKeyDown(e, post)}
                  className="bg-white border rounded-lg shadow-sm p-4 space-y-4 hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={`Open page: ${post.title}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold truncate max-w-[80%]">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">
                    {post.description}
                  </p>
                  {post.image?.url && (
                    <img
                      src={post.image.url}
                      alt={post.image.alt || `Visual for ${post.title}`}
                      className="w-full h-48 object-cover rounded-md border"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </TabsContent>

      {/* Modal for Selected Page */}
      {selectedPost && (
        <Dialog
          open={!!selectedPost}
          onOpenChange={() => setSelectedPost(null)}
          aria-labelledby="page-dialog-title"
        >
          <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle id="page-dialog-title" className="text-xl">
                {selectedPost.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {selectedPost.image?.url && (
                <img
                  src={selectedPost.image.url}
                  alt={
                    selectedPost.image.alt || `Visual for ${selectedPost.title}`
                  }
                  className="w-full object-contain rounded-md border max-h-[70vh]"
                />
              )}

              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selectedPost.description}
              </p>

              {selectedPost.files?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Attachments:</h3>
                  <ul className="list-disc pl-5 text-sm text-blue-600">
                    {selectedPost.files.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                        >
                          {file.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default PagesTablist;
