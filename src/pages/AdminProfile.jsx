import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  Container,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DevicesIcon from "@mui/icons-material/Devices";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import Navbar from "../components/layout/Navbar";

function AdminProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_API_URL;

  const [admin, setAdmin] = useState({});
  const [loginHistory, setLoginHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH ADMIN PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmin(res.data || {});
    } catch (err) {
      console.error("Profile Fetch Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load admin profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH LOGIN HISTORY
  // =====================================================

  const fetchLoginHistory = async () => {
    try {
      const token = getToken();

      if (!token) {
        setHistoryLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/auth/login-history/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ALL LOGIN HISTORY:", res.data);

      setLoginHistory(res.data?.loginHistory || []);
    } catch (err) {
      console.error(
        "Login History Fetch Error:",
        err.response?.data || err.message
      );

      // Don't break entire profile if history API fails.
      setLoginHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProfile();
    fetchLoginHistory();
  }, []);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString();
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f8fafc",
            px: 2,
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Loading profile...
            </Typography>
          </Stack>
        </Box>
      </>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background:
            "linear-gradient(135deg, #eef2f3 0%, #dbeafe 100%)",

          py: {
            xs: 3,
            sm: 4,
            md: 6,
          },

          px: {
            xs: 1,
            sm: 2,
          },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            px: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          {/* ERROR */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* MAIN CARD */}

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              p: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              borderRadius: {
                xs: 3,
                sm: 4,
              },

              background:
                "rgba(255, 255, 255, 0.95)",

              backdropFilter: "blur(12px)",

              boxShadow:
                "0px 20px 40px rgba(0, 0, 0, 0.08)",

              border:
                "1px solid rgba(255, 255, 255, 0.7)",

              overflow: "hidden",
            }}
          >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box
              sx={{
                textAlign: "center",
              }}
            >
              {/* AVATAR */}

              <Avatar
                src={admin.profilePhoto || ""}
                alt={admin.name || "Admin"}
                sx={{
                  width: {
                    xs: 90,
                    sm: 110,
                    md: 130,
                  },

                  height: {
                    xs: 90,
                    sm: 110,
                    md: 130,
                  },

                  mx: "auto",
                  mb: 2,

                  border: "4px solid #fff",

                  boxShadow:
                    "0px 8px 24px rgba(25, 118, 210, 0.25)",

                  fontSize: {
                    xs: "2rem",
                    sm: "2.3rem",
                    md: "2.5rem",
                  },

                  bgcolor: "#1976d2",
                }}
              >
                {admin.name
                  ? admin.name
                      .charAt(0)
                      .toUpperCase()
                  : "A"}
              </Avatar>

              {/* NAME */}

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#1a202c",

                  fontSize: {
                    xs: "1.6rem",
                    sm: "2rem",
                    md: "2.2rem",
                  },

                  wordBreak: "break-word",
                }}
              >
                {admin.name ||
                  t("adminProfile.adminName") ||
                  "Admin"}
              </Typography>

              {/* EMAIL */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.7,
                  mt: 1,

                  px: 1,

                  color: "text.secondary",
                }}
              >
                <EmailIcon
                  fontSize="small"
                />

                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    textAlign: "center",
                  }}
                >
                  {admin.email || "No email"}
                </Typography>
              </Box>

              {/* ROLE */}

              <Chip
                icon={
                  <AdminPanelSettingsIcon
                    sx={{
                      color: "#fff !important",
                    }}
                  />
                }
                label={
                  admin.role
                    ? admin.role.toUpperCase()
                    : t("adminProfile.admin") ||
                      "ADMIN"
                }
                sx={{
                  mt: 2,

                  px: 1.5,

                  fontWeight: "bold",

                  color: "#fff",

                  background:
                    "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",

                  boxShadow:
                    "0 3px 10px rgba(25, 118, 210, 0.3)",
                }}
              />
            </Box>

            <Divider
              sx={{
                my: {
                  xs: 2.5,
                  sm: 3.5,
                },
              }}
            />

            {/* =====================================================
                PROFILE INFORMATION
            ===================================================== */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },

                gap: 2,
              }}
            >
              {/* PHONE */}

              <Paper
                elevation={0}
                sx={{
                  p: 2,

                  borderRadius: 3,

                  bgcolor: "#f8fafc",

                  border:
                    "1px solid #e2e8f0",

                  display: "flex",

                  alignItems: "center",

                  gap: 1.5,

                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    p: 1,

                    borderRadius: 2,

                    bgcolor:
                      "rgba(25, 118, 210, 0.08)",

                    color: "#1976d2",

                    display: "flex",

                    flexShrink: 0,
                  }}
                >
                  <PhoneIcon />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t("adminProfile.phone") ||
                      "Phone"}
                  </Typography>

                  <Typography
                    fontWeight={600}
                    color="#2d3748"
                    sx={{
                      wordBreak: "break-word",
                    }}
                  >
                    {admin.phone ||
                      t("adminProfile.notAdded") ||
                      "Not added"}
                  </Typography>
                </Box>
              </Paper>

              {/* LOCATION */}

              <Paper
                elevation={0}
                sx={{
                  p: 2,

                  borderRadius: 3,

                  bgcolor: "#f8fafc",

                  border:
                    "1px solid #e2e8f0",

                  display: "flex",

                  alignItems: "center",

                  gap: 1.5,

                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    p: 1,

                    borderRadius: 2,

                    bgcolor:
                      "rgba(25, 118, 210, 0.08)",

                    color: "#1976d2",

                    display: "flex",

                    flexShrink: 0,
                  }}
                >
                  <LocationOnIcon />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t(
                      "adminProfile.location"
                    ) || "Location"}
                  </Typography>

                  <Typography
                    fontWeight={600}
                    color="#2d3748"
                    sx={{
                      wordBreak: "break-word",
                    }}
                  >
                    {admin.location ||
                      t(
                        "adminProfile.notAdded"
                      ) ||
                      "Not added"}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* =====================================================
                LOGIN HISTORY
            ===================================================== */}

            <Typography
              variant="h6"
              sx={{
                mt: {
                  xs: 3,
                  sm: 4,
                },

                mb: 2,

                fontWeight: 700,

                color: "#1a202c",

                fontSize: {
                  xs: "1.05rem",
                  sm: "1.25rem",
                },
              }}
            >
              Recent Login History
            </Typography>

            {historyLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 3,
                }}
              >
                <CircularProgress
                  size={28}
                />
              </Box>
            ) : loginHistory.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",

                  gap: 1.5,

                  maxHeight: {
                    xs: 300,
                    sm: 320,
                  },

                  overflowY: "auto",

                  pr: 0.5,

                  "&::-webkit-scrollbar": {
                    width: "5px",
                  },

                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#cbd5e1",
                    borderRadius: "10px",
                  },
                }}
              >
                {loginHistory.map(
                  (item, index) => {
                    const loginDate =
                      item.loginTime ||
                      item.createdAt;

                    return (
                      <Paper
                        key={
                          item._id ||
                          `${index}-${loginDate}`
                        }
                        elevation={0}
                        sx={{
                          p: {
                            xs: 1.5,
                            sm: 2,
                          },

                          borderRadius: 2.5,

                          bgcolor: "#f8fafc",

                          border:
                            "1px solid #e2e8f0",

                          display: "flex",

                          flexDirection: {
                            xs: "column",
                            sm: "row",
                          },

                          justifyContent:
                            "space-between",

                          alignItems: {
                            xs: "flex-start",
                            sm: "center",
                          },

                          gap: 1.5,
                        }}
                      >
                        {/* DEVICE */}

                        <Box
                          sx={{
                            display: "flex",
                            alignItems:
                              "center",

                            gap: 1.5,

                            minWidth: 0,

                            width: {
                              xs: "100%",
                              sm: "auto",
                            },
                          }}
                        >
                          <DevicesIcon
                            color="primary"
                            fontSize="small"
                            sx={{
                              flexShrink: 0,
                            }}
                          />

                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="#2d3748"
                              sx={{
                                wordBreak:
                                  "break-word",
                              }}
                            >
                              {item.browser ||
                                "Unknown Browser"}{" "}
                              (
                              {item.operatingSystem ||
                                "OS"}
                              )
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                wordBreak:
                                  "break-word",
                              }}
                            >
                              IP:{" "}
                              {item.ipAddress ||
                                "N/A"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* TIME */}

                        <Box
                          sx={{
                            display: "flex",

                            alignItems:
                              "center",

                            gap: 0.5,

                            width: {
                              xs: "100%",
                              sm: "auto",
                            },

                            justifyContent: {
                              xs: "flex-start",
                              sm: "flex-end",
                            },
                          }}
                        >
                          <AccessTimeIcon
                            fontSize="small"
                            color="action"
                          />

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDate(
                              loginDate
                            )}

                            <br />

                            {formatTime(
                              loginDate
                            )}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  }
                )}
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,

                  borderRadius: 2.5,

                  bgcolor: "#f8fafc",

                  border:
                    "1px solid #e2e8f0",

                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No login history
                  records found.
                </Typography>
              </Paper>
            )}

            {/* =====================================================
                DASHBOARD BUTTON
            ===================================================== */}

            <Button
              fullWidth
              size="large"
              variant="outlined"
              startIcon={<DashboardIcon />}
              sx={{
                mt: 4,

                py: 1.5,

                borderRadius: 2.5,

                fontWeight: "bold",

                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },

                textTransform: "none",

                borderColor: "#1976d2",

                color: "#1976d2",

                "&:hover": {
                  borderColor: "#1565c0",

                  background:
                    "rgba(25, 118, 210, 0.08)",
                },
              }}
              onClick={() =>
                navigate(
                  "/admin/dashboard"
                )
              }
            >
              Dashboard
            </Button>

            {/* =====================================================
                EDIT PROFILE
            ===================================================== */}

            <Button
              fullWidth
              size="large"
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                mt: 2,

                py: 1.5,

                borderRadius: 2.5,

                fontWeight: "bold",

                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },

                textTransform: "none",

                background:
                  "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",

                boxShadow:
                  "0 8px 20px rgba(25, 118, 210, 0.3)",

                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)",

                  boxShadow:
                    "0 12px 25px rgba(25, 118, 210, 0.4)",
                },
              }}
              onClick={() =>
                navigate("/admin/edit")
              }
            >
              {t(
                "adminProfile.editProfile"
              ) || "Edit Profile"}
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default AdminProfile;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Paper,
//   Typography,
//   Avatar,
//   Grid,
//   Button,
//   Chip,
//   Divider,
//   Container,
// } from "@mui/material";

// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import EditIcon from "@mui/icons-material/Edit";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import EmailIcon from "@mui/icons-material/Email";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import DevicesIcon from "@mui/icons-material/Devices";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";

// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";

// function AdminProfile() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//    const API_URL = import.meta.env.VITE_API_URL;

//   const [admin, setAdmin] = useState({});
//   const [loginHistory, setLoginHistory] = useState([]);

//   useEffect(() => {
//     fetchProfile();
//     fetchLoginHistory();
//   }, []);

//   // =====================================================
//   // FETCH ADMIN PROFILE
//   // =====================================================

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${API_URL}/api/profile`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setAdmin(res.data);

//     } catch (error) {
//       console.log("Profile Fetch Error:", error);
//     }
//   };

//   // =====================================================
//   // FETCH ALL USERS LOGIN HISTORY
//   // ADMIN + STUDENT
//   // =====================================================

//   const fetchLoginHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.log("No token found");
//         return;
//       }

//       const res = await axios.get(
//         `${API_URL}/api/auth/login-history/all`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log(
//         "ALL LOGIN HISTORY:",
//         res.data.loginHistory
//       );

//       setLoginHistory(
//         res.data.loginHistory || []
//       );

//     } catch (error) {
//       console.error(
//         "Login History Fetch Error:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           minHeight: "100vh",
//           background:
//             "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)",
//           py: 6,
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Container maxWidth="sm">

//           <Paper
//             elevation={0}
//             sx={{
//               p: 4,
//               borderRadius: 4,
//               background: "rgba(255, 255, 255, 0.9)",
//               backdropFilter: "blur(12px)",
//               boxShadow:
//                 "0px 20px 40px rgba(0, 0, 0, 0.08)",
//               border:
//                 "1px solid rgba(255, 255, 255, 0.6)",
//               transition:
//                 "transform 0.3s ease, box-shadow 0.3s ease",

//               "&:hover": {
//                 boxShadow:
//                   "0px 25px 50px rgba(0, 0, 0, 0.12)",
//               },
//             }}
//           >

//             {/* Header Section */}

//             <Box textAlign="center">

//               <Box
//                 sx={{
//                   position: "relative",
//                   display: "inline-block",
//                 }}
//               >

//                 <Avatar
//                   src={admin.profilePhoto}
//                   alt={admin.name}
//                   sx={{
//                     width: 130,
//                     height: 130,
//                     mx: "auto",
//                     mb: 2,
//                     border: "4px solid #ffffff",
//                     boxShadow:
//                       "0px 8px 24px rgba(25, 118, 210, 0.25)",
//                     fontSize: "2.5rem",
//                     bgcolor: "#1976d2",
//                   }}
//                 >
//                   {admin.name
//                     ? admin.name.charAt(0).toUpperCase()
//                     : "A"}
//                 </Avatar>

//               </Box>

//               <Typography
//                 variant="h4"
//                 fontWeight={800}
//                 sx={{
//                   letterSpacing: "-0.5px",
//                   color: "#1a202c",
//                 }}
//               >
//                 {admin.name || t("adminProfile.adminName")}
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 0.5,
//                   mt: 0.5,
//                   color: "text.secondary",
//                 }}
//               >

//                 <EmailIcon fontSize="small" />

//                 <Typography variant="body2">
//                   {admin.email}
//                 </Typography>

//               </Box>

//               <Chip
//                 icon={
//                   <AdminPanelSettingsIcon
//                     style={{ color: "#fff" }}
//                   />
//                 }
//                 label={
//                   admin.role
//                     ? admin.role.toUpperCase()
//                     : t("adminProfile.admin")
//                 }
//                 sx={{
//                   mt: 2,
//                   px: 1.5,
//                   py: 0.5,
//                   fontWeight: "bold",
//                   fontSize: "0.85rem",
//                   color: "#fff",
//                   background:
//                     "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
//                   boxShadow:
//                     "0 3px 10px rgba(25, 118, 210, 0.3)",
//                 }}
//               />

//             </Box>

//             <Divider
//               sx={{
//                 my: 3.5,
//                 borderColor: "rgba(0,0,0,0.08)",
//               }}
//             />

//             {/* Info Grid Section */}

//             <Grid container spacing={2}>

//               <Grid item xs={6}>

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     borderRadius: 3,
//                     bgcolor: "#f8fafc",
//                     border: "1px solid #e2e8f0",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                   }}
//                 >

//                   <Box
//                     sx={{
//                       p: 1,
//                       borderRadius: 2,
//                       bgcolor:
//                         "rgba(25, 118, 210, 0.08)",
//                       color: "#1976d2",
//                       display: "flex",
//                     }}
//                   >
//                     <PhoneIcon />
//                   </Box>

//                   <Box>

//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       display="block"
//                     >
//                       {t("adminProfile.phone")}
//                     </Typography>

//                     <Typography
//                       fontWeight={600}
//                       color="#2d3748"
//                     >
//                       {admin.phone ||
//                         t("adminProfile.notAdded")}
//                     </Typography>

//                   </Box>

//                 </Paper>

//               </Grid>

//               <Grid item xs={6}>

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     borderRadius: 3,
//                     bgcolor: "#f8fafc",
//                     border: "1px solid #e2e8f0",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                   }}
//                 >

//                   <Box
//                     sx={{
//                       p: 1,
//                       borderRadius: 2,
//                       bgcolor:
//                         "rgba(25, 118, 210, 0.08)",
//                       color: "#1976d2",
//                       display: "flex",
//                     }}
//                   >
//                     <LocationOnIcon />
//                   </Box>

//                   <Box>

//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       display="block"
//                     >
//                       {t("adminProfile.location")}
//                     </Typography>

//                     <Typography
//                       fontWeight={600}
//                       color="#2d3748"
//                     >
//                       {admin.location ||
//                         t("adminProfile.notAdded")}
//                     </Typography>

//                   </Box>

//                 </Paper>

//               </Grid>

//             </Grid>

//             {/* Login History Section */}

//             <Typography
//               variant="h6"
//               fontWeight={700}
//               sx={{ mt: 4, mb: 2, color: "#1a202c" }}
//             >
//               Recent Login History
//             </Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 1.5,
//                 maxHeight: "220px",
//                 overflowY: "auto",
//                 pr: 0.5,
//               }}
//             >

//               {loginHistory && loginHistory.length > 0 ? (

//                 loginHistory.map((item, index) => (

//                   <Paper
//                     key={index}
//                     elevation={0}
//                     sx={{
//                       p: 2,
//                       borderRadius: 2.5,
//                       bgcolor: "#f8fafc",
//                       border: "1px solid #e2e8f0",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >

//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1.5,
//                       }}
//                     >

//                       <DevicesIcon
//                         color="primary"
//                         fontSize="small"
//                       />

//                       <Box>

//                         <Typography
//                           variant="body2"
//                           fontWeight={600}
//                           color="#2d3748"
//                         >
//                           {item.browser || "Unknown Browser"}{" "}
//                           ({item.operatingSystem || "OS"})
//                         </Typography>

//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                         >
//                           IP: {item.ipAddress || "N/A"}
//                         </Typography>

//                       </Box>

//                     </Box>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 0.5,
//                         textAlign: "right",
//                       }}
//                     >

//                       <AccessTimeIcon
//                         fontSize="small"
//                         color="action"
//                       />

//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         {new Date(
//                           item.loginTime || item.createdAt
//                         ).toLocaleDateString()}
//                         <br />
//                         {new Date(
//                           item.loginTime || item.createdAt
//                         ).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </Typography>

//                     </Box>

//                   </Paper>

//                 ))

//               ) : (

//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   textAlign="center"
//                   sx={{ py: 2 }}
//                 >
//                   No login history records found.
//                 </Typography>

//               )}

//             </Box>

//             {/* Dashboard Button */}

//             <Button
//               fullWidth
//               size="large"
//               variant="outlined"
//               startIcon={<DashboardIcon />}
//               sx={{
//                 mt: 4,
//                 py: 1.5,
//                 borderRadius: 2.5,
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//                 textTransform: "none",
//                 borderColor: "#1976d2",
//                 color: "#1976d2",
//                 transition: "all 0.3s ease",

//                 "&:hover": {
//                   borderColor: "#1565c0",
//                   background: "rgba(25, 118, 210, 0.08)",
//                   transform: "translateY(-1px)",
//                 },
//               }}
//               onClick={() =>
//                 navigate("/admin/dashboard")
//               }
//             >
//               Dashboard
//             </Button>

//             {/* Edit Profile Action Button */}

//             <Button
//               fullWidth
//               size="large"
//               variant="contained"
//               startIcon={<EditIcon />}
//               sx={{
//                 mt: 2,
//                 py: 1.5,
//                 borderRadius: 2.5,
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//                 textTransform: "none",
//                 background:
//                   "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
//                 boxShadow:
//                   "0 8px 20px rgba(25, 118, 210, 0.3)",
//                 transition: "all 0.3s ease",

//                 "&:hover": {
//                   background:
//                     "linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)",
//                   boxShadow:
//                     "0 12px 25px rgba(25, 118, 210, 0.4)",
//                   transform: "translateY(-1px)",
//                 },
//               }}
//               onClick={() =>
//                 navigate("/admin/edit")
//               }
//             >
//               {t("adminProfile.editProfile")}
//             </Button>

//           </Paper>

//         </Container>

//       </Box>
//     </>
//   );
// }

// export default AdminProfile;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Paper,
//   Typography,
//   Avatar,
//   Grid,
//   Button,
//   Chip,
//   Divider,
//   Container,
// } from "@mui/material";

// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import EditIcon from "@mui/icons-material/Edit";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import EmailIcon from "@mui/icons-material/Email";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import DevicesIcon from "@mui/icons-material/Devices";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";

// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";

// function AdminProfile() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [admin, setAdmin] = useState({});
//   const [loginHistory, setLoginHistory] = useState([]);

//   useEffect(() => {
//     fetchProfile();
//     fetchLoginHistory();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         "http://localhost:8000/api/profile",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setAdmin(res.data);
//     } catch (error) {
//       console.log("Profile Fetch Error:", error);
//     }
//   };

//   const fetchLoginHistory = async () => {
//     try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//             console.log("No token found");
//             return;
//         }

//         const res = await axios.get(
//             "http://localhost:8000/api/auth/login-history/all",
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         console.log(
//             "ALL LOGIN HISTORY:",
//             res.data.loginHistory
//         );

//         setLoginHistory(
//             res.data.loginHistory || []
//         );

//     } catch (error) {
//         console.error(
//             "Login History Fetch Error:",
//             error.response?.data || error.message
//         );
//     }
// };

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           minHeight: "100vh",
//           background:
//             "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)",
//           py: 6,
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Container maxWidth="sm">
//           <Paper
//             elevation={0}
//             sx={{
//               p: 4,
//               borderRadius: 4,
//               background: "rgba(255, 255, 255, 0.9)",
//               backdropFilter: "blur(12px)",
//               boxShadow:
//                 "0px 20px 40px rgba(0, 0, 0, 0.08)",
//               border:
//                 "1px solid rgba(255, 255, 255, 0.6)",
//               transition:
//                 "transform 0.3s ease, box-shadow 0.3s ease",

//               "&:hover": {
//                 boxShadow:
//                   "0px 25px 50px rgba(0, 0, 0, 0.12)",
//               },
//             }}
//           >
//             {/* Header Section */}
//             <Box textAlign="center">
//               <Box
//                 sx={{
//                   position: "relative",
//                   display: "inline-block",
//                 }}
//               >
//                 <Avatar
//                   src={admin.profilePhoto}
//                   alt={admin.name}
//                   sx={{
//                     width: 130,
//                     height: 130,
//                     mx: "auto",
//                     mb: 2,
//                     border: "4px solid #ffffff",
//                     boxShadow:
//                       "0px 8px 24px rgba(25, 118, 210, 0.25)",
//                     fontSize: "2.5rem",
//                     bgcolor: "#1976d2",
//                   }}
//                 >
//                   {admin.name
//                     ? admin.name.charAt(0).toUpperCase()
//                     : "A"}
//                 </Avatar>
//               </Box>

//               <Typography
//                 variant="h4"
//                 fontWeight={800}
//                 sx={{
//                   letterSpacing: "-0.5px",
//                   color: "#1a202c",
//                 }}
//               >
//                 {admin.name || t("adminProfile.adminName")}
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 0.5,
//                   mt: 0.5,
//                   color: "text.secondary",
//                 }}
//               >
//                 <EmailIcon fontSize="small" />

//                 <Typography variant="body2">
//                   {admin.email}
//                 </Typography>
//               </Box>

//               <Chip
//                 icon={
//                   <AdminPanelSettingsIcon
//                     style={{ color: "#fff" }}
//                   />
//                 }
//                 label={
//                   admin.role
//                     ? admin.role.toUpperCase()
//                     : t("adminProfile.admin")
//                 }
//                 sx={{
//                   mt: 2,
//                   px: 1.5,
//                   py: 0.5,
//                   fontWeight: "bold",
//                   fontSize: "0.85rem",
//                   color: "#fff",
//                   background:
//                     "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
//                   boxShadow:
//                     "0 3px 10px rgba(25, 118, 210, 0.3)",
//                 }}
//               />
//             </Box>

//             <Divider
//               sx={{
//                 my: 3.5,
//                 borderColor: "rgba(0,0,0,0.08)",
//               }}
//             />

//             {/* Info Grid Section */}
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     borderRadius: 3,
//                     bgcolor: "#f8fafc",
//                     border: "1px solid #e2e8f0",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       p: 1,
//                       borderRadius: 2,
//                       bgcolor:
//                         "rgba(25, 118, 210, 0.08)",
//                       color: "#1976d2",
//                       display: "flex",
//                     }}
//                   >
//                     <PhoneIcon />
//                   </Box>

//                   <Box>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       display="block"
//                     >
//                       {t("adminProfile.phone")}
//                     </Typography>

//                     <Typography
//                       fontWeight={600}
//                       color="#2d3748"
//                     >
//                       {admin.phone ||
//                         t("adminProfile.notAdded")}
//                     </Typography>
//                   </Box>
//                 </Paper>
//               </Grid>

//               <Grid item xs={6}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     borderRadius: 3,
//                     bgcolor: "#f8fafc",
//                     border: "1px solid #e2e8f0",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       p: 1,
//                       borderRadius: 2,
//                       bgcolor:
//                         "rgba(25, 118, 210, 0.08)",
//                       color: "#1976d2",
//                       display: "flex",
//                     }}
//                   >
//                     <LocationOnIcon />
//                   </Box>

//                   <Box>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       display="block"
//                     >
//                       {t("adminProfile.location")}
//                     </Typography>

//                     <Typography
//                       fontWeight={600}
//                       color="#2d3748"
//                     >
//                       {admin.location ||
//                         t("adminProfile.notAdded")}
//                     </Typography>
//                   </Box>
//                 </Paper>
//               </Grid>
//             </Grid>

//             {/* Login History Section */}
//             <Typography
//               variant="h6"
//               fontWeight={700}
//               sx={{ mt: 4, mb: 2, color: "#1a202c" }}
//             >
//               Recent Login History
//             </Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 1.5,
//                 maxHeight: "220px",
//                 overflowY: "auto",
//                 pr: 0.5,
//               }}
//             >
//               {loginHistory && loginHistory.length > 0 ? (
//                 loginHistory.map((item, index) => (
//                   <Paper
//                     key={index}
//                     elevation={0}
//                     sx={{
//                       p: 2,
//                       borderRadius: 2.5,
//                       bgcolor: "#f8fafc",
//                       border: "1px solid #e2e8f0",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                       <DevicesIcon color="primary" fontSize="small" />
//                       <Box>
//                         <Typography variant="body2" fontWeight={600} color="#2d3748">
//                           {item.browser || "Unknown Browser"} ({item.operatingSystem || "OS"})
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           IP: {item.ipAddress || "N/A"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, textAlign: "right" }}>
//                       <AccessTimeIcon fontSize="small" color="action" />
//                       <Typography variant="caption" color="text.secondary">
//                         {new Date(item.loginTime || item.createdAt).toLocaleDateString()} <br />
//                         {new Date(item.loginTime || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                 ))
//               ) : (
//                 <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
//                   No login history records found.
//                 </Typography>
//               )}
//             </Box>

//             {/* Dashboard Button */}
//             <Button
//               fullWidth
//               size="large"
//               variant="outlined"
//               startIcon={<DashboardIcon />}
//               sx={{
//                 mt: 4,
//                 py: 1.5,
//                 borderRadius: 2.5,
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//                 textTransform: "none",
//                 borderColor: "#1976d2",
//                 color: "#1976d2",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   borderColor: "#1565c0",
//                   background: "rgba(25, 118, 210, 0.08)",
//                   transform: "translateY(-1px)",
//                 },
//               }}
//               onClick={() => navigate("/admin/dashboard")}
//             >
//               Dashboard
//             </Button>

//             {/* Edit Profile Action Button */}
//             <Button
//               fullWidth
//               size="large"
//               variant="contained"
//               startIcon={<EditIcon />}
//               sx={{
//                 mt: 2,
//                 py: 1.5,
//                 borderRadius: 2.5,
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//                 textTransform: "none",
//                 background:
//                   "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
//                 boxShadow:
//                   "0 8px 20px rgba(25, 118, 210, 0.3)",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   background:
//                     "linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)",
//                   boxShadow:
//                     "0 12px 25px rgba(25, 118, 210, 0.4)",
//                   transform: "translateY(-1px)",
//                 },
//               }}
//               onClick={() => navigate("/admin/edit")}
//             >
//               {t("adminProfile.editProfile")}
//             </Button>
//           </Paper>
//         </Container>
//       </Box>
//     </>
//   );
// }

// export default AdminProfile;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Paper,
//   Typography,
//   Avatar,
//   Grid,
//   Button,
//   Chip,
//   Divider,
//   Container,
// } from "@mui/material";

// import PhoneIcon from "@mui/icons-material/Phone";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import EditIcon from "@mui/icons-material/Edit";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import EmailIcon from "@mui/icons-material/Email";
// import DashboardIcon from "@mui/icons-material/Dashboard";

// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";

// function AdminProfile() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [admin, setAdmin] = useState({});

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         "http://localhost:8000/api/profile",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setAdmin(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           minHeight: "100vh",
//           background:
//             "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)",
//           py: 6,
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Container maxWidth="sm">
//           <Paper
//             elevation={0}
//             sx={{
//               p: 4,
//               borderRadius: 4,
//               background: "rgba(255, 255, 255, 0.9)",
//               backdropFilter: "blur(12px)",
//               boxShadow:
//                 "0px 20px 40px rgba(0, 0, 0, 0.08)",
//               border:
//                 "1px solid rgba(255, 255, 255, 0.6)",
//               transition:
//                 "transform 0.3s ease, box-shadow 0.3s ease",

//               "&:hover": {
//                 boxShadow:
//                   "0px 25px 50px rgba(0, 0, 0, 0.12)",
//               },
//             }}
//           >
//             {/* Header Section */}
//             <Box textAlign="center">
//               <Box
//                 sx={{
//                   position: "relative",
//                   display: "inline-block",
//                 }}
//               >
//                 <Avatar
//                   src={admin.profilePhoto}
//                   alt={admin.name}
//                   sx={{
//                     width: 130,
//                     height: 130,
//                     mx: "auto",
//                     mb: 2,
//                     border: "4px solid #ffffff",
//                     boxShadow:
//                       "0px 8px 24px rgba(25, 118, 210, 0.25)",
//                     fontSize: "2.5rem",
//                     bgcolor: "#1976d2",
//                   }}
//                 >
//                   {admin.name
//                     ? admin.name.charAt(0).toUpperCase()
//                     : "A"}
//                 </Avatar>
//               </Box>

//               <Typography
//                 variant="h4"
//                 fontWeight={800}
//                 sx={{
//                   letterSpacing: "-0.5px",
//                   color: "#1a202c",
//                 }}
//               >
//                 {admin.name || t("adminProfile.adminName")}
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 0.5,
//                   mt: 0.5,
//                   color: "text.secondary",
//                 }}
//               >
//                 <EmailIcon fontSize="small" />

//                 <Typography variant="body2">
//                   {admin.email}
//                 </Typography>
//               </Box>

//               <Chip
//                 icon={
//                   <AdminPanelSettingsIcon
//                     style={{ color: "#fff" }}
//                   />
//                 }
//                 label={
//                   admin.role
//                     ? admin.role.toUpperCase()
//                     : t("adminProfile.admin")
//                 }
//                 sx={{
//                   mt: 2,
//                   px: 1.5,
//                   py: 0.5,
//                   fontWeight: "bold",
//                   fontSize: "0.85rem",
//                   color: "#fff",
//                   background:
//                     "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
//                   boxShadow:
//                     "0 3px 10px rgba(25, 118, 210, 0.3)",
//                 }}
//               />
//             </Box>

//             <Divider
//               sx={{
//                 my: 3.5,
//                 borderColor: "rgba(0,0,0,0.08)",
//               }}
//             />

//             {/* Info Grid Section */}
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     borderRadius: 3,
//                     bgcolor: "#f8fafc",
//                     border: "1px solid #e2e8f0",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       p: 1,
//                       borderRadius: 2,
//                       bgcolor:
//                         "rgba(25, 118, 210, 0.08)",
//                       color: "#1976d2",
//                       display: "flex",
//                     }}
//                   >
//                     <PhoneIcon />
//                   </Box>

//                   <Box>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       display="block"
//                     >
//                       {t("adminProfile.phone")}
//                     </Typography>

//                     <Typography
//                       fontWeight={600}
//                       color="#2d3748"
//                     >
//                       {admin.phone ||
//                         t("adminProfile.notAdded")}
//                     </Typography>
//                   </Box>
//                 </Paper>
//               </Grid>

//               <Grid item xs={6}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 2,
//                     borderRadius: 3,
//                     bgcolor: "#f8fafc",
//                     border: "1px solid #e2e8f0",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       p: 1,
//                       borderRadius: 2,
//                       bgcolor:
//                         "rgba(25, 118, 210, 0.08)",
//                       color: "#1976d2",
//                       display: "flex",
//                     }}
//                   >
//                     <LocationOnIcon />
//                   </Box>

//                   <Box>
//                     <Typography
//                       variant="caption"
//                       color="text.secondary"
//                       display="block"
//                     >
//                       {t("adminProfile.location")}
//                     </Typography>

//                     <Typography
//                       fontWeight={600}
//                       color="#2d3748"
//                     >
//                       {admin.location ||
//                         t("adminProfile.notAdded")}
//                     </Typography>

                   
//                   </Box>

//                 </Paper>
//               </Grid>
//             </Grid>

//            <Button 
//            fullWidth 
//            size="large" 
//            variant="outlined" 
//            startIcon={<DashboardIcon />} 
//            sx={{ mt: 4, py: 
//            1.5, borderRadius: 2.5, 
//            fontWeight: "bold", 
//            fontSize: "1rem", 
//            textTransform: "none", 
//            borderColor: "#1976d2", 
//            color: "#1976d2", 
//            transition: "all 0.3s ease", 
//            "&:hover": { borderColor: "#1565c0", background: "rgba(25, 118, 210, 0.08)", 
//            transform: "translateY(-1px)", }, }} 
//            onClick={() => navigate("/admin/dashboard")} > 
//            Dashboard </Button> 

//             {/* Action Button */}
//             <Button
//               fullWidth
//               size="large"
//               variant="contained"
//               startIcon={<EditIcon />}
//               sx={{
//                 mt: 4,
//                 py: 1.5,
//                 borderRadius: 2.5,
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//                 textTransform: "none",
//                 background:
//                   "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
//                 boxShadow:
//                   "0 8px 20px rgba(25, 118, 210, 0.3)",
//                 transition:
//                   "all 0.3s ease",

//                 "&:hover": {
//                   background:
//                     "linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)",
//                   boxShadow:
//                     "0 12px 25px rgba(25, 118, 210, 0.4)",
//                   transform: "translateY(-1px)",
//                 },
//               }}
//               onClick={() => navigate("/admin/edit")}
//             >
//               {t("adminProfile.editProfile")}
//             </Button>
//           </Paper>
//         </Container>
//       </Box>
//     </>
//   );
// }

// export default AdminProfile;

