import { useState, useEffect, useContext } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import { Share2, Loader2, X, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { GlobalContext } from "@/Context/GlobalProvider";

export default function ShareCourseModal({ courseId, courseName }) {
    const { user } = useContext(GlobalContext);
    const [open, setOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        if (open) {
            fetchTeachers();
            setSelectedTeachers([]); // Reset selections when modal opens
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverOpen && !e.target.closest(".dropdown-container")) {
                setPopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popoverOpen]);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/admin/allTeacher");
            console.log("API Response:", res.data);
            console.log("Teachers array:", res.data.teachers);

            const currentTeacherEmail = user?.email;
            const teachersList = (res.data.teachers || []).filter(
                (t) => t.email !== currentTeacherEmail
            );
            console.log("Filtered Teachers list:", teachersList);

            setTeachers(teachersList);
        } catch (error) {
            console.error("Error fetching teachers:", error);
            toast.error("Failed to load teachers");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTeacher = (teacherId) => {
        console.log("Toggling teacher:", teacherId);
        console.log("Current selected:", selectedTeachers);

        setSelectedTeachers((prev) => {
            const isSelected = prev.includes(teacherId);
            console.log("Is selected:", isSelected);

            if (isSelected) {
                // Remove from selection
                const newSelection = prev.filter((id) => id !== teacherId);
                console.log("New selection (removed):", newSelection);
                return newSelection;
            } else {
                // Add to selection
                const newSelection = [...prev, teacherId];
                console.log("New selection (added):", newSelection);
                return newSelection;
            }
        });
    };

    const handleRemoveTeacher = (teacherId) => {
        setSelectedTeachers((prev) => prev.filter((id) => id !== teacherId));
    };

    const handleShare = async () => {
        if (selectedTeachers.length === 0) {
            toast.error("Please select at least one teacher");
            return;
        }

        setSharing(true);
        try {
            const res = await axiosInstance.post("/course/share", {
                courseId,
                teacherIds: selectedTeachers,
            });

            toast.success(res.data.message || "Course shared successfully!");
            setSelectedTeachers([]);
            setOpen(false);
        } catch (error) {
            console.error("Error sharing course:", error);
            toast.error(
                error.response?.data?.message || "Failed to share course"
            );
        } finally {
            setSharing(false);
        }
    };

    const getTeacherName = (teacherId) => {
        const teacher = teachers.find((t) => t.id === teacherId);
        if (!teacher) return "Unknown";

        return teacher.name || teacher.email;
    };

    const getTeacherDisplay = (teacher) => {
        return teacher.name ? `${teacher.name} (${teacher.email})` : teacher.email;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 py-2.5 px-2 hover:bg-gray-100"
                >
                    <Share2 size={18} className="text-green-600" />
                    <span>Share Course</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Share Course</DialogTitle>
                    <DialogDescription>
                        Share "{courseName}" with other teachers. They can import it directly
                        into their account.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Teachers</Label>
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <div className="relative dropdown-container">
                                <Button
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={popoverOpen}
                                    className="w-full justify-between"
                                    onClick={() => setPopoverOpen(!popoverOpen)}
                                >
                                    {selectedTeachers.length > 0
                                        ? `${selectedTeachers.length} teacher(s) selected`
                                        : "Choose teachers..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                {popoverOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto p-2">
                                        {teachers.length === 0 ? (
                                            <p className="text-sm text-gray-500 p-2">No teachers found</p>
                                        ) : (
                                            teachers.map((teacher) => {
                                                const teacherId = teacher.id || teacher._id;
                                                const isChecked = selectedTeachers.includes(teacherId);

                                                return (
                                                    <div
                                                        key={teacherId}
                                                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                                                    >
                                                        <Checkbox
                                                            id={`teacher-${teacherId}`}
                                                            checked={isChecked}
                                                            onCheckedChange={() => handleToggleTeacher(teacherId)}
                                                        />
                                                        <label
                                                            htmlFor={`teacher-${teacherId}`}
                                                            className="flex-1 text-sm cursor-pointer select-none"
                                                        >
                                                            {getTeacherDisplay(teacher)}
                                                        </label>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedTeachers.length > 0 && (
                        <div className="space-y-2">
                            <Label>Selected Teachers ({selectedTeachers.length})</Label>
                            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 max-h-40 overflow-y-auto">
                                {selectedTeachers.map((teacherId) => (
                                    <Badge
                                        key={teacherId}
                                        variant="secondary"
                                        className="flex items-center gap-1 px-3 py-1"
                                    >
                                        <span>{getTeacherName(teacherId)}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemoveTeacher(teacherId);
                                            }}
                                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                            aria-label={`Remove ${getTeacherName(teacherId)}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={sharing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={sharing || selectedTeachers.length === 0}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {sharing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sharing...
                            </>
                        ) : (
                            <>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Course
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
