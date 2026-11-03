"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  Upload,
  FileText,
  Calendar,
  Clock,
  Loader,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { format } from "date-fns";
import { useParams, Link } from "react-router-dom";
import AssessmentFilters from "@/CustomComponent/Student/AssessmentFilters";

// Custom Toast Component
import MotivationToast from "@/CustomComponent/Toast/MotivationToast";

// Sonner Toast
import { toast } from "sonner";

const tableHead = ["Assessment Name", "Course", "Due Date", "Status", "Type"];

const Assessment = () => {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [expandedAssessmentId, setExpandedAssessmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(assessments, "assessmentsF")

  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    status: "all",
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          "assessment/getAllassessmentforStudent",
        );

        let filteredByCourse = id
          ? res.data.filter((a) => a.course?._id === id)
          : res.data;

        setAssessments(filteredByCourse);

        // Extract unique categories
        const uniqueCategories = [];
        filteredByCourse.forEach((a) => {
          if (
            a.category?._id &&
            !uniqueCategories.some((c) => c._id === a.category._id)
          ) {
            uniqueCategories.push(a.category);
          }
        });
        setCategories(uniqueCategories);

        // Extract unique types
        setTypes([...new Set(filteredByCourse.map((a) => a.type))]);

        // --------------------------------------
        // 🔥 Show Motivation Toast
        // --------------------------------------
        const pending = filteredByCourse.filter((a) => !a.isSubmitted);

        const nearestDueDate = pending
          .filter((a) => a?.dueDate?.date)
          .map((a) => new Date(a.dueDate.date))
          .sort((a, b) => a - b)[0];

        toast.custom(
          (t) => (
            <MotivationToast
              pendingCount={pending.length}
              nearestDueDate={nearestDueDate}
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          {
            position: "top-right",
          },
        );

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch assessments");
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const formatDueDate = (date, time) => {
    try {
      if (!date) return "No Deadline";
      let dateObj;
      if (time) {
        const datePart = new Date(date).toISOString().split("T")[0];
        dateObj = new Date(`${datePart}T${time}${time.endsWith("Z") ? "" : "Z"}`);
      } else {
        dateObj = new Date(date);
      }
      if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
      return format(dateObj, "MMM dd, yyyy 'at' hh:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime12h = (timeStr, dateStr) => {
    try {
      if (!timeStr) return "N/A";
      let dateObj;
      if (dateStr) {
        const datePart = new Date(dateStr).toISOString().split("T")[0];
        dateObj = new Date(`${datePart}T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`);
      } else {
        dateObj = new Date(`1970-01-01T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`);
      }
      if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
      return format(dateObj, "hh:mm a");
    } catch {
      return timeStr;
    }
  };

  const toggleAssessmentExpand = (assessmentId) => {
    setExpandedAssessmentId(
      expandedAssessmentId === assessmentId ? null : assessmentId,
    );
  };

  const getStatusLabel = (isSubmitted) =>
    isSubmitted ? "Submitted" : "Pending";

  const getStatusClass = (isSubmitted) =>
    isSubmitted
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  // Apply search + filters
  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch = a.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filters.category === "all" || a.category?.name === filters.category;
    const matchesType = filters.type === "all" || a.type === filters.type;
    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "submitted" && a.isSubmitted) ||
      (filters.status === "pending" && !a.isSubmitted);

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div
        className="flex items-center justify-center w-full h-screen"
        role="status"
      >
        <Loader className="animate-spin" />
        <span className="sr-only">Loading assessments...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="w-full p-6">
      <p className="text-xl py-4 mb-4 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
        {id ? "Assessments for this Course" : "All Assessments"}
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <Input
          placeholder="Search by title"
          aria-label="Search assessments by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <AssessmentFilters
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          types={types}
        />
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHead.map((item, idx) => (
                  <TableHead key={idx}>{item}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment) => (
                  <React.Fragment key={assessment._id}>
                    <TableRow className="text-xs md:text-sm">
                      <TableCell
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer hover:text-blue-600 flex items-center gap-2"
                        onClick={() => toggleAssessmentExpand(assessment._id)}
                      >
                        {expandedAssessmentId === assessment._id ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <span
                          className={
                            expandedAssessmentId === assessment._id
                              ? "font-medium"
                              : ""
                          }
                        >
                          {assessment.title}
                        </span>
                      </TableCell>

                      <TableCell>
                        {assessment?.course?.courseTitle || "N/A"}
                      </TableCell>

                      <TableCell className="text-xs">
                        <div
                          className={`${
                            assessment.isExtended
                              ? "bg-green-500/10 text-green-700 font-medium rounded-full w-max px-2 py-1"
                              : ""
                          }`}
                          title={
                            assessment.isExtended
                              ? "Due date extended by the teacher"
                              : ""
                          }
                        >
                          {formatDueDate(
                            assessment.dueDate?.date,
                            assessment.dueDate?.time,
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                            assessment.isSubmitted,
                          )}`}
                        >
                          {getStatusLabel(assessment.isSubmitted)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="capitalize">
                          {assessment.type?.replace("-", " ") || "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>

                    {expandedAssessmentId === assessment._id && (
                      <TableRow className="bg-gray-50 border">
                        <TableCell colSpan={5} className="p-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Description
                              </h4>
                              <p className="text-sm text-gray-600">
                                {assessment.description ||
                                  "No description provided."}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Course
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  {assessment?.course?.courseTitle || "N/A"}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Due Date
                                </h4>
                                <div className="flex flex-col space-y-1">
                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    {assessment?.dueDate?.date &&
                                    !isNaN(
                                      new Date(
                                        assessment.dueDate.date,
                                      ).getTime(),
                                    )
                                      ? format(
                                          new Date(assessment.dueDate.date),
                                          "MMMM dd, yyyy",
                                        )
                                      : "Invalid date"}
                                  </p>

                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    {formatTime12h(assessment?.dueDate?.time, assessment?.dueDate?.date)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <Link
                              to={
                                assessment.source === "assessment"
                                  ? `/student/assessment/submission/${assessment._id}?courseId=${id}`
                                  : assessment.source === "discussion"
                                    ? `/student/discussions/${assessment._id}`
                                    : "#"
                              }
                            >
                              <Button
                                className="bg-green-500 text-white hover:bg-green-600"
                                size="sm"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {assessment.isSubmitted
                                  ? "See Results"
                                  : "Submit Assessment"}
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {search
                      ? "No assessments match your search."
                      : "No assessments available."}
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

export default Assessment;
