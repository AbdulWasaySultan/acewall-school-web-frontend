import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PasswordlessLogin = () => {
  const [status, setStatus] = useState("verifying"); // 'verifying', 'error', 'success'
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");
  const { checkAuth } = useContext(GlobalContext);

  const fetchPasswordlessLogin = async () => {
    if (!token) {
      setStatus("error");
      return;
    }

    try {
      const res = await new Promise(async (resolve) =>
        setTimeout(
          resolve,
          2000,
          await axiosInstance.post("auth/verifyPasswordlessLogin", {
            token,
          })
        )
      );
      checkAuth();
      setStatus("success");
      // Small delay so the user sees the "Success" state before redirecting
      setTimeout(() => navigate("/parent"), 1500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchPasswordlessLogin();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h1 className="text-xl font-medium text-gray-800">
              Verifying your link
            </h1>
            <p className="text-sm text-gray-500">
              This will only take a moment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h1 className="text-xl font-medium text-gray-800">
              Authenticated!
            </h1>
            <p className="text-sm text-gray-500">
              Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl font-medium text-gray-800">Link Invalid</h1>
            <p className="text-sm text-gray-500">
              The login link is expired or has already been used.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordlessLogin;
