import { useContext, useEffect, useState } from "react";
import { Loader, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MessageList from "./messages-list";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useParams } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";
import avatar from "../../assets/avatar.png";
import { dynamicDecrypt } from "../../utils/autoCrypto.js";

export default function ChatWindow() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, socket, currentConversation } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const activeConversation = useParams().id;

  const subscribeToMessages = () => {
    socket?.on("newMessage", (message) => {
      const decrypted = dynamicDecrypt(message);
      setMessages((prev) => [decrypted, ...prev]);
    });
  };

  const unsubscripteToMessages = () => {
    socket?.off("newMessage");
  };

  const getMessages = async (page = 1, limit = 10) => {
    try {
      const res = await axiosInstance.get(
        `/messeges/get_updated/${activeConversation}?page=${page}&limit=${limit}`
      );
      const initialMessages = res.data.messages;
      setMessages(initialMessages);
      setHasMore(initialMessages.length === limit);
      setPage(page);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (activeConversation) {
      setHasMore(true);
      setPage(1);
      getMessages();
      subscribeToMessages();
    }
    return () => unsubscripteToMessages();
  }, [activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      axiosInstance.post(`messeges/markAsRead_updated/${activeConversation}`);
      axiosInstance.patch(`conversation/lastSeen/${activeConversation}`);
    }
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      await axiosInstance.post(
        `/messeges/create_updated/${activeConversation}`,
        {
          text: newMessage,
        }
      );
      getMessages();
      setNewMessage("");
      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId: activeConversation,
        text: newMessage,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-[500px] overflow-auto hide-scrollbar border-gray-200"
      role="region"
      aria-label={`Chat window with ${currentConversation?.otherMember.name}`}
    >
      {" "}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={currentConversation?.otherMember.profileImg?.url || avatar}
              alt={`Profile image of ${
                currentConversation?.otherMember.firstName
                  ? `${currentConversation.otherMember.firstName} ${currentConversation.otherMember.lastName || ""}`.trim()
                  : currentConversation?.otherMember.name
              }`}
            />{" "}
            <AvatarFallback>
              {currentConversation?.otherMember.firstName
                ? currentConversation.otherMember.firstName[0]
                : currentConversation?.otherMember.name?.[0] || ""}
            </AvatarFallback>{" "}
          </Avatar>{" "}
          <div>
            {" "}
            <h3 className="font-medium">
              {currentConversation?.otherMember.firstName
                ? `${currentConversation.otherMember.firstName} ${currentConversation.otherMember.lastName || ""}`.trim()
                : currentConversation?.otherMember.name}
            </h3>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      <MessageList
        messages={messages}
        setMessages={setMessages}
        activeConversation={activeConversation}
        subscribeToMessages={subscribeToMessages}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
        setHasMore={setHasMore}
        loadingMessage={loadingMessage}
        setLoadingMessage={setLoadingMessage}
        loading={loading}
        setLoading={setLoading}
      />
      <div
        className="p-4 border-t border-gray-200"
        role="region"
        aria-label="Message input area"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type your message"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              aria-label="Type your message"
            />
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 rounded-full h-12 w-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim()}
            aria-label="Send message"
          >
            {loading ? (
              <Loader
                className="h-6 w-6 animate-spin text-white"
                aria-label="Sending message"
              />
            ) : (
              <Send className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
