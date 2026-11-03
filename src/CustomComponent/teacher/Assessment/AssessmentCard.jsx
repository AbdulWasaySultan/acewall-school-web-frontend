import React from "react";
import { Button } from "@/components/ui/button";
import { AlignLeft, Pencil, Eye, Trash2, Calendar } from "lucide-react";

export default function AssessmentCard({ Assessment }) {
  return (
    <div
      className="flex items-center p-4 hover:bg-gray-50 focus-within:bg-gray-50 rounded transition-colors"
      role="group"
      aria-label={`Assessment ${Assessment.title}, ${Assessment.questions} questions, ${Assessment.points} points, due on ${Assessment.dueDate}`}
      tabIndex={0}
    >
      {/* Icon */}
      <div className="flex items-center w-16">
        <AlignLeft className="h-5 w-5 text-gray-500" aria-hidden="true" />
      </div>

      {/* Assessment info */}
      <div className="flex-1">
        <div
          className="text-blue-500 font-medium"
          aria-label={`Quiz ${Assessment.id}`}
        >
          Quiz {Assessment.id}
        </div>
        <div className="font-medium text-lg">{Assessment.title}</div>
        <div className="text-sm text-gray-500">
          {Assessment.questions} questions | {Assessment.points} pts
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Due Date */}
        <div
          className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded"
          aria-label={`Due date: ${Assessment.dueDate}`}
        >
          <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
          <span>{Assessment.dueDate}</span>
        </div>

        {/* Action buttons */}
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Edit ${Assessment.title}`}
        >
          <Pencil className="h-5 w-5 text-gray-500" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label={`View ${Assessment.title}`}
        >
          <Eye className="h-5 w-5 text-gray-500" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${Assessment.title}`}
        >
          <Trash2 className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}
