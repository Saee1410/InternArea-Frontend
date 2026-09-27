import { useTranslation } from "react-i18next";

import {
  Box,
  Container,
  Typography,
  IconButton,
} from "@mui/material";

import {
  ChevronRight,
  ChevronLeft,
} from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function SvgSlider() {
  const { t } = useTranslation();

  // ==========================================
  // SLIDER DATA
  // ==========================================

  const slides = [
    {
      title: t("home.growSkills"),
      bgColor:
        "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    },
    {
      title: t("home.startCareer"),
      bgColor:
        "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
    },
    {
      title: t("home.learnBest"),
      bgColor:
        "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    },
    {
      title: t("home.connectCompanies"),
      bgColor:
        "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        minHeight: "auto",
        py: 6,
      }}
    >
      <Container maxWidth="lg">

        {/* ==========================================
            TITLE
        ========================================== */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight={800}
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
            fontWeight={500}
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

        {/* ==========================================
            SWIPER
        ========================================== */}

        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "1100px",
            mx: "auto",
            borderRadius: 4,
            overflow: "hidden",

            "& .swiper-pagination": {
              bottom: "18px",
            },

            "& .swiper-pagination-bullet": {
              bgcolor: "rgba(255,255,255,0.6)",
              opacity: 1,
            },

            "& .swiper-pagination-bullet-active": {
              bgcolor: "#FFFFFF",
              width: 22,
              borderRadius: 10,
            },
          }}
        >

          {/* PREVIOUS BUTTON */}

          <IconButton
            className="custom-prev"
            sx={{
              position: "absolute",
              top: "50%",
              left: {
                xs: 8,
                md: 16,
              },
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "#FFFFFF",
              bgcolor: "rgba(0,0,0,0.2)",

              "&:hover": {
                bgcolor: "rgba(0,0,0,0.35)",
              },
            }}
          >
            <ChevronLeft
              sx={{
                fontSize: {
                  xs: 28,
                  md: 36,
                },
              }}
            />
          </IconButton>

          {/* NEXT BUTTON */}

          <IconButton
            className="custom-next"
            sx={{
              position: "absolute",
              top: "50%",
              right: {
                xs: 8,
                md: 16,
              },
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "#FFFFFF",
              bgcolor: "rgba(0,0,0,0.2)",

              "&:hover": {
                bgcolor: "rgba(0,0,0,0.35)",
              },
            }}
          >
            <ChevronRight
              sx={{
                fontSize: {
                  xs: 28,
                  md: 36,
                },
              }}
            />
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
              disableOnInteraction: false,
            }}
            loop
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>

                <Box
                  sx={{
                    position: "relative",
                    height: {
                      xs: 260,
                      sm: 280,
                      md: 320,
                    },
                    width: "100%",
                    background: slide.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  {/* ==========================================
                      SVG PATTERN
                  ========================================== */}

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.15,
                      pointerEvents: "none",
                    }}
                  >
                    <svg
                      width="100%"
                      height="100%"
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
                        width="100%"
                        height="100%"
                        fill={`url(#grid-pattern-${index})`}
                      />
                    </svg>
                  </Box>

                  {/* ==========================================
                      SLIDE TITLE
                  ========================================== */}

                  <Typography
                    variant="h3"
                    fontWeight={800}
                    color="#FFFFFF"
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      textAlign: "center",
                      px: 6,
                      fontSize: {
                        xs: "1.8rem",
                        sm: "2.3rem",
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

// // const API_URL = "http://localhost:5000";
// const API_URL = import.meta.env.VITE_API_URL;

// export default function SvgSlider() {
//   const { t } = useTranslation();

//   // =========================
//   // SLIDER DATA
//   // =========================
//   const slides = [
//     {
//       pattern: "pattern-3",
//       title: t("home.growSkills"),
//       bgColor:
//         "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
//     },
//     {
//       pattern: "pattern-1",
//       title: t("home.startCareer"),
//       bgColor:
//         "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
//     },
//     {
//       pattern: "pattern-2",
//       title: t("home.learnBest"),
//       bgColor:
//         "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
//     },
//     {
//       pattern: "pattern-4",
//       title: t("home.connectCompanies"),
//       bgColor:
//         "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
//     },
//   ];

//   // =========================
//   // STATE
//   // =========================
//   const [internships, setInternship] = useState([]);
//   const [jobs, setJob] = useState([]);

//   // =========================
//   // FETCH DATA
//   // =========================
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [internshipRes, jobRes] = await Promise.all([
//           axios.get(`${API_URL}/api/internships`),
//           axios.get(`${API_URL}/api/jobs`),
//         ]);

//         setInternship(internshipRes.data);
//         setJob(jobRes.data);
//       } catch (error) {
//         console.error("Error fetching listings:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // =========================
//   // UI
//   // =========================
//   return (
//     <Box
//       sx={{
//         bgcolor: "#FFFFFF",
//         minHeight: "100vh",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="lg">

//         {/* =========================
//             TITLE SECTION
//         ========================= */}
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
//               fontSize: {
//                 xs: "2rem",
//                 md: "2.75rem",
//               },
//             }}
//           >
//             {t("home.dreamCareer")}
//           </Typography>

//           <Typography
//             variant="h6"
//             fontWeight="500"
//             color="#475569"
//             sx={{
//               fontSize: {
//                 xs: "1.1rem",
//                 md: "1.25rem",
//               },
//             }}
//           >
//             {t("home.trending")}
//           </Typography>
//         </Box>

//         {/* =========================
//             SWIPER SLIDER SECTION
//         ========================= */}
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

//           {/* Custom Navigation - Previous */}
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

//               "&:hover": {
//                 bgcolor: "rgba(255, 255, 255, 0.4)",
//               },
//             }}
//           >
//             <ChevronLeft sx={{ fontSize: 36 }} />
//           </IconButton>

//           {/* Custom Navigation - Next */}
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

//               "&:hover": {
//                 bgcolor: "rgba(255, 255, 255, 0.4)",
//               },
//             }}
//           >
//             <ChevronRight sx={{ fontSize: 36 }} />
//           </IconButton>

//           <Swiper
//             modules={[
//               Navigation,
//               Pagination,
//               Autoplay,
//             ]}
//             spaceBetween={0}
//             slidesPerView={1}
//             navigation={{
//               prevEl: ".custom-prev",
//               nextEl: ".custom-next",
//             }}
//             pagination={{
//               clickable: true,
//             }}
//             autoplay={{
//               delay: 4000,
//             }}
//           >
//             {slides.map((slide, index) => (
//               <SwiperSlide key={index}>
//                 <Box
//                   sx={{
//                     position: "relative",
//                     height: {
//                       xs: 300,
//                       md: 260,
//                     },
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
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                       }}
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <pattern
//                         id={`grid-pattern-${index}`}
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
//                         fill={`url(#grid-pattern-${index})`}
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
//                       fontSize: {
//                         xs: "2rem",
//                         md: "3rem",
//                       },
//                     }}
//                   >
//                     {slide.title}
//                   </Typography>
//                 </Box>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </Box>

//         {/* =========================
//             INTERNSHIP GRID
//         ========================= */}
//         <Grid
//           container
//           spacing={3}
//           mb={8}
//         >
//           {internships.map((internship, index) => (
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
//                   borderRadius: 3,
//                   border: "1px solid #E2E8F0",
//                   bgcolor: "#FFFFFF",
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   transition: "all 0.2s ease",

//                   "&:hover": {
//                     boxShadow:
//                       "0 10px 20px -5px rgba(0, 0, 0, 0.08)",
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>

//                   {/* =========================
//                       ACTIVELY HIRING
//                   ========================= */}
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
//                     <ArrowUpRight
//                       sx={{ fontSize: 16 }}
//                     />

//                     <Typography
//                       variant="caption"
//                       fontWeight="700"
//                     >
//                       {t("home.activelyHiring")}
//                     </Typography>
//                   </Stack>

//                   {/* =========================
//                       INTERNSHIP TITLE
//                   ========================= */}
//                   <Typography
//                     variant="h6"
//                     fontWeight="700"
//                     color="#0F172A"
//                     mb={0.5}
//                   >
//                     {internship.title}
//                   </Typography>

//                   {/* =========================
//                       COMPANY
//                   ========================= */}
//                   <Typography
//                     variant="body2"
//                     fontWeight="500"
//                     color="#64748B"
//                     mb={2}
//                   >
//                     {internship.company}
//                   </Typography>

//                   {/* =========================
//                       DETAILS
//                   ========================= */}
//                   <Stack
//                     spacing={1.5}
//                     color="#475569"
//                     mb={3}
//                   >

//                     {/* Location */}
//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={1}
//                     >
//                       <MapPin
//                         sx={{
//                           fontSize: 18,
//                           color: "#94A3B8",
//                         }}
//                       />

//                       <Typography variant="body2">
//                         {internship.location}
//                       </Typography>
//                     </Stack>

//                     {/* Stipend */}
//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={1}
//                     >
//                       <Banknote
//                         sx={{
//                           fontSize: 18,
//                           color: "#94A3B8",
//                         }}
//                       />

//                       <Typography variant="body2">
//                         {internship.stipend
//                           ? `₹ ${internship.stipend}`
//                           : t("home.tbd")}
//                       </Typography>
//                     </Stack>

//                     {/* Date / Duration */}
//                     <Stack
//                       direction="row"
//                       alignItems="center"
//                       spacing={1}
//                     >
//                       <Calendar
//                         sx={{
//                           fontSize: 18,
//                           color: "#94A3B8",
//                         }}
//                       />

//                       <Typography variant="body2">
//                         {internship.startDate ||
//                           internship.duration ||
//                           t("home.immediate")}
//                       </Typography>
//                     </Stack>
//                   </Stack>

//                   {/* =========================
//                       FOOTER
//                   ========================= */}
//                   <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     pt={2}
//                     borderTop="1px solid #F1F5F9"
//                   >

//                     {/* Internship Chip */}
//                     <Chip
//                       label={t("home.internship")}
//                       size="small"
//                       sx={{
//                         bgcolor: "#F1F5F9",
//                         color: "#475569",
//                         fontWeight: 600,
//                       }}
//                     />

//                     {/* View Details */}
//                     <Button
//                       component={RouterLink}
//                       to={`/detailinternship/${internship._id}`}
//                       sx={{
//                         color: "#008BDC",
//                         textTransform: "none",
//                         fontWeight: 700,
//                       }}
//                       endIcon={<ChevronRight />}
//                     >
//                       {t("home.viewDetails")}
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
