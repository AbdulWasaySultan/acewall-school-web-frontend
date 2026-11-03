import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CheckCircle2, ChevronDown, Loader, PlayCircle } from "lucide-react";
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

const StdPreview = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourseDetails = async () => {
      setLoading(true);

      axiosInstance
        .get(`/course/get/${id}`)
        .then((res) => {
          setCourseDetails(res.data.course);
          setLoading(false);
        })
        .catch(() => {
          setCourseDetails(null);
          setLoading(false);
        });
    };

    getCourseDetails();
  }, [id]);

  // LOADING STATE – ADA compliant
  if (loading)
    return (
      <div
        className="flex justify-center items-center py-10"
        role="status"
        aria-live="polite"
      >
        <Loader className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading course details…</span>
      </div>
    );

  if (!courseDetails)
    return (
      <div className="p-6 text-red-500" role="alert" aria-live="assertive">
        Course not found.
      </div>
    );

  return (
    <main className="flex flex-col lg:flex-row min-h-screen" role="main">
      <div className="grid lg:grid-cols-3 w-full gap-2">
        <div className="lg:col-span-2 w-full">
          <div className="px-2 overflow-hidden mb-6">
            {/* BACK BUTTON */}
            <div className="mb-4">
              <Button
                variant="outline"
                aria-label="Go back to previous page"
                className="bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => navigate(-1)}
              >
                ← Back
              </Button>
            </div>

            {/* COURSE HEADER */}
            <header className="p-2">
              <h1 className="text-3xl font-bold mb-2">
                {courseDetails.courseTitle}
              </h1>

              <p className="text-gray-600 text-sm mb-4">
                {courseDetails.courseDescription}
              </p>

              {/* INSTRUCTOR INFO */}
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage
                    src={courseDetails?.createdby?.profileImg?.url || avatar}
                    alt="Instructor profile image"
                    className="h-10 w-10 object-cover rounded-full"
                  />
                  <AvatarFallback aria-hidden="true">IN</AvatarFallback>
                </Avatar>

                <div className="ml-2">
                  <div className="text-sm font-medium">
                    {courseDetails.createdby.firstName}{" "}
                    {courseDetails.createdby.middleName}{" "}
                    {courseDetails.createdby.lastName}
                  </div>
                </div>
              </div>
            </header>

            {/* THUMBNAIL */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-60 w-full mx-auto">
                <img
                  src={courseDetails.thumbnail.url}
                  alt={`${courseDetails.courseTitle} course thumbnail`}
                  className="w-full rounded-md shadow-md h-full object-cover"
                />
              </div>

              {/* TABS */}
              <Tabs defaultValue="overview" className="w-full px-2 py-5">
                <TabsList
                  className="grid grid-cols-3 border-b border-gray-200 w-full"
                  aria-label="Course content navigation tabs"
                >
                  <TabsTrigger
                    value="overview"
                    aria-label="Overview Tab"
                    className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none"
                  >
                    Overview
                  </TabsTrigger>

                  <TabsTrigger
                    value="curriculum"
                    aria-label="Curriculum Tab"
                    className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none"
                  >
                    Curriculum
                  </TabsTrigger>

                  <TabsTrigger
                    value="instructor"
                    aria-label="Instructor Tab"
                    className="data-[state=active]:border-b-3 data-[state=active]:border-green-500 rounded-none"
                  >
                    Instructor
                  </TabsTrigger>
                </TabsList>

                {/* OVERVIEW */}
                <TabsContent value="overview" className="p-2">
                  <h2 className="text-lg font-bold mb-4">Description</h2>

                  <p className="text-gray-600 text-sm mb-4">
                    {courseDetails.courseDescription}
                  </p>

                  <h2 className="text-lg font-bold mt-8 mb-4">
                    What you will learn
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    {courseDetails.teachingPoints?.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2
                          aria-hidden="true"
                          className="text-green-500 mt-0.5"
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-lg font-bold mt-8 mb-4">
                    Course requirements
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    {courseDetails.requirements?.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2
                          aria-hidden="true"
                          className="text-green-500 mt-0.5"
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* CURRICULUM */}
                <TabsContent value="curriculum" className="p-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    aria-label="Course chapters list"
                  >
                    {courseDetails.chapters?.length ? (
                      courseDetails.chapters.map((chapter, index) => (
                        <AccordionItem key={index} value={`chapter-${index}`}>
                          <AccordionTrigger
                            className="py-4 text-sm font-semibold flex justify-between items-center group"
                            aria-label={`Open chapter: ${chapter.title}`}
                          >
                            <ChevronDown
                              className="h-5 w-5 text-gray-500 transition-transform group-data-[state=open]:rotate-180"
                              aria-hidden="true"
                            />
                            <span>{chapter.title}</span>
                          </AccordionTrigger>

                          <AccordionContent>
                            <div className="my-2">
                              <span className="font-bold">Description</span>
                              <p className="text-sm text-gray-700">
                                {chapter.description}
                              </p>
                            </div>

                            <div className="space-y-4 pl-6">
                              {chapter.lessons?.length ? (
                                chapter.lessons.map((lesson, i) => (
                                  <Collapsible key={i}>
                                    <CollapsibleTrigger
                                      className="w-full flex items-center justify-between text-left group bg-white p-4 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
                                      aria-label={`Toggle lesson: ${lesson.title}`}
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

                                    <CollapsibleContent className="mt-3 rounded-lg bg-gray-50 border border-gray-200 p-4 shadow-inner space-y-3">
                                      <span className="font-bold">
                                        Description
                                      </span>
                                      {lesson.description && (
                                        <p
                                          className="text-sm text-gray-700 leading-relaxed"
                                          dangerouslySetInnerHTML={{
                                            __html: lesson.description,
                                          }}
                                        />
                                      )}
                                    </CollapsibleContent>
                                  </Collapsible>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No lessons available.
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No chapters available.
                      </p>
                    )}
                  </Accordion>
                </TabsContent>

                {/* INSTRUCTOR */}
                <TabsContent value="instructor" className="p-6">
                  <h2 className="sr-only">Instructor Information</h2>

                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <Avatar className="h-15 w-15 shadow-md ring-green-500 ring-3 rounded-full">
                      <AvatarImage
                        src={
                          courseDetails?.createdby?.profileImg?.url || avatar
                        }
                        alt="Instructor profile photo"
                        className="h-15 w-15 object-cover rounded-full"
                      />
                      <AvatarFallback>
                        {courseDetails.createdby.firstName.charAt(0)}
                        {courseDetails.createdby.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {courseDetails.createdby.firstName}{" "}
                        {courseDetails.createdby.middleName}{" "}
                        {courseDetails.createdby.lastName}
                      </h3>

                      <p className="text-gray-700 text-sm mt-4 leading-relaxed">
                        {courseDetails.createdby.Bio || "No bio provided."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="md:col-span-1" aria-label="Course purchase panel">
          <div className="border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm hover:shadow-lg transition-shadow w-full">
            <div className="flex flex-col gap-6 mb-6">
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="Enroll now in the course"
              >
                Enroll Now
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">
                This course includes:
              </h3>

              <div className="flex items-start gap-2 text-gray-700">
                <PlayCircle aria-hidden="true" size={18} />
                <span className="text-sm">
                  {courseDetails.videoHours} hours on-demand video
                </span>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 aria-hidden="true" size={18} />
                <span className="text-sm">Full lifetime access</span>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <CheckCircle2 aria-hidden="true" size={18} />
                <span className="text-sm">Access on mobile and web</span>
              </div>

              {courseDetails.chapters?.length > 0 && (
                <div className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span className="text-sm">
                    {courseDetails.chapters.length}{" "}
                    {courseDetails.chapters.length > 1 ? "chapters" : "chapter"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default StdPreview;
