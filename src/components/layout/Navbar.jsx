// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// import {
//   AppBar,
//   Toolbar,
//   Box,
//   Button,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Avatar,
//   Typography,
//   Menu,
//   MenuItem,
//   Select,
//   FormControl,
// } from "@mui/material";

// import {
//   Search,
//   Menu as MenuIcon,
//   Globe,
//   ChevronDown,
// } from "lucide-react";

// import logo from "../../assets/logo.jpg";

// function Navbar() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [mobileMenu, setMobileMenu] = useState(false);
//   const [profileMenu, setProfileMenu] = useState(null);

//   // Language
//   const [language, setLanguage] = useState(
//     localStorage.getItem("language") || "English"
//   );

//   // Load logged-in user
//   useEffect(() => {
//     const userData = localStorage.getItem("user");

//     if (userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (error) {
//         console.error("User data error:", error);
//       }
//     }
//   }, []);

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setUser(null);
//     setProfileMenu(null);

//     navigate("/login");
//     window.location.reload();
//   };

//   // Language change
//   const handleLanguageChange = (event) => {
//     const selectedLanguage = event.target.value;

//     setLanguage(selectedLanguage);
//     localStorage.setItem("language", selectedLanguage);

//     /*
//       French OTP logic आपण next step मध्ये add करू.
//       आत्ता language save होत आहे.
//     */

//     if (selectedLanguage === "French") {
//       console.log("French selected - OTP verification required");
//     }
//   };

//   // Profile dropdown
//   const handleProfileClick = (event) => {
//     setProfileMenu(event.currentTarget);
//   };

//   const handleProfileClose = () => {
//     setProfileMenu(null);
//   };

//   return (
//     <>
//       <AppBar
//         position="sticky"
//         elevation={1}
//         sx={{
//           background: "#fff",
//           color: "#111",
//           zIndex: 1200,
//         }}
//       >
//         <Toolbar
//           sx={{
//             minHeight: "90px",
//             px: {
//               xs: 2,
//               md: 4,
//               lg: 8,
//             },
//             display: "flex",
//             justifyContent: "space-between",
//             gap: 3,
//           }}
//         >

//           {/* ================= LOGO ================= */}

//           <Link
//             to="/"
//             style={{
//               textDecoration: "none",
//               color: "inherit",
//               flexShrink: 0,
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <Box
//                 component="img"
//                 src={logo}
//                 alt="InternArea Logo"
//                 sx={{
//                   width: {
//                     xs: 50,
//                     md: 60,
//                     lg: 70,
//                   },
//                   height: {
//                     xs: 50,
//                     md: 60,
//                     lg: 70,
//                   },
//                   objectFit: "contain",
//                   borderRadius: 2,
//                 }}
//               />
//             </Box>
//           </Link>

//           {/* ================= DESKTOP MENU ================= */}

//           <Box
//             sx={{
//               display: {
//                 xs: "none",
//                 lg: "flex",
//               },
//               alignItems: "center",
//               gap: 3,
//               flex: 1,
//               justifyContent: "center",
//             }}
//           >

//             <Button
//               component={Link}
//               to="/internships"
//               sx={{
//                 fontSize: 17,
//                 fontWeight: "bold",
//                 color: "#374151",
//                 textTransform: "none",

//                 "&:hover": {
//                   color: "#00A5EC",
//                   background: "transparent",
//                 },
//               }}
//             >
//               Internships
//             </Button>

//             <Button
//               component={Link}
//               to="/jobs"
//               sx={{
//                 fontSize: 17,
//                 fontWeight: "bold",
//                 color: "#374151",
//                 textTransform: "none",

//                 "&:hover": {
//                   color: "#00A5EC",
//                   background: "transparent",
//                 },
//               }}
//             >
//               Jobs
//             </Button>

//             <Button
//               component={Link}
//               to="/Subscription"
//               sx={{
//                 fontSize: 17,
//                 fontWeight: "bold",
//                 color: "#374151",
//                 textTransform: "none",

//                 "&:hover": {
//                   color: "#00A5EC",
//                   background: "transparent",
//                 },
//               }}
//             >
//               💎 Plans
//             </Button>

//           </Box>

//           {/* ================= SEARCH ================= */}

//           <TextField
//             placeholder="Search internships..."
//             size="small"
//             sx={{
//               display: {
//                 xs: "none",
//                 lg: "flex",
//               },

