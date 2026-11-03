"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CartModal({ purchaseCourse }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button with accessible label */}
      <Button
        className="bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Purchase Course
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="purchase-dialog-title"
          aria-describedby="purchase-dialog-description"
        >
          <DialogHeader>
            <DialogTitle id="purchase-dialog-title">
              Confirm Purchase
            </DialogTitle>
            <DialogDescription id="purchase-dialog-description">
              Are you sure you want to purchase this course? You will get
              instant access after payment.
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
              className="bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              onClick={() => {
                purchaseCourse();
                setOpen(false);
              }}
              aria-label="Confirm Purchase of Course"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
