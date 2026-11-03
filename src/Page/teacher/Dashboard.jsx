"use client";

import { useContext, useEffect, useState } from "react";
import { BookOpen, FileText, MessageSquare, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Link } from "react-router-dom";
import SharedCoursesSection from "@/CustomComponent/teacher/SharedCoursesSection";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [unpublishedCount, setUnpublishedCount] = useState(0);

  const { user } = useContext(GlobalContext);

  // Loading / error states to expose to assistive tech
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch all courses (general)
  useEffect(() => {
    let mounted = true;
    const getTeacherCourse = async () => {
      setLoadingCourses(true);
      try {
        const res = await axiosInstance("/course/getindividualcourse");
        if (mounted) setCourses(res.data.courses || []);
      } catch (err) {
        console.log(err);
        if (mounted) setCourses([]);
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    };
    getTeacherCourse();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch all students
  useEffect(() => {
    let mounted = true;
    const getTeacherStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await axiosInstance("/course/getallCoursesforTeacher");
        if (mounted) setStudents(res.data.students || []);
      } catch (err) {
        console.log(err);
        if (mounted) setStudents([]);
      } finally {
        if (mounted) setLoadingStudents(false);
      }
    };
    getTeacherStudents();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch recent comments
  useEffect(() => {
    let mounted = true;
    const getRecentComments = async () => {
      setLoadingComments(true);
      try {
        const res = await axiosInstance("comment/teacher/allComment");
        if (mounted) setRecentComments(res.data.recentComments || []);
      } catch (err) {
        console.log(err);
        if (mounted) setRecentComments([]);
      } finally {
        if (mounted) setLoadingComments(false);
      }
    };
    getRecentComments();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch published/unpublished course stats
  useEffect(() => {
    let mounted = true;
    const fetchCourseStats = async () => {
      setStatsLoading(true);
      try {
        const [publishedRes, unpublishedRes] = await Promise.all([
          axiosInstance.get("/course/getTeacherCourses?published=true"),
          axiosInstance.get("/course/getTeacherCourses?published=false"),
        ]);

        if (mounted) {
          setPublishedCount(Array.isArray(publishedRes.data.courses) ? publishedRes.data.courses.length : 0);
          setUnpublishedCount(Array.isArray(unpublishedRes.data.courses) ? unpublishedRes.data.courses.length : 0);
        }
      } catch (err) {
        console.error("Error fetching course stats:", err);
        if (mounted) {
          setPublishedCount(0);
          setUnpublishedCount(0);
        }
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };
    fetchCourseStats();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = [
    {
      title: "Total Courses",
      link: "/teacher/courses",
      value: courses?.length || 0,
      icon: (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center" aria-hidden="true">
          <BookOpen size={16} className="text-green-600" />
        </div>
      ),
    },
    {
      title: "Students",
      link: "/teacher/allstudent",
      value: students?.length || 0,
      icon: (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center" aria-hidden="true">
          <Users size={16} className="text-blue-600" />
        </div>
      ),
    },
    {
      title: "Published Courses",
      value: publishedCount,
      link: "/teacher/courses?published=true",
      icon: (
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center" aria-hidden="true">
          <FileText size={16} className="text-emerald-600" />
        </div>
      ),
    },
    {
      title: "Unpublished Courses",
      value: unpublishedCount,
      link: "/teacher/courses?published=false",
      icon: (
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center" aria-hidden="true">
          <FileText size={16} className="text-red-600" />
        </div>
      ),
    },
  ];

  const formatAuthorName = (createdBy) => {
    if (!createdBy) return "Unknown";
    return [createdBy.firstName, createdBy.middleName, createdBy.lastName].filter(Boolean).join(" ");
  };

  return (
    <div className="min-h-screen">
      {/* Skip link for keyboard users */}
      <a
        href="#maincontent"
        className="sr-only focus:not-sr-only focus:skip-link inline-block px-4 py-2"
        aria-label="Skip to main content"
      >
        Skip to content
      </a>

      <div className="">
        <h1 className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg ">
          Dashboard
        </h1>

        {/* Metric Cards */}
        <section
          aria-labelledby="metrics-heading"
          className="mb-6"
          role="region"
        >
          <h2 id="metrics-heading" className="sr-only">
            Key metrics
          </h2>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
            aria-busy={loadingCourses || loadingStudents || statsLoading}
          >
            {metrics.map((metric, i) => {
              const cardContent = (
                <Card
                  className="h-full transition hover:bg-gray-50 cursor-pointer focus-within:ring-2 focus-within:ring-green-500"
                  role="group"
                  aria-label={`${metric.title}: ${metric.value}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </CardTitle>
                    {metric.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
                  </CardContent>
                </Card>
              );

              return (
                <div key={i} className="h-full">
                  {metric.link ? (
                    <Link
                      to={metric.link}
                      className="block h-full"
                      aria-label={`Open ${metric.title} (currently ${metric.value})`}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <main id="maincontent" role="main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Comments Section */}
            <section
              role="region"
              aria-labelledby="recent-activity-heading"
              className=""
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="recent-activity-heading" className="text-lg font-semibold">
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-4">
                {loadingComments ? (
                  <div role="status" aria-live="polite" className="text-sm text-gray-700">
                    Loading recent activity...
                  </div>
                ) : recentComments.length > 0 ? (
                  <ul className="space-y-2" role="list" aria-label="Recent activity list">
                    {recentComments.map((comment, i) => {
                      const authorName = formatAuthorName(comment?.createdby);
                      const createdAtIso = comment?.createdAt ? new Date(comment.createdAt).toISOString() : null;
                      return (
                        <li key={i} role="listitem">
                          <Link
                            to={`/teacher/courses/courseDetail/${comment.course}`}
                            className="flex flex-col gap-1"
                            aria-label={`Open course for comment by ${authorName}`}
                          >
                            <div className="flex items-start gap-4 bg-white p-4 rounded-lg border hover:bg-gray-50 transition">
                              <div
                                className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"
                                aria-hidden="true"
                              >
                                <MessageSquare size={18} />
                              </div>
                              <div className="flex justify-between w-full">
                                <div>
                                  <p className="text-sm">
                                    <span className="text-gray-700 font-medium">{authorName}</span>{" "}
                                    <span className="text-gray-700">{comment?.action}</span>
                                  </p>
                                  <span className="text-gray-800 font-medium mt-1 block">
                                    {comment?.text}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  {createdAtIso ? (
                                    <time dateTime={createdAtIso}>
                                      {new Date(createdAtIso).toLocaleString()}
                                    </time>
                                  ) : (
                                    "Unknown time"
                                  )}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity to show.</p>
                )}
              </div>
            </section>

            {/* Recent Courses Section */}
            <section role="region" aria-labelledby="recent-courses-heading">
              <h2 id="recent-courses-heading" className="text-lg font-semibold mb-4">
                Recent Courses
              </h2>

              <div className="space-y-4">
                {loadingCourses ? (
                  <div role="status" aria-live="polite" className="text-sm text-gray-700">
                    Loading courses...
                  </div>
                ) : (
                  <ul className="space-y-2" role="list" aria-label="Recent courses list">
                    {courses
                      ?.filter((course) => course.published === true)
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 3)
                      .map((course, i) => {
                        const imgAlt = course?.courseTitle ? `${course.courseTitle} thumbnail` : "Course thumbnail";
                        return (
                          <li key={i} role="listitem">
                            <Link
                              to={`/teacher/courses/courseDetail/${course._id}`}
                              className="block"
                              aria-label={`Open course ${course?.courseTitle || "Untitled course"}`}
                            >
                              <div className="flex items-start gap-4 bg-white p-4 rounded-lg border hover:bg-gray-50 transition">
                                <img
                                  src={course?.thumbnail?.url || "/placeholder.svg"}
                                  alt={imgAlt}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                  <h3 className="font-medium text-sm mb-1">{course?.courseTitle || "Untitled course"}</h3>
                                  <span className="text-xs text-gray-500">
                                    {course?.category?.title || "Uncategorized"}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            </section>
          </div>

          {/* Shared Courses Section */}
          <div className="mt-6">
            <SharedCoursesSection />
          </div>
        </main>
      </div>
    </div>
  );
}
