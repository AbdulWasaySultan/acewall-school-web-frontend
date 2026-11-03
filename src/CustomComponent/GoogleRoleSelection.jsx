import { useState } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import { GraduationCap, UserCircle, X } from "lucide-react";

const GoogleRoleSelection = ({
  isOpen,
  onClose,
  googleData,
  onSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !googleData) return null;

  const handleRoleSelect = async (role) => {
    if (isLoading) return;

    setSelectedRole(role);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("auth/google", {
        token: googleData.token,
        role: role,
      });

      if (response.data.user) {
        toast.success(response.data.message || "Account created successfully!");
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Google signup error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create account. Please try again.";
      toast.error(errorMessage);
      setSelectedRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome!</h2>
          <p className="text-green-100 mt-2">
            {googleData.email}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 text-center mb-6">
            Select your role to complete your registration
          </p>

          {/* Role Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Student Card */}
            <button
              onClick={() => handleRoleSelect("student")}
              disabled={isLoading}
              className={`group relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === "student"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  selectedRole === "student"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                }`}
              >
                <GraduationCap size={28} />
              </div>
              <span
                className={`font-semibold ${
                  selectedRole === "student" ? "text-green-700" : "text-gray-700"
                }`}
              >
                Student
              </span>
              <span className="text-xs text-gray-500 mt-1 text-center">
                Access courses and learn
              </span>

              {isLoading && selectedRole === "student" && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>

            {/* Teacher Card */}
            <button
              onClick={() => handleRoleSelect("teacher")}
              disabled={isLoading}
              className={`group relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === "teacher"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  selectedRole === "teacher"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                }`}
              >
                <UserCircle size={28} />
              </div>
              <span
                className={`font-semibold ${
                  selectedRole === "teacher" ? "text-green-700" : "text-gray-700"
                }`}
              >
                Teacher
              </span>
              <span className="text-xs text-gray-500 mt-1 text-center">
                Create and manage courses
              </span>

              {isLoading && selectedRole === "teacher" && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            You can only select your role once. Choose carefully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleRoleSelection;
