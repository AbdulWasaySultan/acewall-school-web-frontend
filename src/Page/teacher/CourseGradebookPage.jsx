import { useParams } from "react-router-dom";
import CourseGradebook from "../../CustomComponent/teacher/CourseGradebook";

export default function CourseGradebookPage() {
  const { courseId } = useParams();

  return (
    <main
      role="main"
      aria-labelledby="gradebook-page-title"
      className="w-full h-full"
    >
      <h1 id="gradebook-page-title" className="sr-only">
        Gradebook for selected course
      </h1>

      <CourseGradebook courseId={courseId} title="Gradebook" />
    </main>
  );
}
