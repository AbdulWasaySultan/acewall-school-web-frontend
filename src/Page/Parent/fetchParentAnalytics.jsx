"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LabelList
} from "recharts";
import {
  ArrowLeft, Loader, Target, TrendingUp, TrendingDown,
  Award, BookOpen, Zap, AlertTriangle, Lightbulb, User, Printer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function ParentChildAnalytics() {
  const { studentId, courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentAnalytics = async () => {
      try {
        setLoading(true);
        // Call the parent-specific analytics endpoint
        const res = await axiosInstance.get(
          `parent/getChildCourseAnalytics/${studentId}/${courseId}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Parent Analytics Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load academic insights.");
      } finally {
        setLoading(false);
      }
    };
    if (studentId && courseId) fetchParentAnalytics();
  }, [studentId, courseId]);

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Loader className="animate-spin h-10 w-10 text-indigo-600" />
      <p className="text-muted-foreground font-medium">Analyzing child's performance...</p>
    </div>
  );

  if (error || !data) return (
    <div className="p-10 text-center space-y-4">
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "No data found"}</AlertDescription>
      </Alert>
      <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  const { insights, summary, charts, studentName, courseName } = data;
  const isImproving = insights?.trendStatus === "increasing";

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="print:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academic Progress Report</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1.5 text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded text-sm">
                <User className="h-3.5 w-3.5" /> {studentName}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">{courseName}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="print:hidden flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* MOMENTUM BANNER */}
      {insights && (
        <Card className={`${isImproving ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"} border-2 shadow-sm`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${isImproving ? "bg-emerald-100" : "bg-rose-100"}`}>
                {isImproving ? 
                  <TrendingUp className="h-6 w-6 text-emerald-600" /> : 
                  <TrendingDown className="h-6 w-6 text-rose-600" />
                }
              </div>
              <div className="space-y-1">
                <h2 className={`text-lg font-bold ${isImproving ? "text-emerald-800" : "text-rose-800"}`}>
                  Performance Momentum: {isImproving ? "On Track & Improving" : "Recent Scores Declining"}
                </h2>
                <p className="text-sm text-slate-700 max-w-4xl leading-relaxed">
                  Your child's average in the last <strong>{insights.sampleSize} tasks</strong> is <strong>{insights.recentAverage}%</strong>. 
                  This shows a <strong>{insights.percentageChange}% {insights.trendStatus}</strong> compared to their overall course average of {insights.overallAverage}%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KEY METRICS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-indigo-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-slate-500">Current Average</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-black text-slate-900">{summary.currentPercentage}%</div></CardContent>
        </Card>

        <Card className="bg-indigo-900 text-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase opacity-80 flex items-center gap-2 text-indigo-100">
              <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" /> Projected Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{insights?.projectedFinalScore}%</div>
            <p className="text-[10px] opacity-60 mt-1 uppercase">Predicted based on current pace</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-slate-500">Completed Work</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{summary.totalAssessments}</div>
            <p className="text-[10px] text-muted-foreground uppercase">Graded assignments & discussions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-slate-500">Total Points</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-indigo-600">{summary.pointsEarned} / {summary.pointsPossible}</div>
            <p className="text-[10px] text-muted-foreground uppercase">Points obtained in this course</p>
          </CardContent>
        </Card>
      </div>

      {/* AT-RISK CATEGORY ALERT */}
      {insights?.weakestCategory && (
        <Alert className="bg-white border-rose-200 border-l-4 border-l-rose-500 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <AlertTitle className="font-bold text-rose-800">Area for Support: {insights.weakestCategory.name || insights.weakestCategory.category}</AlertTitle>
          <AlertDescription className="text-slate-600">
            {studentName} is finding <strong>{insights.weakestCategory.name || insights.weakestCategory.category}</strong> tasks the most challenging ({insights.weakestCategory.average}%). 
            Targeted review in this specific area will offer the greatest impact on improving the overall grade.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* TIME-LINE CHART */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Progress History</CardTitle>
            <CardDescription>Visualizing score trends over the duration of the course</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.lineChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${parseFloat(v).toFixed(1)}%`, "Score"]}
                />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BAR CHART FOR CATEGORIES */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Subject Mastery</CardTitle>
            <CardDescription>Average performance broken down by task type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={charts.categoryPerformance} margin={{ left: 20, right: 40 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v) => [`${parseFloat(v).toFixed(1)}%`, "Average"]} />
                <Bar dataKey="average" radius={[0, 4, 4, 0]} barSize={24}>
                  {charts.categoryPerformance.map((entry, index) => (
                    <Cell key={index} fill={entry.average >= 80 ? "#10b981" : entry.average >= 60 ? "#6366f1" : "#f43f5e"} />
                  ))}
                  <LabelList dataKey="average" position="right" formatter={(v) => `${parseFloat(v).toFixed(0)}%`} className="font-bold fill-slate-700" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* PARENTAL ADVICE FOOTER */}
      <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Lightbulb size={120} />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-300">
            <Lightbulb className="h-5 w-5" />
            Guardian Support Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
            {isImproving 
              ? `${studentName} is showing consistent positive momentum. To support this growth, acknowledge their recent improvements and encourage them to maintain this pace. The current projection suggests they could end the course with a high B or an A.`
              : `A slight decline in recent performance suggests ${studentName} might be finding new topics more difficult. We recommend a brief review of "${insights?.weakestCategory?.name || insights?.weakestCategory?.category}" concepts this weekend to help stabilize their average.`
            }
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white border border-white/20">
              Projected Final: {insights?.projectedFinalScore}%
            </span>
            <span className="px-3 py-1 bg-rose-500/20 rounded-full text-xs font-semibold text-rose-200 border border-rose-500/30">
              Action Item: Review {insights?.weakestCategory?.name || insights?.weakestCategory?.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}