import { File, Send, X } from "lucide-react";
import { toast } from "sonner";

export default function InputBar({
  onSendMessage,
  input,
  setInput,
  file,
  setFile,
  disabled,
}) {
  const handleSend = () => {
    if (input.trim() || file) {
      onSendMessage(input);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const allowedTypes = ["application/pdf", "text/plain"];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!files || files.length === 0) return;

    const selectedFile = files[0];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only PDF and text files are allowed.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error("File size must be less than 50MB.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    toast.success(`File "${selectedFile.name}" selected successfully.`);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 shadow-lg"
      role="form"
      aria-label="Chat message input"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
      {/* Selected File Preview */}
      {file && (
        <div
          className="mb-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-between items-center"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <File size={20} className="text-blue-500" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFile(null);
              toast.info("File removed");
            }}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove selected file"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Input Controls */}
      <div className="flex gap-3 items-center">
        {/* Message Input */}
        <label htmlFor="chat-input" className="sr-only">
          Type your message
        </label>

        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-disabled={disabled}
          placeholder="Ask any question or request to generate a file…"
          className="flex-1 px-4 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* File Upload */}
        <label
          htmlFor="file-upload"
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          aria-label="Upload a file"
        >
          <File size={20} aria-hidden="true" />
        </label>

        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          disabled={disabled}
          aria-disabled={disabled}
          accept=".pdf,.txt"
          className="hidden"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || (!input.trim() && !file)}
          aria-disabled={disabled || (!input.trim() && !file)}
          aria-label="Send message"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <Send size={20} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
