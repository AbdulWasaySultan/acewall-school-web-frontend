import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBox from "@/CustomComponent/SearchBox";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader, BookOpen } from "lucide-react";
import { ParentCoursesCard } from "@/CustomComponent/Card";

const ChildCourseCards = () => {
  const { studentId } = useParams(); 
  const [enrollment, setEnrollment] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searching = searchQuery.trim() !== "";

  useEffect(() => {
    const fetchChildCourses = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/parent/child-courses/${studentId}`,
          { params: { search: searchQuery } }
        );

        if (res.data.success) {
          setEnrollment(res.data.enrolledCourses || []);
          setStudentName(res.data.studentName || "Student");
        }
      } catch (error) {
        console.error("Error fetching child courses:", error);
        setEnrollment([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchChildCourses, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, studentId]);

  return (
    <section className="p-4 md:p-6 min-h-screen bg-gray-50/30">
      <header className="flex flex-col pb-5 gap-5 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl py-4 pl-6 font-semibold bg-green-600 text-white rounded-lg flex items-center gap-2">
            <BookOpen size={20} />
            {studentName ? `${studentName}'s Courses` : "Enrolled Courses"}
          </h1>
        </div>

        <div role="search" className="bg-white p-2 rounded-xl shadow-sm border">
          <SearchBox query={searchQuery} setQuery={setSearchQuery} />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-4">
          <Loader className="animate-spin text-green-600" size={40} />
          <p className="text-gray-500 animate-pulse">Fetching curriculum data...</p>
        </div>
      ) : enrollment.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          {searching ? (
            <>
              <h2 className="text-xl font-semibold text-gray-700">No matching courses for "{searchQuery}"</h2>
              <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <BookOpen size={48} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700">No active enrollments</h2>
              <p className="text-gray-500 mt-2 max-w-xs">This student is not currently enrolled in any courses.</p>
            </>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollment.map((enroll) => (
            <li key={enroll._id} className="list-none">
              <Link
                /** * IMPORTANT: 
                 * Pass enroll._id (the Enrollment ID) as the enrollmentId param 
                 * so your detail API can perform the $match correctly.
                 */
                to={`/parent/${studentId}/course-detail/${enroll._id}`}
                className="group block focus:outline-none"
              >
                <div className="transition-all duration-300 group-hover:-translate-y-2">
                  <ParentCoursesCard course={enroll} />
                  <div className="mt-2 text-center">
                    <span className="text-xs font-bold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      View Progress Details →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ChildCourseCards;