"use client";

import React, { useEffect, useState, useId } from "react";
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
import { Button } from "@/components/ui/button";
import { Plus, Trash, AlertCircle, FileText, Info } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

/**
 * AddMoreFile
 *
 * - lessonId: id of the lesson to add files to
 * - fetchChapterDetail: callback to refresh parent data after successful upload
 *
 * Notes:
 * - server total size (prev) fetched from `lesson/getallFilesofLesson/${lessonId}`
 *   must return `totalSizeinMB` (number) or `totalSizeInBytes` — we handle both variants.
 */

const MAX_TOTAL_BYTES = 5 * 1024 * 1024; // 5 MB

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
};

const AddMoreFile = ({ lessonId, fetchChapterDetail }) => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [prevSizeBytes, setPrevSizeBytes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPrevFiles, setLoadingPrevFiles] = useState(false);

  const dialogId = useId();
  const fileInputId = useId();
  const sizeWarningId = useId();
  const selectedFilesId = useId();

  // Fetch previously uploaded total size (in bytes)
  const prevFiles = async () => {
    setLoadingPrevFiles(true);
    try {
      const res = await axiosInstance.get(
        `/lesson/getallFilesofLesson/${lessonId}`
      );
      // API might return totalSizeinMB or totalSizeInBytes; handle both.
      const mb = res.data?.totalSizeinMB;
      const bytes = res.data?.totalSizeInBytes;
      if (typeof bytes === "number") {
        setPrevSizeBytes(bytes);
      } else if (typeof mb === "number") {
        setPrevSizeBytes(Math.round(mb * 1024 * 1024));
      } else {
        setPrevSizeBytes(0);
      }
    } catch (err) {
      console.error("Error fetching previous files size:", err);
      setPrevSizeBytes(0);
    } finally {
      setLoadingPrevFiles(false);
    }
  };

  useEffect(() => {
    if (lessonId && open) {
      prevFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, open]);

  // Helper to compute total size of selected files in bytes
  const getSelectedBytes = (filesArray) =>
    filesArray.reduce((acc, f) => acc + (f?.size || 0), 0);

  // Remaining bytes allowed
  const selectedBytes = getSelectedBytes(selectedFiles);
  const totalBytes = prevSizeBytes + selectedBytes;
  const remainingBytes = Math.max(0, MAX_TOTAL_BYTES - prevSizeBytes);
  const isOverLimit = totalBytes > MAX_TOTAL_BYTES;

  // Handle file(s) input change (accept multiple)
  const handleFileChange = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    // Convert FileList to Array
    const incoming = Array.from(fileList);

    // Validate types and size individually before adding
    for (const f of incoming) {
      if (f.type !== "application/pdf") {
        toast.error(`"${f.name}" is not a PDF. Only PDF files are allowed.`);
        return;
      }
    }

    // Compute prospective new total
    const incomingBytes = getSelectedBytes(incoming);
    const prospectiveSelected = [...selectedFiles, ...incoming];
    const prospectiveSelectedBytes = getSelectedBytes(prospectiveSelected);
    const prospectiveTotal = prevSizeBytes + prospectiveSelectedBytes;

    if (prospectiveTotal > MAX_TOTAL_BYTES) {
      const allowedBytes = Math.max(
        0,
        MAX_TOTAL_BYTES - prevSizeBytes - getSelectedBytes(selectedFiles)
      );
      toast.error(
        `Cannot add files — total would exceed 5 MB. You can add up to ${formatBytes(
          allowedBytes
        )} more.`
      );
      return;
    }

    // Append new files
    setSelectedFiles(prospectiveSelected);
    toast.success(`Added ${incoming.length} file(s)`);
  };

  // Remove single file by index
  const handleRemoveFile = (index) => {
    const fileName = selectedFiles[index].name;
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    toast.success(`Removed "${fileName}"`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one PDF to upload.");
      return;
    }

    // Final size check (server-side safety)
    const finalTotal = prevSizeBytes + getSelectedBytes(selectedFiles);
    if (finalTotal > MAX_TOTAL_BYTES) {
      toast.error(
        "Total files exceed the 5 MB limit. Remove some files and try again."
      );
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("pdfFiles", file));

    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `/lesson/addMoreFiles/${lessonId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data?.message || "Files added successfully");
      setSelectedFiles([]);
      await fetchChapterDetail?.();
      await prevFiles();
      setOpen(false);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to upload files. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 focus:outline-none transition-colors"
          aria-label="Add more PDF files to this lesson"
          title="Add additional PDF files"
        >
          <Plus size={14} aria-hidden="true" />
          <span className="text-sm font-medium">Add</span>
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px] max-h-[80dvh] overflow-y-auto focus:ring-2 focus:ring-blue-500"
        role="dialog"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-description`}
      >
        <DialogHeader>
          <DialogTitle id={`${dialogId}-title`}>Add More PDF Files</DialogTitle>
          <DialogDescription
            id={`${dialogId}-description`}
            className="flex items-start gap-2 mt-2"
          >
            <Info
              className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              Upload additional PDF files to this lesson. The combined size of
              all files (existing + new) must not exceed 5 MB.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <label
              htmlFor={fileInputId}
              className="block text-sm font-medium text-gray-700"
            >
              Select PDF Files
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            </label>
            <div className="relative">
              <Input
                id={fileInputId}
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                disabled={loading || loadingPrevFiles}
                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                aria-describedby={selectedFilesId}
                aria-label="Choose PDF files to upload"
              />
              <span className="text-xs text-gray-600 mt-1 block">
                You can select multiple PDF files at once
              </span>
            </div>
          </div>

          {/* Selected Files List */}
          <div id={selectedFilesId} className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {selectedFiles.length === 0
                ? "No files selected"
                : `Selected: ${selectedFiles.length} file${
                    selectedFiles.length !== 1 ? "s" : ""
                  }`}
            </p>

            {selectedFiles.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 hover:border-gray-300 transition-colors focus-within:ring-2 focus-within:ring-blue-500"
                    role="group"
                    aria-label={`File ${index + 1}: ${file.name}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText
                        className="w-4 h-4 text-red-500 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatBytes(file.size)}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 hover:bg-red-100 text-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none ml-2"
                      onClick={() => handleRemoveFile(index)}
                      disabled={loading}
                      aria-label={`Remove file: ${file.name}`}
                      title="Remove this file from the selection"
                    >
                      <Trash className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 rounded-md">
                No files selected yet. Click above to add PDF files.
              </div>
            )}
          </div>

          {/* Size Summary */}
          <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Current files:</span>
                <span className="font-semibold text-gray-900">
                  {formatBytes(prevSizeBytes)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Selected files:</span>
                <span className="font-semibold text-gray-900">
                  {formatBytes(selectedBytes)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-gray-700 font-medium">
                  Total after upload:
                </span>
                <span
                  className={`font-bold ${
                    isOverLimit ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatBytes(totalBytes)} / 5 MB
                </span>
              </div>
            </div>

            {isOverLimit && (
              <div
                className="flex items-start gap-2 mt-2 pt-2 border-t border-blue-200"
                role="alert"
              >
                <AlertCircle
                  className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-xs text-red-600 font-medium">
                  Total exceeds 5 MB limit. Please remove some files.
                </p>
              </div>
            )}

            <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-blue-200">
              <span className="font-medium">Available to add:</span>
              <span className="ml-1">
                {formatBytes(
                  Math.max(0, MAX_TOTAL_BYTES - prevSizeBytes - selectedBytes)
                )}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loadingPrevFiles && (
            <div
              className="p-2 text-sm text-blue-600 bg-blue-50 rounded flex items-center gap-2"
              role="status"
              aria-live="polite"
            >
              <span className="animate-spin inline-block">⏳</span>
              Loading existing file information...
            </div>
          )}

          {/* Action Buttons */}
          <DialogFooter className="gap-2 flex flex-col sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedFiles([]);
                setOpen(false);
              }}
              disabled={loading}
              className="focus:ring-2 focus:ring-gray-500 focus:outline-none"
              aria-label="Cancel and close the add files dialog"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                selectedFiles.length === 0 ||
                isOverLimit ||
                loadingPrevFiles
              }
              className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-busy={loading}
              aria-label={
                loading
                  ? "Adding files..."
                  : selectedFiles.length === 0
                  ? "Select files to add"
                  : "Add selected files"
              }
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Adding...
                </>
              ) : (
                `Add ${
                  selectedFiles.length > 0 ? selectedFiles.length : ""
                } File${selectedFiles.length !== 1 ? "s" : ""}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoreFile;
