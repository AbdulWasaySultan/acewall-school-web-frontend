import { useId } from "react";

export default function PrivacyPolicyPage({ style }) {
  const mainId = useId();
  const headingId = useId();
  const tocId = useId();
  const skipLinkId = useId();

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Skip to Main Content Link */}
      <a
        id={skipLinkId}
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-3 focus:bg-green-600 focus:text-white focus:rounded-br-lg focus:ring-2 focus:ring-green-700"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      <main
        id={mainId}
        className="bg-white text-gray-800 py-8 px-4 md:px-6 max-w-4xl mx-auto"
        style={style}
        role="main"
        aria-label="Privacy policy"
      >
        {/* Header */}
        <header className="mb-8">
          <h1
            id={headingId}
            className="text-4xl font-bold text-center mb-4 text-gray-900"
          >
            Privacy Policy
          </h1>
          <p className="text-center text-gray-600 font-medium">
            Last updated{" "}
            <time dateTime={new Date().toISOString().split("T")[0]}>
              {lastUpdated}
            </time>
          </p>
        </header>

        {/* Main Content */}
        <article className="prose prose-sm max-w-none text-gray-800 leading-7 space-y-6">
          {/* Introduction */}
          <section aria-labelledby="intro-heading">
            <h2
              id="intro-heading"
              className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            >
              Introduction
            </h2>
            <p>
              This Privacy Notice for Acewall Scholars ("we," "us," or "our")
              describes how and why we might access, collect, store, use, and
              share ("process") your personal information when you use our
              services ("Services"), including when you:
            </p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>
                Visit our website at{" "}
                <a
                  href="https://www.acewallscholars.com"
                  className="text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                  aria-label="Visit Acewall Scholars website"
                >
                  acewallscholars.com
                </a>
              </li>
              <li>
                Engage with us in other related ways, including any sales,
                marketing, or events.
              </li>
              <li>
                Questions or concerns? Reading this Privacy Notice will help you
                understand your privacy rights and choices.
              </li>
            </ul>
          </section>

          {/* Key Points Summary */}
          <section aria-labelledby="summary-heading">
            <h2
              id="summary-heading"
              className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            >
              Summary of Key Points
            </h2>
            <p className="italic text-gray-600">
              This summary provides key points from our Privacy Notice. Use the
              table of contents below to find the section you are looking for.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 my-4">
              <p>
                <strong>What personal information do we process?</strong> When
                you visit, use, or navigate our Services, we may process
                personal information depending on how you interact with us and
                the Services.
              </p>
              <p>
                <strong>Do we process sensitive personal information?</strong>{" "}
                We do not process sensitive personal information.
              </p>
              <p>
                <strong>Do we collect information from third parties?</strong>{" "}
                We may collect information from public databases, marketing
                partners, and social media platforms.
              </p>
              <p>
                <strong>Why do we process your information?</strong> We process
                your information to provide, improve, and administer our
                Services, communicate with you, and for security and fraud
                prevention.
              </p>
              <p>
                <strong>What are your rights?</strong> Depending on your
                location, you may have certain rights regarding your personal
                information.
              </p>
            </div>
          </section>

          {/* Table of Contents */}
          <nav id={tocId} aria-labelledby="toc-heading">
            <h2
              id="toc-heading"
              className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            >
              Table of Contents
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-600">
              <li>
                <a
                  href="#section-1"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  WHAT INFORMATION DO WE COLLECT?
                </a>
              </li>
              <li>
                <a
                  href="#section-2"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  HOW DO WE PROCESS YOUR INFORMATION?
                </a>
              </li>
              <li>
                <a
                  href="#section-3"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  WHAT LEGAL BASES DO WE RELY ON?
                </a>
              </li>
              <li>
                <a
                  href="#section-4"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  WHEN AND WITH WHOM DO WE SHARE YOUR INFORMATION?
                </a>
              </li>
              <li>
                <a
                  href="#section-5"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  DO WE USE COOKIES?
                </a>
              </li>
              <li>
                <a
                  href="#section-6"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  HOW DO WE HANDLE SOCIAL LOGINS?
                </a>
              </li>
              <li>
                <a
                  href="#section-7"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
                </a>
              </li>
              <li>
                <a
                  href="#section-8"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  HOW LONG DO WE KEEP YOUR INFORMATION?
                </a>
              </li>
              <li>
                <a
                  href="#section-9"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  DO WE COLLECT INFORMATION FROM MINORS?
                </a>
              </li>
              <li>
                <a
                  href="#section-10"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  WHAT ARE YOUR PRIVACY RIGHTS?
                </a>
              </li>
              <li>
                <a
                  href="#section-11"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  CONTROLS FOR DO-NOT-TRACK FEATURES
                </a>
              </li>
              <li>
                <a
                  href="#section-12"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  US RESIDENTS PRIVACY RIGHTS
                </a>
              </li>
              <li>
                <a
                  href="#section-13"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  DO WE MAKE UPDATES?
                </a>
              </li>
              <li>
                <a
                  href="#section-14"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  HOW CAN YOU CONTACT US?
                </a>
              </li>
              <li>
                <a
                  href="#section-15"
                  className="hover:underline focus:ring-2 focus:ring-blue-500 rounded px-1 focus:outline-none"
                >
                  HOW TO REVIEW YOUR DATA?
                </a>
              </li>
            </ol>
          </nav>

          {/* Full Content Sections */}
          <section id="section-1" aria-labelledby="section-1-heading">
            <h2
              id="section-1-heading"
              className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            >
              1. What Information Do We Collect?
            </h2>
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Personal Information You Disclose to Us
            </h3>
            <p>
              We collect personal information that you voluntarily provide to us
              when you register on the Services, express interest in obtaining
              information about us or our products and Services.
            </p>
            <p className="mt-3 font-semibold">
              Personal information we collect may include:
            </p>
            <ul className="list-disc list-inside space-y-1 my-3">
              <li>Names</li>
              <li>Phone numbers</li>
              <li>Email addresses</li>
              <li>Mailing addresses</li>
              <li>Billing addresses</li>
              <li>Contact preferences</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Information Automatically Collected
            </h3>
            <p>
              We automatically collect certain information when you visit, use,
              or navigate the Services, such as IP address, browser and device
              characteristics, operating system, language preferences, and
              information about how and when you use our Services.
            </p>
          </section>

          {/* Continue with more sections... */}
          <section id="section-2" aria-labelledby="section-2-heading">
            <h2
              id="section-2-heading"
              className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            >
              2. How Do We Process Your Information?
            </h2>
            <p>
              We process your information to provide, improve, and administer
              our Services, communicate with you (including through SMS when you
              provide a mobile number), for security and fraud prevention, and
              to comply with law.
            </p>
            <ul className="list-disc list-inside space-y-3 my-4">
              <li>
                <strong>Account Creation:</strong> We process your information
                to create and manage your account.
              </li>
              <li>
                <strong>SMS Communication:</strong> If you provide a mobile
                number, we may send transactional messages and academic
                notifications. You can opt out by replying STOP.
              </li>
              <li>
                <strong>Safety and Security:</strong> We process information to
                protect your vital interests and prevent harm.
              </li>
            </ul>
          </section>

          {/* Contact Information Section */}
          <section id="section-14" aria-labelledby="section-14-heading">
            <h2
              id="section-14-heading"
              className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            >
              14. How Can You Contact Us About This Notice?
            </h2>
            <p>
              If you have questions about this Privacy Notice, contact us at:
            </p>
            <address className="not-italic bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 space-y-1">
              <p className="font-semibold">Acewall Scholars</p>
              <p>1072 Timber Trace Road</p>
              <p>Powhatan, VA 23139</p>
              <p>United States</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:support@acewallscholars.org"
                  className="text-blue-600 hover:text-blue-800"
                  aria-label="Send email to support"
                >
                  support@acewallscholars.org
                </a>
              </p>
            </address>
          </section>

          {/* Data Table */}
          <section id="section-12" aria-labelledby="section-12-heading">
            <h2
              id="section-12-heading"
              className="text-2xl font-bold text-gray-900 mt-8 mb-4"
            >
              12. US Residents Privacy Rights
            </h2>
            <p className="mb-4">
              Categories of personal information we collect in the past 12
              months:
            </p>
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Category
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Examples
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">
                      Collected
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">Identifiers</td>
                    <td className="border border-gray-300 p-3">
                      Contact details, email, IP address, account name
                    </td>
                    <td className="border border-gray-300 p-3 font-semibold">
                      YES
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      Commercial Information
                    </td>
                    <td className="border border-gray-300 p-3">
                      Transaction data, purchase history, payment information
                    </td>
                    <td className="border border-gray-300 p-3 font-semibold">
                      YES
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      Internet Activity
                    </td>
                    <td className="border border-gray-300 p-3">
                      Browsing history, search history, interactions
                    </td>
                    <td className="border border-gray-300 p-3 font-semibold">
                      YES
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      Geolocation Data
                    </td>
                    <td className="border border-gray-300 p-3">
                      Device location
                    </td>
                    <td className="border border-gray-300 p-3 font-semibold">
                      YES
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      Education Information
                    </td>
                    <td className="border border-gray-300 p-3">
                      Student records, directory information
                    </td>
                    <td className="border border-gray-300 p-3 font-semibold">
                      YES
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">
                      Sensitive Personal Information
                    </td>
                    <td className="border border-gray-300 p-3">N/A</td>
                    <td className="border border-gray-300 p-3 font-semibold">
                      NO
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>

        {/* Last Updated Info for Screen Readers */}
        <div className="sr-only" role="doc-pagelist">
          <p>
            This privacy policy was last updated on {lastUpdated}. Please review
            this notice frequently to stay informed about how your information
            is protected.
          </p>
        </div>
      </main>
    </>
  );
}
