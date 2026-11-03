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

export default function TeacherStudentAnalytics() {
  const { courseId, studentId } = useParams();
  const navigate = useNavigate(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // API call to the new weighted aggregation endpoint
        const res = await axiosInstance.get(`gradebook/getTeacherStudentAnalytics/${courseId}/${studentId}`);
        setData(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load student analytics.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId && studentId) fetchAnalytics();
  }, [courseId, studentId]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader className="animate-spin h-8 w-8 text-blue-600" />
    </div>
  );

  if (error || !data) return (
    <div className="p-10 text-center">
      <p className="text-red-500 mb-4">{error || "No data found"}</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  const { insights, summary, charts } = data;
  const isImproving = insights?.trendStatus === "increasing";

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header - Hidden during print if necessary, or kept for context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="print:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Student Performance Report</h1>
            <div className="flex items-center gap-3 mt-1 text-muted-foreground text-sm">
               <span className="flex items-center gap-1"><User className="h-4 w-4" /> ID: {studentId}</span>
               <span className="text-gray-300">|</span>
               <span className="font-medium text-gray-700">{data.courseName}</span>
            </div>
          </div>
        </div>
        <Button variant="default" onClick={() => window.print()} className="print:hidden gap-2">
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* TREND INSIGHT BANNER */}
      {insights && (
        <Card className={`${isImproving ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border-2 shadow-sm`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${isImproving ? "bg-green-100" : "bg-red-100"}`}>
                {isImproving ? 
                  <TrendingUp className="h-6 w-6 text-green-600" /> : 
                  <TrendingDown className="h-6 w-6 text-red-600" />
                }
              </div>
              <div className="space-y-1">
                <h2 className={`text-lg font-bold ${isImproving ? "text-green-800" : "text-red-800"}`}>
                  Momentum Analysis: {isImproving ? "Positive Growth" : "At-Risk Decline"}
                </h2>
                <p className="text-sm text-gray-700 max-w-3xl">
                  Recent performance is tracking at <strong>{insights.recentAverage}%</strong>. 
                  This is <strong>{insights.percentageChange}% {insights.trendStatus}</strong> relative to the overall weighted average of {insights.overallAverage}%. 
                  Calculated based on the last {insights.sampleSize} graded submissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATS GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Weighted Percentage</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{summary.currentPercentage}%</div></CardContent>
        </Card>

        <Card className="bg-amber-100 border-amber-200 text-black shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider opacity-80 flex items-center gap-2">
              <Zap className="h-3 w-3 text-black-400" /> Projected Final
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{insights?.projectedFinalScore}%</div>
            <p className="text-[10px] opacity-60 mt-1 uppercase">Estimated course outcome</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Points Earned</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{summary.pointsEarned}</div>
            <p className="text-[10px] text-muted-foreground">Across all graded tasks</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Graded Items</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{summary.totalAssessments}</div>
            <p className="text-[10px] text-muted-foreground">Submissions + Discussions</p>
          </CardContent>
        </Card>
      </div>

      {/* INTERVENTION ALERT */}
      {insights?.weakestCategory && (
        <Alert variant="destructive" className="bg-white border-red-200 shadow-sm">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-bold text-red-700">
            Targeted Intervention Required: {insights.weakestCategory.name}
          </AlertTitle>
          <AlertDescription className="text-gray-700">
            Performance in <strong>{insights.weakestCategory.name}</strong> is currently at <strong>{insights.weakestCategory.average}%</strong>. 
            This is <strong>{insights.weakestCategory.gap}% lower</strong> than their highest performing category, significantly impacting the weighted average.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* PROGRESS CHART */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Timeline</CardTitle>
            <CardDescription>Chronological view of individual item percentages</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.lineChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   formatter={(v) => [`${parseFloat(v).toFixed(1)}%`, "Score"]} 
                />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CATEGORY BAR CHART */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Competency Profile</CardTitle>
            <CardDescription>Average proficiency per weighted category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={charts.categoryPerformance} margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 11, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v) => [`${parseFloat(v).toFixed(1)}%`, "Avg"]} />
                <Bar dataKey="average" radius={[0, 4, 4, 0]} barSize={28}>
                  {charts.categoryPerformance.map((entry, index) => (
                    <Cell key={index} fill={entry.average >= 80 ? "#10b981" : entry.average >= 60 ? "#3b82f6" : "#f43f5e"} />
                  ))}
                  <LabelList dataKey="average" position="right" formatter={(v) => `${parseFloat(v).toFixed(0)}%`} className="font-bold fill-slate-600" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* TEACHER ADVICE FOOTER */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Educator Strategy Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 text-sm leading-relaxed">
            {isImproving 
              ? `The student has demonstrated a significant positive shift in performance. Focus on maintaining this level of engagement. Their current momentum suggests a predicted outcome of ${insights?.projectedFinalScore}%, which exceeds their historical average.`
              : `Intervention is recommended. The student's current performance is trending downward. Direct support in "${insights?.weakestCategory?.name}" could provide the necessary correction to steer them back toward their historical average of ${insights?.overallAverage}%.`
            }
          </p>
          <div className="flex flex-wrap gap-2 print:hidden">
            <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-600 border border-slate-200">
              Goal: {insights?.projectedFinalScore}%
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-red-600 border border-red-100">
              Weakness: {insights?.weakestCategory?.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}