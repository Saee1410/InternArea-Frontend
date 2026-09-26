import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

import Navbar from "../components/layout/Navbar";

function CreateJob() {
  const { t } = useTranslation();

  const initialFormData = {
    company: "",
    title: "",
    location: "",
    category: "",
    stipend: "",
    startDate: "",
    duration: "",
    aboutCompany: "",
    aboutInternship: "",
    whoCanApply: "",
    perks: "",
    additionalInfo: "",
    numberOfOpening: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    // Required field validation
    if (
      !formData.company.trim() ||
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.category.trim() ||
      !formData.stipend.trim() ||
      !formData.startDate.trim() ||
      !formData.duration.trim() ||
      !formData.aboutCompany.trim() ||
      !formData.aboutInternship.trim() ||
      !formData.whoCanApply.trim() ||
      !formData.perks.trim() ||
      !formData.additionalInfo.trim() ||
      !formData.numberOfOpening
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Convert opening to Number
    const openings = Number(formData.numberOfOpening);

    if (Number.isNaN(openings) || openings <= 0) {
      alert("Number of openings must be greater than 0.");
      return;
    }

    // ==========================================
    // PAYLOAD
    // ==========================================

    const payload = {
      company: formData.company.trim(),
      title: formData.title.trim(),
      location: formData.location.trim(),
      category: formData.category.trim(),
      stipend: formData.stipend.trim(),
      startDate: formData.startDate.trim(),
      duration: formData.duration.trim(),
      aboutCompany: formData.aboutCompany.trim(),
      aboutInternship: formData.aboutInternship.trim(),
      whoCanApply: formData.whoCanApply.trim(),
      perks: formData.perks.trim(),
      additionalInfo: formData.additionalInfo.trim(),
      numberOfOpening: openings,
    };

    try {
      setLoading(true);

      console.log("=================================");
      console.log("CREATING JOB");
      console.log("PAYLOAD:", payload);
      console.log("TOKEN EXISTS:", !!token);
      console.log("=================================");

      const response = await axios.post(
        "http://localhost:8000/api/jobs/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("JOB CREATED:", response.data);

      alert(
        response.data?.message ||
          "Job created successfully!"
      );

      setFormData(initialFormData);

    } catch (error) {

      console.log("=================================");
      console.log("CREATE JOB ERROR");
      console.log("=================================");

      console.log("STATUS:", error.response?.status);
      console.log("BACKEND DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error in job creating"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <Navbar />

      <Box
        sx={{
          p: 4,
          minHeight: "calc(100vh - 70px)",
          background: "#f8fafc",
        }}
      >

        <Paper
          elevation={3}
          sx={{
            maxWidth: 700,
            mx: "auto",
            p: 4,
            borderRadius: 3,
          }}
        >

          <Typography
            variant="h4"
            fontWeight="bold"
            mb={4}
          >
            {t("createJob.title")}
          </Typography>

          <form onSubmit={handleSubmit}>

            {/* COMPANY */}

            <TextField
              fullWidth
              required
              label={t("createJob.companyName")}
              name="company"
              value={formData.company}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* JOB TITLE */}

            <TextField
              fullWidth
              required
              label={t("createJob.jobTitle")}
              name="title"
              value={formData.title}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* LOCATION */}

            <TextField
              fullWidth
              required
              label={t("createJob.location")}
              name="location"
              value={formData.location}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* CATEGORY */}

            <TextField
              fullWidth
              required
              label={t("createJob.category")}
              name="category"
              value={formData.category}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* SALARY */}

            <TextField
              fullWidth
              required
              label={t("createJob.salaryPackage")}
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              placeholder="Example: 5 LPA"
              sx={{ mb: 3 }}
            />

            {/* START DATE */}

            <TextField
              fullWidth
              required
              label={t("createJob.joiningDate")}
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Example: Immediately"
              sx={{ mb: 3 }}
            />

            {/* EXPERIENCE */}

            <TextField
              fullWidth
              required
              label={t("createJob.experienceDuration")}
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Example: 0-2 Years"
              sx={{ mb: 3 }}
            />

            {/* ABOUT COMPANY */}

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label={t("createJob.aboutCompany")}
              name="aboutCompany"
              value={formData.aboutCompany}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* JOB DESCRIPTION */}

            <TextField
              fullWidth
              required
              multiline
              rows={5}
              label={t("createJob.jobDescription")}
              name="aboutInternship"
              value={formData.aboutInternship}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* WHO CAN APPLY */}

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label={t("createJob.whoCanApply")}
              name="whoCanApply"
              value={formData.whoCanApply}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* PERKS */}

            <TextField
              fullWidth
              required
              multiline
              rows={3}
              label={t("createJob.perks")}
              name="perks"
              value={formData.perks}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* ADDITIONAL INFO */}

            <TextField
              fullWidth
              required
              multiline
              rows={3}
              label={t("createJob.additionalInfo")}
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {/* NUMBER OF OPENINGS */}

            <TextField
              fullWidth
              required
              type="number"
              label={t("createJob.numberOfOpenings")}
              name="numberOfOpening"
              value={formData.numberOfOpening}
              onChange={handleChange}
              inputProps={{
                min: 1,
              }}
              sx={{ mb: 4 }}
            />

            {/* SUBMIT */}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: "#fff" }}
                />
              ) : (
                t("createJob.createButton")
              )}
            </Button>

          </form>

        </Paper>

      </Box>

    </div>
  );
}

export default CreateJob;
