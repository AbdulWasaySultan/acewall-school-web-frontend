import { useState, useCallback } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import GoogleRoleSelection from "./GoogleRoleSelection";

const GoogleAuthButton = ({ onSuccess, buttonText = "Continue with Google" }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleData, setPendingGoogleData] = useState(null);

  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      const { credential } = credentialResponse;

      if (!credential) {
        toast.error("Google authentication failed. Please try again.");
        return;
      }

      try {
        // First attempt: try to login without role (for existing users)
        const response = await axiosInstance.post("auth/google", {
          token: credential,
        });

        // If successful, user exists - proceed with login
        if (response.data.user) {
          toast.success(response.data.message || "Login successful!");
          onSuccess(response.data);
        }
      } catch (error) {
        // Check if the error is because user needs to select a role
        if (error.response?.data?.requiresRole) {
          const { email, name, picture, googleId } = error.response.data;
          setPendingGoogleData({
            token: credential,
            email,
            name,
            picture,
            googleId,
          });
          setShowRoleModal(true);
        } else {
          // Other error
          const errorMessage =
            error.response?.data?.message ||
            "Google authentication failed. Please try again.";
          toast.error(errorMessage);
        }
      }
    },
    [onSuccess]
  );

  const handleGoogleError = useCallback(() => {
    toast.error("Google authentication failed. Please try again.");
  }, []);

  const handleRoleModalClose = () => {
    setShowRoleModal(false);
    setPendingGoogleData(null);
  };

  const handleRoleSuccess = (data) => {
    setShowRoleModal(false);
    setPendingGoogleData(null);
    onSuccess(data);
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text={buttonText}
        shape="rectangular"
        logo_alignment="center"
      />

      <GoogleRoleSelection
        isOpen={showRoleModal}
        onClose={handleRoleModalClose}
        googleData={pendingGoogleData}
        onSuccess={handleRoleSuccess}
      />
    </>
  );
};

export default GoogleAuthButton;
