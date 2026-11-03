/**
 *  ADA / WCAG 2.1 AA Compliant Version
 */
import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Loader, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { CourseContext } from "@/Context/CoursesProvider";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import TeachingPointInput from "@/CustomComponent/CreateCourse/TeachingPoints";
import RequirementInput from "@/CustomComponent/CreateCourse/Requirment";
import SelectSemester from "@/CustomComponent/CreateCourse/SelectSemester";
import SelectQuarter from "@/CustomComponent/CreateCourse/SelectQuarter";
import SubCategorySelect_createCourse from "@/CustomComponent/CreateCourse/SelectSubcategory-createCourse";
import SelectCategory_createCourse from "@/CustomComponent/CreateCourse/SelectCategory-createCourse";
import AiModal from "@/CustomComponent/Aichatbot/teacher/aimodal";

// Zod Schema
const courseFormSchema = z.object({
  thumbnail: z.any().refine((file) => file instanceof File, {
    message: "Thumbnail is required.",
  }),

  courseTitle: z
    .string()
    .min(1, { message: "Course title is required." })
    .max(100, { message: "Max 100 characters allowed." }),

  category: z.string().min(1, { message: "Category is required." }),

  subcategory: z.string().min(1, { message: "Subcategory is required." }),

  semester: z
    .array(z.string())
    .min(1, { message: "At least one semester must be selected." }),

  quarter: z
    .array(z.string())
    .min(1, { message: "At least one quarter must be selected." }),

  language: z.string().min(1, { message: "Language is required." }),

  courseDescription: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(4000, { message: "Max 4000 characters allowed." }),

  teachingPoints: z
    .array(
      z.object({
        value: z
          .string()
          .min(5, "Min 5 characters.")
          .max(200, "Max 200 characters."),
      })
    )
    .min(1, { message: "Add at least one teaching point." }),

  requirements: z
    .array(
      z.object({
        value: z
          .string()
          .min(5, "Min 5 characters.")
          .max(200, "Max 200 characters."),
      })
    )
    .min(1, { message: "Add at least one requirement." }),

  syllabus: z
    .any()
    .refine((file) => file instanceof File && file.type === "application/pdf", {
      message: "Only PDF files are allowed.",
    })
    .refine((file) => file instanceof File && file.size <= 5 * 1024 * 1024, {
      message: "File must be less than 5MB.",
    }),
});

