import React, { useEffect, useState } from "react";
import { Loader, Star } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

const RatingSectionTeacher = ({ course, id }) => {
  const [hasRated, setHasRated] = useState(false);
  const [courseRating, setCourseRating] = useState();
  const [loading, setLoading] = useState(false);

  const fetchUserRating = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`rating/isRated/${course._id}`);
      setHasRated(res.data);
    } catch (err) {
      console.error(err, "Error fetching user rating");
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
      console.error(err, "Error fetching course rating");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRating();
    fetchCourseRating();
  }, [id]);

  return (
    <section
      aria-label={`Course rating for ${course.title}`}
      className="bg-gray-50 p-6 rounded-lg"
    >
      <h3 className="text-xl font-bold mb-4">Course Ratings</h3>

      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
        {loading ? (
          <Loader className="animate-spin" aria-label="Loading ratings" />
        ) : hasRated && hasRated.rating ? (
          <div
            className="flex items-center"
            aria-label={`You rated this course ${hasRated.star} star${
              hasRated.star > 1 ? "s" : ""
            }`}
          >
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
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            You have not rated this course.
          </p>
        )}
      </div>

      <div
        className="flex items-center gap-2"
        role="img"
        aria-label={`Average course rating: ${
          courseRating?.averageStar?.toFixed(1) || 0
        } out of 5, based on ${courseRating?.count || 0} ratings`}
      >
        <div className="flex">
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
          {courseRating?.averageStar?.toFixed(1) || 0}
        </span>
        <span className="text-gray-500">
          ({courseRating?.count || 0} ratings)
        </span>
      </div>
    </section>
  );
};

export default RatingSectionTeacher;
