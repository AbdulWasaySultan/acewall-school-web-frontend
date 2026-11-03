import { Loader, Plus, Search } from "lucide-react";
import ConversationItem from "./conversation-item";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";
import TeacherDropdown from "../Student/createConversationDropdown";

export default function ConversationList({
  activeConversation,
  setActiveConversation,
  open,
  setOpen,
}) {
  const [conversations, setConversations] = useState([]);
  const { user, currentConversation, setCurrentConversation } =
    useContext(GlobalContext);
  const [teacher, setTeacher] = useState([]);
  const [loading, setLoading] = useState(true);

  const getConversations = () => {
    axiosInstance
      .get("/conversation/get-updated")
      .then((res) => {
        setConversations(res.data.conversations);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getConversations();
  }, []);

  const handleActiveConversation = async (id) => {
    setActiveConversation(id);
  };

  const fetchCoursesbystudent = async () => {
    await axiosInstance
      .get(`/conversation/getTeacherforStudent`)
      .then((res) => {
        setTeacher(res.data.teachers);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCoursesbystudent();
  }, []);

  return (
    <div
      className="h-full hide-scrollbar p-4"
      role="region"
      aria-label="Conversations list"
    >
      {user.role === "student" && (
        <TeacherDropdown
          teachers={teacher}
          getConversations={getConversations}
        />
      )}
      {loading && (
        <div
          className="flex justify-center items-center py-10"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader className="animate-spin" aria-label="Loading conversations" />
        </div>
      )}
      {conversations && conversations.length > 0 ? (
        <ul className="gap-3 flex flex-col mt-4">
          {conversations.map((conversation) => (
            <li key={conversation._id}>
              <Link
                onClick={() => {
                  setCurrentConversation(conversation);
                  setOpen(false);
                }}
                to={
                  user.role === "student"
                    ? `/student/messages/${conversation.conversationId}`
                    : `/teacher/messages/${conversation.conversationId}`
                }
                className={`focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
                aria-current={
                  currentConversation?._id === conversation._id
                    ? "page"
                    : undefined
                }
              >
                <ConversationItem conversation={conversation} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="text-center text-gray-500 mt-10"
          role="status"
          aria-live="polite"
        >
          No conversations found.
        </div>
      )}
    </div>
  );
}
