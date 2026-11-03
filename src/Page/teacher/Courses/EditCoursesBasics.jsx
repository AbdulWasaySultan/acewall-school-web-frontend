import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Loader, Upload } from "lucide-react";
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
import { useNavigate, useParams } from "react-router-dom";
import { CourseContext } from "@/Context/CoursesProvider";
import CategorySelect from "@/CustomComponent/CreateCourse/CategorySelect";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import SubCategorySelect from "@/CustomComponent/CreateCourse/SubCategorySelect";
import TeachingPointInput from "@/CustomComponent/CreateCourse/TeachingPoints";
import RequirementInput from "@/CustomComponent/CreateCourse/Requirment";
import DateRangePicker from "@/CustomComponent/CreateCourse/DateRangePicker";
import SelectSemAndQuar from "@/CustomComponent/CreateCourse/SelectSemester";
import SelectSemester from "@/CustomComponent/CreateCourse/SelectSemester";
import SelectQuarter from "@/CustomComponent/CreateCourse/SelectQuarter";
import { set } from "lodash";
import ConfirmationModal from "@/CustomComponent/CreateCourse/ConfirmationModal";

const courseFormSchema = z.object({
  courseTitle: z
    .string()
    .min(5, { message: "Course title must be at least 5 characters" })
    .max(100, { message: "Course title must be less than 100 characters" }),
  category: z
    .string({
      required_error: "Please select a category",
    })
    .refine((val) => val !== "", { message: "Please select a category" }),
  subcategory: z
    .string({
      message: "Please select a subcategory",
    })
    .refine((val) => val !== "", { message: "Please select a subcategory" }),
  language: z
    .string()
    .nonempty({ message: "Please select a language" })
    .refine((val) => val !== "", { message: "Please select a language" }),
  courseDescription: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(4000, { message: "Description must be less than 500 characters" }),
  teachingPoints: z
    .array(
      z.object({
        value: z
          .string()
          .min(5, { message: "Teaching point must be at least 5 characters" })
          .max(200, {
            message: "Teaching point must be less than 200 characters",
          }),
      })
    )
    .min(1, { message: "Add at least one teaching point" }),
  requirements: z
    .array(
      z.object({
        value: z
          .string()
          .min(5, { message: "Requirement must be at least 5 characters" })
          .max(200, {
            message: "Requirement must be less than 200 characters",
          }),
      })
    )
    .min(1, { message: "Add at least one requirement" }),
});

