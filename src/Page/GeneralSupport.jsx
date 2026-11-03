import React, { useId } from "react";
import { Link } from "react-router-dom";
import Support from "./Support";

const GeneralSupport = () => {
  const mainId = useId();
  const skipLinkId = useId();
  const navId = useId();

  const navigationTabs = [
    {
      id: "home",
      name: "Home",
      path: "/",
      ariaLabel: "Go to home page",
    },
    {
      id: "courses",
      name: "More Courses",
      path: "/Courses",
      ariaLabel: "Browse all available courses",
    },
    {
      id: "support",
      name: "Support",
      path: "/Support",
      ariaLabel: "Get help and support resources - current page",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Skip to Main Content Link */}
      <a
        id={skipLinkId}
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-3 focus:bg-green-600 focus:text-white focus:rounded-br-lg focus:ring-2 focus:ring-green-700"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Accessibility Navigation */}
      <nav
        id={navId}
        className="sr-only"
        aria-label="Main navigation"
        role="navigation"
      >
        <ul role="list">
          {navigationTabs.map((tab) => (
            <li key={tab.id} role="listitem">
              <Link
                to={tab.path}
                aria-label={tab.ariaLabel}
                className="text-green-600 hover:underline focus:ring-2 focus:ring-green-500 rounded px-2"
              >
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main
        id={mainId}
        className="flex-1 w-full"
        role="main"
        aria-label="Support page"
      >
        <Support />
      </main>

      {/* Page Metadata for Screen Readers */}
      <div className="sr-only" role="complementary">
        <h2>Page Information</h2>
        <p>
          This is the support page for Acewall Scholars. Find help, resources,
          and answers to frequently asked questions about our courses and
          services.
        </p>
        <p>Navigation: Home, More Courses, Support (current page)</p>
      </div>
    </div>
  );
};

export default GeneralSupport;
