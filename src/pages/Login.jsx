import { useState } from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";

import { GoogleLogin } from "@react-oauth/google";

import {
  useNavigate,
  Link as RouterLink,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import logo2 from "../assets/logo2.jpg";

function Login() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [remember, setRemember] = useState(false);

  const [loginType, setLoginType] = useState("student");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =====================================================
  // OTP STATES
  // =====================================================

  const [showOTP, setShowOTP] = useState(false);

  const [otp, setOtp] = useState("");

  const [otpUserId, setOtpUserId] = useState(null);

  const [otpEmail, setOtpEmail] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // SUCCESSFUL LOGIN
  // =====================================================

  const handleSuccessfulLogin = (user, token) => {
    if (!user || !token) {
      alert("Invalid login response");
      return;
    }

    console.log("LOGIN USER:", user);
    console.log("LOGIN ROLE:", user.role);

    // Save token
    localStorage.setItem("token", token);

    // Save user
    localStorage.setItem("user", JSON.stringify(user));

    // ---------------------------------------------
    // ADMIN
    // ---------------------------------------------

    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    // ---------------------------------------------
    // STUDENT
    // ---------------------------------------------

    navigate("/");
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async (response) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          credential: response.credential,
        }
      );

      console.log(
        "GOOGLE LOGIN RESPONSE:",
        res.data
      );

      // ---------------------------------------------
      // OTP REQUIRED
      // ---------------------------------------------

      if (res.data.requiresOTP) {
        setOtpUserId(res.data.userId);
        setOtpEmail(res.data.email);
        setOtp("");
        setShowOTP(true);

        return;
      }

      // ---------------------------------------------
      // NORMAL GOOGLE LOGIN
      // ---------------------------------------------

      const user = res.data.user;

      handleSuccessfulLogin(
        user,
        res.data.token
      );
    } catch (err) {
      console.error(
        "Google Login Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          t("login.googleLoginFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password
    ) {
      alert(
        "Please enter email and password"
      );

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      console.log(
        "LOGIN RESPONSE:",
        res.data
      );

      // =================================================
      // OTP REQUIRED
      // =================================================

      if (res.data.requiresOTP) {
        console.log(
          "OTP required for:",
          res.data.email
        );

        console.log(
          "Login Type:",
          loginType
        );

        console.log(
          "User ID:",
          res.data.userId
        );

        setOtpUserId(
          res.data.userId
        );

        setOtpEmail(
          res.data.email
        );

        setOtp("");

        setShowOTP(true);

        return;
      }

      // =================================================
      // NORMAL LOGIN WITHOUT OTP
      // =================================================

      const user = res.data.user;

      // ---------------------------------------------
      // LOGIN TYPE VALIDATION
      // ---------------------------------------------

      if (
        loginType === "admin" &&
        user.role !== "admin"
      ) {
        alert(
          "This account is not an admin account. Please select Student option."
        );

        return;
      }

      if (
        loginType === "student" &&
        user.role === "admin"
      ) {
        alert(
          "This is an admin account. Please select Admin option."
        );

        return;
      }

      // ---------------------------------------------
      // SUCCESSFUL LOGIN
      // ---------------------------------------------

      handleSuccessfulLogin(
        user,
        res.data.token
      );
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          t("login.loginFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY LOGIN OTP
  // =====================================================

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert(
        "Please enter a valid 6 digit OTP"
      );

      return;
    }

    if (!otpUserId) {
      alert(
        "Login session expired. Please login again."
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "VERIFYING OTP:",
        otp
      );

      console.log(
        "OTP USER ID:",
        otpUserId
      );

      const res = await axios.post(
        `${API_URL}/api/auth/verify-login-otp`,
        {
          userId: otpUserId,
          otp: otp.trim(),
        }
      );

      console.log(
        "OTP VERIFY RESPONSE:",
        res.data
      );

      const user = res.data.user;

      // =================================================
      // Backend gives actual user.role
      // =================================================

      handleSuccessfulLogin(
        user,
        res.data.token
      );
    } catch (error) {
      console.error(
        "OTP Verification Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OTP SCREEN
  // =====================================================

  if (showOTP) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.75),
              rgba(255,255,255,0.75)
            ),
            url(${logo2})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: {
              xs: 3,
              sm: 5,
            },
            backdropFilter: "blur(10px)",
          }}
        >
          <Box textAlign="center">
            <Box
              component="img"
              src={logo2}
              sx={{
                width: {
                  xs: 70,
                  sm: 90,
                },
                height: {
                  xs: 70,
                  sm: 90,
                },
                borderRadius: "50%",
                objectFit: "cover",
                mb: 2,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1.7rem",
                  sm: "2.125rem",
                },
              }}
            >
              Verify Login
            </Typography>

            <Typography
              color="text.secondary"
              mt={1}
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
              }}
            >
              OTP has been sent to
            </Typography>

            <Typography
              fontWeight="bold"
              mt={1}
              sx={{
                wordBreak: "break-word",
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
              }}
            >
              {otpEmail}
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Enter 6 Digit OTP"
              value={otp}
              onChange={(e) => {
                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setOtp(value);
              }}
              fullWidth
              inputProps={{
                maxLength: 6,
                inputMode: "numeric",
              }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={
                loading ||
                otp.length !== 6
              }
              onClick={
                handleVerifyOTP
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: "#008BDC",
                fontSize: {
                  xs: 16,
                  sm: 18,
                },
              }}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </Button>

            <Button
              variant="text"
              onClick={() => {
                setShowOTP(false);
                setOtp("");
                setOtpUserId(null);
                setOtpEmail("");
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `
          linear-gradient(
            rgba(255,255,255,0.75),
            rgba(255,255,255,0.75)
          ),
          url(${logo2})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: {
            xs: 3,
            sm: 5,
          },
          borderRadius: {
            xs: 3,
            sm: 5,
          },
          backdropFilter: "blur(10px)",
        }}
      >
        <Box textAlign="center">
          <Box
            component="img"
            src={logo2}
            sx={{
              width: {
                xs: 70,
                sm: 90,
              },
              height: {
                xs: 70,
                sm: 90,
              },
              borderRadius: "50%",
              objectFit: "cover",
              mb: 2,
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "2.125rem",
              },
            }}
          >
            {t("login.title")}
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
            }}
          >
            {t("login.subtitle")}
          </Typography>
        </Box>

        {/* Student / Admin Toggle */}

        <Tabs
          value={loginType}
          onChange={(e, value) =>
            setLoginType(value)
          }
          variant="fullWidth"
          sx={{
            mt: 4,
            background: "#f3f4f6",
            borderRadius: 2,

            "& .MuiTab-root": {
              minWidth: 0,
              fontSize: {
                xs: "0.8rem",
                sm: "0.875rem",
              },
            },
          }}
        >
          <Tab
            value="student"
            label={t("login.student")}
          />

          <Tab
            value="admin"
            label={t("login.admin")}
          />
        </Tabs>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            label={t("login.email")}
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            type="email"
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label={t("login.password")}
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={formData.password}
            onChange={handleChange}
            fullWidth
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),

              endAdornment: (
                <IconButton
                  edge="end"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: {
                xs: 1,
                sm: 0,
              },
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={() =>
                    setRemember(
                      !remember
                    )
                  }
                  size="small"
                />
              }
              label={
                t("login.rememberMe")
              }
              sx={{
                "& .MuiFormControlLabel-label":
                  {
                    fontSize: {
                      xs: "0.85rem",
                      sm: "0.875rem",
                    },
                  },
              }}
            />

            <Link
              component={RouterLink}
              to="/forgot"
              underline="hover"
              sx={{
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.875rem",
                },
              }}
            >
              {t(
                "login.forgotPassword"
              )}
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: "#008BDC",
              fontSize: {
                xs: 16,
                sm: 18,
              },
            }}
          >
            {loading
              ? t("login.loggingIn")
              : t("login.loginButton")}
          </Button>
        </Box>

        <Typography
          textAlign="center"
          my={3}
          color="text.secondary"
        >
          {t("login.or")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <GoogleLogin
            onSuccess={
              handleGoogleLogin
            }
            onError={() =>
              console.log(
                t(
                  "login.googleLoginFailed"
                )
              )
            }
          />
        </Box>

        <Typography
          textAlign="center"
          mt={3}
          sx={{
            fontSize: {
              xs: "0.85rem",
              sm: "1rem",
            },
          }}
        >
          {t("login.noAccount")}{" "}

          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
          >
            {t("login.register")}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;


// import { useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   InputAdornment,
//   IconButton,
//   Tabs,
//   Tab,
//   Checkbox,
//   FormControlLabel,
//   Link,
// } from "@mui/material";

// import {
//   Visibility,
//   VisibilityOff,
//   Email,
//   Lock,
// } from "@mui/icons-material";

// import { GoogleLogin } from "@react-oauth/google";

// import {
//   useNavigate,
//   Link as RouterLink,
// } from "react-router-dom";

// import { useTranslation } from "react-i18next";

// import logo2 from "../assets/logo2.jpg";

// function Login() {
//   const navigate = useNavigate();

//   const { t } = useTranslation();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [loading, setLoading] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);

//   const [remember, setRemember] = useState(false);

//   const [loginType, setLoginType] = useState("student");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   // =====================================================
//   // OTP STATES
//   // =====================================================

//   const [showOTP, setShowOTP] = useState(false);

//   const [otp, setOtp] = useState("");

//   const [otpUserId, setOtpUserId] = useState(null);

//   const [otpEmail, setOtpEmail] = useState("");


//   // =====================================================
//   // HANDLE INPUT CHANGE
//   // =====================================================

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };


//   // =====================================================
//   // SUCCESSFUL LOGIN
//   // =====================================================

//   const handleSuccessfulLogin = (user, token) => {

//     if (!user || !token) {
//       alert("Invalid login response");
//       return;
//     }

//     console.log("LOGIN USER:", user);

//     console.log("LOGIN ROLE:", user.role);


//     // Save token
//     localStorage.setItem(
//       "token",
//       token
//     );


//     // Save user
//     localStorage.setItem(
//       "user",
//       JSON.stringify(user)
//     );


//     // ---------------------------------------------
//     // ADMIN
//     // ---------------------------------------------

//     if (user.role === "admin") {

//       navigate("/admin/dashboard");

//       return;
//     }


//     // ---------------------------------------------
//     // STUDENT
//     // ---------------------------------------------

//     navigate("/");
//   };


//   // =====================================================
//   // GOOGLE LOGIN
//   // =====================================================

//   const handleGoogleLogin = async (response) => {

//     try {

//       setLoading(true);


//       const res = await axios.post(
//         `${API_URL}/api/auth/google`,
//         {
//           credential: response.credential,
//         }
//       );


//       console.log(
//         "GOOGLE LOGIN RESPONSE:",
//         res.data
//       );


//       // ---------------------------------------------
//       // OTP REQUIRED
//       // ---------------------------------------------

//       if (res.data.requiresOTP) {

//         setOtpUserId(
//           res.data.userId
//         );

//         setOtpEmail(
//           res.data.email
//         );

//         setOtp("");

//         setShowOTP(true);

//         return;
//       }


//       // ---------------------------------------------
//       // NORMAL GOOGLE LOGIN
//       // ---------------------------------------------

//       const user = res.data.user;


//       handleSuccessfulLogin(
//         user,
//         res.data.token
//       );

//     }

//     catch (err) {

//       console.error(
//         "Google Login Error:",
//         err
//       );


//       alert(
//         err.response?.data?.message ||
//         t("login.googleLoginFailed")
//       );

//     }

//     finally {

//       setLoading(false);

//     }
//   };


//   // =====================================================
//   // NORMAL LOGIN
//   // =====================================================

//   const handleSubmit = async (e) => {

//     e.preventDefault();


//     if (
//       !formData.email ||
//       !formData.password
//     ) {

//       alert(
//         "Please enter email and password"
//       );

//       return;
//     }


//     try {

//       setLoading(true);


//       const res = await axios.post(
//         `${API_URL}/api/auth/login`,
//         formData
//       );


//       console.log(
//         "LOGIN RESPONSE:",
//         res.data
//       );


//       // =================================================
//       // OTP REQUIRED
//       // =================================================

//       if (res.data.requiresOTP) {

//         console.log(
//           "OTP required for:",
//           res.data.email
//         );

//         console.log(
//           "Login Type:",
//           loginType
//         );

//         console.log(
//           "User ID:",
//           res.data.userId
//         );


//         setOtpUserId(
//           res.data.userId
//         );

//         setOtpEmail(
//           res.data.email
//         );

//         setOtp("");

//         setShowOTP(true);

//         return;
//       }


//       // =================================================
//       // NORMAL LOGIN WITHOUT OTP
//       // =================================================

//       const user = res.data.user;


//       // ---------------------------------------------
//       // LOGIN TYPE VALIDATION
//       //
//       // This is kept for normal login.
//       // ---------------------------------------------

//       if (
//         loginType === "admin" &&
//         user.role !== "admin"
//       ) {

//         alert(
//           "This account is not an admin account. Please select Student option."
//         );

//         return;
//       }


//       if (
//         loginType === "student" &&
//         user.role === "admin"
//       ) {

//         alert(
//           "This is an admin account. Please select Admin option."
//         );

//         return;
//       }


//       // ---------------------------------------------
//       // SUCCESSFUL LOGIN
//       // ---------------------------------------------

//       handleSuccessfulLogin(
//         user,
//         res.data.token
//       );

//     }

//     catch (error) {

//       console.error(
//         "Login Error:",
//         error
//       );


//       alert(
//         error.response?.data?.message ||
//         t("login.loginFailed")
//       );

//     }

//     finally {

//       setLoading(false);

//     }
//   };


//   // =====================================================
//   // VERIFY LOGIN OTP
//   // =====================================================

//   const handleVerifyOTP = async () => {

//     if (!otp || otp.length !== 6) {

//       alert(
//         "Please enter a valid 6 digit OTP"
//       );

//       return;
//     }


//     if (!otpUserId) {

//       alert(
//         "Login session expired. Please login again."
//       );

//       return;
//     }


//     try {

//       setLoading(true);


//       console.log(
//         "VERIFYING OTP:",
//         otp
//       );

//       console.log(
//         "OTP USER ID:",
//         otpUserId
//       );


//       const res = await axios.post(
//         `${API_URL}/api/auth/verify-login-otp`,
//         {
//           userId: otpUserId,
//           otp: otp.trim(),
//         }
//       );


//       console.log(
//         "OTP VERIFY RESPONSE:",
//         res.data
//       );


//       const user = res.data.user;


//       // =================================================
//       // IMPORTANT
//       //
//       // DO NOT CHECK loginType HERE.
//       //
//       // Backend gives actual user.role.
//       // =================================================

//       handleSuccessfulLogin(
//         user,
//         res.data.token
//       );

//     }

//     catch (error) {

//       console.error(
//         "OTP Verification Error:",
//         error
//       );


//       alert(
//         error.response?.data?.message ||
//         "Invalid OTP"
//       );

//     }

//     finally {

//       setLoading(false);

//     }
//   };


//   // =====================================================
//   // OTP SCREEN
//   // =====================================================

//   if (showOTP) {

//     return (

//       <Box
//         sx={{
//           minHeight: "100vh",

//           display: "flex",

//           alignItems: "center",

//           justifyContent: "center",

//           backgroundImage: `
//             linear-gradient(
//               rgba(255,255,255,0.75),
//               rgba(255,255,255,0.75)
//             ),
//             url(${logo2})
//           `,

//           backgroundSize: "cover",

//           backgroundPosition: "center",

//           p: 3,
//         }}
//       >

//         <Paper
//           elevation={8}
//           sx={{
//             width: "100%",

//             maxWidth: 520,

//             p: 5,

//             borderRadius: 5,

//             backdropFilter: "blur(10px)",
//           }}
//         >

//           <Box textAlign="center">

//             <Box
//               component="img"
//               src={logo2}
//               sx={{
//                 width: 90,

//                 height: 90,

//                 borderRadius: "50%",

//                 objectFit: "cover",

//                 mb: 2,
//               }}
//             />


//             <Typography
//               variant="h4"
//               fontWeight="bold"
//             >
//               Verify Login
//             </Typography>


//             <Typography
//               color="text.secondary"
//               mt={1}
//             >
//               OTP has been sent to
//             </Typography>


//             <Typography
//               fontWeight="bold"
//               mt={1}
//             >
//               {otpEmail}
//             </Typography>

//           </Box>


//           <Box
//             sx={{
//               mt: 4,

//               display: "flex",

//               flexDirection: "column",

//               gap: 3,
//             }}
//           >

//             <TextField
//               label="Enter 6 Digit OTP"

//               value={otp}

//               onChange={(e) => {

//                 const value =
//                   e.target.value.replace(
//                     /\D/g,
//                     ""
//                   );

//                 setOtp(value);
//               }}

//               fullWidth

//               inputProps={{
//                 maxLength: 6,
//               }}
//             />


//             <Button
//               variant="contained"

//               size="large"

//               disabled={
//                 loading ||
//                 otp.length !== 6
//               }

//               onClick={
//                 handleVerifyOTP
//               }

//               sx={{
//                 py: 1.5,

//                 borderRadius: 2,

//                 background: "#008BDC",

//                 fontSize: 18,
//               }}
//             >

//               {
//                 loading
//                   ? "Verifying..."
//                   : "Verify OTP"
//               }

//             </Button>


//             <Button
//               variant="text"

//               onClick={() => {

//                 setShowOTP(false);

//                 setOtp("");

//                 setOtpUserId(null);

//                 setOtpEmail("");

//               }}
//             >
//               Back to Login
//             </Button>

//           </Box>

//         </Paper>

//       </Box>
//     );
//   }


//   // =====================================================
//   // LOGIN PAGE
//   // =====================================================

//   return (

//     <Box
//       sx={{
//         minHeight: "100vh",

//         display: "flex",

//         alignItems: "center",

//         justifyContent: "center",

//         backgroundImage: `
//           linear-gradient(
//             rgba(255,255,255,0.75),
//             rgba(255,255,255,0.75)
//           ),
//           url(${logo2})
//         `,

//         backgroundSize: "cover",

//         backgroundPosition: "center",

//         p: 3,
//       }}
//     >

//       <Paper
//         elevation={8}
//         sx={{
//           width: "100%",

//           maxWidth: 520,

//           p: 5,

//           borderRadius: 5,

//           backdropFilter: "blur(10px)",
//         }}
//       >

//         <Box textAlign="center">

//           <Box
//             component="img"
//             src={logo2}
//             sx={{
//               width: 90,

//               height: 90,

//               borderRadius: "50%",

//               objectFit: "cover",

//               mb: 2,
//             }}
//           />


//           <Typography
//             variant="h4"
//             fontWeight="bold"
//           >
//             {t("login.title")}
//           </Typography>


//           <Typography
//             color="text.secondary"
//             mt={1}
//           >
//             {t("login.subtitle")}
//           </Typography>

//         </Box>


//         {/* Student / Admin Toggle */}

//         <Tabs
//           value={loginType}

//           onChange={(e, value) =>
//             setLoginType(value)
//           }

//           variant="fullWidth"

//           sx={{
//             mt: 4,

//             background: "#f3f4f6",

//             borderRadius: 2,
//           }}
//         >

//           <Tab
//             value="student"
//             label={t("login.student")}
//           />

//           <Tab
//             value="admin"
//             label={t("login.admin")}
//           />

//         </Tabs>


//         <Box
//           component="form"

//           onSubmit={handleSubmit}

//           sx={{
//             mt: 4,

//             display: "flex",

//             flexDirection: "column",

//             gap: 3,
//           }}
//         >

//           <TextField
//             label={t("login.email")}

//             name="email"

//             value={formData.email}

//             onChange={handleChange}

//             fullWidth

//             InputProps={{
//               startAdornment: (

//                 <InputAdornment position="start">

//                   <Email color="primary" />

//                 </InputAdornment>

//               ),
//             }}
//           />


//           <TextField
//             label={t("login.password")}

//             name="password"

//             type={
//               showPassword
//                 ? "text"
//                 : "password"
//             }

//             value={formData.password}

//             onChange={handleChange}

//             fullWidth

//             InputProps={{

//               startAdornment: (

//                 <InputAdornment position="start">

//                   <Lock color="primary" />

//                 </InputAdornment>

//               ),


//               endAdornment: (

//                 <IconButton
//                   onClick={() =>
//                     setShowPassword(
//                       !showPassword
//                     )
//                   }
//                 >

//                   {
//                     showPassword
//                       ? <VisibilityOff />
//                       : <Visibility />
//                   }

//                 </IconButton>

//               ),
//             }}
//           />


//           <Box
//             display="flex"

//             justifyContent="space-between"

//             alignItems="center"
//           >

//             <FormControlLabel

//               control={

//                 <Checkbox
//                   checked={remember}

//                   onChange={() =>
//                     setRemember(
//                       !remember
//                     )
//                   }
//                 />

//               }

//               label={
//                 t("login.rememberMe")
//               }

//             />


//             <Link
//               component={RouterLink}

//               to="/forgot"

//               underline="hover"
//             >
//               {
//                 t(
//                   "login.forgotPassword"
//                 )
//               }
//             </Link>

//           </Box>


//           <Button
//             type="submit"

//             variant="contained"

//             size="large"

//             disabled={loading}

//             sx={{
//               py: 1.5,

//               borderRadius: 2,

//               background: "#008BDC",

//               fontSize: 18,
//             }}
//           >

//             {
//               loading
//                 ? t("login.loggingIn")
//                 : t("login.loginButton")
//             }

//           </Button>

//         </Box>


//         <Typography
//           textAlign="center"

//           my={3}

//           color="text.secondary"
//         >
//           {t("login.or")}
//         </Typography>


//         <Box
//           display="flex"

//           justifyContent="center"
//         >

//           <GoogleLogin
//             onSuccess={
//               handleGoogleLogin
//             }

//             onError={() =>
//               console.log(
//                 t(
//                   "login.googleLoginFailed"
//                 )
//               )
//             }
//           />

//         </Box>


//         <Typography
//           textAlign="center"

//           mt={3}
//         >

//           {t("login.noAccount")}{" "}

//           <Link
//             component={RouterLink}

//             to="/register"

//             underline="hover"
//           >
//             {t("login.register")}
//           </Link>

//         </Typography>

//       </Paper>

//     </Box>
//   );
// }

// export default Login;
