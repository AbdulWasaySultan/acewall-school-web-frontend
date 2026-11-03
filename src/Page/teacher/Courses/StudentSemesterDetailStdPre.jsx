import { CourseContext } from "@/Context/CoursesProvider";
import BackButton from "@/CustomComponent/BackButton";
import { axiosInstance } from "@/lib/AxiosInstance";
import { format } from "date-fns";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";

const StudentSemesterDetailStdPre = () => {
  const { semesterId, courseId } = useParams();
  const { quarters } = useContext(CourseContext);
  const [allQuarter, setAllQuarter] = useState([]);

  useEffect(() => {
    const fetchQuarters = async () => {
      try {
        const res = await axiosInstance.get(`quarter/get/${semesterId}`);
        const fetchedQuarters = res.data.quarters || [];

        const selectedQuarterIds = new Set(
          Array.isArray(quarters)
            ? quarters.map((quar) => quar?._id?.toString())
            : []
        );

        const selectedQuarters = fetchedQuarters.filter((q) =>
          selectedQuarterIds.has(q._id?.toString())
        );

        setAllQuarter(selectedQuarters);
      } catch (err) {
        console.error("Error fetching quarters:", err);
      }
    };

    fetchQuarters();
  }, [semesterId, quarters]);

  return (
    <section className="space-y-4" aria-labelledby="quarters-heading">
      <BackButton className="mb-10" />

      <header>
        <h2 id="quarters-heading" className="text-lg font-semibold text-black">
          Quarters
        </h2>
      </header>

      {allQuarter?.length > 0 ? (
        <ul className="space-y-4" role="list">
          {allQuarter.map((quarter) => {
             const start = format(new Date(quarter.startDate ? quarter.startDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy");
             const end = format(new Date(quarter.endDate ? quarter.endDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy");

            return (
              <li key={quarter._id}>
                <Link
                  to={`/teacher/courses/${courseId}/quarterstdpre/${quarter._id}`}
                  className="block border border-gray-300 p-5 rounded-lg bg-blue-50 hover:bg-blue-100 
                                               focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  aria-label={`Open quarter ${quarter.title} from ${start} to ${end}`}
                >
                  <h3 className="font-semibold text-md text-gray-900">
                    Quarter: {quarter.title}
                  </h3>
                  <p className="text-xs text-gray-700">
                    {start} – {end}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-700" aria-live="polite" role="status">
          No quarters selected.
        </p>
      )}
    </section>
  );
};

export default StudentSemesterDetailStdPre;
