import { Link } from "react-router-dom";
import { Dot, ArrowRight } from "lucide-react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { LandingPageCard } from "@/CustomComponent/Card";
import { useContext, useId } from "react";

const cardData = [
  {
    name: "Academic Tutoring",
    description:
      "Acewall Scholars offers one-on-one tutoring services to support students in their academic journey. Our experienced tutors provide personalized instruction and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_357701907-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/academic-tutoring ",
  },
  {
    name: "Mentoring and Mental Health Support - a 360° approach",
    description:
      "Acewall Scholars offers a 360° approach to mentoring and mental health support. Our experienced mentors and mental health professionals provide personalized support and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_355386233-834697fd-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/mentoring",
  },
  {
    name: "Parent Aide",
    description:
      "Acewall Scholars' parent aide program offers a holistic approach to developing effective parenting skills. This program provides education on supporting children through their emotional, physical, mental, and spiritual development.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/shutterstock_2329065089-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/parent-aide",
  },
  {
    name: "Test Prep",
    description:
      "Acewall Scholars offers test preparation services to support students in their academic journey. Our experienced tutors provide personalized instruction and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/row-students-doing-exam-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/test-prep",
  },
  {
    name: "Internship Support/Placement",
    description:
      "Acewall Scholars will assist students with finding summer programs, internships, and/or apprenticeships, as well as volunteering experience in fields of interest.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/internship+support-placement-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/internship-support/placement",
  },
  {
    name: "College Counseling",
    description:
      "Our college counseling service assists and empowers both students and parents by providing the necessary guidance and information to assist in navigating the college process.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/college+counseling-1920w.jpg",
    buttonUrl: "https://www.acewallscholars.org/college-counseling",
  },
];

