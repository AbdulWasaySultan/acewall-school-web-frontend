import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ReviewModal({ data }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-xs text-green-600 hover:underline font-medium"
          aria-haspopup="dialog"
        >
          Read more
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
      >
        <DialogHeader>
          <DialogTitle id="review-dialog-title" className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src="https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/544/Google__G__Logo-1024.png"
                alt="Google"
              />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <span>{data.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Star rating for screen readers */}
          <div
            className="sr-only"
            aria-label={`Rating: ${data.rating} out of 5 stars`}
          >
            {`${data.rating} out of 5`}
          </div>

          {/* Visible star icons */}
          <div className="text-yellow-400 text-sm mb-2" role="img" aria-hidden="true">
            {Array(data.rating)
              .fill(0)
              .map((_, i) => (
                <span key={i}>★</span>
              ))}
          </div>

          {/* Review text */}
          <p className="text-base text-gray-800">{data.review}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
