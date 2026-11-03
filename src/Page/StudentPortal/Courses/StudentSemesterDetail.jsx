import { CourseContext } from "@/Context/CoursesProvider";
import BackButton from "@/CustomComponent/BackButton";
import { axiosInstance } from "@/lib/AxiosInstance";
import { format } from "date-fns";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";

const StudentSemesterDetail = () => {
  const { semesterId, courseId } = useParams();
  const { quarters } = useContext(CourseContext);
  const [allQuarter, setAllQuarter] = useState([]);
  const [error, setError] = useState(null);

  console.log(error, "error");

  useEffect(() => {
    const fetchQuarters = async () => {
      try {
        const res = await axiosInstance.get(
          `quarter/get/${courseId}/${semesterId}`
        );
        const fetchedQuarters = res.data.quarters;

        const selectedQuarterIds = new Set(
          quarters.map((quar) => quar?._id.toString())
        );

        const selectedQuarters = fetchedQuarters.filter((q) =>
          selectedQuarterIds.has(q._id?.toString())
        );

        setAllQuarter(selectedQuarters);
      } catch (err) {
        console.log(err, "error fetching quarters");
        setError(err.message || "Failed to load quarters");
      }
    };

    fetchQuarters();
  }, [semesterId, quarters]);

  return (
    <div className="space-y-4">
      <BackButton className="mb-10" />

      <h2 className="text-lg font-semibold text-black">Quarters</h2>

      {allQuarter?.length > 0 ? (
        allQuarter.map((quarter) => (
          <Link
            key={quarter._id}
            to={`/student/mycourses/${courseId}/quarter/${quarter._id}`}
            className="block mb-4 border border-gray-200 p-5 rounded-lg bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Open details for ${quarter.title} quarter`}
          >
            <h3 className="font-semibold text-md">Quarter: {quarter.title}</h3>

            <p className="text-xs text-muted-foreground">
              {format(new Date(quarter.startDate ? quarter.startDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")} –{" "}
              {format(new Date(quarter.endDate ? quarter.endDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy")}
            </p>
          </Link>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No quarters selected.</p>
      )}
    </div>
  );
};

export default StudentSemesterDetail;
