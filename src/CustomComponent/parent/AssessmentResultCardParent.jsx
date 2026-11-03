"use client";
import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle, XCircle, Trophy, MessageSquareQuote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AssessmentResultCardParent = ({ report }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="w-full border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <div className="h-3 bg-gradient-to-r from-green-400 to-green-600" />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-black text-gray-800">
                {report?.assessmentTitle}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge className={report?.status === "before due date" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-red-100 text-red-700 hover:bg-red-100 border-none"}>
                  {report?.status === "before due date" ? "Submitted On Time" : "Late Submission"}
                </Badge>
                <Badge variant="outline" className="border-slate-200 text-slate-500">
                  {report?.category || "General"}
                </Badge>
              </div>
            </div>
            <div className="md:text-right bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted At</p>
              <p className="text-sm font-bold text-slate-700">{formatDate(report?.submittedAt)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Summary Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-green-600 rounded-2xl text-white flex items-center gap-5 shadow-lg shadow-green-100">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                <Trophy size={32} />
              </div>
              <div>
                <p className="text-xs font-bold text-green-100 uppercase tracking-tighter">Total Achieved Points</p>
                <p className="text-4xl font-black">{report?.totalScore} <span className="text-lg font-normal text-green-200">Points</span></p>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-2xl text-white flex items-center gap-5 shadow-lg shadow-slate-200">
               <div className={`p-3 rounded-xl backdrop-blur-md ${report?.graded ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                 {report?.graded ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Grading Status</p>
                 <p className="text-xl font-bold">{report?.graded ? "Grade Finalized" : "Pending Evaluation"}</p>
               </div>
            </div>
          </section>

          {/* Instructor Feedback */}
          {report?.instructorFeedback && (
            <section className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
               <MessageSquareQuote className="text-blue-500 shrink-0" size={24} />
               <div>
                  <h4 className="font-bold text-blue-900 mb-1">Instructor Feedback</h4>
                  <p className="text-sm text-blue-800 italic">"{report.instructorFeedback}"</p>
               </div>
            </section>
          )}

          {/* Response List */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-green-600" size={20} /> Question-by-Question Review
             </h3>
             {report?.results?.map((answer, index) => (
                <QuestionCard key={answer._id || index} answer={answer} index={index} />
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuestionCard = ({ answer, index }) => {
  const qData = answer.questionData;
  const questionType = qData?.type || "unknown";

  return (
    <Card className="border border-gray-100 shadow-none rounded-2xl overflow-hidden bg-slate-50/30">
      <CardHeader className="bg-white py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200">
                {index + 1}
            </div>
            <div>
                <Badge variant="secondary" className="text-[9px] uppercase font-black tracking-tighter py-0">{questionType}</Badge>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
          {answer?.requiresManualCheck ? (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase">
                <AlertCircle size={14} /> Pending Review
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 text-xs font-bold uppercase ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {answer.isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {answer.isCorrect ? 'Correct' : 'Incorrect'}
            </div>
          )}
          <div className="h-8 border-l border-gray-200" />
          <span className="text-sm font-black text-gray-700">{answer?.pointsAwarded || 0} / {qData?.points} pts</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Question Prompt</p>
          <div className="text-gray-800 text-sm prose max-w-none font-medium" dangerouslySetInnerHTML={{ __html: qData?.question || "" }} />
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Student's Submitted Response</p>
          <div className="text-sm text-gray-700">
            {questionType === "truefalse" ? (
                <span className="font-bold text-slate-900 capitalize">{answer?.selectedAnswer}</span>
            ) : questionType === "mcq" ? (
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-bold text-slate-900">{answer?.selectedAnswer}</span>
                </div>
            ) : questionType === "file" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {answer?.file?.map((f, i) => (
                        <a key={i} href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-green-400 transition-colors group">
                            <FileText size={18} className="text-slate-400 group-hover:text-green-500" />
                            <span className="truncate flex-1 font-medium">{f.filename}</span>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 p-3 rounded-lg italic border-l-4 border-slate-200" dangerouslySetInnerHTML={{ __html: answer?.selectedAnswer || "No text provided" }} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentResultCardParent;