import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";

export function DiscussionGradeModel({
  studentName,
  discussionMarks,
  discussionId,
  commentId,
  fetchComments,
  checkIsCommented,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      marks: "",
    },
  });

  const handleSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    const marks = Number(data.marks);

    if (marks > discussionMarks) {
      toast.error(`Marks cannot exceed total: ${discussionMarks}`);
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.put(
        `discussionComment/gradeDiscussionofStd/${discussionId}/${commentId}`,
        { obtainedMarks: marks }
      );
      toast.success(res.data.message);
      fetchComments();
      checkIsCommented();
      setOpen(false);
    } catch (err) {
      console.error(err, "Error in giving marks");
      toast.error(err.response?.data?.message || "Error giving marks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-xs flex gap-6 text-blue-600 font-medium underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          aria-label={`Give marks to ${studentName}`}
        >
          Give Marks
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`grade-dialog-title-${discussionId}-${commentId}`}
      >
        <DialogHeader>
          <DialogTitle id={`grade-dialog-title-${discussionId}-${commentId}`}>
            Give Marks to {studentName}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
          aria-describedby={`marks-instructions-${discussionId}-${commentId}`}
        >
          <div>
            <label
              htmlFor={`marks-input-${discussionId}-${commentId}`}
              className="block text-sm font-medium mb-1"
            >
              Marks (total: {discussionMarks})
            </label>
            <Input
              id={`marks-input-${discussionId}-${commentId}`}
              type="number"
              placeholder="Enter marks"
              aria-required="true"
              max={discussionMarks || 0}
              min={0}
              {...form.register("marks", {
                required: "Marks are required",
                min: { value: 0, message: "Marks cannot be negative" },
              })}
            />
            {form.formState.errors.marks && (
              <p
                id={`marks-error-${discussionId}-${commentId}`}
                className="text-xs text-red-500 mt-1"
                role="alert"
              >
                {form.formState.errors.marks.message}
              </p>
            )}
            <p
              id={`marks-instructions-${discussionId}-${commentId}`}
              className="text-xs text-gray-500 mt-1"
            >
              Enter a number between 0 and {discussionMarks}.
            </p>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
