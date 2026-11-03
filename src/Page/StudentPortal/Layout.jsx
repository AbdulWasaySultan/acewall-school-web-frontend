import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import acewallscholarslogo from "../../assets/acewallscholarslogo.webp";
import acewallshort from "../../assets/acewallshort.png";
import avatar from "../../assets/avatar.png";

import {
  Bot,
  Coffee,
  GitGraph,
  Menu,
  MessageCircleDashed,
  MessagesSquare,
  MessagesSquareIcon,
  Search,
  StickyNote,
  ChevronDown,
  BookOpen,
  Video,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { TopNavbarDropDown } from "../../CustomComponent/TopNavDropDown";
import { Input } from "../../components/ui/input";

import { DashboardCircleAddIcon } from "@/assets/Icons/deshboard";
import { Book02Icon } from "@/assets/Icons/mycoursesIcon";
import { AssessmentIcon } from "@/assets/Icons/AssignmentIcon";
import { Megaphone02Icon } from "@/assets/Icons/Announcement";
import { Target02Icon } from "@/assets/Icons/grades";

import Footer from "@/CustomComponent/Footer";
import MoreCoursesDropdown from "@/CustomComponent/MoreCoursesDropdown";
import { GlobalContext } from "@/Context/GlobalProvider";
import { axiosInstance } from "@/lib/AxiosInstance";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Sidebar tabs configuration
const sideBarTabs = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardCircleAddIcon aria-hidden="true" />,
    path: "/student",
    allowedAsPreview: true,
  },
  {
    id: "courses-dropdown",
    name: "Courses",
    icon: <BookOpen className="w-5 h-5" aria-hidden="true" />,
    isDropdown: true,
    subItems: [
      {
        id: 2,
        name: "My Courses",
        icon: <Book02Icon aria-hidden="true" />,
        path: "/student/mycourses",
        allowedAsPreview: true,
      },
      {
        id: 3,
        name: "My Assessment",
        icon: <AssessmentIcon aria-hidden="true" />,
        path: "/student/assessment",
        allowedAsPreview: true,
      },
      {
        id: 4,
        name: "Gradebook",
        icon: <Target02Icon aria-hidden="true" />,
        path: "/student/gradebook",
        allowedAsPreview: true,
      },
      {
        id: 5,
        name: "Announcements",
        icon: <Megaphone02Icon aria-hidden="true" />,
        path: "/student/AnnouncementsCoursesStd",
        allowedAsPreview: true,
      },
      {
        name: "Discussion Rooms",
        icon: <MessagesSquareIcon aria-hidden="true" />,
        path: "/student/discussions/allCourses",
        allowedAsPreview: true,
      },
      {
        id: "meetings",
        name: "Meetings",
        icon: <Video className="w-5 h-5" aria-hidden="true" />,
        path: "/student/meetings",
        allowedAsPreview: true,
      },
      {
        id: 11,
        name: "Attendance",
        icon: <Bot />, // Note: You used Bot icon in original for Attendance
        path: "/student/attendance/att",
        allowedAsPreview: false,
      },
    ],
  },
  {
    id: 6,
    name: "Pages",
    icon: <StickyNote aria-hidden="true" />,
    path: "/student/stdPages",
    allowedAsPreview: true,
  },
  {
    id: 7,
    name: "Spill the Tea",
    icon: <Coffee aria-hidden="true" />,
    path: "/Student/social",
  },
  {
    id: 8,
    name: "Grading Scales",
    icon: <GitGraph aria-hidden="true" />,
    path: "/Student/graphs",
  },
  {
    id: 9,
    name: "Messages",
    icon: <MessageCircleDashed aria-hidden="true" />,
    path: "/student/messages",
    allowedAsPreview: false,
  },
  {
    id: 10,
    name: "AI Assistant",
    icon: <Bot />,
    path: "/student/ai",
    allowedAsPreview: false,
  },
];

