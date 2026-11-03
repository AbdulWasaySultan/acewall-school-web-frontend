import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/AxiosInstance";
import { ChevronDown, AlertCircle } from "lucide-react";

export const SelectSemester = ({
  register,
  errors,
  setSelectedSemester,
  prevSelectedSemesters,
}) => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [tempSelectedSemesters, setTempSelectedSemesters] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from prevSelectedSemesters
  useEffect(() => {
    if (prevSelectedSemesters?.length) {
      setSelectedSemesters(prevSelectedSemesters);
      setTempSelectedSemesters(prevSelectedSemesters);
      setSelectedSemester?.(prevSelectedSemesters);
    }
  }, [prevSelectedSemesters]);

  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/semester/get");
        setSemesters(res.data?.semesters || []);
      } catch (err) {
        console.error("Failed to fetch semesters:", err);
        setError("Failed to load semesters. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      setTempSelectedSemesters([...selectedSemesters]);
    } else {
      setTempSelectedSemesters([...selectedSemesters]);
    }
    setOpen(isOpen);
  };

  const toggleSemester = (id) => {
    setTempSelectedSemesters((prev) => {
      if (prev.includes(id)) {
        return prev.filter((semId) => semId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const confirmSelection = () => {
    setSelectedSemesters(tempSelectedSemesters);
    setSelectedSemester?.(tempSelectedSemesters);
    register("semester").onChange({
      target: { name: "semester", value: tempSelectedSemesters },
    });
    setOpen(false);
  };

  const cancelSelection = () => {
    setTempSelectedSemesters([...selectedSemesters]);
    setOpen(false);
  };

  const selectedTitles = semesters
    .filter((s) => selectedSemesters.includes(s._id))
    .map((s) => s.title)
    .join(", ");

  const hasChanges =
    tempSelectedSemesters.length !== selectedSemesters.length ||
    !tempSelectedSemesters.every((id) => selectedSemesters.includes(id));

  const errorId = errors?.semester ? "semester-error" : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor="semester" className="block font-medium">
        Semester{" "}
        <span className="text-red-500" aria-label="required">
          *
        </span>
      </Label>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="semester"
            variant="outline"
            className="w-full justify-between bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={errorId}
            aria-label={
              selectedSemesters.length > 0
                ? `Selected semesters: ${selectedTitles}`
                : "Select semester(s)"
            }
          >
            <span className="truncate">
              {loading
                ? "Loading semesters..."
                : selectedSemesters.length > 0
                ? selectedTitles
                : "Select semester(s)"}
            </span>
            <ChevronDown
              className="ml-2 h-4 w-4 opacity-50 flex-shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[500px] p-4 space-y-3"
          role="dialog"
          aria-label="Select semesters"
        >
          {error ? (
            <div
              className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          ) : (
            <>
              <fieldset>
                <legend className="text-sm font-medium mb-3 sr-only">
                  Select semesters
                </legend>
                <ScrollArea className="h-48 pr-4 w-full">
                  <div className="space-y-2">
                    {semesters.length > 0 ? (
                      semesters.map((semester) => (
                        <div
                          key={semester._id}
                          className="flex items-center space-x-2 pr-2"
                        >
                          <Checkbox
                            id={`semester-${semester._id}`}
                            checked={tempSelectedSemesters.includes(
                              semester._id
                            )}
                            onCheckedChange={() => toggleSemester(semester._id)}
                            aria-label={`Select ${semester.title}`}
                          />
                          <label
                            htmlFor={`semester-${semester._id}`}
                            className="text-sm cursor-pointer flex-1 py-1 select-none"
                          >
                            {semester.title}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No semesters available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </fieldset>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={cancelSelection}
                  aria-label="Cancel semester selection"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={confirmSelection}
                  disabled={!hasChanges && selectedSemesters.length > 0}
                  aria-label="Confirm semester selection"
                >
                  Select
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      <input
        type="hidden"
        {...register("semester")}
        value={JSON.stringify(selectedSemesters)}
      />

      {errors?.semester && (
        <p
          id="semester-error"
          className="text-xs text-red-500 mt-1 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          {errors.semester.message}
        </p>
      )}
    </div>
  );
};
export default SelectSemester;
