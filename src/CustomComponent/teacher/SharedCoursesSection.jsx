import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import {
    Download,
    X,
    Loader2,
    Share2,
    Calendar,
    User,
    BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function SharedCoursesSection() {
    const navigate = useNavigate();
    const [sharedCourses, setSharedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchSharedCourses();
    }, []);

    const fetchSharedCourses = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/course/shared-with-me");
            setSharedCourses(res.data.data || []);
        } catch (error) {
            console.error("Error fetching shared courses:", error);
            toast.error("Failed to load shared courses");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (shareId) => {
        setActionLoading(shareId);
        try {
            const res = await axiosInstance.post(`/course/accept-share/${shareId}`);
            toast.success(res.data.message || "Course imported successfully!");

            // Navigate to the new course
            if (res.data.newCourseId) {
                navigate(`/teacher/courses/courseDetail/${res.data.newCourseId}`);
            }

            // Refresh the list
            fetchSharedCourses();
        } catch (error) {
            console.error("Error accepting share:", error);
            toast.error(
                error.response?.data?.message || "Failed to import course"
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (shareId) => {
        setActionLoading(shareId);
        try {
            const res = await axiosInstance.post(`/course/reject-share/${shareId}`);
            toast.success(res.data.message || "Share request rejected");
            fetchSharedCourses();
        } catch (error) {
            console.error("Error rejecting share:", error);
            toast.error(
                error.response?.data?.message || "Failed to reject share"
            );
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Shared With Me
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (sharedCourses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Shared With Me
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        <Share2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No courses shared with you yet</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Shared With Me
                    <Badge variant="secondary" className="ml-2">
                        {sharedCourses.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sharedCourses.map((share) => (
                        <Card key={share._id} className="border-2 hover:border-green-200 transition">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Course Thumbnail */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={
                                                share.course?.thumbnail?.url ||
                                                "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80"
                                            }
                                            alt={share.course?.courseTitle || "Course"}
                                            className="w-full md:w-32 h-24 object-cover rounded-md"
                                        />
                                    </div>

                                    {/* Course Info */}
                                    <div className="flex-grow space-y-2">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-green-600" />
                                            {share.course?.courseTitle || "Untitled Course"}
                                        </h3>

                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                <span>
                                                    Shared by:{" "}
                                                    <span className="font-medium">
                                                        {share.sharedBy?.firstName || ""}{" "}
                                                        {share.sharedBy?.lastName || ""}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {format(new Date(share.createdAt), "MMM dd, yyyy")}
                                                </span>
                                            </div>
                                        </div>

                                        {share.course?.courseDescription && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {share.course.courseDescription}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex md:flex-col gap-2 justify-end">
                                        <Button
                                            onClick={() => handleAccept(share._id)}
                                            disabled={actionLoading === share._id}
                                            className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                                            size="sm"
                                        >
                                            {actionLoading === share._id ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Importing...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Import
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(share._id)}
                                            disabled={actionLoading === share._id}
                                            variant="outline"
                                            className="flex-1 md:flex-none"
                                            size="sm"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
