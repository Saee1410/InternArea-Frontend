import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Divider,
  Alert,
  Grid,
} from "@mui/material";

import {
  MapPin,
  IndianRupee,
  Clock3,
  Calendar,
  Users,
  Building2,
  CheckCircle,
} from "lucide-react";

function Details() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // FETCH DETAILS
  // =====================================================

  useEffect(() => {
    if (!id || !type) {
      setData(null);
      setLoading(false);
      return;
    }

    fetchDetails();
  }, [id, type]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const url =
        type === "job"
          ? `${API_URL}/api/jobs/${id}`
          : type === "internship"
          ? `${API_URL}/api/internships/${id}`
          : null;

      if (!url) {
        setData(null);
        return;
      }

      const response = await axios.get(url);

      /*
        Depending on backend response, data can be:
        response.data
        OR
        response.data.internship
        OR
        response.data.job
      */

      const result =
        response.data?.internship ||
        response.data?.job ||
        response.data?.data ||
        response.data;

      setData(result);
    } catch (error) {
      console.error("Fetch Details Error:", error);

      setData(null);

      setMessage(
        error.response?.data?.message ||
          t("details.notExist")
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // APPLY
  // =====================================================

  const handleApply = async () => {
    try {
      setMessage("");
      setMessageType("");

      const token = localStorage.getItem("token");

      // Login check
      if (!token) {
        setMessage(t("details.loginToApply"));
        setMessageType("warning");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      // Only internships currently use application system
      if (type !== "internship") {
        setMessage(t("details.internshipOnly"));
        setMessageType("warning");
        return;
      }

      if (!id) {
        setMessage(t("details.applicationFailed"));
        setMessageType("error");
        return;
      }

      setApplying(true);

      const response = await axios.post(
        `${API_URL}/api/applications/apply`,
        {
          internshipId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message ||
          t("details.applicationSuccess")
      );

      setMessageType("success");
    } catch (error) {
      console.error("Apply Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        t("details.applicationFailed");

      setMessage(errorMessage);

      setMessageType(
        error.response?.status === 429
          ? "warning"
          : "error"
      );
    } finally {
      setApplying(false);
    }
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
            minHeight: "75vh",
            px: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <CircularProgress />

            <Typography
              mt={2}
              color="text.secondary"
            >
              {t("details.loading")}
            </Typography>
          </Box>
        </Box>

        <Footer />
      </>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!data) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            minHeight: "75vh",
            px: 2,
            py: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: {
                xs: 3,
                sm: 5,
              },
              borderRadius: 3,
              textAlign: "center",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1.4rem",
                  sm: "1.7rem",
                },
              }}
            >
              {t("details.notFound")}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
              }}
            >
              {t("details.notExist")}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
              }}
              onClick={() => navigate(-1)}
            >
              {t("details.goBack")}
            </Button>
          </Paper>
        </Box>

        <Footer />
      </>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          background: "#f8fafc",
          minHeight: "100vh",
          py: {
            xs: 2,
            sm: 3,
            md: 5,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: {
                xs: 2,
                sm: 3,
                md: 5,
              },
              borderRadius: {
                xs: 2,
                sm: 3,
              },
              overflow: "hidden",
            }}
          >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                justifyContent: "space-between",
                alignItems: {
                  xs: "stretch",
                  md: "center",
                },
                gap: {
                  xs: 2.5,
                  md: 4,
                },
              }}
            >
              {/* TITLE */}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Chip
                  label={
                    type === "internship"
                      ? t("details.internship")
                      : t("details.job")
                  }
                  color="primary"
                  size="small"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    fontSize: {
                      xs: "1.5rem",
                      sm: "2rem",
                      md: "2.5rem",
                    },
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {data.title ||
                    t("details.notSpecified")}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    mt: 1.2,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      mt: 0.3,
                    }}
                  >
                    <Building2 size={20} />
                  </Box>

                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "1rem",
                        sm: "1.15rem",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    {data.company ||
                      t("details.notSpecified")}
                  </Typography>
                </Box>
              </Box>

              {/* TOP APPLY BUTTON */}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleApply}
                disabled={
                  applying ||
                  type !== "internship"
                }
                startIcon={
                  applying ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <CheckCircle size={20} />
                  )
                }
                sx={{
                  width: {
                    xs: "100%",
                    md: "auto",
                  },
                  minWidth: {
                    xs: "100%",
                    md: 170,
                  },
                  minHeight: 48,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {applying
                  ? t("details.applying")
                  : type === "internship"
                  ? t("details.applyNow")
                  : t("details.jobApplication")}
              </Button>
            </Box>

            {/* =====================================================
                MESSAGE
            ===================================================== */}

            {message && (
              <Alert
                severity={messageType || "info"}
                sx={{
                  mt: 3,
                  borderRadius: 2,
                }}
              >
                {message}
              </Alert>
            )}

            <Divider
              sx={{
                my: {
                  xs: 3,
                  md: 4,
                },
              }}
            />

            {/* =====================================================
                BASIC INFORMATION
            ===================================================== */}

            <Grid
              container
              spacing={{
                xs: 1.5,
                sm: 2,
                md: 3,
              }}
            >
              {/* LOCATION */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <InfoCard
                  icon={<MapPin size={20} />}
                  label={t("details.location")}
                  value={
                    data.location ||
                    t("details.notSpecified")
                  }
                />
              </Grid>

              {/* STIPEND */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <InfoCard
                  icon={<IndianRupee size={20} />}
                  label={t("details.stipend")}
                  value={
                    data.stipend ||
                    t("details.notSpecified")
                  }
                />
              </Grid>

              {/* DURATION */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <InfoCard
                  icon={<Clock3 size={20} />}
                  label={t("details.duration")}
                  value={
                    data.duration ||
                    t("details.notSpecified")
                  }
                />
              </Grid>

              {/* START DATE */}

              <Grid
                item
                xs={12}
                sm={6}
                md={3}
              >
                <InfoCard
                  icon={<Calendar size={20} />}
                  label={t("details.startDate")}
                  value={
                    data.startDate ||
                    t("details.notSpecified")
                  }
                />
              </Grid>
            </Grid>

            {/* =====================================================
                CATEGORY
            ===================================================== */}

            {data.category && (
              <Box
                sx={{
                  mt: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={1}
                >
                  {t("details.category")}
                </Typography>

                <Chip
                  label={data.category}
                  color="primary"
                  variant="outlined"
                  sx={{
                    maxWidth: "100%",
                  }}
                />
              </Box>
            )}

            <Divider
              sx={{
                my: {
                  xs: 3,
                  md: 5,
                },
              }}
            />

            {/* =====================================================
                ABOUT COMPANY
            ===================================================== */}

            <DetailSection
              title={t("details.aboutCompany")}
              content={data.aboutCompany}
              fallback={t("details.noInformation")}
            />

            <Divider sx={{ mb: { xs: 3, md: 5 } }} />

            {/* =====================================================
                ABOUT INTERNSHIP / JOB
            ===================================================== */}

            <DetailSection
              title={t("details.aboutInternshipJob")}
              content={data.aboutInternship}
              fallback={t("details.noInformation")}
            />

            <Divider sx={{ mb: { xs: 3, md: 5 } }} />

            {/* =====================================================
                WHO CAN APPLY
            ===================================================== */}

            <DetailSection
              title={t("details.whoCanApply")}
              content={data.whoCanApply}
              fallback={t("details.noInformation")}
            />

            <Divider sx={{ mb: { xs: 3, md: 5 } }} />

            {/* =====================================================
                PERKS
            ===================================================== */}

            <DetailSection
              title={t("details.perks")}
              content={data.perks}
              fallback={t("details.noInformation")}
            />

            <Divider sx={{ mb: { xs: 3, md: 5 } }} />

            {/* =====================================================
                ADDITIONAL INFORMATION
            ===================================================== */}

            <DetailSection
              title={t("details.additionalInformation")}
              content={data.additionalInfo}
              fallback={t("details.noInformation")}
            />

            <Divider sx={{ mb: { xs: 3, md: 5 } }} />

            {/* =====================================================
                OPENINGS
            ===================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Users size={22} />

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.25rem",
                  },
                }}
              >
                {t("details.numberOfOpenings")}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.25rem",
                  },
                }}
              >
                {data.numberOfOpening ||
                  t("details.notSpecified")}
              </Typography>
            </Box>

            {/* =====================================================
                BOTTOM APPLY SECTION
            ===================================================== */}

            {type === "internship" && (
              <Box
                sx={{
                  mt: {
                    xs: 3,
                    md: 5,
                  },
                  p: {
                    xs: 2,
                    sm: 3,
                  },
                  borderRadius: 3,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    fontSize: {
                      xs: "1.1rem",
                      sm: "1.25rem",
                    },
                  }}
                >
                  {t("details.interested")}
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={1}
                  sx={{
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                    },
                  }}
                >
                  {t("details.nextStep")}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleApply}
                  disabled={applying}
                  sx={{
                    mt: 2,
                    maxWidth: {
                      xs: "100%",
                      sm: 300,
                    },
                    px: 5,
                    py: 1.2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {applying
                    ? t("details.applying")
                    : t("details.applyNow")}
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      <Footer />
    </>
  );
}

// =====================================================
// REUSABLE INFO CARD
// =====================================================

function InfoCard({ icon, label, value }) {
  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
        },
        borderRadius: 2,
        background: "#f8fafc",
        height: "100%",
        minHeight: 120,
        border: "1px solid #eef2f7",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        mt={1}
      >
        {label}
      </Typography>

      <Typography
        fontWeight={600}
        mt={0.5}
        sx={{
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// =====================================================
// REUSABLE DETAIL SECTION
// =====================================================

function DetailSection({
  title,
  content,
  fallback,
}) {
  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
        sx={{
          fontSize: {
            xs: "1.25rem",
            sm: "1.5rem",
          },
        }}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          lineHeight: 1.8,
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          mb: {
            xs: 3,
            md: 5,
          },
          fontSize: {
            xs: "0.9rem",
            sm: "1rem",
          },
        }}
      >
        {content || fallback}
      </Typography>
    </Box>
  );
}

export default Details;







// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";

// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Chip,
//   Paper,
//   CircularProgress,
//   Divider,
//   Alert,
//   Grid,
// } from "@mui/material";

// import {
//   MapPin,
//   IndianRupee,
//   Clock3,
//   Calendar,
//   Users,
//   Building2,
//   CheckCircle,
// } from "lucide-react";

// function Details() {
//   const { type, id } = useParams();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//    const API_URL = import.meta.env.VITE_API_URL;

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [applying, setApplying] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   // ==========================================
//   // FETCH DETAILS
//   // ==========================================

//   useEffect(() => {
//     fetchDetails();
//   }, [id, type]);

//   const fetchDetails = async () => {
//     try {
//       setLoading(true);

//       const url =
//         type === "job"
//           ? `${API_URL}/api/jobs/${id}`
//           : `${API_URL}/api/internships/${id}`;

//       const res = await axios.get(url);

//       setData(res.data);
//     } catch (error) {
//       console.log("Fetch Details Error:", error);
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // APPLY FOR INTERNSHIP
//   // ==========================================

//   const handleApply = async () => {
//     try {
//       setMessage("");
//       setMessageType("");

//       // Check login
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setMessage(t("details.loginToApply"));
//         setMessageType("warning");

//         setTimeout(() => {
//           navigate("/login");
//         }, 1500);

//         return;
//       }

//       // Jobs are not handled by subscription application system
//       if (type !== "internship") {
//         setMessage(t("details.internshipOnly"));
//         setMessageType("warning");
//         return;
//       }

//       setApplying(true);

//       const res = await axios.post(
//         `${API_URL}/api/applications/apply`,
//         {
//           internshipId: id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(
//         res.data.message || t("details.applicationSuccess")
//       );

//       setMessageType("success");
//     } catch (error) {
//       console.log("Apply Error:", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         t("details.applicationFailed");

//       setMessage(errorMessage);

//       setMessageType(
//         error.response?.status === 429
//           ? "warning"
//           : "error"
//       );
//     } finally {
//       setApplying(false);
//     }
//   };

//   // ==========================================
//   // LOADING UI
//   // ==========================================

//   if (loading) {
//     return (
//       <>
//         <Navbar />

//         <Box
//           sx={{
//             minHeight: "75vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             background: "#f8fafc",
//           }}
//         >
//           <Box textAlign="center">
//             <CircularProgress />

//             <Typography
//               mt={2}
//               color="text.secondary"
//             >
//               {t("details.loading")}
//             </Typography>
//           </Box>
//         </Box>

//         <Footer />
//       </>
//     );
//   }

//   // ==========================================
//   // NOT FOUND UI
//   // ==========================================

//   if (!data) {
//     return (
//       <>
//         <Navbar />

//         <Box
//           sx={{
//             minHeight: "75vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             background: "#f8fafc",
//             px: 2,
//           }}
//         >
//           <Paper
//             elevation={2}
//             sx={{
//               p: 5,
//               borderRadius: 3,
//               textAlign: "center",
//               maxWidth: 500,
//               width: "100%",
//             }}
//           >
//             <Typography
//               variant="h5"
//               fontWeight="bold"
//               mb={1}
//             >
//               {t("details.notFound")}
//             </Typography>

//             <Typography color="text.secondary">
//               {t("details.notExist")}
//             </Typography>

//             <Button
//               variant="contained"
//               sx={{
//                 mt: 3,
//                 textTransform: "none",
//               }}
//               onClick={() => navigate(-1)}
//             >
//               {t("details.goBack")}
//             </Button>
//           </Paper>
//         </Box>

//         <Footer />
//       </>
//     );
//   }

//   // ==========================================
//   // MAIN UI
//   // ==========================================

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           background: "#f8fafc",
//           minHeight: "100vh",
//           py: {
//             xs: 3,
//             md: 5,
//           },
//         }}
//       >
//         <Container maxWidth="lg">
//           {/* ==========================================
//               MAIN CARD
//           ========================================== */}

//           <Paper
//             elevation={3}
//             sx={{
//               p: {
//                 xs: 2.5,
//                 sm: 4,
//                 md: 5,
//               },
//               borderRadius: 3,
//             }}
//           >
//             {/* ==========================================
//                 HEADER
//             ========================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: {
//                   xs: "column",
//                   md: "row",
//                 },
//                 justifyContent: "space-between",
//                 alignItems: {
//                   xs: "flex-start",
//                   md: "center",
//                 },
//                 gap: 3,
//               }}
//             >
//               <Box>
//                 <Chip
//                   label={
//                     type === "internship"
//                       ? t("details.internship")
//                       : t("details.job")
//                   }
//                   color="primary"
//                   size="small"
//                   sx={{
//                     mb: 2,
//                     fontWeight: 600,
//                   }}
//                 />

//                 <Typography
//                   variant="h4"
//                   fontWeight="bold"
//                   sx={{
//                     fontSize: {
//                       xs: "1.8rem",
//                       sm: "2.2rem",
//                       md: "2.5rem",
//                     },
//                   }}
//                 >
//                   {data.title}
//                 </Typography>

//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   gap={1}
//                   mt={1}
//                 >
//                   <Building2 size={20} />

//                   <Typography
//                     variant="h6"
//                     color="text.secondary"
//                   >
//                     {data.company}
//                   </Typography>
//                 </Box>
//               </Box>

//               {/* APPLY BUTTON */}

//               <Button
//                 variant="contained"
//                 size="large"
//                 onClick={handleApply}
//                 disabled={
//                   applying || type !== "internship"
//                 }
//                 startIcon={
//                   applying ? (
//                     <CircularProgress
//                       size={20}
//                       color="inherit"
//                     />
//                   ) : (
//                     <CheckCircle size={20} />
//                   )
//                 }
//                 sx={{
//                   minWidth: 160,
//                   minHeight: 48,
//                   borderRadius: 2,
//                   textTransform: "none",
//                   fontWeight: 600,
//                 }}
//               >
//                 {applying
//                   ? t("details.applying")
//                   : type === "internship"
//                   ? t("details.applyNow")
//                   : t("details.jobApplication")}
//               </Button>
//             </Box>

//             {/* ==========================================
//                 MESSAGE
//             ========================================== */}

//             {message && (
//               <Alert
//                 severity={messageType}
//                 sx={{
//                   mt: 3,
//                   borderRadius: 2,
//                 }}
//               >
//                 {message}
//               </Alert>
//             )}

//             <Divider sx={{ my: 4 }} />

//             {/* ==========================================
//                 BASIC INFORMATION
//             ========================================== */}

//             <Grid
//               container
//               spacing={3}
//             >
//               {/* LOCATION */}

//               <Grid item xs={12} sm={6} md={3}>
//                 <Box
//                   sx={{
//                     p: 2.5,
//                     borderRadius: 2,
//                     background: "#f8fafc",
//                     height: "100%",
//                   }}
//                 >
//                   <MapPin size={20} />

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     mt={1}
//                   >
//                     {t("details.location")}
//                   </Typography>

//                   <Typography
//                     fontWeight={600}
//                     mt={0.5}
//                   >
//                     {data.location ||
//                       t("details.notSpecified")}
//                   </Typography>
//                 </Box>
//               </Grid>

//               {/* STIPEND */}

//               <Grid item xs={12} sm={6} md={3}>
//                 <Box
//                   sx={{
//                     p: 2.5,
//                     borderRadius: 2,
//                     background: "#f8fafc",
//                     height: "100%",
//                   }}
//                 >
//                   <IndianRupee size={20} />

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     mt={1}
//                   >
//                     {t("details.stipend")}
//                   </Typography>

//                   <Typography
//                     fontWeight={600}
//                     mt={0.5}
//                   >
//                     {data.stipend ||
//                       t("details.notSpecified")}
//                   </Typography>
//                 </Box>
//               </Grid>

//               {/* DURATION */}

//               <Grid item xs={12} sm={6} md={3}>
//                 <Box
//                   sx={{
//                     p: 2.5,
//                     borderRadius: 2,
//                     background: "#f8fafc",
//                     height: "100%",
//                   }}
//                 >
//                   <Clock3 size={20} />

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     mt={1}
//                   >
//                     {t("details.duration")}
//                   </Typography>

//                   <Typography
//                     fontWeight={600}
//                     mt={0.5}
//                   >
//                     {data.duration ||
//                       t("details.notSpecified")}
//                   </Typography>
//                 </Box>
//               </Grid>

//               {/* START DATE */}

//               <Grid item xs={12} sm={6} md={3}>
//                 <Box
//                   sx={{
//                     p: 2.5,
//                     borderRadius: 2,
//                     background: "#f8fafc",
//                     height: "100%",
//                   }}
//                 >
//                   <Calendar size={20} />

//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     mt={1}
//                   >
//                     {t("details.startDate")}
//                   </Typography>

//                   <Typography
//                     fontWeight={600}
//                     mt={0.5}
//                   >
//                     {data.startDate ||
//                       t("details.notSpecified")}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>

//             {/* ==========================================
//                 CATEGORY
//             ========================================== */}

//             {data.category && (
//               <Box mt={4}>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   mb={1}
//                 >
//                   {t("details.category")}
//                 </Typography>

//                 <Chip
//                   label={data.category}
//                   color="primary"
//                   variant="outlined"
//                 />
//               </Box>
//             )}

//             <Divider sx={{ my: 5 }} />

//             {/* ==========================================
//                 ABOUT COMPANY
//             ========================================== */}

//             <Typography
//               variant="h5"
//               fontWeight="bold"
//               mb={2}
//             >
//               {t("details.aboutCompany")}
//             </Typography>

//             <Typography
//               color="text.secondary"
//               lineHeight={1.8}
//               mb={5}
//             >
//               {data.aboutCompany ||
//                 t("details.noInformation")}
//             </Typography>

//             <Divider sx={{ mb: 5 }} />

//             {/* ==========================================
//                 ABOUT INTERNSHIP / JOB
//             ========================================== */}

//             <Typography
//               variant="h5"
//               fontWeight="bold"
//               mb={2}
//             >
//               {t("details.aboutInternshipJob")}
//             </Typography>

//             <Typography
//               color="text.secondary"
//               lineHeight={1.8}
//               mb={5}
//             >
//               {data.aboutInternship ||
//                 t("details.noInformation")}
//             </Typography>

//             <Divider sx={{ mb: 5 }} />

//             {/* ==========================================
//                 WHO CAN APPLY
//             ========================================== */}

//             <Typography
//               variant="h5"
//               fontWeight="bold"
//               mb={2}
//             >
//               {t("details.whoCanApply")}
//             </Typography>

//             <Typography
//               color="text.secondary"
//               lineHeight={1.8}
//               mb={5}
//             >
//               {data.whoCanApply ||
//                 t("details.noInformation")}
//             </Typography>

//             <Divider sx={{ mb: 5 }} />

//             {/* ==========================================
//                 PERKS
//             ========================================== */}

//             <Typography
//               variant="h5"
//               fontWeight="bold"
//               mb={2}
//             >
//               {t("details.perks")}
//             </Typography>

//             <Typography
//               color="text.secondary"
//               lineHeight={1.8}
//               mb={5}
//             >
//               {data.perks ||
//                 t("details.noInformation")}
//             </Typography>

//             <Divider sx={{ mb: 5 }} />

//             {/* ==========================================
//                 ADDITIONAL INFORMATION
//             ========================================== */}

//             <Typography
//               variant="h5"
//               fontWeight="bold"
//               mb={2}
//             >
//               {t("details.additionalInformation")}
//             </Typography>

//             <Typography
//               color="text.secondary"
//               lineHeight={1.8}
//               mb={5}
//             >
//               {data.additionalInfo ||
//                 t("details.noInformation")}
//             </Typography>

//             <Divider sx={{ mb: 5 }} />

//             {/* ==========================================
//                 OPENINGS
//             ========================================== */}

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 flexWrap: "wrap",
//               }}
//             >
//               <Users size={22} />

//               <Typography
//                 variant="h6"
//                 fontWeight="bold"
//               >
//                 {t("details.numberOfOpenings")}
//               </Typography>

//               <Typography variant="h6">
//                 {data.numberOfOpening ||
//                   t("details.notSpecified")}
//               </Typography>
//             </Box>

//             {/* ==========================================
//                 BOTTOM APPLY SECTION
//             ========================================== */}

//             {type === "internship" && (
//               <Box
//                 sx={{
//                   mt: 5,
//                   p: 3,
//                   borderRadius: 3,
//                   background: "#f8fafc",
//                   border: "1px solid #e2e8f0",
//                   textAlign: "center",
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   fontWeight="bold"
//                 >
//                   {t("details.interested")}
//                 </Typography>

//                 <Typography
//                   color="text.secondary"
//                   mt={1}
//                 >
//                   {t("details.nextStep")}
//                 </Typography>

//                 <Button
//                   variant="contained"
//                   size="large"
//                   onClick={handleApply}
//                   disabled={applying}
//                   sx={{
//                     mt: 2,
//                     px: 5,
//                     py: 1.2,
//                     borderRadius: 2,
//                     textTransform: "none",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {applying
//                     ? t("details.applying")
//                     : t("details.applyNow")}
//                 </Button>
//               </Box>
//             )}
//           </Paper>
//         </Container>
//       </Box>

//       {/* FOOTER */}

//       <Footer />
//     </>
//   );
// }

// export default Details;


