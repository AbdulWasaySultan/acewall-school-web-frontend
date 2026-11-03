import { Loader } from "lucide-react";
import React from "react";

const LoadingLoader = () => {
  return (
    <section
      className="flex justify-center items-center h-screen w-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <Loader size={48} className="animate-spin" />
      <span className="sr-only">Loading...</span>
    </section>
  );
};

export default LoadingLoader;
