import { Link } from "react-router-dom";
import { useId } from "react";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const mainId = useId();
  const headingId = useId();

  return (
    <main
      id={mainId}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12"
      role="main"
      aria-labelledby={headingId}
    >
      <div className="text-center space-y-6 max-w-md">
        {/* Status Code */}
        <div className="space-y-2">
          <h1
            id={headingId}
            className="text-6xl font-bold text-green-600"
            aria-label="404 error"
          >
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-lg text-gray-700 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-gray-600">
            We apologize for the inconvenience. Please try going back to the home page.
          </p>
        </div>

        {/* Illustration */}
        <figure className="py-4">
          <img
            className="w-80 mx-auto h-auto"
            src="https://img.freepik.com/free-vector/404-error-with-person-looking-concept-illustration_114360-7912.jpg?ga=GA1.1.1453766052.1744756388&semt=ais_hybrid&w=740"
            alt="404 error illustration - person confused about missing page"
          />
          <figcaption className="sr-only">
            Illustration of a person confused about a missing web page
          </figcaption>
        </figure>

        {/* Call to Action */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-green-800 focus:outline-none focus:ring-offset-2 transition-all duration-300"
            aria-label="Return to home page"
          >
            <Home size={18} aria-hidden="true" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Additional Help Text */}
        <div className="text-xs text-gray-600 pt-4 border-t border-gray-300">
          <p>
            If you believe this is a mistake,{" "}
            <Link
              to="/contact"
              className="text-green-600 hover:text-green-700 font-medium focus:ring-2 focus:ring-green-500 rounded px-1 focus:outline-none"
              aria-label="Contact support for assistance"
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Page Metadata for Screen Readers */}
      <div className="sr-only" role="complementary">
        <h3>Page Error Information</h3>
        <p>
          Error 404: The requested page could not be found. This may be due to an incorrect URL,
          a page that has been removed, or a temporary server issue.
        </p>
        <p>
          You can return to the home page using the "Go Home" button above, or contact our support team
          if you need further assistance.
        </p>
      </div>
    </main>
  );
}