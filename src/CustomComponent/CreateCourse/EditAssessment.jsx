"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import CategoryDropdown from "@/CustomComponent/Assessment/Assessment-category-dropdown";
import StrictDatePicker from "@/CustomComponent/Assessment/DueDatePicker";
import { Pen } from "lucide-react";

/* ---------------- VALIDATION SCHEMA ------------------ */
const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 3 characters").max(120),
  description: z
    .string()
    .min(1, "Description must be at least 10 characters")
    .max(1000),
  category: z.string().min(1, "Please select a category"),
  dueDate: z.object({
    dateTime: z.preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z.date({ required_error: "Due date is required" })
    ),
  }),
});

export default function EditAssessmentDialog({ assessment, fetchAssessment }) {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- FETCH QUARTER DATE ------------------ */
  useEffect(() => {
    const fetchQuarterDate = async () => {
      try {
        const res = await axiosInstance.get(
          `quarter/getDatesofQuarter/${assessment.quarter}`
        );
        setStartDate(new Date(res.data.startDate));
        setEndDate(new Date(res.data.endDate));
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuarterDate();
  }, []);

  const minDate = startDate < endDate ? startDate : endDate;
  const maxDate = endDate > startDate ? endDate : startDate;

  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    if (timeStr) {
      const datePart = new Date(dateStr).toISOString().split("T")[0];
      const combinedStr = `${datePart}T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`;
      const dateTime = new Date(combinedStr);
      return isNaN(dateTime.getTime()) ? null : dateTime;
    } else {
      const dateTime = new Date(dateStr);
      return isNaN(dateTime.getTime()) ? null : dateTime;
    }
  };

  /* ---------------- INIT FORM ------------------ */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: assessment.title,
      description: assessment.description,
      category: assessment.category?._id || "",
      dueDate: {
        dateTime: combineDateTime(
          assessment.dueDate?.date,
          assessment.dueDate?.time
        ),
      },
    },
  });

  /* ---------------- SUBMIT HANDLER ------------------ */
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const toastId = toast.loading("Updating assessment...");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append(type, id);

      const dueDate = new Date(data.dueDate.dateTime);

      if (dueDate < minDate || dueDate > maxDate) {
        toast.error("Due date must be within the allowed range", {
          id: toastId,
        });
        setIsSubmitting(false);
        return;
      }

      formData.append("dueDate", dueDate.toISOString());

      const res = await axiosInstance.put(
        `assessment/editAssessment/${assessment._id}`,
        formData
      );

      toast.success(res.data.message, { id: toastId });
      fetchAssessment();
      setOpen(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update assessment",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ------------- ADA FIX: ICON BUTTON LABELED ------------- */}
      <DialogTrigger asChild>
        <button
          aria-label="Edit assessment"
          className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Pen size={16} aria-hidden="true" />
        </button>
      </DialogTrigger>

      {/* ------------- DIALOG CONTENT ------------- */}
      <DialogContent
        className="max-w-xl"
        aria-labelledby="edit-assessment-title"
        aria-describedby="edit-assessment-description"
      >
        <DialogHeader>
          <DialogTitle id="edit-assessment-title">Edit Assessment</DialogTitle>
          <DialogDescription id="edit-assessment-description">
            Update assessment details below.
          </DialogDescription>
        </DialogHeader>

        {/* ---------------- FORM ------------------ */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* TITLE FIELD */}
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="assessment-title">
                    Assessment Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="assessment-title"
                      {...field}
                      aria-invalid={fieldState.error ? "true" : "false"}
                      aria-describedby="assessment-title-error"
                      placeholder="Enter Assessment Title"
                    />
                  </FormControl>
                  <FormMessage id="assessment-title-error" />
                </FormItem>
              )}
            />

            {/* DESCRIPTION FIELD */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="assessment-description">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="assessment-description"
                      {...field}
                      aria-invalid={fieldState.error ? "true" : "false"}
                      aria-describedby="assessment-description-error"
                      placeholder="Enter assessment description"
                    />
                  </FormControl>
                  <FormMessage id="assessment-description-error" />
                </FormItem>
              )}
            />

            {/* CATEGORY FIELD */}
            <FormField
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="category-select">Category</FormLabel>
                  <FormControl>
                    <CategoryDropdown
                      id="category-select"
                      assessmentId={assessment.id}
                      courseId={assessment.course}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.error ? "true" : "false"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DUE DATE FIELD */}
            <div>
              <Label htmlFor="due-date-picker">Due Date</Label>
              <StrictDatePicker
                id="due-date-picker"
                name="dueDate"
                minDate={minDate}
                maxDate={maxDate}
                aria-describedby="due-date-error"
              />
              <FormMessage id="due-date-error" />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
