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
        "http://localhost:8000/api/auth/forgot-password",
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






// import { useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   InputAdornment,
//   Link,
//   Alert,
//   Snackbar
// } from "@mui/material";

// import {
//   Email,
//   LockReset
// } from "@mui/icons-material";

// import { useNavigate } from "react-router-dom";

// import { useTranslation } from "react-i18next";


// export const forgotPassword = async (req, res) => {
//     try {

//         // Frontend sends identifier
//         const { identifier } = req.body;

//         // ---------------------------------------------
//         // Validate identifier
//         // ---------------------------------------------

//         if (!identifier || !identifier.trim()) {

//             return res.status(400).json({
//                 message: "Email or phone is required",
//             });

//         }

//         const value = identifier.trim();

//         // ---------------------------------------------
//         // Check whether identifier is email or phone
//         // ---------------------------------------------

//         const isEmail = value.includes("@");

//         // ---------------------------------------------
//         // Find User
//         // ---------------------------------------------

//         const user = isEmail
//             ? await User.findOne({ email: value })
//             : await User.findOne({ phone: value });

//         if (!user) {

//             return res.status(404).json({
//                 message: "User not found",
//             });

//         }

//         // ---------------------------------------------
//         // Once Per Day Restriction
//         // ---------------------------------------------

//         const today = new Date();

//         today.setHours(
//             0,
//             0,
//             0,
//             0
//         );

//         if (
//             user.passwordResetAt &&
//             user.passwordResetAt >= today
//         ) {

//             return res.status(429).json({
//                 message:
//                     "Password can be reset only once per day",
//             });

//         }

//         // ---------------------------------------------
//         // Generate New Password
//         // ---------------------------------------------

//         const characters =
//             "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

//         let newPassword = "";

//         for (let i = 0; i < 10; i++) {

//             const randomIndex =
//                 Math.floor(
//                     Math.random() *
//                     characters.length
//                 );

//             newPassword +=
//                 characters[randomIndex];
//         }

//         // ---------------------------------------------
//         // Hash Password
//         // ---------------------------------------------

//         const hashedPassword =
//             await bcrypt.hash(
//                 newPassword,
//                 10
//             );

//         // ---------------------------------------------
//         // Send New Password Email
//         // ---------------------------------------------

//         const emailSent =
//             await sendForgotPasswordEmail(
//                 user.email,
//                 newPassword
//             );

//         if (!emailSent) {

//             return res.status(500).json({
//                 message:
//                     "Failed to send password email",
//             });

//         }

//         // ---------------------------------------------
//         // Update Password
//         // ---------------------------------------------

//         user.password =
//             hashedPassword;

//         user.passwordResetAt =
//             new Date();

//         user.passwordResetCount =
//             (user.passwordResetCount || 0) + 1;

//         await user.save();

//         // ---------------------------------------------
//         // Response
//         // ---------------------------------------------

//         return res.status(200).json({

//             message:
//                 "New password sent successfully",

//         });

//     } catch (error) {

//         console.error(
//             "Forgot Password Error:",
//             error
//         );

//         return res.status(500).json({

//             message:
//                 "Something went wrong",

//         });
//     }
// };



// // function ForgotPassword() {

// //   const navigate = useNavigate();

// //   const { t } = useTranslation();


// //   const [identifier, setIdendifier] = useState("");

// //   const [loading, setLoading] = useState(false);


// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success"
// //   });


//   const handleSnackbarClose = (event, reason) => {

//     if (reason === "clickaway") {
//       return;
//     }

//     setSnackbar({
//       ...snackbar,
//       open: false
//     });

//   };


//   const showSnackbar = (message, severity = "success") => {

//     setSnackbar({
//       open: true,
//       severity,
//       message
//     });

//   };


//   const handleSubmit = async (e) => {

//     e.preventDefault();


//     // Empty input validation
//     if (!identifier.trim()) {

//       showSnackbar(
//         t("forgotPassword.enterRegistered"),
//         "warning"
//       );

//       return;

//     }


//     try {

//       setLoading(true);


//       const response = await axios.post(
//         "http://localhost:8000/api/auth/forgot-password",
//         {
//           identifier: identifier.trim()
//         }
//       );


