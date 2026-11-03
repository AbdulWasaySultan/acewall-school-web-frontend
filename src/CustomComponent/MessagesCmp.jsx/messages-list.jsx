import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import avatar from "../../assets/avatar.png";
import { Button } from "@/components/ui/button";

export default function MessageList({
  messages,
  setMessages,
  activeConversation,
  page,
  setPage,
  hasMore,
  setHasMore,
  loadingMessage,
}) {
  const { user } = useContext(GlobalContext);
  const myId = user._id;

  const loadMoreMessages = async () => {
    if (!hasMore || loadingMessage) return;

    setLoadingMessage(true);
    try {
      const res = await axiosInstance.get(
        `/messeges/get_updated/${activeConversation}?page=${page + 1}&limit=10`
      );
      const olderMessages = res.data.messages;

      if (olderMessages.length < 10) {
        setHasMore(false);
      }

      setMessages((prevMessages) => [...prevMessages, ...olderMessages]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more messages:", err);
    } finally {
      setLoadingMessage(false);
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-6"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {hasMore && (
        <div className="flex justify-center p-2">
          <Button
            variant="outline"
            onClick={loadMoreMessages}
            disabled={loadingMessage}
            className="text-gray-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
            aria-label={
              loadingMessage ? "Loading more messages" : "Load more messages"
            }
          >
            {loadingMessage ? "Loading..." : "See More"}
          </Button>
        </div>
      )}

      <ul className="space-y-4" role="list">
        {messages.length === 0 ? (
          <li className="text-center text-gray-500">No messages yet</li>
        ) : (
          messages
            ?.slice()
            .reverse()
            .map((message) => {
              const isMyMessage = message?.sender._id === myId;

              return (
                <li
                  key={message._id}
                  className={cn(
                    "flex gap-3",
                    isMyMessage ? "justify-end" : "justify-start"
                  )}
                  aria-label={`Message from ${
                    isMyMessage ? "you" : message.sender.name
                  } at ${message.createdAt.split("T")[1].split(".")[0]}`}
                >
                  {!isMyMessage && (
                    <div className="flex-shrink-0 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={message.sender.profileImg?.url || avatar}
                          alt={message.sender.name}
                        />
                        <AvatarFallback>
                          {message.sender.name}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                      isMyMessage
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <p>{message.text}</p>
                    <time
                      dateTime={message.createdAt}
                      className={cn(
                        "text-xs mt-1",
                        isMyMessage
                          ? "text-green-200 text-right"
                          : "text-gray-500"
                      )}
                    >
                      {message.createdAt.split("T")[1].split(".")[0]}
                    </time>
                  </div>
                </li>
              );
            })
        )}
      </ul>
    </div>
  );
}
