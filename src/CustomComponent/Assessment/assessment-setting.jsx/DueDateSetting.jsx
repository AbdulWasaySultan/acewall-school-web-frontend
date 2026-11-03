import { Label } from "@/components/ui/label";
import StrictDatePicker from "@/CustomComponent/Assessment/DueDatePicker";
import { axiosInstance } from "@/lib/AxiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, User, Loader2, Trash } from "lucide-react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import toast from "react-hot-toast";
import { z } from "zod";
import EditDueDateForStudent from "./EditDueDateForStudent";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  tempOverrideDate: z
    .object({
      dateTime: z
        .preprocess(
          (val) =>
            typeof val === "string" || val instanceof Date
              ? new Date(val)
              : val,
          z.date(),
        )
        .optional(),
    })
    .optional(),
  studentDueDateOverrides: z
    .array(
      z.object({
        studentId: z.string().optional(),
        newDueDate: z.object({
          date: z.string(),
          time: z.string(),
        }),
      }),
    )
    .optional(),
});

const DueDateSetting = ({ assessment, editfor, fetchAssessment }) => {
  const [students, setStudents] = React.useState([]);
  const [selectedStudents, setSelectedStudents] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);

  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    if (timeStr) {
      const datePart = new Date(dateStr).toISOString().split("T")[0];
      const combinedStr = `${datePart}T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`;
      const dateTime = new Date(combinedStr);
      return isNaN(dateTime.getTime()) ? null : dateTime;
    } else {
      const dateTime = new Date(dateStr);
      return isNaN(dateTime.getTime()) ? null : dateTime;
    }
  };

  const formatOverrideTime = (timeStr, dateStr) => {
    try {
      if (!timeStr) return "";
      const datePart = new Date(dateStr).toISOString().split("T")[0];
      const dateObj = new Date(`${datePart}T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`);
      if (isNaN(dateObj.getTime())) return timeStr;
      return dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeStr;
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tempOverrideDate: {
        dateTime: null,
      },
      studentDueDateOverrides:
        assessment?.studentDueDateOverrides?.map((override) => {
          return {
            studentId: override.studentId || override.student?._id || "",
            newDueDate: {
              date: override.newDueDate?.date || "",
              time: override.newDueDate?.time || "",
            },
          };
        }) || [],
    },
  });

  console.log("formErrors:", form.formState.errors);
  const handleSubmit = async (data) => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setIsSubmitting(true);

    try {
      const dt = new Date(data.tempOverrideDate.dateTime);

      if (isNaN(dt.getTime())) {
        toast.error("Please select a valid date and time");
        setIsSubmitting(false);
        return;
      }

      const datePart =
        dt.getFullYear() +
        "-" +
        String(dt.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dt.getDate()).padStart(2, "0");
      const timePart =
        String(dt.getHours()).padStart(2, "0") +
        ":" +
        String(dt.getMinutes()).padStart(2, "0");

      const payload = {
        studentIds: selectedStudents.map((s) => s._id),
        newDueDate: {
          date: datePart,
          time: timePart,
        },
      };

      const url = `${editfor}/setDueDateForStudent/${assessment._id}`;

      console.log(url, "url");

      const res = await axiosInstance.put(url, payload);

      toast.success(res.data.message || "Due date updated successfully");
      fetchAssessment();
      form.reset()
      setSelectedStudents([])
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update due dates";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeDueDateOverride = async (overrideId, editfor, fetchAssessment, assessmentId) => {
    setIsRemoving(true);
    try {
      const res = await axiosInstance.delete(`${editfor}/removeDueDateOverride/${overrideId}/${assessmentId}`);
      toast.success(res.data.message || "Due date removed successfully");
      fetchAssessment();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove due date";
      toast.error(errorMessage);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden mt-4">
            <div className="flex flex-col space-y-1.5 p-6 border-b bg-muted/20">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                <Label
                  id="override-date-label"
                  className="font-semibold text-lg leading-none tracking-tight m-0"
                >
                  Extend Due Date for Specific Students
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Select one or more students and choose a new due date to grant them an extension.
              </p>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <EditDueDateForStudent
                    assessment={assessment}
                    students={students}
                    setStudents={setStudents}
                    selectedStudents={selectedStudents}
                    setSelectedStudents={setSelectedStudents}
                    editfor={editfor}
                  />
                </div>

                <div className="space-y-3 p-5 rounded-lg border bg-muted/10">
                  <Label className="text-sm font-semibold">
                    New Override Date & Time
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    This deadline will override the default assessment due date for the selected students.
                  </p>
                  <StrictDatePicker
                    name="tempOverrideDate"
                    aria-labelledby="override-date-label"
                    label=""
                  />
                  {form.formState.errors?.tempOverrideDate?.dateTime && (
                    <p className="text-sm font-medium text-destructive mt-1">
                      {form.formState.errors.tempOverrideDate.dateTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 pt-0">
              <Button
                type="submit"
                disabled={isSubmitting || selectedStudents.length === 0}
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Extension"
                )}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Existing Student Due Date Overrides Section */}
      {assessment?.studentDueDateOverrides &&
        assessment?.studentDueDateOverrides?.length > 0 && (
          <div className="space-y-4 rounded-xl border border-border bg-muted/40 p-5 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <Label className="font-semibold text-base m-0">
                Existing Student Due Date Overrides
              </Label>
            </div>

            <div className="space-y-3">
              {assessment?.studentDueDateOverrides?.map((override) => (
                <div
                  key={override._id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {override.student?.firstName}{" "}
                        {override.student?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {override.student?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">

                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(override.newDueDate.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatOverrideTime(override.newDueDate.time, override.newDueDate.date)}
                      </p>
                    </div>

                    <Button disabled={isRemoving} className="rounded-full hover:bg-red-500 hover:text-white hover:font-bold transition" variant="outline" size="icon"
                      onClick={() => removeDueDateOverride(override._id, editfor, fetchAssessment, assessment._id)}>
                      {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
    </>
  );
};

export default DueDateSetting;
