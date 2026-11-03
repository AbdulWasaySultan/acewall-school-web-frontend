"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const socialLinks = [
    { name: "Mail", icon: <Mail />, url: "mailto:contact@acewallscholars.org" },
    { name: "Facebook", icon: <Facebook />, url: "https://www.facebook.com/acewallscholars" },
    { name: "Instagram", icon: <Instagram />, url: "https://www.instagram.com/acewallscholarsonline/" },
    { name: "Youtube", icon: <Youtube />, url: "https://www.youtube.com/channel/UCR7GG6Dvnuf6ckhTo3wqSIQ" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axiosInstance.post("/support/sendcontactmail", formData);
      setMessage(res.data.message);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-lg">
      {/* Left sidebar */}
      <div className="bg-green-700 text-white p-8 md:w-2/5">
        <h1 className="text-3xl font-bold mb-6">Please Contact Us:</h1>

        <div className="mb-6">
          <p className="font-semibold">Address:</p>
          <p>Acewall Scholars</p>
          <p>P.O. Box 445</p>
          <p>Powhatan, VA 23139</p>
        </div>

        <div className="mb-6">
          <p className="font-semibold">Phone Number:</p>
          <a href="tel:8044647926" className="text-green-300 hover:underline">
            (804) 464-7926
          </a>
        </div>

        <div>
          <p className="font-semibold mb-3">Follow Us</p>
          <div className="flex space-x-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition-colors"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="p-8 md:w-3/5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            aria-label="Name"
            className="border-gray-300 focus:border-green-500"
          />
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="johndoe001@gmail.com"
            required
            aria-label="Email"
            className="border-gray-300 focus:border-green-500"
          />
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            pattern="^[0-9\s()+-]*$"
            placeholder="(123) 456-7890"
            aria-label="Phone Number"
            className="border-gray-300 focus:border-green-500"
          />
          <Input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            aria-label="Subject"
            className="border-gray-300 focus:border-green-500"
          />
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            required
            aria-label="Message"
            className="min-h-[120px] border-gray-300 focus:border-green-500"
          />

          {message && (
            <p className="text-sm text-center text-gray-700 dark:text-gray-200">
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}