"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useState } from "react";
import { decryptValue } from "../../utils/autoCrypto";

const TeacherDropdown = ({ teachers, getConversations }) => {
  const [open, setOpen] = useState(false);

  const handleConversation = async (id) => {
    try {
      await axiosInstance.post("conversation/create", { memberId: id });
      getConversations();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-haspopup="listbox"
          aria-expanded={open}
          className="focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Start New Conversation
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-2"
        role="menu"
        aria-label="Teachers List"
      >
        <ScrollArea className="h-64 w-full">
          {teachers.length === 0 ? (
            <div className="text-gray-500 p-2">No Teachers</div>
          ) : (
            teachers.map((teacher) => (
              <div
                key={teacher.teacherId}
                role="menuitem"
                tabIndex={0}
                className="mb-2 border p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                onClick={() => handleConversation(teacher.teacherId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleConversation(teacher.teacherId);
                  }
                }}
              >
                <div className="font-medium text-sm text-gray-800 pb-1">
                  {decryptValue(teacher.firstName)} {decryptValue(teacher.middleName)} {decryptValue(teacher.lastName)}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default TeacherDropdown;
