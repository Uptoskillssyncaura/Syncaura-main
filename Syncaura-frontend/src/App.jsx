import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import MainLayout from "./layouts/MainLayout";

import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import CurrentMeet from "./pages/CurrentMeet";
import Meetings from "./pages/Meetings";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Meeting/Header/Header";
import MobileSidebar from "./components/MobileSidebar";
import Complaints from "./pages/Complaints";
import AttendanceLeave from "./pages/AttendanceLeave";
import Notice from "./pages/Notice";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import SupportChatbot from "./components/SupportChatbot";

import { ToastContainer, Bounce } from "react-toastify";
import { refreshAccessToken } from "./redux/features/authThunks";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import ProtectRoute from "./RouteProtection/ProtectRoute";
import CoAdmin from "./pages/CoAdmin";

export default function App() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const user = useSelector((state) => state.auth.user);
  const authChecking = useSelector((state) => state.auth.authChecking);

  useEffect(() => {
    dispatch(refreshAccessToken());
  }, [dispatch]);
  console.log({ user, authChecking });

  if (authChecking) {
    return (
      <>
        <div
          data-theme={isDark ? "dark" : "light"}
          className="w-full h-screen bg-white dark:bg-black flex items-center justify-center "
        >
          <Loader className="size-5 lg:size-13 page-2xl:size-15 text-blue-600 dark:text-[#73FBFD] animate-spin duration-200" />
        </div>
      </>
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
        <SupportChatbot />
        <Routes>
          <Route element={<ProtectRoute publicOnly />}>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
          <Route
            element={<ProtectRoute allowedRoles={["user", "admin", "co-admin"]} />}
          >
            <Route path="/meet/:id" element={<CurrentMeet />} />
          </Route>
          <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin"
              element={
                <MainLayout
                  SideBar={MobileSidebar}
                  TopbarComponent={Header}
                >
                  <Admin />
                </MainLayout>
              }
            />
          </Route>

          <Route element={<ProtectRoute allowedRoles={["co-admin"]} />}>
            <Route
              path="/co-admin"
              element={
                <MainLayout
                  SideBar={MobileSidebar}
                  TopbarComponent={Header}
                >
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
                <MainLayout TopbarComponent={Header}>
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
      </BrowserRouter>
    </>
  );
}
