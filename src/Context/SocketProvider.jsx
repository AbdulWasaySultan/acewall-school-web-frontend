import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // ✅ Setup socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✅ Fetch all conversations on load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("/api/conversations");
        setConversations(res.data.conversations);

        // Also load unread counts per conversation
        const countPromises = res.data.conversations.map((c) =>
          axios
            .get(`/api/conversations/${c.conversationId}/unread-count`)
            .then((r) => ({ id: c.conversationId, count: r.data.unreadCount }))
        );

        const counts = await Promise.all(countPromises);
        const countMap = {};
        counts.forEach((item) => {
          countMap[item.id] = item.count;
        });

        setUnreadCounts(countMap);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };

    fetchConversations();
  }, []);

  // ✅ Handle new message via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isCurrentOpen = currentConversationId === newMessage.conversationId;

      if (!isCurrentOpen) {
        setUnreadCounts((prev) => ({
          ...prev,
          [newMessage.conversationId]: (prev[newMessage.conversationId] || 0) + 1,
        }));
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === newMessage.conversationId
            ? {
                ...conv,
                lastMessage: newMessage.text,
                lastMessageDate: newMessage.createdAt,
                unreadCount: isCurrentOpen ? 0 : (conv.unreadCount || 0) + 1,
              }
            : conv
        )
      );
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, currentConversationId]);

  // ✅ Mark conversation as read when opened
  useEffect(() => {
    if (currentConversationId) {
      axios.post(`/api/conversations/${currentConversationId}/mark-as-read`);

      setUnreadCounts((prev) => ({
        ...prev,
        [currentConversationId]: 0,
      }));

      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === currentConversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }
  }, [currentConversationId]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        conversations,
        unreadCounts,
        messages,
        setMessages,
        currentConversationId,
        setCurrentConversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
