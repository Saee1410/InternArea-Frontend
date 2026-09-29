import { useState } from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Link,
  Alert,
  Snackbar
} from "@mui/material";

import {
  Email,
  LockReset
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
   const API_URL = import.meta.env.VITE_API_URL;

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      severity,
      message
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      showSnackbar(
        t("forgotPassword.enterRegistered"),
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        {
          identifier: identifier.trim()
        }
      );

      // Backend password response मध्ये पाठवत नाही.
      // फक्त success message दाखवायचा.
      showSnackbar(
        response.data.message ||
          "New password has been sent to your registered email.",
        "success"
      );

      setIdentifier("");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message ||
          t("forgotPassword.somethingWrong"),
        "error"
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
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        p: 3
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 5,
          borderRadius: 4
        }}
      >
        <Box textAlign="center">
          <LockReset
            sx={{
              fontSize: 60,
              color: "primary.main",
              mb: 1
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {t("forgotPassword.title")}
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            {t("forgotPassword.subtitle")}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <TextField
            label={t("forgotPassword.emailOrPhone")}
            value={identifier}
            onChange={(e) =>
              setIdentifier(e.target.value)
            }
            fullWidth
            placeholder={t("forgotPassword.placeholder")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: "#008BDC",
              fontSize: 17,
              "&:hover": {
                background: "#0077b8"
              }
            }}
          >
            {loading
              ? t("forgotPassword.processing")
              : t("forgotPassword.resetPassword")}
          </Button>
        </Box>

        <Typography
          textAlign="center"
          mt={3}
        >
          <Link
            component="button"
            type="button"
            onClick={() => navigate("/login")}
            underline="hover"
          >
            {t("forgotPassword.backToLogin")}
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ForgotPassword;
