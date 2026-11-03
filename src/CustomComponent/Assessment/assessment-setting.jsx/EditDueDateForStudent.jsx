import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Label } from "@/components/ui/label";
import profileImg from "@/assets/avatar.png";

const EditDueDateForStudent = ({
  editfor,
  assessment,
  students,
  setStudents,
  selectedStudents,
  setSelectedStudents,
}) => {
  const [open, setOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get(
        `course/getStudentofCourse/${editfor === "discussion" ? assessment.course._id : assessment.course}`,
      );

      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (assessment?.course) {
      fetchStudents();
    }
  }, [assessment?.course._id]);

  const toggleStudent = (student) => {
    const exists = selectedStudents.find((s) => s._id === student._id);

    if (exists) {
      setSelectedStudents(
        selectedStudents.filter((s) => s._id !== student._id),
      );
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const removeStudent = (id) => {
    setSelectedStudents(selectedStudents.filter((s) => s._id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <Label>Select Students</Label>

        {/* Dropdown - Added modal={true} to fix Modal/Dialog focus trap conflicts */}
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selectedStudents.length > 0
                ? `${selectedStudents.length} student(s) selected`
                : "Select students..."}

              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder="Search student..." />

              <CommandEmpty>No student found.</CommandEmpty>

              <CommandGroup>
                {students.map((student) => {
                  const isSelected = selectedStudents.some(
                    (s) => s._id === student._id,
                  );

                  return (
                    <CommandItem
                      key={student._id}
                      value={`${student.firstName} ${student.lastName} ${student._id}`}
                      onSelect={() => toggleStudent(student)}
                    // Removed the onMouseDown override so selecting works natively again
                    >
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={student?.profileImg?.url || profileImg}
                          alt={`${student.firstName} avatar`}
                          className="w-8 h-8 rounded-full object-cover"
                        />

                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {student.firstName} {student.middleName}{" "}
                            {student.lastName}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {student.email}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="ml-auto h-4 w-4 text-green-600" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Students List */}
      {selectedStudents.length > 0 && (
        <div className="space-y-3 mt-2">
          <Label className="text-sm font-semibold">
            Selected Students
          </Label>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedStudents.map((student) => {
              return (
                <div
                  key={student._id}
                  className="group flex items-center justify-between border rounded-lg p-2.5 w-full bg-background transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student?.profileImg?.url || profileImg}
                      alt={`${student.firstName} avatar`}
                      className="w-9 h-9 rounded-full object-cover border"
                    />

                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none mb-1">
                        {student.firstName} {student.lastName}
                      </span>

                      <span className="text-xs text-muted-foreground leading-none">
                        {student.email}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-50 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      removeStudent(student._id);
                    }}
                    title="Remove student"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDueDateForStudent;
