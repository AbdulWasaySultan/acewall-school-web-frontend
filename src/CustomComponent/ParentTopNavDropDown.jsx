import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { toast } from "sonner";
import avatar from "../assets/avatar.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ParentTopNavbarDropDown() {
  const { UpdatedUser, checkAuth, logout } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      await checkAuth();
      // Using navigate instead of reload is usually cleaner in SPA,
      // but keeping logic consistent with your requirement
      window.location.href = "/";
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label="User menu">
        <button className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded p-1 transition-colors">
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
        className="w-48 bg-white mt-2 shadow-lg border border-gray-200"
        align="end"
      >
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 px-4 py-2 font-medium"
        >
          Logout
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={()=> navigate("/parent")}
          className="cursor-pointer text-blue-600 focus:bg-blue-50 focus:text-blue-700 px-4 py-2 font-medium"
        >
          Switch Child
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
