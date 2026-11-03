import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBox from "@/CustomComponent/SearchBox";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { MyCoursesCard } from "@/CustomComponent/Card";
import { Loader } from "lucide-react";

const CourseCards = () => {
  const [enrollment, setEnrollment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(GlobalContext);

  const searching = searchQuery.trim() !== "";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get("/enrollment/studentCourses", {
            params: { search: searchQuery },
          });

          setEnrollment(res.data.enrolledCourses || []);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setEnrollment([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCourses();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <section
      className="p-3 md:p-0"
      aria-labelledby="my-courses-title"
      aria-live="polite"
    >
      <header className="flex flex-col pb-5 gap-5 mb-10">
        <h1
          id="my-courses-title"
          className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg"
        >
          My Courses
        </h1>

        <div role="search" aria-label="Search my courses">
          <SearchBox query={searchQuery} setQuery={setSearchQuery} />
        </div>
      </header>

      {/* LOADING */}
      {loading ? (
        <div
          className="flex justify-center items-center py-10"
          role="status"
          aria-busy="true"
          aria-live="assertive"
        >
          <Loader className="animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading courses...</span>
        </div>
      ) : enrollment.length === 0 ? (
        /* EMPTY LIST */
        <div
          className="flex flex-col items-center justify-center text-center px-4"
          aria-live="polite"
        >
          {searching ? (
            <>
              <h2 className="text-2xl font-semibold text-muted-foreground">
                No courses found for "{searchQuery}"
              </h2>

              <p className="text-md mt-4 text-muted-foreground">
                Try a different keyword or explore all courses.
              </p>

              <Button
                className="mt-6 bg-green-500 text-white hover:bg-acewall-main"
                onClick={() => setSearchQuery("")}
                aria-label="Reset search and show all courses"
              >
                Reset Search
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-muted-foreground">
                Kickstart your learning journey
              </h2>

              <p className="text-lg text-muted-foreground mt-2">
                When you enroll in a course, it will appear here.
              </p>
            </>
          )}
        </div>
      ) : (
        /* COURSE GRID */
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Enrolled courses list"
        >
          {enrollment.map((course) => (
            <li key={course._id} className="list-none">
              <Link
                to={`/student/mycourses/${course._id}?courseId=${
                  course.course?._id || course.course
                }`}
                aria-label={`Open course ${
                  course.course?.courseTitle || course.course
                }`}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 rounded block"
              >
                <MyCoursesCard course={course} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CourseCards;
