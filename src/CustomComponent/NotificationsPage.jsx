import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Video, BellOff, CheckCheck, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleNotificationClick = async (n) => {
    // 1. Mark as read if not already
    if (!n.isRead) {
      try {
        await axiosInstance.put(`/notifications/${n._id}`);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === n._id ? { ...notif, isRead: true } : notif
          )
        );
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }

    // 2. Navigate
    if (n.link) {
      // Fix legacy backend links: live-meeting -> live-list
      const correctedLink = n.link.replace("live-meeting", "live-list");

      if (correctedLink.startsWith("http")) {
        window.location.href = correctedLink;
      } else {
        navigate(correctedLink);
      }
    }
  };


  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications/get");
      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await axiosInstance.put("/notifications/mark-all");
      fetchNotifications();
    } catch (err) {
      alert("Failed to update notifications");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BellOff className="text-gray-400" /> Notification Center
        </h1>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" /> Mark All as Read
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center text-gray-500 font-medium">
              Loading alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <BellOff className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 font-medium">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-5 flex items-start gap-4 transition-colors hover:bg-gray-50 cursor-pointer ${!n.isRead ? "bg-blue-50/20 border-l-4 border-l-blue-500" : ""
                    }`}
                >
                  <div
                    className={`p-3 rounded-xl ${n.type === "live-class"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    <Video size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p
                        className={`text-base ${!n.isRead ? "font-bold text-gray-900" : "text-gray-600"
                          }`}
                      >
                        {n.message}
                      </p>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Area: Join Link vs Ended Status */}
                    <div className="mt-2">
                      {n.isEnded ? (
                        <div className="inline-flex items-center gap-1.5 text-gray-400 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                          <Ban size={14} />
                          <span className="text-xs font-bold uppercase tracking-tight">
                            Meeting Ended
                          </span>
                        </div>
                      ) : (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-600 text-sm font-semibold hover:no-underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(n);
                          }}
                        >
                          Join Meeting Now &rarr;
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;