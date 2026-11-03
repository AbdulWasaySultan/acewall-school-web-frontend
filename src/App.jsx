import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./Page/StudentPortal/Layout";
import Deshboard from "./Page/StudentPortal/Deshboard";
import Mycourses from "./Page/StudentPortal/Courses/MyCourses";
import Assignment from "./Page/StudentPortal/Assessment/Assignment";
import Login from "./Page/Login";
import Account from "./Page/StudentPortal/Account";
import Gradebook from "./Page/StudentPortal/Gradebook";
import SignupPage from "./Page/signup";
import AllCourses from "./Page/AllCourses";
import AllCoursesDetail from "./Page/allCourseDetail";
import MainLayout from "./Page/MainLayout";
import Support from "./Page/Support";
import LandingPage from "./Page/LandingPage";
import Messages from "./Page/Messages";

import GeneralCourses from "./Page/GeneralCourses";
import GeneralSupport from "./Page/GeneralSupport";
import GeneralCoursesDetail from "./Page/GeneralCourseDetail";
import TeacherDashboard from "./Page/teacher/Dashboard";
import TeacherLayout from "./Page/teacher/Layout";
import TeacherAccount from "./Page/teacher/Account";
import TeacherrAssessment from "./Page/teacher/CourseAssessmentList";
import TeacherAnnoucement from "./Page/teacher/TeacherAnnoucement";
import AllStudent from "./Page/teacher/AllStudent";
import StudentProfile from "./Page/teacher/studentProfile";
import TeacherCourses from "./Page/teacher/Courses/TeacherCourses";
import TeacherCourseDetails from "./Page/teacher/Courses/CourseDetail";
import CreateCourses from "./Page/teacher/Courses/CreateCourses";
import CoursesChapter from "./Page/teacher/Courses/CourseChapters";
import TeacherGradebook from "./Page/teacher/Courses/Gradebook";
import TeacherLogin from "./Page/TeacherLogin";
import CreateAssessmentPage from "./Page/teacher/CreateAssessment";
import AdditionalServices from "./Page/AdditionalServices";
import About from "./Page/About";
import ScrollToTop from "./lib/scrolltop";
import ContactUs from "./Page/ContactUs";
import { PrivateRoute, PublicRoute } from "./lib/PrivateRoutes";

