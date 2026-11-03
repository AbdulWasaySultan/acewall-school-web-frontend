import { CourseContext } from "@/Context/CoursesProvider";
import BackButton from "@/CustomComponent/BackButton";
import { axiosInstance } from "@/lib/AxiosInstance";
import { format } from "date-fns";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";

const SemesterDetail = () => {
  const { id, courseId } = useParams();
  const { quarters } = useContext(CourseContext);
  const [allQuarter, setallQuarter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuarters = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await axiosInstance.get(`quarter/get/${id}`);
        const fetchedQuarters = res.data.quarters;

        const selectedQuarterIds = new Set(
          quarters.map((quar) => quar?._id.toString())
        );

        console.log(selectedQuarterIds, "selectedQuarterIds");
        const selectedQuarters = fetchedQuarters.filter((q) =>
          selectedQuarterIds.has(q._id?.toString())
        );

        setallQuarter(selectedQuarters);
      } catch (err) {
        console.error(err);
        setError("Failed to load quarters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuarters();
  }, [id, quarters]);

  return (
    <main className="space-y-4" aria-labelledby="page-heading">
      <BackButton className="mb-10" aria-label="Go back to previous page" />
      
      <div className="w-full">
        <h1 id="page-heading" className="text-lg font-semibold text-black">
          Quarters
        </h1>
      </div>

      {isLoading ? (
        <div 
          className="text-sm text-gray-500 py-4"
          role="status"
          aria-live="polite"
        >
          Loading quarters...
        </div>
      ) : error ? (
        <div 
          className="text-sm text-red-500 py-4"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      ) : allQuarter?.length > 0 ? (
        <nav aria-label="Quarter list">
          <ul className="space-y-4" role="list">
            {allQuarter.map((quarter, index) => {
              const startDate = format(new Date(quarter.startDate ? quarter.startDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy");
              const endDate = format(new Date(quarter.endDate ? quarter.endDate.replace(/-/g, '/') : new Date()), "MMMM do, yyyy");
              
              return (
                <li key={quarter._id} role="listitem">
                  <Link 
                    to={`/teacher/courses/${courseId}/quarter/${quarter._id}`}
                    className="block mb-4 border border-gray-200 p-5 rounded-lg bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-label={`View ${quarter.title}, from ${startDate} to ${endDate}`}
                  >
                    <article>
                      <h2 className="font-semibold text-md">
                        Quarter: {quarter.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        <time dateTime={quarter.startDate}>
                          {startDate}
                        </time>
                        {" - "}
                        <time dateTime={quarter.endDate}>
                          {endDate}
                        </time>
                      </p>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : (
        <p 
          className="text-sm text-muted-foreground py-4"
          role="status"
        >
          No quarters selected for this semester.
        </p>
      )}
    </main>
  );
};

export default SemesterDetail;