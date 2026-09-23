import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Stack,
  Chip,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { getMyResume } from "../services/resumeService";
import { checkPremium } from "../services/premiumService";
import { sendResumeOTP, verifyResumeOTP } from "../services/resumeOtpService";
import { createResumeOrder, verifyResumePayment } from "../services/paymentService";

import { useNavigate } from "react-router-dom";

const ResumePreview = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "info",
});

const [otpModal, setOtpModal] = useState(false);
const [otp, setOtp] = useState("");
const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  // ==========================================
  // CHECK PREMIUM STATUS
  // ==========================================

  const verifyPremium = async () => {
    try {
      const data = await checkPremium();

      console.log("Premium status:", data);

      setIsPremium(data.isPremium);
    } catch (error) {
      console.error(
        "Premium check error:",
        error.response?.data || error.message
      );

      setIsPremium(false);
    }
  };

  // ==========================================
  // FETCH RESUME
  // ==========================================

  const fetchResume = async () => {
    try {
      const data = await getMyResume();

      console.log("Resume:", data);

      setResume(data.resume);
    } catch (error) {
      console.error(
        "Fetch resume error:",
        error.response?.data || error.message
      );

      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Unable to load resume",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const resumeElement = 
      document.getElementById("resume-content");

      if (!resumeElement) {
        setSnackbar({
           open: true,
        message: "Resume content not found",
        severity: "error",
        });
        return;
      }

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pdfHeight;
      }

      const fileName = resume.fullName
        ? `${resume.fullName.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";
      pdf.save(fileName);

    } catch (error) {
      console.error("PDF generation error:", error);
      setSnackbar({
        open: true,
        message: "Failed to generate PDF",
        severity: "error",
      });
    }
  }

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

   const downloadPDF = async () => {
    if (isPremium){
      await generatePDF();
      return;
    }

    try {
      setOtpLoading(true);
      console.log("Sending OTP to email:", resume.email);
      
      const response = await sendResumeOTP(resume.email);
      console.log("OTP sent response:", response);

      if(response.success) {
        setOtpModal(true);

        setSnackbar({
          open: true,
          message: "OTP sent to your email. Please check your inbox.",
          severity: "info",
        });
      }

    } catch (error) {
      console.error("Send OTP error:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: "Failed to send OTP",
        severity: "error",
      });
    }
    finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if(!otp || otp.length !== 6){
      setSnackbar({
        open: true,
        message: "Please enter a valid 6-digit OTP",
        severity: "warning",
      });
      return;
    }

    try {
      setOtpLoading(true);

      const response = await verifyResumeOTP(
        resume.email,
        otp
      );

      console.log("OTP verification:", response);

      if(response.success) {
        setOtpModal(false);
        setOtp("");

        setSnackbar({
          open: true,
          message: "OTP verified successfully. Opening payment...",
          severity: "success",
        });

        await handlePayment();
      }

    } catch (error) {
      console.error(
        "OTP verification error:",
        error.response?.data || error.message
      );

      setSnackbar({
        open: true,
        message: error.response?.data?.message ||
         "Invalid OTP",
        severity: "error",
  });
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePayment = async () => {
  try {
    setOtpLoading(true);

    console.log("========== PAYMENT START ==========");

    console.log("1. Creating Razorpay order...");

    const orderData = await createResumeOrder();

    console.log("2. Order response:", orderData);

    if (!orderData.success) {
      throw new Error(
        orderData.message || "Unable to create payment order"
      );
    }

    console.log("3. Razorpay key:", orderData.key);
    console.log("4. Razorpay order:", orderData.order);

    console.log("5. Razorpay SDK:", window.Razorpay);

    if (!window.Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    const options = {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Internshala Clone",
      description: "Resume Premium - ₹50",
      order_id: orderData.order.id,

      handler: async function (response) {
        console.log("6. PAYMENT SUCCESS:", response);

        try {
          const verifyResponse = await verifyResumePayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          console.log("7. Payment verification:", verifyResponse);

          if (verifyResponse.success) {
            setIsPremium(true);

            setSnackbar({
              open: true,
              message: "Payment successful! Resume is now premium.",
              severity: "success",
            });

            await generatePDF();
          }
        } catch (error) {
          console.error(
            "Payment verification error:",
            error.response?.data || error.message
          );
        }
      },

      prefill: {
        name: resume.fullName,
        email: resume.email,
        contact: resume.phone,
      },

      theme: {
        color: "#2563eb",
      },

      modal: {
        ondismiss: function () {
          console.log("Razorpay modal closed");

          setSnackbar({
            open: true,
            message: "Payment cancelled",
            severity: "warning",
          });
        },
      },
    };

    console.log("8. Razorpay options:", options);

    const razorpay = new window.Razorpay(options);

    console.log("9. Razorpay instance created");

    razorpay.on("payment.failed", function (response) {
      console.error(
        "PAYMENT FAILED:",
        response.error
      );

      setSnackbar({
        open: true,
        message:
          response.error?.description ||
          "Payment failed",
        severity: "error",
      });
    });

    console.log("10. Opening Razorpay...");

    razorpay.open();

    console.log("11. razorpay.open() called");

  } catch (error) {
    console.error(
      "========== PAYMENT ERROR ==========",
      error.response?.data || error.message
    );

    setSnackbar({
      open: true,
      message:
        error.response?.data?.message ||
        error.message ||
        "Unable to start payment",
      severity: "error",
    });
  } finally {
    setOtpLoading(false);
  }
};

  

  // ==========================================
  // USE EFFECT
  // ==========================================

  useEffect(() => {
    fetchResume();
    verifyPremium();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ==========================================
  // RESUME NOT FOUND
  // ==========================================

  if (!resume) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
          }}
        >
          Resume not found
        </Typography>

        <Box
          sx={{
            textAlign: "center",
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={() =>
              navigate("/resume")
            }
          >
            Create Resume
          </Button>
        </Box>
      </Container>
    );
  }

  // ==========================================
  // SKILLS ARRAY
  // ==========================================

  const skillsArray = resume.skills
    ? resume.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#eef1f5",
        py: 5,
      }}
    >
      <Container maxWidth="md">

        {/* =====================================
            ACTION BUTTONS
        ====================================== */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          sx={{ mb: 3 }}
        >

          {/* Edit Resume */}

          <Button
            variant="outlined"
            onClick={() =>
              navigate("/resume")
            }
          >
            ← Edit Resume
          </Button>

          {/* Premium + Download */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            alignItems="center"
          >

            {/* Premium Status */}

            {isPremium ? (
              <Chip
                label="Premium Active"
                color="success"
                sx={{
                  fontWeight: 600,
                }}
              />
            ) : (
              <Chip
                label="₹50 Premium Required"
                color="warning"
                sx={{
                  fontWeight: 600,
                }}
              />
            )}

            {/* Download */}

            <Button
              variant="contained"
              onClick={downloadPDF}
            >
              Download PDF
            </Button>

          </Stack>
        </Stack>

        {/* =====================================
            RESUME PAPER
        ====================================== */}

        <Paper
          id="resume-content"
          elevation={5}
          sx={{
            backgroundColor: "#ffffff",
            p: {
              xs: 3,
              sm: 5,
              md: 7,
            },
          }}
        >

          {/* =====================================
              HEADER
          ====================================== */}

          <Box
            sx={{
              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "center",
                sm: "flex-start",
              },

              gap: 3,
            }}
          >

            {/* Profile Photo */}

            {resume.photo && (
              <Avatar
                src={resume.photo}
                alt={resume.fullName}
                sx={{
                  width: 110,
                  height: 110,
                }}
              />
            )}

            {/* Personal Information */}

            <Box
              sx={{
                flex: 1,

                textAlign: {
                  xs: "center",
                  sm: "left",
                },
              }}
            >

              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "28px",
                    sm: "36px",
                  },

                  color: "#1f2937",
                }}
              >
                {resume.fullName}
              </Typography>

              {/* Qualification */}

              {resume.qualification && (
                <Typography
                  variant="h6"
                  sx={{
                    mt: 0.5,
                    color: "#2563eb",
                    fontWeight: 600,
                  }}
                >
                  {resume.qualification}
                </Typography>
              )}

              {/* Contact */}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                {resume.email}

                {resume.phone &&
                  `  |  ${resume.phone}`}

                {resume.location &&
                  `  |  ${resume.location}`}
              </Typography>

              {/* Social Links */}

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mt: 1.5,

                  justifyContent: {
                    xs: "center",
                    sm: "flex-start",
                  },
                }}
              >

                {resume.linkedin && (
                  <Typography
                    component="a"
                    href={resume.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    LinkedIn
                  </Typography>
                )}

                {resume.github && (
                  <Typography
                    component="a"
                    href={resume.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#111827",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    GitHub
                  </Typography>
                )}

              </Stack>

            </Box>

          </Box>

          <Divider sx={{ my: 3 }} />

          {/* =====================================
              EDUCATION
          ====================================== */}

          {(resume.qualification ||
            resume.college ||
            resume.graduationYear) && (

            <Box sx={{ mb: 3 }}>

              <SectionTitle
                title="EDUCATION"
              />

              {resume.qualification && (
                <Typography
                  fontWeight={700}
                  sx={{
                    mt: 1,
                  }}
                >
                  {resume.qualification}
                </Typography>
              )}

              {resume.college && (
                <Typography>
                  {resume.college}
                </Typography>
              )}

              {resume.graduationYear && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Graduation Year:{" "}
                  {resume.graduationYear}
                </Typography>
              )}

            </Box>
          )}

          {/* =====================================
              EXPERIENCE
          ====================================== */}

          {resume.experience && (

            <Box sx={{ mb: 3 }}>

              <SectionTitle
                title="EXPERIENCE"
              />

              <Typography
                sx={{
                  mt: 1,
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                }}
              >
                {resume.experience}
              </Typography>

            </Box>
          )}

          {/* =====================================
              SKILLS
          ====================================== */}

          {skillsArray.length > 0 && (

            <Box sx={{ mb: 3 }}>

              <SectionTitle
                title="SKILLS"
              />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 1.5,
                }}
              >

                {skillsArray.map(
                  (skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                    />
                  )
                )}

              </Box>

            </Box>
          )}

          {/* =====================================
              PROJECTS
          ====================================== */}

          {resume.projects && (

            <Box sx={{ mb: 3 }}>

              <SectionTitle
                title="PROJECTS"
              />

              <Typography
                sx={{
                  mt: 1,
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                }}
              >
                {resume.projects}
              </Typography>

            </Box>
          )}

          {/* =====================================
              ACHIEVEMENTS
          ====================================== */}

          {resume.achievements && (

            <Box sx={{ mb: 3 }}>

              <SectionTitle
                title="ACHIEVEMENTS"
              />

              <Typography
                sx={{
                  mt: 1,
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                }}
              >
                {resume.achievements}
              </Typography>

            </Box>
          )}

          {/* =====================================
              FOOTER
          ====================================== */}

          <Divider
            sx={{
              mt: 4,
              mb: 2,
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              textAlign: "center",
            }}
          >
            Resume created using Internshala Clone
          </Typography>

          {otpModal && (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <Paper
      elevation={10}
      sx={{
        width: "90%",
        maxWidth: 420,
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        mb={1}
      >
        Verify Email
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mb={3}
      >
        OTP sent to {resume.email}
      </Typography>

      <input
        type="text"
        value={otp}
        maxLength={6}
        onChange={(e) =>
          setOtp(e.target.value.replace(/\D/g, ""))
        }
        placeholder="Enter 6 digit OTP"
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "20px",
          textAlign: "center",
          letterSpacing: "6px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxSizing: "border-box",
        }}
      />

      <Stack
        direction="row"
        spacing={2}
        mt={3}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setOtpModal(false);
            setOtp("");
          }}
        >
          Cancel
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerifyOTP}
          disabled={otpLoading}
        >
          {otpLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Verify & Download"
          )}
        </Button>
      </Stack>
    </Paper>
  </Box>
)}

        </Paper>

          <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
};

// ==========================================
// SECTION TITLE COMPONENT
// ==========================================

const SectionTitle = ({ title }) => {
  return (
    <Typography
      variant="h6"
      fontWeight={800}
      sx={{
        color: "#1f2937",
        borderBottom:
          "2px solid #2563eb",
        display: "inline-block",
        pb: 0.5,
      }}
    >
      {title}
    </Typography>
  );
};

export default ResumePreview;
