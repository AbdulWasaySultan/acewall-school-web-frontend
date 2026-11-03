import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectCmp = ({ data, title, className, onChange, value, id }) => {
  const handleChange = (val) => {
    onChange && onChange(val);
  };

  // Check if data exists
  const hasData = data && data.length > 0;

  // Use provided id or fallback for accessibility
  const selectId = id || "select-course";

  return (
    <div className={className}>
      {/* Hidden label for screen readers */}
      <label htmlFor={selectId} className="sr-only">
        {title}
      </label>

      <Select
        value={value}
        onValueChange={handleChange}
        aria-labelledby={selectId}
      >
        <SelectTrigger className="w-full" id={selectId}>
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          {hasData ? (
            data.map((item, index) => (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled aria-disabled="true">
              No options available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectCmp;
