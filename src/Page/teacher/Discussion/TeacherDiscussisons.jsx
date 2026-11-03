import { CreateDiscussionDialog } from "@/CustomComponent/createDiscussionModal";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import BackButton from "@/CustomComponent/BackButton";
import { DiscussionCard } from "@/CustomComponent/Card";

const TeacherDiscussion = () => {
  const [discussion, setDiscussion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("course");

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const typeId = searchParams.get("typeId");
  const courseId = searchParams.get("course");
  const semesterId = searchParams.get("semester");
  const quarterId = searchParams.get("quarter");

  console.log(type, "type");
  console.log(typeId, "typeId");

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      const url =
        type === "all" ? `/discussion/all` : `/discussion/${type}/${typeId}`;
      try {
        const res = await axiosInstance.get(url);
        setDiscussion(res.data.discussion);
      } catch (err) {
        console.error("Error fetching discussions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, [refresh, type, typeId]);

  const discussionHeading = `${
    type?.charAt(0).toUpperCase() + type?.slice(1)
  } Discussions`;

  return (
    <main
      role="main"
      aria-labelledby="discussion-page-title"
      className="w-full"
    >
      <section className="mb-3">
        <BackButton />
      </section>

      <section className="flex flex-col pb-2 gap-5">
        <h1
          id="discussion-page-title"
          className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg"
        >
          {discussionHeading}
        </h1>
      </section>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        aria-label="Discussion Tabs"
      >
        {type !== "all" && type !== "course" && (
          <section className="flex justify-end mb-5">
            <CreateDiscussionDialog
              setRefresh={setRefresh}
              refresh={refresh}
              semester={semesterId}
              quarter={quarterId}
            />
          </section>
        )}

        <section className="w-full flex justify-center" aria-live="polite">
          {loading ? (
            <p className="text-center">Loading discussions...</p>
          ) : discussion?.length === 0 ? (
            <p className="text-center">No discussions found</p>
          ) : null}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {!loading &&
            discussion?.map(
              (item) =>
                item.course && (
                  <DiscussionCard
                    key={item._id}
                    discussion={item}
                    link={`/teacher/discussions/${item._id}?type=${type}&typeId=${typeId}&course=${courseId}&semester=${semesterId}&quarter=${quarterId}`}
                  />
                )
            )}
        </section>
      </Tabs>
    </main>
  );
};

export default TeacherDiscussion;
