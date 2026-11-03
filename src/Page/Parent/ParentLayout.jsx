import * as React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import acewallscholarslogo from "../../assets/acewallscholarslogo.webp";
import acewallshort from "../../assets/acewallshort.png";
import { Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import { DashboardCircleAddIcon } from "@/assets/Icons/deshboard";
import { Book02Icon } from "@/assets/Icons/mycoursesIcon";
import { AssessmentIcon } from "@/assets/Icons/AssignmentIcon";
import { Megaphone02Icon } from "@/assets/Icons/Announcement";
import Footer from "@/CustomComponent/Footer";
import { useContext, useState } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import avatar from "../../assets/avatar.png";
import { FaHandFist } from "react-icons/fa6";
import { ParentTopNavbarDropDown } from "@/CustomComponent/ParentTopNavDropDown";
import { Target02Icon } from "@/assets/Icons/grades";

export default function ParentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, UpdatedUser } = useContext(GlobalContext);
  const { studentId } = useParams(); // Get the ID from /parent/:studentId
  const location = useLocation().pathname;

  // Define sidebar tabs inside the component to use the studentId variable
  const sideBarTabs = [
    {
      id: 1,
      name: "Dashboard",
      icon: <DashboardCircleAddIcon aria-hidden="true" />,
      path: `/parent/${studentId}`, // Dynamic Dashboard
    },
    {
      id: 2,
      name: "Gradebook",
      icon: <Target02Icon aria-hidden="true" />,
      path: `/parent/${studentId}/child-gradebook`, // Dynamic Gradebook
    },
    {
      id: 3,
      name: "Courses",
      icon: <Book02Icon aria-hidden="true" />,
      path: `/parent/${studentId}/courses`,
    },
    {
      id: 4,
      name: "Assessments",
      icon: <AssessmentIcon aria-hidden="true" />,
      path: `/parent/${studentId}/assessments`,
    },
    {
      id: 5,
      name: "Announcements",
      icon: <Megaphone02Icon aria-hidden="true" />,
      path: "announcements",
    },
    {
      id: 6,
      name: "Support",
      icon: <FaHandFist color="black" aria-hidden="true" />,
      path: `/parent/${studentId}/support`,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#maincontent"
        className="sr-only focus:not-sr-only inline-block px-4 py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 bg-white">
        <div className="h-8 bg-green-600 flex justify-end items-center px-5 cursor-pointer">
          <ParentTopNavbarDropDown />
        </div>
        <div
          className="flex h-16 items-center justify-between px-4 border"
          role="banner"
        >
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link to={`/parent/${studentId}`} className="flex items-center">
            <img
              src={acewallscholarslogo}
              alt="Logo"
              className="w-32 md:w-40 h-auto"
            />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center space-x-3 pb-6 border-b mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={UpdatedUser?.profileImg?.url || avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">
                  {UpdatedUser?.firstName || "Parent"}
                </p>
                <p className="text-xs text-gray-500 truncate">Parent Account</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              {sideBarTabs.map((tab) => {
                const isActive = location === tab.path;
                return (
                  <Link
                    key={tab.id || tab.name}
                    to={tab.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 transition-all ${
                      isActive
                        ? "bg-green-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <span
                      className={isActive ? "text-white" : "text-green-600"}
                    >
                      {tab.icon}
                    </span>
                    <span className="font-medium text-sm">{tab.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t flex flex-col items-center">
              <img
                src={acewallshort}
                alt="Logo"
                className="w-12 opacity-50 mb-2"
              />
              <Link
                to="https://www.acewallscholars.org/contact-Us"
                className="text-xs text-green-600 font-semibold hover:underline text-center"
              >
                Need Tutoring? <br /> Contact us
              </Link>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main id="maincontent" className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-full mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
