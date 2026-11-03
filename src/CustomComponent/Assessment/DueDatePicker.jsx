import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormContext, useController } from "react-hook-form";
import { format } from "date-fns";

export default function StrictDatePicker({ name, minDate, maxDate, label = "Select due date and time", styles }) {
  const { control, setValue } = useFormContext();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;

    const formattedDate = format(selectedDate, "MM-dd-yyyy");
    const formattedTime = format(selectedDate, "HH:mm");

    setValue(`${name}.date`, formattedDate);
    setValue(`${name}.time`, formattedTime);
    setValue(`${name}.dateTime`, selectedDate.toISOString());

    onChange({
      date: formattedDate,
      time: formattedTime,
      dateTime: selectedDate.toISOString(),
    });
  };

  const errorId = `${name}-error`;
  const inputId = `${name}-datepicker`;

  return (
    <div className={`space-y-1 ${styles}`}>
      {/* Visible Label for Screen Readers */}
      <label 
        htmlFor={inputId} 
        className="text-sm font-medium text-gray-900"
      >
        {label}
      </label>

      <DatePicker
        id={inputId}
        selected={value?.dateTime ? new Date(value.dateTime) : null}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="hh:mm a"
        dateFormat="MM/dd/yyyy hh:mm a"
        placeholderText="Select date and time"
        minDate={minDate}
        maxDate={maxDate}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        onKeyDown={(e) => {
          if (e.key !== "Tab" && e.key !== "Shift") {
            e.preventDefault();
          }
        }}
        aria-label={label}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className="
          w-full border border-gray-300 rounded px-3 py-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          bg-white
        "
      />

      {(error?.message || error?.dateTime?.message) && (
        <p id={errorId} className="text-sm text-red-600">
          {error.message || error.dateTime.message}
        </p>
      )}
    </div>
  );
}
