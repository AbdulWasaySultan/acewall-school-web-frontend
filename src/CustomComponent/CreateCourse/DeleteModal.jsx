import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Trash2, AlertTriangle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";

export function DeleteModal({
  chapterID,
  deleteFunc,
  what = "item",
  onSuccess,
  modelName, // E.g., 'Chapter', 'Lesson', 'assessment', 'CourseSch'
  triggerText = "",
  triggerClassName = "h-8 text-gray-500 hover:text-red-600 bg-gray-200 hover:bg-red-200 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-red-500",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const resetState = () => {
    setDeleteReason("");
    setAnalysis(null);
    setErrorMessage("");
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      if (modelName) {
        // Use unified soft-delete framework API
        await axiosInstance.post(`soft-delete/delete/${modelName}/${chapterID}`, {
          deleteReason: deleteReason || "Deleted by user",
        });
        toast.success(`${what} soft-deleted successfully`);
        setOpen(false);
        resetState();
        if (onSuccess) onSuccess();
      } else if (deleteFunc) {
        // Fallback to legacy delete function
        await deleteFunc(chapterID);
        toast.success(`${what} deleted successfully`);
        setOpen(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      const apiError = error.response?.data;
      if (apiError && apiError.error === "DELETION_BLOCKED") {
        setAnalysis(apiError.analysis);
        setErrorMessage(apiError.message || "");
        toast.error("Deletion blocked due to active dependency records.");
      } else {
        toast.error(error.response?.data?.message || `Failed to delete ${what}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTree = (node) => {
    if (!node) return null;
    return (
      <div className="ml-4 border-l border-red-100 pl-4 mt-2">
        <div className="flex items-center gap-1.5 text-sm py-1">
          <ChevronRight className="h-3 w-3 text-red-400" />
          <span className="font-semibold text-gray-700">{node.type}:</span>
          <span className="text-gray-600">{node.name}</span>
          {node.reasons && node.reasons.length > 0 && (
            <span className="text-red-600 text-xs font-semibold bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
              ({node.reasons.join(", ")})
            </span>
          )}
        </div>
        {node.children &&
          node.children.map((child, idx) => (
            <div key={idx}>{renderTree(child)}</div>
          ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} aria-label={`Delete ${what} dialog`}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Delete ${what}`}
          className={triggerClassName}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {triggerText && <span className="ml-1.5">{triggerText}</span>}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white" role="alertdialog" aria-modal="true">
        {analysis && analysis.blocked ? (
          <div className="space-y-4">
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <DialogTitle className="text-center text-red-600 font-bold">
                Deletion Blocked!
              </DialogTitle>
              <DialogDescription className="text-center text-gray-700 font-semibold">
                {errorMessage || "This item cannot be deleted because it contains protected educational records."}
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Dependency Tree
              </div>
              <div className="text-sm font-semibold text-gray-800">{analysis.type}: {analysis.name}</div>
              {analysis.children &&
                analysis.children.map((child, idx) => (
                  <div key={idx}>{renderTree(child)}</div>
                ))}
            </div>

            <DialogFooter className="sm:justify-center">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Dismiss
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action will soft-delete the {what} and all associated items beneath it in the hierarchy.
              </DialogDescription>
            </DialogHeader>

            {modelName && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="delete-reason-input">
                  Reason for deletion (required):
                </label>
                <textarea
                  id="delete-reason-input"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline focus:outline-2 focus:outline-blue-500 font-medium"
                  placeholder="E.g., Curriculum update / Course restructuring"
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                />
              </div>
            )}

            <DialogFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading || (modelName && !deleteReason.trim())}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Deleting...
                  </span>
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
