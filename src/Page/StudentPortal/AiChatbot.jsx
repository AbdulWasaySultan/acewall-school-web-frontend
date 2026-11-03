import { normalizeMessagesFromDB } from "@/utils/messageTransformer";
import { useState, useEffect, useRef, useContext } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import ChatWindow from "@/CustomComponent/Aichatbot/ChatWindow";
import InputBar from "@/CustomComponent/Aichatbot/InputBar";
import RightPanel from "@/CustomComponent/Aichatbot/RightPanel";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Forward, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AiChatbot() {
  const [messages, setMessages] = useState([
    {
      id: Date.now() + 1,
      text: "Hello! I am Acewall Scholars EduMentor, your AI educational assistant. How can I help you today?",
      sender: "ai",
      isLoading: true,
    },
  ]);

  const [difficulty, setDifficulty] = useState("medium");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { taggedMessage, setTaggedMessage } = useContext(GlobalContext);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const chatEndRef = useRef(null);

  const GENERIC_FOLLOWUP_PATTERNS = [
    "explain more",
    "tell me more",
    "what do you mean",
    "continue",
    "go on",
    "more",
    "more details",
    "explain this",
    "i don't understand",
    "elaborate",
    "clarify",
    "explain again",
    "what else",
  ];

  /* Auto scroll for screen readers + users */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Fetch chat history */
  useEffect(() => {
    axiosInstance
      .get("/aichat/getChatHistory")
      .then((res) => {
        const normalized = normalizeMessagesFromDB(res.data.chats || []);
        setMessages((prev) => [...prev, ...normalized]);
      })
      .catch(console.error);
  }, []);

  /* Main send handler */
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
      file: file ? { name: file.name, size: file.size, type: file.type } : null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: "Thinking…",
        sender: "ai",
        isLoading: true,
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("question", text);
      formData.append("difficulty", difficulty);
      if (taggedMessage) formData.append("context", taggedMessage.dbId);
      if (file) formData.append("file", file);

      const res = await axiosInstance.post("/aichat/askupdated", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data, "response from AI");

      setMessages((prev) => prev.filter((m) => !m.isLoading));

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: res.data.answer,
          sender: "ai",
          timestamp: new Date(),
          suggestions: res.data.suggestedQuestions,
          generatedFile: res.data.generatedFile || null,
        },
      ]);

      setSuggestedQuestions(res.data.suggestedQuestions || []);
      setTaggedMessage(null);
      setInput("");
      setFile(null);
    } catch {
      setMessages((prev) => prev.filter((m) => !m.isLoading));
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 3,
          text: "Sorry, something went wrong while contacting the AI.",
          sender: "ai",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 dark:bg-slate-950">
      {/* MAIN CONTENT */}
      <main
        className="flex-1 flex flex-col min-h-0"
        role="main"
        aria-label="AI Chatbot"
      >
        {/* HEADER */}
        <header className="bg-green-600 px-6 py-4 sticky top-0" role="banner">
          <h1 className="text-xl font-bold text-white">
            AI Educational Assistant
          </h1>
        </header>

        {/* CHAT LOG */}
        <section
          className="flex-1 overflow-y-auto"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Chat messages"
        >
          <ChatWindow
            messages={messages}
            chatEndRef={chatEndRef}
            loading={loading}
          />
        </section>

        {/* QUICK FOLLOW UPS */}
        <nav
          aria-label="Suggested follow-up questions"
          className="flex p-2 bg-white border-t flex-wrap"
        >
          {GENERIC_FOLLOWUP_PATTERNS.map((pattern) => (
            <button
              key={pattern}
              type="button"
              onClick={() => setInput(pattern)}
              className="mr-2 mb-2"
              aria-label={`Use suggestion: ${pattern}`}
            >
              <Badge variant="outline">{pattern}</Badge>
            </button>
          ))}
        </nav>

        {/* TAGGED MESSAGE + INPUT */}
        <section
          className="bg-white border-t p-2"
          aria-label="Message input area"
        >
          {taggedMessage && (
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span className="sr-only">Tagged message</span>

                <Forward aria-hidden="true" />

                <button
                  type="button"
                  onClick={() => setTaggedMessage(null)}
                  aria-label="Remove tagged message"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <p className="text-sm line-clamp-2">{taggedMessage.text}</p>
            </div>
          )}

          <InputBar
            onSendMessage={handleSendMessage}
            input={input}
            setInput={setInput}
            disabled={loading}
            file={file}
            setFile={setFile}
            aria-disabled={loading}
          />
        </section>
      </main>

      {/* SIDE PANEL */}
      <aside
        className="bg-slate-100 dark:bg-slate-900 p-4 border-l"
        role="complementary"
        aria-label="Chat settings and suggestions"
      >
        <RightPanel
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onFollowUpQuestion={handleSendMessage}
          suggestions={suggestedQuestions}
        />
      </aside>
    </div>
  );
}
