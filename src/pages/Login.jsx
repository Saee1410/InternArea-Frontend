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
  Link
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from "@mui/icons-material";

import { GoogleLogin } from "@react-oauth/google";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import { useTranslation } from "react-i18next";

import logo2 from "../assets/logo2.jpg";


function Login() {

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [remember, setRemember] = useState(false);

  const [loginType, setLoginType] = useState("student");


  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpUserId, setOtpUserId] = useState(null);
  const [otpEmail, setOtpEmail] = useState("");




  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };


  const handleGoogleLogin = async (response) => {

    try {

      const res = await axios.post(
        "http://localhost:8000/api/auth/google",
        {
          credential: response.credential
        }
      );

      if (res.data.requiresOTP) {

        setOtpUserId(res.data.userId);
        setOtpEmail(res.data.email);
        setShowOTP(true);

        return;
      }

      const user = res.data.user;

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      if (user.role === "admin") {

        navigate("/admin/dashboard");

      } else {

        navigate("/");

      }

    }
    catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        t("login.googleLoginFailed")
      );

    }

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        formData
      );

      if (res.data.requiresOTP) {

        setOtpUserId(res.data.userId);
        setOtpEmail(res.data.email);
        setShowOTP(true);

        return;
      }

      const user = res.data.user;


      localStorage.setItem(
        "token",
        res.data.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      if (loginType === "admin" && user.role !== "admin") {

        alert(t("login.studentOption"));

        return;

      }


      if (loginType === "student" && user.role === "admin") {

        alert(t("login.adminOption"));

        return;

      }


      if (user.role === "admin") {

        navigate("/admin/dashboard");

      }
      else {

        navigate("/");

      }

    }

    catch (error) {

      alert(
        error.response?.data?.message ||
        t("login.loginFailed")
      );

    }

    finally {

      setLoading(false);

    }

  };


  const handleVerifyOTP = async () => {

    if (!otp) {

      alert(
        t("login.enterOTP") ||
        "Please enter OTP"
      );

      return;

    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-login-otp",
        {
          userId: otpUserId,
          otp: otp
        }
      );

      const user = res.data.user;

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      if (loginType === "admin" && user.role !== "admin") {

        alert(t("login.studentOption"));

        return;

      }


      if (loginType === "student" && user.role === "admin") {

        alert(t("login.adminOption"));

        return;

      }


      if (user.role === "admin") {

        navigate("/admin/dashboard");

      }
      else {

        navigate("/");

      }

    }
    catch (error) {

      alert(
        error.response?.data?.message ||
        "Invalid OTP"
      );

    }
    finally {

      setLoading(false);

    }

  };


  if (showOTP) {

    return (

      <Box

        sx={{

          minHeight: "100vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          backgroundImage: `linear-gradient(
            rgba(255,255,255,0.75),
            rgba(255,255,255,0.75)
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

            maxWidth: 520,

            p: 5,

            borderRadius: 5,

            backdropFilter: "blur(10px)"

          }}

        >


          <Box textAlign="center">


            <Box

              component="img"

              src={logo2}

              sx={{

                width: 90,

                height: 90,

                borderRadius: "50%",

                objectFit: "cover",

                mb: 2

              }}

            />


            <Typography

              variant="h4"

              fontWeight="bold"

            >

              Verify Login

            </Typography>


            <Typography

              color="text.secondary"

              mt={1}

            >

              OTP has been sent to

            </Typography>


            <Typography

              fontWeight="bold"

              mt={1}

            >

              {otpEmail}

            </Typography>


          </Box>


          <Box

            sx={{

              mt: 4,

              display: "flex",

              flexDirection: "column",

              gap: 3

            }}

          >


            <TextField

              label="Enter 6 Digit OTP"

              value={otp}

              onChange={(e) => {

                const value = e.target.value.replace(
                  /\D/g,
                  ""
                );

                setOtp(value);

              }}

              fullWidth

              inputProps={{

                maxLength: 6

              }}

            />


            <Button

              variant="contained"

              size="large"

              disabled={loading}

              onClick={handleVerifyOTP}

              sx={{

                py: 1.5,

                borderRadius: 2,

                background: "#008BDC",

                fontSize: 18

              }}

            >

              {

                loading

                  ?

                  "Verifying..."

                  :

                  "Verify OTP"

              }

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


  return (

    <Box

      sx={{

        minHeight: "100vh",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        backgroundImage: `linear-gradient(
          rgba(255,255,255,0.75),
          rgba(255,255,255,0.75)
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

          maxWidth: 520,

          p: 5,

          borderRadius: 5,

          backdropFilter: "blur(10px)"

        }}

      >


        <Box textAlign="center">


          <Box

            component="img"

            src={logo2}

            sx={{

              width: 90,

              height: 90,

              borderRadius: "50%",

              objectFit: "cover",

              mb: 2

            }}

          />


          <Typography

            variant="h4"

            fontWeight="bold"

          >

            {t("login.title")}

          </Typography>


          <Typography

            color="text.secondary"

            mt={1}

          >

            {t("login.subtitle")}

          </Typography>


        </Box>


        {/* Student Admin Toggle */}

        <Tabs

          value={loginType}

          onChange={(e, value) => setLoginType(value)}

          variant="fullWidth"

          sx={{

            mt: 4,

            background: "#f3f4f6",

            borderRadius: 2

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

            gap: 3

          }}

        >


          <TextField

            label={t("login.email")}

            name="email"

            value={formData.email}

            onChange={handleChange}

            fullWidth

            InputProps={{

              startAdornment: (

                <InputAdornment position="start">

                  <Email color="primary" />

                </InputAdornment>

              )

            }}

          />


          <TextField

            label={t("login.password")}

            name="password"

            type={showPassword ? "text" : "password"}

            value={formData.password}

            onChange={handleChange}

            fullWidth

            InputProps={{

              startAdornment: (

                <InputAdornment position="start">

                  <Lock color="primary" />

                </InputAdornment>

              ),

              endAdornment: (

                <IconButton

                  onClick={() => setShowPassword(!showPassword)}

                >

                  {

                    showPassword

                      ?

                      <VisibilityOff />

                      :

                      <Visibility />

                  }

                </IconButton>

              )

            }}

          />


          <Box

            display="flex"

            justifyContent="space-between"

            alignItems="center"

          >

            <FormControlLabel

              control={

                <Checkbox

                  checked={remember}

                  onChange={() => setRemember(!remember)}

                />

              }

              label={t("login.rememberMe")}

            />


            <Link
              component={RouterLink}
              to="/forgot"
              

              underline="hover"

            >

              {t("login.forgotPassword")}

            </Link>

          </Box>


          <Button

            type="submit"

            variant="contained"

            size="large"

            disabled={loading}

            sx={{

              py: 1.5,

              borderRadius: 2,

              background: "#008BDC",

              fontSize: 18

            }}

          >

            {

              loading

                ?

                t("login.loggingIn")

                :

                t("login.loginButton")

            }

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

          display="flex"

          justifyContent="center"

        >

          <GoogleLogin

            onSuccess={handleGoogleLogin}

            onError={() => console.log(t("login.googleLoginFailed"))}

          />

        </Box>


        <Typography

          textAlign="center"

          mt={3}

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
//   Link
// } from "@mui/material";

// import {
//   Visibility,
//   VisibilityOff,
//   Email,
//   Lock
// } from "@mui/icons-material";

// import { GoogleLogin } from "@react-oauth/google";

// import { useNavigate } from "react-router-dom";

// import { useTranslation } from "react-i18next";

// import logo2 from "../assets/logo2.jpg";


// function Login() {

//   const navigate = useNavigate();

//   const { t } = useTranslation();

//   const [loading, setLoading] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);

//   const [remember, setRemember] = useState(false);

//   const [loginType, setLoginType] = useState("student");


//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const [showOTP, setShowOTP] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpUserId, setOtpUserId] = useState(null);
//   const [otpEmail, setOtpEmail] = useState("");




//   const handleChange = (e) => {

//     setFormData({

//       ...formData,

//       [e.target.name]: e.target.value

//     });

//   };


//   const handleGoogleLogin = async (response) => {

//     try {

//       const res = await axios.post(
//         "http://localhost:8000/api/auth/google",
//         {
//           credential: response.credential
//         }
//       );

//       console.log(res.data);

//     }
//     catch (err) {

//       console.log(err);

//     }

//   };


//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:8000/api/auth/login",
//         formData
//       );

//       if (res.data.requiresOTP) {
//   setOtpUserId(res.data.userId);
//   setOtpEmail(res.data.email);
//   setShowOTP(true);
//   return;
// }

//       const user = res.data.user;


//       localStorage.setItem(
//         "token",
//         res.data.token
//       );


//       localStorage.setItem(
//         "user",
//         JSON.stringify(user)
//       );


//       if (loginType === "admin" && user.role !== "admin") {

//         alert(t("login.studentOption"));

//         return;

//       }


//       if (loginType === "student" && user.role === "admin") {

//         alert(t("login.adminOption"));

//         return;

//       }


//       if (user.role === "admin") {

//         navigate("/admin/dashboard");

//       }
//       else {

//         navigate("/");

//       }

//     }

//     catch (error) {

//       alert(
//         error.response?.data?.message ||
//         t("login.loginFailed")
//       );

//     }

//     finally {

//       setLoading(false);

//     }

//   };


//   const handleVerifyOTP = async () => {
//     if(!otp){
//       alert(t("login.enterOTP"));
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:8000/api/auth/verify-login-otp",
//         {
//           userId: otpUserId,
//           otp: otp
//         }
//       );

//       const user = res.data.user;

//       localStorage.setItem(
//         "token",
//         res.data.token
//       );

//       localStorage.setItem(
//         "user",
//         JSON.stringify(user)
//       );

//       if (loginType === "admin" && user.role !== "admin") {
//         alert(t("login.studentOption"));
//         return;
//       }

//       if (user.role === "admin") {
//         navigate("/admin/dashboard");

//       } else {
//         navigate("/");
//       }
//     } catch (error){
//       alert(
//         error.response?.data?.message ||
//         "Invalid OTP"
//       );
//     } finally {
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

//         backgroundImage: `linear-gradient(
//           rgba(255,255,255,0.75),
//           rgba(255,255,255,0.75)
//         ),url(${logo2})`,

//         backgroundSize: "cover",

//         backgroundPosition: "center",

//         p: 3

//       }}

//     >


//       <Paper

//         elevation={8}

//         sx={{

//           width: "100%",

//           maxWidth: 520,

//           p: 5,

//           borderRadius: 5,

//           backdropFilter: "blur(10px)"

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

//               mb: 2

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


//         {/* Student Admin Toggle */}

//         <Tabs

//           value={loginType}

//           onChange={(e, value) => setLoginType(value)}

//           variant="fullWidth"

//           sx={{

//             mt: 4,

//             background: "#f3f4f6",

//             borderRadius: 2

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

//             gap: 3

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

//               )

//             }}

//           />


//           <TextField

//             label={t("login.password")}

//             name="password"

//             type={showPassword ? "text" : "password"}

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

//                   onClick={() => setShowPassword(!showPassword)}

//                 >

//                   {

//                     showPassword

//                       ?

//                       <VisibilityOff />

//                       :

//                       <Visibility />

//                   }

//                 </IconButton>

//               )

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

//                   onChange={() => setRemember(!remember)}

//                 />

//               }

//               label={t("login.rememberMe")}

//             />


//             <Link

//               href="/forgot"

//               underline="hover"

//             >

//               {t("login.forgotPassword")}

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

//               fontSize: 18

//             }}

//           >

//             {

//               loading

//                 ?

//                 t("login.loggingIn")

//                 :

//                 t("login.loginButton")

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

//             onSuccess={handleGoogleLogin}

//             onError={() => console.log(t("login.googleLoginFailed"))}

//           />

//         </Box>


//         <Typography

//           textAlign="center"

//           mt={3}

//         >

//           {t("login.noAccount")}{" "}

//           <Link href="/register">

//             {t("login.register")}

//           </Link>

//         </Typography>


//       </Paper>

//     </Box>

//   );

// }


// export default Login;












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
//   Link
// } from "@mui/material";


// import {
//   Visibility,
//   VisibilityOff,
//   Email,
//   Lock
// } from "@mui/icons-material";


// import { GoogleLogin } from "@react-oauth/google";

// import { useNavigate } from "react-router-dom";


// import logo2 from "../assets/logo2.jpg";



// function Login() {


//   const navigate = useNavigate();


//   const [loading,setLoading] = useState(false);

//   const [showPassword,setShowPassword] = useState(false);

//   const [remember,setRemember] = useState(false);

//   const [loginType,setLoginType] = useState("student");



//   const [formData,setFormData] = useState({

//     email:"",
//     password:""

//   });




//   const handleChange=(e)=>{

//     setFormData({

//       ...formData,

//       [e.target.name]:e.target.value

//     });

//   };





//   const handleGoogleLogin = async(response)=>{

//     try{

//       const res = await axios.post(
//         "http://localhost:8000/api/auth/google",
//         {
//           credential:response.credential
//         }
//       );


//       console.log(res.data);


//     }
//     catch(err){

//       console.log(err);

//     }

//   };







//   const handleSubmit = async(e)=>{


//     e.preventDefault();


//     try{


//       setLoading(true);



//       const res = await axios.post(

//         "http://localhost:8000/api/auth/login",

//         formData

//       );



//       const user=res.data.user;



//       localStorage.setItem(
//         "token",
//         res.data.token
//       );



//       localStorage.setItem(
//         "user",
//         JSON.stringify(user)
//       );





//       if(loginType==="admin" && user.role!=="admin"){

//         alert("Please login using Student option");

//         return;

//       }




//       if(loginType==="student" && user.role==="admin"){

//         alert("Please login using Admin option");

//         return;

//       }




//       if(user.role==="admin"){

//         navigate("/admin/dashboard");

//       }
//       else{

//         navigate("/");

//       }



//     }

//     catch(error){

//       alert(
//         error.response?.data?.message ||
//         "Login Failed"
//       );

//     }

//     finally{

//       setLoading(false);

//     }



//   };







//   return (


//     <Box

//       sx={{

//         minHeight:"100vh",

//         display:"flex",

//         alignItems:"center",

//         justifyContent:"center",

//         backgroundImage:`linear-gradient(
//         rgba(255,255,255,0.75),
//         rgba(255,255,255,0.75)
//         ),url(${logo2})`,

//         backgroundSize:"cover",

//         backgroundPosition:"center",

//         p:3

//       }}

//     >





//       <Paper

//         elevation={8}

//         sx={{

//           width:"100%",

//           maxWidth:520,

//           p:5,

//           borderRadius:5,

//           backdropFilter:"blur(10px)"

//         }}

//       >





//         <Box textAlign="center">


//           <Box

//             component="img"

//             src={logo2}

//             sx={{

//               width:90,

//               height:90,

//               borderRadius:"50%",

//               objectFit:"cover",

//               mb:2

//             }}

//           />





//           <Typography

//             variant="h4"

//             fontWeight="bold"

//           >

//             Welcome Back

//           </Typography>



//           <Typography

//             color="text.secondary"

//             mt={1}

//           >

//             Login to continue

//           </Typography>




//         </Box>







//         {/* Student Admin Toggle */}



//         <Tabs

//           value={loginType}

//           onChange={(e,value)=>setLoginType(value)}

//           variant="fullWidth"

//           sx={{

//             mt:4,

//             background:"#f3f4f6",

//             borderRadius:2

//           }}

//         >


//           <Tab

//             value="student"

//             label="Student"

//           />


//           <Tab

//             value="admin"

//             label="Admin"

//           />


//         </Tabs>








//         <Box

//           component="form"

//           onSubmit={handleSubmit}

//           sx={{

//             mt:4,

//             display:"flex",

//             flexDirection:"column",

//             gap:3

//           }}

//         >





//           <TextField

//             label="Email"

//             name="email"

//             value={formData.email}

//             onChange={handleChange}

//             fullWidth

//             InputProps={{

//               startAdornment:(

//                 <InputAdornment position="start">

//                   <Email color="primary"/>

//                 </InputAdornment>

//               )

//             }}

//           />







//           <TextField

//             label="Password"

//             name="password"

//             type={showPassword?"text":"password"}

//             value={formData.password}

//             onChange={handleChange}

//             fullWidth


//             InputProps={

//               {

//                 startAdornment:(

//                   <InputAdornment position="start">

//                     <Lock color="primary"/>

//                   </InputAdornment>

//                 ),



//                 endAdornment:(

//                   <IconButton

//                     onClick={()=>setShowPassword(!showPassword)}

//                   >

//                     {
//                       showPassword
//                       ?
//                       <VisibilityOff/>
//                       :
//                       <Visibility/>
//                     }


//                   </IconButton>

//                 )

//               }

//             }

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

//                   onChange={()=>setRemember(!remember)}

//                 />

//               }

//               label="Remember Me"

//             />

//             <Link

//               href="/forgot"

//               underline="hover"
//             >
//               Forgot Password?

//             </Link>
//           </Box>
//           <Button

//             type="submit"

//             variant="contained"

//             size="large"

//             disabled={loading}

//             sx={{

//               py:1.5,

//               borderRadius:2,

//               background:"#008BDC",

//               fontSize:18

//             }}

//           >

//             {
//               loading
//               ?
//               "Logging In..."
//               :
//               "Login"
//             }


//           </Button>

//         </Box>


//         <Typography

//           textAlign="center"

//           my={3}

//           color="text.secondary"

//         >

//           OR

//         </Typography>

//         <Box

//           display="flex"

//           justifyContent="center"

//         >


//           <GoogleLogin

//             onSuccess={handleGoogleLogin}

//             onError={()=>console.log("Google Login Failed")}

//           />


//         </Box>

//         <Typography

//           textAlign="center"

//           mt={3}

//         >

//           Don't have an account?{" "}


//           <Link href="/register">

//             Register

//           </Link>


//         </Typography>

//       </Paper>

//     </Box>


//   );

// }


// export default Login;