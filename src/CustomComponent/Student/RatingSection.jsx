import React, { useContext, useEffect, useState } from "react";
import { Loader, Star } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import { GlobalContext } from "@/Context/GlobalProvider";

const RatingSection = ({ course, id }) => {
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [courseRating, setCourseRating] = useState();
  const [loading, setLoading] = useState(false);

  const { user } = useContext(GlobalContext);

  const fetchUserRating = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`rating/isRated/${course._id}`);
      setHasRated(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseRating = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`rating/course/${course._id}`);
      setCourseRating(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRating();
    fetchCourseRating();
  }, [id]);

  const handleRatingSubmit = async (rating) => {
    if (hasRated) {
      toast.error("You have already rated this course.");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post(`rating/create/${course._id}`, {
        star: rating,
      });
      toast.success(res.data.message);
      setUserRating(rating);
      setHasRated(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label={`Rate the course ${course.title}`}
      className={`bg-gray-50 p-6 rounded-lg relative ${
        user?.role === "teacherAsStudent"
          ? "opacity-50 pointer-events-none"
          : ""
      }`}
    >
      <h3 className="text-xl font-bold mb-4">Rate this course</h3>

      {user?.role === "teacherAsStudent" && (
        <p className="absolute text-sm text-red-500 mb-2">
          You are not allowed to rate your own course.
        </p>
      )}

      <div
        className="flex flex-col sm:flex-row items-start sm:items-center"
        role="radiogroup"
        aria-label="Course rating stars"
      >
        {loading ? (
          <Loader className="animate-spin" aria-label="Loading ratings" />
        ) : hasRated && hasRated.rating ? (
          <>
            {[...Array(hasRated.star)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-500 text-yellow-500"
                aria-hidden="true"
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              You rated this course {hasRated.star} star
              {hasRated.star > 1 ? "s" : ""}
            </span>
          </>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingSubmit(star)}
                disabled={loading}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                className={`h-6 w-6 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  star <= userRating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                <Star className="h-6 w-6" />
              </button>
            ))}
            <p className="text-sm text-gray-500 ml-4">
              {userRating > 0 ? "Thanks for rating!" : "Click a star to rate"}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div
          className="flex"
          role="img"
          aria-label={`Average course rating: ${courseRating?.averageStar?.toFixed(
            1
          )} out of 5`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(courseRating?.averageStar)
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-300"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="font-medium">
          {courseRating?.averageStar?.toFixed(1)}
        </span>
        <span className="text-gray-500">({courseRating?.count} ratings)</span>
      </div>
    </section>
  );
};

export default RatingSection;