export default function CoursesBasis() {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState({
    content: "",
    usedfor: "",
  });
  const navigate = useNavigate();

  const { user } = useContext(GlobalContext);
  const { course } = useContext(CourseContext);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseTitle: "",
      category: "",
      subcategory: "",
      language: "english",
      courseDescription: "",
      teachingPoints: [{ value: "" }],
      requirements: [{ value: "" }],
      syllabus: null,
    },
  });

  const watchedLanguage = watch("language");
  const watchedDescription = watch("courseDescription");
  const watchedTitle= watch("courseTitle");
  const watchRequirement = watch("requirements");
  const watchteacherpoints = watch("teachingPoints");

  // Field Arrays
  const {
    fields: teachingPointsFields,
    append: appendTeachingPoint,
    remove: removeTeachingPoint,
  } = useFieldArray({
    control,
    name: "teachingPoints",
  });

  const {
    fields: requirementsFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  /**
   * Handle Thumbnail
   */
  const handleThumbnailChange = (e) => {
    console.log(e, "e");
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/PNG images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be less than 5MB.");
      return;
    }

    setValue("thumbnail", file, { shouldValidate: true });

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Form Submit
   */
  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("thumbnail", data.thumbnail);
    formData.append("courseTitle", data.courseTitle);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("language", data.language);
    formData.append("courseDescription", data.courseDescription);
    formData.append("semester", JSON.stringify(data.semester));
    formData.append("quarter", JSON.stringify(data.quarter));
    formData.append(
      "teachingPoints",
      JSON.stringify(data.teachingPoints.map((tp) => tp.value))
    );
    formData.append(
      "requirements",
      JSON.stringify(data.requirements.map((r) => r.value))
    );
    formData.append("syllabus", data.syllabus);

    try {
      const res = await axiosInstance.post("/course/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "Course created!");
      reset();
      navigate("/teacher/courses");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating course.");
    } finally {
      setLoading(false);
    }
  };

  const onError = () => {
    toast.error("Please fix the highlighted errors.");
  };

  return (
    <div className="mb-20">
      <h1 className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
        Create Course
      </h1>

      <FormProvider
        {...{ register, handleSubmit, control, setValue, reset, watch }}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          aria-label="Create new course form"
        >
          {/* Thumbnail */}
          <section className="space-y-6 border-b pb-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="thumbnail" className="font-medium">
                Thumbnail *
              </Label>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-md p-2 max-w-md">
              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Uploaded course thumbnail preview"
                    className="w-full h-[300px] object-cover rounded"
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    aria-label="Remove uploaded thumbnail"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setThumbnailPreview(null);
                      setValue("thumbnail", null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px]">
                  <input
                    type="file"
                    id="thumbnailInput"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    aria-describedby="thumbnailHelp"
                  />

                  <label
                    htmlFor="thumbnailInput"
                    role="button"
                    tabIndex={0}
                    aria-label="Upload course thumbnail"
                    className="flex items-center gap-2 px-4 py-1 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Upload
                      size={"18"}
                      className="text-xs text-gray-600"
                      aria-hidden="true"
                    />
                    Upload Thumbnail
                  </label>
                  <div className="ml-4 border-l pl-4 text-xs text-gray-500 flex items-center gap-2">
                    <AiModal
                      aiResponse={aiResponse}
                      setAiResponse={setAiResponse}
                      usedfor="thumbnail"
                      handleThumbnailChange={handleThumbnailChange}
                    />
                    generate with AI
                  </div>
                </div>
              )}
            </div>

            {errors.thumbnail && (
              <p
                className="text-xs text-red-600"
                role="alert"
                aria-live="polite"
              >
                {errors.thumbnail.message}
              </p>
            )}
          </section>

          {/* Title + Category */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Course Title */}
            <div>
              <div className="flex justify-between">
                <Label htmlFor="courseTitle">Course Title *</Label>
                <AiModal
                  command={watchedTitle}
                  aiResponse={aiResponse}
                  setAiResponse={setAiResponse}
                  usedfor="courseTitle"
                  setValue={setValue}
                />
              </div>

              <Input
                id="courseTitle"
                aria-required="true"
                maxLength={100}
                className={`bg-gray-50 ${
                  errors.courseTitle ? "border-red-500" : ""
                }`}
                {...register("courseTitle")}
              />

              {errors.courseTitle && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.courseTitle.message}
                </p>
              )}
            </div>

            {/* Category Select */}
            <SelectCategory_createCourse
              register={register}
              errors={errors}
              onCategoryChange={setSelectedCategory}
            />

            {/* Subcategory */}
            <SubCategorySelect_createCourse
              register={register}
              errors={errors}
              selectedCategory={selectedCategory}
            />
          </section>

          {/* Semester + Quarter */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <SelectSemester
              register={register}
              errors={errors}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
            />

            <SelectQuarter
              register={register}
              errors={errors}
              selectedSemester={selectedSemester}
            />
          </section>

          {/* Language */}
          <div className="mt-6">
            <Label htmlFor="language">Language *</Label>

            <Select
              onValueChange={(value) => setValue("language", value)}
              value={watchedLanguage}
            >
              <SelectTrigger
                className="bg-gray-50"
                aria-label="Select language"
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
              </SelectContent>
            </Select>

            {errors.language && (
              <p className="text-xs text-red-600" role="alert">
                {errors.language.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <Label htmlFor="courseDescription">Course Description *</Label>
              <AiModal
                command={watchedDescription}
                aiResponse={aiResponse}
                setAiResponse={setAiResponse}
                usedfor="courseDescription"
                setValue={setValue}
              />
            </div>
            <Textarea
              id="courseDescription"
              aria-required="true"
              className={`bg-gray-50 min-h-[100px] ${
                errors.courseDescription ? "border-red-500" : ""
              }`}
              maxLength={4000}
              {...register("courseDescription")}
            />
            <div className="m-3"></div>

            {errors.courseDescription && (
              <p className="text-xs text-red-600" role="alert">
                {errors.courseDescription.message}
              </p>
            )}
          </div>

          {/* Teaching Points */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium mb-3">
                What you will teach *
              </h2>
              <div className="m-3">
                <AiModal
                  aiResponse={aiResponse}
                  setAiResponse={setAiResponse}
                  usedfor="teachingPoints"
                  appendTeachingPoint={appendTeachingPoint}
                  removeTeachingPoint={removeTeachingPoint}
                  prevPoints={watchteacherpoints}
                />
              </div>
            </div>

            {teachingPointsFields.map((field, index) => (
              <TeachingPointInput
                key={field.id}
                field={field}
                index={index}
                teachingPointsFields={teachingPointsFields}
                remove={removeTeachingPoint}
                error={errors.teachingPoints?.[index]?.value}
                control={control}
                register={register}
              />
            ))}
            {errors.teachingPoints?.message && typeof errors.teachingPoints.message === "string" && (
              <p className="text-xs text-red-500 mt-2">{errors.teachingPoints.message}</p>
            )}

            <Button
              type="button"
              className="mt-3"
              disabled={teachingPointsFields.length >= 10}
              onClick={() => appendTeachingPoint({ value: "" })}
            >
              + Add Teaching Point
            </Button>
          </section>

          {/* Requirements */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium mb-3">
                Course Requirements *
              </h2>
              <div className="">
                <AiModal
                  aiResponse={aiResponse}
                  setAiResponse={setAiResponse}
                  usedfor="requirements"
                  appendRequirement={appendRequirement}
                  removeRequirement={removeRequirement}
                  prevPoints={watchRequirement}
                />
              </div>
            </div>

            {requirementsFields.map((field, index) => (
              <RequirementInput
                key={field.id}
                field={field}
                index={index}
                requirementsFields={requirementsFields}
                remove={removeRequirement}
                error={errors.requirements?.[index]?.value}
                register={register}
              />
            ))}
            {errors.requirements?.message && typeof errors.requirements.message === "string" && (
              <p className="text-xs text-red-500 mt-2">{errors.requirements.message}</p>
            )}

            <Button
              type="button"
              className="mt-3"
              disabled={requirementsFields.length >= 10}
              onClick={() => appendRequirement({ value: "" })}
            >
              + Add Requirement
            </Button>
          </section>

          {/* Syllabus Upload */}
          <div className="mt-10">
            <Label htmlFor="syllabus">Upload Syllabus (PDF) *</Label>

            <input
              type="file"
              id="syllabus"
              accept="application/pdf"
              aria-required="true"
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) {
                  clearErrors("syllabus");
                  return;
                }

                if (file.type !== "application/pdf") {
                  toast.error("Only PDF files allowed.");
                  setError("syllabus", { type: "manual", message: "Only PDF files allowed." });
                  return;
                }

                if (file.size > 5 * 1024 * 1024) {
                  toast.error("File must be less than 5MB.");
                  setError("syllabus", { type: "manual", message: "File must be less than 5MB." });
                  return;
                }

                clearErrors("syllabus");
                setValue("syllabus", file, { shouldValidate: true });
              }}
            />

            {errors.syllabus && (
              <p className="text-xs text-red-600" role="alert">
                {errors.syllabus.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-10">
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Course"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
