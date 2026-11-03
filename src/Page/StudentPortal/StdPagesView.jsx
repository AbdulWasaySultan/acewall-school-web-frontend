import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const StdPagesView = () => {
  const { user } = useContext(GlobalContext);
  const studentId = user?._id;

  const [pages, setPages] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPages = async (courseId = "all") => {
    try {
      let url = `/pages/studentpages?studentId=${studentId}`;
      if (courseId !== "all") {
        url += `&courseId=${courseId}`;
      }
      const res = await axiosInstance.get(url);
      console.log(res);
      
      setPages(res.data.pages || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch pages");
      setPages([]);
    }
  };

  const fetchStudentCourses = async () => {
    try {
      const res = await axiosInstance.get("/enrollment/studentCourses");
      const enrolledCourses = res.data.enrolledCourses.map((e) => e.course);
      setAllCourses(enrolledCourses || []);
    } catch (err) {
      toast.error("Failed to fetch enrolled courses");
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentCourses();
      fetchPages();
    }
  }, [studentId]);

  const handleCourseFilter = (value) => {
    setSelectedCourseId(value);
    fetchPages(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Your Course Pages</h1>
      </div>

      {/* Filter Dropdown */}
      <div className="max-w-xs">
        <Select value={selectedCourseId} onValueChange={handleCourseFilter}>
          <SelectTrigger>
            <SelectValue>
              {selectedCourseId === "all"
                ? "All Courses"
                : allCourses.find((c) => c._id === selectedCourseId)
                    ?.courseTitle || "Select Course"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {allCourses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.courseTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page Cards */}
      {pages.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">
          No pages found for your selected course.
        </p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((post) => (
            <article key={post._id} role="listitem">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                onClick={() => setSelectedPost(post)}
                aria-label={`View page: ${post.title}`}
              >
                {post.image?.url && (
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={post.image.url}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                )}
                <CardHeader className="px-4 pt-3 space-y-2">
                  <CardTitle>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {post.title}
                    </h3>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4">
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">
                    {post.description}
                  </p>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      )}

      {/* Modal for detailed post view */}
      {selectedPost && (
        <Dialog
          open={!!selectedPost}
          onOpenChange={() => setSelectedPost(null)}
        >
          <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedPost?.title}</DialogTitle>
            </DialogHeader>

            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="space-y-4">
              {selectedPost.image?.url && (
                <img
                  src={selectedPost.image.url}
                  alt={selectedPost.title}
                  className="w-full object-contain rounded-md border max-h-[70vh]"
                />
              )}
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selectedPost?.description}
              </p>
              {selectedPost.files?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Attachments:</h4>
                  <ul className="list-disc pl-5 text-sm text-blue-600">
                    {selectedPost.files.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {file.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StdPagesView;
