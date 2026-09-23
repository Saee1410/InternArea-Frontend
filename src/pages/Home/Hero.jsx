import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";

import {
  CallMade as ArrowUpRight,
  AccountBalanceWalletOutlined as Banknote,
  CalendarTodayOutlined as Calendar,
  ChevronRight,
  ChevronLeft,
  LocationOnOutlined as MapPin,
} from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import axios from "axios";

const API_URL = "http://localhost:5000";

export default function SvgSlider() {
  const { t } = useTranslation();

  // =========================
  // SLIDER DATA
  // =========================
  const slides = [
    {
      pattern: "pattern-3",
      title: t("home.growSkills"),
      bgColor:
        "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    },
    {
      pattern: "pattern-1",
      title: t("home.startCareer"),
      bgColor:
        "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
    },
    {
      pattern: "pattern-2",
      title: t("home.learnBest"),
      bgColor:
        "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    },
    {
      pattern: "pattern-4",
      title: t("home.connectCompanies"),
      bgColor:
        "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
    },
  ];

  // =========================
  // STATE
  // =========================
  const [internships, setInternship] = useState([]);
  const [jobs, setJob] = useState([]);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internshipRes, jobRes] = await Promise.all([
          axios.get(`${API_URL}/api/internship`),
          axios.get(`${API_URL}/api/job`),
        ]);

        setInternship(internshipRes.data);
        setJob(jobRes.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchData();
  }, []);

  // =========================
  // UI
  // =========================
  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container maxWidth="lg">

        {/* =========================
            TITLE SECTION
        ========================= */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            mb: 4,
            width: "100%",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight="800"
            color="#0F172A"
            sx={{
              letterSpacing: "-0.02em",
              mb: 1,
              fontSize: {
                xs: "2rem",
                md: "2.75rem",
              },
            }}
          >
            {t("home.dreamCareer")}
          </Typography>

          <Typography
            variant="h6"
            fontWeight="500"
            color="#475569"
            sx={{
              fontSize: {
                xs: "1.1rem",
                md: "1.25rem",
              },
            }}
          >
            {t("home.trending")}
          </Typography>
        </Box>

        {/* =========================
            SWIPER SLIDER SECTION
        ========================= */}
        <Box
          mb={8}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "1100px",
            mx: "auto",
            borderRadius: 4,
            overflow: "hidden",

            "& .swiper-pagination-bullet": {
              bgcolor: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },

            "& .swiper-pagination-bullet-active": {
              bgcolor: "#008BDC",
              width: 10,
              height: 10,
            },
          }}
        >

          {/* Custom Navigation - Previous */}
          <IconButton
            className="custom-prev"
            sx={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "#008BDC",
              bgcolor: "rgba(255, 255, 255, 0.2)",

              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.4)",
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: 36 }} />
          </IconButton>

          {/* Custom Navigation - Next */}
          <IconButton
            className="custom-next"
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "#008BDC",
              bgcolor: "rgba(255, 255, 255, 0.2)",

              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.4)",
              },
            }}
          >
            <ChevronRight sx={{ fontSize: 36 }} />
          </IconButton>

          <Swiper
            modules={[
              Navigation,
              Pagination,
              Autoplay,
            ]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    position: "relative",
                    height: {
                      xs: 600,
                      md: 380,
                    },
                    width: "100%",
                    background: slide.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 4,
                    mb: 4,
                  }}
                >

                  {/* Pattern Background */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.15,
                    }}
                  >
                    <svg
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <pattern
                        id={`grid-pattern-${index}`}
                        x="0"
                        y="0"
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 30 0 L 0 0 0 30"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </pattern>

                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill={`url(#grid-pattern-${index})`}
                      />
                    </svg>
                  </Box>

                  <Typography
                    variant="h3"
                    fontWeight="800"
                    color="white"
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      textAlign: "center",
                      px: 3,
                      fontSize: {
                        xs: "2rem",
                        md: "3rem",
                      },
                    }}
                  >
                    {slide.title}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* =========================
            INTERNSHIP GRID
        ========================= */}
        <Grid
          container
          spacing={3}
          mb={8}
        >
          {internships.map((internship, index) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={internship._id || index}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  bgcolor: "#FFFFFF",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",

                  "&:hover": {
                    boxShadow:
                      "0 10px 20px -5px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>

                  {/* =========================
                      ACTIVELY HIRING
                  ========================= */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{
                      bgcolor: "#E0F2FE",
                      color: "#0369A1",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: "4px",
                      width: "fit-content",
                      mb: 2,
                    }}
                  >
                    <ArrowUpRight
                      sx={{ fontSize: 16 }}
                    />

                    <Typography
                      variant="caption"
                      fontWeight="700"
                    >
                      {t("home.activelyHiring")}
                    </Typography>
                  </Stack>

                  {/* =========================
                      INTERNSHIP TITLE
                  ========================= */}
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    color="#0F172A"
                    mb={0.5}
                  >
                    {internship.title}
                  </Typography>

                  {/* =========================
                      COMPANY
                  ========================= */}
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    color="#64748B"
                    mb={2}
                  >
                    {internship.company}
                  </Typography>

                  {/* =========================
                      DETAILS
                  ========================= */}
                  <Stack
                    spacing={1.5}
                    color="#475569"
                    mb={3}
                  >

                    {/* Location */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <MapPin
                        sx={{
                          fontSize: 18,
                          color: "#94A3B8",
                        }}
                      />

                      <Typography variant="body2">
                        {internship.location}
                      </Typography>
                    </Stack>

                    {/* Stipend */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Banknote
                        sx={{
                          fontSize: 18,
                          color: "#94A3B8",
                        }}
                      />

                      <Typography variant="body2">
                        {internship.stipend
                          ? `₹ ${internship.stipend}`
                          : t("home.tbd")}
                      </Typography>
                    </Stack>

                    {/* Date / Duration */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Calendar
                        sx={{
                          fontSize: 18,
                          color: "#94A3B8",
                        }}
                      />

                      <Typography variant="body2">
                        {internship.startDate ||
                          internship.duration ||
                          t("home.immediate")}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* =========================
                      FOOTER
                  ========================= */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    pt={2}
                    borderTop="1px solid #F1F5F9"
                  >

                    {/* Internship Chip */}
                    <Chip
                      label={t("home.internship")}
                      size="small"
                      sx={{
                        bgcolor: "#F1F5F9",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    />

                    {/* View Details */}
                    <Button
                      component={RouterLink}
                      to={`/detailinternship/${internship._id}`}
                      sx={{
                        color: "#008BDC",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                      endIcon={<ChevronRight />}
                    >
                      {t("home.viewDetails")}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}






// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Link as RouterLink } from "react-router-dom";
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Stack,
//   IconButton,
// } from "@mui/material";
// import {
//   CallMade as ArrowUpRight,
//   AccountBalanceWalletOutlined as Banknote,
//   CalendarTodayOutlined as Calendar,
//   ChevronRight,
//   ChevronLeft,
//   LocationOnOutlined as MapPin,
// } from "@mui/icons-material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// import axios from "axios";

// const API_URL = "http://localhost:5000";

// export default function SvgSlider() {
//   const { t } = useTranslation();

//   const slides = [
//     {
//       pattern: "pattern-3",
//       title: "Grow Your Skills",
//       bgColor: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
//     },
//     {
//       pattern: "pattern-1",
//       title: "Start Your Career",
//       bgColor: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
//     },
//     {
//       pattern: "pattern-2",
//       title: "Learn From The Best",
//       bgColor: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
//     },
//     {
//       pattern: "pattern-4",
//       title: "Connect With Top Companies",
//       bgColor: "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
//     },
//   ];

//   const [internships, setInternship] = useState([]);
//   const [jobs, setJob] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [internshipRes, jobRes] = await Promise.all([
//           axios.get(`${API_URL}/api/internship`),
//           axios.get(`${API_URL}/api/job`),
//         ]);
//         setInternship(internshipRes.data);
//         setJob(jobRes.data);
//       } catch (error) {
//         console.error("Error fetching listings:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", py: 6 }}>
//       <Container maxWidth="lg">
//         {/* Title Section */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             mb: 4,
//             width: "100%",
//           }}
//         >
//           <Typography
//             variant="h3"
//             component="h1"
//             fontWeight="800"
//             color="#0F172A"
//             sx={{
//               letterSpacing: "-0.02em",
//               mb: 1,
//               fontSize: { xs: "2rem", md: "2.75rem" },
//             }}
//           >
//             Make your dream career a reality
//           </Typography>

//           <Typography
//             variant="h6"
//             fontWeight="500"
//             color="#475569"
//             sx={{
//               fontSize: { xs: "1.1rem", md: "1.25rem" },
//             }}
//           >
//             Trending on InternArea 🔥
//           </Typography>
//         </Box>

//         {/* Swiper Slider Section */}
//         <Box
//           mb={8}
//           sx={{
//             position: "relative",
//             width: "100%",
//             maxWidth: "1100px",
//             mx: "auto",
//             borderRadius: 4,
//             overflow: "hidden",
//             "& .swiper-pagination-bullet": {
//               bgcolor: "rgba(255, 255, 255, 0.5)",
//               opacity: 1,
//             },
//             "& .swiper-pagination-bullet-active": {
//               bgcolor: "#008BDC",
//               width: 10,
//               height: 10,
//             },
//           }}
//         >
//           {/* Custom Navigation Arrows */}
//           <IconButton
//             className="custom-prev"
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: 16,
//               transform: "translateY(-50%)",
//               zIndex: 10,
//               color: "#008BDC",
//               bgcolor: "rgba(255, 255, 255, 0.2)",
//               "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" },
//             }}
//           >
//             <ChevronLeft sx={{ fontSize: 36 }} />
//           </IconButton>

//           <IconButton
//             className="custom-next"
//             sx={{
//               position: "absolute",
//               top: "50%",
//               right: 16,
//               transform: "translateY(-50%)",
//               zIndex: 10,
//               color: "#008BDC",
//               bgcolor: "rgba(255, 255, 255, 0.2)",
//               "&:hover": { bgcolor: "rgba(255, 255, 255, 0.4)" },
//             }}
//           >
//             <ChevronRight sx={{ fontSize: 36 }} />
//           </IconButton>

//           <Swiper
//             modules={[Navigation, Pagination, Autoplay]}
//             spaceBetween={0}
//             slidesPerView={1}
//             navigation={{
//               prevEl: ".custom-prev",
//               nextEl: ".custom-next",
//             }}
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 4000 }}
//           >
//             {slides.map((slide, index) => (
//               <SwiperSlide key={index}>
//                 <Box
//                   sx={{
//                     position: "relative",
//                     height: { xs: 600, md: 380 },
//                     width: "100%",
//                     background: slide.bgColor,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     mt: 4,
//                     mb: 4,
//                   }}
//                 >
//                   {/* Pattern Background */}
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       inset: 0,
//                       opacity: 0.15,
//                     }}
//                   >
//                     <svg
//                       style={{ width: "100%", height: "100%" }}
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <pattern
//                         id="grid-pattern"
//                         x="0"
//                         y="0"
//                         width="30"
//                         height="30"
//                         patternUnits="userSpaceOnUse"
//                       >
//                         <path
//                           d="M 30 0 L 0 0 0 30"
//                           fill="none"
//                           stroke="white"
//                           strokeWidth="2"
//                         />
//                       </pattern>
//                       <rect
//                         x="0"
//                         y="0"
//                         width="100%"
//                         height="100%"
//                         fill="url(#grid-pattern)"
//                       />
//                     </svg>
//                   </Box>

//                   <Typography
//                     variant="h3"
//                     fontWeight="800"
//                     color="white"
//                     sx={{
//                       position: "relative",
//                       zIndex: 1,
//                       textAlign: "center",
//                       px: 3,
//                       fontSize: { xs: "2rem", md: "3rem" },
//                     }}
//                   >
//                     {slide.title}
//                   </Typography>
//                 </Box>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Box>

//         {/* Internships Header Section */}
//         {/* <Typography
//           variant="h5"
//           fontWeight="700"
//           color="#0F172A"
//           mt={2}
//           mb={4}
//           sx={{ fontSize: { xs: "1.3rem", md: "1.6rem" } }}
//         >
//           Latest internships on Intern Area
//         </Typography> */}

//         {/* Internship Grid */}
//         <Grid container spacing={3} mb={8}>
//           {internships.map((internship, index) => (
//             <Grid item xs={12} md={6} lg={4} key={internship._id || index}>
//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 3,
//                   border: "1px solid #E2E8F0",
//                   bgcolor: "#FFFFFF",
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   transition: "all 0.2s ease",
//                   "&:hover": {
//                     boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.08)",
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <Stack
//                     direction="row"
//                     alignItems="center"
//                     spacing={0.5}
//                     sx={{
//                       bgcolor: "#E0F2FE",
//                       color: "#0369A1",
//                       px: 1.2,
//                       py: 0.4,
//                       borderRadius: "4px",
//                       width: "fit-content",
//                       mb: 2,
//                     }}
//                   >
//                     <ArrowUpRight sx={{ fontSize: 16 }} />
//                     <Typography variant="caption" fontWeight="700">
//                       Actively hiring
//                     </Typography>
//                   </Stack>

//                   <Typography variant="h6" fontWeight="700" color="#0F172A" mb={0.5}>
//                     {internship.title}
//                   </Typography>

//                   <Typography variant="body2" fontWeight="500" color="#64748B" mb={2}>
//                     {internship.company}
//                   </Typography>

//                   <Stack spacing={1.5} color="#475569" mb={3}>
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <MapPin sx={{ fontSize: 18, color: "#94A3B8" }} />
//                       <Typography variant="body2">{internship.location}</Typography>
//                     </Stack>

//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <Banknote sx={{ fontSize: 18, color: "#94A3B8" }} />
//                       <Typography variant="body2">
//                         {internship.stipend ? `₹ ${internship.stipend}` : "TBD"}
//                       </Typography>
//                     </Stack>

//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <Calendar sx={{ fontSize: 18, color: "#94A3B8" }} />
//                       <Typography variant="body2">
//                         {internship.startDate || internship.duration || "Immediate"}
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     pt={2}
//                     borderTop="1px solid #F1F5F9"
//                   >
//                     <Chip
//                       label="Internship"
//                       size="small"
//                       sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 600 }}
//                     />

//                     <Button
//                       component={RouterLink}
//                       to={`/detailinternship/${internship._id}`}
//                       sx={{ color: "#008BDC", textTransform: "none", fontWeight: 700 }}
//                       endIcon={<ChevronRight />}
//                     >
//                       View Details
//                     </Button>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
          
//         </Grid>
//       </Container>
//     </Box>
//   );
// }



// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Stack,
//   Paper,
// } from "@mui/material";
// import {
//   CallMade as ArrowUpRight,
//   AccountBalanceWalletOutlined as Banknote,
//   CalendarTodayOutlined as Calendar,
//   ChevronRight,
//   LocationOnOutlined as MapPin,
//   TrendingUp,
// } from "@mui/icons-material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// import axios from "axios";

// const API_URL = "http://localhost:5000";

// export default function SvgSlider() {
//   const { t } = useTranslation();

//   const categories = [
//     "Big Brands",
//     "Work From Home",
//     "Part-time",
//     "MBA",
//     "Engineering",
//     "Media",
//     "Design",
//     "Data Science",
//   ];

//   const slides = [
//     {
//       pattern: "pattern-1",
//       title: "startCareer",
//       bgColor: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
//     },
//     {
//       pattern: "pattern-2",
//       title: "learnBest",
//       bgColor: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
//     },
//     {
//       pattern: "pattern-3",
//       title: "growSkills",
//       bgColor: "linear-gradient(135deg, #9333EA 0%, #6B21A8 100%)",
//     },
//     {
//       pattern: "pattern-4",
//       title: "connectCompanies",
//       bgColor: "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
//     },
//   ];

//   const stats = [
//     { number: "300K+", label: "companies hiring" },
//     { number: "10K+", label: "new openings everyday" },
//     { number: "21Mn+", label: "active students" },
//     { number: "600K+", label: "learners" },
//   ];

//   const [internships, setInternship] = useState([]);
//   const [jobs, setJob] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [internshipRes, jobRes] = await Promise.all([
//           axios.get(`${API_URL}/api/internship`),
//           axios.get(`${API_URL}/api/job`),
//         ]);
//         setInternship(internshipRes.data);
//         setJob(jobRes.data);
//       } catch (error) {
//         console.error("Error fetching listings:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredInternships = internships.filter(
//     (item) => !selectedCategory || item.category === selectedCategory
//   );

//   const filteredJobs = jobs.filter(
//     (item) => !selectedCategory || item.category === selectedCategory
//   );

//   return (
//     <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 8 }}>
//       <Container maxWidth="lg">

//         {/* Perfect Center Hero Section */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             mb: 7,
//             width: "100%",
//           }}
//         >
//           <Typography
//             variant="h3"
//             component="h1"
//             fontWeight="800"
//             color="#0F172A"
//             sx={{
//               letterSpacing: "-0.025em",
//               mb: 1.5,
//               fontSize: { xs: "2rem", md: "2.75rem" },
//               textAlign: "center",
//             }}
//           >
//             {t("hero.title")}
//           </Typography>

//           <Stack
//             direction="row"
//             justifyContent="center"
//             alignItems="center"
//             spacing={1}
//             sx={{ width: "100%" }}
//           >
//             <TrendingUp sx={{ color: "#F59E0B", fontSize: 24 }} />

//             <Typography
//               variant="h6"
//               fontWeight="600"
//               color="#64748B"
//               sx={{
//                 fontSize: { xs: "1rem", md: "1.2rem" },
//                 textAlign: "center",
//               }}
//             >
//               {t("hero.subtitle")}
//             </Typography>
//           </Stack>
//         </Box>

//         {/* Swiper Slider Section */}
//         <Box
//           mb={10}
//           sx={{
//             width: "100%",
//             maxWidth: "1100px",
//             maxHeight: "400px",
//             mx: "auto",
//             borderRadius: 5,
//             overflow: "hidden",
//             boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
//           }}
//         >
//           <Swiper
//             modules={[Navigation, Pagination, Autoplay]}
//             spaceBetween={0}
//             slidesPerView={1}
//             navigation
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 5000 }}
//           >
//             {slides.map((slide, index) => (
//               <SwiperSlide key={index}>
//                 <Box
//                   sx={{
//                     position: "relative",
//                     height: { xs: 860, md: 450 },
//                     background: slide.bgColor,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       inset: 0,
//                       opacity: 0.12,
//                     }}
//                   >
//                     <svg
//                       style={{ width: "100%", height: "100%" }}
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       {slide.pattern === "pattern-1" && (
//                         <pattern
//                           id="pattern-1"
//                           x="0"
//                           y="0"
//                           width="24"
//                           height="24"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <circle
//                             cx="12"
//                             cy="12"
//                             r="3"
//                             fill="white"
//                           />
//                         </pattern>
//                       )}

//                       {slide.pattern === "pattern-2" && (
//                         <pattern
//                           id="pattern-2"
//                           x="0"
//                           y="0"
//                           width="40"
//                           height="40"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <rect
//                             x="15"
//                             y="15"
//                             width="10"
//                             height="10"
//                             fill="white"
//                           />
//                         </pattern>
//                       )}

//                       {slide.pattern === "pattern-3" && (
//                         <pattern
//                           id="pattern-3"
//                           x="0"
//                           y="0"
//                           width="40"
//                           height="40"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M0 20 L20 0 L40 20 L20 40 Z"
//                             fill="white"
//                           />
//                         </pattern>
//                       )}

//                       {slide.pattern === "pattern-4" && (
//                         <pattern
//                           id="pattern-4"
//                           x="0"
//                           y="0"
//                           width="110"
//                           height="200"
//                           patternUnits="userSpaceOnUse"
//                         >
//                           <path
//                             d="M30 5 L55 30 L30 55 L5 30 Z"
//                             fill="white"
//                           />
//                         </pattern>
//                       )}

//                       <rect
//                         x="0"
//                         y="0"
//                         width="100%"
//                         height="100%"
//                         fill={`url(#${slide.pattern})`}
//                       />
//                     </svg>
//                   </Box>

//                   <Typography
//                     variant="h3"
//                     fontWeight="700"
//                     color="white"
//                     sx={{
//                       position: "relative",
//                       zIndex: 1,
//                       textAlign: "center",
//                       px: 3,
//                       fontSize: { xs: "1.75rem", md: "2.5rem" },
//                     }}
//                   >
//                     {t(`hero.${slide.title}`)}
//                   </Typography>
//                 </Box>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Box>

//         {/* Category Selection Section */}
//         <Box mb={8}>
//           <Stack
//             direction="row"
//             spacing={1.5}
//             flexWrap="wrap"
//             useFlexGap
//             alignItems="center"
//             justifyContent="center"
//           >
//             <Typography
//               variant="subtitle1"
//               fontWeight="600"
//               color="#334155"
//               mr={1}
//             >
//               Popular categories:
//             </Typography>

//             {categories.map((category) => {
//               const isSelected = selectedCategory === category;

//               return (
//                 <Chip
//                   key={category}
//                   label={category}
//                   onClick={() =>
//                     setSelectedCategory(isSelected ? "" : category)
//                   }
//                   sx={{
//                     borderRadius: "24px",
//                     fontWeight: 500,
//                     fontSize: "0.875rem",
//                     px: 1.5,
//                     py: 2.2,
//                     cursor: "pointer",
//                     transition: "all 0.2s ease-in-out",
//                     bgcolor: isSelected ? "#008BDC" : "#FFFFFF",
//                     color: isSelected ? "white" : "#475569",
//                     border: "1px solid",
//                     borderColor: isSelected
//                       ? "#008BDC"
//                       : "#E2E8F0",
//                     boxShadow: isSelected
//                       ? "0 4px 12px rgba(0, 139, 220, 0.2)"
//                       : "none",
//                     "&:hover": {
//                       bgcolor: isSelected
//                         ? "#0073B7"
//                         : "#F1F5F9",
//                       borderColor: isSelected
//                         ? "#0073B7"
//                         : "#CBD5E1",
//                     },
//                   }}
//                 />
//               );
//             })}
//           </Stack>
//         </Box>

//         {/* Internship Grid */}
//         <Grid container spacing={4} mb={10}>
//           {filteredInternships.map((internship, index) => (
//             <Grid
//               item
//               xs={12}
//               md={6}
//               lg={4}
//               key={internship._id || index}
//             >
//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 4,
//                   border: "1px solid #E2E8F0",
//                   bgcolor: "#FFFFFF",
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   transition: "all 0.25s ease",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow:
//                       "0 12px 24px -10px rgba(0, 0, 0, 0.08)",
//                     borderColor: "#CBD5E1",
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 3.5 }}>
//                   <Stack
//                     direction="row"
//                     alignItems="center"
//                     spacing={0.75}
//                     sx={{
//                       bgcolor: "#E0F2FE",
//                       color: "#0369A1",
//                       px: 1.5,
//                       py: 0.6,
//                       borderRadius: "6px",
//                       width: "fit-content",
//                       mb: 2.5,
//                     }}
//                   >
//                     <ArrowUpRight sx={{ fontSize: 16 }} />

//                     <Typography
//                       variant="caption"
//                       fontWeight="700"
//                       letterSpacing="0.02em"
//                     >
//                       {t("hero.activelyHiring")}
//                     </Typography>
//                   </Stack>

//                   <Typography
//                     variant="h6"
//                     fontWeight="700"
//                     color="#0F172A"
//                     gutterBottom
//                     sx={{
//                       fontSize: "1.15rem",
//                       lineHeight: 1.4,
//                     }}
//                   >
//                     {internship.title}
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     fontWeight="500"
//                     color="#64748B"
//                     mb={3}
//                   >
//                     {internship.company}
//                   </Typography>

//                   <Stack spacing={2} color="#475569" mb={4}>
//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={1.5}
//                     >
//                       <MapPin
//                         sx={{
//                           fontSize: 18,
//                           color: "#94A3B8",
//                         }}
//                       />

//                       <Typography
//                         variant="body2"
//                         fontWeight="500"
//                       >
//                         {internship.location}
//                       </Typography>
//                     </Stack>

//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={1.5}
//                     >
//                       <Banknote
//                         sx={{
//                           fontSize: 18,
//                           color: "#94A3B8",
//                         }}
//                       />

//                       <Typography
//                         variant="body2"
//                         fontWeight="500"
//                       >
//                         {internship.stipend
//                           ? `₹ ${internship.stipend}`
//                           : "TBD"}
//                       </Typography>
//                     </Stack>

//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={1.5}
//                     >
//                       <Calendar
//                         sx={{
//                           fontSize: 18,
//                           color: "#94A3B8",
//                         }}
//                       />

//                       <Typography
//                         variant="body2"
//                         fontWeight="500"
//                       >
//                         {internship.startDate ||
//                           internship.duration ||
//                           "Immediate"}
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     pt={2.5}
//                     borderTop="1px solid #F1F5F9"
//                   >
//                     <Chip
//                       label="Internship"
//                       size="small"
//                       sx={{
//                         bgcolor: "#F1F5F9",
//                         color: "#475569",
//                         fontWeight: 600,
//                         borderRadius: "6px",
//                         fontSize: "0.75rem",
//                       }}
//                     />

//                     <Button
//                       href={`/detailiternship/${internship._id}`}
//                       sx={{
//                         color: "#008BDC",
//                         textTransform: "none",
//                         fontWeight: "700",
//                         fontSize: "0.9rem",
//                         p: 0,
//                         "&:hover": {
//                           bgcolor: "transparent",
//                           color: "#0069A5",
//                         },
//                       }}
//                       endIcon={<ChevronRight />}
//                     >
//                       {t("common.viewDetails")}
//                     </Button>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Jobs Grid */}
//         <Box mb={10}>
//           <Grid container spacing={4}>
//             {filteredJobs.map((job, index) => (
//               <Grid
//                 item
//                 xs={12}
//                 md={6}
//                 lg={4}
//                 key={job._id || index}
//               >
//                 <Card
//                   elevation={0}
//                   sx={{
//                     borderRadius: 4,
//                     border: "1px solid #E2E8F0",
//                     bgcolor: "#FFFFFF",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     transition: "all 0.25s ease",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                       boxShadow:
//                         "0 12px 24px -10px rgba(0, 0, 0, 0.08)",
//                       borderColor: "#CBD5E1",
//                     },
//                   }}
//                 >
//                   <CardContent sx={{ p: 3.5 }}>
//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={0.75}
//                       sx={{
//                         bgcolor: "#E0F2FE",
//                         color: "#0369A1",
//                         px: 1.5,
//                         py: 0.6,
//                         borderRadius: "6px",
//                         width: "fit-content",
//                         mb: 2.5,
//                       }}
//                     >
//                       <ArrowUpRight sx={{ fontSize: 16 }} />

//                       <Typography
//                         variant="caption"
//                         fontWeight="700"
//                         letterSpacing="0.02em"
//                       >
//                         Actively Hiring
//                       </Typography>
//                     </Stack>

//                     <Typography
//                       variant="h6"
//                       fontWeight="700"
//                       color="#0F172A"
//                       gutterBottom
//                       sx={{
//                         fontSize: "1.15rem",
//                         lineHeight: 1.4,
//                       }}
//                     >
//                       {job.title}
//                     </Typography>

//                     <Typography
//                       variant="body2"
//                       fontWeight="500"
//                       color="#64748B"
//                       mb={3}
//                     >
//                       {job.company}
//                     </Typography>

//                     <Stack spacing={2} color="#475569" mb={4}>
//                       <Stack
//                         direction="row"
//                         alignItems="center"
//                         spacing={1.5}
//                       >
//                         <MapPin
//                           sx={{
//                             fontSize: 18,
//                             color: "#94A3B8",
//                           }}
//                         />

//                         <Typography
//                           variant="body2"
//                           fontWeight="500"
//                         >
//                           {job.location}
//                         </Typography>
//                       </Stack>

//                       <Stack
//                         direction="row"
//                         alignItems="center"
//                         spacing={1.5}
//                       >
//                         <Banknote
//                           sx={{
//                             fontSize: 18,
//                             color: "#94A3B8",
//                           }}
//                         />

//                         <Typography
//                           variant="body2"
//                           fontWeight="500"
//                         >
//                           {job.CTC ? `₹ ${job.CTC}` : "TBD"}
//                         </Typography>
//                       </Stack>

//                       <Stack
//                         direction="row"
//                         alignItems="center"
//                         spacing={1.5}
//                       >
//                         <Calendar
//                           sx={{
//                             fontSize: 18,
//                             color: "#94A3B8",
//                           }}
//                         />

//                         <Typography
//                           variant="body2"
//                           fontWeight="500"
//                         >
//                           {job.StartDate ||
//                             job.Experience ||
//                             "Immediate"}
//                         </Typography>
//                       </Stack>
//                     </Stack>

//                     <Stack
//                       direction="row"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       pt={2.5}
//                       borderTop="1px solid #F1F5F9"
//                     >
//                       <Chip
//                         label="Job"
//                         size="small"
//                         sx={{
//                           bgcolor: "#F1F5F9",
//                           color: "#475569",
//                           fontWeight: 600,
//                           borderRadius: "6px",
//                           fontSize: "0.75rem",
//                         }}
//                       />

//                       <Button
//                         href={`/detailjob/${job._id}`}
//                         sx={{
//                           color: "#008BDC",
//                           textTransform: "none",
//                           fontWeight: "700",
//                           fontSize: "0.9rem",
//                           p: 0,
//                           "&:hover": {
//                             bgcolor: "transparent",
//                             color: "#0069A5",
//                           },
//                         }}
//                         endIcon={<ChevronRight />}
//                       >
//                         View details
//                       </Button>
//                     </Stack>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Stats Section */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 4, md: 6 },
//             borderRadius: 5,
//             bgcolor: "#FFFFFF",
//             border: "1px solid #E2E8F0",
//           }}
//         >
//           <Grid container spacing={4}>
//             {stats.map((stat, index) => (
//               <Grid
//                 item
//                 xs={6}
//                 md={3}
//                 key={index}
//                 textAlign="center"
//               >
//                 <Typography
//                   variant="h3"
//                   fontWeight="800"
//                   color="#008BDC"
//                   sx={{
//                     mb: 1,
//                     fontSize: {
//                       xs: "1.75rem",
//                       md: "2.5rem",
//                     },
//                   }}
//                 >
//                   {stat.number}
//                 </Typography>

//                 <Typography
//                   variant="body2"
//                   fontWeight="600"
//                   color="#64748B"
//                   sx={{
//                     fontSize: "0.875rem",
//                     letterSpacing: "0.02em",
//                   }}
//                 >
//                   {stat.label}
//                 </Typography>
//               </Grid>
//             ))}
//           </Grid>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }




// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Stack,
//   Paper,
// } from "@mui/material";
// import {
//   CallMade as ArrowUpRight,
//   AccountBalanceWalletOutlined as Banknote,
//   CalendarTodayOutlined as Calendar,
//   ChevronRight,
//   LocationOnOutlined as MapPin,
//   TrendingUp,
// } from "@mui/icons-material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// import axios from "axios";

// const API_URL = "http://localhost:5000";

// export default function SvgSlider() {
//     const { t } = useTranslation();

//   const categories = [
//     "Big Brands",
//     "Work From Home",
//     "Part-time",
//     "MBA",
//     "Engineering",
//     "Media",
//     "Design",
//     "Data Science",
//   ];

//   const slides = [
//     {
//       pattern: "pattern-1",
//       title: "Start Your Career Journey",
//       bgColor: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
//     },
//     {
//       pattern: "pattern-2",
//       title: "Learn From The Best",
//       bgColor: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
//     },
//     {
//       pattern: "pattern-3",
//       title: "Grow Your Skills",
//       bgColor: "linear-gradient(135deg, #9333EA 0%, #6B21A8 100%)",
//     },
//     {
//       pattern: "pattern-4",
//       title: "Connect With Top Companies",
//       bgColor: "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
//     },
//   ];

//   const stats = [
//     { number: "300K+", label: "companies hiring" },
//     { number: "10K+", label: "new openings everyday" },
//     { number: "21Mn+", label: "active students" },
//     { number: "600K+", label: "learners" },
//   ];

//   const [internships, setInternship] = useState([]);
//   const [jobs, setJob] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [internshipRes, jobRes] = await Promise.all([
//           axios.get(`${API_URL}/api/internship`),
//           axios.get(`${API_URL}/api/job`),
//         ]);
//         setInternship(internshipRes.data);
//         setJob(jobRes.data);
//       } catch (error) {
//         console.error("Error fetching listings:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredInternships = internships.filter(
//     (item) => !selectedCategory || item.category === selectedCategory
//   );
//   const filteredJobs = jobs.filter(
//     (item) => !selectedCategory || item.category === selectedCategory
//   );

//   return (
//     <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 8 }}>
//       <Container maxWidth="lg">
//         {/* Perfect Center Hero Section */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: "center",
//             mb: 7,
//             width: "100%",
//           }}
//         >
//           <Typography
//             variant="h3"
//             component="h1"
//             fontWeight="800"
//             color="#0F172A"
//             sx={{
//               letterSpacing: "-0.025em",
//               mb: 1.5,
//               fontSize: { xs: "2rem", md: "2.75rem" },
//               textAlign: "center",
//             }}
//           >
//             {t("hero.title")}
          
//           </Typography>
          
//           <Stack
//             direction="row"
//             justifyContent="center"
//              alignItems="center"
//             spacing={1}
//             sx={{ width: "100%" }}
//           >
//             <TrendingUp sx={{ color: "#F59E0B", fontSize: 24 }} />
//             <Typography
//               variant="h6"
//               fontWeight="600"
//               color="#64748B"
//               sx={{ fontSize: { xs: "1rem", md: "1.2rem" } , textAlign: "center" }}
//             >
//               {t("hero.subtitle")}
//             </Typography>
//           </Stack>
//         </Box>

//         {/* Swiper Slider Section */}
//         <Box
//           mb={10}
//           sx={{
//             width: "100%",
//             maxWidth: "1100px",
//             maxHeight: "400px",
//             mx: "auto",
//             borderRadius: 5,
//             overflow: "hidden",
//             boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
//           }}
//         >
//           <Swiper
//             modules={[Navigation, Pagination, Autoplay]}
//             spaceBetween={0}
//             slidesPerView={1}
//             navigation
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 5000 }}
//           >
//             {slides.map((slide, index) => (
//               <SwiperSlide key={index}>
//                 <Box
//                   sx={{
//                     position: "relative",
//                     height: { xs: 860, md: 450 },
//                     background: slide.bgColor,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Box sx={{ position: "absolute", inset: 0, opacity: 0.12 }}>
//                     <svg style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
//                       {slide.pattern === "pattern-1" && (
//                         <pattern id="pattern-1" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
//                           <circle cx="12" cy="12" r="3" fill="white" />
//                         </pattern>
//                       )}
//                       {slide.pattern === "pattern-2" && (
//                         <pattern id="pattern-2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
//                           <rect x="15" y="15" width="10" height="10" fill="white" />
//                         </pattern>
//                       )}
//                       {slide.pattern === "pattern-3" && (
//                         <pattern id="pattern-3" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
//                           <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="white" />
//                         </pattern>
//                       )}
//                       {slide.pattern === "pattern-4" && (
//                         <pattern id="pattern-4" x="0" y="0" width="110" height="200" patternUnits="userSpaceOnUse">
//                           <path d="M30 5 L55 30 L30 55 L5 30 Z" fill="white" />
//                         </pattern>
//                       )}
//                       <rect x="0" y="0" width="100%" height="100%" fill={`url(#${slide.pattern})`} />
//                     </svg>
//                   </Box>

//                   <Typography
//                     variant="h3"
//                     fontWeight="700"
//                     color="white"
//                     sx={{
//                       position: "relative",
//                       zIndex: 1,
//                       textAlign: "center",
//                       px: 3,
//                       fontSize: { xs: "1.75rem", md: "2.5rem" },
//                     }}
//                   >
//                     {slide.title}
//                   </Typography>
//                 </Box>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Box>

//         {/* Category Selection Section */}
//         <Box mb={8}>
//           <Stack
//             direction="row"
//             spacing={1.5}
//             flexWrap="wrap"
//             useFlexGap
//             alignItems="center"
//             justifyContent="center"
//           >
//             <Typography variant="subtitle1" fontWeight="600" color="#334155" mr={1}>
//               Popular categories:
//             </Typography>
//             {categories.map((category) => {
//               const isSelected = selectedCategory === category;
//               return (
//                 <Chip
//                   key={category}
//                   label={category}
//                   onClick={() => setSelectedCategory(isSelected ? "" : category)}
//                   sx={{
//                     borderRadius: "24px",
//                     fontWeight: 500,
//                     fontSize: "0.875rem",
//                     px: 1.5,
//                     py: 2.2,
//                     cursor: "pointer",
//                     transition: "all 0.2s ease-in-out",
//                     bgcolor: isSelected ? "#008BDC" : "#FFFFFF",
//                     color: isSelected ? "white" : "#475569",
//                     border: "1px solid",
//                     borderColor: isSelected ? "#008BDC" : "#E2E8F0",
//                     boxShadow: isSelected ? "0 4px 12px rgba(0, 139, 220, 0.2)" : "none",
//                     "&:hover": {
//                       bgcolor: isSelected ? "#0073B7" : "#F1F5F9",
//                       borderColor: isSelected ? "#0073B7" : "#CBD5E1",
//                     },
//                   }}
//                 />
//               );
//             })}
//           </Stack>
//         </Box>

//         {/* Internship Grid */}
//         <Grid container spacing={4} mb={10}>
//           {filteredInternships.map((internship, index) => (
//             <Grid item xs={12} md={6} lg={4} key={internship._id || index}>
//               <Card
//                 elevation={0}
//                 sx={{
//                   borderRadius: 4,
//                   border: "1px solid #E2E8F0",
//                   bgcolor: "#FFFFFF",
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   transition: "all 0.25s ease",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.08)",
//                     borderColor: "#CBD5E1",
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 3.5 }}>
//                   <Stack
//                     direction="row"
//                     alignItems="center"
//                     spacing={0.75}
//                     sx={{
//                       bgcolor: "#E0F2FE",
//                       color: "#0369A1",
//                       px: 1.5,
//                       py: 0.6,
//                       borderRadius: "6px",
//                       width: "fit-content",
//                       mb: 2.5,
//                     }}
//                   >
//                     <ArrowUpRight sx={{ fontSize: 16 }} />
//                     <Typography variant="caption" fontWeight="700" letterSpacing="0.02em">
//                       Actively Hiring
//                     </Typography>
//                   </Stack>

