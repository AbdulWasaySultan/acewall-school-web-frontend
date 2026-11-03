"use client";

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Settings,
  ListChecks,
  Users,
  Eye,
  Layers,
  ChartBarStacked,
  LibraryBig,
  Loader,
  Pen,
  Loader2,
  Download,
  Video,
  CalendarDays,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { axiosInstance } from "@/lib/AxiosInstance";
import CommentSection from "@/CustomComponent/Student/CommentSection";
import { FinalCourseAssessmentCard } from "@/CustomComponent/CreateCourse/FinalCourseAssessmentCard";
import { toast } from "sonner";
import AssessmentCategoryDialog from "@/CustomComponent/teacher/AssessmentCategoryDialog";
import RatingSection from "@/CustomComponent/teacher/RatingSection";
import { format } from "date-fns";
import { CourseContext } from "@/Context/CoursesProvider";
import { SelectSemAndQuarDialog } from "@/CustomComponent/CreateCourse/SelectSemAndQuarDialog";
import ArchiveDialog from "@/CustomComponent/teacher/ArchivedModal";
import { GlobalContext } from "@/Context/GlobalProvider";
import { BarChart3 } from "lucide-react";
import ShareCourseModal from "@/CustomComponent/teacher/ShareCourseModal";

const ReadMore = ({ text = "", maxLength = 500 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text)
    return (
      <p className="text-black">
        <span className="sr-only">No description available.</span>
        Course description goes here...
      </p>
    );

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
          className="text-green-700 text-sm hover:underline mt-1 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1 rounded"
          aria-expanded={isExpanded}
          aria-label={
            isExpanded ? "Show less description" : "Show more description"
          }
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default function TeacherCourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quarters, setQuarters } = useContext(CourseContext);
  const { checkAuth, user } = useContext(GlobalContext);

  const [course, setCourse] = useState(null);
  const [enrollmentsId, setEnrollmentsId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Prevthumbnail, setPrevThumbnail] = useState(null);
  const [newthumbnail, setNewThumbnail] = useState(null);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadFullCourse = async () => {
    setDownloading(true);

    try {
      // 1. Call the API (Ensure the URL matches your backend route)
      const res = await axiosInstance.get(`/course/export-full-course/${id}`);

      // 2. Extract the actual course object from the API response
      // Based on the backend: res.data is the full response, res.data.data is the course content
      const fullCourseData = res.data.data;

      if (!fullCourseData) {
        throw new Error("No course data received from server");
      }

      // 3. Create a blob from the JSON data
      const blob = new Blob([JSON.stringify(fullCourseData, null, 2)], {
        type: "application/json",
      });

      // 4. Set up the download filename
      const fileName = fullCourseData.courseTitle
        ? fullCourseData.courseTitle.replace(/\s+/g, "_")
        : `Course_${id}`;

      // 5. Trigger the browser download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}_AZ_Export.json`;

      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("A-Z Course data exported successfully!");
    } catch (err) {
      console.error("Export Error:", err);
      toast.error(
        err.response?.data?.message || "Failed to export course data."
      );
    } finally {
      setDownloading(false);
    }
  };
  const handleDeleteAssessment = (assessmentID) => {
    setLoading(true);
    axiosInstance
      .delete(`/assessment/delete/${assessmentID}`)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        fetchCourseDetail();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message || "Error deleting assessment");
      });
  };

  const fetchCourseDetail = async () => {
    await axiosInstance
      .get(`course/details/${id}`)
      .then((res) => {
        setCourse(res.data.course);
        setQuarters(res.data.course.quarter);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleToggleComments = (newState) => {
    setCourse((prev) => ({
      ...prev,
      commentsEnabled: newState,
    }));
  };

  const findEnrollment = async () => {
    await axiosInstance
      .post(`enrollment/enrollmentforTeacher`, {
        teacherId: course.createdby,
        courseId: course._id,
      })
      .then((res) => {
        setEnrollmentsId(res.data.enrollment._id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (course && course.createdby) {
      findEnrollment();
    }
  }, [course]);

  const handlePreview = async () => {
    try {
      await axiosInstance.post("auth/previewSignIn").then(async () => {
        await checkAuth();
        navigate(`/student/mycourses/${enrollmentsId}`);
      });
    } catch (error) {
      console.error("Preview signin failed:", error);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      toast.error("Only JPEG and PNG images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPrevThumbnail(reader.result);
    };
    reader.readAsDataURL(file);

    setNewThumbnail(file);
  };

  const confirmChange = async () => {
    setLoadingThumbnail(true);
    await axiosInstance
      .put(
        `course/thumbnail/${id}`,
        { thumbnail: newthumbnail },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message || "Thumbnail updated successfully!");
        fetchCourseDetail();
        setPrevThumbnail(null);
        setNewThumbnail(null);
        setLoadingThumbnail(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingThumbnail(false);
      });
  };

  const handleToggleGrading = async () => {
    try {
      const res = await axiosInstance.put(`course/course/${id}/toggle-grading`);
      toast.success(res.data.message);

      setCourse((prev) => ({
        ...prev,
        gradingSystem: res.data.gradingSystem,
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to toggle grading system"
      );
    }
  };

  const prevSemesterIds = course?.semester?.map((sem) => sem._id) || [];
  const prevQuarterIds = course?.quarter?.map((quarter) => quarter._id) || [];

  if (!course)
    return (
      <div role="status" aria-live="polite" aria-label="Loading course details">
        <section className="flex justify-center items-center h-screen w-full">
          <Loader className="animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading course details...</span>
        </section>
      </div>
    );

  return (
    <main className="container mx-auto px-4 py-2 max-w-6xl">
      {course.published === false && (
        <div
          className="flex items-center justify-center rounded-md bg-red-200 p-4 mb-4"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm">
            This course is Archived. It will not be visible to students which
            are not enrolled in the course.
          </p>
        </div>
      )}

      <header className="flex item-center justify-between">
        <h1 className="text-3xl font-semibold mb-8">My Courses</h1>
      </header>

      <div className="space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col gap-4">
            <img
              src={
                Prevthumbnail
                  ? Prevthumbnail
                  : course.thumbnail.url ||
                  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80"
              }
              alt={`${course.courseTitle} course thumbnail`}
              className="w-full rounded-md object-cover aspect-video"
            />
            {Prevthumbnail ? (
              <div
                className="flex items-center space-x-2"
                role="group"
                aria-label="Thumbnail change actions"
              >
                <Button
                  className="bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  onClick={confirmChange}
                  aria-label="Confirm thumbnail change"
                >
                  {loadingThumbnail ? (
                    <>
                      <Loader className="animate-spin" aria-hidden="true" />
                      <span className="sr-only">Updating thumbnail...</span>
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                  onClick={() => {
                    setPrevThumbnail(null);
                    setNewThumbnail(null);
                  }}
                  aria-label="Cancel thumbnail change"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  className="sr-only"
                  id="thumbnail"
                  onChange={handleThumbnailChange}
                  accept="image/jpeg,image/png,image/jpg"
                  aria-label="Upload course thumbnail"
                />
                <label
                  htmlFor="thumbnail"
                  className="flex items-center space-x-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      document.getElementById("thumbnail").click();
                    }
                  }}
                >
                  <Pen className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Edit thumbnail</span>
                </label>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="space-y-1">
              <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                <span>
                  <span className="sr-only">Course uploaded on </span>
                  Uploaded:{" "}
                  <time dateTime={course.createdAt}>
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString("en-US", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      : "N/A"}
                  </time>
                </span>
                <span>
                  <span className="sr-only">Last updated on </span>
                  Last Updated:{" "}
                  <time dateTime={course.updatedAt}>
                    {course.updatedAt
                      ? new Date(course.updatedAt).toLocaleDateString("en-US", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      : "N/A"}
                  </time>
                </span>
              </div>

              <h2 className="text-2xl uppercase font-semibold">
                {course.courseTitle || "Course Title"}
              </h2>
              <div className="text-gray-900 font-medium leading-relaxed">
                <ReadMore text={course?.courseDescription} />
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="flex justify-between items-center mb-4">
            <AssessmentCategoryDialog courseId={id} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
                  <Settings size={16} className="mr-2" />
                  Manage Course Actions
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 rounded-xl shadow-lg border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-700"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 px-3 pt-2 pb-1 tracking-wide">
                  Course Tools
                </DropdownMenuLabel>

                <DropdownMenuGroup>
                  {/* Student Assistance */}
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/teacher/studentAssisstance/${id}`)
                    }
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <Users size={18} className="text-green-600" />
                    <span>Students Who Need Assistance</span>
                  </DropdownMenuItem>

                  {/* Preview */}
                  <DropdownMenuItem
                    onClick={handlePreview}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <Eye size={18} className="text-green-600" />
                    <span>Preview as Student</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 px-3 pt-1 pb-1 tracking-wide">
                  Course Management
                </DropdownMenuLabel>

                <DropdownMenuGroup>
                  {/* Gradebook */}
                  <DropdownMenuItem
                    onClick={() => navigate(`/teacher/gradebook/${id}`)}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <ListChecks size={18} className="text-green-600" />
                    <span>Gradebook</span>
                  </DropdownMenuItem>

                  {/* Edit Course */}
                  <DropdownMenuItem
                    onClick={() => navigate(`/teacher/courses/edit/${id}`)}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <Pen size={18} className="text-green-600" />
                    <span>Edit Course Info</span>
                  </DropdownMenuItem>

                  {/* Syllabus */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a
                      href={course.syllabus?.url || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 py-2.5 w-full"
                    >
                      <BookOpen size={18} className="text-green-600" />
                      <span>Open Syllabus</span>
                    </a>
                  </DropdownMenuItem>
                  {/* Pacing Chart */}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(`/teacher/courses/${id}/pacing-chart`);
                    }}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <Calendar size={18} className="text-green-600" />
                    <span>View / Manage Pacing Chart</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 px-3 pt-1 pb-1 tracking-wide">
                  Course Stats
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      console.log("COURSE ID:", id);
                      navigate(`/teacher/courses/course-stats/${id}`);
                    }}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <BarChart3 size={18} className="text-green-600" />
                    <span>Course Enrollment Stats</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDownloadFullCourse}
                    disabled={downloading}
                    className="flex items-center gap-3 py-2.5 cursor-pointer text-blue-600 dark:text-blue-400"
                  >
                    {downloading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                    <span className="font-medium">
                      Download A-Z Course Data
                    </span>
                  </DropdownMenuItem>
                  <ShareCourseModal
                    courseId={id}
                    courseName={course.courseTitle}
                  />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(`/teacher/courses/schedule-class/${id}`);
                    }}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <CalendarDays size={18} className="text-blue-600" />
                    <span>Schedule / Start Zoom Class</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Toggle Grading */}
                <DropdownMenuItem
                  onClick={handleToggleGrading}
                  className="flex items-center gap-3 py-2.5 cursor-pointer text-green-700 font-medium"
                >
                  <ChartBarStacked size={18} className="text-green-700" />
                  {course.gradingSystem === "normalGrading"
                    ? "Switch to Standard Grading"
                    : "Switch to Normal Grading"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Course statistics">
          <h3 className="sr-only">Course Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<ChartBarStacked className="h-5 w-5 text-orange-500" />}
              value={course.subcategory?.title?.toUpperCase()}
              label="Topic"
              bgColor="bg-slate-100 hover:bg-slate-200"
            />

            <StatCard
              icon={<LibraryBig className="h-5 w-5 text-orange-500" />}
              value={course.semester?.length || 0}
              label="Semesters"
              bgColor="bg-slate-100 hover:bg-slate-200"
            />

            <StatCard
              icon={<LibraryBig className="h-5 w-5 text-orange-500" />}
              value={course.enrollmentsCount?.[0]?.count ?? course.enrollments?.length ?? 0}
              label="Students Enrolled"
              bgColor="bg-slate-100 hover:bg-slate-200"
            />
            <StatCard
              icon={<LibraryBig className="h-5 w-5 text-orange-500" />}
              value={course.courseCode}
              label="Course Code"
              bgColor="bg-slate-100 hover:bg-slate-200"
            />
          </div>
        </section>

        <SelectSemAndQuarDialog
          prevSelectedSemesters={prevSemesterIds}
          prevSelectedQuarters={prevQuarterIds}
          courseId={id}
          fetchCourseDetail={fetchCourseDetail}
        />

        <section aria-label="Course semesters">
          <h3 className="sr-only">Semesters</h3>
          {course?.semester?.map((semester, index) => (
            <Link
              key={semester._id}
              to={`/teacher/courses/${id}/semester/${semester._id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 rounded-lg"
            >
              <article className="mb-4 border border-gray-200 p-5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <h4 className="font-semibold text-md">
                  Semester {index + 1}: {semester.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  <time dateTime={semester.startDate}>
                    {format(new Date(semester.startDate ? semester.startDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")}
                  </time>
                  {" - "}
                  <time dateTime={semester.endDate}>
                    {format(new Date(semester.endDate ? semester.endDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")}
                  </time>
                </p>
              </article>
            </Link>
          ))}
        </section>

        {/* Final Assessment Cards */}
        {Array.isArray(course.Assessments) &&
          course.CourseAssessments.map((assessment) => (
            <FinalCourseAssessmentCard
              key={assessment._id}
              assessment={assessment}
              handleDeleteAssessment={handleDeleteAssessment}
            />
          ))}

        {/* Comments & Ratings Sections */}
        {typeof course.commentsEnabled === "boolean" ? (
          course.commentsEnabled ? (
            <section aria-label="Ratings and comments">
              <RatingSection courseId={id} />
              <CommentSection id={id} />
            </section>
          ) : (
            <div
              className="text-center text-gray-500 my-4"
              role="status"
              aria-live="polite"
            >
              Comments & Ratings are currently disabled for this course.
            </div>
          )
        ) : (
          <div
            className="text-center text-gray-500 my-4"
            role="status"
            aria-live="polite"
          >
            Loading comments & ratings status...
          </div>
        )}

        <footer className="flex justify-end">
          <ArchiveDialog
            course={course}
            fetchCourseDetail={fetchCourseDetail}
          />
        </footer>
      </div>
    </main>
  );
}

function StatCard({ icon, value, label, bgColor }) {
  return (
    <Card className={`border-0 shadow-sm ${bgColor}`}>
      <CardContent className="p-2 flex items-center gap-4">
        <div className="p-2 rounded-md bg-white" aria-hidden="true">
          {icon}
        </div>
        <div>
          <div
            className="font-semibold text-lg"
            aria-label={`${label}: ${value}`}
          >
            {value}
          </div>
          <div className="text-sm text-muted-foreground" aria-hidden="true">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
