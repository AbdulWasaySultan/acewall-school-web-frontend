import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/AxiosInstance';
import { format } from 'date-fns';
import { Video, Calendar as CalendarIcon, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GlobalCalendarPage = () => {
  const [globalMeetings, setGlobalMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMeetings = async () => {
      try {
        // Assuming the backend provides a global Zoom schedule at this endpoint
        const res = await axiosInstance.get('/zoom/course/all');
        setGlobalMeetings(res.data);
      } catch (err) {
        console.error("Error fetching global schedule", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMeetings();
  }, []);

  const handleJoin = async (meetingId) => {
    try {
      const res = await axiosInstance.get(`/zoom/join/${meetingId}`);
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert("Could not join meeting.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Video className="text-blue-600" /> Global Zoom Class Schedule
      </h2>
      <div className="grid gap-4">
        {loading ? (
          <p>Loading schedule...</p>
        ) : globalMeetings.length === 0 ? (
          <p className="text-gray-500">No scheduled meetings found.</p>
        ) : (
          globalMeetings.map((m) => (
            <div key={m._id} className="p-4 border rounded bg-white flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-lg text-gray-900">{m.topic}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(m.scheduledAt), "PPPP 'at' p")}
                </p>
                <p className="text-xs text-blue-600 mt-1">Duration: {m.duration} mins</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleJoin(m._id)}
                >
                  <PlayCircle size={16} className="mr-2" /> Join
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GlobalCalendarPage;