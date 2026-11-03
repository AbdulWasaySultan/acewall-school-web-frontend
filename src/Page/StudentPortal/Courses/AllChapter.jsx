import BackButton from "@/CustomComponent/BackButton";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AllChapter = () => {
  const { courseId, quarterId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [quarterStartDate, setQuarterStartDate] = useState("");
  const [quarterEndDate, setQuarterEndDate] = useState("");
  const [error, setError] = useState(null);

  console.log(error, "chapter error");

  const fetchQuarterDetail = async () => {
    try {
      const res = await axiosInstance.get(`chapter/${courseId}/${quarterId}`);
      setChapters(res.data.chapters);
      setQuarterStartDate(res.data.quarterStartDate);
      setQuarterEndDate(res.data.quarterEndDate);
    } catch (err) {
      console.error(err);
      setError(err.response.data.message || "Failed to load chapters");
      setChapters([]);
    }
  };

  useEffect(() => {
    fetchQuarterDetail();
  }, []);

  return (
    <div>
      <BackButton className="mb-10" />

      <h2 className="text-lg font-semibold mb-4">Chapters</h2>

      {error && <p className="text-red-600">{error}</p>}

      {chapters?.map((chapter, index) => (
        <Link
          key={chapter._id}
          to={`/student/mycourses/${courseId}/quarter/${quarterId}/chapter/${chapter._id}`}
          className="block mb-4 border border-gray-200 p-5 rounded-lg bg-blue-50 
                     hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Open chapter ${index + 1}: ${chapter.title}`}
        >
          <h3 className="font-semibold text-md">
            Chapter {index + 1}: {chapter.title}
          </h3>

          <p className="font-light text-sm text-muted-foreground">
            {chapter.description}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default AllChapter;
