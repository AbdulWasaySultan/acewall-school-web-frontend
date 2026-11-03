import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";

export const AssessmentTable = ({ title, items, isFinal = false }) => {
  const itemsArray = Array.isArray(items) ? items : [items];

  if (!itemsArray.length) return null;

  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-labelledby={`${title.replace(/\s+/g, "-")}-label`}
    >
      <h3
        id={`${title.replace(/\s+/g, "-")}-label`}
        className="font-medium text-sm mb-2"
      >
        {title}
      </h3>
      <Table className="min-w-[600px]" role="table" aria-label={title}>
        <TableHeader>
          <TableRow role="row">
            <TableHead scope="col" className="w-2/6">
              Title
            </TableHead>
            <TableHead scope="col" className="w-1/6">
              Chapter
            </TableHead>
            <TableHead scope="col" className="w-1/6">
              Points
            </TableHead>
            <TableHead scope="col" className="w-1/6">
              Obtained
            </TableHead>
            <TableHead scope="col" className="w-1/6">
              Percentage
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsArray.map((item) => {
            const marks = Number(item.marks) || 0;
            const obtMarks = Number(item.obtMarks) || 0;
            const percentage =
              marks > 0 ? ((obtMarks / marks) * 100).toFixed(0) : 0;

            return (
              <TableRow key={item.id} role="row">
                <TableCell role="cell" className="flex items-center gap-2">
                  <FileText
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  <span>{item.title}</span>
                </TableCell>
                <TableCell role="cell">
                  {isFinal ? "Final" : item.chapter || "—"}
                </TableCell>
                <TableCell role="cell">{marks || "—"}</TableCell>
                <TableCell role="cell">{obtMarks || "—"}</TableCell>
                <TableCell role="cell">
                  <div className="flex items-center gap-2">
                    <span>{percentage}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
