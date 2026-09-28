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
  Drawer,
  Divider,
} from "@mui/material";

import {
  Search,
  Menu as MenuIcon,
  X,
} from "lucide-react";

import logo from "../../assets/logo.jpg";

function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  // =====================================================
  // GET USER
  // =====================================================

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("User data error:", error);
        setUser(null);
      }
    }
  }, []);

  // =====================================================
  // CLOSE DRAWER
  // =====================================================

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  // =====================================================
  // MOBILE NAVIGATION
  // =====================================================

  const handleMobileNavigation = (path) => {
    setMobileMenu(false);

    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMobileMenu(false);

    navigate("/login");

    window.location.reload();
  };

  // =====================================================
  // MOBILE MENU ITEM
  // =====================================================

  const MobileMenuButton = ({
    children,
    onClick,
    danger = false,
  }) => {
    return (
      <Button
        fullWidth
        onClick={onClick}
        sx={{
          justifyContent: "flex-start",
          textAlign: "left",
          py: 1.6,
          px: 2,
          mb: 0.5,
          borderRadius: 2,
          fontSize: 16,
          fontWeight: 600,
          color: danger ? "#d32f2f" : "#374151",
          textTransform: "none",

          "&:hover": {
            background: danger ? "#fff5f5" : "#f0faff",
            color: danger ? "#d32f2f" : "#00A5EC",
          },

          "&:active": {
            background: "#e8f7ff",
          },
        }}
      >
        {children}
      </Button>
    );
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          background: "#fff",
          color: "#111",
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 75, lg: 100 },
            height: { lg: 100 },
            px: { xs: 2, sm: 3, lg: 8 },
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
            onClick={closeMobileMenu}
          >
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{
                width: { xs: 52, sm: 60, lg: 65 },
                height: { xs: 52, sm: 60, lg: 65 },
                borderRadius: 2,
                objectFit: "cover",
              }}
            />
          </Link>

          {/* =================================================
              DESKTOP MENU
          ================================================= */}

          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              gap: 4,
              alignItems: "center",
            }}
          >
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

          {/* =================================================
              DESKTOP SEARCH
          ================================================= */}

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

          {/* =================================================
              DESKTOP RIGHT SIDE
          ================================================= */}

          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <LanguageSelector />

            {!user ? (
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

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <IconButton
            onClick={() => setMobileMenu(true)}
            aria-label="Open mobile menu"
            sx={{
              display: { xs: "flex", lg: "none" },
              color: "#111",
              width: 48,
              height: 48,
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <MenuIcon size={30} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <Drawer
        anchor="right"
        open={mobileMenu}
        onClose={closeMobileMenu}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: {
              xs: "85%",
              sm: 360,
            },
            maxWidth: 380,
            background: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          },
        }}
      >
        {/* =================================================
            DRAWER HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{
                width: 45,
                height: 45,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />

            <Typography
              fontWeight={700}
              fontSize={18}
            >
              Intern Area
            </Typography>
          </Box>

          <IconButton
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
            sx={{
              color: "#111",
            }}
          >
            <X size={28} />
          </IconButton>
        </Box>

        <Divider />

        {/* =================================================
            DRAWER CONTENT
        ================================================= */}

        <Box
          sx={{
            p: 2,
            overflowY: "auto",
            flex: 1,
          }}
        >

          {/* SEARCH */}

          <TextField
            fullWidth
            placeholder={t("hero.searchPlaceholder")}
            size="small"
            sx={{
              mb: 2,
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

          {/* LANGUAGE */}

          <Box sx={{ mb: 2 }}>
            <LanguageSelector />
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          {/* =================================================
              PUBLIC LINKS
          ================================================= */}

          <MobileMenuButton
            onClick={() =>
              handleMobileNavigation("/internships")
            }
          >
            {t("navbar.internships")}
          </MobileMenuButton>

          <MobileMenuButton
            onClick={() =>
              handleMobileNavigation("/jobs")
            }
          >
            {t("navbar.jobs")}
          </MobileMenuButton>

          <MobileMenuButton
            onClick={() =>
              handleMobileNavigation("/subscriptions")
            }
          >
            {t("navbar.plans")}
          </MobileMenuButton>

          {/* =================================================
              LOGGED USER
          ================================================= */}

          {user ? (
            <>
              <Divider sx={{ my: 1.5 }} />

              {/* PROFILE */}

              <MobileMenuButton
                onClick={() => {
                  setMobileMenu(false);

                  setTimeout(() => {
                    navigate(
                      user.role === "admin"
                        ? "/admin"
                        : "/profile"
                    );
                  }, 100);
                }}
              >
                👤 {user.name || "Profile"}
              </MobileMenuButton>

              {/* LOGIN HISTORY */}

              <MobileMenuButton
                onClick={() =>
                  handleMobileNavigation("/LoginHistory")
                }
              >
                🔐 Login History
              </MobileMenuButton>

              {/* PUBLIC SPACE */}

              <MobileMenuButton
                onClick={() =>
                  handleMobileNavigation("/Publicspace")
                }
              >
                🌐 Public Space
              </MobileMenuButton>

              {/* RESUME BUILDER */}

              <MobileMenuButton
                onClick={() =>
                  handleMobileNavigation("/ResumeBuilder")
                }
              >
                📄 Resume Builder
              </MobileMenuButton>

              {/* SUBSCRIPTION */}

              <MobileMenuButton
                onClick={() =>
                  handleMobileNavigation("/subscriptions")
                }
              >
                💎 Subscription
              </MobileMenuButton>

              <Divider sx={{ my: 1.5 }} />

              {/* LOGOUT */}

              <MobileMenuButton
                danger
                onClick={handleLogout}
              >
                🚪 {t("navbar.logout")}
              </MobileMenuButton>
            </>
          ) : (
            <>
              <Divider sx={{ my: 1.5 }} />

              {/* LOGIN */}

              <Button
                fullWidth
                onClick={() =>
                  handleMobileNavigation("/login")
                }
                variant="contained"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: "#00A5EC",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: 16,

                  "&:hover": {
                    background: "#008dcc",
                  },
                }}
              >
                {t("navbar.login")}
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;


// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import LanguageSelector from "../LanguageSelector";

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
//   X,
// } from "lucide-react";

// import logo from "../../assets/logo.jpg";

// function Navbar() {
//   const navigate = useNavigate();

//   const { t } = useTranslation();

//   const [user, setUser] = useState(null);

//   // Mobile Menu
//   const [mobileMenu, setMobileMenu] = useState(false);

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

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     setUser(null);
//     setMobileMenu(false);

//     navigate("/login");

//     window.location.reload();
//   };

//   // Close mobile menu after navigation
//   const handleMobileNavigation = (path) => {
//     setMobileMenu(false);
//     navigate(path);
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
//           px: { xs: 2, lg: 8 },
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
//           onClick={() => setMobileMenu(false)}
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
//             display: { xs: "none", lg: "flex" },
//             gap: 4,
//           }}
//         >

//           {/* Internships */}
//           <Button
//             component={Link}
//             to="/internships"
//             sx={{
//               fontSize: 17,
//               fontWeight: "bold",
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//               },
//             }}
//           >
//             {t("navbar.internships")}
//           </Button>


//           {/* Jobs */}
//           <Button
//             component={Link}
//             to="/jobs"
//             sx={{
//               fontSize: 17,
//               fontWeight: "bold",
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//               },
//             }}
//           >
//             {t("navbar.jobs")}
//           </Button>


//           {/* Plans */}
//           <Button
//             component={Link}
//             to="/subscriptions"
//             sx={{
//               fontSize: 17,
//               fontWeight: "bold",
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//               },
//             }}
//           >
//             {t("navbar.plans")}
//           </Button>

//         </Box>


//         {/* Search */}
//         <TextField
//           placeholder={t("hero.searchPlaceholder")}
//           sx={{
//             display: { xs: "none", lg: "flex" },
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


//         {/* Right Side */}
//         <Box
//           sx={{
//             display: { xs: "none", lg: "flex" },
//             gap: 2,
//             alignItems: "center",
//           }}
//         >

//           {/* Language Selector */}
//           <LanguageSelector />


//           {/* Login / Profile */}
//           {!user ? (

//             /* Login */
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

//                 "&:hover": {
//                   borderColor: "#00A5EC",
//                   background: "#f0faff",
//                 },
//               }}
//             >
//               {t("navbar.login")}
//             </Button>

//           ) : (

//             <>
//               {/* Profile */}
//               <Box
//                 onClick={() =>
//                   navigate(
//                     user.role === "admin"
//                       ? "/admin"
//                       : "/profile"
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


//               {/* Logout */}
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

//                   "&:hover": {
//                     background: "#008dcc",
//                   },
//                 }}
//               >
//                 {t("navbar.logout")}
//               </Button>

//             </>
//           )}

//         </Box>


//         {/* ================= MOBILE MENU BUTTON ================= */}

//         <IconButton
//           onClick={() => setMobileMenu(!mobileMenu)}
//           sx={{
//             display: { xs: "flex", lg: "none" },
//             color: "#111",
//           }}
//         >
//           {mobileMenu ? (
//             <X size={30} />
//           ) : (
//             <MenuIcon size={30} />
//           )}
//         </IconButton>

//       </Toolbar>


//       {/* ================= MOBILE SIDEBAR / MENU ================= */}

//       {mobileMenu && (
//         <Box
//           sx={{
//             display: { xs: "block", lg: "none" },
//             background: "#fff",
//             borderTop: "1px solid #eee",
//             px: 3,
//             py: 3,
//             boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
//           }}
//         >

//           {/* Search */}

//           <TextField
//             fullWidth
//             placeholder={t("hero.searchPlaceholder")}
//             size="small"
//             sx={{
//               mb: 2,
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


//           {/* Language */}

//           <Box
//             sx={{
//               mb: 2,
//             }}
//           >
//             <LanguageSelector />
//           </Box>


//           {/* Internships */}

//           <Button
//             fullWidth
//             onClick={() =>
//               handleMobileNavigation("/internships")
//             }
//             sx={{
//               justifyContent: "flex-start",
//               py: 1.5,
//               fontSize: 16,
//               fontWeight: 600,
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//                 background: "#f8fafc",
//               },
//             }}
//           >
//             {t("navbar.internships")}
//           </Button>


//           {/* Jobs */}

//           <Button
//             fullWidth
//             onClick={() =>
//               handleMobileNavigation("/jobs")
//             }
//             sx={{
//               justifyContent: "flex-start",
//               py: 1.5,
//               fontSize: 16,
//               fontWeight: 600,
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//                 background: "#f8fafc",
//               },
//             }}
//           >
//             {t("navbar.jobs")}
//           </Button>


//           {/* Plans */}

//           <Button
//             fullWidth
//             onClick={() =>
//               handleMobileNavigation("/subscriptions")
//             }
//             sx={{
//               justifyContent: "flex-start",
//               py: 1.5,
//               fontSize: 16,
//               fontWeight: 600,
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//                 background: "#f8fafc",
//               },
//             }}
//           >
//             {t("navbar.plans")}
//           </Button>


//           {/* ================= USER ================= */}

//           {user ? (
//             <>

//               {/* Profile */}

//               <Button
//                 fullWidth
//                 onClick={() => {
//                   setMobileMenu(false);

//                   navigate(
//                     user.role === "admin"
//                       ? "/admin"
//                       : "/profile"
//                   );
//                 }}
//                 sx={{
//                   justifyContent: "flex-start",
//                   py: 1.5,
//                   fontSize: 16,
//                   fontWeight: 600,
//                   color: "#374151",
//                   textTransform: "none",

//                   "&:hover": {
//                     background: "#f8fafc",
//                   },
//                 }}
//               >
//                 👤 {user.name || "Profile"}
//               </Button>


//               {/* Login History */}

//               <Button
//                 fullWidth
//                 onClick={() =>
//                   handleMobileNavigation("/LoginHistory")
//                 }
//                 sx={{
//                   justifyContent: "flex-start",
//                   py: 1.5,
//                   fontSize: 16,
//                   fontWeight: 600,
//                   color: "#374151",
//                   textTransform: "none",

//                   "&:hover": {
//                     background: "#f8fafc",
//                   },
//                 }}
//               >
//                 🔐 Login History
//               </Button>


//               {/* Public Space */}

//               <Button
//                 fullWidth
//                 onClick={() =>
//                   handleMobileNavigation("/Publicspace")
//                 }
//                 sx={{
//                   justifyContent: "flex-start",
//                   py: 1.5,
//                   fontSize: 16,
//                   fontWeight: 600,
//                   color: "#374151",
//                   textTransform: "none",

//                   "&:hover": {
//                     background: "#f8fafc",
//                   },
//                 }}
//               >
//                 🌐 Public Space
//               </Button>


//               {/* Resume Builder */}

//               <Button
//                 fullWidth
//                 onClick={() =>
//                   handleMobileNavigation("/ResumeBuilder")
//                 }
//                 sx={{
//                   justifyContent: "flex-start",
//                   py: 1.5,
//                   fontSize: 16,
//                   fontWeight: 600,
//                   color: "#374151",
//                   textTransform: "none",

//                   "&:hover": {
//                     background: "#f8fafc",
//                   },
//                 }}
//               >
//                 📄 Resume Builder
//               </Button>


//               {/* Subscription */}

//               <Button
//                 fullWidth
//                 onClick={() =>
//                   handleMobileNavigation("/subscriptions")
//                 }
//                 sx={{
//                   justifyContent: "flex-start",
//                   py: 1.5,
//                   fontSize: 16,
//                   fontWeight: 600,
//                   color: "#374151",
//                   textTransform: "none",

//                   "&:hover": {
//                     background: "#f8fafc",
//                   },
//                 }}
//               >
//                 💎 Subscription
//               </Button>


//               {/* Logout */}

//               <Button
//                 fullWidth
//                 onClick={handleLogout}
//                 sx={{
//                   justifyContent: "flex-start",
//                   py: 1.5,
//                   fontSize: 16,
//                   fontWeight: 600,
//                   color: "red",
//                   textTransform: "none",

//                   "&:hover": {
//                     background: "#fff5f5",
//                   },
//                 }}
//               >
//                 🚪 {t("navbar.logout")}
//               </Button>

//             </>
//           ) : (

//             /* ================= NOT LOGGED IN ================= */

//             <>

//               {/* Login */}

//               <Button
//                 fullWidth
//                 onClick={() =>
//                   handleMobileNavigation("/login")
//                 }
//                 variant="contained"
//                 sx={{
//                   mt: 2,
//                   py: 1.3,
//                   borderRadius: 2,
//                   background: "#00A5EC",
//                   textTransform: "none",
//                   fontWeight: "bold",

//                   "&:hover": {
//                     background: "#008dcc",
//                   },
//                 }}
//               >
//                 {t("navbar.login")}
//               </Button>

//             </>

//           )}

//         </Box>
//       )}

//     </AppBar>
//   );
// }

// export default Navbar;

// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import LanguageSelector from "../LanguageSelector";

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

//   const { t } = useTranslation();

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
//           px: { xs: 2, lg: 8 },
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
//             display: { xs: "none", lg: "flex" },
//             gap: 4,
//           }}
//         >

//           {/* Internships */}
//           <Button
//             component={Link}
//             to="/internships"
//             sx={{
//               fontSize: 17,
//               fontWeight: "bold",
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//               },
//             }}
//           >
//             {t("navbar.internships")}
//           </Button>


//           {/* Jobs */}
//           <Button
//             component={Link}
//             to="/jobs"
//             sx={{
//               fontSize: 17,
//               fontWeight: "bold",
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//               },
//             }}
//           >
//             {t("navbar.jobs")}
//           </Button>

//           <Button
//             component={Link}
//             to="/subscriptions"
//             sx={{
//               fontSize: 17,
//               fontWeight: "bold",
//               color: "#374151",
//               textTransform: "none",

//               "&:hover": {
//                 color: "#00A5EC",
//               },
//             }}
//           >
//             {t("navbar.plans")}
//           </Button>

//         </Box>


//         {/* Search */}
//         <TextField
//           placeholder={t("hero.searchPlaceholder")}
//           sx={{
//             display: { xs: "none", lg: "flex" },
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


//         {/* Right Side */}
//         <Box
//           sx={{
//             display: { xs: "none", lg: "flex" },
//             gap: 2,
//             alignItems: "center",
//           }}
//         >

//           {/* Language Selector */}
//           <LanguageSelector />


//           {/* Login / Profile */}
//           {!user ? (

//             /* Login */
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

//                 "&:hover": {
//                   borderColor: "#00A5EC",
//                   background: "#f0faff",
//                 },
//               }}
//             >
//               {t("navbar.login")}
//             </Button>

//           ) : (

//             <>
//               {/* Profile */}
//               <Box
//                 onClick={() =>
//                   navigate(
//                     user.role === "admin"
//                       ? "/admin"
//                       : "/profile"
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


//               {/* Logout */}
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

//                   "&:hover": {
//                     background: "#008dcc",
//                   },
//                 }}
//               >
//                 {t("navbar.logout")}
//               </Button>

//             </>
//           )}

//         </Box>


//         {/* Mobile Menu */}
//         <IconButton
//           sx={{
//             display: { xs: "flex", lg: "none" },
//           }}
//         >
//           <MenuIcon size={30} />
//         </IconButton>

//       </Toolbar>
//     </AppBar>
//   );
// }

// export default Navbar;



