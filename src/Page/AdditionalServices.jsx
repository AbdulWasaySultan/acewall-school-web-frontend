import { LandingPageCard } from "@/CustomComponent/Card";
import React, { useId } from "react";

const cardData = [
  {
    name: "Academic Tutoring",
    description:
      "Acewall Scholars offers one-on-one tutoring services to support students in their academic journey. Our experienced tutors provide personalized instruction and guidance to help students succeed.",
    imageUrl:
      "https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/AdobeStock_357701907-1920w.jpeg",
    buttonUrl: "https://www.acewallscholars.org/academic-tutoring",
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
      "Acewall Scholars' parent aide program offers a holistic approach to developing effective parenting skills. This program provides education on supporting children through their emotional, physical, mental, and spiritual development. Our program imparts a deeper understanding of the core, individual needs of the child within each developmental stage.",
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

const AdditionalServices = () => {
  const sectionId = useId();
  const headingId = useId();
  const gridId = useId();

  return (
    <main className="w-full">
      <section
        id={sectionId}
        className="flex justify-center flex-col items-center py-12 px-4"
        aria-labelledby={headingId}
      >
        {/* Section Header */}
        <div className="w-full max-w-4xl mb-12">
          <h1
            id={headingId}
            className="text-2xl sm:text-3xl md:text-4xl py-6 px-6 mb-8 font-bold bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-green-800 focus:outline-none"
          >
            Additional Services
          </h1>
          <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed px-4">
            Explore our comprehensive range of educational and support services
            designed to help students succeed academically and personally.
          </p>
        </div>

        {/* Services Grid */}
        <div
          id={gridId}
          className="w-full max-w-7xl px-4"
          role="region"
          aria-labelledby={headingId}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
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
                  aria-label={`${card.name} service. ${card.description}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Summary for Screen Readers */}
        <div className="sr-only" role="complementary" aria-live="polite">
          Additional services section. There are {cardData.length} services
          available:
          {cardData.map((card) => card.name).join(", ")}. Use arrow keys to
          navigate through the services.
        </div>
      </section>
    </main>
  );
};

export default AdditionalServices;
