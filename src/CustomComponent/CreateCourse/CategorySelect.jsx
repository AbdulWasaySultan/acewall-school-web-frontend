import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/AxiosInstance";
import { sub } from "date-fns";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const CategorySelect = ({
  control,
  errors,
  onCategoryChange,
  prevCategory,
  categories,
  setCategories,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesWithSubcategories = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/category/get");
        const allCategories = res.data?.categories || [];
        const validCategories = [];

        await Promise.allSettled(
          allCategories.map(async (cat) => {
            if (!cat._id) return;
            try {
              const sub = await axiosInstance.get(
                `/category/subcategories/${cat._id}`
              );
              if (sub.data?.subcategories?.length > 0)
                validCategories.push(cat);
            } catch {}
          })
        );

        setCategories(validCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesWithSubcategories();
  }, [setCategories]);

  console.log(categories, "categories");

  return (
    <div>
      <Label htmlFor="category-select" className="block mb-2">
        Category <span aria-label="required">*</span>
      </Label>
      <Controller
        name="category"
        control={control}
        shouldUnregister={false}
        render={({ field }) => (
          <Select
            value={field.value || ""}
            onValueChange={(value) => {
              console.log(value, "value in select");
              field.onChange(value);
              onCategoryChange?.(value);
            }}
            disabled={isLoading}
          >
            <SelectTrigger
              id="category-select"
              className="bg-gray-50"
              aria-required="true"
              aria-invalid={errors?.category ? "true" : "false"}
              aria-describedby={errors?.category ? "category-error" : undefined}
              aria-label="Select course category"
            >
              <SelectValue
                placeholder={
                  isLoading ? "Loading categories..." : "Select category"
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
                  Loading categories...
                </div>
              ) : categories?.length > 0 ? (
                categories?.map((value) => (
                  <SelectItem
                    key={value._id}
                    value={value._id}
                    aria-label={`Category: ${value.title}`}
                  >
                    {value.title}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500" role="status">
                  No categories with subcategories available
                </div>
              )}
            </SelectContent>
          </Select>
        )}
      />
      {errors?.category && (
        <p
          id="category-error"
          className="text-xs text-red-500 mt-1"
          role="alert"
        >
          {errors.category.message}
        </p>
      )}
    </div>
  );
};

export default CategorySelect;
