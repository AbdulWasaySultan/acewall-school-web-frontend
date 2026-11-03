import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import {
    Loader,
    ChevronRight,
    FolderOpen,
    Target,
    Calendar,
    Clock,
    BookOpen,
    Star,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/CustomComponent/BackButton";

const GREY_SCHEME = {
    bg: "bg-slate-50",
    border: "border-slate-200",
    accent: "bg-slate-400",
    text: "text-slate-600",
    lightText: "text-slate-400",
    iconBg: "bg-slate-100",
    sideBg: "bg-slate-800"
};

const GREEN_SCHEME = {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-600",
    text: "text-emerald-700",
    lightText: "text-emerald-500",
    iconBg: "bg-emerald-100",
    sideBg: "bg-emerald-900"
};

export default function CoursePacingChartstudent() {
    const { courseId } = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [pacingChart, setPacingChart] = useState({
        items: [],
    });

    const getResourceLabel = (res) => {
        if (!res) return "";
        if (res.startsWith("http://") || res.startsWith("https://")) {
            try {
                const url = new URL(res);
                const nameParam = url.searchParams.get("name");
                if (nameParam) {
                    return decodeURIComponent(nameParam);
                }
                const parts = res.split('/');
                const filename = parts[parts.length - 1].split('?')[0];
                return decodeURIComponent(filename);
            } catch {
                try {
                    const parts = res.split('/');
                    const filename = parts[parts.length - 1].split('?')[0];
                    return decodeURIComponent(filename);
                } catch {
                    return "View Attachment";
                }
            }
        }
        return res;
    };

    const fetchCourse = async () => {
        try {
            const res = await axiosInstance.get(`course/details/${courseId}`);
            setCourse(res.data.course);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch course details");
        }
    };

    const fetchPacingChart = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`course/${courseId}/pacing-chart`);
            const chartData = res.data?.data || res.data;
            console.log(chartData)
            if (chartData && chartData.items && Array.isArray(chartData.items)) {
                // Sort items by start date if available
                const sortedItems = [...chartData.items].sort((a, b) => {
                    if (!a.startDate || !b.startDate) return 0;
                    return new Date(a.startDate) - new Date(b.startDate);
                });
                setPacingChart({ items: sortedItems });
            } else {
                setPacingChart({ items: [] });
            }
        } catch (err) {
            console.error("Error fetching pacing chart:", err);
            setPacingChart({ items: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
        fetchPacingChart();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-8 w-8 text-acewall-main" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <BackButton />
                    <div>
                        <div className="flex items-center gap-2 text-acewall-main font-bold tracking-tighter uppercase text-sm mb-1">
                            <Star size={16} fill="currentColor" />
                            <span>My Learning Journey</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Course Pacing Chart
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 italic">
                            {course?.courseTitle || "Loading Course..."}
                        </p>
                    </div>
                </div>
            </div>

            {pacingChart.items.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50 border-slate-200">
                    <CardContent className="flex flex-col items-center py-20 text-center">
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 mb-6">
                            <Clock size={64} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pacing Chart Coming Soon</h2>
                        <p className="text-slate-500 max-w-md font-medium">
                            Your instructor hasn't posted a pacing chart for this course yet. Please check back later for your weekly schedule!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="relative">
                    {/* The Timeline Line */}
                    <div className="absolute left-8 md:left-28 top-0 bottom-0 w-1 bg-slate-200 rounded-full hidden sm:block" />

                    <div className="space-y-12">
                        {pacingChart.items.map((item, index) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            let isCompleted = false;

                            // Check if next section start date has come
                            if (index < pacingChart.items.length - 1) {
                                const nextItem = pacingChart.items[index + 1];
                                if (nextItem.startDate) {
                                    const nextStart = new Date(nextItem.startDate);
                                    nextStart.setHours(0, 0, 0, 0);
                                    if (today >= nextStart) {
                                        isCompleted = true;
                                    }
                                }
                            }

                            // Check if this section's end date has passed
                            if (!isCompleted && item.endDate) {
                                const end = new Date(item.endDate);
                                end.setHours(0, 0, 0, 0);
                                if (today > end) {
                                    isCompleted = true;
                                }
                            }

                            const colors = isCompleted ? GREEN_SCHEME : GREY_SCHEME;

                            return (
                                <div key={index} className="relative group transition-all duration-300">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-8 md:left-28 top-10 -ml-2.5 w-6 h-6 rounded-full border-4 border-white ${colors.accent}  hidden sm:block shadow-md group-hover:scale-125 transition-transform`} />

                                    <div className="flex flex-col md:flex-row gap-6 sm:pl-16 md:pl-0">
                                        {/* Date/Week Indicator */}
                                        <div className="md:w-24 shrink-0 flex flex-col justify-center items-center text-center">
                                            <div className={`${colors.text} font-black text-lg tracking-tight`}>
                                                {item.week}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                Schedule
                                            </div>
                                        </div>

                                        {/* Content Card */}
                                        <div className={`flex-1 bg-white rounded-3xl border-2 ${colors.border} shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl transition-all duration-500`}>
                                            <div className="flex flex-col h-full">
                                                {/* Header Portion */}
                                                <div className={`${colors.bg} p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border-b ${colors.border} gap-4`}>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[0.2em]">
                                                            <div className={`h-1.5 w-1.5 rounded-full ${colors.accent}`} />
                                                            <span className={colors.text}>Topic Spotlight</span>
                                                        </div>
                                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                                            {item.topic}
                                                        </h3>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 md:flex-col items-start md:items-end shrink-0">
                                                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                                            <Calendar size={14} className={colors.lightText} />
                                                            <span className="text-xs font-bold text-slate-700">
                                                                {item.startDate ? format(parseISO(item.startDate), "MMM dd") : "TBD"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                                            <Clock size={14} className={colors.lightText} />
                                                            <span className="text-xs font-bold text-slate-700">
                                                                Until {item.endDate ? format(parseISO(item.endDate), "MMM dd") : "TBD"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Body Portion */}
                                                <div className="p-6 md:p-8 space-y-8">
                                                    {item.description && (
                                                        <div>
                                                            <p className="text-slate-600 leading-relaxed font-medium">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                                                        {/* Objectives section */}
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <div className={`p-1.5 rounded-lg ${colors.iconBg}`}>
                                                                    <Target size={18} className={colors.text} />
                                                                </div>
                                                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                                                    Learning Goals
                                                                </h4>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {item.objectives?.map((obj, i) => (
                                                                    <li key={i} className="flex items-start gap-3 group/li">
                                                                        <div className={`h-6 w-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black border ${colors.border} group-hover/li:scale-110 transition-transform`}>
                                                                            {i + 1}
                                                                        </div>
                                                                        <span className="text-slate-600 text-[13px] font-semibold leading-snug">
                                                                            {obj}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Resources section */}
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <div className={`p-1.5 rounded-lg ${colors.iconBg}`}>
                                                                    <BookOpen size={18} className={colors.text} />
                                                                </div>
                                                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                                                    Study Materials
                                                                </h4>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.resources?.map((res, i) => {
                                                                    if (!res) return null;
                                                                    const isUrl = res.startsWith("http://") || res.startsWith("https://");
                                                                    return isUrl ? (
                                                                        <a
                                                                            key={i}
                                                                            href={res}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className={`flex items-center gap-2 ${colors.bg} ${colors.text} px-4 py-2 rounded-2xl text-[11px] font-black border-2 ${colors.border} hover:bg-white transition-colors cursor-pointer shadow-sm max-w-full truncate`}
                                                                        >
                                                                            <FolderOpen size={12} className="shrink-0" />
                                                                            <span className="truncate">{getResourceLabel(res)}</span>
                                                                        </a>
                                                                    ) : (
                                                                        <div
                                                                            key={i}
                                                                            className={`flex items-center gap-2 ${colors.bg} ${colors.text} px-4 py-2 rounded-2xl text-[11px] font-black border-2 ${colors.border} shadow-sm max-w-full truncate`}
                                                                        >
                                                                            <FolderOpen size={12} className="shrink-0" />
                                                                            <span className="truncate">{res}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
