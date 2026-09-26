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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ==========================================
  // FETCH DETAILS
  // ==========================================

  useEffect(() => {
    fetchDetails();
  }, [id, type]);

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const url =
        type === "job"
          ? `http://localhost:8000/api/jobs/${id}`
          : `http://localhost:8000/api/internships/${id}`;

      const res = await axios.get(url);

      setData(res.data);
    } catch (error) {
      console.log("Fetch Details Error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // APPLY FOR INTERNSHIP
  // ==========================================

  const handleApply = async () => {
    try {
      setMessage("");
      setMessageType("");

      // Check login
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(t("details.loginToApply"));
        setMessageType("warning");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      // Jobs are not handled by subscription application system
      if (type !== "internship") {
        setMessage(t("details.internshipOnly"));
        setMessageType("warning");
        return;
      }

      setApplying(true);

      const res = await axios.post(
        "http://localhost:8000/api/applications/apply",
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
        res.data.message || t("details.applicationSuccess")
      );

      setMessageType("success");
    } catch (error) {
      console.log("Apply Error:", error);

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

  // ==========================================
  // LOADING UI
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            minHeight: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <Box textAlign="center">
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

  // ==========================================
  // NOT FOUND UI
  // ==========================================

  if (!data) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            minHeight: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f8fafc",
            px: 2,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 5,
              borderRadius: 3,
              textAlign: "center",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={1}
            >
              {t("details.notFound")}
            </Typography>

            <Typography color="text.secondary">
              {t("details.notExist")}
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 3,
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

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          background: "#f8fafc",
          minHeight: "100vh",
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Container maxWidth="lg">
          {/* ==========================================
              MAIN CARD
          ========================================== */}

          <Paper
            elevation={3}
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
                md: 5,
              },
              borderRadius: 3,
            }}
          >
            {/* ==========================================
                HEADER
            ========================================== */}

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                gap: 3,
              }}
            >
              <Box>
                <Chip
                  label={
                    type === "internship"
                      ? t("details.internship")
                      : t("details.job")
                  }
                  color="primary"
                  size="small"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    fontSize: {
                      xs: "1.8rem",
                      sm: "2.2rem",
                      md: "2.5rem",
                    },
                  }}
                >
                  {data.title}
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={1}
                >
                  <Building2 size={20} />

                  <Typography
                    variant="h6"
                    color="text.secondary"
                  >
                    {data.company}
                  </Typography>
                </Box>
              </Box>

              {/* APPLY BUTTON */}

              <Button
                variant="contained"
                size="large"
                onClick={handleApply}
                disabled={
                  applying || type !== "internship"
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
                  minWidth: 160,
                  minHeight: 48,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {applying
                  ? t("details.applying")
                  : type === "internship"
                  ? t("details.applyNow")
                  : t("details.jobApplication")}
              </Button>
            </Box>

            {/* ==========================================
                MESSAGE
            ========================================== */}

            {message && (
              <Alert
                severity={messageType}
                sx={{
                  mt: 3,
                  borderRadius: 2,
                }}
              >
                {message}
              </Alert>
            )}

            <Divider sx={{ my: 4 }} />

            {/* ==========================================
                BASIC INFORMATION
            ========================================== */}

            <Grid
              container
              spacing={3}
            >
              {/* LOCATION */}

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: "#f8fafc",
                    height: "100%",
                  }}
                >
                  <MapPin size={20} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                  >
                    {t("details.location")}
                  </Typography>

                  <Typography
                    fontWeight={600}
                    mt={0.5}
                  >
                    {data.location ||
                      t("details.notSpecified")}
                  </Typography>
                </Box>
              </Grid>

              {/* STIPEND */}

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: "#f8fafc",
                    height: "100%",
                  }}
                >
                  <IndianRupee size={20} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                  >
                    {t("details.stipend")}
                  </Typography>

                  <Typography
                    fontWeight={600}
                    mt={0.5}
                  >
                    {data.stipend ||
                      t("details.notSpecified")}
                  </Typography>
                </Box>
              </Grid>

              {/* DURATION */}

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: "#f8fafc",
                    height: "100%",
                  }}
                >
                  <Clock3 size={20} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                  >
                    {t("details.duration")}
                  </Typography>

                  <Typography
                    fontWeight={600}
                    mt={0.5}
                  >
                    {data.duration ||
                      t("details.notSpecified")}
                  </Typography>
                </Box>
              </Grid>

              {/* START DATE */}

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: "#f8fafc",
                    height: "100%",
                  }}
                >
                  <Calendar size={20} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                  >
                    {t("details.startDate")}
                  </Typography>

                  <Typography
                    fontWeight={600}
                    mt={0.5}
                  >
                    {data.startDate ||
                      t("details.notSpecified")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* ==========================================
                CATEGORY
            ========================================== */}

            {data.category && (
              <Box mt={4}>
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
                />
              </Box>
            )}

            <Divider sx={{ my: 5 }} />

            {/* ==========================================
                ABOUT COMPANY
            ========================================== */}

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              {t("details.aboutCompany")}
            </Typography>

            <Typography
              color="text.secondary"
              lineHeight={1.8}
              mb={5}
            >
              {data.aboutCompany ||
                t("details.noInformation")}
            </Typography>

            <Divider sx={{ mb: 5 }} />

            {/* ==========================================
                ABOUT INTERNSHIP / JOB
            ========================================== */}

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              {t("details.aboutInternshipJob")}
            </Typography>

            <Typography
              color="text.secondary"
              lineHeight={1.8}
              mb={5}
            >
              {data.aboutInternship ||
                t("details.noInformation")}
            </Typography>

            <Divider sx={{ mb: 5 }} />

            {/* ==========================================
                WHO CAN APPLY
            ========================================== */}

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              {t("details.whoCanApply")}
            </Typography>

            <Typography
              color="text.secondary"
              lineHeight={1.8}
              mb={5}
            >
              {data.whoCanApply ||
                t("details.noInformation")}
            </Typography>

            <Divider sx={{ mb: 5 }} />

            {/* ==========================================
                PERKS
            ========================================== */}

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              {t("details.perks")}
            </Typography>

            <Typography
              color="text.secondary"
              lineHeight={1.8}
              mb={5}
            >
              {data.perks ||
                t("details.noInformation")}
            </Typography>

            <Divider sx={{ mb: 5 }} />

            {/* ==========================================
                ADDITIONAL INFORMATION
            ========================================== */}

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              {t("details.additionalInformation")}
            </Typography>

            <Typography
              color="text.secondary"
              lineHeight={1.8}
              mb={5}
            >
              {data.additionalInfo ||
                t("details.noInformation")}
            </Typography>

            <Divider sx={{ mb: 5 }} />

            {/* ==========================================
                OPENINGS
            ========================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Users size={22} />

              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {t("details.numberOfOpenings")}
              </Typography>

              <Typography variant="h6">
                {data.numberOfOpening ||
                  t("details.notSpecified")}
              </Typography>
            </Box>

            {/* ==========================================
                BOTTOM APPLY SECTION
            ========================================== */}

            {type === "internship" && (
              <Box
                sx={{
                  mt: 5,
                  p: 3,
                  borderRadius: 3,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {t("details.interested")}
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={1}
                >
                  {t("details.nextStep")}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleApply}
                  disabled={applying}
                  sx={{
                    mt: 2,
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

      {/* FOOTER */}

      <Footer />
    </>
  );
}

export default Details;


