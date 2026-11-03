import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CourseContext } from "@/Context/CoursesProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import { Loader, Pen } from "lucide-react";

// Zod Schema with length limits
const chapterSchema = z.object({
  title: z
    .string()
    .min(5, "Chapter title is required and must be at least 5 characters")
    .max(100, "Chapter title cannot exceed 100 characters"),
  description: z
    .string()
    .min(5, "Chapter description is required and must be at least 5 characters")
    .max(500, "Chapter description cannot exceed 500 characters"),
});

export default function EditChapterDialog({
  fetchChapterDetail,
  chapterId,
  title,
  description,
  editChapterLoading,
  setEditChapterLoading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { course, setCourse } = useContext(CourseContext);
  const submitButtonRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: title,
      description: description,
    },
  });

  // Watching inputs for live character count
  const titleValue = watch("title", "");
  const descriptionValue = watch("description", "");

  const onSubmit = async (data) => {
    if (editChapterLoading) return;
    setEditChapterLoading(true);

    const formdata = new FormData();
    formdata.append("title", data.title);
    formdata.append("description", data.description);

    try {
      const res = await axiosInstance.put(
        `/chapter/edit/${chapterId}`,
        formdata
      );
      toast.success(res.data.message);
      fetchChapterDetail();
      setIsOpen(false);
      reset();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setEditChapterLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-200 hover:bg-green-300 cursor-pointer rounded-lg p-2"
          aria-label="Edit chapter"
          title="Edit chapter"
        >
          <Pen className="text-green-600" size={20} aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle id="edit-chapter-title">Edit Chapter</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 py-4"
          aria-labelledby="edit-chapter-title"
        >
          {/* Chapter Title */}
          <div>
            <Label
              htmlFor="chapter-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chapter Title <span aria-label="required">*</span>
            </Label>
            <Input
              id="chapter-title"
              placeholder="Enter chapter title (5-100 characters)"
              maxLength={100}
              aria-describedby="title-count title-error"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            <div
              className="flex justify-between text-sm mt-2"
              role="status"
              aria-live="polite"
            >
              <p
                id="title-count"
                className="text-gray-500"
                aria-label={`${titleValue.length} characters out of 100 entered`}
              >
                {titleValue.length}/100
              </p>
              {errors.title && (
                <p
                  id="title-error"
                  className="text-red-500 text-xs"
                  role="alert"
                >
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          {/* Chapter Description */}
          <div className="w-full">
            <Label
              htmlFor="chapter-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chapter Description <span aria-label="required">*</span>
            </Label>
            <Textarea
              id="chapter-description"
              placeholder="Enter chapter description (5-500 characters)"
              maxLength={500}
              className="w-full"
              aria-describedby="description-count description-error"
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            <div
              className="flex justify-between text-sm mt-2"
              role="status"
              aria-live="polite"
            >
              <p
                id="description-count"
                className="text-gray-500"
                aria-label={`${descriptionValue.length} characters out of 500 entered`}
              >
                {descriptionValue.length}/500
              </p>
              {errors.description && (
                <p
                  id="description-error"
                  className="text-red-500 text-xs"
                  role="alert"
                >
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
            <Button
              ref={submitButtonRef}
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={editChapterLoading}
              aria-busy={editChapterLoading}
              aria-label={
                editChapterLoading
                  ? "Saving chapter, please wait"
                  : "Save chapter changes"
              }
            >
              {editChapterLoading ? (
                <>
                  <Loader
                    className="animate-spin mr-2"
                    aria-hidden="true"
                    size={16}
                  />
                  <span>Saving...</span>
                </>
              ) : (
                "Edit Chapter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}