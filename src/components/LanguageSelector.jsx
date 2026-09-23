import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Box,
    Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import {
    sendFrenchOTP,
    verifyFrenchOTP,
} from "../services/frenchLanguageService";

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // LANGUAGE CHANGE
    // ==========================================

    const handleLanguageChange = async (event) => {
        const selectedLanguage = event.target.value;

        // ==========================================
        // FRENCH LANGUAGE
        // ==========================================

        if (selectedLanguage === "fr") {
            try {
                setLoading(true);
                setError("");
                setSuccess("");

                // Send OTP
                await sendFrenchOTP();

                // Open OTP dialog
                setShowOtp(true);

                setSuccess(
                    "A verification code has been sent to your registered email."
                );
            } catch (error) {
                console.error(
                    "French OTP Send Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to send OTP. Please try again."
                );
            } finally {
                setLoading(false);
            }

            return;
        }

        // ==========================================
        // OTHER LANGUAGES
        // ==========================================

        await i18n.changeLanguage(selectedLanguage);

        localStorage.setItem(
            "language",
            selectedLanguage
        );
    };


    // ==========================================
    // VERIFY FRENCH OTP
    // ==========================================

    const handleVerifyOTP = async () => {
        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await verifyFrenchOTP(otp);

            if (response.verified) {

                // Apply French language
                await i18n.changeLanguage("fr");

                // Save language
                localStorage.setItem(
                    "language",
                    "fr"
                );

                setSuccess(
                    "French language verified successfully."
                );

                // Close dialog
                setTimeout(() => {
                    setShowOtp(false);
                    setOtp("");
                    setSuccess("");
                }, 1000);
            }

        } catch (error) {
            console.error(
                "French OTP Verification Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Invalid OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // CLOSE OTP DIALOG
    // ==========================================

    const handleClose = () => {
        if (loading) return;

        setShowOtp(false);
        setOtp("");
        setError("");
        setSuccess("");
    };


    return (
        <>
            {/* ==========================================
                LANGUAGE SELECTOR
            ========================================== */}

            <select
                value={i18n.language}
                onChange={handleLanguageChange}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500"
            >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="hi">Hindi</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="fr">French</option>
            </select>


            {/* ==========================================
                MATERIAL UI OTP DIALOG
            ========================================== */}

            <Dialog
                open={showOtp}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow:
                            "0 20px 60px rgba(0, 0, 0, 0.18)",
                    },
                }}
            >

                {/* ==========================================
                    TOP HEADER
                ========================================== */}

                <Box
                    sx={{
                        px: 4,
                        py: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom:
                            "1px solid #eeeeee",
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >

                        {/* LOCK ICON */}

                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: "12px",
                                backgroundColor: "#EEF4FF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <LockOutlinedIcon
                                sx={{
                                    color: "#2563EB",
                                    fontSize: 25,
                                }}
                            />
                        </Box>


                        <Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "#111827",
                                    lineHeight: 1.3,
                                }}
                            >
                                Verify Your Email
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#6B7280",
                                    mt: 0.3,
                                }}
                            >
                                French language verification
                            </Typography>

                        </Box>

                    </Box>


                    {/* CLOSE BUTTON */}

                    <IconButton
                        onClick={handleClose}
                        disabled={loading}
                        sx={{
                            color: "#6B7280",
                            "&:hover": {
                                backgroundColor: "#F3F4F6",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                </Box>


                {/* ==========================================
                    CONTENT
                ========================================== */}

                <DialogContent
                    sx={{
                        px: { xs: 3, sm: 5 },
                        py: 5,
                    }}
                >

                    {/* EMAIL ICON */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >

                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                backgroundColor: "#F5F8FF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <EmailOutlinedIcon
                                sx={{
                                    fontSize: 34,
                                    color: "#2563EB",
                                }}
                            />
                        </Box>

                    </Box>


                    {/* TITLE */}

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            color: "#111827",
                            mb: 1.5,
                        }}
                    >
                        Enter Verification Code
                    </Typography>


                    {/* DESCRIPTION */}

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            color: "#6B7280",
                            lineHeight: 1.7,
                            maxWidth: 420,
                            mx: "auto",
                            mb: 4,
                        }}
                    >
                        We've sent a 6-digit verification code
                        to your registered email address.
                        Enter the code below to continue.
                    </Typography>


                    {/* SUCCESS MESSAGE */}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: "10px",
                            }}
                        >
                            {success}
                        </Alert>
                    )}


                    {/* ERROR MESSAGE */}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: "10px",
                            }}
                        >
                            {error}
                        </Alert>
                    )}


                    {/* ==========================================
                        OTP INPUT
                    ========================================== */}

                    <TextField
                        fullWidth
                        label="Enter 6-digit OTP"
                        placeholder="000000"
                        value={otp}
                        autoFocus
                        disabled={loading}
                        inputProps={{
                            maxLength: 6,
                            inputMode: "numeric",
                        }}
                        onChange={(e) => {
                            const value =
                                e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);

                            setOtp(value);
                            setError("");
                        }}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                otp.length === 6 &&
                                !loading
                            ) {
                                handleVerifyOTP();
                            }
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "#FAFAFA",
                            },

                            "& input": {
                                textAlign: "center",
                                fontSize: "24px",
                                fontWeight: 700,
                                letterSpacing: "10px",
                                padding: "16px",
                            },
                        }}
                    />


                    {/* OTP EXPIRY */}

                    <Typography
                        variant="caption"
                        align="center"
                        display="block"
                        sx={{
                            color: "#9CA3AF",
                            mt: 1.5,
                        }}
                    >
                        This OTP is valid for 5 minutes.
                    </Typography>


                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />


                    {/* ==========================================
                        BUTTONS
                    ========================================== */}

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexDirection: {
                                xs: "column-reverse",
                                sm: "row",
                            },
                        }}
                    >

                        {/* CANCEL */}

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleClose}
                            disabled={loading}
                            sx={{
                                height: 48,
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "#D1D5DB",
                                color: "#374151",

                                "&:hover": {
                                    borderColor: "#9CA3AF",
                                    backgroundColor: "#F9FAFB",
                                },
                            }}
                        >
                            Cancel
                        </Button>


                        {/* VERIFY */}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleVerifyOTP}
                            disabled={
                                loading ||
                                otp.length !== 6
                            }
                            sx={{
                                height: 48,
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: 600,
                                backgroundColor: "#2563EB",

                                "&:hover": {
                                    backgroundColor: "#1D4ED8",
                                },

                                "&.Mui-disabled": {
                                    backgroundColor: "#BFDBFE",
                                    color: "#FFFFFF",
                                },
                            }}
                        >

                            {loading ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            color: "white",
                                        }}
                                    />

                                    Verifying...
                                </Box>
                            ) : (
                                "Verify & Continue"
                            )}

                        </Button>

                    </Box>


                    {/* SECURITY TEXT */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 0.7,
                            mt: 3,
                        }}
                    >

                        <LockOutlinedIcon
                            sx={{
                                fontSize: 15,
                                color: "#9CA3AF",
                            }}
                        />

                        <Typography
                            variant="caption"
                            sx={{
                                color: "#9CA3AF",
                            }}
                        >
                            Secure email verification
                        </Typography>

                    </Box>

                </DialogContent>

            </Dialog>
        </>
    );
};

export default LanguageSelector;