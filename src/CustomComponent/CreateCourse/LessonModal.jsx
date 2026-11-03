"use client";

import { useState, useId, useRef, useMemo } from "react";
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
import { Plus, Trash, AlertCircle, Info } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import JoditEditor from "jodit-react";
import AiContentModal from "../Aichatbot/teacher/aimodal";

// Zod schema
const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed",
  });

const lessonSchema = z.object({
  lessonTitle: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  lessonDescription: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(250000, "Description exceeds maximum length"),
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
  pdfFiles: z
    .array(pdfFileSchema)
    .optional()
    .refine(
      (files) =>
        !files ||
        files.reduce((acc, file) => acc + (file?.size || 0), 0) <=
          5 * 1024 * 1024,
      {
        message: "Total file size must not exceed 5MB",
      }
    ),
});

const LessonModal = ({ type, chapterID, fetchQuarterDetail }) => {
  const [open, setOpen] = useState(false);
  const [pdfInputs, setPdfInputs] = useState([{ id: Date.now(), file: null }]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [descValue, setDescValue] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  console.log(descValue, "descValue");

  const dialogId = useId();
  const titleFieldId = useId();
  const descriptionFieldId = useId();
  const youtubeFieldId = useId();
  const otherLinkFieldId = useId();
  const pdfFieldId = useId();
  const totalSizeId = useId();
  const editorRef = useRef(null);

  const MAX_TITLE_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 250000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarSticky: true,
      toolbarButtonSize: "middle",
      askBeforePasteHTML: true,
      askBeforePasteFromWord: true,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "superscript",
        "subscript",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "video",
        "link",
        "table",
        "|",
        "align",
        "undo",
        "redo",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "fullsize",
        "source",
      ],
    }),
    []
  ); // Empty dependency array ensures config is created only once

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      lessonTitle: "",
      lessonDescription: "",
      youtubeLinks: "",
      otherLink: "",
      pdfFiles: [],
    },
  });

  console.log("Form errors:", errors); // Debug

  const calculateTotalSize = (files) =>
    files.reduce((acc, f) => acc + (f?.size || 0), 0);
  const handleFileChange = (id, file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed. Please select a PDF.");
      return;
    }

    const updated = pdfInputs.map((input) =>
      input.id === id ? { ...input, file } : input
    );

    const newSize = calculateTotalSize(updated.map((i) => i.file));
    if (newSize > MAX_FILE_SIZE) {
      toast.error("Total file size exceeds 5MB. Please remove some files.");
      return;
    }

    setPdfInputs(updated);
    setTotalSize(newSize);
    setValue("pdfFiles", updated.map((i) => i.file).filter(Boolean), {
      shouldValidate: true,
    });
    toast.success(`File "${file.name}" added successfully.`);
  };

  const handleAddField = () => {
    const currentTotal = calculateTotalSize(pdfInputs.map((i) => i.file));
    if (currentTotal >= MAX_FILE_SIZE) {
      toast.error("Cannot add more files. 5MB limit reached.");
      return;
    }

    setPdfInputs((prev) => [...prev, { id: Date.now(), file: null }]);
  };

  const handleRemoveField = (id) => {
    if (pdfInputs.length === 1) {
      toast.error("You must keep at least one file input field.");
      return;
    }

    const updated = pdfInputs.filter((input) => input.id !== id);
    const newSize = calculateTotalSize(updated.map((i) => i.file));
    setPdfInputs(updated);
    setTotalSize(newSize);
    setValue("pdfFiles", updated.map((i) => i.file).filter(Boolean), {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.lessonTitle);
    formData.append("description", data.lessonDescription);
    formData.append("youtubeLinks", data.youtubeLinks || "");
    formData.append("otherLink", data.otherLink || "");
    formData.append("chapter", chapterID);

    pdfInputs
      .map((input) => input.file)
      .filter(Boolean)
      .forEach((file) => {
        formData.append("pdfFiles", file);
      });

    try {
      const res = await axiosInstance.post("/lesson/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      fetchQuarterDetail();
      handleReset();
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

  const handleReset = () => {
    reset();
    setPdfInputs([{ id: Date.now(), file: null }]);
    setTitleValue("");
    setDescValue("");
    setTotalSize(0);
  };

  const handleCancel = () => {
    handleReset();
    setOpen(false);
  };

  const handleEditorChange = useMemo(
    () => (newContent) => {
      setDescValue(newContent);
      setValue("lessonDescription", newContent, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="flex items-center gap-2 text-green-600 hover:text-green-700 active:text-green-800 py-2 px-3 rounded cursor-pointer transition-colors duration-150 text-sm"
          aria-label="Open dialog to add a new lesson"
          title="Add a new lesson to this chapter"
        >
          <Plus className="h-4 w-4 text-gray" aria-hidden="true" />
          Add Lesson
        </div>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[90%] max-h-[80dvh] overflow-y-auto focus:ring-2 focus:ring-blue-500"
        role="dialog"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-description`}
      >
        <DialogHeader>
          <DialogTitle id={`${dialogId}-title`}>Add New Lesson</DialogTitle>
          <DialogDescription
            id={`${dialogId}-description`}
            className="flex items-start gap-2 mt-2"
          >
            <Info
              className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              Create a lesson with title, description, and optional resources.
              Fields marked with <span className="text-red-500">*</span> are
              required. Maximum file size: 5MB total.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={titleFieldId}
                className="font-medium text-gray-700"
              >
                Lesson Title
                <span className="text-red-500 ml-1" aria-label="required">
                  *
                </span>
              </Label>
              <AiContentModal
                aiResponse={aiResponse}
                setAiResponse={setAiResponse}
                usedfor="lessonTitle"
                setValue={setValue}
              />
            </div>
            <Input
              id={titleFieldId}
              placeholder="Enter a descriptive lesson title"
              {...register("lessonTitle")}
              value={titleValue}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_TITLE_LENGTH) {
                  setTitleValue(value);
                  setValue("lessonTitle", value);
                }
              }}
              className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby={
                errors.lessonTitle
                  ? `${titleFieldId}-error`
                  : `${titleFieldId}-count`
              }
              aria-invalid={!!errors.lessonTitle}
            />
            <div className="flex items-center justify-between">
              <div>
                {errors.lessonTitle && (
                  <p
                    id={`${titleFieldId}-error`}
                    className="text-red-500 text-sm flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    {errors.lessonTitle.message}
                  </p>
                )}
              </div>
              <span
                id={`${titleFieldId}-count`}
                className="text-xs text-gray-500"
                aria-live="polite"
              >
                {titleValue.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={descriptionFieldId}
                className="font-medium text-gray-700"
              >
                Lesson Description
                <span className="text-red-500 ml-1" aria-label="required">
                  *
                </span>
              </Label>

              <AiContentModal
                aiResponse={aiResponse}
                setAiResponse={setAiResponse}
                usedfor="lessonDescription"
                handleEditorChange={handleEditorChange}
              />
            </div>

            <p className="text-xs text-gray-600">
              Use the rich text editor to format your description with bold,
              italic, lists, and links.
            </p>
            <div
              className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
              aria-label="Rich text editor"
            >
              <JoditEditor
                ref={editorRef}
                config={editorConfig}
                value={descValue}
                onBlur={handleEditorChange}
                tabIndex={1}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                {errors.lessonDescription && (
                  <p
                    id={`${descriptionFieldId}-error`}
                    className="text-red-500 text-sm flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    {errors.lessonDescription.message}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500" aria-live="polite">
                {descValue.length}/{MAX_DESCRIPTION_LENGTH}
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

          {/* PDF Files Field */}
          <div className="space-y-3">
            <Label className="font-medium text-gray-700">
              Lesson PDF Files
              <span className="text-gray-400 text-sm ml-2">(Optional)</span>
            </Label>
            <p className="text-xs text-gray-600">
              Upload PDF resources to support your lesson. You can add multiple
              files up to 5MB total.
            </p>

            {/* PDF Input Fields */}
            <div className="space-y-2">
              {pdfInputs.map((input, index) => (
                <div
                  key={input.id}
                  className="flex items-end gap-2 p-3 bg-gray-50 rounded-md border border-gray-200"
                  role="group"
                  aria-label={`PDF file ${index + 1}`}
                >
                  <div className="flex-1">
                    <Label
                      htmlFor={`pdf-${input.id}`}
                      className="text-xs text-gray-600"
                    >
                      File {index + 1}
                      {input.file && (
                        <span className="ml-2 text-green-600 font-medium">
                          ✓ {input.file.name}
                        </span>
                      )}
                    </Label>
                    <Input
                      id={`pdf-${input.id}`}
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        handleFileChange(input.id, e.target.files?.[0])
                      }
                      className="focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                      aria-label={`Upload PDF file ${index + 1}`}
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveField(input.id)}
                    disabled={pdfInputs.length === 1 || loading}
                    className={`flex-shrink-0 ${
                      pdfInputs.length === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-100 text-red-600"
                    }`}
                    aria-label={`Remove PDF file ${index + 1}`}
                    title={
                      pdfInputs.length === 1
                        ? "Cannot remove the only file input"
                        : "Remove this file input"
                    }
                  >
                    <Trash className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add File Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddField}
              disabled={loading}
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none bg-transparent"
              aria-label="Add another PDF file input"
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Another File
            </Button>

            {/* File Size Display */}
            <div
              id={totalSizeId}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-sm font-medium text-gray-700">
                Total File Size:
              </span>
              <span
                className={`text-sm font-semibold ${
                  totalSize > MAX_FILE_SIZE * 0.8
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {(totalSize / 1024 / 1024).toFixed(2)} MB / 5 MB
              </span>
            </div>

            {errors.pdfFiles && (
              <p
                className="text-red-500 text-sm flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.pdfFiles.message}
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
              className="focus:ring-2 focus:ring-gray-500 focus:outline-none bg-transparent"
              aria-label="Cancel and close the add lesson dialog"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Submit the new lesson"
            >
              {loading ? "Adding Lesson..." : "Add Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
