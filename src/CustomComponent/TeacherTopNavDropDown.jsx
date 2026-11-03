import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { toast } from "sonner";
import avatar from "../assets/avatar.png";

export function TeacherTopNavbarDropDown({ selected, setselected }) {
  const { UpdatedUser, checkAuth, logout } = useContext(GlobalContext);
  const navigate = useNavigate();

  const tabs = [
    {
      id: 9,
      title: "Account",
      path: "/teacher/account",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      await checkAuth();
      location.reload();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handlePreview = async () => {
    try {
      await axiosInstance.post("auth/previewSignIn");
      await checkAuth();
      navigate("/student/mycourses");
    } catch (error) {
      console.error("Preview signin failed:", error);
      toast.error("Preview as student failed. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label="User menu" aria-haspopup="true">
        <button className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={UpdatedUser?.profileImg?.url || avatar}
              alt={`${UpdatedUser?.firstName || "User"}'s avatar`}
            />
            <AvatarFallback>
              <img src={avatar} alt="Fallback avatar" />
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-medium">
            {UpdatedUser?.firstName || "User"}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-white"
        role="menu"
        aria-label="User dropdown menu"
      >
        {tabs.map((tab, index) => (
          <DropdownMenuItem
            key={index}
            asChild
            role="menuitem"
            aria-current={selected === tab.id ? "page" : undefined}
          >
            <Link
              to={tab.path}
              className={`block w-full text-left px-4 py-2 rounded focus:outline-none focus:bg-green-100 ${
                selected === tab.id
                  ? "bg-green-500 text-white"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.title}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem asChild role="menuitem">
          <button
            onClick={handlePreview}
            className="w-full text-left px-4 py-2 rounded text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-green-100"
          >
            Preview as student
          </button>
        </DropdownMenuItem>

        <DropdownMenuItem asChild role="menuitem">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-green-100"
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
