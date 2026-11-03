import React, { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertCircle, Lock, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

const ForgetPassword = () => {
  const emailFieldId = useId();
  const errorId = useId();
  const helpTextId = useId();
  const formId = useId();
  const headingId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const emailValue = watch("email");

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/forgotPassword", data);
      toast.success(res.data.message || "OTP has been sent to your email");
      navigate(`/forgetPassword/verifyOTP/${data.email}`);
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    }
  };

  const hasError = !!errors.email;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-green-500">
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Lock className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
          </div>
          <h1 id={headingId} className="text-3xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
          aria-labelledby={headingId}
        >
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor={emailFieldId}
              className="font-medium text-gray-700 flex items-center gap-1"
            >
              Email Address
              <span className="text-red-500 font-bold" aria-label="required">
                *
              </span>
            </Label>

            <Input
              id={emailFieldId}
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                hasError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              aria-describedby={`${helpTextId}${hasError ? ` ${errorId}` : ""}`}
              aria-invalid={hasError}
              aria-required="true"
              disabled={isSubmitting}
            />

            {/* Help Text */}
            {!hasError && (
              <p id={helpTextId} className="text-xs text-gray-500">
                We'll send a password reset code to this email address.
              </p>
            )}

            {/* Error Message */}
            {hasError && (
              <div
                id={errorId}
                className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200"
                role="alert"
              >
                <AlertCircle
                  className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-xs text-red-600 font-medium">
                  {errors.email.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-all focus:ring-2 focus:ring-green-700 focus:outline-none focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            aria-label={
              isSubmitting
                ? "Sending reset code..."
                : "Send reset code to email"
            }
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin">⏳</span>
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Send Reset Code</span>
              </div>
            )}
          </Button>

          {/* Additional Help Text */}
          <p className="text-xs text-center text-gray-600">
            Check your email for the reset code. If you don't see it, check your
            spam folder.
          </p>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-green-600 hover:text-green-700 font-medium focus:ring-2 focus:ring-green-500 focus:outline-none rounded px-1"
            >
              Back to login
            </a>
          </p>
        </div>

        {/* Screen Reader Status */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {isSubmitting
            ? "Sending reset code to your email..."
            : hasError
            ? `Form has error: ${errors.email.message}`
            : "Ready to send reset code"}
        </div>
      </div>
    </main>
  );
};

export default ForgetPassword;
