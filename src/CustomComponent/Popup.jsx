import React, { useEffect, useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const LMSPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const navigate = useNavigate();

  const points = [
    "Specialty LMS catered to each school",
    "Efficient, User Friendly, and Cost Effective",
    "Dedicated Support Team",
    "Income opportunities for schools and teachers just through signing-up",
    "Switch and save up to 30% off current LMS",
    "Social Community Feed – Share posts, pictures, and videos just like social media, but safe and private for your school.",
    "Upcoming Standards Based Learning Integration",
  ];

  // Show popup after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Animate popup and backdrop
  useEffect(() => {
    if (isVisible) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }
      );

      gsap.fromTo(
        ".feature-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          delay: 0.3,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [isVisible]);

  // Trap focus inside modal for accessibility
  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements?.[0];
    const lastEl = focusableElements?.[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsVisible(false);
        onClose?.();
      }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    if (isVisible) {
      firstEl?.focus();
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lms-popup-heading"
      aria-describedby="lms-popup-description"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-10 
               w-full max-w-lg sm:max-w-2xl 
               max-h-[95vh] sm:max-h-[90vh] 
               overflow-y-auto transform"
      >
        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-lg sm:text-xl transition-transform hover:scale-110"
          aria-label="Close popup"
        >
          ✕
        </button>

        {/* Heading */}
        <h2
          id="lms-popup-heading"
          className="text-xl sm:text-3xl font-extrabold text-center text-green-700 mb-3 sm:mb-4 leading-snug"
        >
          Save up to{" "}
          <span className="text-orange-400 drop-shadow-[0_0_8px_#bef264] animate-pulse">
            30%
          </span>{" "}
          on Your Current LMS!
        </h2>

        {/* Subtitle */}
        <p
          id="lms-popup-description"
          className="text-gray-600 text-center mb-4 sm:mb-5 text-sm sm:text-base"
        >
          Empower your institution with a smarter, more affordable learning
          platform.
        </p>

        {/* Feature list */}
        <ul className="grid grid-cols-1 gap-2 sm:gap-3 mb-5 sm:mb-6">
          {points.map((point, idx) => (
            <li
              key={idx}
              className="feature-item flex items-start gap-2 sm:gap-3"
            >
              <CheckCircle
                className="text-green-600 mt-0.5 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-gray-800 text-sm sm:text-base font-medium">
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/contact")}
            className="group relative overflow-hidden rounded-lg w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-sm sm:text-base text-white 
              border border-white/30 shadow-xl 
              bg-gradient-to-r from-green-700/90 to-green-800/90 hover:from-green-600 hover:to-green-700 
              transition-all duration-300"
          >
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
            </span>
            <span className="relative z-10">Contact a Representative</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LMSPopup;
