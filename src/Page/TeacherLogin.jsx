import { Link } from "react-router-dom";
import acewallshort from "../assets/acewallshort.png";
import Footer from "@/CustomComponent/Footer";
import { useContext, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Eye, EyeClosed } from "lucide-react";
import { useLoginLimiter } from "@/hooks/useLoginLimiter";

// Validation Schema using Zod
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const TeacherLogin = () => {
  const { login, checkAuth } = useContext(GlobalContext);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const watchedPassword = watch("password");

  const onSubmit = async (formData) => {
    if (isLocked) return;
    try {
      await login(formData);
      setLoginError("");
      resetAttempts();
      checkAuth();
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
          <Link to="/" aria-label="Return to homepage" className="text-sm md:text-base">
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
            id="teacher-login-heading"
          >
            Teacher Login Page
          </h1>

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            {/* Login Form */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-lg">
              {/* Clever Login */}


          

              <form onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="teacher-login-heading">
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
                    <p id="email-error" className="text-xs text-red-600 inline-block">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-8">
                  <label htmlFor="password" className="block text-gray-600 mb-2">
                    Password *
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      disabled={isLocked}
                      className={`w-full p-2 border border-gray-300 rounded pr-10 ${isLocked ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      {...register("password")}
                    />

                    {watchedPassword && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                      </button>
                    )}
                  </div>

                  {errors.password && (
                    <p id="password-error" className="text-xs text-red-600 inline-block">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login Error */}
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
                          to="/Login"
                          className="text-sm font-semibold text-green-600 hover:underline"
                          aria-label="Login as a Teacher"
                        >
                          Login as a Student
                        </Link>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/ParentLogin"
                          className="text-sm font-semibold text-green-600 hover:underline"
                          aria-label="Login as a Teacher"
                        >
                          Login as a Parent
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

                  <div className="text-right">
                    <Link
                      to="/forgetPassword"
                      className="text-xs font-semibold text-green-600 hover:underline"
                      aria-label="Forgot your password? Reset it"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </form>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-2 text-sm text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div className="mb-6">
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    const clientId = import.meta.env.VITE_CLEVER_CLIENT_ID;
                    const districtId = import.meta.env.VITE_CLEVER_DISTRICT_ID;
                    const redirectUri = encodeURIComponent(import.meta.env.VITE_CLEVER_REDIRECT_URI);

                    // Instant Login URL (bypasses district picker)
                    window.location.href = `https://clever.com/oauth/instant-login?client_id=${clientId}&district_id=${districtId}&redirect_uri=${redirectUri}`;
                  }}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-label="Login with Clever"
                >
                  Login with Clever
                </button>


                <p className="text-xs text-gray-500 text-center mt-2">
                  District teachers must login using Clever.
                </p>
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32">
                  <img src={acewallshort} alt="Acewall Scholars logo" />
                </div>
              </div>

              <h2 className="text-xl text-gray-800 font-medium mb-2 text-center md:text-left">
                Teachers Love Acewall Scholars
              </h2>

              <blockquote className="text-gray-600 mb-4 text-center md:text-left">
                "This is one of the best Learning Management Platforms. Their support team is
                top-notch. The platform also supports various integrations as resources for
                classroom setup. I really enjoy making residual income from the classes I
                create."
              </blockquote>

              <div className="text-center md:text-left">
                <p className="font-medium text-gray-800">- Regina</p>
                <p className="text-gray-600 font-medium">Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TeacherLogin;
