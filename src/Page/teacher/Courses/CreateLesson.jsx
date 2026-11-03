"use client";

import { useState, useId, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash, AlertCircle, Info, X, ArrowLeft } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import JoditEditor from "jodit-react";
import AiContentModal from "@/CustomComponent/Aichatbot/teacher/aimodal";

// Zod schema
const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed",
  });

// Schema for Google Drive files
const googleDriveFileSchema = z.object({
  url: z.string(),
  filename: z.string(),
  type: z.string(),
  source: z.literal("google_drive"),
});

// Mixed schema that accepts both File instances and Google Drive file objects
const mixedFileSchema = z.union([pdfFileSchema, googleDriveFileSchema]);

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
    .array(mixedFileSchema)
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        // Calculate total size only for local files
        const localFiles = files.filter((f) => f instanceof File);
        const totalSize = localFiles.reduce(
          (acc, file) => acc + (file?.size || 0),
          0
        );
        return totalSize <= 5 * 1024 * 1024;
      },
      {
        message: "Total local file size must not exceed 5MB",
      }
    ),
});

const CreateLesson = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  
  const [pdfInputs, setPdfInputs] = useState([{ id: Date.now(), file: null }]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [descValue, setDescValue] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [googleDriveFiles, setGoogleDriveFiles] = useState([]);
  const [showGoogleDrive, setShowGoogleDrive] = useState(false);

  const titleFieldId = useId();
  const descriptionFieldId = useId();
  const youtubeFieldId = useId();
  const otherLinkFieldId = useId();
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
  );

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
    
    // Combine local files and Google Drive files for form validation
    const allFiles = [
      ...updated.map((i) => i.file).filter(Boolean),
      ...googleDriveFiles,
    ];
    setValue("pdfFiles", allFiles, {
      shouldValidate: true,
    });
    toast.success(`File "${file.name}" added successfully.`);
  };

  const handleGoogleDriveFileUpload = (file) => {
    if (!file) return;

    // Add source field to identify as Google Drive file
    const driveFile = {
      ...file,
      source: "google_drive",
    };

    setGoogleDriveFiles((prev) => [...prev, driveFile]);
    
    // Combine local files and Google Drive files for form validation
    const localFiles = pdfInputs.map((i) => i.file).filter(Boolean);
    setValue("pdfFiles", [...localFiles, driveFile], {
      shouldValidate: true,
    });

    toast.success(`Google Drive file "${file.filename}" added successfully.`);
  };

  const removeGoogleDriveFile = (index) => {
    setGoogleDriveFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Update form value
    const localFiles = pdfInputs.map((i) => i.file).filter(Boolean);
    const updatedDriveFiles = googleDriveFiles.filter((_, i) => i !== index);
    setValue("pdfFiles", [...localFiles, ...updatedDriveFiles], {
      shouldValidate: true,
    });
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
    
    // Update form value with both local and Google Drive files
    const localFiles = updated.map((i) => i.file).filter(Boolean);
    setValue("pdfFiles", [...localFiles, ...googleDriveFiles], {
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
    formData.append("chapter", chapterId);

    // Append local PDF files
    pdfInputs
      .map((input) => input.file)
      .filter(Boolean)
      .forEach((file) => {
        formData.append("pdfFiles", file);
      });

    // Append Google Drive files metadata
    if (googleDriveFiles.length > 0) {
      formData.append("googleDriveFiles", JSON.stringify(googleDriveFiles));
    }

    try {
      const res = await axiosInstance.post("/lesson/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      // Navigate back to the previous page
      navigate(-1);
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
    setGoogleDriveFiles([]);
    setShowGoogleDrive(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEditorChange = useMemo(
    () => (newContent) => {
      setDescValue(newContent);
      setValue("lessonDescription", newContent, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="mb-4 -ml-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Lesson</h1>
            <p className="mt-2 text-gray-600">
              Create an engaging lesson with multimedia resources for your chapter.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border">
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
          <div className="space-y-4">
            <Label className="font-medium text-gray-700">
              Lesson PDF Files
              <span className="text-gray-400 text-sm ml-2">(Optional)</span>
            </Label>
            <p className="text-xs text-gray-600">
              Upload PDF files for students to download. Maximum total size: 5MB.
            </p>

            <div className="space-y-3">
              {pdfInputs.map((input, index) => (
                <div key={input.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        handleFileChange(input.id, e.target.files[0])
                      }
                      className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {input.file && (
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {input.file.name}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveField(input.id)}
                    disabled={pdfInputs.length === 1 || loading}
                    className="focus:ring-2 focus:ring-red-500 focus:outline-none text-red-600 hover:bg-red-50"
                    aria-label="Remove this file input"
                  >
                    <Trash className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add File Button */}
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddField}
                disabled={loading}
                className="focus:ring-2 focus:ring-blue-500 focus:outline-none bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Another File
              </Button>
            </div>

            {/* File Size Display */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-sm font-medium text-gray-700">
                Total File Size:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {(totalSize / (1024 * 1024)).toFixed(2)} MB / 5 MB
              </span>
            </div>

            {errors.pdfFiles && (
              <p className="text-red-500 text-sm flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {errors.pdfFiles.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="focus:ring-2 focus:ring-gray-500 focus:outline-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                "Create Lesson"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLesson;
