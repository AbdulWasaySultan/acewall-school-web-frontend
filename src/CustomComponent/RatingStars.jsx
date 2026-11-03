import { useState } from "react";
import { Star } from "lucide-react";

export default function RatingStars({ rating, setRating, editable = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index) => {
    if (!editable) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!editable) return;
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (!editable) return;
    setRating(index);
  };

  const handleKeyDown = (e, index) => {
    if (!editable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setRating(index);
    }
    if (e.key === "ArrowRight" && rating < 5) {
      e.preventDefault();
      setRating(rating + 1);
    }
    if (e.key === "ArrowLeft" && rating > 1) {
      e.preventDefault();
      setRating(rating - 1);
    }
  };

  return (
    <div
      className="flex"
      role={editable ? "slider" : "img"}
      aria-label="Star rating"
      aria-valuemin={editable ? 1 : undefined}
      aria-valuemax={editable ? 5 : undefined}
      aria-valuenow={editable ? rating : undefined}
      aria-readonly={!editable}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star;

        return (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              isFilled ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
            }`}
            onMouseOver={() => handleMouseOver(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
            tabIndex={editable ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          />
        );
      })}
      {/* Screen reader live announcement */}
      {editable && (
        <span className="sr-only" aria-live="polite">
          {rating} out of 5 stars
        </span>
      )}
    </div>
  );
}
