import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CommentSection = ({ post, setPosts }) => {
  const [comment, setComment] = useState("");
  const lastCommentRef = useRef(null);
  const liveRegionRef = useRef(null);

  const handleAddComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    const newComment = {
      id: Date.now(),
      name: "You",
      text: trimmed,
      time: "Just now",
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );

    setComment("");

    // Announce new comment for screen readers
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `New comment added by ${newComment.name}`;
    }

    // Animate comment count bounce
    gsap.fromTo(
      `#comment-count-${post.id}`,
      { scale: 1 },
      {
        scale: 1.25,
        duration: 0.25,
        ease: "elastic.out(1,0.5)",
        yoyo: true,
        repeat: 1,
      }
    );

    // Animate new comment appearance
    setTimeout(() => {
      if (lastCommentRef.current) {
        gsap.fromTo(
          lastCommentRef.current,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }, 50);
  };

  return (
    <div className="mt-3">
      {/* ARIA live region for screen readers */}
      <div ref={liveRegionRef} className="sr-only" aria-live="polite" />

      {/* Comments List */}
      <div role="list" className="flex flex-col gap-2 text-sm">
        {post.comments.map((c, idx) => (
          <div
            key={c.id}
            ref={idx === post.comments.length - 1 ? lastCommentRef : null}
            role="listitem"
            className="flex items-start gap-2"
          >
            <img
              src={`https://i.pravatar.cc/40?img=${(c.id % 70) + 1}`}
              alt={`Avatar of ${c.name}`}
              className="w-6 h-6 rounded-full"
            />
            <div className="bg-gray-100 px-3 py-1.5 rounded-lg max-w-sm">
              <p className="font-semibold text-xs">{c.name}</p>
              <p className="text-sm">{c.text}</p>
              <span className="text-xs text-gray-400">{c.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="mt-3 flex items-center gap-2">
        <img
          src="https://i.pravatar.cc/40?img=10"
          alt="Your avatar"
          className="w-7 h-7 rounded-full"
        />
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          type="text"
          aria-label="Write a comment"
          aria-required="true"
          placeholder="Write a comment..."
          className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );
};

export default CommentSection;
