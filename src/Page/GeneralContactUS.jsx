import ContactUs from "./ContctUs";
import { useId } from "react";

const GeneralContactUS = () => {
  const mainId = useId();
  const skipLinkId = useId();

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
      ariaLabel: "View all available courses",
    },
    {
      id: "support",
      name: "Support",
      path: "/Support",
      ariaLabel: "Get help and support resources",
    },
    {
      id: "contact",
      name: "Contact Us",
      path: "/ContactUS",
      ariaLabel: "Contact Acewall Scholars",
    },
  ];

  return (
    <main
      id={mainId}
      className="min-h-screen bg-white"
      role="main"
    >
      {/* Skip to Main Content Link */}
      <a
        id={skipLinkId}
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-3 focus:bg-green-600 focus:text-white focus:rounded-br-lg focus:ring-2 focus:ring-green-700"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Navigation Breadcrumb for Screen Readers */}
      <nav
        className="sr-only"
        aria-label="Main navigation"
        role="navigation"
      >
        <ul role="list">
          {navigationTabs.map((tab) => (
            <li key={tab.id} role="listitem">
              <a
                href={tab.path}
                aria-label={tab.ariaLabel}
                className="text-green-600 hover:underline"
              >
                {tab.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="w-full">
        <ContactUs />
      </div>

      {/* Metadata for Screen Readers */}
      <div className="sr-only" role="complementary">
        <h2>Page Information</h2>
        <p>
          This is the contact us page for Acewall Scholars. You can reach out to us using
          the contact form below.
        </p>
        <p>Navigation: Home, More Courses, Support, Contact Us</p>
      </div>
    </main>
  );
};

export default GeneralContactUS;