export default function Layout() {
  const { user, checkAuth, UpdatedUser, setUpdatedUser } =
    React.useContext(GlobalContext);
  const location = useLocation().pathname;

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = React.useState(false); // Controls course dropdown
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownCourses, setDropdownCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const navigate = useNavigate();

  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part.toLowerCase() === query.toLowerCase() ? (
              <span className="text-green-600 font-semibold">{part}</span>
            ) : (
              part
            )}
          </span>
        ))}
      </>
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    setOpenDropdown(false);

    try {
      const res = await axiosInstance.get("/enrollment/studentCourses", {
        params: { search: searchQuery },
      });
      setDropdownCourses(res.data.enrolledCourses || []);
    } catch (error) {
      console.error("Search error:", error);
      setDropdownCourses([]);
    } finally {
      setLoading(false);
      setOpenDropdown(true);
    }
  };

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-10 bg-white">
        <div className="h-8 bg-green-600 flex justify-end items-center px-5">
          {user && user.role === "teacherAsStudent" ? (
            <div className="flex items-center justify-between space-x-4 w-full">
              <div>
                <p className="text-white text-sm">
                  {`Viewing as Student - ${user.firstName || ""} ${user.lastName || ""
                    }`}
                </p>
              </div>
              <Button
                variant="outline"
                size="xs"
                className="px-3 text-xs"
                onClick={async () => {
                  await axiosInstance.post("auth/previewSignOut").then(() => {
                    checkAuth();
                    navigate("/teacher");
                  });
                }}
                aria-label="Switch to teacher view"
              >
                Switch to Teacher
              </Button>
            </div>
          ) : (
            <TopNavbarDropDown />
          )}
        </div>

        <div className="flex h-16 items-center justify-between px-4 border">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-expanded={isSidebarOpen}
            aria-controls="primary-sidebar"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <Link
            className="block md:hidden"
            to="/student"
            aria-label="Home - Acewall Scholars"
          >
            <img
              src={acewallshort}
              alt="Acewall Scholars logo"
              className="w-8 h-auto rounded-full"
            />
          </Link>
          <Link
            className="hidden md:block"
            to="/student"
            aria-label="Home - Acewall Scholars"
          >
            <img
              src={acewallscholarslogo}
              alt="Acewall Scholars"
              className="w-40 h-auto"
            />
          </Link>

          <div className="flex gap-6 items-center">
            <MoreCoursesDropdown />
            <Link
              to="/student/support"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              SUPPORT
            </Link>
            <Link
              to="/student/ContactUs"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              CONTACT US
            </Link>
          </div>

          <div className="relative w-64 hidden md:flex flex-col">
            <DropdownMenu
              open={openDropdown}
              onOpenChange={setOpenDropdown}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <div className="relative flex gap-2 w-full" role="search">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search courses and lessons"
                    className="w-full "
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
                  >
                    <Search className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white border mt-2 max-h-60 overflow-y-auto z-50 w-64">
                {loading ? (
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-gray-700">Searching...</span>
                  </DropdownMenuItem>
                ) : dropdownCourses.length > 0 ? (
                  dropdownCourses.map((enrollment) => (
                    <DropdownMenuItem key={enrollment._id} asChild>
                      <Link
                        to={`/student/mycourses/${enrollment._id}`}
                        className="w-full text-sm text-gray-800 hover:bg-gray-100 px-2 py-1 block"
                        onClick={() => setOpenDropdown(false)}
                      >
                        <span className="block truncate w-full text-left">
                          {highlightMatch(
                            enrollment.course?.courseTitle || "Untitled Course",
                            searchQuery
                          )}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-gray-500">No results found</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          id="primary-sidebar"
          className={`bg-white ${isSidebarOpen ? "block" : "hidden"
            } w-screen md:w-64 flex-shrink-0 overflow-y-auto md:block`}
        >
          <div className="p-4">
            <div className="flex items-center space-x-3 pb-4">
              <Link to="/student/account" className="block">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={UpdatedUser?.profileImg?.url || avatar}
                    alt="Profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </Link>
              <div>
                <p className="font-medium">{UpdatedUser?.firstName || "User"}</p>
                <p className="text-sm text-gray-600 w-full max-w-[150px] break-words" title={UpdatedUser?.email}>
                  {UpdatedUser?.email || "N/A"}
                </p>
              </div>
            </div>

            <nav className="space-y-2" role="navigation">
              {sideBarTabs.map((tab) => {
                if (tab.isDropdown) {
                  return (
                    <div key={tab.id}>
                      <button
                        onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                        className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-black hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span aria-hidden="true">{tab.icon}</span>
                          <span className="text-green-600">{tab.name}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isCoursesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isCoursesOpen && (
                        <div className="mt-1 ml-6 space-y-1 border-l-2 border-gray-100">
                          {tab.subItems.map((subItem) => {
                            const isSubCurrent = location === subItem.path;
                            const isSubUnavailable = subItem.allowedAsPreview === false && user?.role === "teacherAsStudent";

                            return isSubUnavailable ? (
                              <div key={subItem.id || subItem.name} className="flex items-center space-x-3 rounded-lg px-3 py-2 opacity-50 pointer-events-none">
                                <span className="scale-75">{subItem.icon}</span>
                                <span className="text-sm text-green-600">{subItem.name}</span>
                              </div>
                            ) : (
                              <Link
                                key={subItem.id || subItem.name}
                                to={subItem.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${isSubCurrent ? "bg-green-500 text-white" : "text-black hover:bg-gray-50"
                                  }`}
                              >
                                <span className="scale-75">{subItem.icon}</span>
                                <span className="text-sm">{subItem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isCurrent = location === tab.path;
                const unavailable = tab.allowedAsPreview === false && user?.role === "teacherAsStudent";

                return (
                  <div key={tab.id ?? tab.name}>
                    {unavailable ? (
                      <div className="flex items-center space-x-3 rounded-lg px-3 py-2 opacity-50 pointer-events-none" aria-disabled="true">
                        <span aria-hidden="true">{tab.icon}</span>
                        <span className="text-green-600">{tab.name}</span>
                      </div>
                    ) : (
                      <Link
                        to={tab.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center space-x-3 rounded-lg px-3 py-2 ${isCurrent ? "bg-green-500" : "text-black hover:bg-gray-50"
                          }`}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <span aria-hidden="true">{tab.icon}</span>
                        <span className={isCurrent ? "text-white" : "text-green-600"}>
                          {tab.name}
                        </span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex flex-col items-center justify-between mt-10 w-full">
              <img src={acewallshort} alt="Logo" className="w-1/2" />
              <Link to="https://www.acewallscholars.org/contact-Us" className="text-center font-semibold text-sm mt-4 text-acewall-main">
                Need Tutoring? Contact us
              </Link>
            </div>
          </div>
        </aside>

        <main id="main-content" className="flex-1 p-2 md:p-4 overflow-y-auto" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}