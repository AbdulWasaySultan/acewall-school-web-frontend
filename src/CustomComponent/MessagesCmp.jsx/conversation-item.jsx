import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import avatar from "../../assets/avatar.png";
import { formatDistanceToNow } from "date-fns";

export default function ConversationItem({ conversation, isActive, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        "flex justify-center gap-2 p-6 rounded-xl border-2 shadow-sm cursor-pointer transition-all hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
        isActive && "bg-green-50 border-green-200 shadow-md"
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Conversation with ${conversation.otherMember.name}. ${
        conversation.unreadCount > 0
          ? `${conversation.unreadCount} unread messages`
          : "No unread messages"
      }`}
    >
      {" "}
      <Avatar className="h-16 w-16 flex items-center justify-center rounded-full border-2 border-green-200">
        <AvatarImage
          src={conversation.otherMember.profileImg?.url || avatar}
          alt={`Profile image of ${conversation.otherMember.name}`}
          className="w-full h-full bg-cover rounded-full"
        />{" "}
        <AvatarFallback className="text-green-500 font-bold">
          {conversation.otherMember.name[0]}{" "}
        </AvatarFallback>{" "}
      </Avatar>
      <section
        className="flex justify-between items-center py-2 gap-4 w-full"
        aria-label="Conversation details"
      >
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-md font-medium text-gray-800 truncate">
            {conversation.otherMember.firstName
              ? `${conversation.otherMember.firstName} ${conversation.otherMember.lastName || ""}`.trim()
              : conversation.otherMember.name}
          </h3>

          {conversation.lastMessage ? (
            <div className="flex items-center rounded-lg mt-1">
              <p className="text-xs text-gray-600 italic truncate flex-1">
                {conversation.lastMessage}
              </p>

              {conversation.unreadCount > 0 && (
                <div
                  className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                  aria-label={`${conversation.unreadCount} unread messages`}
                >
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center rounded-lg mt-1">
              <p className="text-xs text-gray-600 italic truncate flex-1">
                No messages yet
              </p>
            </div>
          )}
        </div>

        <div className="text-right min-w-fit ml-2">
          <p className="text-xs text-gray-500">
            {conversation?.lastMessageDate &&
              formatDistanceToNow(new Date(conversation.lastMessageDate), {
                addSuffix: true,
              })}
          </p>
        </div>
      </section>
    </div>
  );
}
