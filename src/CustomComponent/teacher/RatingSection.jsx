import { axiosInstance } from "@/lib/AxiosInstance";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

const RatingSection = ({ courseId }) => {
  const [courseRating, setCourseRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseRating = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/rating/course/${courseId}`);
        console.log(response);
        setCourseRating(response.data);
      } catch (err) {
        console.log(err);
        setError("No Rating found for this course.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseRating();
  }, [courseId]);

  const averageRating = courseRating?.averageStar || 0;
  const roundedRating = Math.round(averageRating);
  const ratingCount = courseRating?.count || 0;

  return (
    <section className="my-10" aria-labelledby="rating-heading">
      <h2 id="rating-heading" className="text-lg font-medium mb-4">
        Overall Course Rating
      </h2>
      <div
        className="bg-green-50 p-8 rounded-lg flex flex-col items-center"
        role="region"
        aria-label="Course rating information"
      >
        {isLoading ? (
          <div
            className="text-lg font-medium text-gray-500"
            role="status"
            aria-live="polite"
          >
            Loading ratings...
          </div>
        ) : error ? (
          <div
            className="text-lg font-medium text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        ) : courseRating && ratingCount > 0 ? (
          <>
            <div
              className="text-5xl font-semibold mb-4"
              aria-label={`Average rating: ${averageRating.toFixed(
                1
              )} out of 5 stars`}
            >
              {averageRating.toFixed(1)}
            </div>
            <div
              className="flex items-center gap-1 mb-2"
              role="img"
              aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= roundedRating;
                return (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      isFilled
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
            <div className="text-sm text-muted-foreground" role="status">
              <span
                aria-label={`Based on ${ratingCount} ${
                  ratingCount === 1 ? "rating" : "ratings"
                }`}
              >
                ({ratingCount} {ratingCount === 1 ? "Rating" : "Ratings"})
              </span>
            </div>
          </>
        ) : (
          <div className="text-lg font-medium text-gray-500" role="status">
            No ratings available
          </div>
        )}
      </div>
    </section>
  );
};

export default RatingSection;
