import { Link } from "react-router-dom";
import acewallshort from "../../assets/acewallshort.png";
import Footer from "@/CustomComponent/Footer";
import { useContext, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Eye, EyeClosed } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import ReviewsSlider from "@/CustomComponent/LoginComponent/ReviewsSlider";
import { useLoginLimiter } from "@/hooks/useLoginLimiter";

// Validation Schema using Zod
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

const parentLogin = () => {
  const { login, checkAuth } = useContext(GlobalContext);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLocked, timeLeft, recordFailedAttempt, resetAttempts } = useLoginLimiter("login-limiter");

  // React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    if (isLocked) return;
    try {
      setLoading(true);
      await axiosInstance
        .post("auth/loginGuardianAcc", {
          guardianEmail: formData.email,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          toast.success(res.data.message);
          resetAttempts();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error(
            err?.response?.data?.message || "Login failed. Please try again."
          );
          recordFailedAttempt();
        });

      setLoginError("");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      console.error(errorMessage);
      setLoginError(errorMessage);
      recordFailedAttempt();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            aria-label="Return to homepage"
            className="text-sm md:text-base"
          >
            Return to Home
          </Link>

          <Link
            to="/home"
            aria-label="Create an account"
            className="text-sm md:text-base"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1
            className="text-center text-2xl md:text-3xl text-gray-800 font-normal mb-8"
            id="Parent-login-heading"
          >
            Parent Login Page
          </h1>

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            {/* Login Form */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-lg">
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-labelledby="Parent-login-heading"
              >
                {isLocked && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-medium text-center">
                    Too many failed login attempts. Login disabled. Please wait{" "}
                    <span className="font-bold underline">{timeLeft} seconds</span> before trying again.
                  </div>
                )}
                {/* Email Field */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-600 mb-2">
                    Email *
                  </label>

                  <input
                    type="email"
                    id="email"
                    disabled={isLocked}
                    className={`w-full p-2 border border-gray-300 rounded ${isLocked ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />

                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-xs text-red-600 inline-block"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {loginError && (
                  <p className="text-sm text-red-500 mb-4" role="alert">
                    {loginError}
                  </p>
                )}

                {/* Buttons and Links */}
                <div className="space-y-12">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/TeacherLogin"
                          className="text-sm font-semibold text-green-600 hover:underline"
                          aria-label="Login as a Teacher"
                        >
                          Login as a Teacher
                        </Link>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/Login"
                          className="text-sm font-semibold text-green-600 hover:underline"
                          aria-label="Login as a Teacher"
                        >
                          Login as a Student
                        </Link>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLocked}
                      className={`bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2 rounded transition-colors duration-200 ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Testimonials */}
            <ReviewsSlider />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default parentLogin;
