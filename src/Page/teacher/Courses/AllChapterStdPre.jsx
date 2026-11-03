import BackButton from "@/CustomComponent/BackButton";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AllChapterStdPre = () => {
  const { courseId, quarterId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [quarterStartDate, setQuarterStartDate] = useState("");
  const [quarterEndDate, setQuarterEndDate] = useState("");

  const fetchQuarterDetail = async () => {
    try {
      const res = await axiosInstance.get(`chapter/${courseId}/${quarterId}`);

      setChapters(res.data.chapters || []);
      setQuarterStartDate(res.data.quarterStartDate);
      setQuarterEndDate(res.data.quarterEndDate);
    } catch (err) {
      console.error(err);
      setChapters([]);
    }
  };

  useEffect(() => {
    fetchQuarterDetail();
  }, []);

  return (
    <section className="space-y-4" aria-labelledby="chapters-heading">
      <BackButton className="mb-10" />

      <h2 id="chapters-heading" className="text-lg font-semibold mb-4">
        Chapters
      </h2>

      {chapters.length > 0 ? (
        <ul className="space-y-4" role="list">
          {chapters.map((chapter, index) => {
            const chapterNumber = index + 1;

            return (
              <li key={chapter._id}>
                <Link
                  to={`/teacher/courses/${courseId}/quarterstdpre/${quarterId}/chapterstdpre/${chapter._id}`}
                  className="block border border-gray-300 p-5 rounded-lg bg-blue-50 
                            hover:bg-blue-100 focus:outline-none focus:ring-2 
                            focus:ring-blue-600 focus:ring-offset-2"
                  aria-label={`Open Chapter ${chapterNumber}: ${chapter.title}`}
                >
                  <h3 className="font-semibold text-md text-gray-900">
                    Chapter {chapterNumber}: {chapter.title}
                  </h3>

                  <p className="font-light text-sm text-gray-700">
                    {chapter.description || "No description available."}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-700" aria-live="polite" role="status">
          No chapters available.
        </p>
      )}
    </section>
  );
};

export default AllChapterStdPre;
