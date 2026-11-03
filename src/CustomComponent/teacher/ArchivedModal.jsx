import React, { useState } from "react";
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
import { AlertTriangle } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function ArchiveDialog({
  onConfirm,
  course,
  fetchCourseDetail,
}) {
  const [open, setOpen] = useState(false);

  const handleArchive = async () => {
    try {
      await axiosInstance.put(`course/archive/${course._id}`);
      fetchCourseDetail();
      setOpen(false);
      if (onConfirm) onConfirm(course._id, !course.published);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            course.published
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          aria-label={course.published ? "Archive Course" : "Unarchive Course"}
        >
          {course.published ? "Archive Course" : "Unarchive Course"}
        </Button>
      </DialogTrigger>

      <DialogContent className="focus:outline-none">
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 ${
              course.published ? "text-red-700" : "text-green-700"
            }`}
          >
            {course.published && (
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            )}
            Confirm {course.published ? "Archive" : "Unarchive"}
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300">
            Are you sure you want to{" "}
            {course.published ? "archive" : "unarchive"} this course? This
            action can be reversed later.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            aria-label="Cancel"
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleArchive}
            aria-label={
              course.published ? "Confirm Archive" : "Confirm Unarchive"
            }
            className={`${
              course.published
                ? "bg-red-700 hover:bg-red-800 text-white"
                : "bg-green-700 hover:bg-green-800 text-white"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            Yes, {course.published ? "Archive" : "Unarchive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
