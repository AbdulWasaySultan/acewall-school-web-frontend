import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";
import ChatBox from "@/CustomComponent/Discussion/ChatBox";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Files, Settings } from "lucide-react";
import BackButton from "@/CustomComponent/BackButton";
import { Button } from "@/components/ui/button";
import EditDiscussionDialog from "@/CustomComponent/CreateCourse/EditDiscussion";
import { DeleteModal } from "@/CustomComponent/CreateCourse/DeleteModal";

const TeacherDiscussionChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);

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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Refs for focus management
  const modalCloseButtonRef = useRef(null);
  const triggerElementRef = useRef(null);

  const fetchdiscussion = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`discussion/${id}`);
      setDiscussion(res.data.discussion);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchdiscussion();
  }, [id]);

  // Focus management for modal
  useEffect(() => {
    if (modalOpen && modalCloseButtonRef.current) {
      modalCloseButtonRef.current.focus();
    }
  }, [modalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && modalOpen) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  // Open modal with file content
  const openModal = (file, buttonRef) => {
    triggerElementRef.current = buttonRef;
    setModalContent(file);
    setModalOpen(true);
  };

  // Close modal and return focus
  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    // Return focus to the trigger element
    if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg">Loading discussion...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <section className="flex justify-between items-center">
        <BackButton />
      </section>

      <main className="w-full p-6 bg-white rounded-xl shadow-md">
        <div className="py-4 mb-6 pl-6 rounded-lg bg-green-600 text-white flex justify-between items-center">
          <p className="text-2xl font-bold">Discussion</p>
          <div className="mr-2 flex items-center gap-1">
            <EditDiscussionDialog discussion={discussion} fetchDiscussion={fetchdiscussion} />
            <Link to={`/teacher/discussions/${id}/settings`}>
              <Button className="text-white" variant="ghost" size="sm">
                <Settings className="mr-1 h-4 w-4" /> Settings
              </Button>
            </Link>
            <DeleteModal
              chapterID={id}
              what="Discussion"
              modelName="Discussion"
              onSuccess={() => navigate(-1)}
              triggerText="Delete"
              triggerClassName="text-white hover:text-red-200 bg-red-650 hover:bg-red-700 h-9 px-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors border border-red-500 shadow-sm"
            />
          </div>
        </div>

        <section
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4"
          aria-label="Discussion metadata"
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-bold">Due Date:</span>
            <div className="flex items-center gap-2 text-gray-500">
              {formatDateTime(discussion?.dueDate?.date, discussion?.dueDate?.time)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-bold">Total Marks:</span>
            <span className="text-gray-500">{discussion.totalMarks}</span>
          </div>
        </section>

        <h2 className="text-2xl font-semibold mb-2">{discussion.topic}</h2>
        <p className="text-lg text-gray-600 mb-6">{discussion.description}</p>

        {discussion?.files && discussion.files.length > 0 && (
          <section aria-label="Discussion files">
            <h3 className="sr-only">Attached Files</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {discussion.files.map((file, index) => (
                <button
                  key={index}
                  onClick={(e) => openModal(file, e.currentTarget)}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  type="button"
                  aria-label={`View ${file.filename}, ${file.type === "application/pdf" ? "PDF file" : "image file"
                    }`}
                >
                  {file.type === "application/pdf" ? (
                    <>
                      <Files
                        className="h-6 w-6 text-red-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-blue-700 truncate">
                        {file.filename}
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        src={file.url}
                        alt=""
                        className="h-10 w-10 object-cover rounded-md"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-blue-700 truncate">
                        {file.filename}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <ChatBox discussionId={id} discussion={discussion} />

      {/* Modal */}
      {modalOpen && modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] overflow-auto"
            role="document"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 id="modal-title" className="text-lg font-semibold">
                {modalContent.filename}
              </h2>
              <button
                ref={modalCloseButtonRef}
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-600 rounded p-1"
                aria-label="Close dialog"
                type="button"
              >
                ×
              </button>
            </div>

            {modalContent.type === "application/pdf" ? (
              <iframe
                src={modalContent.url}
                title={`PDF viewer: ${modalContent.filename}`}
                className="w-full h-[80vh]"
                aria-label={`PDF document: ${modalContent.filename}`}
              />
            ) : (
              <img
                src={modalContent.url}
                alt={`Full view of ${modalContent.filename}`}
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDiscussionChat;