export default function EditCourse() {
  const [course, setCourse] = useState();
  const [thumbnailPreview, setThumbnailPreview] = useState(
    course?.thumbnail.url
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [prevCategory, setPrevCategory] = useState(null);
  const [prevSubCategory, setPrevSubCategory] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      thumbnail: "",
      courseTitle: "",
      category: "",
      subcategory: "",
      language: "",
      courseDescription: "",
      teachingPoints: [],
      requirements: [],
    },
  });
  const watchedLanguage = watch("language");
  const watchedCategory = watch("category");
  const watchedSubCategory = watch("subcategory");

  useEffect(() => {
    const fetchCourseBasics = async () => {
      try {
        const response = await axiosInstance.get(
          `course/getCourseBasics/${courseId}`
        );
        const courseData = response.data.course;

        setCourse(courseData);

        reset({
          thumbnail: courseData.thumbnail,
          courseTitle: courseData.courseTitle,
          category: courseData.category,
          subcategory: courseData.subcategory,
          language: courseData.language,
          courseDescription: courseData.courseDescription,
          teachingPoints:
            courseData.teachingPoints?.map((item) => ({ value: item })) || [],
          requirements:
            courseData.requirements?.map((item) => ({ value: item })) || [],
        });
        setPrevCategory(courseData.category);
        setPrevSubCategory(courseData.subcategory);
        setSelectedCategory(courseData.category);

        setThumbnailPreview(courseData.thumbnail?.url || null);
      } catch (error) {
        console.error("Failed to fetch course basics:", error);
      }
    };
    fetchCourseBasics();
  }, [reset, courseId]);

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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed.");
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setValue("thumbnail", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    console.log(data, "data");

    const formData = new FormData();
    setLoading(true);

    try {
      formData.append("courseTitle", data.courseTitle);
      formData.append("category", data.category);
      formData.append("subcategory", data.subcategory);
      formData.append("language", data.language);
      formData.append("courseDescription", data.courseDescription);
      formData.append(
        "teachingPoints",
        JSON.stringify(data.teachingPoints.map((tp) => tp.value))
      );
      formData.append(
        "requirements",
        JSON.stringify(data.requirements.map((req) => req.value))
      );

      const res = await axiosInstance.put(
        `course/editCourseBasics/${courseId}`,
        formData
      );

      toast.success(res.data.message || "Course updated successfully!");

      reset();
      navigate(`/teacher/courses/courseDetail/${courseId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    toast.error("Please fill out all required fields correctly.");
    console.log(errors);
  };

  return (
    <main aria-labelledby="page-title">
      <h1
        id="page-title"
        className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg"
      >
        Edit Course Info
      </h1>
      <FormProvider
        {...{
          register,
          handleSubmit,
          control,
          setValue,
          reset,
          formState: { errors, isSubmitting },
          watch,
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-8"
          aria-label="Edit course information"
          noValidate
        >
          <section aria-labelledby="basic-info-heading">
            <h2 id="basic-info-heading" className="sr-only">
              Basic Course Information
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="courseTitle" className="block mb-2">
                    Course Title <span aria-label="required">*</span>
                  </Label>
                  <Input
                    id="courseTitle"
                    maxLength={50}
                    className={`bg-gray-50 ${
                      errors.courseTitle ? "border-red-500" : ""
                    }`}
                    aria-required="true"
                    aria-invalid={errors.courseTitle ? "true" : "false"}
                    aria-describedby={
                      errors.courseTitle ? "courseTitle-error" : undefined
                    }
                    {...register("courseTitle")}
                  />
                  {errors.courseTitle && (
                    <p
                      id="courseTitle-error"
                      className="text-xs text-red-500 mt-1"
                      role="alert"
                    >
                      {errors.courseTitle.message}
                    </p>
                  )}
                </div>

                <CategorySelect
                  register={register}
                  errors={errors}
                  control={control}
                  setCategories={setCategories}
                  categories={categories}
                  prevCategory={prevCategory}
                  watchedCategory={watchedCategory}
                  onCategoryChange={(value) => setSelectedCategory(value)}
                />

                <SubCategorySelect
                  register={register}
                  errors={errors}
                  control={control}
                  setSubcategories={setSubcategories}
                  subcategories={subcategories}
                  prevSubCategory={prevSubCategory}
                  watchedSubCategory={watchedSubCategory}
                  selectedCategory={selectedCategory}
                />
              </div>

              <div>
                <Label htmlFor="language" className="block mb-2">
                  Language <span aria-label="required">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue("language", value, { shouldValidate: true });
                  }}
                  value={watchedLanguage}
                  className="max-w-xs"
                  aria-label="Select course language"
                  aria-required="true"
                  aria-invalid={errors.language ? "true" : "false"}
                  aria-describedby={
                    errors.language ? "language-error" : undefined
                  }
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue
                      placeholder="Select language"
                      defaultValues={"english"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p
                    id="language-error"
                    className="text-xs text-red-500 mt-1"
                    role="alert"
                  >
                    {errors.language.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="courseDescription" className="block mb-2">
                  Course Description <span aria-label="required">*</span>
                </Label>
                <Textarea
                  id="courseDescription"
                  className={`min-h-[100px] bg-gray-50 ${
                    errors.courseDescription ? "border-red-500" : ""
                  }`}
                  maxLength={4000}
                  aria-required="true"
                  aria-invalid={errors.courseDescription ? "true" : "false"}
                  aria-describedby={
                    errors.courseDescription
                      ? "courseDescription-error"
                      : "courseDescription-hint"
                  }
                  {...register("courseDescription")}
                />
                <p
                  id="courseDescription-hint"
                  className="text-xs text-gray-500 mt-1"
                >
                  Maximum 4000 characters
                </p>
                {errors.courseDescription && (
                  <p
                    id="courseDescription-error"
                    className="text-xs text-red-500 mt-1"
                    role="alert"
                  >
                    {errors.courseDescription.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="course-content-heading">
            <h2
              id="course-content-heading"
              className="text-xl font-semibold mb-6"
            >
              Make The Course
            </h2>

            <div aria-labelledby="teaching-points-heading" className="my-4">
              <h3
                id="teaching-points-heading"
                className="text-lg font-medium mb-4"
              >
                What you will teach in this course{" "}
                <span
                  className="text-gray-500 text-xs"
                  aria-label="maximum 6 teaching points"
                >
                  (max 6)
                </span>
              </h3>
              <div
                role="list"
                aria-label="Teaching points"
                aria-live="polite"
                aria-relevant="additions removals"
              >
                {teachingPointsFields.map((field, index) => (
                  <div key={field.id} role="listitem">
                    <TeachingPointInput
                      field={field}
                      index={index}
                      teachingPointsFields={teachingPointsFields}
                      remove={removeTeachingPoint}
                      error={errors.teachingPoints?.[index]?.value}
                      control={control}
                      register={register}
                    />
                  </div>
                ))}
              </div>
              {errors.teachingPoints?.message && typeof errors.teachingPoints.message === "string" && (
                <p className="text-xs text-red-500 mt-2" role="alert">{errors.teachingPoints.message}</p>
              )}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={teachingPointsFields.length >= 6}
                  onClick={() => appendTeachingPoint({ value: "" })}
                  className={`mt-2 text-blue-500 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-50 ${
                    teachingPointsFields.length >= 6
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Add teaching point"
                  aria-disabled={teachingPointsFields.length >= 6}
                >
                  + Add Teaching Point
                </Button>
              </div>
            </div>

            <div aria-labelledby="requirements-heading">
              <h3
                id="requirements-heading"
                className="text-lg font-medium mb-4"
              >
                Course Requirements{" "}
                <span
                  className="text-gray-500 text-xs"
                  aria-label="maximum 6 requirements"
                >
                  (max 6)
                </span>
              </h3>
              <div
                role="list"
                aria-label="Course requirements"
                aria-live="polite"
                aria-relevant="additions removals"
              >
                {requirementsFields.map((field, index) => (
                  <div key={field.id} role="listitem">
                    <RequirementInput
                      field={field}
                      index={index}
                      requirementsFields={requirementsFields}
                      remove={removeRequirement}
                      error={errors.requirements?.[index]?.value}
                      register={register}
                    />
                  </div>
                ))}
              </div>
              {errors.requirements?.message && typeof errors.requirements.message === "string" && (
                <p className="text-xs text-red-500 mt-2" role="alert">{errors.requirements.message}</p>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendRequirement({ value: "" })}
                  className={`mt-2 text-blue-500 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-50 ${
                    requirementsFields.length >= 6
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={requirementsFields.length >= 6}
                  aria-label="Add requirement"
                  aria-disabled={requirementsFields.length >= 6}
                >
                  + Add Requirement
                </Button>
              </div>
            </div>
          </section>

          <div className="flex justify-end mt-25">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
              disabled={loading}
              aria-label={
                loading
                  ? "Updating course, please wait"
                  : "Update course information"
              }
              aria-busy={loading}
            >
              {loading ? "Updating..." : "Update Course Info"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
