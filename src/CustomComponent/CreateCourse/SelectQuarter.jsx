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

const SelectQuarter = ({
  register,
  errors,
  selectedSemester,
  prevSelectedQuarters,
}) => {
  const [semesterData, setSemesterData] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState([]);
  const [tempSelectedQuarters, setTempSelectedQuarters] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quarters based on selected semester
  useEffect(() => {
    if (!selectedSemester || selectedSemester.length === 0) {
      setSemesterData([]);
      setSelectedQuarters([]);
      setTempSelectedQuarters([]);
      setError(null);
      return;
    }

    const fetchQuarters = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.post(`/quarter/getquarters_updated`, {
          semesters: selectedSemester,
        });
        setSemesterData(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch quarters:", err);
        setError("Failed to load quarters. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuarters();
  }, [selectedSemester]);

  // Initialize from prevSelectedQuarters
  useEffect(() => {
    if (prevSelectedQuarters?.length) {
      setSelectedQuarters(prevSelectedQuarters);
      setTempSelectedQuarters(prevSelectedQuarters);
    }
  }, [prevSelectedQuarters]);

  // Handle popover open/close
  const handleOpenChange = (isOpen) => {
    if (isOpen) {
      setTempSelectedQuarters([...selectedQuarters]);
    } else {
      setTempSelectedQuarters([...selectedQuarters]);
    }
    setOpen(isOpen);
  };

  // Toggle quarter selection
  const toggleQuarter = (id) => {
    setTempSelectedQuarters((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Confirm selected quarters and update form state
  const confirmSelection = () => {
    setSelectedQuarters(tempSelectedQuarters);
    register("quarter").onChange({
      target: { name: "quarter", value: tempSelectedQuarters },
    });
    setOpen(false);
  };

  // Cancel selection
  const cancelSelection = () => {
    setTempSelectedQuarters([...selectedQuarters]);
    setOpen(false);
  };

  // Get selected quarter names for display
  const getSelectedTitles = () => {
    const titles = [];
    if (Array.isArray(semesterData)) {
      semesterData.forEach((sem) => {
        if (sem.quarters && Array.isArray(sem.quarters)) {
          sem.quarters.forEach((q) => {
            if (selectedQuarters.includes(q._id)) {
              titles.push(q.title);
            }
          });
        }
      });
    }
    return titles.join(", ");
  };

  const selectedTitles = getSelectedTitles();
  const hasChanges =
    tempSelectedQuarters.length !== selectedQuarters.length ||
    !tempSelectedQuarters.every((id) => selectedQuarters.includes(id));
  const isDisabled = !selectedSemester || selectedSemester.length === 0;
  const errorId = errors?.quarter ? "quarter-error" : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor="quarter" className="block font-medium">
        Quarter{" "}
        <span className="text-red-500" aria-label="required">
          *
        </span>
      </Label>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="quarter"
            variant="outline"
            className="w-full justify-between bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled || loading}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={errorId}
            aria-busy={loading}
            aria-label={
              selectedQuarters.length > 0
                ? `Selected quarters: ${selectedTitles}`
                : isDisabled
                ? "Select a semester first to enable quarters"
                : "Select quarter(s)"
            }
          >
            <span className="truncate">
              {loading
                ? "Loading quarters..."
                : isDisabled
                ? "Select Semester First"
                : selectedQuarters.length > 0
                ? selectedTitles
                : "Select Quarter(s)"}
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
          aria-label="Select quarters"
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
                  Select quarters for semesters
                </legend>
                <ScrollArea className="h-64 pr-4">
                  <div className="space-y-4">
                    {Array.isArray(semesterData) && semesterData.length > 0 ? (
                      semesterData.map((semData) => (
                        <div key={semData._id}>
                          <h3 className="font-semibold text-sm mb-3 text-gray-700 border-b pb-2">
                            {semData.semester?.title || "Semester"}
                          </h3>
                          <div className="pl-3 space-y-2">
                            {Array.isArray(semData.quarters) &&
                            semData.quarters.length > 0 ? (
                              semData.quarters.map((q) => (
                                <div
                                  key={q._id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`quarter-${q._id}`}
                                    checked={tempSelectedQuarters.includes(
                                      q._id
                                    )}
                                    onCheckedChange={() => toggleQuarter(q._id)}
                                    aria-label={`Select ${q.title}`}
                                  />
                                  <label
                                    htmlFor={`quarter-${q._id}`}
                                    className="text-sm cursor-pointer flex-1 py-1 select-none"
                                  >
                                    {q.title}
                                  </label>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-400 py-1">
                                No quarters available
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No quarters available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </fieldset>

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={cancelSelection}
                  aria-label="Cancel quarter selection"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={confirmSelection}
                  disabled={!hasChanges && selectedQuarters.length > 0}
                  aria-label="Confirm quarter selection"
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
        {...register("quarter")}
        value={JSON.stringify(selectedQuarters)}
      />

      {errors?.quarter && (
        <p
          id="quarter-error"
          className="text-xs text-red-500 mt-1 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          {errors.quarter.message}
        </p>
      )}
    </div>
  );
};

export default SelectQuarter;
