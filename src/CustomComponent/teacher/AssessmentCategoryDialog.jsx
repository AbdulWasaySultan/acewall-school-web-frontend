import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Save, X } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

export default function AssessmentCategoryDialog({ courseId }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState();
  const [newCategory, setNewCategory] = useState({ name: "", weight: "" });
  const [editingWeights, setEditingWeights] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      await axiosInstance
        .get(`assessmentCategory/${courseId}`)
        .then((res) => {
          console.log(res);
          setCategories(res.data.categories);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchCategories();
  }, [loading, courseId]);

  const handleWeightChange = (categoryId, newWeight) => {
    setEditingWeights((prev) => ({
      ...prev,
      [categoryId]: newWeight,
    }));
  };

  const handleSaveWeight = async (categoryId) => {
    const newWeight = editingWeights[categoryId];
    if (newWeight !== undefined && newWeight !== "") {
      setLoading(true);
      await axiosInstance
        .put(`assessmentCategory/${courseId}/${categoryId}`, {
          weight: Number.parseFloat(newWeight),
        })
        .then((res) => {
          setLoading(false);
          toast.success(res.data.message || "Weight updated successfully");
          editingWeights[categoryId] = undefined;
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message || "Failed to update weight");
        });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    if (!newCategory.weight || parseFloat(newCategory.weight) <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    setLoading(true);
    await axiosInstance
      .post(`assessmentCategory/${courseId}`, {
        name: newCategory.name,
        weight: Number.parseFloat(newCategory.weight),
      })
      .then((res) => {
        setLoading(false);
        setNewCategory({ name: "", weight: "" });
        toast.success(res.data.message || "Category added successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error adding category:", err);
        toast.error(err.response?.data?.message || "Failed to add category");
      });
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    await axiosInstance
      .delete(`assessmentCategory/${categoryId}`)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message || "Category deleted successfully");
        setCategories((prev) => prev ? prev.filter((cat) => cat._id !== categoryId) : []);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message || "Failed to delete category");
        console.log(err);
      });
  };

  const getDisplayWeight = (category) => {
    return editingWeights[category._id] !== undefined
      ? editingWeights[category._id]
      : category.weight;
  };

  const totalWeight = categories?.reduce((sum, cat) => sum + cat.weight, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          aria-haspopup="dialog"
          aria-label="Manage assessment categories"
        >
          Manage Assessment Categories
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="dialog-title">Assessment Categories</DialogTitle>
          <DialogDescription id="dialog-description">
            Manage your course assessment categories and their weights. Total weight should equal 100%.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Categories Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Category Name</TableHead>
                  <TableHead scope="col">Weight (%)</TableHead>
                  <TableHead scope="col" className="w-24">Save</TableHead>
                  <TableHead scope="col" className="w-24">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No categories added yet. Add your first category below.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories?.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">
                        <span id={`category-name-${category._id}`}>
                          {category.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Label htmlFor={`weight-${category._id}`} className="sr-only">
                          Weight percentage for {category.name}
                        </Label>
                        <Input
                          id={`weight-${category._id}`}
                          type="number"
                          value={getDisplayWeight(category)}
                          onChange={(e) =>
                            handleWeightChange(category._id, e.target.value)
                          }
                          className="w-20"
                          min="0"
                          max="100"
                          step="0.1"
                          aria-label={`Weight percentage for ${category.name}`}
                          aria-describedby={`category-name-${category._id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveWeight(category._id)}
                          disabled={editingWeights[category._id] === undefined || loading}
                          aria-label={`Save weight for ${category.name}`}
                          className="focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                        >
                          <Save className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Save</span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(category._id, category.name)}
                          disabled={loading}
                          aria-label={`Delete ${category.name} category`}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Add New Category */}
          <section 
            className="border rounded-lg p-4 bg-muted/50"
            aria-labelledby="add-category-heading"
          >
            <h3 id="add-category-heading" className="font-medium mb-3">
              Add New Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="categoryName">
                  Category Name <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="categoryName"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  aria-required="true"
                  aria-invalid={newCategory.name.trim() === "" && newCategory.weight !== ""}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="categoryWeight">
                  Weight (%) <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="categoryWeight"
                  type="number"
                  placeholder="Enter weight"
                  value={newCategory.weight}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      weight: e.target.value,
                    }))
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  aria-required="true"
                  aria-invalid={newCategory.weight !== "" && parseFloat(newCategory.weight) <= 0}
                  disabled={loading}
                />
              </div>
              <div className="flex items-end justify-end">
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name || !newCategory.weight || loading}
                  className="focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  aria-label="Add new category"
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Add
                </Button>
              </div>
            </div>
          </section>

          {/* Total Weight Display */}
          <div 
            className={`flex justify-between items-center p-3 rounded-lg ${
              totalWeight === 100 
                ? 'bg-green-50 border border-green-200' 
                : totalWeight > 100 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-muted'
            }`}
            role="status"
            aria-live="polite"
          >
            <span className="font-medium">Total Weight:</span>
            <div className="flex items-center gap-2">
              <span 
                className={`font-bold text-lg ${
                  totalWeight === 100 
                    ? 'text-green-700' 
                    : totalWeight > 100 
                    ? 'text-red-700' 
                    : ''
                }`}
                aria-label={`Total weight is ${totalWeight} percent`}
              >
                {totalWeight}%
              </span>
              {totalWeight !== 100 && (
                <span className="text-xs text-muted-foreground">
                  {totalWeight > 100 
                    ? '(exceeds 100%)' 
                    : `(${100 - totalWeight}% remaining)`}
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}