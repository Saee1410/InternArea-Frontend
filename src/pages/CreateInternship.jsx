import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

import Navbar from "../components/layout/Navbar";

function CreateInternship() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    title: "",
    company: "",
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
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8000/api/internships",
        formData
      );

      setSnackbar({
        open: true,
        message: t("createInternship.success"),
        severity: "success",
      });

      setFormData({
        title: "",
        company: "",
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
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          t("createInternship.failed"),
        severity: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <Box sx={{ p: 4 }}>
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
            {t("createInternship.title")}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t("createInternship.internshipTitle")}
              name="title"
              value={formData.title}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t("createInternship.companyName")}
              name="company"
              value={formData.company}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t("createInternship.location")}
              name="location"
              value={formData.location}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t("createInternship.category")}
              name="category"
              value={formData.category}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t("createInternship.stipend")}
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t("createInternship.startDate")}
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label={t("createInternship.duration")}
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              type="number"
              label={t("createInternship.numberOfOpening")}
              name="numberOfOpening"
              value={formData.numberOfOpening}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("createInternship.aboutCompany")}
              name="aboutCompany"
              value={formData.aboutCompany}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("createInternship.aboutInternship")}
              name="aboutInternship"
              value={formData.aboutInternship}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t("createInternship.whoCanApply")}
              name="whoCanApply"
              value={formData.whoCanApply}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t("createInternship.perks")}
              name="perks"
              value={formData.perks}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t("createInternship.additionalInfo")}
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >
              {t("createInternship.createButton")}
            </Button>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CreateInternship;


