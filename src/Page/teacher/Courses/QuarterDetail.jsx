import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BookOpen, GraduationCap, Eye } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link, useParams } from "react-router-dom";
import ChapterCreationModal from "@/CustomComponent/CreateCourse/CreatChapterModal";
import EditChapterDialog from "@/CustomComponent/CreateCourse/EditChapter";
import { DeleteModal } from "../../../CustomComponent/CreateCourse/DeleteModal";
import BackButton from "@/CustomComponent/BackButton";

const QuarterDetail = () => {
  const { id, courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [quarterStartDate, setQuarterStartDate] = useState("");
  const [quarterEndDate, setQuarterEndDate] = useState("");
  const [error, setError] = useState(null);

  const fetchQuarterDetail = async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`chapter/get/${courseId}/${id}`);
      if (response?.data?.chapters) {
        setChapters(response.data.chapters);
        setQuarterStartDate(response.data.quarterStartDate);
        setQuarterEndDate(response.data.quarterEndDate);
      } else {
        setChapters([]);
        setError("Invalid response format from server.");
        toast.error("Invalid response format from server.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setChapters([]);
      setError("No Chapter found");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchQuarterDetail();
  }, [courseId, id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <BackButton aria-label="Go back to quarters list" />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chapters
                </h1>
                <p className="text-gray-600">
                  Manage your chapters and course content
                </p>
              </div>
            </div>
            <ChapterCreationModal
              courseId={courseId}
              quarterId={id}
              fetchQuarterDetail={fetchQuarterDetail}
            />
          </div>
        </header>

        {/* Main Content */}
        <main aria-labelledby="chapters-heading">
          <h2 id="chapters-heading" className="sr-only">
            Chapter List
          </h2>
          
          {isLoadingData ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center" role="status" aria-live="polite">
              <p className="text-gray-600">Loading chapters...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center" role="alert" aria-live="assertive">
              <p className="text-red-600">{error}</p>
            </div>
          ) : chapters.length === 0 ? (
            <section className="bg-white rounded-lg shadow-sm p-12 text-center" aria-labelledby="empty-state-heading">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <h3 id="empty-state-heading" className="text-xl font-semibold text-gray-900 mb-2">
                No chapters yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first chapter to get started with organizing your course content.
              </p>
              <ChapterCreationModal
                courseId={courseId}
                quarterId={id}
                fetchQuarterDetail={fetchQuarterDetail}
              />
            </section>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="list" aria-label="Available chapters">
              {chapters.map((chapter, index) => (
                <article key={chapter._id} role="listitem" aria-labelledby={`chapter-title-${chapter._id}`}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800" role="status">
                            Chapter {index + 1}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <DeleteModal
                            what="chapter"
                            chapterID={chapter._id}
                            modelName="Chapter"
                            onSuccess={fetchQuarterDetail}
                          />
                        </div>
                      </div>
                      <CardTitle id={`chapter-title-${chapter._id}`} className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {chapter.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {chapter.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500" role="group" aria-label="Chapter statistics">
                        <div className="flex flex-wrap items-center gap-1">
                          <BookOpen className="h-4 w-4" aria-hidden="true" />
                          <span>{chapter.lessons?.length || 0} Lessons</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <GraduationCap className="h-4 w-4" aria-hidden="true" />
                          <span>{chapter.chapter_assessments?.length || 0} Assessments</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Link
                          to={`/teacher/courses/quarter/${id}/chapter/${chapter._id}?courseId=${courseId}&quarterStart=${quarterStartDate}&quarterEnd=${quarterEndDate}`}
                          className="flex-1"
                          aria-label={`View details for ${chapter.title}`}
                        >
                          <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default QuarterDetail;