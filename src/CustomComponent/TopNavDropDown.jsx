import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { GlobalContext } from "@/Context/GlobalProvider";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import avatar from "../assets/avatar.png";
import { Bell, Video, Circle } from "lucide-react";

export function TopNavbarDropDown({ selected, setselected }) {
  const { checkAuth, logout, UpdatedUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications/get");
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.isRead);

      // Optional: Logic to show a toast for a brand new live class alert
      if (unread.length > unreadCount && res.data[0]?.type === "live-class") {
        toast.info(`Live Class Started: ${res.data[0].message}`, {
          action: {
            label: "Join Now",
            onClick: () => navigate(res.data[0].link),
          },
        });
      }

      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [unreadCount]);

  const handleLogout = async () => {
    try {
      await logout();
      await checkAuth();
      toast.success("Logged out successfully");
      location.reload();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const tabs = [
    { id: 9, title: "Account", path: "/student/account" },
    { id: 10, title: "All Notifications", path: "/student/notifications" },
  ];

  return (
    <div className="flex items-center space-x-4">
      {/* --- NOTIFICATION BELL --- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-white" align="end">
          <div className="p-3 border-b font-bold text-gray-800 flex justify-between items-center">
            <span>Notifications</span>
            <Link
              to="/student/notifications"
              className="text-[10px] text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No new alerts
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <DropdownMenuItem
                  key={n._id}
                  className="p-3 flex items-start gap-3 cursor-pointer border-b last:border-0"
                  onClick={() => navigate(n.link)}
                >
                  <div
                    className={`mt-1 p-1.5 rounded-full ${
                      n.type === "live-class"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Video size={14} />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-xs ${
                        !n.isRead ? "font-bold text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">Just now</p>
                  </div>
                  {!n.isRead && (
                    <Circle
                      size={8}
                      className="fill-blue-500 text-blue-500 mt-2"
                    />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- USER PROFILE DROPDOWN --- */}
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
        >
          <button className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={UpdatedUser?.profileImg?.url || avatar}
                alt={`${UpdatedUser?.firstName || "User"}'s avatar`}
              />
              <AvatarFallback className="bg-black text-white font-bold text-sm">
                {UpdatedUser?.firstName?.[0] || "N/A"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium hidden md:inline">
              {UpdatedUser?.firstName || "N/A"}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 bg-white" align="end">
          {tabs.map((tab, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link
                to={tab.path}
                className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
                  selected === tab.id
                    ? "bg-green-500 text-white"
                    : "text-gray-900"
                }`}
              >
                {tab.title}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem asChild>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
