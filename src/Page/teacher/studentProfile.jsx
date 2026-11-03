import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  StudentProfileCourseCard,
  StudentProfileStatCard,
} from "@/CustomComponent/Card";
import { Mail, Calendar, School, ChevronDown, ChevronUp } from "lucide-react";
import avatar from "@/assets/avatar.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditParentEmail from "../Account/EditParentEmail";
import ManageEmailNotifications from "@/CustomComponent/togelNotificationDialog";
import { axiosInstance } from "@/lib/AxiosInstance";
import { StudentProfilePageDropdown } from "@/CustomComponent/teacher/StudentProfilePageDropdown";

export default function StudentProfile() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [student, setStudent] = React.useState(state?.student || null);
  const [emailOpen, setEmailOpen] = useState(false);

  const handleConversation = async () => {
    try {
      await axiosInstance.post("conversation/create", {
        memberId: student._id,
      });
      navigate("/teacher/messages");
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  if (!student) {
    return (
      <div className="text-center mt-10" role="alert">
        <p className="text-red-500">Student data not found.</p>
        <button
          className="mt-4 text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 bg-white rounded-xl shadow-md"
      role="region"
      aria-label="Student Profile Section"
    >
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <Avatar
          className="w-24 h-24 rounded-full overflow-hidden ring-3 ring-gray-500 shadow-sm"
          aria-label="Student profile image"
        >
          <AvatarImage
            src={student?.profileImg?.url || avatar}
            alt={`${student?.firstName} profile image`}
            className="w-full h-full object-cover"
          />
          <AvatarFallback
            className="w-full h-full bg-gray-200 text-gray-600 text-xl font-semibold flex items-center justify-center rounded-full"
            aria-hidden="true"
          >
            {student?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center text-center md:text-left">
          {/* Student Full Name */}
          <h1 className="text-2xl font-bold text-gray-800 flex flex-wrap justify-center md:justify-start items-center gap-x-2">
            {student?.firstName} {student?.middleName} {student?.lastName}
          </h1>

          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-gray-500" aria-hidden="true" />
              <span>Email: {student?.email}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4 text-gray-500" aria-hidden="true" />
              <span>
                Joined:{" "}
                {new Date(student?.createdAt).toLocaleString("en-US", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <Button
              className="bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-700"
              onClick={handleConversation}
              aria-label="Send message to student"
            >
              Message
            </Button>

            <ManageEmailNotifications
              studentId={student._id}
              aria-label="Manage email notifications"
            />
          </div>

          {/* Guardian Emails */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => setEmailOpen(!emailOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600"
              aria-expanded={emailOpen}
              aria-controls="guardian-email-list"
            >
              Guardian Emails
              {emailOpen ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {emailOpen && (
              <ul
                id="guardian-email-list"
                className="mt-2 border rounded-md bg-gray-50 p-2 space-y-1 max-w-sm"
                role="list"
              >
                {student.guardianEmails?.length > 0 ? (
                  student.guardianEmails.map((email, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700"
                      role="listitem"
                    >
                      {email}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500" role="listitem">
                    No guardian emails added yet.
                  </li>
                )}
              </ul>
            )}

            {/* Add/Edit Guardian Email Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  aria-label="Add or edit guardian email addresses"
                >
                  Add / Edit Guardian Emails
                </Button>
              </DialogTrigger>

              <DialogContent
                className="max-w-lg"
                aria-describedby="edit-guardian-helptext"
              >
                <DialogHeader>
                  <DialogTitle>Add / Edit Guardian Emails</DialogTitle>
                </DialogHeader>

                <p
                  id="edit-guardian-helptext"
                  className="text-sm text-gray-600 mb-2"
                >
                  Update the guardian email list for this student.
                </p>

                <EditParentEmail
                  studentId={student._id}
                  initialEmails={student.guardianEmails || []}
                  onUpdate={(updatedEmails) =>
                    setStudent((prev) => ({
                      ...prev,
                      guardianEmails: updatedEmails,
                    }))
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <StudentProfilePageDropdown userId={id} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex items-center justify-center mb-10">
        <StudentProfileStatCard
          className="max-w-xs"
          icon={<School aria-hidden="true" />}
          title="Enrolled Courses"
          value={student?.courses?.length || 0}
        />
      </div>

      {/* Course List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          View Grade Book of Enrolled Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {student?.courses?.map((course, index) => (
            <Link
              to={`/teacher/courseGrades/${id}/${course._id}`}
              key={index}
              className="group relative rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-700"
              aria-label={`View grade book for course ${course.courseName}`}
            >
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <StudentProfileCourseCard course={course} />
              </div>

              <div className="absolute inset-0 bg-green-600 bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-white text-lg font-semibold">
                  View Grade Book
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