//               width: 300,

//               background: "#f3f4f6",

//               borderRadius: 2,

//               "& fieldset": {
//                 border: "none",
//               },
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search size={20} />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {/* ================= LANGUAGE ================= */}

//           <FormControl
//             size="small"
//             sx={{
//               display: {
//                 xs: "none",
//                 md: "flex",
//               },
//               minWidth: 120,
//             }}
//           >
//             <Select
//               value={language}
//               onChange={handleLanguageChange}
//               displayEmpty
//               startAdornment={
//                 <Globe
//                   size={17}
//                   style={{
//                     marginRight: "7px",
//                   }}
//                 />
//               }
//               sx={{
//                 borderRadius: 2,
//                 fontWeight: 600,

//                 "& fieldset": {
//                   borderColor: "#ddd",
//                 },
//               }}
//             >
//               <MenuItem value="English">
//                 English
//               </MenuItem>

//               <MenuItem value="Spanish">
//                 Spanish
//               </MenuItem>

//               <MenuItem value="Hindi">
//                 Hindi
//               </MenuItem>

//               <MenuItem value="Portuguese">
//                 Portuguese
//               </MenuItem>

//               <MenuItem value="Chinese">
//                 Chinese
//               </MenuItem>

//               <MenuItem value="French">
//                 French
//               </MenuItem>
//             </Select>
//           </FormControl>

//           {/* ================= USER ================= */}

//           <Box
//             sx={{
//               display: {
//                 xs: "none",
//                 lg: "flex",
//               },
//               alignItems: "center",
//               gap: 2,
//               flexShrink: 0,
//             }}
//           >

//             {!user ? (
//               <>
//                 <Button
//                   component={Link}
//                   to="/login"
//                   variant="outlined"
//                   sx={{
//                     px: 3,
//                     py: 1.1,
//                     borderRadius: 2,

//                     borderColor: "#00A5EC",
//                     color: "#00A5EC",

//                     fontWeight: "bold",
//                     textTransform: "none",

//                     "&:hover": {
//                       background: "#00A5EC",
//                       color: "#fff",
//                     },
//                   }}
//                 >
//                   Login
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/adminlogin"
//                   variant="contained"
//                   sx={{
//                     px: 3,
//                     py: 1.1,
//                     borderRadius: 2,

//                     background: "#111827",

//                     fontWeight: "bold",
//                     textTransform: "none",

//                     "&:hover": {
//                       background: "#000",
//                     },
//                   }}
//                 >
//                   Admin
//                 </Button>
//               </>
//             ) : (

//               <>
//                 {/* Profile */}

//                 <Box
//                   onClick={handleProfileClick}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,

//                     cursor: "pointer",

//                     px: 1.5,
//                     py: 0.8,

//                     borderRadius: 2,

//                     "&:hover": {
//                       background: "#f3f4f6",
//                     },
//                   }}
//                 >

//                   <Avatar
//                     src={user.profilePhoto}
//                     sx={{
//                       width: 42,
//                       height: 42,
//                     }}
//                   >
//                     {user.name?.charAt(0)?.toUpperCase()}
//                   </Avatar>

//                   <Typography
//                     fontWeight="bold"
//                     color="black"
//                     sx={{
//                       maxWidth: 110,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {user.name || "User"}
//                   </Typography>

//                   <ChevronDown size={17} />
//                 </Box>

//                 {/* Profile Menu */}

//                 <Menu
//                   anchorEl={profileMenu}
//                   open={Boolean(profileMenu)}
//                   onClose={handleProfileClose}
//                 >

//                   <MenuItem
//                     onClick={() => {
//                       handleProfileClose();

//                       if (user.role === "admin") {
//                         navigate("/admin");
//                       } else {
//                         navigate("/profile");
//                       }
//                     }}
//                   >
//                     👤 Profile
//                   </MenuItem>

//                   <MenuItem
//                     onClick={() => {
//                       handleProfileClose();
//                       navigate("/LoginHistory");
//                     }}
//                   >
//                     🔐 Login History
//                   </MenuItem>

//                   <MenuItem
//                     onClick={() => {
//                       handleProfileClose();
//                       navigate("/Publicspace");
//                     }}
//                   >
//                     🌐 Public Space
//                   </MenuItem>

