import { useState, memo, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function AnnouncementCardStd({ data, mainHeading }) {
  const [openCourses, setOpenCourses] = useState({});
  const [openAnnouncementId, setOpenAnnouncementId] = useState(null);

  // Group announcements by course
  const groupedByCourse = data.reduce((acc, announcement) => {
    const courseId = announcement.course?.id || "no-course";

    if (!acc[courseId]) {
      acc[courseId] = {
        courseId,
        courseTitle: announcement.course?.title || "No Course",
        announcements: [],
      };
    }

    acc[courseId].announcements.push(announcement);
    return acc;
  }, {});

  // Auto-expand course if only one course exists
  useEffect(() => {
    const newOpenState = {};
    Object.values(groupedByCourse).forEach((course) => {
      newOpenState[course.courseId] =
        Object.keys(groupedByCourse).length === 1;
    });
    setOpenCourses(newOpenState);
  }, [data]);

  const toggleCourse = (courseId) => {
    setOpenCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
    setOpenAnnouncementId(null);
  };

  const toggleAnnouncement = (announcementId) => {
    setOpenAnnouncementId(
      openAnnouncementId === announcementId ? null : announcementId
    );
  };

  return (
    <div className="space-y-6">
      {mainHeading && (
        <h2 className="text-xl font-semibold mb-4">{mainHeading}</h2>
      )}

      {Object.values(groupedByCourse).map((course) => {
        const isCourseOpen = openCourses[course.courseId] || false;

        return (
          <Card
            key={course.courseId}
            className="w-full mx-auto rounded-2xl bg-white shadow-sm hover:shadow-md transition duration-200"
          >
            <CardContent className="p-0">
              {/* Course Header */}
              <div
                className="flex justify-between items-center px-6 py-4 cursor-pointer bg-gray-50"
                onClick={() => toggleCourse(course.courseId)}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.courseTitle} ({course.announcements.length})
                </h3>
                {isCourseOpen ? (
                  <ChevronUp className="text-gray-500" size={20} />
                ) : (
                  <ChevronDown className="text-gray-500" size={20} />
                )}
              </div>

              {/* Announcements */}
              {isCourseOpen &&
                course.announcements.map((announcement) => {
                  const isOpen = openAnnouncementId === announcement.id;

                  return (
                    <div
                      key={announcement.id}
                      className="px-6 py-4 border-t border-gray-200"
                    >
                      {/* Announcement Header */}
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleAnnouncement(announcement.id)}
                      >
                        <h4 className="text-md font-semibold text-gray-900">
                          {announcement.title}
                        </h4>

                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            {announcement.date}
                          </p>

                          {isOpen ? (
                            <ChevronUp className="text-gray-500" size={20} />
                          ) : (
                            <ChevronDown className="text-gray-500" size={20} />
                          )}
                        </div>
                      </div>

                      {/* Teacher */}
                      <p
                        className="text-sm text-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="font-medium text-gray-800">
                          Teacher:
                        </span>{" "}
                        {announcement.teacher.name}
                      </p>

                      {/* Expanded Section */}
                      {isOpen && (
                        <div
                          className="mt-3 space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-gray-700">
                            {announcement.message}
                          </p>

                          {/* Links */}
                          {announcement.links?.length > 0 && (
                            <div>
                              <p className="font-medium text-gray-800">
                                Links:
                              </p>
                              <ul className="list-disc ml-6 text-blue-600">
                                {announcement.links.map((link, i) => (
                                  <li key={i}>
                                    <a
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                    >
                                      {link}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Attachments */}
                         {announcement.attachments?.length > 0 && (
  <div>
    <p className="font-medium text-gray-800">Attachments:</p>

    <div className="grid grid-cols-2 gap-3 mt-2">
      {announcement.attachments.map((file, i) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.filename);

        return (
          <div key={i} className="border p-2 rounded-md bg-gray-50">
            {isImage ? (
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90"
                />
              </a>
            ) : (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {file.filename}
              </a>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

                        </div>
                      )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default memo(AnnouncementCardStd);
