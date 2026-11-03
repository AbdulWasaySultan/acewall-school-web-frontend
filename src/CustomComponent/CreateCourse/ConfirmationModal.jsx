import { useState, useId } from "react";
import { ArrowRight, School, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ConfirmationModal({ func }) {
  const [isRentable, setIsRentable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dialogId = useId();
  const switchId = useId();
  const descriptionId = useId();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await func();
      setOpen(false);
      setIsRentable(false);
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white focus:ring-2 focus:ring-green-700 focus:outline-none focus:ring-offset-2 transition-all"
          aria-label="Open dialog to create course with access options"
          title="Create a new course"
        >
          Create Course
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md focus:ring-2 focus:ring-blue-500"
        role="alertdialog"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={descriptionId}
      >
        <DialogHeader>
          <DialogTitle id={`${dialogId}-title`}>
            Course Access Options
          </DialogTitle>
          <DialogDescription
            id={descriptionId}
            className="flex items-start gap-2 mt-2"
          >
            <Info
              className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              Choose whether to make this course available for other schools.
              You can change this setting later.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Sharing Option */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors focus-within:ring-2 focus-within:ring-blue-500">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <School
                    className="h-5 w-5 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <Label
                    htmlFor={switchId}
                    className="text-sm font-semibold text-gray-900 cursor-pointer"
                  >
                    Share Course with Other Schools
                  </Label>
                </div>
                <p
                  className={`text-xs font-medium transition-colors ${
                    isRentable ? "text-green-600" : "text-gray-600"
                  }`}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {isRentable ? (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                      Other schools can access this course material
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                      This course is private to your school only
                    </span>
                  )}
                </p>
              </div>

              <Switch
                id={switchId}
                checked={isRentable}
                onCheckedChange={setIsRentable}
                disabled={loading}
                aria-label={`Toggle course sharing ${
                  isRentable ? "on" : "off"
                }`}
                aria-describedby={descriptionId}
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">What does this mean?</span>
              <br />
              {isRentable
                ? "Your course will appear in the school directory and other schools can request access to use it."
                : "Your course will only be available to your school members. Other schools cannot access it."}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 flex-col sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setIsRentable(false);
            }}
            disabled={loading}
            className="focus:ring-2 focus:ring-gray-500 focus:outline-none"
            aria-label="Cancel and close the dialog"
          >
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white focus:ring-2 focus:ring-green-700 focus:outline-none focus:ring-offset-2 transition-all"
            onClick={handleConfirm}
            disabled={loading}
            aria-busy={loading}
            aria-label={
              loading
                ? "Creating course..."
                : `Confirm and create course as ${
                    isRentable ? "shared" : "private"
                  }`
            }
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creating...
              </>
            ) : (
              <>
                Confirm & Create
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