//                   <MenuItem
//                     onClick={() => {
//                       handleProfileClose();
//                       navigate("/ResumeBuilder");
//                     }}
//                   >
//                     📄 Resume Builder
//                   </MenuItem>

//                   <MenuItem
//                     onClick={() => {
//                       handleProfileClose();
//                       navigate("/Subscription");
//                     }}
//                   >
//                     💎 Subscription
//                   </MenuItem>

//                   <MenuItem
//                     onClick={handleLogout}
//                     sx={{
//                       color: "red",
//                     }}
//                   >
//                     🚪 Logout
//                   </MenuItem>

//                 </Menu>
//               </>
//             )}

//           </Box>

//           {/* ================= MOBILE ================= */}

//           <IconButton
//             onClick={() => setMobileMenu(!mobileMenu)}
//             sx={{
//               display: {
//                 xs: "flex",
//                 lg: "none",
//               },
//             }}
//           >
//             <MenuIcon size={30} />
//           </IconButton>

//         </Toolbar>

//         {/* ================= MOBILE MENU ================= */}

//         {mobileMenu && (
//           <Box
//             sx={{
//               display: {
//                 xs: "block",
//                 lg: "none",
//               },

//               background: "#fff",

//               borderTop: "1px solid #eee",

//               px: 3,
//               py: 3,

//               boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//             }}
//           >

//             {/* Search */}

//             <TextField
//               fullWidth
//               placeholder="Search internships..."
//               size="small"
//               sx={{
//                 mb: 2,

//                 background: "#f3f4f6",

//                 borderRadius: 2,

//                 "& fieldset": {
//                   border: "none",
//                 },
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search size={20} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Language */}

//             <FormControl
//               fullWidth
//               size="small"
//               sx={{
//                 mb: 2,
//               }}
//             >
//               <Select
//                 value={language}
//                 onChange={handleLanguageChange}
//               >
//                 <MenuItem value="English">English</MenuItem>
//                 <MenuItem value="Spanish">Spanish</MenuItem>
//                 <MenuItem value="Hindi">Hindi</MenuItem>
//                 <MenuItem value="Portuguese">
//                   Portuguese
//                 </MenuItem>
//                 <MenuItem value="Chinese">Chinese</MenuItem>
//                 <MenuItem value="French">French</MenuItem>
//               </Select>
//             </FormControl>

//             {/* Links */}

//             <Button
//               fullWidth
//               component={Link}
//               to="/internships"
//               onClick={() => setMobileMenu(false)}
//               sx={{
//                 justifyContent: "flex-start",
//                 py: 1.5,
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: "#374151",
//                 textTransform: "none",
//               }}
//             >
//               Internships
//             </Button>

//             <Button
//               fullWidth
//               component={Link}
//               to="/jobs"
//               onClick={() => setMobileMenu(false)}
//               sx={{
//                 justifyContent: "flex-start",
//                 py: 1.5,
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: "#374151",
//                 textTransform: "none",
//               }}
//             >
//               Jobs
//             </Button>

//             <Button
//               fullWidth
//               component={Link}
//               to="/Subscription"
//               onClick={() => setMobileMenu(false)}
//               sx={{
//                 justifyContent: "flex-start",
//                 py: 1.5,
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: "#374151",
//                 textTransform: "none",
//               }}
//             >
//               💎 Plans
//             </Button>

//             {user ? (
//               <>
//                 <Button
//                   fullWidth
//                   onClick={() => {
//                     setMobileMenu(false);

//                     if (user.role === "admin") {
//                       navigate("/admin");
//                     } else {
//                       navigate("/profile");
//                     }
//                   }}
//                   sx={{
//                     justifyContent: "flex-start",
//                     py: 1.5,
//                     fontSize: 16,
//                     fontWeight: 600,
//                     color: "#374151",
//                     textTransform: "none",
//                   }}
//                 >
//                   👤 Profile
//                 </Button>

//                 <Button
//                   fullWidth
//                   onClick={() => {
//                     setMobileMenu(false);
//                     navigate("/LoginHistory");
//                   }}
//                   sx={{
//                     justifyContent: "flex-start",
//                     py: 1.5,
//                     fontSize: 16,
//                     color: "#374151",
//                     textTransform: "none",
//                   }}
//                 >
//                   🔐 Login History
//                 </Button>