//                   <Typography
//                     variant="h6"
//                     fontWeight="700"
//                     color="#0F172A"
//                     gutterBottom
//                     sx={{ fontSize: "1.15rem", lineHeight: 1.4 }}
//                   >
//                     {internship.title}
//                   </Typography>

//                   <Typography variant="body2" fontWeight="500" color="#64748B" mb={3}>
//                     {internship.company}
//                   </Typography>

//                   <Stack spacing={2} color="#475569" mb={4}>
//                     <Stack direction="row" alignItems="center" spacing={1.5}>
//                       <MapPin sx={{ fontSize: 18, color: "#94A3B8" }} />
//                       <Typography variant="body2" fontWeight="500">{internship.location}</Typography>
//                     </Stack>

//                     <Stack direction="row" alignItems="center" spacing={1.5}>
//                       <Banknote sx={{ fontSize: 18, color: "#94A3B8" }} />
//                       <Typography variant="body2" fontWeight="500">
//                         {internship.stipend ? `₹ ${internship.stipend}` : "TBD"}
//                       </Typography>
//                     </Stack>

//                     <Stack direction="row" alignItems="center" spacing={1.5}>
//                       <Calendar sx={{ fontSize: 18, color: "#94A3B8" }} />
//                       <Typography variant="body2" fontWeight="500">
//                         {internship.startDate || internship.duration || "Immediate"}
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     pt={2.5}
//                     borderTop="1px solid #F1F5F9"
//                   >
//                     <Chip
//                       label="Internship"
//                       size="small"
//                       sx={{
//                         bgcolor: "#F1F5F9",
//                         color: "#475569",
//                         fontWeight: 600,
//                         borderRadius: "6px",
//                         fontSize: "0.75rem",
//                       }}
//                     />
//                     <Button
//                       href={`/detailiternship/${internship._id}`}
//                       sx={{
//                         color: "#008BDC",
//                         textTransform: "none",
//                         fontWeight: "700",
//                         fontSize: "0.9rem",
//                         p: 0,
//                         "&:hover": { bgcolor: "transparent", color: "#0069A5" },
//                       }}
//                       endIcon={<ChevronRight />}
//                     >
//                      {t("common.viewDetails")}
//                     </Button>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Jobs Grid */}
//         <Box mb={10}>
//           <Grid container spacing={4}>
//             {filteredJobs.map((job, index) => (
//               <Grid item xs={12} md={6} lg={4} key={job._id || index}>
//                 <Card
//                   elevation={0}
//                   sx={{
//                     borderRadius: 4,
//                     border: "1px solid #E2E8F0",
//                     bgcolor: "#FFFFFF",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     transition: "all 0.25s ease",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                       boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.08)",
//                       borderColor: "#CBD5E1",
//                     },
//                   }}
//                 >
//                   <CardContent sx={{ p: 3.5 }}>
//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={0.75}
//                       sx={{
//                         bgcolor: "#E0F2FE",
//                         color: "#0369A1",
//                         px: 1.5,
//                         py: 0.6,
//                         borderRadius: "6px",
//                         width: "fit-content",
//                         mb: 2.5,
//                       }}
//                     >
//                       <ArrowUpRight sx={{ fontSize: 16 }} />
//                       <Typography variant="caption" fontWeight="700" letterSpacing="0.02em">
//                         Actively Hiring
//                       </Typography>
//                     </Stack>

