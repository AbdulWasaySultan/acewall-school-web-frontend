import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgePlus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreateDiscussionDialog } from "../createDiscussionModal";

const ChapterOptionDropdown = ({
  typeId,
  fetchChapterDetail,
  quarterId,
  semesterId,
  quarterStart,
  quarterEnd,
  courseId,
  type,
}) => {
  const isChapter = type === "chapter";
  const contentTypeLabel = isChapter ? "chapter" : "section";

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="bg-green-200 hover:bg-green-300 active:bg-green-400 cursor-pointer rounded-lg p-2 transition-colors duration-150"
            aria-label={`Add content options for this ${contentTypeLabel}`}
            aria-haspopup="true"
            aria-expanded="false"
            title={`Add content options for this ${contentTypeLabel}`}
          >
            <BadgePlus
              className="text-green-600"
              size={20}
              aria-hidden="true"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-gray-700 font-semibold">
            Add Content
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Add Lesson - Only for Chapters */}
          {isChapter && (
            <DropdownMenuItem asChild>
              <Link
                to={`/teacher/lessons/create/chapter/${typeId}`}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 active:text-green-800 py-2 px-3 rounded cursor-pointer transition-colors duration-150"
                aria-label="Add lesson to chapter"
              >
                <Plus className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>Add Lesson</span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Add Assessment */}
          <DropdownMenuItem asChild>
            <Link
              to={`/teacher/assessments/create/${type}/${typeId}/${courseId}/${quarterStart}/${quarterEnd}?semester=${semesterId}&quarter=${quarterId}`}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 active:text-green-800 py-2 px-3 rounded cursor-pointer transition-colors duration-150"
              aria-label="Add assessment"
            >
              <Plus className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Add Assessment</span>
            </Link>
          </DropdownMenuItem>

          {/* Add Page */}
          <DropdownMenuItem asChild>
            <Link
              to={`/teacher/courses/${courseId}/posts/${type}/${typeId}`}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 active:text-green-800 py-2 px-3 rounded cursor-pointer transition-colors duration-150"
              aria-label="Add page"
            >
              <Plus className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Add Page</span>
            </Link>
          </DropdownMenuItem>

          {/* Add Discussion */}
          <DropdownMenuItem asChild>
            <Link
              to={`/teacher/discussions/course/${courseId}?semester=${semesterId}&quarter=${quarterId}&type=${type}&typeId=${typeId}&course=${courseId}`}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 active:text-green-800 py-2 px-3 rounded cursor-pointer transition-colors duration-150"
              aria-label="Add discussion"
            >
              <Plus className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Add Discussion</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChapterOptionDropdown;
