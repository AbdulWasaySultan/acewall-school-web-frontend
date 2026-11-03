import React, { useEffect, useState, useRef } from "react";
import { Video, X, Calendar, Clock, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { format, isValid } from "date-fns";

const MeetingToast = ({ meeting, onClose, onJoin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const toastRef = useRef(null);

    useEffect(() => {
        if (meeting) {
            // Delay slightly to allow page load before showing toast
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [meeting]);

    useEffect(() => {
        if (isVisible && toastRef.current) {
            // Slide in from right
            gsap.fromTo(
                toastRef.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
            );
        }
    }, [isVisible]);

    const handleClose = () => {
        if (toastRef.current) {
            gsap.to(toastRef.current, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                ease: "power3.in",
                onComplete: () => {
                    setIsVisible(false);
                    onClose?.();
                }
            });
        }
    };

    if (!isVisible || !meeting) return null;

    return (
        <div
            ref={toastRef}
            className="fixed top-24 right-6 z-50 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            role="alert"
        >
            {/* Header / Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <div className="p-4 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Video size={20} className="animate-pulse" />
                    </div>

                    <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight pr-4">
                            Upcoming Class
                        </h4>
                        <p className="text-xs font-medium text-blue-600 line-clamp-1">
                            {meeting.topic}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <Clock size={12} />
                            <span>
                                {isValid(new Date(meeting.scheduledAt))
                                    ? format(new Date(meeting.scheduledAt), "h:mm a")
                                    : "N/A"}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="truncate max-w-[100px]">
                                {meeting.course?.courseTitle}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => onJoin(meeting._id)}
                        className="flex-[2] px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center justify-center gap-1 transition-colors"
                    >
                        Join Now <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingToast;