//                     <Typography
//                       variant="h6"
//                       fontWeight="700"
//                       color="#0F172A"
//                       gutterBottom
//                       sx={{ fontSize: "1.15rem", lineHeight: 1.4 }}
//                     >
//                       {job.title}
//                     </Typography>

//                     <Typography variant="body2" fontWeight="500" color="#64748B" mb={3}>
//                       {job.company}
//                     </Typography>

//                     <Stack spacing={2} color="#475569" mb={4}>
//                       <Stack direction="row" alignItems="center" spacing={1.5}>
//                         <MapPin sx={{ fontSize: 18, color: "#94A3B8" }} />
//                         <Typography variant="body2" fontWeight="500">{job.location}</Typography>
//                       </Stack>

//                       <Stack direction="row" alignItems="center" spacing={1.5}>
//                         <Banknote sx={{ fontSize: 18, color: "#94A3B8" }} />
//                         <Typography variant="body2" fontWeight="500">
//                           {job.CTC ? `₹ ${job.CTC}` : "TBD"}
//                         </Typography>
//                       </Stack>

//                       <Stack direction="row" alignItems="center" spacing={1.5}>
//                         <Calendar sx={{ fontSize: 18, color: "#94A3B8" }} />
//                         <Typography variant="body2" fontWeight="500">
//                           {job.StartDate || job.Experience || "Immediate"}
//                         </Typography>
//                       </Stack>
//                     </Stack>

