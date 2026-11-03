import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Send, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { DiscussionGradeModel } from "./DiscussionGradeModel";

const ChatBox = ({ discussionId, discussion }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [replyCounts, setReplyCounts] = useState({});
  const { user } = useContext(GlobalContext);
  const [sendingComment, setSendingComment] = useState("");
  const [sendingReply, setSendingReply] = useState("");
  const [sendingLoading, setSendingLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState({});
  const [page, setPage] = useState(1);
  const [replyPage, setReplyPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isReplying, setIsReplying] = useState({ status: false, id: null });
  const [hasMoreReplies, setHasMoreReplies] = useState({});
  const [isCommented, setIsCommented] = useState(false);
  const [canComment, setCanComment] = useState(true);

  const formatDate = (timestamp) =>
    formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  const fetchReplyCount = async (commentId) => {
    try {
      const res = await axiosInstance.get(
        `/replyDiscussion/replycount/${commentId}`,
      );
      setReplyCounts((prev) => ({ ...prev, [commentId]: res.data.replyCount }));
    } catch (error) {
      console.error("Error fetching reply count:", error);
    }
  };

  const checkIsCommented = async () => {
    try {
      const res = await axiosInstance.get(
        `discussionComment/isCommentedInDiscussion/${discussionId}`,
      );
      setIsCommented(res.data.commented);
      setCanComment(res.data.canComment);
    } catch (err) {
      console.error(err);
      setCanComment(true);
    }
  };

  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      const res = await axiosInstance.get(
        `discussionComment/v2/get/${discussionId}?page=${pageNum}&limit=5`,
      );
      const data = res.data;

      setHasMore(data.discussionComments.length === 5);

      const updatedComments = append
        ? [...comments, ...data.discussionComments]
        : data.discussionComments;

      setComments(updatedComments);
      checkIsCommented();

      data.discussionComments.forEach((comment) =>
        fetchReplyCount(comment._id),
      );

      if (!append) setPage(1);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  console.log(comments, "comments");

  useEffect(() => {
    fetchComments();
    checkIsCommented();
  }, [discussionId]);

  const fetchReplies = async (pageNum = 1, append = false, commentId) => {
    try {
      const res = await axiosInstance.get(
        `replyDiscussion/get/${commentId}?page=${pageNum}&limit=5`,
      );
      const data = res.data;
      const sortedReplies = data.replies.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );

      setHasMoreReplies((prev) => ({
        ...prev,
        [commentId]: data.replies.length === 5,
      }));

      setReplies((prev) => ({
        ...prev,
        [commentId]:
          append && pageNum > 1
            ? [
                ...(prev[commentId] || []),
                ...sortedReplies.filter(
                  (r) => !(prev[commentId] || []).some((x) => x._id === r._id),
                ),
              ]
            : sortedReplies,
      }));

      if (!append) setReplyPage(1);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchComments(nextPage, true);
    setPage(nextPage);
  };

  const handleLoadReplyMore = (commentId) => {
    const nextPage = replyPage + 1;
    fetchReplies(nextPage, true, commentId);
    setReplyPage(nextPage);
  };

  const sendComment = async () => {
    if (!sendingComment.trim()) return;
    setSendingLoading(true);
    try {
      await axiosInstance.post(
        `discussionComment/sendComment/${discussionId}`,
        {
          text: sendingComment,
        },
      );
      setSendingComment("");
      fetchComments();
      checkIsCommented();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending comment");
    } finally {
      setSendingLoading(false);
    }
  };

  const sendReply = async (commentId) => {
    if (!sendingReply.trim()) return;
    setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
    try {
      await axiosInstance.post(`replyDiscussion/send/${commentId}`, {
        text: sendingReply,
      });
      setSendingReply("");
      fetchReplies(1, false, commentId);
      fetchReplyCount(commentId);
    } catch (err) {
      console.error(err);
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <section
      className="w-full min-h-full p-6 bg-white rounded-xl shadow-md"
      aria-label="Discussion Comments"
    >
      {" "}
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2">
        Comments
      </h2>
      <div className="h-[400px] overflow-y-auto space-y-6 pr-2">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <article key={comment._id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage
                  src={comment?.createdby?.profileImg?.url}
                  alt={`${comment?.createdby?.firstName}'s avatar`}
                />
                <AvatarFallback>
                  {comment?.createdby?.firstName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col w-full space-y-2">
                <div className="bg-gray-50 px-4 py-3 rounded-lg shadow-sm text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm">
                      {comment?.createdby?.firstName}{" "}
                      {comment?.createdby?.lastName}
                    </p>

                    <div className="flex items-center gap-4">
                      <div
                        className={`${
                          comment.status === "before due date"
                            ? "text-green-600"
                            : comment.status === "after due date"
                              ? "text-red-600"
                              : ""
                        }`}
                      >
                        {comment.status === "before due date" ? (
                          <Badge variant="outline" className="text-green-600">
                            Before due date
                          </Badge>
                        ) : comment.status === "after due date" ? (
                          <Badge variant="outline" className="text-red-600">
                            After due date
                          </Badge>
                        ) : (
                          <Badge variant="outline">{comment.status}</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 text-sm">{comment?.text}</p>
                </div>

                <div className="text-xs flex gap-6 text-blue-600 font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setSendingReply("");
                      setIsReplying({ status: true, id: comment._id });
                    }}
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchReplies(1, false, comment._id)}
                  >
                    {replyCounts[comment._id] > 0
                      ? `Show replies (${replyCounts[comment._id]})`
                      : "No replies"}
                  </button>

                  {comment.isGraded && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">Graded</span>
                      <div className="flex items-center border border-green-600 rounded-full px-2 py-1">
                        <span className="text-xs font-medium text-green-600">
                          {comment.marksObtained}
                        </span>
                      </div>
                    </div>
                  )}

                  {user?.role === "teacher" &&
                    comment.createdby.role !== "teacher" &&
                    !comment.isGraded && (
                      <DiscussionGradeModel
                        checkIsCommented={checkIsCommented}
                        fetchComments={fetchComments}
                        commentId={comment._id}
                        discussionId={discussion._id}
                        discussionMarks={discussion?.totalMarks || 0}
                      />
                    )}
                </div>

                {isReplying.status && isReplying.id === comment._id && (
                  <div className="flex items-start gap-3 mt-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user?.profileImg?.url}
                        alt="Your avatar"
                      />
                      <AvatarFallback>
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        value={sendingReply}
                        onChange={(e) => setSendingReply(e.target.value)}
                        placeholder="Write a reply..."
                        aria-label="Write a reply"
                      />
                      <Button
                        variant="ghost"
                        className="text-green-600"
                        onClick={() => sendReply(comment._id)}
                        disabled={replyLoading[comment._id]}
                        aria-label="Send reply"
                      >
                        {replyLoading[comment._id] ? "..." : <Send size={16} />}
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() =>
                          setIsReplying({ status: false, id: null })
                        }
                        aria-label="Cancel reply"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="ml-10 space-y-3 mt-2">
                  {(replies[comment._id] || []).map((reply) => (
                    <article
                      key={reply._id}
                      className="flex items-start gap-3 bg-white px-4 py-2 rounded-lg shadow-sm max-w-[700px]"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={reply?.createdby?.profileImg?.url}
                          alt={`${reply?.createdby?.firstName}'s avatar`}
                        />
                        <AvatarFallback>
                          {reply?.createdby?.firstName?.[0]?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-sm flex-1">
                        <header className="flex justify-between items-center mb-1">
                          <p className="font-medium text-xs">
                            {reply?.createdby?.firstName}{" "}
                            {reply?.createdby?.lastName}
                          </p>
                          <time
                            className="text-xs text-gray-500"
                            dateTime={reply.createdAt}
                          >
                            {formatDate(reply.createdAt)}
                          </time>
                        </header>
                        <p className="text-sm">{reply?.text}</p>
                      </div>
                    </article>
                  ))}

                  {hasMoreReplies[comment._id] && (
                    <button
                      type="button"
                      onClick={() => handleLoadReplyMore(comment._id)}
                      className="text-xs text-blue-600 cursor-pointer"
                    >
                      Load more replies
                    </button>
                  )}

                  {replies[comment._id]?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setReplies((prev) => ({ ...prev, [comment._id]: [] }));
                        setHasMoreReplies((prev) => ({
                          ...prev,
                          [comment._id]: false,
                        }));
                      }}
                      className="text-xs text-gray-600 cursor-pointer"
                    >
                      Hide replies
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}

        {hasMore && comments.length > 0 && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="text-xs text-blue-600 text-center mt-4 cursor-pointer w-full"
            aria-label="Load more comments"
          >
            Load more comments
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-6 pt-4 border-t">
        <Avatar>
          <AvatarImage src={user?.profileImg?.url} alt="Your avatar" />
          <AvatarFallback>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {!canComment ? (
          <div className="flex-1">
            {isCommented ? (
              <p className="text-sm text-gray-600">
                {discussion?.allowResubmission
                  ? "You have reached the maximum number of comments (2) allowed for this discussion."
                  : "You have already commented on this discussion and resubmission is not allowed."}
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                You cannot comment on this discussion.
              </p>
            )}
          </div>
        ) : (
          <>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={sendingComment}
              onChange={(e) => setSendingComment(e.target.value)}
              placeholder={
                isCommented && discussion?.allowResubmission
                  ? "Update your comment (resubmission allowed)..."
                  : "Write a comment..."
              }
              disabled={sendingLoading}
            />
            <button
              onClick={sendComment}
              className="flex items-center justify-center gap-2 rounded-full bg-green-600 text-white p-2"
              disabled={sendingLoading || !sendingComment.trim()}
            >
              {sendingLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default ChatBox;
