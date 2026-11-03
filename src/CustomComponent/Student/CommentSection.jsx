import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Send, Trash2 } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "sonner";
import avatar from "../../assets/avatar.png";
import { GlobalContext } from "@/Context/GlobalProvider";

const CommentSection = ({ id }) => {
  const { user } = useContext(GlobalContext);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const getCourseComments = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/comment/${id}`);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getCourseComments();
    }
  }, [id]);

  // Submit a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/comment/sendComment/${id}`, { text: comment });
      const newComment = response.data.comment;
      setComments((prev) => [...prev, newComment]);
      toast.success(response.data.message || "Comment posted successfully");
      setComment("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId, commentAuthor) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${commentAuthor}'s comment?`
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/comment/${id}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  const getRoleBadgeLabel = (role) => {
    const labels = {
      admin: "Administrator",
      teacher: "Teacher",
      student: "Student"
    };
    return labels[role] || role;
  };

  return (
    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-xl font-bold mb-4">
        Comments ({comments.length})
      </h2>

      {/* Add Comment Form */}
      <form 
        onSubmit={handleCommentSubmit} 
        className="mb-8"
        aria-label="Add a new comment"
      >
        <div className="space-y-4">
          <label htmlFor="comment-input" className="sr-only">
            Write your comment
          </label>
          <Textarea
            id="comment-input"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
            disabled={isSubmitting}
            aria-required="true"
            aria-describedby="comment-help"
          />
          <span id="comment-help" className="sr-only">
            Enter your comment and press the Post Comment button to submit
          </span>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || !comment.trim()}
              aria-label={isSubmitting ? "Posting comment, please wait" : "Post comment"}
              aria-busy={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" aria-hidden="true" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div 
        className="space-y-6"
        role="feed"
        aria-label="User comments"
        aria-busy={loading}
      >
        {loading ? (
          <p 
            className="text-gray-500 text-center py-6"
            role="status"
            aria-live="polite"
          >
            Loading comments...
          </p>
        ) : comments.length > 0 ? (
          [...comments].reverse().map((comment) => {
            const authorName = `${comment?.createdby?.firstName || ''} ${comment?.createdby?.lastName || ''}`.trim() || 'Unknown User';
            const commentDate = new Date(comment?.updatedAt);
            const formattedDate = commentDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            return (
              <article 
                key={comment?._id} 
                className="border-b pb-6"
                aria-labelledby={`comment-author-${comment._id}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment?.createdby?.profileImg?.url || avatar}
                      alt={`${authorName}'s profile picture`}
                    />
                    <AvatarFallback aria-label={`${authorName}'s initials`}>
                      {comment?.createdby?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 
                          id={`comment-author-${comment._id}`}
                          className="font-medium"
                        >
                          {authorName}
                        </h3>
                        {comment?.createdby?.role && (
                          <span
                            className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${
                              comment.createdby.role === "admin"
                                ? "bg-red-600 text-white"
                                : comment.createdby.role === "teacher"
                                ? "bg-blue-600 text-white"
                                : "bg-green-600 text-white"
                            }`}
                            role="status"
                            aria-label={`User role: ${getRoleBadgeLabel(comment.createdby.role)}`}
                          >
                            {comment.createdby.role}
                          </span>
                        )}
                        <time 
                          className="text-xs text-gray-500"
                          dateTime={comment?.updatedAt}
                          aria-label={`Posted on ${formattedDate}`}
                        >
                          {new Date(comment?.updatedAt).toLocaleDateString()}
                        </time>
                      </div>
                      {/* Show delete if logged-in user is the comment owner */}
                      {user?._id === comment?.createdby?._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment._id, authorName)}
                          className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                          aria-label={`Delete comment by ${authorName}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 text-gray-700" id={`comment-text-${comment._id}`}>
                      {comment?.text}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p 
            className="text-gray-500 text-center py-6"
            role="status"
          >
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </section>
  );
};

export default CommentSection;