import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Loader } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import RatingSectionTeacher from "@/CustomComponent/Student/RatingSectionTeacher";
import CommentSection from "@/CustomComponent/Student/CommentSection";
import RatingStars from "@/CustomComponent/RatingStars";
import BackButton from "@/CustomComponent/BackButton";
import avatar from "@/assets/avatar.png";
import { format } from "date-fns";
import { CourseContext } from "@/Context/CoursesProvider";

export default function StdPreview2() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const Navigate = useNavigate();
  const { quarters, setQuarters } = useContext(CourseContext);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/course/getstdprew/${id}`);
      setCourse(res.data.course);
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const handleConversation = async () => {
    if (!course) return;
    await axiosInstance
      .post("conversation/create", {
        memberId: course?.createdby._id,
      })
      .then(() => Navigate("/student/messages"))
      .catch((err) => console.log(err));
  };

  // LOADING — ADA Compliant
  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="status"
        aria-live="polite"
      >
        <Loader className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading course details…</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center" role="alert">
        Course not found.
      </div>
    );
  }

  return (
    <main
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      role="main"
      aria-label="Course preview"
    >
      <BackButton className="mb-10" aria-label="Go back to previous page" />

      {/* COURSE HEADER */}
      <header
        className="space-y-6 bg-cover bg-center bg-no-repeat px-6 py-10 rounded-lg"
        style={{ backgroundImage: `url(${course.thumbnail?.url})` }}
      >
        <div className="bg-[#ffffffa0] backdrop-filter backdrop-blur-xs p-6 rounded-lg space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            {course.courseTitle}
          </h1>

          <p className="text-gray-900 font-medium leading-relaxed">
            {course.courseDescription}
          </p>

          <div className="flex items-center gap-10 mt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900 text-sm font-semibold mb-1">
                Topics
              </h3>
              <Badge className="bg-green-100 text-green-800 text-sm border-none">
                {course?.category?.title}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-gray-900 text-sm font-semibold mb-1">
                SubTopics
              </h3>
              <Badge className="bg-green-100 text-green-800 text-sm border-none">
                {course?.subcategory?.title}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* INSTRUCTOR INFO */}
      <section
        className="flex items-center justify-between mt-6"
        aria-labelledby="instructor-info-title"
      >
        <h2 id="instructor-info-title" className="sr-only">
          Instructor Information
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-15 w-15 rounded-full bg-cover bg-center">
            <AvatarImage
              src={course?.createdby?.profileImg?.url || avatar}
              alt={`Profile picture of ${course.createdby.firstName} ${course.createdby.lastName}`}
              className="h-full w-full rounded-full"
            />
            <AvatarFallback aria-hidden="true">
              {course.createdby.firstName.charAt(0)}
              {course.createdby.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-gray-800">
              {course.createdby.firstName} {course.createdby.middleName}{" "}
              {course.createdby.lastName}
            </p>
            <p className="text-sm text-gray-500">{course.createdby.email}</p>
          </div>
        </div>

        <div>
          <Button className="bg-green-500" disabled aria-disabled="true">
            Message
          </Button>
        </div>
      </section>

      {/* SEMESTERS */}
      <section
        className="mt-8"
        aria-labelledby="semester-list-title"
        role="region"
      >
        <h2 id="semester-list-title" className="sr-only">
          Semester List
        </h2>

        {course?.semester?.map((semester) => (
          <Link
            key={semester._id}
            to={`/teacher/courses/${course._id}/semesterstdPre/${semester._id}`}
          >
            <div className="mb-4 border border-gray-200 p-5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <h3 className="font-semibold text-md">
                Semester: {semester.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(semester.startDate ? semester.startDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")} –{" "}
                {format(new Date(semester.endDate ? semester.endDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-12 bg-white z-10"
        aria-label="Course content navigation"
      >
        <TabsList className="flex flex-wrap justify-center gap-4 w-full sm:gap-10 bg-white p-1 shadow-inner">
          {["Overview", "Syllabus"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="px-3 py-2 text-base font-medium capitalize transition-all duration-300  
                text-gray-700 hover:text-green-600 hover:bg-gray-50 
                data-[state=active]:bg-gray-100 data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
              aria-label={`${tab} tab`}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="py-8 space-y-10">
          <section aria-labelledby="learn-title">
            <h2 id="learn-title" className="text-2xl font-semibold mb-4">
              What You'll Learn
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course?.teachingPoints?.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="requirements-title">
            <h2 id="requirements-title" className="text-2xl font-semibold mb-4">
              Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course?.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" aria-hidden="true" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Unenroll section */}
          <section>
            <Button
              className="bg-green-500"
              disabled
              aria-disabled="true"
              aria-label="You are already enrolled in this course"
            >
              Unenroll
            </Button>
          </section>
        </TabsContent>

        {/* SYLLABUS */}
        <TabsContent value="syllabus" className="py-8 space-y-6">
          <h2 className="text-2xl font-semibold">Course Syllabus</h2>

          {course?.syllabus?.url ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-md mb-4">{course?.syllabus?.name}</p>

              <iframe
                src={course.syllabus.url}
                title="Course syllabus PDF"
                className="w-full h-[600px] rounded-md border"
              ></iframe>

              <div className="mt-4">
                <a
                  href={course.syllabus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline font-medium"
                  aria-label="Download syllabus PDF"
                >
                  Download Syllabus
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No syllabus uploaded for this course.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
