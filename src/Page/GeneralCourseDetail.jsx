import { useEffect, useState, useId } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  CheckCircle2,
  ChevronDown,
  Loader,
  PlayCircle,
  Star,
  StarHalf,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import avatar from "@/assets/avatar.png";

const GeneralCourseDetail = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mainId = useId();
  const courseHeadingId = useId();
  const overviewId = useId();
  const curriculumId = useId();
  const instructorId = useId();
  const sidebarId = useId();
  const priceErrorId = useId();

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        setError(null);
        const response = await axiosInstance.get(`/course/get/${id}`);

        if (response.data?.course) {
          setCourseDetails(response.data.course);
        } else {
          setError("Course not found. Please try again.");
          setCourseDetails(null);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load course. Please try again."
        );
        setCourseDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      const timer = setTimeout(() => {
        getCourseDetails();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id]);

  if (loading) {
    return (
      <main
        id={mainId}
        className="flex justify-center items-center min-h-screen bg-gray-50"
        role="main"
        aria-busy="true"
        aria-label="Loading course details"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader
            className="animate-spin w-8 h-8 text-green-600"
            aria-hidden="true"
          />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </main>
    );
  }

  if (error || !courseDetails) {
    return (
      <main
        id={mainId}
        className="flex justify-center items-center min-h-screen bg-gray-50 px-4"
        role="main"
      >
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-red-900 mb-2">
                Error Loading Course
              </h2>
              <p className="text-sm text-red-700">
                {error ||
                  "Course not found. Please check the URL and try again."}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalLessons =
    courseDetails.chapters?.reduce(
      (acc, ch) => acc + (ch.lessons?.length || 0),
      0
    ) || 0;

  const totalAssessments =
    courseDetails.chapters?.reduce(
      (total, ch) =>
        total + (Array.isArray(ch.Assessment) ? ch.Assessment.length : 0),
      0
    ) || 0;

  const instructorName = `${courseDetails.createdby.firstName} ${
    courseDetails.createdby.middleName || ""
  } ${courseDetails.createdby.lastName}`.trim();

  const instructorInitials = `${courseDetails.createdby.firstName?.charAt(
    0
  )}${courseDetails.createdby.lastName?.charAt(0)}`;

  return (
    <main
      id={mainId}
      className="min-h-screen bg-gray-50"
      role="main"
      aria-label="Course details"
    >
      <div className="grid lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Section */}
          <article className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
            <div className="space-y-4">
              <div>
                <h1
                  id={courseHeadingId}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                >
                  {courseDetails.basics.courseTitle}
                </h1>
                <p className="text-gray-600 text-base leading-relaxed">
                  {courseDetails.basics.courseDescription}
                </p>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center gap-3 py-4 border-t border-gray-200">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage
                    src={courseDetails.createdby.profileImg?.url || avatar}
                    alt={`${instructorName}, course instructor`}
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                    {instructorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {instructorName}
                  </div>
                  <div className="text-xs text-gray-600">Course Instructor</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                  <StarHalf
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <span
                  className="text-sm font-semibold text-gray-900"
                  aria-label={`Rating: ${courseDetails.rating} out of 5 stars`}
                >
                  {courseDetails.rating}
                </span>
                <span className="text-sm text-gray-600">(1,234 ratings)</span>
              </div>
            </div>

            {/* Course Thumbnail */}
            <figure className="mt-6">
              <img
                src={courseDetails.basics.thumbnail || "/default-thumbnail.jpg"}
                alt={`${courseDetails.basics.courseTitle} preview`}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
              <figcaption className="sr-only">Course preview image</figcaption>
            </figure>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full mt-6">
              <TabsList
                className="grid grid-cols-3 gap-0 bg-white border-b-2 border-gray-200 w-full p-0"
                role="tablist"
                aria-label="Course content tabs"
              >
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-green-600 data-[state=active]:text-green-600 pb-3 font-medium"
                  role="tab"
                  aria-selected="true"
                  aria-controls={overviewId}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-green-600 data-[state=active]:text-green-600 pb-3 font-medium"
                  role="tab"
                  aria-controls={curriculumId}
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="instructor"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-green-600 data-[state=active]:text-green-600 pb-3 font-medium"
                  role="tab"
                  aria-controls={instructorId}
                >
                  Instructor
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent
                id={overviewId}
                value="overview"
                className="p-6 space-y-6"
              >
                <section aria-labelledby="what-you-learn">
                  <h2
                    id="what-you-learn"
                    className="text-xl font-bold text-gray-900 mb-4"
                  >
                    What you will learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.isArray(courseDetails?.basics.teachingPoints) &&
                      courseDetails.basics.teachingPoints.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2
                            size={20}
                            className="text-green-600 flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-gray-700">
                            {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </section>

                <section aria-labelledby="course-requirements">
                  <h2
                    id="course-requirements"
                    className="text-xl font-bold text-gray-900 mb-4"
                  >
                    Course requirements
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.isArray(courseDetails?.basics.requirements) &&
                      courseDetails.basics.requirements.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2
                            size={20}
                            className="text-green-600 flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-gray-700">
                            {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </section>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent id={curriculumId} value="curriculum" className="p-6">
                <section aria-labelledby="curriculum-heading">
                  <h2
                    id="curriculum-heading"
                    className="text-xl font-bold text-gray-900 mb-4 sr-only"
                  >
                    Course Curriculum
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                  >
                    {Array.isArray(courseDetails?.chapters) &&
                    courseDetails.chapters.length > 0 ? (
                      courseDetails.chapters.map((chapter, index) => (
                        <AccordionItem
                          key={index}
                          value={`chapter-${index}`}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <AccordionTrigger
                            className="py-4 px-4 hover:bg-gray-50 transition-colors group"
                            aria-expanded="false"
                          >
                            <div className="flex items-center gap-3 text-left flex-1">
                              <ChevronDown
                                className="h-5 w-5 text-gray-500 transition-transform group-data-[state=open]:rotate-180"
                                aria-hidden="true"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {chapter.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {chapter.lessons?.length || 0} lesson
                                  {chapter.lessons?.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="px-4 pb-4 bg-gray-50 space-y-3">
                            {Array.isArray(chapter.lessons) &&
                            chapter.lessons.length > 0 ? (
                              <div className="space-y-3">
                                {chapter.lessons.map((lesson, i) => (
                                  <Collapsible key={i}>
                                    <CollapsibleTrigger
                                      className="w-full flex items-center justify-between text-left p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow group"
                                      aria-expanded="false"
                                    >
                                      <div className="flex items-center gap-2">
                                        <ChevronDown
                                          className="h-4 w-4 text-gray-500 transition-transform group-data-[state=open]:rotate-180"
                                          aria-hidden="true"
                                        />
                                        <span className="text-sm font-medium text-gray-800">
                                          {lesson.title}
                                        </span>
                                      </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="mt-2 p-3 bg-white rounded-lg border border-gray-200 space-y-3">
                                      {lesson.description && (
                                        <div>
                                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                            Description
                                          </h4>
                                          <p className="text-sm text-gray-700 leading-relaxed">
                                            {lesson.description}
                                          </p>
                                        </div>
                                      )}

                                      {lesson.youtubeLinks && (
                                        <button
                                          disabled
                                          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                                          aria-label="Video access restricted"
                                          title="Log in to access video content"
                                        >
                                          <PlayCircle
                                            size={16}
                                            aria-hidden="true"
                                          />
                                          Watch Video
                                        </button>
                                      )}

                                      {Array.isArray(lesson.pdfFiles) &&
                                        lesson.pdfFiles.length > 0 && (
                                          <div className="space-y-2">
                                            <p className="text-sm font-semibold text-gray-900">
                                              Materials
                                            </p>
                                            <div className="space-y-1">
                                              {lesson.pdfFiles.map(
                                                (pdf, idx) => (
                                                  <button
                                                    key={idx}
                                                    disabled
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                                                    aria-label={`PDF file ${
                                                      idx + 1
                                                    } access restricted`}
                                                    title="Log in to access PDF files"
                                                  >
                                                    📄{" "}
                                                    {pdf.filename ||
                                                      `Document ${idx + 1}`}
                                                  </button>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </CollapsibleContent>
                                  </Collapsible>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600">
                                No lessons available
                              </p>
                            )}

                            {Array.isArray(chapter.Assessment) &&
                              chapter.Assessment.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    Assessments
                                  </h4>
                                  {chapter.Assessment.map((assess, j) => (
                                    <div
                                      key={j}
                                      className="text-sm text-gray-700"
                                    >
                                      <span className="font-medium">
                                        {assess.title}
                                      </span>
                                      {assess.description && (
                                        <p className="text-xs text-gray-600 italic mt-1">
                                          {assess.description}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </AccordionContent>
                        </AccordionItem>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">
                        No chapters available
                      </p>
                    )}
                  </Accordion>
                </section>
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent id={instructorId} value="instructor" className="p-6">
                <section aria-labelledby="instructor-heading">
                  <h2 id="instructor-heading" className="sr-only">
                    About the Instructor
                  </h2>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 flex-shrink-0 ring-2 ring-green-600">
                      <AvatarImage
                        src={courseDetails.createdby.profileImg?.url || avatar}
                        alt={instructorName}
                        className="object-cover rounded-full"
                      />
                      <AvatarFallback className="bg-green-100 text-green-700 font-bold text-lg">
                        {instructorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {instructorName}
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-700">
                          Instructor
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <PlayCircle
                          size={16}
                          className="text-gray-600"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-700">5 Courses</span>
                      </div>
                      {courseDetails.createdby.bio && (
                        <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                          {courseDetails.createdby.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </article>
        </div>

        {/* Sidebar */}
        <aside
          id={sidebarId}
          className="lg:col-span-1"
          aria-label="Course details sidebar"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6 space-y-6">
            {/* Price Section */}
            <div className="space-y-4">
              <div
                className="text-3xl font-bold text-green-600"
                aria-describedby={priceErrorId}
              >
                {courseDetails.basics?.price ? (
                  courseDetails.basics.price.discounted !== undefined ? (
                    <span>${courseDetails.basics.price.discounted}</span>
                  ) : (
                    <span>${courseDetails.basics.price}</span>
                  )
                ) : (
                  <span className="text-gray-500 text-lg">
                    Price unavailable
                  </span>
                )}
              </div>

              <Button
                className="w-full text-white text-base py-3 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-800 focus:outline-none focus:ring-offset-2 rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
                aria-label="Add this course to shopping cart"
              >
                <ShoppingCart size={18} aria-hidden="true" />
                Add to Cart
              </Button>
            </div>

            {/* Course Includes */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="font-semibold text-gray-900">
                This course includes:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <PlayCircle
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700">
                    {courseDetails.videoHours || "0"} hours on-demand video
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700">
                    Full lifetime access
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700">
                    Access on mobile and desktop
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700">
                    {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700">
                    {totalAssessments} assessment
                    {totalAssessments !== 1 ? "s" : ""}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700">
                    {courseDetails.level || "All"} level
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default GeneralCourseDetail;
