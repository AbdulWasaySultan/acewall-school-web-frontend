import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmationDialog({
  triggerText = "Open",
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  onConfirm
}) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-haspopup="dialog" aria-expanded={open}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        role="alertdialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="dialog-title">{title}</DialogTitle>
          <DialogDescription id="dialog-description">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
