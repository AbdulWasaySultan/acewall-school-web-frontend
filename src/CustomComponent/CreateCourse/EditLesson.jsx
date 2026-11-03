"use client";

import React, { useState, useRef, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pen, AlertCircle, Info } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

import JoditEditor from "jodit-react";

// Zod schema
const lessonSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  youtubeLinks: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine(
      (val) =>
        !val ||
        /^https:\/\/(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/)[\w-]{11}(&[^ ]*)?|youtu\.be\/[\w-]{11}(\?[^ ]*)?)$/.test(
          val
        ),
      {
        message:
          "Enter a valid YouTube video link (e.g., https://youtube.com/watch?v=...)",
      }
    ),
  otherLink: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^https?:\/\/.+$/.test(val), {
      message: "Must be a valid URL starting with http:// or https://",
    }),
});

const EditLessonModal = ({ lesson, fetchChapterDetail }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(lesson.description || "");
  const [descriptionError, setDescriptionError] = useState("");

  const editor = useRef(null);

  const dialogId = useId();
  const titleFieldId = useId();
  const descriptionFieldId = useId();
  const youtubeFieldId = useId();
  const otherLinkFieldId = useId();
  const helperTextId = useId();
  const characterCountId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title || "",
      description: lesson.description || "",
      youtubeLinks: lesson.youtubeLinks || "",
      otherLink: lesson.otherLink || "",
    },
  });

  const validateDescription = (text) => {
    if (!text || text.length < 5) {
      setDescriptionError("Description must be at least 5 characters");
      return false;
    }
    if (text.length > 5000) {
      setDescriptionError("Description must not exceed 5000 characters");
      return false;
    }
    setDescriptionError("");
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateDescription(description)) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", description);
    formData.append("youtubeLinks", data.youtubeLinks || "");
    formData.append("otherLink", data.otherLink || "");

    try {
      const res = await axiosInstance.put(
        `/lesson/edit/${lesson._id}`,
        formData
      );
      toast.success(res.data.message);
      fetchChapterDetail();
      reset();
      setDescription("");
      setDescriptionError("");
      setOpen(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to save lesson. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setDescription(lesson.description || "");
    setDescriptionError("");
    setOpen(false);
  };

  const descriptionLength = description.length;
  const descriptionMax = 5000;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ml-auto"
          aria-label={`Edit lesson: ${lesson.title}`}
          title="Edit this lesson"
        >
          <Pen size={16} aria-hidden="true" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px] max-h-[80dvh] overflow-y-auto focus:ring-2 focus:ring-blue-500"
        role="dialog"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-description`}
      >
        <DialogHeader>
          <DialogTitle id={`${dialogId}-title`}>Edit Lesson</DialogTitle>
          <DialogDescription
            id={`${dialogId}-description`}
            className="flex items-start gap-2 mt-2"
          >
            <Info
              className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              Update lesson details including title, description, and resource
              links. All fields marked with{" "}
              <span className="text-red-500">*</span> are required.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor={titleFieldId} className="font-medium text-gray-700">
              Lesson Title
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            </Label>
            <Input
              id={titleFieldId}
              placeholder="Enter a descriptive lesson title"
              maxLength={100}
              {...register("title")}
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={
                errors.title ? `${titleFieldId}-error` : undefined
              }
              aria-invalid={!!errors.title}
            />
            <div className="flex items-start justify-between">
              <div>
                {errors.title && (
                  <p
                    id={`${titleFieldId}-error`}
                    className="text-red-500 text-sm flex items-center gap-1 mt-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    {errors.title.message}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500" aria-live="polite">
                {register("title").name} character count provided by browser
              </span>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label
              htmlFor={descriptionFieldId}
              className="font-medium text-gray-700"
            >
              Lesson Description
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            </Label>
            <p className="text-xs text-gray-600">
              Use the rich text editor below to format your description.
            </p>
            <div
              className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
              aria-label="Rich text editor for lesson description"
            >
              <JoditEditor
                ref={editor}
                value={description}
                onBlur={(newContent) => {
                  setDescription(newContent);
                  validateDescription(newContent);
                }}
                config={{
                  readonly: false,
                  placeholder: "Enter lesson description with formatting...",
                  buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "ul",
                    "ol",
                    "|",
                    "link",
                    "image",
                    "|",
                    "undo",
                    "redo",
                  ],
                }}
              />
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {descriptionError && (
                  <p
                    id={`${descriptionFieldId}-error`}
                    className="text-red-500 text-sm flex items-center gap-1 mt-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    {descriptionError}
                  </p>
                )}
              </div>
              <span
                id={characterCountId}
                className="text-xs text-gray-500 whitespace-nowrap ml-2"
                aria-live="polite"
                aria-atomic="true"
              >
                {descriptionLength}/{descriptionMax} characters
              </span>
            </div>
          </div>

          {/* YouTube Link Field */}
          <div className="space-y-2">
            <Label
              htmlFor={youtubeFieldId}
              className="font-medium text-gray-700"
            >
              YouTube Link
              <span className="text-gray-400 text-sm ml-2">(Optional)</span>
            </Label>
            <Input
              id={youtubeFieldId}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              {...register("youtubeLinks")}
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={
                errors.youtubeLinks
                  ? `${youtubeFieldId}-error`
                  : `${youtubeFieldId}-hint`
              }
              aria-invalid={!!errors.youtubeLinks}
            />
            {!errors.youtubeLinks && (
              <p
                id={`${youtubeFieldId}-hint`}
                className="text-xs text-gray-500"
              >
                Paste a valid YouTube video link (watch, embed, or shortened
                youtu.be format)
              </p>
            )}
            {errors.youtubeLinks && (
              <p
                id={`${youtubeFieldId}-error`}
                className="text-red-500 text-sm flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.youtubeLinks.message}
              </p>
            )}
          </div>

          {/* Other Link Field */}
          <div className="space-y-2">
            <Label
              htmlFor={otherLinkFieldId}
              className="font-medium text-gray-700"
            >
              Other Resource Link
              <span className="text-gray-400 text-sm ml-2">(Optional)</span>
            </Label>
            <Input
              id={otherLinkFieldId}
              placeholder="https://example.com"
              {...register("otherLink")}
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={
                errors.otherLink
                  ? `${otherLinkFieldId}-error`
                  : `${otherLinkFieldId}-hint`
              }
              aria-invalid={!!errors.otherLink}
            />
            {!errors.otherLink && (
              <p
                id={`${otherLinkFieldId}-hint`}
                className="text-xs text-gray-500"
              >
                Link to any external resource (must start with http:// or
                https://)
              </p>
            )}
            {errors.otherLink && (
              <p
                id={`${otherLinkFieldId}-error`}
                className="text-red-500 text-sm flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.otherLink.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="gap-2 flex flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="focus:ring-2 focus:ring-gray-500 focus:outline-none"
              aria-label="Cancel and close the edit lesson dialog"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-busy={loading}
              aria-label={loading ? "Saving lesson..." : "Save lesson changes"}
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                "Save Lesson"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLessonModal;
