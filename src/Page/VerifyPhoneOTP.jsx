import React, { useState, useRef, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Loader } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";

const VerifyPhoneOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const { email } = useParams();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(Date.now() + 10 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(10 * 60 * 1000);
  const [cooldown, setCooldown] = useState(0);
  const { setUser, checkAuth } = useContext(GlobalContext);
  const navigate = useNavigate();

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(otpExpiresAt - Date.now(), 0);
      setTimeLeft(diff);
      if (diff === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
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

    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please resend.");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("auth/verifyPhoneOTP", {
        email,
        otp: enteredOtp,
      });
      setUser(res.data.user);
      setLoading(false);
      toast.success(res.data.message);
      checkAuth();
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setResendLoading(true);
    setCooldown(60);

    try {
      const res = await axiosInstance.post("auth/resendPhoneOTP", { email });
      toast.success(res.data.message);

      const expiresAt = Date.now() + 10 * 60 * 1000;
      setOtpExpiresAt(expiresAt);
      setTimeLeft(10 * 60 * 1000);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      role="main"
    >
      <div
        className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center space-y-6"
        role="form"
        aria-labelledby="verify-heading"
      >
        <div>
          <div className="flex justify-center items-center gap-2">
            <Key aria-hidden="true" />
            <h1
              id="verify-heading"
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Verify OTP
            </h1>
          </div>

          <p className="text-gray-600">
            We have sent a 6-digit OTP to your phone number.
          </p>
        </div>

        {/* Live Region for Countdown */}
        <p
          className="text-sm text-gray-500"
          role="status"
          aria-live="polite"
          id="otp-countdown"
        >
          {timeLeft > 0 ? (
            <>
              OTP expires in{" "}
              <span className="font-semibold text-gray-800">
                {formatTime(timeLeft)}
              </span>
            </>
          ) : (
            <span className="text-red-500">
              OTP has expired. Please resend.
            </span>
          )}
        </p>

        {/* OTP Input Fields */}
        <div
          className="flex justify-center gap-2"
          aria-label="6-digit OTP input fields"
          role="group"
        >
          {otp.map((digit, idx) => (
            <div key={idx}>
              <label htmlFor={`otp-${idx}`} className="sr-only">
                OTP Digit {idx + 1}
              </label>

              <Input
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                aria-required="true"
                aria-describedby="otp-help"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="w-12 h-12 text-center text-lg font-bold border-gray-300 focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>

        <p id="otp-help" className="text-sm text-gray-500">
          Enter each OTP digit in the boxes above.
        </p>

        {/* Submit Button */}
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={handleSubmit}
          disabled={loading || otp.join("").length < 6 || timeLeft <= 0}
          aria-disabled={loading || otp.join("").length < 6 || timeLeft <= 0}
          aria-label="Verify OTP"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" aria-hidden="true" />
              Verifying…
            </span>
          ) : (
            "Verify"
          )}
        </Button>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          className="text-sm text-blue-600 underline focus:outline-green-600"
          disabled={resendLoading || cooldown > 0}
          aria-disabled={resendLoading || cooldown > 0}
          aria-label="Resend OTP"
        >
          {resendLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin mr-2" aria-hidden="true" />
              Resending…
            </span>
          ) : cooldown > 0 ? (
            `Resend OTP in ${cooldown}s`
          ) : (
            "Resend OTP"
          )}
        </button>
      </div>
    </main>
  );
};

export default VerifyPhoneOTP;
