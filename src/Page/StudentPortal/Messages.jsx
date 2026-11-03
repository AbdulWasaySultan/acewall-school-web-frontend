import { useState } from "react";
import ConversationList from "@/CustomComponent/MessagesCmp.jsx/conversation-list";

const MessagesForStudents = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section>
        <div className="px-6 py-4 h-16 bg-green-600 text-white rounded-lg">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>
        <div className="flex-1 h-full bg-white overflow-hidden">
          <ConversationList open={open} setOpen={setOpen} />
        </div>
      </section>
    </>
  );
};

export default MessagesForStudents;
