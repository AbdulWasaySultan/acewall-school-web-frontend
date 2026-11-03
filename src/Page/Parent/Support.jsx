import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";

const Support = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    feedback: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axiosInstance.post("/parent/send", formData);
      setMessage(res.data.message);
      setFormData({ fullName: "", email: "", feedback: "" });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-muted rounded-2xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">
            Contact Support
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            We're here to help. Please fill out the form and our team will get
            back to you soon.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              aria-invalid={formData.fullName === ""}
              aria-describedby="fullName-error"
            />
            {formData.fullName === "" && (
              <p id="fullName-error" className="text-xs text-red-600">
                Full name is required.
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-invalid={formData.email === ""}
              aria-describedby="email-error"
            />
            {formData.email === "" && (
              <p id="email-error" className="text-xs text-red-600">
                Email is required.
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback *</Label>
            <Textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              required
              aria-invalid={formData.feedback === ""}
              aria-describedby="feedback-error"
            />
            {formData.feedback === "" && (
              <p id="feedback-error" className="text-xs text-red-600">
                Feedback is required.
              </p>
            )}
          </div>

          {/* Server Response */}
          {message && (
            <p className="text-sm text-center" role="alert">
              {message}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Support;
