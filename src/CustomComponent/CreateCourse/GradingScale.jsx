import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const GradingScaleCard = ({
  scaleFields,
  updateScale,
  isEditingScale,
  setIsEditingScale,
}) => {
  const minInputRef = useRef(null);

  useEffect(() => {
    if (isEditingScale !== null && minInputRef.current) {
      minInputRef.current.focus();
    }
  }, [isEditingScale]);

  const validateGradeRange = (grade) => {
    return grade.min < grade.max;
  };

  return (
    <Card
      className="mb-6 border-red-800"
      role="region"
      aria-labelledby="grading-scale-heading"
    >
      <CardContent className="p-0">
        <h2 id="grading-scale-heading" className="sr-only">
          Current Grading Scale
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <caption className="sr-only">
              Grading scale with letter grades and percentage ranges.
            </caption>

            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Letter Grade
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Percentage Range
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {scaleFields.map((grade) => (
                <tr key={grade.id}>
                  {/* Letter Grade */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {grade.letter}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {grade.min}% - {grade.max}%
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradingScaleCard;
