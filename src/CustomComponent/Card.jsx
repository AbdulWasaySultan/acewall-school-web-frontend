import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, ChevronDown, ChevronUp,UserCircle } from "lucide-react";
import { useState } from "react";
import avatar from "../assets/avatar.png";



const ParentCoursesCard = ({ course: enrollment }) => {
  // Extracting data
  const courseData = enrollment?.course;
  const courseTitle = courseData?.courseTitle || "Untitled course";
  const courseCategory = courseData?.category?.title || "Uncategorized";
  const imageUrl = courseData?.thumbnail?.url || "/placeholder.svg";
  
  // Status
  const isCompleted = enrollment?.completed;
  
  // Instructor Details
  const instructor = courseData?.createdby;
  const instructorName = instructor 
    ? `${instructor.firstName} ${instructor.lastName}` 
    : "Unknown Instructor";

  // Formatting Date
  const enrolledDate = enrollment?.enrolledAt 
    ? new Date(enrollment.enrolledAt).toLocaleDateString() 
    : "N/A";

  return (
    <article
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-xl transition-all duration-300"
    >
      <Card className="w-full overflow-hidden border-none shadow-sm hover:shadow-md bg-white">
        {/* Course Thumbnail */}
        <AspectRatio ratio={16 / 9} className="overflow-hidden">
          <img
            src={imageUrl}
            alt={courseTitle}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
         
        </AspectRatio>

        <CardHeader className="p-4 pb-2">
          {/* Category */}
          <div className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded mb-2">
            {courseCategory}
          </div>

          <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
            {courseTitle}
          </CardTitle>
          
          {/* Instructor Info */}
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <UserCircle size={14} />
            <span className="text-xs truncate">Instructor: {instructorName}</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          {/* Footer Details (Enrollment date & Language) */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar size={12} />
              <span className="text-[10px]">Enrolled: {enrolledDate}</span>
            </div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase">
              {courseData?.language || "English"}
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};


function DeshboardAnnouncementCard({ mainHeading, data, link, height }) {
  return (
    <Card
      role="region"
      aria-labelledby={`${mainHeading}-heading`}
      className="bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full"
      style={{ height: height || "100%" }}
      tabIndex="0"
    >
      <CardHeader className="flex-row justify-between items-center bg-green-600 py-3 rounded">
        <CardTitle id={`${mainHeading}-heading`} className="text-lg text-white">
          {mainHeading}
        </CardTitle>

        <Link
          to={link}
          aria-label={`View all ${mainHeading}`}
          className="text-white text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent
        className="p-0 overflow-auto max-h-[390px]"
        aria-live="polite"
      >
        {data?.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <li
                key={index}
                className="px-6 py-4 flex items-start justify-between transition"
              >
                <div className="flex-1">
                  <Link
                    to={link}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                  >
                    <p className="font-semibold text-md">{item.title}</p>
                    <p className="text-sm text-gray-500 mb-2 mt-1">
                      {item?.course?.courseTitle}
                    </p>
                  </Link>
                </div>

                <div
                  className="text-right text-xs text-gray-500 whitespace-nowrap"
                  aria-label={`Created on ${new Date(
                    item.createdAt
                  ).toDateString()}`}
                >
                  {item.createdAt && (
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  )}
                  {item.time && <p>{item.time}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm text-gray-500 py-10">
            No data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DeshBoardCourseCard({ mainHeading, data, link, height }) {
  return (
    <Card
      role="region"
      aria-labelledby={`${mainHeading}-heading`}
      className="bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full"
      style={{ height: height || "100%" }}
      tabIndex="0"
    >
      <CardHeader className="flex-row justify-between items-center bg-green-600 py-3 rounded">
        <CardTitle id={`${mainHeading}-heading`} className="text-lg text-white">
          {mainHeading}
        </CardTitle>

        <Link
          to={link}
          aria-label={`View all ${mainHeading}`}
          className="text-white text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent
        className="p-0 overflow-auto max-h-[390px]"
        aria-live="polite"
      >
        {data?.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <li
                key={index}
                className="px-6 py-4 flex items-start justify-between transition"
              >
                <div className="flex-1">
                  <Link
                    to={`/student/mycourses/${item?._id}`}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                  >
                    {item?.course?.courseTitle ? (
                      <p className="font-semibold text-gray-800">
                        {item.course.courseTitle}
                      </p>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-800">
                          {item.course}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.course?.title}
                        </p>
                      </>
                    )}
                  </Link>
                </div>

                <div
                  className="text-right text-xs text-gray-500 whitespace-nowrap"
                  aria-label={
                    item.enrolledAt
                      ? `Enrolled on ${new Date(
                          item.enrolledAt
                        ).toDateString()}`
                      : item.course.createdAt
                      ? `Created on ${new Date(
                          item.course.createdAt
                        ).toDateString()}`
                      : ""
                  }
                >
                  {item.enrolledAt ? (
                    <>
                      <p>Enrolled at</p>
                      <p>{new Date(item.enrolledAt).toLocaleDateString()}</p>
                    </>
                  ) : item.course.createdAt ? (
                    <p>
                      {new Date(item.course.createdAt).toLocaleDateString()}
                    </p>
                  ) : null}

                  {item?.course?.time && <p>{item.course.time}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-sm text-gray-500 py-10">
            No data available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Assignment({ mainHeading, data, bgcolor, bordercolor, height }) {
  return (
    <Card
      className={`bg-gray-100 border-0 my-auto py-0 gap-2 rounded h-full`}
      style={{ height: height || "100%" }} // Same height as DeshBoardCard
    >
      <CardHeader className="flex-row justify-between items-center bg-green-600 py-3 rounded">
        <CardTitle className="text-lg text-white">Assessment Due</CardTitle>
        <Link to="assignment" className="text-white text-xs">
          View All
        </Link>
      </CardHeader>
      <CardContent className={`p-0 ${bgcolor}`}>
        <Link to="assignment">
          <div className={`divide-y`}>
            {data.map((assignment, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between">
                  <h3 className="hover:font-semibold font-semibold transition-all duration-300 cursor-pointer">
                    {assignment.course}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Due: {assignment.dueDate}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm mt-2  transition-all duration-300 cursor-pointer">
                  {assignment.Assignment}
                </p>
              </div>
            ))}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

function AnnouncementCard({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card className="w-full mx-auto rounded-2xl bg-white shadow-sm hover:shadow-md transition duration-200">
      <CardContent className="p-0 divide-y divide-gray-200">
        {data?.map((announcement, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="px-6 py-4">
              {/* Title and Date */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleOpen(index)}
                aria-expanded={isOpen}
                aria-controls={`announcement-content-${index}`}
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {announcement.title}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{announcement.date}</p>
                  {isOpen ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </div>
              </div>

              {/* Course */}
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium text-gray-800">Course:</span>{" "}
                {announcement.course}
              </p>

              {/* Dropdown content */}
              {isOpen && (
                <div
                  className="mt-3 space-y-2"
                  id={`announcement-content-${index}`}
                  role="region"
                  aria-labelledby={`announcement-toggle-${index}`}
                >
                  <p className="text-gray-700">{announcement.message}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Time:</span>{" "}
                    {announcement.time}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
const CourseCard = ({ course, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer border rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-lg transition-all
      ${selected ? "border-green-600 shadow-md" : "border-gray-200"}`}
  >
    {course.thumbnail && (
      <img
        src={course.thumbnail}
        alt={course.courseTitle}
        className="w-24 h-24 object-cover rounded-md mb-3"
      />
    )}

    <h3 className="font-semibold text-gray-800 text-center">
      {course.courseTitle}
    </h3>
  </div>
);
const TransactionCard = ({ title, data }) => (
  <Card className="h-fit p-0 gap-3 rounded mt-5">
    <CardContent className="px-3 py-0">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100">
            <TableHead className="text-xs font-medium text-gray-500 py-3">
              Date
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3">
              Time
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Earnings
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Withdrawals
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500 py-3 text-center">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction, index) => (
            <TableRow key={index} className="border-t border-gray-100">
              <TableCell className="text-sm text-gray-700 py-4">
                {transaction.date}
              </TableCell>
              <TableCell className="text-sm text-gray-700 py-4">
                {transaction.time}
              </TableCell>
              <TableCell className="text-sm text-green-600 py-4 text-center">
                {transaction.type === "Earning"
                  ? `$${transaction.amount}`
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-red-600 py-4 text-center">
                {transaction.type === "Withdrawal"
                  ? `$${transaction.amount}`
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-black py-4 text-center">
                {transaction.balance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const EarningStateCard = ({ data }) => {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center  px-6 h-full">
        <div
          className={`h-12 w-12 rounded-lg flex ${data.bgColor} items-center justify-center mr-4`}
        >
          {data.icon}
        </div>
        <div className="h-full">
          <p className="text-xl font-bold"> {data.value} </p>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const LandingPageCard = ({ name, description, imageUrl, buttonUrl }) => {
  return (
    <Card className="pb-6 pt-0 overflow-hidden cursor-pointer h-full border flex flex-col gap-4">
      <AspectRatio ratio={16 / 5}>
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </AspectRatio>
      <CardHeader>
        {/* <CardTitle>{name}</CardTitle> */}
        <p className="text-md font-bold ">{name}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 gap-6">
          <p className="text-muted-foreground  text-xs ">{description}</p>
          <a
            href={buttonUrl}
            className="inline-flex items-center justify-center w-full px-3 py-2 mt-auto text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Learn more
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

function StudentProfileCourseCard({ course }) {
  const thumbnailUrl = course?.thumbnail?.url;
  const altText = thumbnailUrl
    ? `${course?.courseTitle} course thumbnail`
    : `Thumbnail not available for ${course?.courseTitle}`;

  return (
    <Card
      className="p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-md rounded-xl border hover:border-primary transition duration-300"
      role="group"
      aria-label={`Course card for ${course?.courseTitle}`}
      tabIndex={0} // REMOVE if parent Link already handles focus
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={altText}
            className="w-full h-full object-contain"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full flex items-center justify-center text-gray-400 text-sm"
          >
            No Image
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="flex-1 w-full text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-900">
          {course?.courseTitle}
        </h3>
      </div>
    </Card>
  );
}

function StudentProfileStatCard({ title, value, icon }) {
  return (
    <Card
      className="p-6 flex items-center w-full gap-4 shadow-sm"
      role="region"
      aria-labelledby={`${title.replace(/\s+/g, "-").toLowerCase()}-label`}
    >
      {/* Icon with accessibility label */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Text Section */}
      <div>
        <p
          id={`${title.replace(/\s+/g, "-").toLowerCase()}-label`}
          className="text-gray-500"
        >
          {title}
        </p>

        <p
          className="text-3xl font-bold text-center"
          aria-label={`${title} is ${value}`}
        >
          {value}
        </p>
      </div>
    </Card>
  );
}

const MyCoursesCard = ({ course }) => {
  const courseTitle = course?.course?.courseTitle || "Untitled course";
  const courseCategory = course?.course?.category?.title || "Uncategorized";
  const imageUrl = course?.course?.thumbnail?.url || "/placeholder.svg";

  const altText = course?.course?.thumbnail?.filename
    ? `${course.course.thumbnail.filename} thumbnail`
    : `${courseTitle} course thumbnail`;

  return (
    <article
      role="article"
      aria-label={`Course card for ${courseTitle}`}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-md"
      aria-live="polite"
    >
      <Card className="pb-6 pt-0 w-full overflow-hidden cursor-pointer">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl}
            alt={altText}
            className="object-cover w-full h-full"
          />
        </AspectRatio>

        <CardHeader>
          <div
            className="uppercase text-indigo-600 bg-indigo-100 text-xs font-medium mb-2 w-fit px-2"
            role="note"
            aria-label={`Course category: ${courseCategory}`}
          >
            {courseCategory}
          </div>

          <CardTitle
            className="flex justify-between flex-col gap-2"
            aria-label={`Course title: ${courseTitle}`}
          >
            <span>{courseTitle}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Language:</span>{" "}
              {course?.course?.language || "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

const DiscussionCard = ({ discussion, link }) => {
  return (
    <Link
      key={discussion._id}
      to={link}
      className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 p-4 bg-white group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      tabIndex={0}
      aria-label={`Discussion titled "${discussion.topic}", type ${
        discussion.type
      }, created on ${new Date(
        discussion.createdAt
      ).toLocaleDateString()}, for course ${discussion.course?.courseTitle}`}
    >
      {/* Course Thumbnail */}
      <div className="overflow-hidden rounded-md mb-2">
        <img
          src={discussion.course.thumbnail.url}
          alt={discussion.topic || "Course Thumbnail"}
          className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300 ease-in-out"
        />
      </div>

      {/* Due Date */}
      {discussion.dueDate && (() => {
        const dateStr = discussion.dueDate.date;
        const timeStr = discussion.dueDate.time;
        if (!dateStr) return null;
        let dateObj;
        try {
          if (timeStr) {
            const datePart = new Date(dateStr).toISOString().split("T")[0];
            dateObj = new Date(`${datePart}T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`);
          } else {
            dateObj = new Date(dateStr);
          }
          if (isNaN(dateObj.getTime())) throw new Error("Invalid");
        } catch {
          return (
            <div className="flex items-center gap-2 text-xs mt-1">
              <p className="text-gray-600 font-bold">Due Date:</p>
              <p className="text-gray-500">Invalid date</p>
            </div>
          );
        }
        return (
          <div
            className="flex items-center gap-2 text-xs mt-1"
            aria-label="Due date information"
          >
            <p className="text-gray-600 font-bold">Due Date:</p>
            <p className="text-gray-500">
              {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
          </div>
        );
      })()}

      {/* Type Badge */}
      <div
        className="border w-fit px-2 py-1 rounded-full border-gray-200 m-2 bg-indigo-600"
        aria-label={`Discussion type: ${discussion?.type}`}
      >
        <p className="text-xs text-white">{discussion?.type}</p>
      </div>

      {/* Metadata */}
      <div className="flex justify-between items-center mt-3">
        <h2 className="font-semibold text-lg text-gray-800 truncate">
          {discussion?.topic}
        </h2>
        <span className="text-xs text-gray-500">
          {new Date(discussion?.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Course Title */}
      <p className="text-sm text-indigo-700 font-medium">
        {discussion?.course?.courseTitle}
      </p>

      {/* Description */}
      <p
        className="text-sm text-gray-700 line-clamp-2"
        aria-label="Discussion description"
      >
        {discussion?.description}
      </p>
    </Link>
  );
};



export default Card;

export {
  DeshboardAnnouncementCard,
  DeshBoardCourseCard,
  Assignment,
  AnnouncementCard,
  CourseCard,
  TransactionCard,
  EarningStateCard,
  LandingPageCard,
  StudentProfileCourseCard,
  StudentProfileStatCard,
  MyCoursesCard,
  DiscussionCard,
  ParentCoursesCard,
};
