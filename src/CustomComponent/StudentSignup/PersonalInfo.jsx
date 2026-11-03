import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useContext } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";

const PersonalInfo = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { signUpdata } = useContext(GlobalContext);
  const formData = watch();

  // Show email/role fields when accessed directly (not from multi-step flow)
  const showEmailField = !signUpdata?.email;
  const showRoleField = !signUpdata?.role;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label
            htmlFor="firstName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            First Name <span className="text-red-600">*</span>
          </Label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            maxLength={15}
            placeholder="John"
            {...register("firstName")}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="h-4 mt-1">
            {errors?.firstName && (
              <p className="text-xs text-red-600">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="middleName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Middle Name
          </Label>
          <Input
            type="text"
            name="middleName"
            id="middleName"
            maxLength={15}
            placeholder="M."
            {...register("middleName")}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="h-4 mt-1">
            {errors?.middleName && (
              <p className="text-xs text-red-600">
                {errors.middleName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="lastName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Last Name <span className="text-red-600">*</span>
          </Label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            maxLength={15}
            placeholder="Doe"
            {...register("lastName")}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="h-4 mt-1">
            {errors?.lastName && (
              <p className="text-xs text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email field - shown when accessed directly */}
        {showEmailField && (
          <div className="mb-6">
            <Label htmlFor="email">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
            />
            <div className="h-4 mt-1">
              {errors?.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Role selection - shown when accessed directly */}
        {showRoleField && (
          <div className="mb-6">
            <Label htmlFor="role">
              Role <span className="text-red-600">*</span>
            </Label>
            <select
              id="role"
              {...register("role")}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <div className="h-4 mt-1">
              {errors?.role && (
                <p className="text-xs text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PersonalInfo;