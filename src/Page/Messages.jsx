"use client";

import { useState } from "react";
import { MessageCircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ConversationList from "@/CustomComponent/MessagesCmp.jsx/conversation-list";

const FloatingMessagesDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="
            bg-green-600 
            hover:bg-green-700 
            focus:outline-none 
            focus:ring-2 
            focus:ring-green-500 
            focus:ring-offset-2
            rounded-xl
            h-12
            shadow-lg
          "
        >
          <MessageCircleDashed className="w-5 h-5 text-white" />
          <p>Quick Messages</p>
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            max-w-6xl
            w-full
            h-[90vh]
            p-0
            overflow-hidden
          "
        >
          <DialogHeader className="px-6 py-4 h-16 bg-green-600 text-white">
            <DialogTitle className="text-2xl font-bold">Messages</DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div className="flex-1 h-full bg-white overflow-hidden">
            <ConversationList open={open} setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingMessagesDialog;
