import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Container,
} from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import Navbar from "../components/layout/Navbar";

function EditProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    qualification: "",
    skills: "",
    bio: "",
    profilePhoto: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

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

      setFormData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();

        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 500;
          const scaleFactor = MAX_WIDTH / img.width;

          if (scaleFactor < 1) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleFactor;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const compressedBase64 =
            canvas.toDataURL("image/jpeg", 0.7);

          resolve(compressedBase64);
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert(t("editProfile.photoSizeError"));
        return;
      }

      const compressedImage = await compressImage(file);

      setFormData({
        ...formData,
        profilePhoto: compressedImage,
      });
    }
  };

  const handleDeletePhoto = () => {
    setFormData({
      ...formData,
      profilePhoto: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:8000/api/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(t("editProfile.profileUpdated"));

      console.log(res.data);

      navigate("/profile");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          t("editProfile.profileUpdateFailed")
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
            "linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%)",
          py: 6,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
              border:
                "1px solid rgba(255, 255, 255, 0.8)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              textAlign="center"
              mb={1}
              sx={{
                background:
                  "linear-gradient(45deg, #008BDC, #005691)",
                backgroundClip: "text",
                textFillColor: "transparent",
                letterSpacing: "-0.5px",
              }}
            >
              {t("editProfile.title")}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={4}
            >
              {t("editProfile.subtitle")}
            </Typography>

            {/* Photo Section */}

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={4}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  <Tooltip title={t("editProfile.uploadPhoto")}>
                    <IconButton
                      component="label"
                      sx={{
                        bgcolor: "#008BDC",
                        color: "#fff",
                        width: 40,
                        height: 40,
                        boxShadow:
                          "0 4px 10px rgba(0,139,220,0.4)",
                        "&:hover": {
                          bgcolor: "#006bb3",
                        },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />

                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  src={formData.profilePhoto}
                  sx={{
                    width: 130,
                    height: 130,
                    boxShadow:
                      "0 8px 24px rgba(0,0,0,0.12)",
                    border: "4px solid #fff",
                  }}
                />
              </Badge>

              {formData.profilePhoto && (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  size="small"
                  onClick={handleDeletePhoto}
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  {t("editProfile.removePhoto")}
                </Button>
              )}
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label={t("editProfile.profilePhotoUrl")}
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                  helperText={t(
                    "editProfile.imageUrlPlaceholder"
                  )}
                />

                <TextField
                  fullWidth
                  label={t("editProfile.fullName")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label={t("editProfile.email")}
                  value={formData.email}
                  disabled
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: "#F8FAFC",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label={t("editProfile.phone")}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label={t("editProfile.location")}
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label={t("editProfile.qualification")}
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label={t("editProfile.skills")}
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder={t(
                    "editProfile.skillsPlaceholder"
                  )}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t("editProfile.bio")}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{
                    py: 1.6,
                    mt: 2,
                    borderRadius: 2.5,
                    background:
                      "linear-gradient(90deg, #008BDC 0%, #0060A8 100%)",
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: 700,
                    boxShadow:
                      "0 10px 20px rgba(0, 139, 220, 0.25)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #0077BD 0%, #004D87 100%)",
                      boxShadow:
                        "0 12px 24px rgba(0, 139, 220, 0.35)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("editProfile.saveChanges")}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default EditProfile;


