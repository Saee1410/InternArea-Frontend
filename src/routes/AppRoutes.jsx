import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CreateInternship from "../pages/CreateInternship";
import CreateJob from "../pages/CreateJob";
import Details from "../pages/Details";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import AdminProfile from "../pages/AdminProfile";
import AdminEdit from "../pages/AdminEdit";
import ApplicationsList from "../pages/ApplicationsList";
import ResumeBuilder from "../pages/ResumeBuilder";
import ResumePreview from "../pages/ResumePreview";
import ForgotPassword from "../pages/ForgotPassword";
import PublicSpace from "../pages/PublicSpace";
import Users from "../pages/Users";
import OtherUserProfile from "../pages/OtherUserProfile";
import FriendRequests from "../pages/FriendRequests";
import Internships from "../pages/Internships";
import Jobs from "../pages/Jobs";
import Subscription from "../pages/Subscription";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/internship" element={<CreateInternship/>} />
      <Route path="/job" element={<CreateJob/>} />
      <Route path="/details/:type/:id" element={<Details/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/editprofile" element={<EditProfile/>} />
      <Route path="/admin" element={<AdminProfile />} />
      <Route path="/admin/edit" element={<AdminEdit />} />
      <Route path="/admin-applications" element={<ApplicationsList />} />
      <Route path="/resume" element={<ResumeBuilder />} />
      <Route path="/resumepreview" element={<ResumePreview />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/public" element={<PublicSpace />} />
      <Route path="/user" element={<Users />} />
      <Route path="/profile/:userId" element={<OtherUserProfile />} />
      <Route path="/friend-requests" element={<FriendRequests />} />
      <Route path="/internships" element={<Internships />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/subscriptions" element={<Subscription />} />
    </Routes>
  );
}

export default AppRoutes;