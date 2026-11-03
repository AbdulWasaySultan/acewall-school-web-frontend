import React, { useRef, useState } from "react";
import teacherpic from "../assets/TeacherPic.png";
import bgvideo from "../assets/bg.mp4";

import stppic from "../assets/std.png";
import schoolimage from "../assets/schoolimage-removebg-preview.png";
import blackboard from "../assets/blackboard.png";
import { Link, useNavigate } from "react-router-dom";
import { StackedCard } from "@/CustomComponent/FeatureContent";
import Popup from "@/CustomComponent/Popup";

const FeaturedPage = () => {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();

  // Refs without TypeScript
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const handleScrollTo = (ref) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    ref.current.focus({ preventScroll: true });
  };

  const cardsData = [
    {
      id: "card1",
      heading: "For Schools & Institutions",
      text:
        "Streamline education and improve outcomes with a complete online learning solution. Our platform helps schools move seamlessly to the cloud, making education more accessible, efficient, and scalable—without heavy infrastructure or setup.",
      bulletPoints: [
        "Specialty LMS catered to each school",
        "Efficient, User Friendly, and Cost Effective",
        "Dedicated Support Team",
        "Income Opportunities for schools and teachers just through signing-up",
        "Switch and save up to 30% off current LMS",
        "Worldwide access for students and teachers",
        "100% cloud-based – no heavy setup required",
        "Manage courses, teachers, and students all in one place",
        "Centralized grading, announcements, and communication",
        "Secure and reliable platform for every institution",
        "Quick onboarding and easy adoption for schools",
        "Improve overall academic performance and engagement",
        "Automated notifications and reminders",
        "Scalable solution for institutions of any size",
      ],
    },
    {
      id: "card2",
      heading: "For Teachers",
      text:
        "Simplify teaching and focus on what matters most—your students. Our LMS gives teachers the tools to create engaging courses, track performance, and personalize learning experiences with ease.",
      bulletPoints: [
        "Create and manage courses effortlessly",
        "Dedicated Support Team",
        "Income Opportunities for schools and teachers just through signing-up",
        "Assign and grade homework, projects, and exams",
        "Chat with students individually or as a group",
        "Access and manage detailed gradebooks",
        "Customize your profile and teaching style",
        "Track student performance with analytics",
        "Upload video lectures and course materials",
        "Send announcements and reminders instantly",
        "Save time with streamlined teaching workflows",
      ],
    },
    {
      id: "card3",
      heading: "For Students K-12 / College Level",
      text:
        "Learn anywhere, anytime—with everything you need at your fingertips. Students can enjoy a smooth learning experience, connect with teachers, and stay on top of assignments—all from one simple platform.",
      bulletPoints: [
        "Enroll in courses and complete assignments easily",
        "Dedicated Support Team",
        "Access video lectures, notes, and documents anytime",
        "Communicate directly with teachers through built-in messaging",
        "View grades and progress in real time",
        "24/7 support to help whenever you’re stuck",
        "Access a variety of learning resources in one place",
        "Learn at your own pace with flexible schedules",
        "Stay updated with notifications and announcements",
        "Connect and collaborate with peers worldwide",
      ],
    },
  ];

  return (
    <div>
      {/* Skip link */}
      <a
        href="#featured-main"
        className="sr-only focus:not-sr-only p-2 m-2 bg-white text-sm rounded shadow"
      >
        Skip to main content
      </a>

      {showPopup && <Popup onClose={() => setShowPopup(false)} />}

      <header aria-label="Hero banner" role="banner">
        <section
          className="relative py-6 px-6 sm:px-10 bg-gray-100 flex justify-center items-center"
          aria-labelledby="hero-heading"
        >
          <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5">
              <h1
                id="hero-heading"
                className="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-snug text-gray-900 font-['Shadows_Into_Light']"
              >
                Best online platform for education.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-['Patrick_Hand'] max-w-lg mx-auto lg:mx-0">
                Since 2006,{" "}
                <span className="font-bold text-green-700">Acewall Scholars</span>{" "}
                has helped students master math, science, English, and reading
                comprehension. We’re making learning seamless, teaching
                effortless, and school management smarter.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-green-600 text-white font-bold py-2 px-5 rounded-md shadow-md hover:bg-green-700 transition border-2 border-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  aria-label="Get started today - contact us"
                >
                  Get Started Today
                </button>

                <Link to="/home" aria-label="Existing user login">
                  <button className="border-2 border-green-700 text-green-700 font-bold py-2 px-5 rounded-md shadow-md hover:bg-green-700 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Existing user? Log in
                  </button>
                </Link>
              </div>
            </div>

            <div
              className="relative w-full lg:w-1/2 flex justify-center items-center bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
              style={{ backgroundImage: `url(${blackboard})` }}
              aria-hidden="true"
            >
              <div className="relative w-[80%] aspect-video my-20">
                <div className="absolute inset-0 bg-black/20 z-10 rounded-lg" aria-hidden="true" />

                <video
                  src={bgvideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-90 rounded-lg"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>
        </section>
      </header>

      <main id="featured-main" role="main" tabIndex={-1} aria-label="Featured content">
        <section className="relative mt-16 mb-20 sm:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 sm:gap-6 px-4 sm:px-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => handleScrollTo(card1Ref)}
                className="w-full bg-blue-900 text-white text-center rounded-lg p-6 pb-28 sm:pb-24 shadow-lg cursor-pointer hover:bg-blue-800 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-describedby="schools-desc"
              >
                <h3 className="text-lg sm:text-2xl font-bold mb-12 sm:mb-20">Schools/Institutions</h3>
                <span className="sr-only" id="schools-desc">
                  View details for Schools and Institutions
                </span>

                <img
                  src={schoolimage}
                  alt="Schools and institutions illustration"
                  className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-12 w-50 sm:w-38 lg:w-40 object-contain"
                />
              </button>

              <div
                ref={card1Ref}
                id="card1"
                tabIndex={-1}
                aria-label="Schools and institutions details"
                className="mt-8"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => handleScrollTo(card2Ref)}
                className="w-full bg-blue-900 text-white text-center rounded-lg p-6 pb-28 sm:pb-24 shadow-lg cursor-pointer hover:bg-blue-800 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-describedby="teachers-desc"
              >
                <h3 className="text-lg sm:text-2xl font-bold mb-12 sm:mb-20">Teachers</h3>
                <span className="sr-only" id="teachers-desc">
                  View details for Teachers
                </span>

                <img
                  src={teacherpic}
                  alt="Teacher illustration"
                  className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-20 w-50 sm:w-38 lg:w-55 object-contain"
                />
              </button>

              <div
                ref={card2Ref}
                id="card2"
                tabIndex={-1}
                aria-label="Teachers details"
                className="mt-8"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => handleScrollTo(card3Ref)}
                className="w-full bg-blue-900 text-white text-center rounded-lg p-6 pb-28 sm:pb-24 shadow-lg cursor-pointer hover:bg-blue-800 transition focus:outline-none focus:ring-4 focus:ring-blue-300 "
                aria-describedby="students-desc"
              >
                <h3 className="text-lg sm:text-2xl font-bold mb-12 sm:mb-20">
                  Students K-12 / College Level
                </h3>
                <span className="sr-only" id="students-desc">
                  View details for Students
                </span>

                <img
                  src={stppic}
                  alt="Students illustration"
                  className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-20 w-50 sm:w-38 lg:w-75 object-contain"
                />
              </button>

              <div
                ref={card3Ref}
                id="card3"
                tabIndex={-1}
                aria-label="Students details"
                className="mt-8"
              />
            </div>
          </div>

          <div className="bg-[#156082] py-12 sm:py-20 mt-6 px-4 sm:px-10" aria-hidden="true" />
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-[3vw] font-bold mb-4">
              Who We Serve
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-semibold leading-relaxed">
              Empowering schools, teachers, and students with one powerful platform that
              makes learning seamless, teaching effortless, and school management
              smarter—anytime, anywhere.
            </p>
          </div>

          <StackedCard cardsData={cardsData} />
        </section>
      </main>
    </div>
  );
};

export default FeaturedPage;
