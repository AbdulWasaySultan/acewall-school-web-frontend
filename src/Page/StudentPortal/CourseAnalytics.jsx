"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from "recharts";
import {
  ArrowLeft,
  Loader,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Zap,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function CourseAnalytics() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // This API returns ALL courses for the student
        const res = await axiosInstance.get(
          `gradebook/getStudentGradebooksFormattedAnalytics`,
        );

        // Find the specific course from the response list
        const specificCourse = res.data.courses.find(
          (c) => c.courseId === courseId,
        );

        if (specificCourse) {
          setCourseData(specificCourse);
        } else {
          setError("Course analytics not found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchAnalytics();
  }, [courseId]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );

  if (error || !courseData)
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">{error || "No data found"}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  // Destructure from the specific course object found
  const { analytics, courseName, coursePercentage } = courseData;
  const insights = analytics; // The API nests insights inside 'analytics'
  const charts = analytics?.chartData;
  const isImproving = insights?.trendStatus === "increasing";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-muted-foreground">{courseName}</p>
        </div>
      </div>

      {/* TREND INSIGHT BANNER */}
      {insights && (
        <Card
          className={`${
            isImproving
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          } border-2`}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full ${
                  isImproving ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isImproving ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="space-y-1">
                <h2
                  className={`text-lg font-bold ${
                    isImproving ? "text-green-800" : "text-red-800"
                  }`}
                >
                  Performance Trend: {isImproving ? "Improving" : "Decreasing"}
                </h2>
                <p className="text-sm text-gray-700">
                  Based on your last{" "}
                  <strong>{insights.sampleSize} submissions</strong>, your
                  performance is {insights.trendStatus}. Your recent average is{" "}
                  <strong>{insights.recentAverage}%</strong>, a change of
                  <strong> {insights.percentageChange}%</strong> compared to
                  your historical average.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Grade</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursePercentage}%</div>
          </CardContent>
        </Card>

        <Card className="bg-amber-100 text-black shadow-lg border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium opacity-90">
              Projected Final
            </CardTitle>
            <Zap className="h-4 w-4 text-green-300 fill-green-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.projectedFinalScore}%
            </div>
            <p className="text-[10px] opacity-80 mt-1 uppercase tracking-wider">
              Estimated based on current pace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {charts?.lineChart?.length || 0}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
              Graded assignments & discussions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold capitalize">
              {courseData.gradingSystem === "normalGrading"
                ? courseData.letterGrade
                : "Standard"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WEAKEST CATEGORY ALERT */}
      {insights?.weakestCategory && (
        <Alert
          variant="destructive"
          className="bg-red-50 border-red-200 text-red-900"
        >
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="font-bold flex items-center gap-2 text-red-900">
            Priority Improvement Area: {insights.weakestCategory.category}
          </AlertTitle>
          <AlertDescription className="text-red-800">
            Your performance in{" "}
            <strong>{insights.weakestCategory.name}</strong> 
            <strong>
              ({Number(insights.weakestCategory.average).toFixed(1)}%) is currently{" "}
            </strong>{" "}
            <strong>
              {Number(insights.weakestCategory.gap).toFixed(1)}% lower
            </strong>{" "}
            than your highest performing category. Improving this area will significantly
            boost your final grade.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
            <CardDescription>
              Score trend across all assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.lineChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(v) => [`${Number(v || 0).toFixed(1)}%`, "Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Analysis</CardTitle>
            <CardDescription>Average proficiency per task type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={charts?.categoryPerformance}
                margin={{ left: 20, right: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(v) => [`${Number(v || 0).toFixed(1)}%`, "Avg"]}
                />
                <Bar dataKey="average" radius={[0, 4, 4, 0]} barSize={32}>
                  {charts?.categoryPerformance?.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.average >= 80
                          ? "#10b981"
                          : entry.average >= 60
                            ? "#3b82f6"
                            : "#f59e0b"
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="average"
                    position="right"
                    formatter={(v) => `${Number(v || 0).toFixed(0)}%`}
                    style={{
                      fontSize: "12px",
                      fill: "#444",
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ACADEMIC ADVICE FOOTER */}
      {/* <Card className="bg-slate-800 text-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Lightbulb className="h-5 w-5 text-yellow-400 " />
            Personalized Study Advice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="opacity-90">
            {isImproving
              ? "You've built great momentum recently! To maintain this growth, ensure you maintain your consistency in your top subjects while slowly bridging the gap in your weaker areas."
              : "We've noticed a slight dip in your recent scores. Don't worry—this usually happens before a breakthrough. Focus on reviewing the fundamentals of your weakest category to stop the downward trend."}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">
              Goal: {insights?.projectedFinalScore}%
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">
              Focus: {insights?.weakestCategory?.category || "General Review"}
            </span>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

