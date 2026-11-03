"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Users,
  Clock,
  Loader,
  MessageSquare,
  FileText,
  Info,
  BookOpen,
  Layout,
  Globe,
  ListChecks,
  ChevronRight
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import RatingSection from "@/CustomComponent/Student/RatingSection";
import avatar from "@/assets/avatar.png";

const ReadMore = ({ text = "", maxLength = 500 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) return <p className="text-gray-500 italic">No description provided.</p>;
  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const displayText = isExpanded ? text : text.slice(0, maxLength);

  return (
    <div>
      <p className="text-gray-700 leading-relaxed">
        {displayText}
        {text.length > maxLength && !isExpanded && "..."}
      </p>
      {text.length > maxLength && (
        <button
          onClick={toggleReadMore}
          className="text-green-700 text-sm font-semibold hover:underline mt-2"
        >
          {isExpanded ? "Show Less" : "Read Full Description"}
        </button>
      )}
    </div>
  );
};

export default function ParentCourseOverview() {
  const { studentId, enrollmentId } = useParams();
  const [course, setCourse] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const navigate = useNavigate();

  useEffect(() => {
    const getCourseDetails = async () => {
      if (!studentId || !enrollmentId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/parent/child-course-details/${studentId}/${enrollmentId}`
        );
        if (res.data.success) {
          setCourse(res.data.enrolledCourse.courseDetails);
          setStudentName(res.data.studentName);
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    getCourseDetails();
  }, [studentId, enrollmentId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader className="animate-spin text-green-600" size={40} />
        <p className="text-gray-500 font-medium">Syncing curriculum data...</p>
      </div>
    );
  }

  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  return (
    <div className="max-w-full mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-500">
      {/* Context Badge */}
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-white shadow-sm w-fit px-4 py-1.5 rounded-full border border-green-100">
        <Users size={14} className="text-green-600" />
        <span>Monitoring Progress: <strong className="text-gray-800">{studentName}</strong></span>
      </div>

      {/* Hero Section */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-xl border h-[280px] flex items-end"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.3)), url(${course.thumbnail?.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-8 w-full">
          <div className="flex gap-2 mb-3">
            <Badge className="bg-green-600 border-none">Active Curriculum</Badge>
            <Badge variant="outline" className="text-white border-white/40 backdrop-blur-md">
              <Globe size={12} className="mr-1" /> {course.language || "English"}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {course.courseTitle}
          </h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100/80 p-1.5 rounded-2xl mb-8 shadow-inner">
          <TabsTrigger value="overview" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Overview</TabsTrigger>
          <TabsTrigger value="curriculum" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Curriculum</TabsTrigger>
          <TabsTrigger value="syllabus" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Syllabus</TabsTrigger>
          {/* <TabsTrigger value="feedback" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md">Reviews</TabsTrigger> */}
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8 border-none shadow-sm rounded-2xl bg-white">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <Info size={20} className="text-green-600" /> About this Course
                </h2>
                <ReadMore text={course.courseDescription} />
              </Card>

              {course.teachingPoints?.length > 0 && (
                <Card className="p-8 border-none shadow-sm rounded-2xl bg-white">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={20}/> Learning Outcomes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.teachingPoints.map((point, i) => (
                      <div key={i} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-green-600" />
                        </div>
                        <span className="text-sm text-gray-700 leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {course.requirements?.length > 0 && (
                <Card className="p-8 border-none shadow-sm rounded-2xl bg-white border-l-4 border-l-amber-400">
                  <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <ListChecks className="text-amber-500" size={20}/> Prerequisites
                  </h2>
                  <div className="space-y-3">
                    {course.requirements.map((req, i) => (
                      <div key={i} className="flex gap-3 items-center text-gray-600">
                        <ChevronRight size={16} className="text-amber-500" />
                        <span className="text-sm font-medium">{req}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-slate-900 border-none shadow-xl rounded-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-10 -mt-10" />
                <h4 className="font-bold flex items-center gap-2 mb-6 text-green-400 uppercase tracking-widest text-xs">
                  <Layout size={16} /> Course Stats
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-sm text-slate-400 font-medium">Chapters</span>
                    <span className="text-xl font-bold text-green-400">{course.totalChapters || 0}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-none shadow-sm rounded-2xl bg-white">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Course Instructor</p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-green-50">
                    <AvatarImage src={course.createdby?.profileImg?.url || avatar} />
                    <AvatarFallback className="bg-green-50 text-green-700 font-bold text-lg">
                      {course.createdby?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900 text-lg leading-tight">
                      {course.createdby?.firstName} {course.createdby?.lastName}
                    </p>
                    {/* <p className="text-xs text-green-600 font-bold uppercase mt-1">Certified Educator</p> */}
                  </div>
                </div>
                {/* <Button className="w-full mt-6 bg-slate-100 text-slate-700 hover:bg-green-600 hover:text-white transition-all shadow-none border-none rounded-xl" onClick={() => navigate("/parent/messages")}>
                  <MessageSquare size={16} className="mr-2" /> Message Instructor
                </Button> */}
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 2. CURRICULUM TAB (With Nested Lessons) */}
        <TabsContent value="curriculum">
          <Card className="p-8 border-none shadow-sm rounded-3xl bg-white">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Academic Outline</h2>
              <p className="text-gray-500 mt-1">Detailed breakdown of chapters and lessons in this curriculum.</p>
            </div>

            <div className="grid gap-6">
              {course.chaptersSummary?.map((chapter, idx) => (
                <div key={idx} className="group rounded-3xl border border-gray-100 bg-gray-50/50 overflow-hidden hover:border-green-200 transition-all">
                  {/* Chapter Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border-b border-gray-100 transition-colors group-hover:bg-green-50/30">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 bg-green-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-green-200">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{chapter.title}</h3>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                            <BookOpen size={14} className="text-blue-500" /> {chapter.lessonCount} Lessons
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                            <FileText size={14} className="text-orange-500" /> {chapter.assessmentCount} Assessments
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nested Lessons List */}
                  <div className="p-6 bg-white/50 space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Lesson Breakdown</p>
                    {chapter.lessonTitles && chapter.lessonTitles.length > 0 ? (
                      chapter.lessonTitles.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all">
                          <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                          <span className="text-sm font-semibold text-gray-600 capitalize">{lesson}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic px-2">No individual lessons listed for this chapter yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 3. SYLLABUS TAB */}
        <TabsContent value="syllabus">
          <Card className="p-8 border-none shadow-sm rounded-3xl bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl shadow-sm border border-red-100">
                  <FileText size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 tracking-tight">Official Roadmap</h2>
                  <p className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-md">
                    {course.syllabus?.filename || "Course guide and policies"}
                  </p>
                </div>
              </div>
              {course.syllabus?.url && (
                <Button variant="outline" className="rounded-xl border-green-200 text-green-700 hover:bg-green-50 shadow-sm" asChild>
                  <a href={course.syllabus.url} target="_blank" rel="noreferrer">Download PDF</a>
                </Button>
              )}
            </div>

            {course.syllabus?.url ? (
              <div className="rounded-3xl border border-gray-100 bg-slate-50 overflow-hidden shadow-inner">
                <iframe src={course.syllabus.url} className="w-full h-[600px]" title="Syllabus Viewer" />
              </div>
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                <Info size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium tracking-tight">Syllabus document has not been uploaded yet.</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* 4. FEEDBACK TAB */}
        {/* <TabsContent value="feedback" className="space-y-6">
          <Card className="p-8 border-none shadow-sm rounded-3xl bg-white">
            <RatingSection id={enrollmentId} course={course} />
          </Card>
         
        </TabsContent> */}
      </Tabs>
    </div>
  );
}