import CoursesBasis from "./Page/teacher/Courses/CoursesBasics";
import { useEffect, useContext } from "react";
import { GlobalContext } from "./Context/GlobalProvider";
import LoadingLoader from "./CustomComponent/LoadingLoader";
import MainDetailPage from "./Page/StudentPortal/Courses/MainDetailPage";
import ChapterDetail from "./Page/StudentPortal/Courses/MyCourseDetail";
import NotFoundPage from "./Page/NotFoundPage";
import { io } from "socket.io-client";
import ChatWindow from "./CustomComponent/MessagesCmp.jsx/chat-window";
import AssessmentSubmissionPage from "./Page/StudentPortal/Assessment/AssessmentSubmissionPage";
import SubmittedAssessment from "./Page/teacher/Assessment/submittedAssessment";
import AssessmentReview from "./Page/teacher/Assessment/submittedAssessment";
import AllSubmission from "./Page/teacher/Assessment/allSubmission";
import VerifyOTP from "./Page/VerifyOTP";
import VerifyPhoneOTP from "./Page/VerifyPhoneOTP";
import ForgetPassword from "./Page/forgetPassword";
import VerifyForgetPasswordOTP from "./Page/VerifyForgetPasswordOTP";
import NewPassword from "./Page/NewPassword";
import EditGeneralInfo from "./Page/Account/EditGeneralInfo";
import { EditCredentials } from "./Page/Account/EditCredentials";
import StudentCourseGrades from "./Page/teacher/studentCourseGrades";
import TeacherDiscussion from "./Page/teacher/Discussion/TeacherDiscussisons";
import TeacherDiscussionChat from "./Page/teacher/Discussion/TeacherDiscussionChat";
import StudentDiscussion from "./Page/StudentPortal/Student Discussion/StudentDiscussisons";
import StudentDiscussionChat from "./Page/StudentPortal/Student Discussion/StudentDiscussionChat";
import StdPreview from "./Page/teacher/Courses/StdPreview";
import SemesterDetail from "./Page/teacher/Courses/SemesterDetail";
import QuarterDetail from "./Page/teacher/Courses/QuarterDetail";
import StudentSemesterDetail from "./Page/StudentPortal/Courses/StudentSemesterDetail";
import AllChapter from "./Page/StudentPortal/Courses/AllChapter";
import CourseGradebookPage from "./Page/teacher/CourseGradebookPage";
import ViewCoursePostsPage from "./Page/teacher/ViewCoursePosts";
import StdPagesView from "./Page/StudentPortal/StdPagesView";
import EditCourse from "./Page/teacher/Courses/EditCoursesBasics";
import TeacherChapterDetail from "./Page/teacher/Courses/quarter/chapter-detail";
import { AssessmentPage } from "./Page/teacher/Courses/quarter/assessment-dialog";
import StdPreview2 from "./Page/teacher/Courses/StdPreview2";
import StudentSemesterDetailStdPre from "./Page/teacher/Courses/StudentSemesterDetailStdPre";
import AllChapterStdPre from "./Page/teacher/Courses/AllChapterStdPre";
import ChapterDetailStdPre from "./Page/teacher/Courses/MyCourseDetailStdPre";
import FeaturedPage from "./Page/FeaturedPage";
import TermsPage from "./Page/TermAndConditionPage";
import PrivacyPolicyPage from "./Page/privacyPolicyPage";
import FeaturedContantCard from "./CustomComponent/FeaturedContantCard";
import { axiosInstance } from "./lib/AxiosInstance";
import SocialMain from "./Page/teacher/SocialMain";
import SocialProfilePage from "./Page/teacher/socialProfilePage";
import EditParentEmail from "./Page/Account/EditParentEmail";
import StudentWhoNeedAssistance from "./Page/teacher/StudentNeedAssistancePage";
import GradingScales from "./Page/teacher/GradingScales";
import AllStdCourses from "./Page/teacher/AllStdCourses";
import CourseStudents from "./Page/teacher/CourseStudents";
import CourseAssessmentList from "./Page/teacher/CourseAssessmentList";
import TeacherAssessmentByCourse from "./Page/teacher/TeacherAssessmentByCourse";
import StudentCourseByCard from "./Page/StudentPortal/Assessment/StudentCourseByCard";
import AiChatbot from "./Page/StudentPortal/AiChatbot";
import TeacherCoursesForConversation from "./Page/teacher/Conversation/AllcoursesforConversation";
import StudentsList from "./Page/teacher/Conversation/StudentList";
import TeacherCoursesForDiscussion from "./Page/teacher/Discussion/AllcoursesforDiscussion";
import AllannouncementCourses from "./Page/teacher/AllannouncmentCourses";
import AllannouncementCoursesStd from "./Page/StudentPortal/AllannouncmentCoursesStd";
import StudentCourseAnnouncements from "./Page/StudentPortal/StudentCourseAnnouncements";
import ParentLogin from "./Page/Parent/ParentLogin";
import ParentLayout from "./Page/Parent/ParentLayout";
import ParentDashboard from "./Page/Parent/ParentDashboard";
import MyChildren from "./Page/Parent/MyChildren";
import ChildGradebook from "./Page/Parent/ChildGradebook";
import EnrollmentStats from "./CustomComponent/teacher/EnrollmentStats";
import MessagesForStudents from "./Page/StudentPortal/Messages";
import AllCoursesFilterPage from "./Page/allCoursesPage";
import AssessmentAnalytics from "./Page/teacher/Assessment/AssessmentAnalytics";
import ChildCourseCards from "./Page/Parent/ChildCourseCards";
import ParentCourseOverview from "./Page/Parent/ParentCourseOverview";
import AllannouncementCoursesPerent from "./Page/Parent/AllannouncementCoursesPerent";
import AllAnnouncementCoursesParent from "./Page/Parent/AllannouncementCoursesPerent";
import CourseAnnouncementsListParent from "./Page/Parent/ParentCourseAnnouncements";
import ParentCourseAnnouncements from "./Page/Parent/ParentCourseAnnouncements";
import ParentCourseByCard from "./Page/Parent/Assessment/ParentCourseByCard";
import ParentAssessment from "./Page/Parent/Assessment/ParentAssessment";
import ParentAssessmentResultPage from "./CustomComponent/parent/ParentAssessmentResultPage";
import AStdCAtt from "./Page/teacher/Attendance/AStdCAtt";
import CstdAttendance from "./Page/teacher/Attendance/CstdAttendance";
import StudentAttendanceView from "./Page/StudentPortal/Attendance/StudentAttendanceView";
import StudentMonthlyAttendance from "./Page/StudentPortal/Attendance/StudentMonthlyAttendance";
import Passwordlesslogin from "./Page/Parent/Passwordless-login";
import LoginChartActivity from "./Page/teacher/LoginChartActivity";
import CourseImportPage from "./Page/teacher/Courses/CourseImportPage";
import ScheduleClassPage from "./Page/teacher/Courses/ScheduleClassPage";
import StudentMeetingList from "./Page/StudentPortal/Courses/StudentMeetingList";
import NotificationsPage from "./CustomComponent/NotificationsPage";
import TeacherStudentAnalytics from "./Page/teacher/TeacherStudentAnalytics";
import CourseAnalytics from "./Page/StudentPortal/CourseAnalytics";
import ParentChildAnalytics from "./Page/Parent/fetchParentAnalytics";
import CoursesWithMeetings from "./Page/StudentPortal/Meetings/CoursesWithMeetings";
import CoursePacingChartteacher from "./Page/teacher/CoursePacingChartteacher";
import CoursePacingChartstudent from "./Page/StudentPortal/CoursePacingChartstudent";
import CleverSuccess from "./pages/CleverSuccess";
import AssessmentSetting from "./Page/teacher/Courses/assessment-setting";
import AssessmentReSubmissionPage from "./Page/StudentPortal/Assessment/AssessmentReSubmissionPage";
import DiscussionSettings from "./Page/teacher/Discussion/discussion-settings";
import CreatePage from "./Page/teacher/CreatePage";
import CreateLesson from "./Page/teacher/Courses/CreateLesson";

