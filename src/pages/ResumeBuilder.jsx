import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";

import { useTranslation } from "react-i18next";

import { createResume } from "../services/resumeService";


const ResumeBuilder = () => {

  const navigate = useNavigate();

  const { t } = useTranslation();


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    qualification: "",
    college: "",
    graduationYear: "",
    experience: "",
    skills: "",
    projects: "",
    achievements: "",
    linkedin: "",
    github: "",
    photo: null,
  });


  const handleChange = (e) => {

    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const resumeData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        qualification: formData.qualification,
        college: formData.college,
        graduationYear: formData.graduationYear,
        experience: formData.experience,
        skills: formData.skills,
        projects: formData.projects,
        achievements: formData.achievements,
        linkedin: formData.linkedin,
        github: formData.github,
      };


      console.log("Sending Resume:", resumeData);


      const data = await createResume(resumeData);


      console.log("Resume Created:", data);


      navigate("/resumepreview");

    }
    catch (error) {

      console.error(
        "Resume creation error:",
        error.response?.data || error.message
      );


      alert(
        error.response?.data?.message ||
        t("resumeBuilder.failedToSave")
      );

    }

  };


  return (

    <Box

      sx={{

        minHeight: "100vh",

        backgroundColor: "#f5f7fa",

        py: 5,

      }}

    >

      <Container maxWidth="md">


        {/* Header */}

        <Box textAlign="center" mb={4}>

          <Typography
            variant="h4"
            fontWeight={700}
            color="text.primary"
          >

            {t("resumeBuilder.title")}

          </Typography>


          <Typography
            variant="body1"
            color="text.secondary"
            mt={1}
          >

            {t("resumeBuilder.subtitle")}

          </Typography>

        </Box>


        {/* Form */}

        <Paper

          elevation={3}

          sx={{

            p: { xs: 3, md: 5 },

            borderRadius: 3,

          }}

        >

          <Box
            component="form"
            onSubmit={handleSubmit}
          >


            {/* Personal Information */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.personalInformation")}

            </Typography>


            <Grid container spacing={2.5}>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.fullName")}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.fullNamePlaceholder")}
                  required
                />

              </Grid>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.email")}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.emailPlaceholder")}
                  required
                />

              </Grid>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.phone")}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.phonePlaceholder")}
                />

              </Grid>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.location")}
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.locationPlaceholder")}
                />

              </Grid>


            </Grid>


            <Divider sx={{ my: 4 }} />


            {/* Education */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.education")}

            </Typography>


            <Grid container spacing={2.5}>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.qualification")}
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.qualificationPlaceholder")}
                />

              </Grid>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.college")}
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.collegePlaceholder")}
                />

              </Grid>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.graduationYear")}
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.graduationYearPlaceholder")}
                />

              </Grid>


            </Grid>


            <Divider sx={{ my: 4 }} />


            {/* Experience */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.experience")}

            </Typography>


            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("resumeBuilder.experience")}
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder={t("resumeBuilder.experiencePlaceholder")}
            />


            <Divider sx={{ my: 4 }} />


            {/* Skills */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.skills")}

            </Typography>


            <TextField
              fullWidth
              multiline
              rows={3}
              label={t("resumeBuilder.skills")}
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder={t("resumeBuilder.skillsPlaceholder")}
            />


            <Divider sx={{ my: 4 }} />


            {/* Projects */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.projects")}

            </Typography>


            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("resumeBuilder.projects")}
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              placeholder={t("resumeBuilder.projectsPlaceholder")}
            />


            <Divider sx={{ my: 4 }} />


            {/* Achievements */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.achievements")}

            </Typography>


            <TextField
              fullWidth
              multiline
              rows={3}
              label={t("resumeBuilder.achievements")}
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder={t("resumeBuilder.achievementsPlaceholder")}
            />


            <Divider sx={{ my: 4 }} />


            {/* Social Profiles */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.socialProfiles")}

            </Typography>


            <Grid container spacing={2.5}>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.linkedin")}
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.linkedinPlaceholder")}
                />

              </Grid>


              <Grid item xs={12} md={6}>

                <TextField
                  fullWidth
                  label={t("resumeBuilder.github")}
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder={t("resumeBuilder.githubPlaceholder")}
                />

              </Grid>


            </Grid>


            <Divider sx={{ my: 4 }} />


            {/* Profile Photo */}

            <Typography
              variant="h6"
              fontWeight={600}
              mb={2}
            >

              {t("resumeBuilder.profilePhoto")}

            </Typography>


            <Button
              variant="outlined"
              component="label"
              sx={{
                py: 1.3,
                px: 3,
                textTransform: "none",
              }}
            >

              {t("resumeBuilder.uploadPhoto")}


              <input
                hidden
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />

            </Button>


            {formData.photo && (

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
              >

                {t("resumeBuilder.selected")}:{" "}

                {formData.photo.name}

              </Typography>

            )}


            {/* Submit */}

            <Box mt={5}>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: "16px",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >

                {t("resumeBuilder.continuePreview")}

              </Button>

            </Box>


          </Box>

        </Paper>

      </Container>

    </Box>

  );

};


export default ResumeBuilder;

