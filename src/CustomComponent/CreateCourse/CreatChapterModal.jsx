import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState } from "react";
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
import { toast } from "sonner";
import { CourseContext } from "@/Context/CoursesProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import AiContentModal from "../Aichatbot/teacher/aimodal";

// Zod Schema with limits
const chapterSchema = z.object({
  chapterTitle: z
    .string()
    .min(5, "Chapter title is required")
    .max(100, "Chapter title cannot exceed 100 characters"),
  chapterDescription: z
    .string()
    .min(5, "Chapter description is required")
    .max(500, "Chapter description cannot exceed 500 characters"),
});

export default function ChapterCreationModal({
  courseId,
  quarterId,
  fetchQuarterDetail,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      chapterTitle: "",
      chapterDescription: "",
    },
  });

  const titleValue = watch("chapterTitle", "");
  const descriptionValue = watch("chapterDescription", "");

  const onSubmit = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.chapterTitle);
      formData.append("description", data.chapterDescription);

      const res = await axiosInstance.post(
        `/chapter/create/${courseId}/${quarterId}`,
        formData
      );

      toast.success(res.data.message);
      fetchQuarterDetail();
      reset();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 text-white hover:bg-green-600">
          Create New Chapter
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Chapter Title */}
          <div>
            <Input
              placeholder="Chapter Title"
              {...register("chapterTitle")}
              aria-invalid={!!errors.chapterTitle}
              aria-describedby="title-error"
            />
            <div className="text-sm mt-1">
              {errors.chapterTitle && (
                <p id="title-error" className="text-red-500 text-xs">
                  {errors.chapterTitle.message}
                </p>
              )}
              <div className="flex justify-between items-center w-full">
                <p className="text-gray-500">{titleValue.length}/100</p>
                <AiContentModal
                  aiResponse={aiResponse}
                  setAiResponse={setAiResponse}
                  usedfor="chapterTitle"
                  setValue={setValue}
                />
              </div>
              
            </div>
          </div>

          {/* Chapter Description */}
          <div>
            <Textarea
              placeholder="Chapter Description"
              {...register("chapterDescription")}
              className="w-full"
              aria-invalid={!!errors.chapterDescription}
              aria-describedby="description-error"
            />
            <div className="text-sm mt-1">
              {errors.chapterDescription && (
                <p id="description-error" className="text-red-500 text-xs">
                  {errors.chapterDescription.message}
                </p>
              )}
              <div className="flex justify-between items-center w-full">
                <p className="text-gray-500">{descriptionValue.length}/500</p>

                <AiContentModal
                  aiResponse={aiResponse}
                  setAiResponse={setAiResponse}
                  usedfor="chapterDescription"
                  setValue={setValue}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
