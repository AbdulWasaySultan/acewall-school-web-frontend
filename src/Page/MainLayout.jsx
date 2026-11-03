import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Button } from "@/components/ui/button";

import acewallscholarslogo from "../assets/acewallscholarslogo.webp";
import acewallshort from "../assets/acewallshort.png";

import Footer from "@/CustomComponent/Footer";
import ScrollToTop from "@/lib/scrolltop";
import { GlobalContext } from "@/Context/GlobalProvider";

/**
 * Accessible MainLayout
 *
 * Improvements:
 * - Added a visible-for-keyboard "Skip to content" link.
 * - Added role="banner" for the header and role="main" for the main content.
 * - Made decorative bars aria-hidden="true".
 * - Gave logos meaningful alt text and aria-label for the link targets.
 * - Ensured the account button has an accessible name.
 * - main element has tabIndex={-1} so the skip link can focus it.
 */

const MainLayout = () => {
  const navigate = useNavigate();
  const { user } = useContext(GlobalContext);
  const location = useLocation();

  const handleGoToAccount = () => {
  if (!user) {
    return navigate("/login");
  }

  if (user.role === "student" || user.role === "teacherAsStudent") {
    navigate("/student/mycourses");
  } else if (user.role === "teacher") {
    navigate("/teacher");
  } else if (user.role === "parent") {
    navigate("/parent");
  } else {
    // Fallback for unknown roles or users without a role assigned
    navigate("/");
  }
};
  // Show stripe only on FeaturedPage ("/")
  const showBlueStripe = location.pathname === "/";

  return (
    <>
      <ScrollToTop />

      {/* Skip link for keyboard users — becomes visible when focused */}
      <a
        href="#maincontent"
        className="sr-only focus:not-sr-only p-2 m-2 bg-white text-sm rounded shadow"
      >
        Skip to content
      </a>

      <div className="flex h-screen flex-col w-screen">
        {/* Blue stripe only on FeaturedPage — decorative */}
        {showBlueStripe && (
          <div
            className="h-10 bg-[#156082] w-full"
            aria-hidden="true"
            role="presentation"
          />
        )}

        {/* Header / banner landmark */}
        <header
          className="sticky top-0 z-10 bg-white w-full"
          role="banner"
          aria-label="Site header"
        >
          {/* Decorative thin green bar — hide from AT */}
          <div
            className="h-3 bg-green-600 flex justify-end items-end cursor-pointer"
            aria-hidden="true"
            role="presentation"
          />

          <div className="flex h-16 items-center justify-between px-4">
            {/* Home link with meaningful aria-label */}
            <Link
              className="block md:hidden"
              to={"/"}
              aria-label="Acewall Scholars home"
            >
              <img
                src={acewallshort}
                alt="Acewall Scholars logo — mobile"
                className="w-12 rounded-full h-auto cursor-pointer"
                loading="lazy"
              />
            </Link>

            <Link
              className="hidden md:block"
              to={"/"}
              aria-label="Acewall Scholars home"
            >
              <img
                src={acewallscholarslogo}
                alt="Acewall Scholars logo"
                className="w-50 h-auto cursor-pointer"
                loading="lazy"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {/* Conditionally render the button based on whether user is logged in */}
              {user && (
                /* If your `Button` component accepts an aria-label, pass it.
                   The visible text is already descriptive, but aria-label is safe too. */
                <Button
                  onClick={handleGoToAccount}
                  className="bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  aria-label="Go to your account"
                >
                  Go to your account
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content landmark — give id for skip link target */}
          <main
            id="maincontent"
            className="flex-1 hide-scrollbar overflow-y-scroll"
            role="main"
            tabIndex={-1}
            aria-label="Main content"
          >
            <Outlet />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;