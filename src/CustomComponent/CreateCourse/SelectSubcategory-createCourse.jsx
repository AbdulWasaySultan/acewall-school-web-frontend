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

const SubCategorySelect_createCourse = ({
  register,
  errors,
  selectedCategory,
}) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    const getSubcategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/subcategory/get");
        setSubcategories(res.data?.subcategories || []);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setError("Failed to load sub-topics. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getSubcategories();
  }, []);

  // Reset subcategory selection when category changes
  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category === selectedCategory
  );

  const handleValueChange = (value) => {
    setSelectedSubcategory(value);
    const event = { target: { name: "subcategory", value } };
    register("subcategory").onChange(event);
  };

  return (
    <div>
      <Label htmlFor="subcategory" className="block mb-2">
        SubTopics *
      </Label>
      <Select
        value={selectedSubcategory || ""}
        onValueChange={handleValueChange}
        disabled={!selectedCategory || loading}
      >
        <SelectTrigger className="bg-gray-50">
          <SelectValue
            placeholder={
              !selectedCategory
                ? "Select a Topic first"
                : loading
                ? "Loading sub-topics..."
                : "Select SubTopic"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {error ? (
            <div className="p-2 text-sm text-red-500">{error}</div>
          ) : filteredSubcategories.length > 0 ? (
            filteredSubcategories.map((subcategory) => (
              <SelectItem key={subcategory._id} value={subcategory._id}>
                {subcategory.title}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">
              {selectedCategory
                ? "No sub-topics available"
                : "Select a topic first"}
            </div>
          )}
        </SelectContent>
      </Select>
      <input type="hidden" {...register("subcategory")} />
      {errors?.subcategory && (
        <p className="text-xs text-red-500 mt-1">
          {errors.subcategory.message}
        </p>
      )}
    </div>
  );
};

export default SubCategorySelect_createCourse;
