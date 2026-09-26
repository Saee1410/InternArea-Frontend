import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock
} from "@mui/icons-material";

import { FaGoogle } from "react-icons/fa";

import logo2 from "../assets/logo2.jpg";

import { useTranslation } from "react-i18next";


function Register() {

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });


  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setSuccess("");
  };


  // ===============================
  // REGISTER
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Basic validation

    if (!formData.name.trim()) {
      setError(t("register.nameRequired"));
      return;
    }

    if (!formData.email.trim()) {
      setError(t("register.emailRequired"));
      return;
    }

    if (!formData.password) {
      setError(t("register.passwordRequired"));
      return;
    }


    try {

      setLoading(true);


      const res = await axios.post(
        "http://localhost:8000/api/auth/register",
        formData
      );


      setSuccess(
        res.data.message || t("register.success")
      );


      // Clear form

      setFormData({
        name: "",
        email: "",
        password: ""
      });


      // Go to login after successful registration

      setTimeout(() => {
        navigate("/login");
      }, 1200);


    } catch (error) {

      setError(
        error.response?.data?.message ||
        t("register.failed")
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        backgroundImage: `linear-gradient(
          rgba(255,255,255,0.85),
          rgba(255,255,255,0.85)
        ),url(${logo2})`,

        backgroundSize: "cover",
        backgroundPosition: "center",

        p: 3
      }}
    >

      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 450,

          p: 5,

          borderRadius: 5,

          backdropFilter: "blur(10px)",

          background: "rgba(255,255,255,0.9)"
        }}
      >

        {/* ===============================
            TITLE
        =============================== */}

        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="#008BDC"
        >
          {t("register.title")}
        </Typography>


        <Typography
          textAlign="center"
          color="gray"
          mt={1}
          mb={4}
        >
          {t("register.subtitle")}
        </Typography>


        {/* ===============================
            ERROR
        =============================== */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}


        {/* ===============================
            SUCCESS
        =============================== */}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}


        {/* ===============================
            REGISTER FORM
        =============================== */}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <TextField
            fullWidth
            label={t("register.name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              )
            }}
          />


          {/* EMAIL */}

          <TextField
            fullWidth
            label={t("register.email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              )
            }}
          />


          {/* PASSWORD */}

          <TextField
            fullWidth
            label={t("register.password")}
            name="password"

            type={
              showPassword
                ? "text"
                : "password"
            }

            value={formData.password}
            onChange={handleChange}
            margin="normal"

            InputProps={{

              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),


              endAdornment: (
                <InputAdornment position="end">

                  <IconButton
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }

                    edge="end"
                  >

                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}

                  </IconButton>

                </InputAdornment>
              )

            }}
          />


          {/* REGISTER BUTTON */}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}

            sx={{
              mt: 3,
              height: 55,
              borderRadius: 3,
              fontSize: 18,
              background: "#008BDC",

              "&:hover": {
                background: "#0074b8"
              }
            }}
          >

            {loading
              ? t("register.creating")
              : t("register.button")
            }

          </Button>

        </Box>


        {/* ===============================
            OR
        =============================== */}

        <Box
          display="flex"
          alignItems="center"
          my={4}
        >

          <Box
            flex={1}
            borderBottom="1px solid #ddd"
          />

          <Typography
            mx={2}
            color="gray"
          >
            {t("register.or")}
          </Typography>

          <Box
            flex={1}
            borderBottom="1px solid #ddd"
          />

        </Box>


        {/* ===============================
            GOOGLE BUTTON
        =============================== */}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<FaGoogle />}

          sx={{
            height: 55,
            borderRadius: 3
          }}
        >
          {t("register.google")}
        </Button>


        {/* ===============================
            LOGIN LINK
        =============================== */}

        <Typography
          textAlign="center"
          mt={4}
          color="gray"
        >

          {t("register.alreadyAccount")}{" "}

          <Link
            to="/login"
            style={{
              color: "#008BDC",
              fontWeight: "bold",
              marginLeft: 5,
              textDecoration: "none"
            }}
          >
            {t("register.login")}
          </Link>

        </Typography>


      </Paper>

    </Box>

  );

}


export default Register;
