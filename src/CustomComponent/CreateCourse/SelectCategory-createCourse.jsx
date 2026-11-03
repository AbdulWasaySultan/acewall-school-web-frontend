import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState, useId } from "react";
import { AlertCircle } from "lucide-react";

const SelectCategory_createCourse = ({
  register,
  errors,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectId = useId();
  const errorId = useId();
  const helpTextId = useId();

  useEffect(() => {
    const fetchCategoriesWithSubcategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryRes = await axiosInstance.get("/category/get");
        const allCategories = categoryRes.data?.categories || [];

        const validCategories = [];

        const subcategoryFetches = allCategories.map(async (category) => {
          if (!category._id) return;

          try {
            const subRes = await axiosInstance.get(
              `/category/subcategories/${category._id}`
            );
            const subcategories = subRes.data?.subcategories || [];

            if (subcategories.length > 0) {
              validCategories.push(category);
            }
          } catch (err) {
            console.error(
              `Failed to fetch subcategories for ${category.title}:`,
              err.message
            );
          }
        });

        await Promise.allSettled(subcategoryFetches);
        setCategories(validCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err.message);
        setError("Failed to load topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithSubcategories();
  }, []);

  const handleValueChange = (value) => {
    const event = { target: { name: "category", value } };
    register("category").onChange(event);
    onCategoryChange?.(value);
  };

  const hasError = !!errors?.category;
  const descriptorIds = [
    hasError ? errorId : null,
    categories.length > 0 ? helpTextId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-2">
      <Label htmlFor={selectId} className="block font-medium text-gray-700">
        Topics
        <span className="text-red-500 ml-1" aria-label="required">
          *
        </span>
      </Label>

      <Select onValueChange={handleValueChange} disabled={loading || !!error}>
        <SelectTrigger
          id={selectId}
          className={`bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-2 transition-all ${
            hasError ? "border-red-500" : "border-gray-300"
          } ${loading || error ? "opacity-60 cursor-not-allowed" : ""}`}
          aria-describedby={descriptorIds || undefined}
          aria-invalid={hasError}
          aria-busy={loading}
          aria-label="Select a topic for your course"
        >
          <SelectValue
            placeholder={
              loading
                ? "Loading topics..."
                : error
                ? "Error loading topics"
                : "Select Topic"
            }
          />
        </SelectTrigger>

        <SelectContent
          className="max-w-xs"
          role="listbox"
          aria-label="Available topics"
        >
          {error ? (
            <div
              className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded mx-1 my-1"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          ) : categories.length > 0 ? (
            <>
              {categories.map((category) => (
                <SelectItem
                  key={category._id}
                  value={category._id}
                  className="cursor-pointer hover:bg-blue-50 focus:bg-blue-100"
                  role="option"
                  aria-label={`${category.title} - has subtopics`}
                >
                  {category.title}
                </SelectItem>
              ))}
            </>
          ) : (
            <div
              className="p-3 text-sm text-gray-500 text-center italic"
              role="status"
            >
              No topics with subtopics available
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Help text */}
      {!hasError && categories.length > 0 && (
        <p id={helpTextId} className="text-xs text-gray-600 mt-1">
          Select a topic to proceed. Each topic has associated subtopics.
        </p>
      )}

      {/* Error message */}
      {hasError && (
        <div
          id={errorId}
          className="flex items-start gap-2 mt-2 p-2 bg-red-50 rounded border border-red-200"
          role="alert"
        >
          <AlertCircle
            className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-xs text-red-600 font-medium">
            {errors.category.message}
          </p>
        </div>
      )}

      {/* Loading status for screen readers */}
      {loading && (
        <div className="sr-only" role="status" aria-live="polite">
          Loading available topics, please wait...
        </div>
      )}

      <input type="hidden" {...register("category")} />
    </div>
  );
};

export default SelectCategory_createCourse;
