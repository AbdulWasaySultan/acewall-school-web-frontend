"use client";
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
import { CheckCircle2 } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PurchaseConfirmationModal({ courseID }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const res = await axiosInstance.post(`enrollment/create/${courseID}`);
      toast.success(res.data.message);
      navigate("/student/mycourses");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full text-white text-sm py-2 bg-green-600 hover:bg-green-700 rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          Enroll Now
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-dialog-title"
        aria-describedby="enroll-dialog-description"
      >
        <DialogHeader>
          <DialogTitle
            id="enroll-dialog-title"
            className="flex items-center gap-2 text-green-600"
          >
            <CheckCircle2 className="h-5 w-5" /> Enroll in Course
          </DialogTitle>
          <DialogDescription id="enroll-dialog-description">
            Click below to enroll and get started
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            className="focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            aria-label="Confirm Enrollment"
          >
            Enroll Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
