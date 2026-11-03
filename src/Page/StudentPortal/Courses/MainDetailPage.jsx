import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Star,
  Users,
  BookOpen,
  Clock,
  Send,
  Loader,
  BookOpenCheck,
  Video,
  Calendar,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import RatingStars from "@/CustomComponent/RatingStars";
import CommentSection from "@/CustomComponent/Student/CommentSection";
import RatingSection from "@/CustomComponent/Student/RatingSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import avatar from "@/assets/avatar.png";
import { format } from "date-fns";
import { CourseContext } from "@/Context/CoursesProvider";
import { GlobalContext } from "@/Context/GlobalProvider";

const ReadMore = ({ text = "", maxLength = 500 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text)
    return <p className="text-black">Course description goes here...</p>;

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const displayText = isExpanded ? text : text.slice(0, maxLength);

  return (
    <div>
      <p className="text-muted-foreground">
        {displayText}
        {text.length > maxLength && !isExpanded && "..."}
      </p>
      {text.length > maxLength && (
        <button
          onClick={toggleReadMore}
          aria-expanded={isExpanded}
          className="text-green-700 text-sm hover:underline mt-1"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default function CourseOverview() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [showModal, setShowModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const navigate = useNavigate();
  const { quarters, setQuarters } = useContext(CourseContext);
  const { user, checkAuth } = useContext(GlobalContext);
  const [hasActiveMeeting, setHasActiveMeeting] = useState(false);

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  console.log(courseId, "courseId");

  useEffect(() => {
    const getCourseDetails = async () => {
      setLoading(true);
      await axiosInstance
        .get(`/enrollment/studentCourseDetails/${id}/${courseId}`)
        // .get(`/enrollment/studentCourseDetails/${id}`)
        .then((res) => {
          console.log(res);
          setCourse(res.data.enrolledCourse.courseDetails);
          setQuarters(res.data.enrolledCourse.courseDetails.quarter);
          setLoading(false);
          console.log(res.data.enrolledCourse.courseDetails, "course");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getCourseDetails();
  }, [id]);

  useEffect(() => {
    if (course?._id) {
      axiosInstance
        .get(`/zoom/course/${course._id}`)
        .then((res) => {
          const active = res.data.some(
            (m) => m.status === "active" || m.status === "started"
          );
          setHasActiveMeeting(active);
        })
        .catch(console.error);
    }
  }, [course]);

  const handleConversation = async () => {
    await axiosInstance
      .post("conversation/create", {
        memberId: course?.createdby._id,
      })
      .then((res) => {
        console.log(res);
        navigate("/student/messages");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnenroll = async () => {
    setLoading(true); // instantly trigger loading

    try {
      console.log("Unenrolling from course ID:", course._id);
      const res = await axiosInstance.delete(
        `/enrollment/unenroll/${course?._id}`
      );
      console.log("Unenrolled data:", res.data);
      setShowModal(false);
      window.location.reload(); // refresh page
    } catch (err) {
      console.error("Unenrollment failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewSignOut = async () => {
    try {
      await axiosInstance.post("auth/previewSignOut").then(() => {
        checkAuth();
        navigate(`/teacher/courses/courseDetail/${course._id}`);
      });
    } catch (error) {
      console.error("Preview signin failed:", error);
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="status"
        aria-live="polite"
      >
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="p-6 text-center">Course not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      {/* Course Header */}
      {user?.role === "teacherAsStudent" && (
        <Button
          className={
            "mb-4 bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
          }
          onClick={handlePreviewSignOut}
        >
          View As Teacher
        </Button>
      )}

      <div
        className="space-y-6 bg-cover bg-center bg-no-repeat px-6 py-10 rounded-lg"
        style={{
          backgroundImage: `url(${course.thumbnail?.url})`,
        }}
      >
        <div className="bg-[#ffffffa0] backdrop-filter backdrop-blur-xs bg-backdrop-blur-md p-6 rounded-lg space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            {course.courseTitle}
          </h1>

          <p className="text-gray-900 font-medium leading-relaxed">
            <ReadMore text={course?.courseDescription} />
          </p>

          <div className="flex items-center gap-8 mt-4">
            {course.category && (
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900 text-sm font-semibold mb-1">
                  Topics
                </h3>
                <Badge className="bg-green-100 text-green-800 text-sm border-none">
                  {course?.category?.title}
                </Badge>
              </div>
            )}
            {course?.subcategory && (
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900 text-sm font-semibold mb-1">
                  SubTopics
                </h3>
                <Badge className="bg-green-100 text-green-800 text-sm border-none">
                  {course?.subcategory?.title}
                </Badge>
              </div>
            )}{" "}
            {course?.courseCode && (
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900 text-sm font-semibold mb-1">
                  Course Code
                </h3>
                <Badge className="bg-green-100 text-green-800 text-sm border-none">
                  {course?.courseCode}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructor Info */}

      {course.createdby && Object.keys(course.createdby).length === 0 ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
          <Avatar className="h-15 w-15 rounded-full bg-cover bg-center">
            <AvatarImage
              src={course?.createdby?.profileImg?.url || avatar}
              alt={`${course.createdby.firstName} ${course.createdby.lastName} profile picture`}
              className="h-full w-full bg-cover bg-center rounded-full"
            />
            <AvatarFallback>N/A</AvatarFallback>
          </Avatar>
          <div className="text-center my-10">
            Instructor information not available.
          </div>
        </div>
      ) : (
        <section className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
            <Avatar className="h-15 w-15 rounded-full bg-cover bg-center">
              <AvatarImage
                src={course?.createdby?.profileImg?.url || avatar}
                alt={`${course.createdby?.firstName} ${course.createdby?.lastName}`}
                className="h-full w-full bg-cover bg-center rounded-full"
              />
              <AvatarFallback>
                {course.createdby?.firstName?.charAt(0)}
                {course.createdby?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-800">
                {course.createdby?.firstName} {course.createdby?.middleName}{" "}
                {course.createdby?.lastName}
              </p>
              <p className="text-sm text-gray-500">{course.createdby?.email}</p>
            </div>
          </div>
          <div>
            <Button
              className="bg-green-500"
              onClick={() => handleConversation()}
            >
              Message
            </Button>
          </div>
          {/* Change this part around line 288 */}
          <div className="flex items-center gap-3">
            <Button
              className={`flex items-center gap-2 shadow-lg transition-all duration-300 ${hasActiveMeeting
                ? "bg-red-600 hover:bg-red-700 animate-pulse ring-2 ring-red-400 ring-offset-2"
                : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              onClick={() => {
                navigate(`/student/mycourses/live-list/${course._id}`);
              }}
            >
              <Video size={18} />
              {hasActiveMeeting ? "JOIN LIVE CLASS NOW" : "Live Meetings Schedule"}
            </Button>
            <Button
              className="flex items-center gap-2 shadow-lg bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                navigate(`/student/mycourses/${course._id}/pacing-chart`);
              }}
            >
              <Calendar size={18} />
              Course Pacing Chart
            </Button>
          </div>
        </section>
      )}

      {/* Course Semester */}
      <section className="mt-8">
        {course?.semester?.map((semester, index) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(
                `/student/mycourses/${course._id}/semester/${semester._id}`
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate(
                  `/student/mycourses/${course._id}/semester/${semester._id}`
                );
            }}
          >
            <div
              key={semester._id}
              className="mb-4 border border-gray-200 p-5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              <h3 className="font-semibold text-md">
                Semester: {semester.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(semester.startDate ? semester.startDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")} -{" "}
                {format(new Date(semester.endDate ? semester.endDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-12 bg-white z-10"
      >
        {/* Tab List */}
        <TabsList className="flex flex-wrap justify-center gap-4 w-full sm:gap-10 bg-white p-1 shadow-inner">
          {/* Always show Overview */}
          <TabsTrigger
            value="overview"
            className="px-3 py-2 text-base font-medium capitalize transition-all duration-300  
        text-gray-700 hover:text-green-600 hover:bg-gray-50 
        data-[state=active]:bg-gray-100 data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>

          {/* Show Reviews tab only if enabled */}
          {course?.commentsEnabled && (
            <TabsTrigger
              value="reviews"
              className="px-3 py-2 text-base font-medium capitalize transition-all duration-300  
          text-gray-700 hover:text-green-600 hover:bg-gray-50 
          data-[state=active]:bg-gray-100 data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
            >
              Reviews
            </TabsTrigger>
          )}

          {/* Always show Syllabus */}
          <TabsTrigger
            value="syllabus"
            className="px-3 py-2 text-base font-medium capitalize transition-all duration-300  
        text-gray-700 hover:text-green-600 hover:bg-gray-50 
        data-[state=active]:bg-gray-100 data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
          >
            Syllabus
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="py-8 space-y-10">
          <section aria-labelledby="what-you-learn-title">
            <h2
              id="what-you-learn-title"
              className="text-2xl font-semibold mb-4"
            >
              What You'll Learn
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course?.teachingPoints?.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course?.requirements?.map((req, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Unenroll Section */}
          {user?.role !== "teacherAsStudent" && (
            <section>
              <Button
                className="bg-green-500"
                onClick={() => setShowModal(true)}
              >
                Unenroll
              </Button>
            </section>
          )}

          {/* Unenroll Confirmation Modal */}
          <section>
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent
                aria-labelledby="unenroll-dialog-title"
                aria-describedby="unenroll-dialog-desc"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                  <DialogHeader>
                    <DialogTitle id="unenroll-dialog-title">
                      Confirm Unenrollment
                    </DialogTitle>
                    <DialogDescription id="unenroll-dialog-desc">
                      To confirm, type <strong>unenroll</strong> below. This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>

                  <Input
                    placeholder="Type 'unenroll' to confirm"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="mt-4"
                  />

                  <DialogFooter className="mt-6 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      className="bg-red-600 text-white"
                      disabled={
                        confirmationText.trim().toLowerCase() !== "unenroll" ||
                        loading
                      }
                      onClick={handleUnenroll}
                    >
                      {loading ? "Unenrolling..." : "Unenroll"}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </section>
        </TabsContent>

        {/* Reviews Tab – Only rendered if enabled */}
        {course?.commentsEnabled && (
          <TabsContent value="reviews" className="py-8 space-y-8">
            <RatingSection id={id} course={course} />
            <CommentSection id={course._id} />
          </TabsContent>
        )}

        {/* Syllabus Tab */}
        <TabsContent value="syllabus" className="py-8 space-y-6">
          <h2 className="text-2xl font-semibold">Course Syllabus</h2>

          {course?.syllabus?.url ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="mb-4">
                <p className="text-md font-medium">{course?.syllabus?.name}</p>

                {course?.syllabus?.uploadedAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded:{" "}
                    {new Date(course.syllabus.uploadedAt).toLocaleString(
                      "en-US",
                      {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                )}
              </div>

              <iframe
                src={course.syllabus.url}
                title="Syllabus PDF"
                className="w-full h-[600px] rounded-md border"
              ></iframe>

              <div className="mt-4">
                <a
                  href={course.syllabus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline font-medium"
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
    </div>
  );
}