//                 <Button
//                   fullWidth
//                   onClick={() => {
//                     setMobileMenu(false);
//                     navigate("/Publicspace");
//                   }}
//                   sx={{
//                     justifyContent: "flex-start",
//                     py: 1.5,
//                     fontSize: 16,
//                     color: "#374151",
//                     textTransform: "none",
//                   }}
//                 >
//                   🌐 Public Space
//                 </Button>

//                 <Button
//                   fullWidth
//                   onClick={handleLogout}
//                   sx={{
//                     justifyContent: "flex-start",
//                     py: 1.5,
//                     fontSize: 16,
//                     color: "red",
//                     textTransform: "none",
//                   }}
//                 >
//                   🚪 Logout
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button
//                   fullWidth
//                   component={Link}
//                   to="/login"
//                   onClick={() => setMobileMenu(false)}
//                   variant="contained"
//                   sx={{
//                     mt: 2,
//                     py: 1.3,
//                     borderRadius: 2,
//                     background: "#00A5EC",
//                     textTransform: "none",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Login
//                 </Button>

//                 <Button
//                   fullWidth
//                   component={Link}
//                   to="/adminlogin"
//                   onClick={() => setMobileMenu(false)}
//                   sx={{
//                     mt: 1,
//                     py: 1.3,
//                     borderRadius: 2,
//                     textTransform: "none",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Admin Login
//                 </Button>
//               </>
//             )}

//           </Box>
//         )}

//       </AppBar>
//     </>
//   );
// }

// export default Navbar;



import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";

import {
  Search,
  Menu as MenuIcon,
} from "lucide-react";

import logo from "../../assets/logo.jpg";

function Navbar() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

    window.location.reload();
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        background: "#fff",
        color: "#111",
      }}
    >
      <Toolbar
        sx={{
          height: 100,
          px: { xs: 2, lg: 8 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >

        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{
                width: 65,
                height: 65,
                borderRadius: 2,
              }}
            />
          </Box>
        </Link>


        {/* Menu */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            gap: 4,
          }}
        >

          {/* Internships */}
          <Button
            component={Link}
            to="/internships"
            sx={{
              fontSize: 17,
              fontWeight: "bold",
              color: "#374151",
              textTransform: "none",

              "&:hover": {
                color: "#00A5EC",
              },
            }}
          >
            {t("navbar.internships")}
          </Button>


          {/* Jobs */}
          <Button
            component={Link}
            to="/jobs"
            sx={{
              fontSize: 17,
              fontWeight: "bold",
              color: "#374151",
              textTransform: "none",

              "&:hover": {
                color: "#00A5EC",
              },
            }}
          >
            {t("navbar.jobs")}
          </Button>

          <Button
            component={Link}
            to="/subscriptions"
            sx={{
              fontSize: 17,
              fontWeight: "bold",
              color: "#374151",
              textTransform: "none",

              "&:hover": {
                color: "#00A5EC",
              },
            }}
          >
            {t("navbar.plans")}
          </Button>

        </Box>


        {/* Search */}
        <TextField
          placeholder={t("hero.searchPlaceholder")}
          sx={{
            display: { xs: "none", lg: "flex" },
            width: 340,
            background: "#f3f4f6",
            borderRadius: 2,

            "& fieldset": {
              border: "none",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />


        {/* Right Side */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            gap: 2,
            alignItems: "center",
          }}
        >

          {/* Language Selector */}
          <LanguageSelector />


          {/* Login / Profile */}
          {!user ? (

            /* Login */
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: 2,
                borderColor: "#00A5EC",
                color: "#00A5EC",
                fontWeight: "bold",
                textTransform: "none",

                "&:hover": {
                  borderColor: "#00A5EC",
                  background: "#f0faff",
                },
              }}
            >
              {t("navbar.login")}
            </Button>

          ) : (

            <>
              {/* Profile */}
              <Box
                onClick={() =>
                  navigate(
                    user.role === "admin"
                      ? "/admin"
                      : "/profile"
                  )
                }
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
              >

                <Avatar
                  src={user.profilePhoto}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                />

                <Typography
                  fontWeight="bold"
                  color="black"
                >
                  {user.name}
                </Typography>

              </Box>


              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  background: "#00A5EC",
                  fontWeight: "bold",
                  textTransform: "none",

                  "&:hover": {
                    background: "#008dcc",
                  },
                }}
              >
                {t("navbar.logout")}
              </Button>

            </>
          )}

        </Box>


        {/* Mobile Menu */}
        <IconButton
          sx={{
            display: { xs: "flex", lg: "none" },
          }}
        >
          <MenuIcon size={30} />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;




// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import LanguageSelector from "./LanguageSelector";

// import {
//   AppBar,
//   Toolbar,
//   Box,
//   Button,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Avatar,
//   Typography,
// } from "@mui/material";

// import {
//   Search,
//   Menu as MenuIcon,
// } from "lucide-react";

// import logo from "../../assets/logo.jpg";

// function Navbar() {

//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");

//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   const handleLogout = () => {

//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setUser(null);

//     navigate("/login");

//     window.location.reload();

//   };

//   return (

//     <AppBar
//       position="sticky"
//       elevation={1}
//       sx={{
//         background: "#fff",
//         color: "#111",
//       }}
//     >

//       <Toolbar
//         sx={{
//           height: 100,
//           px: {
//             xs: 2,
//             lg: 8,
//           },
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >

//         {/* Logo */}

//         <Link
//           to="/"
//           style={{
//             textDecoration: "none",
//             color: "inherit",
//           }}
//         >

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//             }}
//           >

//             <Box
//               component="img"
//               src={logo}
//               alt="logo"
//               sx={{
//                 width: 65,
//                 height: 65,
//                 borderRadius: 2,
//               }}
//             />

//           </Box>

//         </Link>

//         {/* Menu */}

//         <Box
//           sx={{
//             display: {
//               xs: "none",
//               lg: "flex",
//             },
//             gap: 4,
//           }}
//         >

//           {[
//             {
//               name: "Internships",
//               path: "/internships",
//             },
//             {
//               name: "Jobs",
//               path: "/jobs",
//             },
//           ].map((item) => (

//             <Button
//               key={item.name}
//               component={Link}
//               to={item.path}
//               sx={{
//                 fontSize: 17,
//                 fontWeight: "bold",
//                 color: "#374151",
//                 textTransform: "none",

//                 "&:hover": {
//                   color: "#00A5EC",
//                 },
//               }}
//             >
//               {item.name}
//             </Button>

//           ))}

//         </Box>

//         {/* Search */}

//         <TextField
//           placeholder="Search internships..."
//           sx={{
//             display: {
//               xs: "none",
//               lg: "flex",
//             },

//             width: 340,

//             background: "#f3f4f6",

//             borderRadius: 2,

//             "& fieldset": {
//               border: "none",
//             },
//           }}

//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Search size={20} />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <Box
//           sx={{
//             display: {
//               xs: "none",
//               lg: "flex",
//             },
//             gap: 2,
//             alignItems: "center",
//           }}
//         >
//           {!user ? (
//             <Button
//               component={Link}
//               to="/login"
//               variant="outlined"
//               sx={{
//                 px: 4,
//                 py: 1.2,
//                 borderRadius: 2,
//                 borderColor: "#00A5EC",
//                 color: "#00A5EC",
//                 fontWeight: "bold",
//                 textTransform: "none",
//               }}
//             >
//               Login
//             </Button>
//           ) : (
//             <>
//               {/* Profile Icon + Name (Direct Route on Click) */}
//               <Box
//                 onClick={() =>
//                   navigate(
//                     user.role === "admin" ? "/admin" : "/profile"
//                   )
//                 }
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   cursor: "pointer",
//                 }}
//               >
//                 <Avatar
//                   src={user.profilePhoto}
//                   sx={{
//                     width: 40,
//                     height: 40,
//                   }}
//                 />

//                 <Typography
//                   fontWeight="bold"
//                   color="black"
//                 >
//                   {user.name}
//                 </Typography>
//               </Box>

//               {/* Directly showing Logout Button */}
//               <Button
//                 onClick={handleLogout}
//                 variant="contained"
//                 sx={{
//                   px: 3,
//                   py: 1.2,
//                   borderRadius: 2,
//                   background: "#00A5EC",
//                   fontWeight: "bold",
//                   textTransform: "none",
//                 }}
//               >
//                 Logout
//               </Button>
//             </>
//           )}
//         </Box>

//         {/* Mobile Menu */}

//         <IconButton
//           sx={{
//             display: {
//               xs: "flex",
//               lg: "none",
//             },
//           }}
//         >
//           <MenuIcon size={30} />
//         </IconButton>

//       </Toolbar>
//     </AppBar>
//   );
// }

// export default Navbar;