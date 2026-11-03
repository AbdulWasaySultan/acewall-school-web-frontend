"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2 } from "lucide-react";

const Pages = ({ onCreated, courseId, type, typeId }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [pageData, setPageData] = useState({
    title: "",
    description: "",
    image: null,
    file: null,
  });

  const handleCreatePage = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData();
    formData.append("title", pageData.title);
    formData.append("description", pageData.description);
    if (pageData.image) formData.append("image", pageData.image);
    if (pageData.file) formData.append("files", pageData.file);

    try {
      await axiosInstance.post(
        `/pages/createpage/${courseId}/${type}/${typeId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Page created successfully!");
      setOpen(false);
      setPageData({ title: "", description: "", image: null, file: null });
      onCreated?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create page");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Create new page"
          >
            + Create Page
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg" role="dialog" aria-modal="true">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePage} className="space-y-4">
            <div>
              <Label htmlFor="page-title">Title *</Label>
              <Input
                id="page-title"
                type="text"
                required
                value={pageData.title}
                onChange={(e) =>
                  setPageData({ ...pageData, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="page-description">Description *</Label>
              <Textarea
                id="page-description"
                required
                value={pageData.description}
                onChange={(e) =>
                  setPageData({ ...pageData, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="page-image">Upload Image (optional)</Label>
              <Input
                id="page-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPageData({ ...pageData, image: e.target.files[0] })
                }
              />
              {pageData.image && (
                <div className="mt-3 flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(pageData.image)}
                      alt={`Preview of ${pageData.image.name}`}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="truncate max-w-[200px]">
                      {pageData.image.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove image"
                    onClick={() => setPageData({ ...pageData, image: null })}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="page-file">Upload File (optional)</Label>
              <Input
                id="page-file"
                type="file"
                onChange={(e) =>
                  setPageData({ ...pageData, file: e.target.files[0] || null })
                }
              />
              {pageData.file && (
                <div className="mt-3 flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    {pageData.file.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(pageData.file)}
                        alt={`Preview of ${pageData.file.name}`}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span className="truncate max-w-[200px]">
                      {pageData.file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove file"
                    onClick={() => setPageData({ ...pageData, file: null })}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  "Create Page"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isCreating && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          aria-busy="true"
          aria-label="Creating new page"
        >
          <div className="bg-white rounded-lg shadow-lg px-6 py-4 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Creating new page...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Pages;
