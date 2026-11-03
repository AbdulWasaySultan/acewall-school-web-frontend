import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const SubCategorySelect = ({
  control,
  errors,
  selectedCategory,
  prevSubCategory,
  setSubcategories,
  subcategories,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get("subcategory/get")
      .then((res) => {
        setSubcategories(res.data.subcategories);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch subcategories:", err);
        setIsLoading(false);
      });
  }, [setSubcategories]);

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category === selectedCategory
  );

  const isDisabled = !selectedCategory || isLoading;
  const hasFilteredOptions = filteredSubcategories.length > 0;

  return (
    <div>
      <Label htmlFor="subcategory-select" className="block mb-2">
        SubTopic <span aria-label="required">*</span>
      </Label>
      <Controller
        name="subcategory"
        control={control}
        defaultValue={prevSubCategory || ""}
        render={({ field }) => (
          <Select
            disabled={isDisabled}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id="subcategory-select"
              className="bg-gray-50"
              aria-required="true"
              aria-invalid={errors?.subcategory ? "true" : "false"}
              aria-describedby={
                errors?.subcategory
                  ? "subcategory-error"
                  : !selectedCategory
                  ? "subcategory-hint"
                  : undefined
              }
              aria-label="Select course subtopic"
            >
              <SelectValue
                placeholder={
                  isLoading
                    ? "Loading subtopics..."
                    : !selectedCategory
                    ? "Select a category first"
                    : "Select sub category"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div
                  className="p-2 text-sm text-gray-500"
                  role="status"
                  aria-live="polite"
                >
                  Loading subtopics...
                </div>
              ) : !selectedCategory ? (
                <div className="p-2 text-sm text-gray-500" role="status">
                  Please select a category first
                </div>
              ) : hasFilteredOptions ? (
                filteredSubcategories.map((value) => (
                  <SelectItem
                    key={value._id}
                    value={value._id}
                    aria-label={`Subtopic: ${value.title}`}
                  >
                    {value.title}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500" role="status">
                  No subtopics available for this category
                </div>
              )}
            </SelectContent>
          </Select>
        )}
      />
      {!selectedCategory && !errors?.subcategory && (
        <p id="subcategory-hint" className="text-xs text-gray-500 mt-1">
          Please select a category first to see available subtopics
        </p>
      )}
      {errors?.subcategory && (
        <p
          id="subcategory-error"
          className="text-xs text-red-500 mt-1"
          role="alert"
        >
          {errors.subcategory.message}
        </p>
      )}
    </div>
  );
};

export default SubCategorySelect;