function App() {
  const {
    checkAuth,
    user,
    Authloading,
    socket,
    setSocket,
    setOnlineUser,
    setUpdatedUser,
  } = useContext(GlobalContext);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) connectsocket();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const fetchUser = () => {
      axiosInstance
        .get("auth/getUserInfo")
        .then((res) => {
          setUpdatedUser(res.data.user);
        })
        .catch(console.log);
    };
    fetchUser();
  }, [user]);

  const location = useLocation();

  useEffect(() => {
    if (!user || (user.role !== "student" && user.role !== "teacher")) return;

    // Wait slightly to let document.title update (e.g. React single page apps update title in next tick)
    const logNavigation = () => {
      axiosInstance
        .post("/logs", {
          url: location.pathname,
          action: "navigate",
          details: `Navigated to ${location.pathname}`,
        })
        .catch((err) => console.error("Error logging navigation:", err));
    };

    const timer = setTimeout(logNavigation, 100);
    return () => clearTimeout(timer);
  }, [location, user]);

  useEffect(() => {
    if (!user || (user.role !== "student" && user.role !== "teacher")) return;

    const handleGlobalClick = (event) => {
      const interactive = event.target.closest("button, a, input[type='button'], input[type='submit'], [role='button']");
      if (!interactive) return;

      const label = (
        interactive.innerText ||
        interactive.getAttribute("aria-label") ||
        interactive.value ||
        interactive.placeholder ||
        interactive.id ||
        "Interactive element"
      ).trim().substring(0, 100);

      axiosInstance
        .post("/logs", {
          url: window.location.pathname,
          action: "click",
          details: `Clicked button/link: "${label}"`,
        })
        .catch((err) => console.error("Error logging click event:", err));
    };

    document.addEventListener("click", handleGlobalClick, true);
    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, [user]);

  const connectsocket = () => {
    const newSocket = io(
      // "https://acewall-backend-school-instance-production.up.railway.app",
      import.meta.env.VITE_SOCKET_URL,
      {
        query: { userId: user?._id || "" },
      },
    );

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (usersIds) => {
      setOnlineUser(usersIds);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  };

  if (Authloading) {
    return <LoadingLoader />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public-only accessible pages */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<FeaturedPage />} /> {/* This makes / public */}
          <Route path="home" element={<LandingPage />} />{" "}
          {/* This makes / public */}
          <Route path="about" element={<About />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacyPolicy" element={<PrivacyPolicyPage />} />
          <Route path="AdditionalServices" element={<AdditionalServices />} />
          <Route path="Contact" element={<FeaturedContantCard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="passwordless-login" element={<Passwordlesslogin />} />
        <Route path="/clever-success" element={<CleverSuccess />} />

        {/* Unauthenticated-only (login/signup) */}
        <Route
          element={
            <PublicRoute
              user={user}
              redirectTo={
                user?.role === "teacher"
                  ? "/teacher"
                  : user?.role === "parent"
                    ? "/parent"
                    : "/student/mycourses"
              }
            />
          }
        >
          <Route path="/login" element={<Login />}></Route>
          <Route path="/TeacherLogin" element={<TeacherLogin />}></Route>
          <Route path="/ParentLogin" element={<ParentLogin />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/verifyOTP/:email" element={<VerifyOTP />} />
          <Route path="/verifyPhoneOTP/:email" element={<VerifyPhoneOTP />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/Courses">
              <Route index element={<GeneralCourses />}></Route>
              <Route
                path="detail/:id"
                element={<GeneralCoursesDetail />}
              ></Route>
              <Route path="culinaryArts" element={<AllCoursesDetail />} />
            </Route>
            <Route path="/forgetPassword">
              <Route index element={<ForgetPassword />} />
              <Route
                path="verifyOTP/:email"
                element={<VerifyForgetPasswordOTP />}
              />
              <Route path="resetPassword/:email" element={<NewPassword />} />
            </Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/Support" element={<GeneralSupport />}></Route>
            <Route path="/contactUs" element={<ContactUs />}></Route>
            <Route path="/*" element={<NotFoundPage />} />
            <Route
              path="/AdditionalServices"
              element={<AdditionalServices />}
            ></Route>
          </Route>
        </Route>

        {/* Student Routes */}
        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRole={["student", "teacherAsStudent"]}
              loading={Authloading}
            />
          }
        >
          <Route path="/student" element={<Layout />}>
            <Route index element={<Deshboard />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="mycourses">
              <Route index element={<Mycourses />} />
              <Route
                path=":courseId/semester/:semesterId"
                element={<StudentSemesterDetail />}
              />
              <Route path="live-list/:id" element={<StudentMeetingList />} />
              <Route path=":courseId/quarter/:quarterId">
                <Route index element={<AllChapter />} />
                <Route path="chapter/:chapterId" element={<ChapterDetail />} />
              </Route>
              <Route path=":id" element={<MainDetailPage />} />
              <Route
                path=":courseId/pacing-chart"
                element={<CoursePacingChartstudent />}
              />
            </Route>

            <Route path="assessment">
              <Route index element={<StudentCourseByCard />} />
              <Route
                path="course/:id" // id = courseId
                element={<Assignment />} // updated Assessment component
              />
              <Route
                path="submission/:id"
                element={<AssessmentSubmissionPage />}
              />
              <Route
                path="Resubmission/:id"
                element={<AssessmentReSubmissionPage />}
              />
            </Route>
            <Route path="gradebook" element={<Gradebook />} />
            <Route path="analytics/:courseId" element={<CourseAnalytics />} />
            <Route path="stdPages" element={<StdPagesView />} />
            <Route
              path="AnnouncementsCoursesStd"
              element={<AllannouncementCoursesStd />}
            />
            <Route
              path="announcements/:courseId"
              element={<StudentCourseAnnouncements />}
            />
            {/* Student Protected Routes */}
            <Route path="attendance">
              <Route path="att" element={<StudentAttendanceView />} />
              {/* You can also have a course-specific attendance view if needed */}
              <Route
                path="monthly/:courseId"
                element={<StudentMonthlyAttendance />}
              />
            </Route>
            <Route path="graphs" element={<GradingScales />} />
            <Route path="ai" element={<AiChatbot />} />

            <Route path="social" element={<SocialMain />} />
            <Route
              path="social/socialprofile/:userId"
              element={<SocialProfilePage />}
            />

            <Route path="account">
              <Route index element={<Account />} />
              <Route path="editGeneralInfo" element={<EditGeneralInfo />} />
              <Route path="editCredentials" element={<EditCredentials />} />
            </Route>
            <Route path="support" element={<Support />} />
            <Route path="ContactUs" element={<ContactUs />} />
            <Route path="courses/:subcategoryId" element={<AllCourses />} />
            <Route path="course/detail/:id" element={<AllCoursesDetail />} />
            <Route path="messages">
              <Route index element={<MessagesForStudents />} />
              <Route path=":id" element={<ChatWindow />} />
            </Route>
            <Route path="discussions">
              <Route
                path="allCourses"
                element={
                  <AllCoursesFilterPage
                    pagefor="Discussions"
                    link="/student/discussions/course/"
                  />
                }
              />
              <Route path="course/:courseId" element={<StudentDiscussion />} />
              <Route path=":id" element={<StudentDiscussionChat />} />
            </Route>
            <Route path="meetings" element={<CoursesWithMeetings />} />
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRole="teacher"
              loading={Authloading}
            />
          }
        >
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="account">
              <Route index element={<Account />} />
              <Route path="editGeneralInfo" element={<EditGeneralInfo />} />
              <Route path="editCredentials" element={<EditCredentials />} />
              <Route path="editParentEmail" element={<EditParentEmail />} />
            </Route>
            <Route path="assessments">
              <Route index element={<TeacherAssessmentByCourse />} />
              <Route path="bycourse/:id" element={<CourseAssessmentList />} />

              <Route path="allsubmissions/:id" element={<AllSubmission />} />
              <Route path="analytics/:id" element={<AssessmentAnalytics />} />
              <Route path=":id" element={<AssessmentReview />} />
              <Route
                path="create/:type/:id/:courseId/:startDate/:endDate"
                element={<CreateAssessmentPage />}
              />
              <Route
                path="create/:type/:id/:courseId/:startDate/:endDate/*"
                element={<CreateAssessmentPage />}
              />
            </Route>
            <Route
              path="/teacher/courses/:courseId/posts/:type/:typeId"
              element={<ViewCoursePostsPage />}
            />
            <Route path="ContactUs" element={<ContactUs />} />
            <Route path="support" element={<Support />} />
            <Route
              path="announcements/:courseId"
              element={<TeacherAnnoucement />}
            />
            <Route
              path="AnnouncementsCourses"
              element={<AllannouncementCourses />}
            />{" "}
            <Route path="graphs" element={<GradingScales />} />
            <Route path="social" element={<SocialMain />} />
            <Route
              path="social/socialprofile/:userId"
              element={<SocialProfilePage />}
            />
            <Route path="allStudent" element={<AllStudent />} />
            <Route path="studentProfile/:id">
              <Route index element={<StudentProfile />}></Route>
              <Route
                path="loginActivity"
                element={<LoginChartActivity />}
              ></Route>
            </Route>
            <Route path="coursesstd" element={<AllStdCourses />} />
            <Route path="course/:courseId" element={<CourseStudents />} />
            <Route
              path="courseGrades/:studentId/:courseId"
              element={<StudentCourseGrades />}
            />
            <Route
              path="analytics/:courseId/:studentId"
              element={<TeacherStudentAnalytics />}
            />
            <Route path="attendance">
              <Route path="AStdCAtt" element={<AStdCAtt />} />
              <Route path="course/:courseId" element={<CstdAttendance />} />
            </Route>
            <Route path="conversation">
              <Route
                path="courses"
                element={<TeacherCoursesForConversation />}
              />
              <Route path="students/:courseId" element={<StudentsList />} />
            </Route>
            <Route path="messages">
              <Route index element={<Messages />} />
              <Route path=":id" element={<ChatWindow />} />
            </Route>
            <Route
              path="gradebook/:courseId"
              element={<CourseGradebookPage />}
            />
            <Route
              path="studentAssisstance/:courseId"
              element={<StudentWhoNeedAssistance />}
            />
            <Route path="discussions">
              <Route
                path="allCourses"
                element={<TeacherCoursesForDiscussion />}
              />
              <Route path="course/:courseId" element={<TeacherDiscussion />} />
              <Route path=":id">
                <Route index element={<TeacherDiscussionChat />} />
                <Route path="settings" element={<DiscussionSettings />} />
              </Route>
            </Route>
            <Route path="courses">
              <Route index element={<TeacherCourses />} />
              <Route path="import" element={<CourseImportPage />} />
              <Route
                path="schedule-class/:id"
                element={<ScheduleClassPage />}
              />
              <Route
                path="courseDetail/:id"
                element={<TeacherCourseDetails />}
              />
              <Route
                path=":courseId/pacing-chart"
                element={<CoursePacingChartteacher />}
              />
              <Route path="edit/:courseId" element={<EditCourse />} />
              <Route path="course-stats/:id" element={<EnrollmentStats />} />
              <Route
                path=":courseId/semester/:id"
                element={<SemesterDetail />}
              />
              <Route path=":courseId/quarter/:id" element={<QuarterDetail />} />
              <Route
                path="quarter/:quarterId/chapter/:chapterId"
                element={<TeacherChapterDetail />}
              />
              <Route
                path=":courseId/semesterstdPre/:semesterId"
                element={<StudentSemesterDetailStdPre />}
              />
              <Route path=":courseId/quarterstdpre/:quarterId">
                <Route index element={<AllChapterStdPre />} />
                <Route
                  path="chapterstdpre/:chapterId"
                  element={<ChapterDetailStdPre />}
                />
              </Route>
              <Route path="assessment/:assessmentid">
                <Route index element={<AssessmentPage />} />
                <Route path="setting" element={<AssessmentSetting />} />
              </Route>
              <Route path="stdPreview/:id" element={<StdPreview />} />
              <Route path="stdPreview2/:id" element={<StdPreview2 />} />

              <Route path="createCourses">
                <Route index element={<CoursesBasis />} />
                <Route path="addChapter/:id" element={<CoursesChapter />} />
                {/* <Route path="gradebook" element={<TeacherGradebook />} /> */}
              </Route>
            </Route>
            <Route path="create-page" element={<CreatePage />} />
            <Route
              path="lessons/create/chapter/:chapterId"
              element={<CreateLesson />}
            />
          </Route>
        </Route>

        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRole="parent"
              loading={Authloading}
            />
          }
        >
          <Route path="/parent">
            <Route index element={<MyChildren />} />
            <Route path=":studentId" element={<ParentLayout />}>
              <Route index element={<ParentDashboard />} />
              <Route path="child-gradebook" element={<ChildGradebook />} />
              <Route
                path="analytics/:courseId"
                element={<ParentChildAnalytics />}
              />
              <Route path="courses" element={<ChildCourseCards />} />
              <Route
                path="/parent/:studentId/course-detail/:enrollmentId"
                element={<ParentCourseOverview />}
              />
              <Route path="announcements">
                <Route index element={<AllannouncementCoursesPerent />} />
                <Route
                  path="/parent/:studentId/announcements/:courseId"
                  element={<ParentCourseAnnouncements />}
                />
              </Route>
              <Route
                path="/parent/:studentId/assessments"
                element={<ParentCourseByCard />}
              />
              <Route
                path="/parent/:studentId/assessments/:id"
                element={<ParentAssessment />}
              />
              <Route
                path="/parent/:studentId/assessment-result/:assessmentId"
                element={<ParentAssessmentResultPage />}
              />
              <Route path="support" element={<Support />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