const LandingPage = () => {
  const { user } = useContext(GlobalContext);

  const heroHeadingId = useId();
  const pathSectionId = useId();
  const servicesHeadingId = useId();

  return (
    <main className="flex flex-col" role="main">
      {/* Hero Section */}
      <section
        className="h-[50vh] sm:h-[70vh] md:h-[60vh] lg:h-[70vh] bg-cover bg-start bg-no-repeat bg-[url('assets/hero.webp')]"
        aria-labelledby={heroHeadingId}
      >
        <div className="h-full w-full bg-black/50 flex items-start justify-start">
          <div className="flex flex-col mt-10 justify-center items-center px-2 md:px-10 md:mt-16 text-center">
            <h1
              id={heroHeadingId}
              className="text-white text-lg sm:text-3xl font-semibold tracking-wide"
            >
              Where the vision is realized. Where the dream is achieved.
            </h1>
            <div
              className="flex items-center justify-center flex-wrap sm:flex-row flex-col gap-x-2 text-white ml-2 mt-4"
              aria-label="Core values: Imagine, Believe, Create"
            >
              <div className="flex items-center text-md whitespace-nowrap">
                <p>Imagine</p>
                <Dot
                  size={28}
                  strokeWidth={3}
                  className="-mx-1.5"
                  aria-hidden="true"
                />
                <p>Believe</p>
                <Dot
                  size={28}
                  strokeWidth={3}
                  className="-mx-1.5"
                  aria-hidden="true"
                />
                <p>Create</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Buttons Section */}
      {!user && (
        <section
          id={pathSectionId}
          className="bg-black flex flex-col lg:flex-row flex-wrap items-center justify-center gap-6 p-10 w-full"
          aria-labelledby="path-heading"
        >
          <h2
            id="path-heading"
            className="w-full lg:w-auto text-center lg:text-left text-white text-xl font-semibold whitespace-nowrap"
          >
            Choose Your Path
          </h2>

          {/* Login as Teacher Button */}
          <div className="w-full lg:w-[200px]">
            <Link
              to="/TeacherLogin"
              className="inline-block w-full focus:ring-2 focus:ring-green-700 focus:outline-none rounded-lg"
              aria-label="Login as Teacher"
            >
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 w-full transition-colors"
                aria-label="Login as Teacher to access course creation tools"
              >
                Login as Teacher
              </button>
            </Link>
          </div>

          {/* Login as Student Button */}
          <div className="w-full lg:w-[200px]">
            <Link
              to="/login"
              className="inline-block w-full focus:ring-2 focus:ring-green-700 focus:outline-none rounded-lg"
              aria-label="Login as Student"
            >
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 w-full transition-colors"
                aria-label="Login as Student to access your courses"
              >
                Login as Student
              </button>
            </Link>
          </div>

          <div className="w-full lg:w-[200px]">
            <Link
              to="/ParentLogin"
              className="inline-block w-full focus:ring-2 focus:ring-green-700 focus:outline-none rounded-lg"
              aria-label="Login as Parent"
            >
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 w-full transition-colors"
                aria-label="Login as Parent to access your Student's progress"
              >
                Login as Parent
              </button>
            </Link>
          </div>

          {/* Sign Up Button */}
          <div className="w-full lg:w-[200px]">
            <Link
              to="/signup"
              className="inline-block w-full focus:ring-2 focus:ring-blue-700 focus:outline-none rounded-lg"
              aria-label="Sign Up"
            >
              <button
                type="button"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 w-full transition-colors"
                aria-label="Sign up for a new account"
              >
                Sign Up
              </button>
            </Link>
          </div>

          {/* Getting Started Button */}
          <div className="w-full lg:w-[200px]">
            <Link
              to="/contact"
              className="inline-block w-full focus:ring-2 focus:ring-green-700 focus:outline-none rounded-lg"
              aria-label="Get Started"
            >
              <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 w-full transition-colors flex items-center justify-center gap-2"
                aria-label="Get Started Today with Acewall Scholars"
              >
                Get Started Today
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center justify-center mt-6">
            <div className="flex items-center w-full max-w-md">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="mx-4 text-white text-sm">District Login</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          </div>

          {/* Clever Login Button */}
          <div className="w-full lg:w-[250px]">
            <button
              type="button"
              onClick={() => {
                const clientId = import.meta.env.VITE_CLEVER_CLIENT_ID;
                const districtId = import.meta.env.VITE_CLEVER_DISTRICT_ID;
                const redirectUri = encodeURIComponent(import.meta.env.VITE_CLEVER_REDIRECT_URI);

                // Instant Login URL (bypasses district picker)
                window.location.href = `https://clever.com/oauth/instant-login?client_id=${clientId}&district_id=${districtId}&redirect_uri=${redirectUri}`;
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors"
              aria-label="Login with Clever"
            >
              Login with Clever
            </button>

          </div>

          <p className="text-white text-xs text-center mt-2 max-w-md">
            Students and teachers from partner school districts must sign in using Clever.
          </p>
        </section>
      )}

      {/* Services Cards Section */}
      <section
        className="flex justify-center mt-10 mb-10 px-4"
        aria-labelledby={servicesHeadingId}
      >
        <div className="w-full">
          <h2
            id={servicesHeadingId}
            className="text-3xl font-bold text-gray-900 mb-8 text-center"
          >
            Our Services
          </h2>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto p-3"
            role="list"
            aria-label="Acewall Scholars services"
          >
            {cardData.map((card, index) => (
              <div
                key={`${card.name}-${index}`}
                role="listitem"
                className="h-full"
              >
                <LandingPageCard
                  name={card.name}
                  description={card.description}
                  imageUrl={card.imageUrl}
                  buttonUrl={card.buttonUrl}
                  aria-label={`${card.name}. ${card.description}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen Reader Summary */}
      <div className="sr-only" role="complementary">
        <h2>Page Summary</h2>
        <p>
          Welcome to Acewall Scholars. This page provides an overview of our
          services including Academic Tutoring, Mentoring and Mental Health
          Support, Parent Aide, Test Prep, Internship Support, and College
          Counseling.
        </p>
        <p>
          If you are not logged in, you can choose to login as a teacher or
          student, or get started today by contacting us.
        </p>
      </div>
    </main>
  );
};

export default LandingPage;
