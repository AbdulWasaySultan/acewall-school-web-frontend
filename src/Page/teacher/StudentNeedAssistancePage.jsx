import { useParams } from "react-router-dom";
import StudentAssistanceCard from "@/CustomComponent/teacher/StudentAssistanceCard";

export default function StudentWhoNeedAssistance() {
  const { courseId } = useParams();

  return (
    <main
      role="main"
      aria-labelledby="assistance-page-title"
      className="w-full h-full"
    >
      {/* Screen-reader only heading */}
      <h1 id="assistance-page-title" className="sr-only">
        Students Who Need Assistance
      </h1>

      <StudentAssistanceCard
        courseId={courseId}
        title="Student who need assistance"
      />
    </main>
  );
}
