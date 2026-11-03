import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  Clock,
  Video,
  Lock,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import { format, isValid } from "date-fns";

const StudentMeetingList = () => {
  const { id } = useParams(); // Course ID
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized fetch function to reuse in useEffect and manual refresh
  const fetchMeetings = useCallback(
    async (showLoader = false) => {
      if (showLoader) setIsRefreshing(true);
      try {
        const res = await axiosInstance.get(`/zoom/course/${id}`);
        setMeetings(res.data);
      } catch (err) {
        console.error("Error fetching meetings", err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchMeetings(); // Initial load

    // 🔄 Set up a timer to check for status updates every 15 seconds
    const interval = setInterval(() => {
      fetchMeetings();
    }, 15000);

    return () => clearInterval(interval); // Stop timer when user leaves page
  }, [fetchMeetings]);

  const handleJoin = async (meetingId) => {
    try {
      const res = await axiosInstance.get(`/zoom/join/${meetingId}`);
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Failed to retrieve Zoom URL.");
      }
    } catch (err) {
      console.error("Error joining meeting", err);
      const errMsg = err.response?.data?.message || "Could not join the meeting.";
      alert(errMsg);
      // Refresh meetings to get updated status if meeting has ended
      if (err.response?.data?.status === "ended") {
        fetchMeetings();
      }
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500">Loading schedule...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Video className="text-blue-600" /> Zoom Class Schedule
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <RefreshCw
              size={12}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Auto-updates every 15 seconds
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMeetings(true)}
          >
            Refresh Now
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      {meetings.length === 0 ? (
        <Card className="text-center p-12 bg-gray-50 border-dashed border-2">
          <p className="text-gray-500">
            No Zoom sessions have been scheduled for this course yet.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {meetings.map((m) => (
            <Card
              key={m._id}
              className={`transition-all duration-500 ${m.status === "started" || m.status === "active"
                ? "border-green-500 shadow-md bg-green-50/40 ring-1 ring-green-500"
                : "bg-white"
                }`}
            >
              <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h3 className="font-bold text-lg text-gray-900">
                      {m.topic}
                    </h3>
                    {(m.status === "started" || m.status === "active") && (
                      <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                        • LIVE NOW
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {isValid(new Date(m.scheduledAt))
                        ? format(new Date(m.scheduledAt), "PPP")
                        : "No Date"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {isValid(new Date(m.scheduledAt))
                        ? format(new Date(m.scheduledAt), "p")
                        : "No Time"}
                    </span>
                    {m.duration && (
                      <span className="flex items-center gap-1">
                        Duration: {m.duration} min
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Join Logic: Always allow 'Join Zoom Class' if it's the right time or started? 
                      The user requirement says "Show a generic 'Join Zoom Class' button".
                      I'll show the button. Maybe disable it if status is 'ended'.
                  */}
                  {m.status === "ended" ? (
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 text-sm font-semibold italic">
                        Class Finished
                      </span>
                    </div>
                  ) : (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2 items-center px-6 shadow-lg shadow-blue-200"
                      onClick={() => handleJoin(m._id)}
                    >
                      <PlayCircle size={18} /> Join Zoom Class
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMeetingList;
