import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./layouts/MainLayout";
import { lazy, Suspense, useEffect } from "react";
import LearnMore from "./pages/LearnMore";
const Projects = lazy(() => import("./pages/Projects"));
const Tasks = lazy(() => import("./pages/Tasks"));
import AboutUs from "./pages/AboutUs";
const CurrentMeet = lazy(() => import("./pages/CurrentMeet"));
const Meetings = lazy(() => import("./pages/Meetings"));
const Chat = lazy(() => import("./pages/Chat"));
const Documents = lazy(() => import("./pages/Documents"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Complaints = lazy(() => import("./pages/Complaints"));
const AttendanceLeave = lazy(() => import("./pages/AttendanceLeave"));
const MyAttendance = lazy(() => import("./pages/MyAttendance"));
const Notice = lazy(() => import("./pages/Notice"));
const Settings = lazy(() => import("./pages/Settings"));
const Admin = lazy(() => import("./pages/Admin"));
const CoAdmin = lazy(() => import("./pages/CoAdmin"));
const Home = lazy(() => import("./pages/Home"));
const RoleSelection = lazy(() => import("./pages/RoleSelection"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const GithubCallback = lazy(() => import("./pages/GithubCallback"));
const Profile = lazy(() => import("./pages/Profile"));

import NotFound from "./pages/NotFound";
import Header from "./components/Meeting/Header/Header";
import MobileSidebar from "./components/navigation/MobileSidebar";

import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  refreshAccessToken,
  fetchUserProfile,
} from "./redux/features/authThunks";
import { Loader } from "lucide-react";
import ProtectRoute from "./RouteProtection/ProtectRoute";

export default function App() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const authChecking = useSelector((state) => state.auth.authChecking);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (token) {
        try {
          await dispatch(fetchUserProfile()).unwrap();
        } catch (profileErr) {
          try {
            const refreshRes = await dispatch(refreshAccessToken()).unwrap();
            if (refreshRes?.accessToken) {
              await dispatch(fetchUserProfile()).unwrap();
            }
          } catch (refreshErr) {
            console.warn("Session restore failed:", refreshErr);
          }
        }
      }
    };

    initAuth();

    fetch("/health")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Backend Connected:", data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const { fontSize = "medium", zoom = 100 } = useSelector(
    (state) => state.ui || {}
  );

  useEffect(() => {
    const fontSizeMap = { small: 0.85, medium: 1, large: 1.15, xlarge: 1.3 };
    const fontSizeMultiplier = fontSizeMap[fontSize] || 1;
    const baseFontSize = 16;
    const finalSize = baseFontSize * fontSizeMultiplier * (zoom / 100);
    document.documentElement.style.fontSize = `${finalSize}px`;
  }, [fontSize, zoom]);

  if (authChecking) {
    return (
      <div
        data-theme={isDark ? "dark" : "light"}
        className="w-full h-screen bg-white dark:bg-black flex items-center justify-center"
      >
        <Loader className="size-5 lg:size-13 page-2xl:size-15 text-blue-600 dark:text-[#73FBFD] animate-spin duration-200" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        transition={Bounce}
      />

      <BrowserRouter>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="w-full h-screen bg-white dark:bg-black flex items-center justify-center">
              <Loader className="size-8 text-blue-600 dark:text-[#73FBFD] animate-spin duration-200" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route element={<ProtectRoute publicOnly />}>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/github/callback" element={<GithubCallback />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/about-us" element={<AboutUs />} />
            </Route>

            {/* Authenticated Shared Routes */}
            <Route element={<ProtectRoute allowedRoles={["user", "admin", "co-admin"]} />}>
              <Route path="/user-dashboard" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><UserDashboard /></MainLayout>} />
              <Route path="/projects" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Projects /></MainLayout>} />
              <Route path="/attendance-leave" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><AttendanceLeave /></MainLayout>} />
              <Route path="/my-attendance" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><MyAttendance /></MainLayout>} />
              <Route path="/tasks" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Tasks /></MainLayout>} />
              <Route path="/meetings" element={<MainLayout SideBar={MobileSidebar} TopbarComponent={Header}><Meetings /></MainLayout>} />
              <Route path="/profile" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Profile /></MainLayout>} />
              <Route path="/chat" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Chat /></MainLayout>} />
              <Route path="/notice" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Notice /></MainLayout>} />
              <Route path="/documents" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Documents /></MainLayout>} />
              <Route path="/complaints" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Complaints /></MainLayout>} />
              <Route path="/settings" element={<MainLayout TopbarComponent={Header} SideBar={MobileSidebar}><Settings /></MainLayout>} />
              <Route path="/meet/:id" element={<CurrentMeet />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<MainLayout SideBar={MobileSidebar} TopbarComponent={Header}><Admin /></MainLayout>} />
            </Route>

            {/* Co-Admin Only Routes */}
            <Route element={<ProtectRoute allowedRoles={["co-admin"]} />}>
              <Route path="/co-admin" element={<MainLayout SideBar={MobileSidebar} TopbarComponent={Header}><CoAdmin /></MainLayout>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}