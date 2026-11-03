import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

const CommentsRatingsToggle = ({
  courseId,
  onToggle,
  role = "admin",
  global = false,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const getDetailsEndpoint = () => {
    if (global) return `/admin/toggle-all-comments-status`;
    if (role === "teacher") return `/teacher/course/details/${courseId}`;
    return `/course/details/${courseId}`;
  };

  const getToggleEndpoint = () => {
    if (global) return `/admin/toggle-all-comments`;
    if (role === "teacher")
      return `/teacher/course/toggle-comments/${courseId}`;
    return `/admin/${courseId}/toggle-comments`;
  };

  useEffect(() => {
    const fetchToggleState = async () => {
      try {
        const res = await axiosInstance.get(getDetailsEndpoint());
        const state = global
          ? res.data.commentsEnabled ?? false
          : res.data.course?.commentsEnabled ?? false;

        setEnabled(state);
        onToggle?.(state);
      } catch (error) {
        console.error("Failed to fetch toggle state", error);
        toast.error("Failed to load toggle state");
      } finally {
        setFetching(false);
      }
    };

    fetchToggleState();
  }, [courseId, global, role, onToggle]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.patch(getToggleEndpoint(), {
        enable: !enabled,
      });
      const state = res.data.commentsEnabled;
      setEnabled(state);
      onToggle?.(state);
      toast.success(res.data.message || "Comments & Ratings updated");
    } catch (error) {
      console.error("Failed to update toggle", error);
      toast.error("Failed to update toggle");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-gray-500 my-2" aria-live="polite">
        Loading toggle state...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 my-4">
      <span className="font-medium">
        {global
          ? "Enable Comments & Ratings for All Courses"
          : "Enable Comments & Ratings"}
      </span>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={loading}
        role="switch"
        aria-checked={enabled}
        aria-label={
          global
            ? "Toggle Comments & Ratings for All Courses"
            : "Toggle Comments & Ratings"
        }
        className={`${
          enabled ? "bg-green-500" : "bg-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {loading && (
        <span className="text-sm text-gray-500" aria-live="polite">
          Updating...
        </span>
      )}
    </div>
  );
};

export default CommentsRatingsToggle;
