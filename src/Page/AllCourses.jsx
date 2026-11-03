import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import avatar from "@/assets/avatar.png";
import SearchBox from "@/CustomComponent/SearchBox";
import SearchCourseDialog from "@/CustomComponent/CodeEnrollmentDialog";

const AllCourses = () => {
  const { subcategoryId } = useParams();
  const { user } = useContext(GlobalContext);

  const [allCourses, setAllCourses] = useState([]);
  const [subCat, setSubCat] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searching = searchQuery.trim() !== "";

  // Fetch subcategory + category
  const getSubCatWithCategory = async () => {
    try {
      const res = await axiosInstance.get(`subcategory/getSubcategoryWithCategory/${subcategoryId}`);
      setSubCat(res.data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategory:", error);
    }
  };

  useEffect(() => {
    if (subcategoryId) getSubCatWithCategory();
  }, [subcategoryId]);

  // Fetch courses with search debounce
  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(`/course/${subcategoryId}`, {
          params: { search: searchQuery },
        });
        setAllCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    }, 500); // reduced debounce for snappier UX

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, subcategoryId]);

  return (
    <section className="p-3 md:p-0">
      {/* Header */}
      <div className="flex flex-col pb-5 gap-2">
        <div className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg flex gap-3">
          {subCat?.category?.title ? (
            <p>
              {subCat.category.title} / {subCat.title}
            </p>
          ) : (
            <Loader className="animate-spin" />
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <SearchBox query={searchQuery} setQuery={setSearchQuery} />
          <SearchCourseDialog />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin" size={48} />
        </div>
      ) : allCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          {searching ? (
            <>
              <img
                src="https://img.freepik.com/free-vector/no-results-concept-illustration_114360-746.jpg"
                alt="No search results"
                className="w-72 h-72 object-contain mb-6"
              />
              <h1 className="text-2xl font-semibold text-muted-foreground">
                No course found for "{searchQuery}"
              </h1>
              <p className="text-md mt-4 text-muted-foreground">
                Try a different keyword or explore all your courses.
              </p>
              <ul className="list-disc pl-6 leading-relaxed mt-4 text-left text-muted-foreground">
                <li>Check spelling</li>
                <li>Try different or more general terms</li>
              </ul>
              <Button
                className="mt-6 bg-green-500 text-white hover:bg-acewall-main"
                onClick={() => setSearchQuery("")}
              >
                Reset Search
              </Button>
            </>
          ) : (
            <>
              <img
                src="https://img.freepik.com/free-vector/empty-concept-illustration_114360-1188.jpg"
                alt="No courses"
                className="w-72 h-72 object-contain mb-6"
              />
              <p className="text-2xl font-bold text-muted-foreground">
                No courses available at the moment.
              </p>
              <p className="text-md mt-2 text-muted-foreground">
                Please check back later or contact support.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course) => (
              <Link key={course._id} to={`/student/course/detail/${course._id}`}>
                <Card className="pb-6 pt-0 w-full h-full overflow-hidden cursor-pointer">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={course?.thumbnail?.url || "/placeholder.svg"}
                      alt={course?.thumbnail?.filename || "Course image"}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <CardHeader>
                    <CardTitle className="flex flex-col gap-2">
                      <span className="text-md font-bold leading-tight capitalize">
                        {course.courseTitle}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <img
                        src={course.createdby?.profileImg?.url || avatar}
                        className="w-5 h-5 rounded-full"
                        alt={course.createdby?.firstName || "Instructor"}
                      />
                      <p className="text-sm text-muted-foreground">
                        {`${course.createdby?.firstName || ""} ${course.createdby?.middleName || ""} ${course.createdby?.lastName || ""}`.trim()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AllCourses;
