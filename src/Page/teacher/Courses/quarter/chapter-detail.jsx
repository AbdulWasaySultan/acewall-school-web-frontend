"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  FileText,
  Youtube,
  Link2,
  GraduationCap,
  Loader,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import LessonModal from "@/CustomComponent/CreateCourse/LessonModal";
import EditLessonModal from "@/CustomComponent/CreateCourse/EditLesson";
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal";
import EditChapterDialog from "@/CustomComponent/CreateCourse/EditChapter";
import AddMoreFile from "@/CustomComponent/CreateCourse/addMoreFile";
import { ChapterCard } from "./chapter-card";
import { AssessmentDialog } from "../Models/AssessmentFields";
import ChapterOptionDropdown from "@/CustomComponent/teacher/OptionDropdown";

const ReadMoreHTML = ({ html = "", maxLength = 180 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const plainText = html.replace(/<[^>]+>/g, "");
  const shouldTruncate = plainText.length > maxLength;

  const truncatedHTML = (() => {
    if (!shouldTruncate) return html;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    let text = "";
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (text.length + node.nodeValue.length > maxLength) {
        node.nodeValue = node.nodeValue.slice(0, maxLength - text.length);
        break;
      }
      text += node.nodeValue;
    }
    return tempDiv.innerHTML + "...";
  })();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className="text-sm text-gray-600"
        dangerouslySetInnerHTML={{
          __html: isExpanded ? html : truncatedHTML,
        }}
        aria-label={plainText}
      />
      {shouldTruncate && (
        <button
          onClick={handleToggle}
          className="text-green-600 font-medium hover:underline mt-1"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Show less content" : "Show more content"}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const TeacherChapterDetail = () => {
  const { chapterId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get("courseId");
  const quarterStart = searchParams.get("quarterStart");
  const quarterEnd = searchParams.get("quarterEnd");

  const [loading, setLoading] = useState(false);
  const [chapter, setChapter] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [editChapterLoading, setEditChapterLoading] = useState(false);

  const fetchChapterDetail = async () => {
    try {
      const response = await axiosInstance.get(
        `chapter/chapter/chapter&lessons/${chapterId}`
      );
      setChapter(response.data.chapter);
      setLessons(response.data.chapter.lessons || []);
      console.log(response.data.chapter.lessons, "chapter lessons");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load chapter details");
    }
  };

  useEffect(() => {
    if (chapterId) {
      fetchChapterDetail();
    }
  }, [chapterId, editChapterLoading]);

  const handleDeleteLesson = async (lessonID) => {
    // This is legacy handler, we use modelName property in DeleteModal instead
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`lesson/${lessonID}`);
      toast.success(response.data.message);
      fetchChapterDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentID) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/assessment/delete/${assessmentID}`
      );
      toast.success(response.data.message);
      fetchChapterDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId, lessonId) => {
    await axiosInstance
      .delete(`lesson/delete/${lessonId}/${fileId}`)
      .then((res) => {
        toast.success(res.data.message);
        fetchChapterDetail();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Error deleting file");
      });
  };

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="bg-white rounded-lg shadow-sm p-12 text-center"
            role="status"
            aria-live="polite"
          >
            <Loader className="animate-spin mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600">Loading chapter details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-1">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Back
        </Button>

        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <BookOpen
                  className="h-8 w-8 text-blue-600"
                  aria-hidden="true"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {chapter.title}
                  </h1>
                  <p className="text-gray-600">{chapter.description}</p>
                </div>
              </div>
            </div>
            <div
              className="flex gap-2"
              role="group"
              aria-label="Chapter actions"
            >
              <EditChapterDialog
                chapterId={chapter._id}
                title={chapter.title}
                description={chapter.description}
                fetchChapterDetail={fetchChapterDetail}
                editChapterLoading={editChapterLoading}
                setEditChapterLoading={setEditChapterLoading}
              />
              <ChapterOptionDropdown
                type={"chapter"}
                typeId={chapter._id}
                fetchChapterDetail={fetchChapterDetail}
                quarterId={chapter.quarter?._id}
                semesterId={chapter.semester?._id}
                quarterStart={quarterStart}
                quarterEnd={quarterEnd}
                courseId={courseId}
              />
            </div>
          </div>
        </header>

        {/* Chapter Assessments */}
        {chapter.chapter_assessments &&
          chapter.chapter_assessments.length > 0 && (
            <section aria-labelledby="chapter-assessments-heading">
              <Card>
                <CardHeader>
                  <CardTitle
                    id="chapter-assessments-heading"
                    className="flex items-center gap-2"
                  >
                    <GraduationCap
                      className="h-5 w-5 text-orange-600"
                      aria-hidden="true"
                    />
                    Chapter Assessments
                    <Badge variant="secondary" role="status">
                      {chapter.chapter_assessments.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    role="list"
                    aria-label="Chapter assessments"
                  >
                    {chapter.chapter_assessments.map((assessment) => (
                      <article
                        key={assessment._id}
                        className="border rounded-lg hover:shadow-sm transition-shadow"
                        role="listitem"
                        aria-labelledby={`chapter-assessment-${assessment._id}`}
                      >
                        <div className="flex flex-col items-start justify-between mb-2 gap-5 p-4">
                          <div className="flex justify-between w-full">
                            <Badge
                              variant="outline"
                              className="mb-2"
                              role="status"
                            >
                              {assessment.category.name}
                            </Badge>
                            <DeleteModal
                              what="Assessment"
                              chapterID={assessment._id}
                              modelName="assessment"
                              onSuccess={fetchChapterDetail}
                            />
                          </div>
                          <Link
                            to={`/teacher/courses/assessment/${assessment._id}`}
                            className="w-full hover:bg-gray-200 p-4 rounded-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-labelledby={`chapter-assessment-${assessment._id}`}
                          >
                            <h3
                              id={`chapter-assessment-${assessment._id}`}
                              className="font-semibold text-gray-900"
                            >
                              {assessment.title}
                            </h3>

                            {assessment.description && (
                              <ReadMoreHTML
                                html={assessment.description}
                                maxLength={180}
                              />
                            )}
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

        {/* Lessons */}
        <section aria-labelledby="lessons-heading">
          <Card>
            <CardHeader>
              <CardTitle
                id="lessons-heading"
                className="flex items-center gap-2"
              >
                <BookOpen
                  className="h-5 w-5 text-blue-600"
                  aria-hidden="true"
                />
                Lessons
                <Badge variant="secondary" role="status">
                  {lessons.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <div className="text-center py-8" role="status">
                  <BookOpen
                    className="h-12 w-12 text-gray-300 mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No lessons yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first lesson to start building your chapter
                    content.
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-4"
                  role="list"
                  aria-label="Chapter lessons"
                >
                  {lessons.map((lesson, index) => (
                    <article
                      key={lesson._id}
                      role="listitem"
                      aria-labelledby={`lesson-title-${lesson._id}`}
                    >
                      <Card className="border-l-4 border-l-blue-400">
                        <CardHeader className="pb-3">
                          <div className="flex gap-3 flex-wrap items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                                role="status"
                                aria-label={`Lesson number ${index + 1}`}
                              >
                                Lesson {index + 1}
                              </Badge>
                              <h3
                                id={`lesson-title-${lesson._id}`}
                                className="font-semibold text-gray-900"
                              >
                                {lesson.title}
                              </h3>
                            </div>
                            <div
                              className="flex items-center gap-2 flex-wrap gap-1"
                              role="group"
                              aria-label="Lesson actions"
                            >
                              <EditLessonModal
                                lesson={lesson}
                                fetchChapterDetail={fetchChapterDetail}
                              />
                              <DeleteModal
                                what="lesson"
                                chapterID={lesson._id}
                                modelName="Lesson"
                                onSuccess={fetchChapterDetail}
                              />
                              <ChapterOptionDropdown
                                type={"lesson"}
                                typeId={lesson._id}
                                fetchChapterDetail={fetchChapterDetail}
                                quarterId={chapter.quarter?._id}
                                semesterId={chapter.semester?._id}
                                quarterStart={quarterStart}
                                quarterEnd={quarterEnd}
                                courseId={courseId}
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {lesson.description && (
                            <ReadMoreHTML
                              html={lesson.description}
                              maxLength={180}
                            />
                          )}

                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Files
                              </h4>
                              <AddMoreFile
                                lessonId={lesson._id}
                                fetchChapterDetail={fetchChapterDetail}
                              />
                            </div>

                            <div
                              className="flex flex-col gap-2"
                              role="list"
                              aria-label="Lesson files"
                            >
                              {lesson.pdfFiles.length === 0 ? (
                                <p
                                  className="text-sm text-gray-500"
                                  role="status"
                                >
                                  No files
                                </p>
                              ) : (
                                lesson?.pdfFiles?.map(
                                  (pdf, i) =>
                                    pdf?.url &&
                                    pdf?.filename && (
                                      <div
                                        key={i}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0"
                                        role="listitem"
                                      >
                                        <div className="flex items-center gap-2">
                                          <a
                                            href={pdf.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            aria-label={`Download ${pdf.filename}, opens in new tab`}
                                          >
                                            <FileText
                                              className="h-4 w-4"
                                              aria-hidden="true"
                                            />
                                            {pdf.filename}
                                          </a>

                                          {pdf.uploadedAt && (
                                            <time
                                              className="text-xs text-gray-500"
                                              dateTime={pdf.uploadedAt}
                                              aria-label={`Uploaded on ${new Date(
                                                pdf.uploadedAt
                                              ).toLocaleString("en-US", { hour12: true })}`}
                                            >
                                              {new Date(
                                                pdf.uploadedAt
                                              ).toLocaleString("en-US", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })}
                                            </time>
                                          )}
                                        </div>

                                        <DeleteModal
                                          what="File"
                                          deleteFunc={() =>
                                            handleDeleteFile(
                                              pdf._id,
                                              lesson._id
                                            )
                                          }
                                        />
                                      </div>
                                    )
                                )
                              )}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Resources
                            </h4>
                            <div
                              className="flex flex-wrap gap-2"
                              role="list"
                              aria-label="Lesson resources"
                            >
                              {lesson.youtubeLinks && (
                                <a
                                  href={lesson.youtubeLinks}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-md text-sm hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                  aria-label="YouTube video resource, opens in new tab"
                                  role="listitem"
                                >
                                  <Youtube
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  YouTube Video
                                </a>
                              )}

                              {lesson.otherLink && (
                                <a
                                  href={lesson.otherLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md text-sm hover:bg-purple-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                  aria-label="External link resource, opens in new tab"
                                  role="listitem"
                                >
                                  <Link2
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  External Link
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Lesson Assessments */}
                          {lesson.lesson_assessments &&
                            lesson.lesson_assessments.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Lesson Assessments (
                                  {lesson.lesson_assessments.length})
                                </h4>
                                <div
                                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                  role="list"
                                  aria-label="Lesson assessments"
                                >
                                  {lesson.lesson_assessments.map(
                                    (assessment) => (
                                      <article
                                        key={assessment._id}
                                        className="border rounded-lg hover:shadow-sm transition-shadow"
                                        role="listitem"
                                        aria-labelledby={`lesson-assessment-${assessment._id}`}
                                      >
                                        <div className="flex flex-col items-start justify-between mb-2 gap-5 p-4">
                                          <div className="flex justify-between w-full">
                                            <Badge
                                              variant="outline"
                                              className="mb-2"
                                              role="status"
                                            >
                                              {assessment.category?.name}
                                            </Badge>
                                            <DeleteModal
                                              what="Assessment"
                                              chapterID={assessment._id}
                                              modelName="assessment"
                                              onSuccess={fetchChapterDetail}
                                            />
                                          </div>
                                          <Link
                                            to={`/teacher/courses/assessment/${assessment._id}`}
                                            className="w-full hover:bg-gray-200 p-4 rounded-lg transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            aria-labelledby={`lesson-assessment-${assessment._id}`}
                                          >
                                            <h5
                                              id={`lesson-assessment-${assessment._id}`}
                                              className="font-semibold text-gray-900"
                                            >
                                              {assessment.title}
                                            </h5>
                                            {assessment.description && (
                                              <p className="text-sm text-gray-600 mt-1">
                                                {assessment.description}
                                              </p>
                                            )}
                                          </Link>
                                        </div>
                                      </article>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default TeacherChapterDetail;
