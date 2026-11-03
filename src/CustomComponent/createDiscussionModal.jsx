import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/AxiosInstance";
import { File, Image, Loader } from "lucide-react";
import { toast } from "sonner";
import StrictDatePicker from "./Assessment/DueDatePicker";
import { useSearchParams } from "react-router-dom";
import CategoryDropdown from "./Assessment/Assessment-category-dropdown";

export function CreateDiscussionDialog({ refresh, setRefresh, semester, quarter }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const typeId = searchParams.get("typeId");
  const courseId = searchParams.get("course");

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  const minDate = parsedStartDate < parsedEndDate ? parsedStartDate : parsedEndDate;
  const maxDate = parsedEndDate > parsedStartDate ? parsedEndDate : parsedStartDate;

  const form = useForm({
    defaultValues: {
      topic: "",
      description: "",
      totalPoints: "",
      category: "",
      dueDate: null,
    },
  });

  // File validations
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPEG, JPG, and PDF files are allowed.");
      return;
    }
    if (file.size > maxSize) {
      toast.error("File size must not exceed 2MB.");
      return;
    }
    if (files.length >= 5) {
      toast.error("You can only upload a maximum of 5 files.");
      return;
    }
    setFiles((prev) => [...prev, file]);
  };

  const removeFile = (fileToRemove) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  // Fetch quarter dates
  useEffect(() => {
    axiosInstance
      .get(`quarter/getDatesofQuarter/${quarter}`)
      .then((res) => {
        setStartDate(res.data.startDate);
        setEndDate(res.data.endDate);
      })
      .catch(console.error);
  }, [quarter]);

  // Register category for validation
  useEffect(() => {
    form.register("category", { required: "Category is required" });
  }, [form]);

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("topic", data.topic);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("type", type);
    formData.append("dueDate", JSON.stringify(data.dueDate));
    formData.append("totalMarks", data.totalPoints);
    if (semester && quarter) {
      formData.append("semester", semester);
      formData.append("quarter", quarter);
    }
    if (type === "chapter") formData.append("chapter", typeId);
    if (type === "lesson") formData.append("lesson", typeId);
    files.forEach((file) => formData.append("files", file));

    setRefresh(true);
    axiosInstance
      .post("/discussion/create", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => {
        form.reset();
        setFiles([]);
        setOpen(false);
        setRefresh(false);
      })
      .catch((err) => {
        console.error(err);
        setRefresh(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">Create Discussion</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Topic */}
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                {...form.register("topic", { required: "Topic is required" })}
                className="w-full"
              />
              {form.formState.errors.topic && (
                <p className="text-xs text-red-500" role="alert">
                  {form.formState.errors.topic.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                maxLength={2000}
                {...form.register("description", { required: "Description is required" })}
                className="w-full"
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500" role="alert">
                  {form.formState.errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {`Characters left: ${2000 - (form.watch("description")?.length || 0)}`}
              </p>
            </div>

            {/* Points, Category, Due Date */}
            <section className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="totalPoints">Total Points</Label>
                <Input
                  type="number"
                  id="totalPoints"
                  {...form.register("totalPoints", {
                    required: "Total Points is required",
                    min: { value: 0, message: "Total Points must be >= 0" },
                  })}
                  className="w-full"
                />
                {form.formState.errors.totalPoints && (
                  <p className="text-xs text-red-500" role="alert">
                    {form.formState.errors.totalPoints.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Label htmlFor="category">Category</Label>
                <CategoryDropdown
                  courseId={courseId}
                  value={form.watch("category")}
                  onValueChange={(val) => form.setValue("category", val, { shouldValidate: true })}
                  error={form.formState.errors.category}
                  className="w-full"
                />
                {form.formState.errors.category && (
                  <p className="text-xs text-red-500" role="alert">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Label className="font-semibold mb-2">Due Date</Label>
                {quarter ? (
                  <StrictDatePicker name="dueDate" minDate={minDate} maxDate={maxDate} />
                ) : (
                  <StrictDatePicker name="dueDate" />
                )}
              </div>
            </section>

            {/* File Upload */}
            <div>
              <Label htmlFor="file">
                Attach File (PNG, JPEG, JPG, PDF; max 2MB; max 5 files)
              </Label>
              <Input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="w-full"
                aria-describedby="file-instructions"
              />
              <div id="file-instructions" className="text-xs text-gray-500">
                Selected files will be uploaded along with discussion.
              </div>
              <div className="flex flex-col gap-2 mt-3">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="border p-3 rounded-lg border-gray-300 flex items-center gap-2"
                  >
                    {file.type === "application/pdf" ? <File /> : <Image />}
                    <p className="text-sm">{file.name}</p>
                    <Button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button type="submit" disabled={refresh} className="w-full bg-green-500 hover:bg-green-600">
                {refresh ? <Loader className="animate-spin" /> : "Create Discussion"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
