import React, { useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

const DeleteCourseModal = ({
  confirmOpen,
  setConfirmOpen,
  id,
  setSuccessOpen,
  fetchCourseDetail,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCourse = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/course/delete/${id}`);

      setConfirmOpen(false);
      setSuccessOpen(true);

      // Optional: fetch updated course detail before redirect
      if (fetchCourseDetail) await fetchCourseDetail();

      setTimeout(() => {
        setSuccessOpen(false);
        window.location.href = "/teacher/courses";
      }, 2000);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error?.response?.data?.message || "Failed to delete course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-150"
          aria-label="Delete Course"
        >
          Delete Course
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the course and all related data. Are
            you sure?
          </p>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-col-reverse justify-end gap-2">
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDeleteCourse}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseModal;
