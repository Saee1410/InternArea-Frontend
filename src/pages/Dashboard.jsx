import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/layout/Navbar";

import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      title: t("dashboard.jobApplications"),
      count: "120",
      subtitle: t("dashboard.totalApplications"),
      icon: <PeopleIcon sx={{ fontSize: 36 }} />,
      color: "#008BDC",
      bgColor: "#E3F2FD",
      btnText: t("dashboard.viewApplications"),
      path: "/admin-applications",
    },
    {
      title: t("dashboard.addJob"),
      count: t("dashboard.createJob"),
      subtitle: t("dashboard.postNewJob"),
      icon: <WorkIcon sx={{ fontSize: 36 }} />,
      color: "#2E7D32",
      bgColor: "#E8F5E9",
      btnText: t("dashboard.postNewJobButton"),
      path: "/job",
    },
    {
      title: t("dashboard.addInternship"),
      count: t("dashboard.createInternship"),
      subtitle: t("dashboard.postNewInternship"),
      icon: <SchoolIcon sx={{ fontSize: 36 }} />,
      color: "#ED6C02",
      bgColor: "#FFF3E0",
      btnText: t("dashboard.postInternship"),
      path: "/internship",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          flexGrow: 1,
        }}
      >
        <Box mb={5}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background:
                "linear-gradient(45deg, #008BDC, #005691)",
              backgroundClip: "text",
              textFillColor: "transparent",
              letterSpacing: "-0.5px",
              mb: 1,
            }}
          >
            {t("dashboard.title")}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            {t("dashboard.description")}
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {cards.map((card, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: "flex" }}
            >
              <Card
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  border:
                    "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow:
                    "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
                  transition:
                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 1,

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                      "0 20px 35px -10px rgba(0, 0, 0, 0.12)",
                    borderColor: card.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="text.secondary"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                          my: 1,
                          color: "#1E293B",
                        }}
                      >
                        {card.count}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {card.subtitle}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 1.8,
                        borderRadius: 3,
                        bgcolor: card.bgColor,
                        color: card.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(card.path)}
                    sx={{
                      mt: 3,
                      py: 1.2,
                      borderRadius: 2.5,
                      bgcolor: card.color,
                      textTransform: "none",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      boxShadow: "none",

                      "&:hover": {
                        bgcolor: card.color,
                        opacity: 0.9,
                        boxShadow:
                          `0 8px 16px -4px ${card.color}66`,
                      },
                    }}
                  >
                    {card.btnText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;





// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";

// import WorkIcon from "@mui/icons-material/Work";
// import SchoolIcon from "@mui/icons-material/School";
// import PeopleIcon from "@mui/icons-material/People";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// function Dashboard() {
//   const navigate = useNavigate();

//   const cards = [
//     {
//       title: "Job Applications",
//       count: "120",
//       subtitle: "Total received applications",
//       icon: <PeopleIcon sx={{ fontSize: 36 }} />,
//       color: "#008BDC",
//       bgColor: "#E3F2FD",
//       btnText: "View Applications",
//       path: "/admin-applications", // तुमच्या रूट्सनुसार हा पाथ बदला
//     },
//     {
//       title: "Add Job",
//       count: "Create Job",
//       subtitle: "Post a new job opening",
//       icon: <WorkIcon sx={{ fontSize: 36 }} />,
//       color: "#2E7D32",
//       bgColor: "#E8F5E9",
//       btnText: "Post New Job",
//       path: "/job",
//     },
//     {
//       title: "Add Internship",
//       count: "Create Internship",
//       subtitle: "Post a new internship",
//       icon: <SchoolIcon sx={{ fontSize: 36 }} />,
//       color: "#ED6C02",
//       bgColor: "#FFF3E0",
//       btnText: "Post Internship",
//       path: "/internship",
//     },
//   ];

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", display: "flex", flexDirection: "column" }}>
//       {/* Navbar */}
//       <Navbar />

//       <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
//         {/* Header Section */}
//         <Box mb={5}>
//           <Typography
//             variant="h4"
//             fontWeight={800}
//             sx={{
//               background: "linear-gradient(45deg, #008BDC, #005691)",
//               backgroundClip: "text",
//               textFillColor: "transparent",
//               letterSpacing: "-0.5px",
//               mb: 1,
//             }}
//           >
//             Admin Dashboard
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Manage your job postings, internships, and applicant tracking from one place.
//           </Typography>
//         </Box>

//         {/* Cards Grid */}
//         <Grid container spacing={3.5}>
//           {cards.map((card, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>
//               <Card
//                 sx={{
//                   width: "100%",
//                   borderRadius: 4,
//                   border: "1px solid rgba(226, 232, 240, 0.8)",
//                   boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
//                   transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                   background: "#FFFFFF",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   p: 1,
//                   "&:hover": {
//                     transform: "translateY(-6px)",
//                     boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.12)",
//                     borderColor: card.color,
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       mb: 2,
//                     }}
//                   >
//                     <Box>
//                       <Typography
//                         variant="subtitle2"
//                         fontWeight={700}
//                         color="text.secondary"
//                         sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
//                       >
//                         {card.title}
//                       </Typography>
//                       <Typography
//                         variant="h4"
//                         fontWeight={800}
//                         sx={{ my: 1, color: "#1E293B" }}
//                       >
//                         {card.count}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {card.subtitle}
//                       </Typography>
//                     </Box>

//                     {/* Icon Container with subtle background */}
//                     <Box
//                       sx={{
//                         p: 1.8,
//                         borderRadius: 3,
//                         bgcolor: card.bgColor,
//                         color: card.color,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {card.icon}
//                     </Box>
//                   </Box>

//                   {/* Action Button for All Cards */}
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     endIcon={<ArrowForwardIcon />}
//                     onClick={() => navigate(card.path)}
//                     sx={{
//                       mt: 3,
//                       py: 1.2,
//                       borderRadius: 2.5,
//                       bgcolor: card.color,
//                       textTransform: "none",
//                       fontSize: "0.95rem",
//                       fontWeight: 700,
//                       boxShadow: "none",
//                       "&:hover": {
//                         bgcolor: card.color,
//                         opacity: 0.9,
//                         boxShadow: `0 8px 16px -4px ${card.color}66`,
//                       },
//                     }}
//                   >
//                     {card.btnText}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

// export default Dashboard;
