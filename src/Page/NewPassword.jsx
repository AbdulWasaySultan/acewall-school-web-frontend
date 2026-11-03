import React, { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(
      /[#?!@$%^&*-]/,
      "Password must contain at least one special character (#?!@$%^&*-)"
    ),
});

const NewPassword = () => {
  const passwordFieldId = useId();
  const errorId = useId();
  const rulesId = useId();
  const rulesHeadingId = useId();
  const toggleButtonId = useId();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const { email } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password") || "";

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/resetPassword", {
        newPassword: data.password,
        email,
      });
      toast.success(res.data.message || "Password updated successfully");
      navigate("/login");
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    }
  };

  // Password condition checks
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[#?!@$%^&*-]/.test(password);
  const isPasswordValid =
    isMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

  const getPasswordRuleClass = (condition) =>
    `flex items-center gap-2 text-sm font-medium ${
      condition ? "text-green-600" : "text-gray-600"
    }`;

  const hasError = !!errors.password;

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12"
      role="main"
    >
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200 focus-within:ring-2 focus-within:ring-green-500">
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
            aria-label="Reset password form"
          >
            {/* Heading */}
            <div>
              <h1 className="text-3xl font-bold text-center text-gray-900">
                Reset Your Password
              </h1>
              <p className="text-center text-sm text-gray-600 mt-2">
                Create a strong password to secure your account
              </p>
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <Label
                htmlFor={passwordFieldId}
                className="block text-sm font-medium text-gray-700 flex items-center gap-1"
              >
                New Password
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </Label>

              <div className="relative">
                <Input
                  id={passwordFieldId}
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your new password"
                  className={`pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    hasError ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-describedby={`${rulesId}${
                    hasError ? ` ${errorId}` : ""
                  }`}
                  aria-invalid={hasError}
                  aria-required="true"
                  disabled={isSubmitting}
                />

                {/* Show/Hide Password Button */}
                <button
                  id={toggleButtonId}
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {hasError && (
                <div
                  id={errorId}
                  className="flex items-start gap-2 p-3 bg-red-50 rounded border border-red-200"
                  role="alert"
                >
                  <AlertCircle
                    className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-red-600 font-medium">
                    {errors.password.message}
                  </p>
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <fieldset className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <legend
                id={rulesHeadingId}
                className="text-sm font-semibold text-gray-900 mb-3"
              >
                Password Requirements
              </legend>

              <div
                className="space-y-2"
                aria-labelledby={rulesHeadingId}
                role="group"
              >
                <div
                  className={getPasswordRuleClass(isMinLength)}
                  aria-current={isMinLength ? "true" : "false"}
                >
                  {isMinLength ? (
                    <CheckCircle2
                      size={16}
                      className="text-green-600 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>Minimum 8 characters</span>
                </div>

                <div
                  className={getPasswordRuleClass(hasUppercase)}
                  aria-current={hasUppercase ? "true" : "false"}
                >
                  {hasUppercase ? (
                    <CheckCircle2
                      size={16}
                      className="text-green-600 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>

                <div
                  className={getPasswordRuleClass(hasLowercase)}
                  aria-current={hasLowercase ? "true" : "false"}
                >
                  {hasLowercase ? (
                    <CheckCircle2
                      size={16}
                      className="text-green-600 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>At least one lowercase letter (a-z)</span>
                </div>

                <div
                  className={getPasswordRuleClass(hasDigit)}
                  aria-current={hasDigit ? "true" : "false"}
                >
                  {hasDigit ? (
                    <CheckCircle2
                      size={16}
                      className="text-green-600 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>At least one digit (0-9)</span>
                </div>

                <div
                  className={getPasswordRuleClass(hasSpecialChar)}
                  aria-current={hasSpecialChar ? "true" : "false"}
                >
                  {hasSpecialChar ? (
                    <CheckCircle2
                      size={16}
                      className="text-green-600 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>At least one special character (#?!@$%^&*-)</span>
                </div>
              </div>
            </fieldset>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isPasswordValid}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all focus:ring-2 focus:ring-green-700 focus:outline-none focus:ring-offset-2 ${
                isSubmitting || !isPasswordValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              aria-busy={isSubmitting}
              aria-label={
                isSubmitting
                  ? "Updating password..."
                  : "Update and reset password"
              }
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block">⏳</span>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>

            {/* Password Strength Status for Screen Readers */}
            <div
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              id={rulesId}
            >
              Password strength:
              {isPasswordValid
                ? "Strong. All requirements met."
                : `${
                    [
                      !isMinLength && "Minimum 8 characters",
                      !hasUppercase && "uppercase letter",
                      !hasLowercase && "lowercase letter",
                      !hasDigit && "digit",
                      !hasSpecialChar && "special character",
                    ]
                      .filter(Boolean)
                      .join(", ") || "Checking requirements"
                  }`}
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default NewPassword;
