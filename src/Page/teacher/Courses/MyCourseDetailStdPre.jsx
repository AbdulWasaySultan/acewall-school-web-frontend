"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import DescriptionTablist from "@/CustomComponent/Student/Course/DescriptionTablist";
import FileTablist from "@/CustomComponent/Student/Course/FileTablist";
import PagesTablist from "@/CustomComponent/Student/Course/PagesTablist";
import AssessmentTablistStdPre from "@/CustomComponent/teacher/AssessmentTablistStdPre";

export default function ChapterDetailStdPre() {
  const [isLessonVisible, setIsLessonVisible] = useState(false);
  const { chapterId } = useParams();
  const [expandedSections, setExpandedSections] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const getChapterDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/enrollment/getChapterstdpre/${chapterId}`);
        setChapter(res.data.chapterDetails);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getChapterDetails();
  }, [chapterId]);

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleLessonVisibility = () => {
    setIsLessonVisible((prev) => !prev);
  };

  function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2]?.length === 11 ? match[2] : null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status">
        <Loader className="animate-spin" aria-label="Loading chapter details" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="p-6 text-center" aria-live="polite">
        Chapter not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* LEFT SIDE - CONTENT */}
      <main className="flex-1 overflow-auto" aria-label="Chapter content section">
        <header
          className="p-5 border-b bg-white shadow-sm flex items-center gap-3"
          aria-label="Chapter Header"
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            className="text-gray-600 hover:text-black focus:ring-2 focus:ring-blue-600"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">{chapter.courseTitle}</h1>
            <p className="text-sm text-gray-500">Chapter: {chapter.title}</p>
          </div>
        </header>

        {/* VIDEO SECTION */}
        {activeLesson && (
          <section className="mb-8" aria-label="Active lesson">
            <h3 className="text-lg font-semibold p-4">
              Lesson: {activeLesson.title}
            </h3>

            {activeLesson?.youtubeLinks ? (
              <div className="mt-6 flex justify-center">
                <div className="w-full max-w-screen-md rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                        activeLesson.youtubeLinks
                      )}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video lesson: ${activeLesson.title}`}
                    ></iframe>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="mt-6 p-6 bg-gray-100 text-center text-sm text-gray-500 rounded-md"
                aria-live="polite"
              >
                No YouTube link available.
              </div>
            )}
          </section>
        )}

        {/* TABS SECTION */}
        <Tabs defaultValue="description" className="w-full p-5" aria-label="Chapter tabs">
          <TabsList
            className="flex flex-wrap justify-center gap-4 w-full sm:gap-10 bg-white p-1 shadow-inner"
            role="tablist"
          >
            {["description", "files", "Assessments", "Pages"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                role="tab"
                aria-label={`${tab} tab`}
                className="px-3 py-2 text-base font-medium capitalize transition-all duration-300 
                  text-gray-700 hover:text-green-600 hover:bg-gray-50 
                  data-[state=active]:bg-gray-100 data-[state=active]:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <DescriptionTablist
            chapter={chapter}
            activeLesson={activeLesson}
            isLessonVisible={isLessonVisible}
            toggleLessonVisibility={toggleLessonVisibility}
          />

          <FileTablist activeLesson={activeLesson} chapter={chapter} />

          <AssessmentTablistStdPre
            chapter={chapter}
            lessonAssessments={activeLesson?.lessonAssessments}
          />

          <PagesTablist chapter={chapter} lesson={activeLesson} />
        </Tabs>
      </main>

      {/* RIGHT SIDE - SIDEBAR CONTENT */}
      <nav
        className="w-full lg:w-80 border-l bg-gray-50 overflow-auto max-h-screen"
        aria-label="Chapter sidebar"
      >
        <div className="p-4 border-b bg-white">
          <h2 className="text-sm font-semibold text-gray-700">Chapter Content</h2>
        </div>

        <div className="max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="border-b">
            <button
              className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-expanded={expandedSections[chapter.title] || false}
              aria-controls={`section-${chapter.title}`}
              onClick={() => toggleSection(chapter.title)}
            >
              <div className="flex items-center gap-2">
                {expandedSections[chapter.title] ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" aria-hidden />
                )}
                <span className="text-sm font-medium text-gray-800">{chapter.title}</span>
              </div>
              <span className="text-xs text-gray-500">{chapter.lessons.length} lessons</span>
            </button>

            <ul
              id={`section-${chapter.title}`}
              className="pl-6 pr-4 pb-2"
              role="list"
            >
              {chapter.lessons.map((lesson, index) => {
                const isActive = activeLesson?._id === lesson._id;

                return (
                  <li key={lesson._id}>
                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition focus:outline-none focus:ring-2 focus:ring-green-600 
                        ${
                          isActive
                            ? "bg-green-100 text-green-700 font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      aria-label={`Open lesson ${index + 1}: ${lesson.title}`}
                    >
                      <PlayCircle
                        className={`h-4 w-4 ${
                          isActive ? "text-green-500" : "text-gray-400"
                        }`}
                        aria-hidden
                      />
                      <span>
                        Lesson {index + 1}: {lesson.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