//                     <Stack
//                       direction="row"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       pt={2.5}
//                       borderTop="1px solid #F1F5F9"
//                     >
//                       <Chip
//                         label="Job"
//                         size="small"
//                         sx={{
//                           bgcolor: "#F1F5F9",
//                           color: "#475569",
//                           fontWeight: 600,
//                           borderRadius: "6px",
//                           fontSize: "0.75rem",
//                         }}
//                       />
//                       <Button
//                         href={`/detailjob/${job._id}`}
//                         sx={{
//                           color: "#008BDC",
//                           textTransform: "none",
//                           fontWeight: "700",
//                           fontSize: "0.9rem",
//                           p: 0,
//                           "&:hover": { bgcolor: "transparent", color: "#0069A5" },
//                         }}
//                         endIcon={<ChevronRight />}
//                       >
//                         View details
//                       </Button>
//                     </Stack>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Stats Section */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 4, md: 6 },
//             borderRadius: 5,
//             bgcolor: "#FFFFFF",
//             border: "1px solid #E2E8F0",
//           }}
//         >
//           <Grid container spacing={4}>
//             {stats.map((stat, index) => (
//               <Grid item xs={6} md={3} key={index} textAlign="center">
//                 <Typography
//                   variant="h3"
//                   fontWeight="800"
//                   color="#008BDC"
//                   sx={{
//                     mb: 1,
//                     fontSize: { xs: "1.75rem", md: "2.5rem" },
//                   }}
//                 >
//                   {stat.number}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   fontWeight="600"
//                   color="#64748B"
//                   sx={{ fontSize: "0.875rem", letterSpacing: "0.02em" }}
//                 >
//                   {stat.label}
//                 </Typography>
//               </Grid>
//             ))}
//           </Grid>
//         </Paper>
//       </Container>
//     </Box>
//   );
// }

