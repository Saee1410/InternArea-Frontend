import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Grid,
} from "@mui/material";  

import Navbar from "../components/layout/Navbar";
import profile from "../assets/profile.jpg";

import { getMyResume } from "../services/resumeService";

function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState({});

  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);

  // Friend Request States
  const [friendStatus, setFriendStatus] = useState("none");
  const [friendLoading, setFriendLoading] = useState(false);
  const [friendMessage, setFriendMessage] = useState("");

  // Login History States
  const [loginHistory, setLoginHistory] = useState([]);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchLoginHistory();
    fetchMyResume();
  }, [i18n.language]);

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  // ==========================================
  // FETCH LOGIN HISTORY
  // ==========================================

  const fetchLoginHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/auth/login-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Login History Response:", res.data);

      if (Array.isArray(res.data?.loginHistory)) {
        setLoginHistory(res.data.loginHistory);
      } else {
        setLoginHistory([]);
      }
    } catch (error) {
      console.log(
        "Login History Error:",
        error.response?.data || error.message
      );

      setLoginHistory([]);
    } finally {
      setLoginHistoryLoading(false);
    }
  };

  // ==========================================
  // FETCH MY RESUME
  // ==========================================

  const fetchMyResume = async () => {
    try {
      const currentLang = i18n.language || "en";
      const data = await getMyResume(currentLang);

      console.log("My Resume:", data);

      setResume(data.resume);
    } catch (error) {
      if (error.response?.status === 404) {
        setResume(null);
      } else {
        console.error(
          "Resume fetch error:",
          error.response?.data || error.message
        );
      }
    } finally {
      setResumeLoading(false);
    }
  };

  // ==========================================
  // SEND FRIEND REQUEST
  // ==========================================

  const sendFriendRequest = async () => {
    try {
      setFriendLoading(true);
      setFriendMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/friends/request`,
        {
          receiverId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFriendStatus("pending");
      setFriendMessage(response.data.message);
    } catch (error) {
      console.error("Friend Request Error:", error);

      setFriendMessage(
        error.response?.data?.message ||
          "Something went wrong while sending friend request"
      );
    } finally {
      setFriendLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          p: 5,
          backgroundImage: `linear-gradient(
            rgba(56, 59, 68, 0.75),
            rgba(62, 68, 82, 0.75)
          ), url(${profile})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            maxWidth: 900,
            mx: "auto",
            p: 5,
            borderRadius: 5,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 20px 50px rgba(0,0,0,.25)",
          }}
        >
          {/* PROFILE HEADER */}

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={user.profilePhoto}
              sx={{
                width: 150,
                height: 150,
                border: "5px solid white",
                boxShadow: "0 10px 30px rgba(0,0,0,.25)",
                mb: 2,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "#0f172a",
              }}
            >
              {user.name}
            </Typography>

            <Typography
              sx={{
                color: "#64748b",
                fontSize: 17,
                mt: 1,
              }}
            >
              {user.email}
            </Typography>

            {/* FRIEND BUTTON */}

            <Button
              variant="contained"
              onClick={() => navigate("/user")}
              sx={{
                mt: 3,
              }}
            >
              {t("profile.addFriend")}
            </Button>

            {/* ADD POST BUTTON */}

            <Button
              variant="contained"
              onClick={() => navigate("/public")}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
                mt: 3,
                ml: 4,
                flexWrap: "wrap",
              }}
            >
              {t("profile.addPost")}
            </Button>

            {friendMessage && (
              <Typography
                sx={{
                  mt: 1,
                  color: "primary.main",
                  textAlign: "center",
                }}
              >
                {friendMessage}
              </Typography>
            )}
          </Box>

          {/* PROFILE DETAILS */}

          <Grid
            container
            spacing={3}
            sx={{
              mt: 4,
            }}
          >
            {/* Phone */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,.15)",
                  },
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary"
                  mb={1}
                >
                  {t("profile.phone")}
                </Typography>

                <Typography>
                  {user.phone || t("profile.notAdded")}
                </Typography>
              </Paper>
            </Grid>

            {/* Location */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,.15)",
                  },
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary"
                  mb={1}
                >
                  {t("profile.location")}
                </Typography>

                <Typography>
                  {user.location || t("profile.notAdded")}
                </Typography>
              </Paper>
            </Grid>

            {/* Qualification */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,.15)",
                  },
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary"
                  mb={1}
                >
                  {t("profile.qualification")}
                </Typography>

                <Typography>
                  {user.qualification ||
                    t("profile.notAdded")}
                </Typography>
              </Paper>
            </Grid>

            {/* Skills */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,.15)",
                  },
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary"
                  mb={1}
                >
                  {t("profile.skills")}
                </Typography>

                <Typography>
                  {user.skills || t("profile.notAdded")}
                </Typography>
              </Paper>
            </Grid>

            {/* Bio */}

            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,.15)",
                  },
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="primary"
                  mb={1}
                >
                  {t("profile.bio")}
                </Typography>

                <Typography>
                  {user.bio || t("profile.noBio")}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ========================================== */}
          {/* LOGIN HISTORY */}
          {/* ========================================== */}

          <Paper
            elevation={4}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              🔐 {t("profile.loginHistory")}
            </Typography>

            {loginHistoryLoading ? (
              <Typography color="text.secondary">
                {t("profile.loadingLoginHistory")}
              </Typography>
            ) : !Array.isArray(loginHistory) ||
              loginHistory.length === 0 ? (
              <Typography color="text.secondary">
                {t("profile.noLoginHistory")}
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {loginHistory.map((login, index) => (
                  <Paper
                    key={login._id || index}
                    elevation={2}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Grid container spacing={2}>

                      {/* Browser */}

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          fontWeight="bold"
                          color="primary"
                        >
                          {t("profile.browser")}
                        </Typography>

                        <Typography>
                          {login.browser ||
                            t("profile.unknown")}
                        </Typography>
                      </Grid>

                      {/* Operating System */}

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          fontWeight="bold"
                          color="primary"
                        >
                          {t("profile.operatingSystem")}
                        </Typography>

                        <Typography>
                          {login.operatingSystem ||
                            t("profile.unknown")}
                        </Typography>
                      </Grid>

                      {/* Device */}

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          fontWeight="bold"
                          color="primary"
                        >
                          {t("profile.device")}
                        </Typography>

                        <Typography
                          sx={{
                            color: login.loginStatus === "success" ? "green" : "red",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {login.deviceType ||
                            t("profile.unknown")}
                        </Typography>
                      </Grid>

                      {/* IP Address */}

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          fontWeight="bold"
                          color="primary"
                        >
                          {t("profile.ipAddress")}
                        </Typography>

                        <Typography>
                          {login.ipAddress ||
                            t("profile.unknown")}
                        </Typography>
                      </Grid>

                      {/* Login Status */}

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          fontWeight="bold"
                          color="primary"
                        >
                          {t("profile.status")}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              login.loginStatus ===
                              "success"
                                ? "green"
                                : "red",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {login.loginStatus ||
                            t("profile.unknown")}
                        </Typography>
                      </Grid>

                      {/* Login Time */}

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          fontWeight="bold"
                          color="primary"
                        >
                          {t("profile.loginTime")}
                        </Typography>

                        <Typography>
                          {login.loginTime
                            ? new Date(
                                login.loginTime
                              ).toLocaleString("en-IN")
                            : t("profile.unknown")}
                        </Typography>
                      </Grid>

                    </Grid>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>

          {/* ========================================== */}
          {/* MY RESUME */}
          {/* ========================================== */}

          <Paper
            elevation={4}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              {t("profile.myResume")}
            </Typography>

            {resumeLoading ? (
              <Typography color="text.secondary">
                {t("profile.loadingResume")}
              </Typography>
            ) : resume ? (
              <Box>
                <Typography
                  fontWeight={700}
                  variant="h6"
                >
                  {resume.fullName}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {resume.qualification}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {t("profile.resumeSaved")}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate("/resumepreview")
                    }
                  >
                    {t("profile.viewResume")}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate("/resume")
                    }
                  >
                    {t("profile.editResume")}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("profile.noResume")}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() =>
                    navigate("/resume")
                  }
                >
                  {t("profile.createResume")}
                </Button>
              </Box>
            )}
          </Paper>

          {/* ========================================== */}
          {/* EDIT PROFILE */}
          {/* ========================================== */}

          <Box
            display="flex"
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={() =>
                navigate("/editprofile")
              }
              sx={{
                mt: 5,
                px: 5,
                py: 1.5,
                borderRadius: "30px",
                fontSize: 17,
                fontWeight: "bold",
                textTransform: "none",
                background:
                  "linear-gradient(90deg,#2563eb,#3b82f6)",
                boxShadow:
                  "0 10px 25px rgba(37,99,235,.35)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg,#1d4ed8,#2563eb)",
                  transform: "scale(1.03)",
                },
              }}
            >
              {t("profile.editProfile")}
            </Button>
          </Box>

        </Paper>
      </Box>
    </>
  );
}

export default Profile;

