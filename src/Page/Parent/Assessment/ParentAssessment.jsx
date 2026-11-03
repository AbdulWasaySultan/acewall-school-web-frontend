"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Calendar,
  Clock,
  Loader,
  AlertCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";

const tableHead = ["Assessment Name", "Course", "Due Date", "Status", "Type"];

const ParentAssessment = () => {
  // studentId = child unique ID
  // id = course unique ID from URL params
  const { studentId, id: courseId } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [parentAssessments, setParentAssessments] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        // Fetch all assessments for this child
        const res = await axiosInstance.get(
          `/parent/get-child-assessments/${studentId}`
        );
        console.log(res);
        
        const allData = res.data.data || [];
        setStudentName(res.data.studentName);

        // Filter the full list to ONLY show assessments belonging to this courseId
        // This ensures the page shows "All" (Pending + Submitted) for this specific course
        let filteredByCourse = courseId
          ? allData.filter((a) => a.course?._id === courseId)
          : allData;

        setParentAssessments(filteredByCourse);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch records for this student.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [studentId, courseId]);

  const formatDueDate = (dueDateObj) => {
    if (!dueDateObj || !dueDateObj.date) return "No Deadline";
    try {
      const dateObj = new Date(dueDateObj.date);
      if (isNaN(dateObj.getTime())) return "Invalid date";
      const formattedDate = format(dateObj, "MMM dd, yyyy");
      const time = dueDateObj.time ? ` at ${dueDateObj.time}` : "";
      return `${formattedDate}${time}`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const filteredItems = useMemo(() => {
    return parentAssessments.filter((a) =>
      a.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [parentAssessments, search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh] gap-4">
        <Loader className="animate-spin text-green-600" size={40} />
        <p className="text-gray-500 animate-pulse">Loading course records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500 p-8 bg-red-50 rounded-lg m-6">
        <AlertCircle /> {error}
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
             Course Curriculum & Assessments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitoring progress for <span className="font-bold text-green-600">{studentName}</span>
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assessments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 focus-visible:ring-green-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <ScrollArea className="h-[calc(100vh-280px)]">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                {tableHead.map((item, idx) => (
                  <TableHead key={idx} className="font-bold text-gray-700">{item}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isExpanded = expandedId === item._id;
                  return (
                    <React.Fragment key={item._id}>
                      <TableRow
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${isExpanded ? "bg-green-50/30" : ""}`}
                        onClick={() => setExpandedId(isExpanded ? null : item._id)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronDown size={16} className="text-green-600"/> : <ChevronRight size={16}/>}
                            {item.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{item.course?.courseTitle || "N/A"}</TableCell>
                        <TableCell className="text-gray-500">
                          {formatDueDate(item.dueDate)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.isSubmitted ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                            {item.isSubmitted ? "Submitted" : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-gray-100 text-gray-600 capitalize border-none font-medium">
                            {item.source}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow className="bg-gray-50/40 hover:bg-gray-50/40 border-b">
                          <TableCell colSpan={5} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Instructions</h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {item.description || "No specific instructions provided."}
                                  </p>
                                </div>
                                
                                {item.isSubmitted && (
                                  <Button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/parent/${studentId}/assessment-result/${item._id}`);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl gap-2 shadow-sm"
                                  >
                                    <Eye size={16} /> See Results & Grades
                                  </Button>
                                )}
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Details</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Chapter</p>
                                    <p className="text-sm font-semibold truncate text-gray-700">{item.chapter?.title || "General"}</p>
                                  </div>
                                 
                                </div>
                                
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${item.isSubmitted ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                                  {item.isSubmitted ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                  <div className="text-sm font-semibold">
                                    {item.isSubmitted 
                                      ? "Task has been submitted for grading." 
                                      : "This task is currently pending submission."}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-24 text-gray-400 italic bg-gray-50/30">
                    No assessments found for this course criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
);

export default ParentAssessment;