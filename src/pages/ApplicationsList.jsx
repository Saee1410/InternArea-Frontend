import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import Navbar from "../components/layout/Navbar";

function ApplicationsList() {
  const { t } = useTranslation();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCompanyApplications();
  }, []);

  // JWT Token मधून Current Logged-in User ID शोधणे
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.id || payload._id || payload.userId;
    } catch (e) {
      console.error("Invalid token format", e);
      return null;
    }
  };

  const fetchMyCompanyApplications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const currentUserId = getCurrentUserId();

      const res = await axios.get(
        "http://localhost:8000/api/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // फक्त logged-in company/user ने post केलेल्या applications
      const myApplications = res.data.filter((app) => {
        const creatorId =
          app.internshipId?.postedBy ||
          app.jobId?.postedBy ||
          app.postId?.postedBy;

        return creatorId === currentUserId;
      });

      setApplications(myApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Status नुसार translated label
  const getStatusChip = (status) => {
    let color = "default";
    let label = t("applications.pending");

    if (status === "Accepted") {
      color = "success";
      label = t("applications.accepted");
    } else if (status === "Selected") {
      color = "success";
      label = t("applications.selected");
    } else if (status === "Rejected") {
      color = "error";
      label = t("applications.rejected");
    } else {
      color = "warning";
    }

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{
          fontWeight: 600,
          px: 1,
        }}
      />
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header Section */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background:
                "linear-gradient(45deg, #008BDC, #005691)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            {t("applications.title")}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >
            {t("applications.subtitle")}
          </Typography>
        </Box>

        {/* Table Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow:
              "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: "#F1F5F9" }}>
                <TableRow>

                  {/* Company / Title */}
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {t("applications.companyTitle")}
                  </TableCell>

                  {/* Category */}
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {t("applications.category")}
                  </TableCell>

                  {/* Applied By */}
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {t("applications.appliedBy")}
                  </TableCell>

                  {/* Date */}
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {t("applications.date")}
                  </TableCell>

                  {/* Status */}
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {t("applications.status")}
                  </TableCell>

                  {/* Action */}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {t("applications.action")}
                  </TableCell>

                </TableRow>
              </TableHead>

              <TableBody>
                {/* Loading */}
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 6 }}
                    >
                      <CircularProgress size={35} />
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (

                  /* No Applications */
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 6 }}
                    >
                      <Typography
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {t("applications.noApplications")}
                      </Typography>
                    </TableCell>
                  </TableRow>

                ) : (

                  /* Applications */
                  applications.map((app) => (
                    <TableRow
                      key={app._id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                        transition: "background 0.2s",
                      }}
                    >

                      {/* Company / Post Title */}
                      <TableCell>
                        <Typography
                          fontWeight={700}
                          color="#1E293B"
                        >
                          {app.internshipId?.companyName ||
                            app.jobId?.companyName ||
                            "N/A"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {app.internshipId?.role ||
                            app.jobId?.title ||
                            t("applications.position")}
                        </Typography>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Chip
                          label={
                            app.internshipId
                              ? t("applications.internship")
                              : t("applications.job")
                          }
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor:
                              app.internshipId
                                ? "#ED6C02"
                                : "#2E7D32",
                            color:
                              app.internshipId
                                ? "#ED6C02"
                                : "#2E7D32",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>

                      {/* Applied By */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            src={
                              app.applicantId?.profilePhoto
                            }
                            sx={{
                              width: 32,
                              height: 32,
                            }}
                          >
                            {app.applicantId?.name?.charAt(0) ||
                              "U"}
                          </Avatar>

                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                            >
                              {app.applicantId?.name ||
                                t(
                                  "applications.anonymousUser"
                                )}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {app.applicantId?.email || ""}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {new Date(
                            app.createdAt || Date.now()
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {getStatusChip(app.status)}
                      </TableCell>

                      {/* Action */}
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >

                          {/* View Candidate */}
                          <Tooltip
                            title={t(
                              "applications.viewCandidate"
                            )}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                color: "#008BDC",
                                bgcolor: "#E3F2FD",
                                "&:hover": {
                                  bgcolor: "#BBDEFB",
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Accept */}
                          <Tooltip
                            title={t(
                              "applications.accept"
                            )}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                color: "#2E7D32",
                                bgcolor: "#E8F5E9",
                                "&:hover": {
                                  bgcolor: "#C8E6C9",
                                },
                              }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Reject */}
                          <Tooltip
                            title={t(
                              "applications.reject"
                            )}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                color: "#D32F2F",
                                bgcolor: "#FFEBEE",
                                "&:hover": {
                                  bgcolor: "#FFCDD2",
                                },
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                        </Stack>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}

export default ApplicationsList;













