"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useState } from "react";
import { Loader, Mail, Phone, MapPin } from "lucide-react";
import BackButton from "./BackButton";

export default function FeaturedContantCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await axiosInstance.post(
        "contact/sendSchoolcontactmail",
        data
      );
      setSuccessMessage("✅ Your request has been sent successfully!");
    } catch (err) {
      setErrorMessage("❌ Error submitting form. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-green-50 to-white min-h-screen flex flex-col items-center relative">
      {/* Back button fixed at top-left */}
      <div className="absolute top-6 left-6">
        <BackButton />
      </div>

      {/* Header Section */}
      <div className="max-w-3xl text-center py-12 px-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Get in Touch With Us
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          We’d love to hear from you! Whether you’re a school looking to
          streamline your learning process, or have questions about our LMS, our
          team is here to help.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-6 mb-12">
        <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
          <Mail className="h-8 w-8 text-green-600 mb-3" />
          <p className="font-semibold">Email Us</p>
          <span className="text-gray-600 text-sm">
            support@acewallscholars.org
          </span>
        </div>
        <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
          <Phone className="h-8 w-8 text-green-600 mb-3" />
          <p className="font-semibold">Call Us</p>
          <span className="text-gray-600 text-sm">(855) 522-3925</span>
        </div>
        <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
          <MapPin className="h-8 w-8 text-green-600 mb-3" />
          <p className="font-semibold">Visit Us</p>
          <span className="text-gray-600 text-sm">
            Powhatan, VA 23139, United States
          </span>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Contact Information
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          noValidate
        >
          {/* Organization Name */}
          <div>
            <label htmlFor="organization" className="block font-medium">
              Organization Name
            </label>
            <input
              id="organization"
              {...register("organization", {
                required: "Organization name is required",
              })}
              aria-invalid={errors.organization ? "true" : "false"}
              aria-describedby="organization-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter organization name"
            />
            {errors.organization && (
              <p
                id="organization-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.organization.message}
              </p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label htmlFor="contactPerson" className="block font-medium">
              Contact Person
            </label>
            <input
              id="contactPerson"
              {...register("contactPerson", {
                required: "Contact person is required",
              })}
              aria-invalid={errors.contactPerson ? "true" : "false"}
              aria-describedby="contactPerson-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter contact person name"
            />
            {errors.contactPerson && (
              <p
                id="contactPerson-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.contactPerson.message}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label htmlFor="contactNumber" className="block font-medium">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              {...register("contactNumber", {
                required: "Contact number is required",
              })}
              aria-invalid={errors.contactNumber ? "true" : "false"}
              aria-describedby="contactNumber-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter contact number"
            />
            {errors.contactNumber && (
              <p
                id="contactNumber-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block font-medium">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              {...register("contactEmail", {
                required: "Email is required",
              })}
              aria-invalid={errors.contactEmail ? "true" : "false"}
              aria-describedby="contactEmail-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter contact email"
            />
            {errors.contactEmail && (
              <p
                id="contactEmail-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          {/* No of Teachers */}
          <div>
            <label htmlFor="teachers" className="block font-medium">
              No. of Teachers
            </label>
            <input
              type="number"
              id="teachers"
              {...register("teachers", {
                required: "Number of teachers is required",
              })}
              aria-invalid={errors.teachers ? "true" : "false"}
              aria-describedby="teachers-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter number of teachers"
            />
            {errors.teachers && (
              <p
                id="teachers-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.teachers.message}
              </p>
            )}
          </div>

          {/* No of Students */}
          <div>
            <label htmlFor="students" className="block font-medium">
              No. of Students
            </label>
            <input
              type="number"
              id="students"
              {...register("students", {
                required: "Number of students is required",
              })}
              aria-invalid={errors.students ? "true" : "false"}
              aria-describedby="students-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter number of students"
            />
            {errors.students && (
              <p
                id="students-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.students.message}
              </p>
            )}
          </div>

          {/* School Size */}
          <div>
            <label htmlFor="schoolSize" className="block font-medium">
              School Size
            </label>
            <select
              id="schoolSize"
              {...register("schoolSize", {
                required: "School size is required",
              })}
              aria-invalid={errors.schoolSize ? "true" : "false"}
              aria-describedby="schoolSize-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select school size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            {errors.schoolSize && (
              <p
                id="schoolSize-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.schoolSize.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2 lg:col-span-3">
            <label htmlFor="address" className="block font-medium">
              Address
            </label>
            <textarea
              id="address"
              {...register("address", { required: "Address is required" })}
              aria-invalid={errors.address ? "true" : "false"}
              aria-describedby="address-error"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter full address"
              rows={3}
            />
            {errors.address && (
              <p
                id="address-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 lg:col-span-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md"
            >
              {loading ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </div>

          {/* Success & Error Messages */}
          {successMessage && (
            <div className="md:col-span-2 lg:col-span-3" role="alert">
              <p className="text-green-600 text-center font-medium">
                {successMessage}
              </p>
            </div>
          )}
          {errorMessage && (
            <div className="md:col-span-2 lg:col-span-3" role="alert">
              <p className="text-red-600 text-center font-medium">
                {errorMessage}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
