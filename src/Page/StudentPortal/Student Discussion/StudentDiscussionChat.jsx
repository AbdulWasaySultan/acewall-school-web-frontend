import { GlobalContext } from "@/Context/GlobalProvider";
import BackButton from "@/CustomComponent/BackButton";
import ChatBox from "@/CustomComponent/Discussion/ChatBox";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Files, Loader } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StudentDiscussionChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);
  const [error, setError] = useState(null);

  const formatDateTime = (dateStr, timeStr) => {
    try {
      if (!dateStr) return "N/A";
      let dateObj;
      if (timeStr) {
        const datePart = new Date(dateStr).toISOString().split("T")[0];
        dateObj = new Date(`${datePart}T${timeStr}${timeStr.endsWith("Z") ? "" : "Z"}`);
      } else {
        dateObj = new Date(dateStr);
      }
      if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
      return `${dateObj.toLocaleDateString()} at ${dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    } catch {
      return "N/A";
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchDiscussion = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`discussion/v2/${id}`);
        setDiscussion(res.data.discussion);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load discussion.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussion();
  }, [id]);

  console.log(discussion, "discussion");

  const openModal = (file) => {
    setModalContent(file);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  if (loading) {
    return (
      <main
        className="p-6 flex items-center justify-center"
        aria-busy="true"
        aria-live="polite"
      >
        <Loader className="animate-spin" />
      </main>
    );
  }

  if (!discussion) {
    return (
      <main className="p-6">
        <BackButton />
        <p className="mt-2 text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main
      className="flex flex-col gap-4 p-3"
      aria-label="Student Discussion Chat"
    >
      <div className="">
        <BackButton />
      </div>

      <section className="py-4 mb-6 pl-6 rounded-lg bg-green-600 text-white">
        <h1 className="text-2xl font-bold">{discussion.topic}</h1>
      </section>

      <section
        className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white mb-4"
        aria-label="Discussion details"
      >
        <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-semibold">
              {!discussion.isExtended ? "Due Date:" : "Original Due Date:"}
            </span>
            <span className="text-gray-500">
              {formatDateTime(discussion?.dueDate?.date, discussion?.dueDate?.time)}
            </span>
            {discussion.isExtended && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 font-semibold">
                  Extended Due Date:
                </span>
                <span className="text-gray-500">
                  {formatDateTime(discussion?.extendedDueDate?.date, discussion?.extendedDueDate?.time)}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-semibold">Total Marks:</span>
            <span className="text-gray-500">{discussion?.totalMarks || 0}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <div>
            <p className="text-gray-600 font-semibold">📚 Course</p>
            <p className="text-gray-500">
              {discussion?.course?.courseTitle || "Not Assigned"}
            </p>
          </div>
          {discussion?.chapter && (
            <div>
              <p className="text-gray-600 font-semibold">📖 Chapter</p>
              <p className="text-gray-500">
                {discussion?.chapter?.title || "No Chapter"}
              </p>
            </div>
          )}
          {discussion?.lesson && (
            <div>
              <p className="text-gray-600 font-semibold">📖 Lesson</p>
              <p className="text-gray-500">
                {discussion?.lesson?.title || "No Lesson"}
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="text-lg text-gray-600 mb-6">{discussion.description}</p>

      <section
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        aria-label="Discussion attachments"
      >
        {discussion?.files?.map((file, index) => (
          <button
            key={index}
            onClick={() => openModal(file)}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50 hover:bg-white"
            type="button"
            aria-label={`Open file ${file.filename}`}
          >
            {file.type === "application/pdf" ? (
              <>
                <Files className="h-6 w-6 text-red-500" />
                <span className="text-sm font-medium text-blue-700 truncate">
                  {file.filename}
                </span>
              </>
            ) : (
              <>
                <img
                  src={file.url}
                  alt={file.filename}
                  className="h-10 w-10 object-cover rounded-md"
                />
                <span className="text-sm font-medium text-blue-700 truncate">
                  {file.filename}
                </span>
              </>
            )}
          </button>
        ))}
      </section>

      <ChatBox discussionId={id} />

      {modalOpen && modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of file ${modalContent.filename}`}
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] overflow-auto"
          >
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-900 float-right text-xl font-bold mb-2"
              aria-label="Close file preview modal"
            >
              ×
            </button>

            {modalContent.type === "application/pdf" ? (
              <iframe
                src={modalContent.url}
                title={modalContent.filename}
                className="w-full h-[80vh]"
              />
            ) : (
              <img
                src={modalContent.url}
                alt={modalContent.filename}
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default StudentDiscussionChat;