//       // Success Snackbar with styled password
//       setSnackbar({

//         open: true,

//         severity: "success",

//         message: (

//           <Box>

//             <Typography
//               component="span"
//               sx={{
//                 fontWeight: 500
//               }}
//             >

//               {response.data.message}{" "}

//               {t("forgotPassword.newPassword")}:{" "}

//             </Typography>


//             <Typography
//               component="span"
//               sx={{
//                 fontWeight: "900",
//                 color: "#a00e52",
//                 letterSpacing: "1px"
//               }}
//             >

//               {response.data.newPassword}

//             </Typography>

//           </Box>

//         )

//       });


//     }
//     catch (error) {

//       showSnackbar(

//         error.response?.data?.message ||

//         t("forgotPassword.somethingWrong"),

//         "error"

//       );

//     }
//     finally {

//       setLoading(false);

//     }

//   };


//   return (

//     <Box

//       sx={{

//         minHeight: "100vh",

//         display: "flex",

//         alignItems: "center",

//         justifyContent: "center",

//         background: "#f5f7fb",

//         p: 3

//       }}

//     >

//       <Paper

//         elevation={6}

//         sx={{

//           width: "100%",

//           maxWidth: 500,

//           p: 5,

//           borderRadius: 4

//         }}

//       >

//         <Box textAlign="center">

//           <LockReset

//             sx={{

//               fontSize: 60,

//               color: "primary.main",

//               mb: 1

//             }}

//           />


//           <Typography
//             variant="h4"
//             fontWeight="bold"
//           >

//             {t("forgotPassword.title")}

//           </Typography>


//           <Typography
//             color="text.secondary"
//             mt={1}
//           >

//             {t("forgotPassword.subtitle")}

//           </Typography>

//         </Box>


//         <Box

//           component="form"

//           onSubmit={handleSubmit}

//           sx={{

//             mt: 4,

//             display: "flex",

//             flexDirection: "column",

//             gap: 2

//           }}

//         >

//           <TextField

//             label={t("forgotPassword.emailOrPhone")}

//             value={identifier}

//             onChange={(e) =>
//               setIdendifier(e.target.value)
//             }

//             fullWidth

//             placeholder={t("forgotPassword.placeholder")}

//             InputProps={{

//               startAdornment: (

//                 <InputAdornment position="start">

//                   <Email color="primary" />

//                 </InputAdornment>

//               )

//             }}

//           />


//           <Button

//             type="submit"

//             variant="contained"

//             size="large"

//             disabled={loading}

//             sx={{

//               py: 1.5,

//               borderRadius: 2,

//               background: "#008BDC",

//               fontSize: 17,

//               "&:hover": {

//                 background: "#0077b8"

//               }

//             }}

//           >

//             {

//               loading

//                 ? t("forgotPassword.processing")

//                 : t("forgotPassword.resetPassword")

//             }

//           </Button>

//         </Box>


//         <Typography

//           textAlign="center"

//           mt={3}

//         >

//           <Link

//             component="button"

//             type="button"

//             onClick={() => navigate("/login")}

//             underline="hover"

//           >

//             {t("forgotPassword.backToLogin")}

//           </Link>

//         </Typography>

//       </Paper>


//       <Snackbar

//         open={snackbar.open}

//         autoHideDuration={4000}

//         onClose={handleSnackbarClose}

//         anchorOrigin={{

//           vertical: "top",

//           horizontal: "right"

//         }}

//       >

//         <Alert

//           onClose={handleSnackbarClose}

//           severity={snackbar.severity}

//           variant="filled"

//           sx={{

//             width: "100%"

//           }}

//         >

//           {snackbar.message}

//         </Alert>

//       </Snackbar>

//     </Box>

//   );

// }


// export default ForgotPassword;









// import {useState } from "react";
// import axios from "axios";

// import {
//     Box,
//     Paper,
//     Typography,
//     TextField,
//     Button,
//     InputAdornment,
//     Link,
//     Alert,
//     Snackbar
// } from "@mui/material";

// import {
//     Email,
//     LockReset
// } from "@mui/icons-material";

// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {
//     const navigate = useNavigate();

//     const [identifier, setIdendifier] = useState("");

