"use client";
import { useNavigate } from "react-router-dom";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Individual Lesson Component
const Lesson = ({ lesson }) => {
  return (
    <Card className="mb-2 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{lesson.title}</h3>
            <p className="text-gray-500 mt-1">{lesson.description}</p>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>{lesson.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Accordion Trigger for Chapters
const CustomAccordionTrigger = ({
  chapter,
  isOpen,
  onToggle,
  onChapterClick,
}) => {
  return (
    <div className="flex w-full justify-between items-center px-4 py-3 hover:bg-gray-50">
      {/* Chapter title and info - clickable for navigation */}
      <div
        className="flex flex-col items-start text-left cursor-pointer flex-grow focus:outline-none focus:ring-2 focus:ring-green-400"
        role="button"
        tabIndex={0}
        onClick={() => onChapterClick(chapter._id)}
        onKeyDown={(e) => e.key === "Enter" && onChapterClick(chapter._id)}
        aria-label={`Navigate to chapter ${chapter.title}`}
      >
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{chapter.title}</h2>
          <Badge variant="secondary" className="ml-3">
            {chapter.lessons.length}{" "}
            {chapter.lessons.length === 1 ? "lesson" : "lessons"}
          </Badge>
        </div>
        <p className="text-gray-500 text-sm mt-1">{chapter.description}</p>
      </div>

      {/* Dropdown toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-expanded={isOpen}
        aria-controls={`chapter-content-${chapter._id}`}
        aria-label={
          isOpen ? `Collapse ${chapter.title}` : `Expand ${chapter.title}`
        }
      >
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
    </div>
  );
};

// Main Chapter Accordion
export const ChapterAccordion = ({
  chapter,
  openChapters,
  setOpenChapters,
}) => {
  const navigate = useNavigate();
  const chapterId = `chapter-${chapter._id}`;
  const isOpen = openChapters.includes(chapterId);

  const handleToggle = () => {
    if (isOpen) {
      setOpenChapters(openChapters.filter((id) => id !== chapterId));
    } else {
      setOpenChapters([...openChapters, chapterId]);
    }
  };

  const handleChapterClick = (chapterId) => {
    navigate(`/chapter/${chapterId}`);
  };

  return (
    <AccordionItem
      value={chapterId}
      className="border rounded-lg mb-4 shadow-sm"
    >
      <CustomAccordionTrigger
        chapter={chapter}
        isOpen={isOpen}
        onToggle={handleToggle}
        onChapterClick={handleChapterClick}
      />
      <AccordionContent
        forceMount
        hidden={!isOpen}
        className="px-4 pt-2 pb-4"
        id={`chapter-content-${chapter._id}`}
      >
        {chapter.lessons.map((lesson) => (
          <Lesson key={lesson._id} lesson={lesson} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
