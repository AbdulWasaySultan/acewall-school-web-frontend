"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import AssessmentResultCardParent from "./AssessmentResultCardParent";

export default function ParentAssessmentResultPage() {
  const { studentId, assessmentId } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/parent/submission-detail/${studentId}/${assessmentId}`);
        console.log(res);
        
        if (res.data.success) {
          // In the new API, we wrapped data inside a 'data' key
          setReportData(res.data);
        }
      } catch (err) {
        console.error("Failed to load results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [studentId, assessmentId]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-green-600 mx-auto" size={48} />
        <p className="text-gray-500 font-medium">Generating performance report...</p>
      </div>
    </div>
  );

  if (!reportData) return <div className="p-10 text-center">Result not available for this student.</div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 text-green-700 hover:bg-green-50 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assessment List
      </Button>
      
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Performance Report</h1>
        <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-500">Student:</span>
            <span className="font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                {reportData.studentName}
            </span>
        </div>
      </div>

      {/* Passing the structured data object to the card */}
      <AssessmentResultCardParent report={reportData.data} />
    </div>
  );
}