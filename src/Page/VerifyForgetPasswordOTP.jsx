import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Loader } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const VerifyForgetPasswordOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const { email } = useParams();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("auth/verifyForgotPassOTP", {
        email,
        otp: enteredOtp,
      });
      toast.success(res.data.message);
      navigate(`/forgetPassword/resetPassword/${email}`);
    } catch (err) {
      console.error(err);
      setOtp(["", "", "", "", "", ""]);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await axiosInstance.post("auth/resendOTP", { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4">
      <div
        className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center space-y-6"
        role="form"
        aria-labelledby="otp-heading"
      >
        <div>
          <div className="flex justify-center items-center gap-2">
            <Key />
            <h1
              id="otp-heading"
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Verify OTP
            </h1>
          </div>
          <p className="text-gray-600">
            We have sent a 6-digit OTP to your email: <strong>{email}</strong>
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {otp.map((digit, idx) => (
            <Input
              key={idx}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12 h-12 text-center text-lg font-bold border-gray-300 focus:ring-2 focus:ring-green-400"
              aria-label={`OTP digit ${idx + 1}`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-500">
          Didn’t receive an OTP? Please check your email address.
        </p>

        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={handleSubmit}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" />
              Verifying
            </span>
          ) : (
            "Verify"
          )}
        </Button>

        <button
          onClick={handleResend}
          className="text-sm text-blue-600 underline"
          disabled={resendLoading}
          aria-busy={resendLoading}
        >
          {resendLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" />
              Resending
            </span>
          ) : (
            "Resend OTP"
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyForgetPasswordOTP;
