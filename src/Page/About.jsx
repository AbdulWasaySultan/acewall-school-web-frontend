import React, { useId } from "react";
import { Button } from "@/components/ui/button";

const About = () => {
  const historyHeadingId = useId();
  const missionHeadingId = useId();
  const historyImageId = useId();
  const missionImageId = useId();

  const scrollToContact = () => {
    // Implement contact navigation or scroll behavior
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* History Section */}
      <section className="container mx-auto py-12 max-w-6xl" aria-labelledby={historyHeadingId}>
        <div className="grid lg:grid-cols-2 gap-10 px-4 py-10 rounded-lg">
          {/* Image */}
          <figure>
            <img
              id={historyImageId}
              src="https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/shutterstock_2439625087-696w.jpg"
              alt="Team of diverse people with arms around each other, representing Acewall Scholars community"
              className="w-full h-full object-cover rounded-md shadow-md"
            />
            <figcaption className="sr-only">
              Acewall Scholars team and community members
            </figcaption>
          </figure>

          {/* Text Content */}
          <article className="flex flex-col justify-between space-y-6">
            <div>
              <h1
                id={historyHeadingId}
                className="text-4xl font-bold text-green-700 mb-6"
              >
                Our History
              </h1>

              <div className="space-y-4 text-gray-700">
                <p className="text-justify leading-relaxed">
                  Acewall Scholars was originally formed in 2006 as a non-profit in-home
                  and online tutoring company. Acewall Scholars was founded with an
                  unwavering commitment to improve the academic performance of students in
                  mathematics and sciences. Acewall Scholars is designed to offer students
                  a curriculum that provides remediation, enrichment, and mastery. With
                  growing awareness that many academic deficiencies stem from problematic
                  areas beyond the classroom, in 2010, Acewall Scholars began to take a
                  more holistic approach to education and the overall personal growth of
                  each student. To accomplish this, the program "Kids Going Green" was
                  developed, which tied together classroom performance with overall diet
                  and wellness.
                </p>

                <p className="text-justify leading-relaxed">
                  Reorganized in 2015 as a for-profit educational and mentoring
                  organization, Acewall Scholars has adopted a more comprehensive method
                  to reach more students in the most effective and permanent way. Our
                  assistance goes beyond the classroom. We assist our clients with not
                  just academic growth, but also social, spiritual, and physical growth.
                  We know that every child wants to succeed in life. It is our goal to
                  give them the space to see that they can, and the determination to
                  define their own path to success. Collectively, we are committed to
                  building relationships and positively affecting the lives of all
                  students and families that we serve.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Mission Section */}
      <section
        className="relative overflow-hidden min-h-screen px-4 flex items-center py-12"
        aria-labelledby={missionHeadingId}
      >
        {/* Parallax Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://irp.cdn-website.com/6602115c/dms3rep/multi/section+background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            opacity: 0.15,
          }}
          aria-hidden="true"
        ></div>

        {/* Overlay for text readability */}
        <div
          className="absolute inset-0 bg-white/70 z-0"
          aria-hidden="true"
        ></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto py-12 grid lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Left: Text Content */}
          <article className="flex flex-col justify-between p-8 bg-[#e3e9e3]/95 rounded-lg shadow-lg border border-green-200 focus-within:ring-2 focus-within:ring-green-600">
            <div className="space-y-4">
              <h2
                id={missionHeadingId}
                className="text-3xl font-bold text-green-700"
              >
                Our Mission
              </h2>

              <p className="text-gray-800 text-justify leading-relaxed">
                Acewall Scholars LLC is an organization holistically designed to engage
                and meet the needs of each child. We promote the enrichment of the mind,
                body, and spirit. We believe that academics and social success are
                intricately connected to a child's belief in their own capability and
                their exposure to the different facets of our society and cultures within
                it. With this belief, we strive to broaden the vision of each child and
                obtain improvements in their academic and social lives.
              </p>
            </div>

            <Button
              onClick={scrollToContact}
              className="bg-green-500 hover:bg-green-600 text-white w-fit mt-6 focus:ring-2 focus:ring-green-700 focus:outline-none focus:ring-offset-2 transition-all"
              aria-label="Contact Acewall Scholars for more information"
            >
              Contact Us
            </Button>
          </article>

          {/* Right: Image */}
          <figure>
            <img
              id={missionImageId}
              src="https://lirp.cdn-website.com/6602115c/dms3rep/multi/opt/about+us+1-696w.jpg"
              alt="Diverse group of students and mentors together, representing Acewall Scholars' commitment to community and growth"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <figcaption className="sr-only">
              Acewall Scholars students and mentors working together
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Hidden contact section anchor */}
      <div id="contact-section" className="sr-only" tabIndex="-1">
        Contact section
      </div>
    </main>
  );
};

export default About;