import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import MainLayout from "./layouts/MainLayout";
import { lazy, Suspense, useEffect } from "react";

const Projects = lazy(() => import("./pages/Projects"));
const Tasks = lazy(() => import("./pages/Tasks"));
const CurrentMeet = lazy(() => import("./pages/CurrentMeet"));
const Meetings = lazy(() => import("./pages/Meetings"));
const Chat = lazy(() => import("./pages/Chat"));
const Documents = lazy(() => import("./pages/Documents"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Complaints = lazy(() => import("./pages/Complaints"));
const AttendanceLeave = lazy(() => import("./pages/AttendanceLeave"));
const Notice = lazy(() => import("./pages/Notice"));
const Settings = lazy(() => import("./pages/Settings"));
const Admin = lazy(() => import("./pages/Admin"));
const CoAdmin = lazy(() => import("./pages/CoAdmin"));
const Home = lazy(() => import("./pages/Home"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const GithubCallback = lazy(() => import("./pages/GithubCallback"));

import Header from "./components/Meeting/Header/Header";
import MobileSidebar from "./components/MobileSidebar";

import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { refreshAccessToken } from "./redux/features/authThunks";
import { logout } from "./redux/slices/authSlice";
import { Loader } from "lucide-react";
import ProtectRoute from "./RouteProtection/ProtectRoute";

export default function App() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const user = useSelector((state) => state.auth.user);
  const authChecking = useSelector((state) => state.auth.authChecking);

  useEffect(() => {
    dispatch(refreshAccessToken());

    // Backend connection test
    fetch("/api/test")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Expected JSON response but received something else.",
          );
        }

        return res.json();
      })
      .then((data) => {
        console.log("✅ Backend Connected:", data);
      })
      .catch((err) => {
        console.error("❌ Backend Connection Error:", err.message);
      });
  }, [dispatch]);

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
        <Suspense
          fallback={
            <div className="w-full h-screen bg-white dark:bg-black flex items-center justify-center">
              <Loader className="size-8 text-blue-600 dark:text-[#73FBFD] animate-spin duration-200" />
            </div>
          }
        >
          <Routes>
            <Route element={<ProtectRoute publicOnly />}>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/auth/github/callback"
                element={<GithubCallback />}
              />
            </Route>

            <Route
              element={
                <ProtectRoute allowedRoles={["user", "admin", "co-admin"]} />
              }
            >
              <Route path="/meet/:id" element={<CurrentMeet />} />
            </Route>

            <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
              <Route
                path="/admin"
                element={
                  <MainLayout SideBar={MobileSidebar} TopbarComponent={Header}>
                    <Admin />
                  </MainLayout>
                }
              />
            </Route>

            <Route element={<ProtectRoute allowedRoles={["co-admin"]} />}>
              <Route
                path="/co-admin"
                element={
                  <MainLayout SideBar={MobileSidebar} TopbarComponent={Header}>
                    <CoAdmin />
                  </MainLayout>
                }
              />
            </Route>

            <Route element={<ProtectRoute allowedRoles={["user"]} />}>
              <Route
                path="/user-dashboard"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <UserDashboard />
                  </MainLayout>
                }
              />

              <Route
                path="/projects"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <Projects />
                  </MainLayout>
                }
              />

              <Route
                path="/attendance-leave"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <AttendanceLeave />
                  </MainLayout>
                }
              />

              <Route
                path="/tasks"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <Tasks />
                  </MainLayout>
                }
              />

              <Route
                path="/meetings"
                element={
                  <MainLayout SideBar={MobileSidebar} TopbarComponent={Header}>
                    <Meetings />
                  </MainLayout>
                }
              />

              <Route
                path="/chat"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <Chat />
                  </MainLayout>
                }
              />

              <Route
                path="/notice"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <Notice />
                  </MainLayout>
                }
              />

              <Route
                path="/documents"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <Documents />
                  </MainLayout>
                }
              />

              <Route
                path="/complaints"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <Complaints />
                  </MainLayout>
                }
              />

              <Route
                path="/settings"
                element={
                  <MainLayout TopbarComponent={Header} SideBar={MobileSidebar}>
                    <Settings />
                  </MainLayout>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
