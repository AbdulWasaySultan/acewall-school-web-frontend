import React from "react";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import AssessmentCard from "./AssessmentCard";

export default function AssessmentSection({
  title,
  Assessments,
  expanded,
  setExpanded,
}) {
  return (
    <Card className="border rounded-lg bg-gray-50 p-4">
      <Collapsible
        open={expanded}
        onOpenChange={setExpanded}
        className="space-y-4"
      >
        <CollapsibleTrigger
          className="flex items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          aria-expanded={expanded}
          aria-controls={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          <div className="flex items-center">
            {expanded ? (
              <ChevronDown className="h-5 w-5 mr-2" aria-hidden="true" />
            ) : (
              <ChevronUp className="h-5 w-5 mr-2" aria-hidden="true" />
            )}
            <h2 className="text-md font-semibold">
              {title} ({Assessments.length})
            </h2>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent
          id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          <Card
            className="border rounded-lg bg-white overflow-hidden"
            role="region"
            aria-labelledby={`section-${title
              .replace(/\s+/g, "-")
              .toLowerCase()}-label`}
          >
            {Assessments.map((Assessment, index) => (
              <React.Fragment key={Assessment.id}>
                <AssessmentCard Assessment={Assessment} />
                {index < Assessments.length - 1 && <div className="border-t" />}
              </React.Fragment>
            ))}
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
