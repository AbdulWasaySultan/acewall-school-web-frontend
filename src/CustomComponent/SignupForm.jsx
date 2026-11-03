import { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonalInfo from "./StudentSignup/PersonalInfo";
import AddressInfo from "./StudentSignup/AddressInfo";
import PasswordInfo from "./StudentSignup/PasswordInfo";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import GoogleRoleSelection from "./GoogleRoleSelection";

const steps = ["Personal Information", "Address Information", "Password Info"];

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    role: z.enum(["student", "teacher"], { required_error: "Role is required" }),
    homeAddress: z.string().optional(),
    mailingAddress: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(/^(?=.*\d)/, "Password must contain at least one number")
      .regex(
        /^(?=.*[#?!@$%^&*-])/,
        "Password must contain at least one special character"
      )
      .regex(/^(?!.*\s).*$/, "Password cannot contain spaces"),
    confirmPassword: z.string(),
    agreeToTerms: z
      .boolean()
      .refine((val) => val, "You must agree to the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleData, setPendingGoogleData] = useState(null);
  const { signUpdata, setSignupData, setAuthLoading, setUser, checkAuth } =
    useContext(GlobalContext);
  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  const { handleSubmit, trigger, watch, setValue } = methods;

  const onSubmit = async (formdata) => {
    // If signUpdata has email/role from previous flow, use it; otherwise use form data
    const completeData = {
      ...formdata,
      ...(signUpdata?.email && { email: signUpdata.email }),
      ...(signUpdata?.role && { role: signUpdata.role }),
    };
    setAuthLoading(true);
    try {
      const res = await axiosInstance.post("auth/register", completeData);
      toast.success(res.data.message);
      navigate(`/verifyOTP/${completeData.email}`);
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleNext = async () => {
    // Base fields for step 0
    let step0Fields = ["firstName", "lastName"];

    // Add email and role to validation if accessed directly (not from multi-step flow)
    if (!signUpdata?.email) step0Fields.push("email");
    if (!signUpdata?.role) step0Fields.push("role");

    const fieldsToValidate = {
      0: step0Fields,
      1: ["homeAddress", "mailingAddress"],
      2: ["password", "confirmPassword", "agreeToTerms"],
    }[currentStep];

    const valid = await trigger(fieldsToValidate);
    if (valid) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  // Handle Google Sign-In success for signup flow
  const handleGoogleSuccess = useCallback(
    async (credentialResponse) => {
      const { credential } = credentialResponse;

      if (!credential) {
        toast.error("Google authentication failed. Please try again.");
        return;
      }

      try {
        // First attempt: try to create account with role from signUpdata if available
        const role = signUpdata?.role;

        const response = await axiosInstance.post("auth/google", {
          token: credential,
          role: role,
        });

        // If successful, user exists or was created with role
        if (response.data.user) {
          toast.success(response.data.message || "Account created successfully!");

          // Store token and update auth
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }
          setUser(response.data.user);
          checkAuth();

          // Redirect based on role
          const userRole = response.data.user.role;
          if (userRole === "teacher") {
            navigate("/teacher");
          } else {
            navigate("/student/mycourses");
          }
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
          const errorMessage =
            error.response?.data?.message ||
            "Google authentication failed. Please try again.";
          toast.error(errorMessage);
        }
      }
    },
    [signUpdata?.role, navigate, setUser, checkAuth]
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

    // Store token and update auth
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    setUser(data.user);
    checkAuth();

    // Redirect based on role
    const { role } = data.user;
    if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student/mycourses");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo />;
      case 1:
        return <AddressInfo />;
      case 2:
        return <PasswordInfo />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Sign Up Button */}
      <div className="mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="large"
          width="100%"
          text="signup_with"
          shape="rectangular"
          logo_alignment="center"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Step Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Step {currentStep + 1} of {steps.length}
          </h2>
          <span className="text-sm text-gray-500">{steps[currentStep]}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          aria-live="polite"
        >
          {renderStep()}

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              type="button"
              className={`text-white bg-gray-500 hover:bg-gray-600 font-medium rounded-lg text-sm px-6 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors ${
                currentStep === 0 ? "invisible" : ""
              }`}
            >
              ← Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={!watch("agreeToTerms")}
                className={`text-white font-medium rounded-lg text-sm px-8 py-3 ${
                  watch("agreeToTerms")
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors`}
              >
                Create Account
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-8 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </FormProvider>

      <p className="text-sm text-gray-500 text-center mt-6 pt-4 border-t border-gray-200">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-green-600 hover:text-green-700 hover:underline"
        >
          Login here
        </Link>
      </p>

      {/* Google Role Selection Modal */}
      <GoogleRoleSelection
        isOpen={showRoleModal}
        onClose={handleRoleModalClose}
        googleData={pendingGoogleData}
        onSuccess={handleRoleSuccess}
      />
    </div>
  );
};

export default SignupForm;
