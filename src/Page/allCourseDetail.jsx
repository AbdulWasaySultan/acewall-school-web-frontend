import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  CheckCircle2,
  ChevronDown,
  Loader,
  PlayCircle,
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
import PurchaseConfirmationModal from "@/CustomComponent/Student/ConfirmationModal";
import { toast } from "sonner";
import avatar from "@/assets/avatar.png";
import RatingSection from "@/CustomComponent/teacher/RatingSection";
import TeacherProfileModal from "@/CustomComponent/Student/Teacherprofilemodal";

/**
 * AllCoursesDetail — accessible version
 *
 * Accessibility notes:
 * - Tab triggers have id="tab-<name>" and panels have id="panel-<name>"
 *   with aria-controls / aria-labelledby.
 * - TabsList uses role="tablist"; TabsTrigger uses role="tab".
 * - Accordion triggers and contents include aria-controls / aria-expanded and role="region".
 * - Images and Avatars include meaningful alt text and fallbacks.
 * - Clickable instructor name is a <button> (keyboard accessible).
 * - Loading spinner has role="status" and an offscreen label for screen readers.
 */

const AllCoursesDetail = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getCourseDetails = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/course/get/${id}`);
        setCourseDetails(res.data.course);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setCourseDetails(null);
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    getCourseDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10" role="status" aria-live="polite">
        <section className="flex justify-center items-center h-full w-full" aria-hidden="false">
          <Loader className="animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading course details…</span>
        </section>
      </div>
    );

  if (!courseDetails)
    return (
      <div role="alert" className="p-6 text-red-500">
        Course not found.
      </div>
    );

  const instructor = courseDetails?.createdby || {};
  const tabListClassName =
    "grid grid-cols-5 gap-2 bg-transparent border-b border-gray-200 border-t border-gray-200 w-full text-green-600";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="grid lg:grid-cols-3 w-full gap-2">
        <div className="lg:col-span-2 w-full">
          <main aria-labelledby="course-title" className="px-2 overflow-hidden mb-6">
            <header className="p-2">
              <h1 id="course-title" className="text-3xl font-bold mb-2">
                {courseDetails.courseTitle}
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                {courseDetails.courseDescription}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 rounded-full">
                    <AvatarImage
                      src={instructor?.profileImg?.url || avatar}
                      alt={
                        instructor.firstName || instructor.lastName
                          ? `Instructor ${instructor.firstName || ""} ${instructor.lastName || ""}`.trim()
                          : "Instructor avatar"
                      }
                      className="h-10 w-10 object-cover rounded-full"
                    />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>

                  <div className="ml-2">
                    <div className="text-sm font-medium">
                      {instructor.firstName} {instructor.middleName}{" "}
                      {instructor.lastName}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex flex-col items-center justify-center">
              <div className="relative h-60 w-full mx-auto">
                <img
                  src={courseDetails.thumbnail?.url || "/default-thumbnail.jpg"}
                  alt={
                    courseDetails.courseTitle
                      ? `Thumbnail for ${courseDetails.courseTitle}`
                      : "Course preview"
                  }
                  className="w-full rounded-md shadow-md h-full object-cover"
                />
              </div>

              <section
                aria-labelledby="course-tabs-heading"
                className="w-full px-2 py-5"
              >
                <h2 id="course-tabs-heading" className="sr-only">
                  Course sections
                </h2>

                <Tabs defaultValue="overview" asChild>
                  <div>
                    <TabsList className={tabListClassName} role="tablist" aria-label="Course sections">
                      <TabsTrigger
                        value="overview"
                        id="tab-overview"
                        aria-controls="panel-overview"
                        role="tab"
                        data-state="inactive"
                        className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none py-2"
                      >
                        Overview
                      </TabsTrigger>

                      <TabsTrigger
                        value="curriculum"
                        id="tab-curriculum"
                        aria-controls="panel-curriculum"
                        role="tab"
                        data-state="inactive"
                        className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none py-2"
                      >
                        Curriculum
                      </TabsTrigger>

                      <TabsTrigger
                        value="instructor"
                        id="tab-instructor"
                        aria-controls="panel-instructor"
                        role="tab"
                        data-state="inactive"
                        className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none py-2"
                      >
                        Instructor
                      </TabsTrigger>

                      <TabsTrigger
                        value="syllabus"
                        id="tab-syllabus"
                        aria-controls="panel-syllabus"
                        role="tab"
                        data-state="inactive"
                        className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none py-2"
                      >
                        Syllabus
                      </TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent
                      value="overview"
                      id="panel-overview"
                      role="tabpanel"
                      aria-labelledby="tab-overview"
                      className="p-2"
                    >
                      <h3 className="text-lg font-bold mb-4">Description</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {courseDetails.courseDescription}
                      </p>

                      <h3 className="text-lg font-bold mt-8 mb-4">
                        What you will learn in this course
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Array.isArray(courseDetails?.teachingPoints) &&
                          courseDetails.teachingPoints.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle2
                                size={20}
                                className="text-green-500 mt-0.5"
                                aria-hidden="true"
                              />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                      </div>

                      <h3 className="text-lg font-bold mt-8 mb-4">
                        Course requirements
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Array.isArray(courseDetails?.requirements) &&
                          courseDetails.requirements.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle2
                                size={20}
                                className="text-green-500 mt-0.5"
                                aria-hidden="true"
                              />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                      </div>
                    </TabsContent>

                    {/* Curriculum */}
                    <TabsContent
                      value="curriculum"
                      id="panel-curriculum"
                      role="tabpanel"
                      aria-labelledby="tab-curriculum"
                      className="p-6"
                    >
                      <Accordion type="single" collapsible className="w-full" asChild>
                        <div>
                          {Array.isArray(courseDetails?.chapters) &&
                          courseDetails.chapters.length > 0 ? (
                            courseDetails.chapters.map((chapter, index) => {
                              const triggerId = `chapter-trigger-${index}`;
                              const panelId = `chapter-panel-${index}`;
                              return (
                                <AccordionItem key={index} value={`chapter-${index}`}>
                                  <AccordionTrigger
                                    id={triggerId}
                                    aria-controls={panelId}
                                    // Radix sets data-state; aria-expanded will be updated automatically by the browser if trigger is a button and controls the panel
                                    role="button"
                                    className="py-4 text-sm font-semibold flex justify-between items-center group"
                                  >
                                    <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
                                    <span>{chapter.title}</span>
                                  </AccordionTrigger>

                                  <AccordionContent
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={triggerId}
                                  >
                                    <div className="my-2 flex flex-col gap-2">
                                      <span className="font-bold">Description</span>
                                      <span className="text-sm text-gray-700">
                                        {chapter.description}
                                      </span>
                                    </div>

                                    <div className="space-y-4 pl-6">
                                      {Array.isArray(chapter.lessons) &&
                                      chapter.lessons.length > 0 ? (
                                        chapter.lessons.map((lesson, i) => {
                                          const collapsibleId = `lesson-${index}-${i}`;
                                          return (
                                            <Collapsible key={collapsibleId} asChild>
                                              <div>
                                                <CollapsibleTrigger
                                                  aria-controls={`${collapsibleId}-panel`}
                                                  id={`${collapsibleId}-trigger`}
                                                  role="button"
                                                  className="w-full flex items-center justify-between text-left group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
                                                    <span className="text-sm font-medium text-gray-800">
                                                      {lesson.title}
                                                    </span>
                                                  </div>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent
                                                  id={`${collapsibleId}-panel`}
                                                  role="region"
                                                  aria-labelledby={`${collapsibleId}-trigger`}
                                                  className="mt-3 rounded-lg bg-gray-50 border border-gray-200 p-4 shadow-inner space-y-3"
                                                >
                                                  <span className="font-bold">Description</span>
                                                  {lesson.description && (
                                                    <div
                                                      className="text-sm text-gray-700 leading-relaxed"
                                                      dangerouslySetInnerHTML={{
                                                        __html: lesson.description,
                                                      }}
                                                    />
                                                  )}

                                                  {lesson.youtubeLinks && (
                                                    <span
                                                      className="inline-block text-sm text-gray-400 font-medium cursor-not-allowed"
                                                      title="Access restricted"
                                                      aria-disabled="true"
                                                    >
                                                      ▶ Watch Video
                                                    </span>
                                                  )}

                                                  {Array.isArray(lesson.pdfFiles) &&
                                                    lesson.pdfFiles.length > 0 && (
                                                      <div className="text-sm text-gray-400 space-y-1 cursor-not-allowed">
                                                        {lesson.pdfFiles.map((pdf, idx) => (
                                                          <div key={idx}>
                                                            <span
                                                              className="text-gray-400 hover:underline"
                                                              title="Access restricted"
                                                              aria-disabled="true"
                                                            >
                                                              📄 View PDF {idx + 1}
                                                            </span>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                </CollapsibleContent>
                                              </div>
                                            </Collapsible>
                                          );
                                        })
                                      ) : (
                                        <div className="text-sm text-gray-500">No lessons available</div>
                                      )}
                                    </div>

                                    {Array.isArray(chapter.Assessment) && chapter.Assessment.length > 0 && (
                                      <div className="mt-6 border-t pt-4 space-y-2 pl-6">
                                        <div className="text-sm font-medium text-gray-700">Assessment</div>
                                        {chapter.Assessment.map((assess, j) => (
                                          <div key={j} className="text-sm text-gray-600">
                                            {assess.title} — <span className="italic">{assess.description}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })
                          ) : (
                            <div className="text-sm text-gray-500">No chapters available</div>
                          )}
                        </div>
                      </Accordion>
                    </TabsContent>

                    {/* Instructor */}
                    <TabsContent
                      value="instructor"
                      id="panel-instructor"
                      role="tabpanel"
                      aria-labelledby="tab-instructor"
                      className="p-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-6">
                        <Avatar className="h-15 w-15 shadow-md ring-green-500 ring-3 rounded-full">
                          <AvatarImage
                            src={instructor?.profileImg?.url || avatar}
                            alt={
                              instructor.firstName || instructor.lastName
                                ? `Instructor ${instructor.firstName || ""} ${instructor.lastName || ""}`.trim()
                                : "Instructor avatar"
                            }
                            className="h-15 w-15 object-cover rounded-full"
                          />
                          <AvatarFallback className="h-20 w-20 flex items-center justify-center rounded-full bg-gray-200 text-lg font-semibold">
                            {instructor.firstName?.charAt(0)}
                            {instructor.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          {/* Use a button for accessible interaction */}
                          <button
                            type="button"
                            className="text-xl font-semibold text-gray-900 cursor-pointer hover:underline bg-transparent border-0 p-0"
                            onClick={() => setIsModalOpen(true)}
                            aria-haspopup="dialog"
                            aria-controls="teacher-profile-modal"
                            aria-label={`Open profile for ${instructor.firstName} ${instructor.lastName}`}
                          >
                            {instructor.firstName} {instructor.middleName} {instructor.lastName}
                          </button>

                          <p className="text-gray-700 text-sm mt-4 leading-relaxed">
                            {instructor.Bio || "No bio provided."}
                          </p>
                        </div>
                      </div>

                      <TeacherProfileModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        instructor={instructor}
                        avatar={avatar}
                      />
                    </TabsContent>

                    {/* Syllabus */}
                    <TabsContent
                      value="syllabus"
                      id="panel-syllabus"
                      role="tabpanel"
                      aria-labelledby="tab-syllabus"
                      className="py-8 space-y-6"
                    >
                      <h3 className="text-2xl font-semibold">Course Syllabus</h3>

                      {courseDetails?.syllabus?.url ? (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <p className="text-md mb-4">{courseDetails?.syllabus?.name}</p>

                          <div className="w-full h-[600px] rounded-md border overflow-hidden">
                            {/* Iframe with title for screen readers */}
                            <iframe
                              src={courseDetails.syllabus.url}
                              title={`${courseDetails.courseTitle || "Course"} syllabus`}
                              className="w-full h-full rounded-md border"
                              aria-describedby="syllabus-desc"
                            />
                          </div>

                          <div className="mt-4">
                            <a
                              href={courseDetails.syllabus.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 underline font-medium"
                            >
                              Download Syllabus
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No syllabus uploaded for this course.</p>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </section>
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <aside aria-labelledby="course-purchase-heading" className="md:col-span-1">
          <div className="border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm hover:shadow-lg transition-shadow duration-300 w-full" role="complementary">
            <h2 id="course-purchase-heading" className="sr-only">Course purchase and details</h2>

            <div className="flex flex-col gap-6 mb-6">
              <PurchaseConfirmationModal courseID={courseDetails._id} />
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-800">This course includes:</div>

              <div className="flex items-start gap-2 text-gray-700">
                <PlayCircle size={18} className="mt-0.5" aria-hidden="true" />
                <span className="text-sm">
                  {courseDetails.videoHours || 0} hours on-demand video
                </span>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 size={18} className="mt-0.5" aria-hidden="true" />
                <span className="text-sm">Full lifetime access</span>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 size={18} className="mt-0.5" aria-hidden="true" />
                <span className="text-sm">Access on mobile and web</span>
              </div>

              {Array.isArray(courseDetails?.chapters) && courseDetails.chapters.length > 0 && (
                <div className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 size={18} className="mt-0.5" aria-hidden="true" />
                  <span className="text-sm">
                    Includes {courseDetails.chapters.length}{" "}
                    {courseDetails.chapters.length > 1 ? "chapters" : "chapter"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AllCoursesDetail;
