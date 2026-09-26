import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Chip,
  Divider,
  Container,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DevicesIcon from "@mui/icons-material/Devices";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function AdminProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [admin, setAdmin] = useState({});
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchLoginHistory();
  }, []);

  // =====================================================
  // FETCH ADMIN PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdmin(res.data);

    } catch (error) {
      console.log("Profile Fetch Error:", error);
    }
  };

  // =====================================================
  // FETCH ALL USERS LOGIN HISTORY
  // ADMIN + STUDENT
  // =====================================================

  const fetchLoginHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await axios.get(
        "http://localhost:8000/api/auth/login-history/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ALL LOGIN HISTORY:",
        res.data.loginHistory
      );

      setLoginHistory(
        res.data.loginHistory || []
      );

    } catch (error) {
      console.error(
        "Login History Fetch Error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)",
          py: 6,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0px 20px 40px rgba(0, 0, 0, 0.08)",
              border:
                "1px solid rgba(255, 255, 255, 0.6)",
              transition:
                "transform 0.3s ease, box-shadow 0.3s ease",

              "&:hover": {
                boxShadow:
                  "0px 25px 50px rgba(0, 0, 0, 0.12)",
              },
            }}
          >

            {/* Header Section */}

            <Box textAlign="center">

              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                }}
              >

                <Avatar
                  src={admin.profilePhoto}
                  alt={admin.name}
                  sx={{
                    width: 130,
                    height: 130,
                    mx: "auto",
                    mb: 2,
                    border: "4px solid #ffffff",
                    boxShadow:
                      "0px 8px 24px rgba(25, 118, 210, 0.25)",
                    fontSize: "2.5rem",
                    bgcolor: "#1976d2",
                  }}
                >
                  {admin.name
                    ? admin.name.charAt(0).toUpperCase()
                    : "A"}
                </Avatar>

              </Box>

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.5px",
                  color: "#1a202c",
                }}
              >
                {admin.name || t("adminProfile.adminName")}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mt: 0.5,
                  color: "text.secondary",
                }}
              >

                <EmailIcon fontSize="small" />

                <Typography variant="body2">
                  {admin.email}
                </Typography>

              </Box>

              <Chip
                icon={
                  <AdminPanelSettingsIcon
                    style={{ color: "#fff" }}
                  />
                }
                label={
                  admin.role
                    ? admin.role.toUpperCase()
                    : t("adminProfile.admin")
                }
                sx={{
                  mt: 2,
                  px: 1.5,
                  py: 0.5,
                  fontWeight: "bold",
                  fontSize: "0.85rem",
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
                my: 3.5,
                borderColor: "rgba(0,0,0,0.08)",
              }}
            />

            {/* Info Grid Section */}

            <Grid container spacing={2}>

              <Grid item xs={6}>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
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
                    }}
                  >
                    <PhoneIcon />
                  </Box>

                  <Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {t("adminProfile.phone")}
                    </Typography>

                    <Typography
                      fontWeight={600}
                      color="#2d3748"
                    >
                      {admin.phone ||
                        t("adminProfile.notAdded")}
                    </Typography>

                  </Box>

                </Paper>

              </Grid>

              <Grid item xs={6}>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
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
                    }}
                  >
                    <LocationOnIcon />
                  </Box>

                  <Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {t("adminProfile.location")}
                    </Typography>

                    <Typography
                      fontWeight={600}
                      color="#2d3748"
                    >
                      {admin.location ||
                        t("adminProfile.notAdded")}
                    </Typography>

                  </Box>

                </Paper>

              </Grid>

            </Grid>

            {/* Login History Section */}

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mt: 4, mb: 2, color: "#1a202c" }}
            >
              Recent Login History
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                maxHeight: "220px",
                overflowY: "auto",
                pr: 0.5,
              }}
            >

              {loginHistory && loginHistory.length > 0 ? (

                loginHistory.map((item, index) => (

                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >

                      <DevicesIcon
                        color="primary"
                        fontSize="small"
                      />

                      <Box>

                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="#2d3748"
                        >
                          {item.browser || "Unknown Browser"}{" "}
                          ({item.operatingSystem || "OS"})
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          IP: {item.ipAddress || "N/A"}
                        </Typography>

                      </Box>

                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        textAlign: "right",
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
                        {new Date(
                          item.loginTime || item.createdAt
                        ).toLocaleDateString()}
                        <br />
                        {new Date(
                          item.loginTime || item.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>

                    </Box>

                  </Paper>

                ))

              ) : (

                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 2 }}
                >
                  No login history records found.
                </Typography>

              )}

            </Box>

            {/* Dashboard Button */}

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
                fontSize: "1rem",
                textTransform: "none",
                borderColor: "#1976d2",
                color: "#1976d2",
                transition: "all 0.3s ease",

                "&:hover": {
                  borderColor: "#1565c0",
                  background: "rgba(25, 118, 210, 0.08)",
                  transform: "translateY(-1px)",
                },
              }}
              onClick={() =>
                navigate("/admin/dashboard")
              }
            >
              Dashboard
            </Button>

            {/* Edit Profile Action Button */}

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
                fontSize: "1rem",
                textTransform: "none",
                background:
                  "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
                boxShadow:
                  "0 8px 20px rgba(25, 118, 210, 0.3)",
                transition: "all 0.3s ease",

                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)",
                  boxShadow:
                    "0 12px 25px rgba(25, 118, 210, 0.4)",
                  transform: "translateY(-1px)",
                },
              }}
              onClick={() =>
                navigate("/admin/edit")
              }
            >
              {t("adminProfile.editProfile")}
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

