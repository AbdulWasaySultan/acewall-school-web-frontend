import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectSemester from "./SelectSemester";
import SelectQuarter from "./SelectQuarter";
import axios from "axios";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

const Schema = z.object({
  semester: z
    .array(z.string().nonempty({ message: "Please select a semester" }))
    .min(1, { message: "Please select a semester" }),
  quarter: z
    .array(z.string().nonempty({ message: "Please select a quarter" }))
    .min(1, { message: "Please select a quarter" }),
});

export function SelectSemAndQuarDialog({
  prevSelectedSemesters,
  prevSelectedQuarters,
  courseId,
  fetchCourseDetail,
}) {
  const [selectedSemester, setSelectedSemester] = useState({});
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      semester: prevSelectedSemesters ? [...prevSelectedSemesters] : [],
      quarter: prevSelectedQuarters ? [...prevSelectedQuarters] : [],
    },
  });

  const onSubmit = async (data) => {
    await axiosInstance
      .post(`semester/selectingNewSemesterwithQuarter/${courseId}`, data)
      .then((res) => {
        setOpen(false);
        toast.success(res.data.message);
        fetchCourseDetail();
        reset();
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error selecting semester and quarter"
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-green-500 hover:bg-green-600"
          aria-label="Add a new semester to this course"
        >
          Add new semester
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle id="dialog-title">Edit semester & quarter</DialogTitle>

            <DialogDescription id="dialog-description">
              Select semesters and quarters for this course. When finished,
              click “Save changes”.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Semester Selection */}
            <div className="grid gap-3">
              <Label htmlFor="semester">Select Semester</Label>
              <SelectSemester
                register={register}
                errors={errors}
                selectedSemester={selectedSemester}
                setSelectedSemester={setSelectedSemester}
                prevSelectedSemesters={prevSelectedSemesters}
                aria-describedby={
                  errors.semester ? "semester-error" : undefined
                }
              />

              {errors.semester && (
                <p
                  id="semester-error"
                  role="alert"
                  className="text-red-600 text-sm"
                >
                  {errors.semester.message}
                </p>
              )}
            </div>

            {/* Quarter Selection */}
            <div className="grid gap-3">
              <Label htmlFor="quarter">Select Quarter</Label>
              <SelectQuarter
                register={register}
                errors={errors}
                selectedSemester={selectedSemester}
                prevSelectedQuarters={prevSelectedQuarters}
                aria-describedby={errors.quarter ? "quarter-error" : undefined}
              />

              {errors.quarter && (
                <p
                  id="quarter-error"
                  role="alert"
                  className="text-red-600 text-sm"
                >
                  {errors.quarter.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                aria-label="Cancel and close dialog"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
