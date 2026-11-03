import React, { useContext, useEffect, useState } from "react";
import { Grid } from "lucide-react";
import { useParams } from "react-router-dom";
import PostCard from "@/CustomComponent/teacher/Socials/PostCard";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import avatar from "../../assets/avatar.png";
import BackButton from "@/CustomComponent/BackButton";

const SocialProfilePage = () => {
  const { userId } = useParams();
  const { UpdatedUser } = useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `posts/specificUserPosts/${userId}`
      );
      const { posts } = response.data;
      setPosts(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserPosts();
  }, [userId]);

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <BackButton className="mb-4" aria-label="Go back to previous page" />

      {/* Profile Header */}
      <section
        className="flex items-center justify-between mt-6 mb-4 w-full px-4"
        aria-label="User profile header"
      >
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={UpdatedUser?.profileImg?.url || avatar}
              alt={UpdatedUser?.firstName || "User Avatar"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {UpdatedUser?.firstName || ""} {UpdatedUser?.lastName || ""}
            </h1>
            <p className="text-gray-500 text-sm">{UpdatedUser?.email || ""}</p>
          </div>
        </div>

        {/* Post Count */}
        <p className="text-gray-500 text-sm whitespace-nowrap">
          {posts.length} Posts
        </p>
      </section>

      {/* Posts Section */}
      <section
        aria-label="User posts"
        className="max-w-3xl mx-auto space-y-4 px-2 sm:px-4 pb-10"
      >
        {loading ? (
          <p
            className="text-center text-gray-500 mt-10"
            role="status"
            aria-live="polite"
          >
            Loading posts...
          </p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} setPosts={setPosts} />
          ))
        ) : (
          <div
            className="flex flex-col items-center justify-center mt-16 text-gray-500"
            role="status"
            aria-live="polite"
          >
            <Grid className="w-10 h-10 mb-2" aria-hidden="true" />
            <p>No posts yet.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default SocialProfilePage;
