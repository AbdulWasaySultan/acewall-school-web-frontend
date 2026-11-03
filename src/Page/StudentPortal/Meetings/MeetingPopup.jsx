import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, Clock, Calendar, Video, User, BookOpen } from "lucide-react";
import gsap from "gsap";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";

const MeetingPopup = ({ meeting, onClose, onJoin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    // Show popup after a short delay
    useEffect(() => {
        if (meeting) {
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, [meeting]);

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

    if (!isVisible || !meeting) return null;

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 px-3 sm:px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="meeting-popup-heading"
            aria-describedby="meeting-popup-description"
        >
            <div
                ref={modalRef}
                className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-10 
               w-full max-w-lg 
               max-h-[95vh] 
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
                    id="meeting-popup-heading"
                    className="text-xl sm:text-2xl font-extrabold text-center text-gray-800 mb-3 sm:mb-4 leading-snug flex flex-col items-center gap-2"
                >
                    <span className="bg-blue-100 text-blue-600 p-3 rounded-full mb-2">
                        <Video className="w-8 h-8" />
                    </span>
                    You Have an Upcoming Class!
                </h2>

                {/* Subtitle */}
                <p
                    id="meeting-popup-description"
                    className="text-gray-600 text-center mb-6 text-sm sm:text-base"
                >
                    Start getting ready! Your next session is scheduled soon.
                </p>

                {/* Details List */}
                <div className="space-y-4 mb-8">
                    <div className="feature-item flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Topic</p>
                            <p className="font-bold text-gray-800 line-clamp-1">{meeting.topic}</p>
                        </div>
                    </div>

                    <div className="feature-item flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Date & Time</p>
                            <p className="font-medium text-gray-800">
                                {isValid(new Date(meeting.scheduledAt))
                                    ? format(new Date(meeting.scheduledAt), "EEEE, MMM do • h:mm a")
                                    : "Date N/A"}
                            </p>
                        </div>
                    </div>

                    {meeting.course?.createdby && (
                        <div className="feature-item flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Instructor</p>
                                <p className="font-medium text-gray-800">
                                    {meeting.course.createdby.firstName} {meeting.course.createdby.lastName}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA button */}
                <div className="text-center">
                    <button
                        onClick={() => onJoin(meeting._id)}
                        className="group relative overflow-hidden rounded-lg w-full px-6 py-3 font-bold text-base text-white 
              border border-white/30 shadow-xl 
              bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
              transition-all duration-300"
                    >
                        <span className="absolute inset-0 overflow-hidden">
                            <span className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
                        </span>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Join Class Now
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingPopup;