//     const [loading,setLoading] = useState(false);

//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: "",
//         severity: "success"
//     });

//     const handleSnackbarClose = (event, reason) => {

//         if (reason === "clickaway") {
//             return;
//         }

//         setSnackbar({
//             ...snackbar,
//             open: false
//         });
//     };

//     const showSnackbar = (message, severity = "success") => {
//   setSnackbar({
//     open: true,
//     severity,
//     message
//   });
// };


// const handleSubmit = async (e) => {

//   e.preventDefault();


//   // Empty input validation
//   if (!identifier.trim()) {

//     showSnackbar(
//       "Please enter your registered email or phone number",
//       "warning"
//     );

//     return;
//   }


//   try {

//     setLoading(true);


//     const response = await axios.post(
//       "http://localhost:8000/api/auth/forgot-password",
//       {
//         identifier: identifier.trim()
//       }
//     );


//     // Success Snackbar with styled password
//     setSnackbar({
//       open: true,
//       severity: "success",

//       message: (
//         <Box>

//           <Typography
//             component="span"
//             sx={{
//               fontWeight: 500
//             }}
//           >
//             {response.data.message}{" "}
//             New Password:{" "}
//           </Typography>


//           <Typography
//             component="span"
//             sx={{
//               fontWeight: "900",
//               color: "#a00e52",
//               letterSpacing: "1px"
//             }}
//           >
//             {response.data.newPassword}
//           </Typography>

//         </Box>
//       )
//     });


//     // Clear input
//     //setIdentifier("");


//   } catch (error) {

//     showSnackbar(
//       error.response?.data?.message ||
//       "Something went wrong. Please try again.",
//       "error"
//     );

//   } finally {

//     setLoading(false);

//   }

// };

//     return (
//         <Box 
//         sx={{
//              minHeight: "100vh",
//              display: "flex",
//              alignItems: "center",
//              justifyContent: "center",
//              background: "#f5f7fb",
//              p: 3
//         }}
//         >
//             <Paper
//                 elevation={6}
//                 sx={{
//                     width: "100%",
//                     maxWidth: 500,
//                      p: 5,
//                      borderRadius: 4
//                 }}
//                 >
//                     <Box textAling="center">
//                         <LockReset
//                             sx={{
//                                 fontSize: 60,
//                                 color: "primary.main",
//                                 mb: 1
//                             }}
//                     />
//                     <Typography
//                         color="text.secondary"
//                         mt={1}
//                     >
//                         Enter your registered email or phone number .
//                     </Typography>
//                     </Box>

//                     <Box
//                         component="form"
//                         onSubmit={handleSubmit}
//                         sx={{
//                             mt: 4,
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 2
//                         }}
//                         >
//                             <TextField
//                                 label="Email or Phone Number"
//                                 value={identifier}
//                                 onChange={(e) =>
//                                     setIdendifier(e.target.value)
//                                 }                                
//                                 fullWidth
//                                 placeholder="Enter email or phone number"
//                                 InputProps={{
//                                     startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Email color="primary" />
//                                     </InputAdornment>
//                                     )
//                                 }}
//                             />
//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 size="large"
//                                 disabled={loading}
//                                 sx={{
//                                     py: 1.5,
//                                     borderRadius: 2,
//                                     background: "#008BDC",
//                                     fontSize: 17,

//                                     "&:hover": {
//                                         background: "#0077b8"
//                                     }
//                                 }}
//                                 >
//                                     {loading
//                                        ? "Processing..."
//                                        : "Reset Password"
//                                     }

//                                 </Button>
//                         </Box>

//                         <Typography
//                             textAling="center"
//                             mt={3}
//                             >
//                                 <Link
//                                    component="button"
//                                    type="button"
//                                    onClick={() => navigate("/login")}
//                                    underline="hover"
//                                    >
//                                       Back to Login
//                                    </Link>
//                             </Typography>
//                 </Paper>


//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "right"
//         }}
//       >

//         <Alert
//             onClose={handleSnackbarClose}
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{
//                 width: "100%"
//             }}
//             >
//             {snackbar.message}
//             </Alert>
//             </Snackbar>
//         </Box>
//     );
// }

// export default ForgotPassword;