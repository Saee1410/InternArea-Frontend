import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Box,
  Container,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Button,
  Slider,
  Paper,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import InternshipCard from "./Home/InternshipCard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Internships = () => {
  const { t, i18n } = useTranslation();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FILTERS
  // ==========================================

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [workFromHome, setWorkFromHome] = useState(false);
  const [partTime, setPartTime] = useState(false);

  const [stipend, setStipend] = useState([0, 100000]);

  // ==========================================
  // FETCH INTERNSHIPS
  // ==========================================

  useEffect(() => {
    fetchInternships();
  }, [i18n.language]);

  const fetchInternships = async () => {
    try {
      setLoading(true);

      const currentLang = i18n.language || "en";

      const res = await axios.get(
        "http://localhost:8000/api/internships",
        {
          params: { lang: currentLang },
        }
      );

      console.log("Internships:", res.data);

      if (Array.isArray(res.data)) {
        setInternships(res.data);
      } else {
        setInternships(res.data?.internships || []);
      }
    } catch (error) {
      console.error(
        "Fetch Internships Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STIPEND NUMBER HELPER
  // ==========================================

  const getStipendValue = (value) => {
    if (typeof value === "number") {
      return value;
    }

    const number = String(value || "")
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "");

    return Number(number) || 0;
  };

  // ==========================================
  // FILTER INTERNSHIPS
  // ==========================================

  const filteredInternships = internships.filter((item) => {
    // Category
    const categoryMatch =
      !category ||
      item.category
        ?.toLowerCase()
        .includes(category.toLowerCase());

    // Location
    const locationMatch =
      !location ||
      item.location
        ?.toLowerCase()
        .includes(location.toLowerCase());

    // Work From Home
    const workFromHomeMatch =
      !workFromHome ||
      item.location
        ?.toLowerCase()
        .includes("work from home") ||
      item.workMode
        ?.toLowerCase()
        .includes("work from home") ||
      item.workType
        ?.toLowerCase()
        .includes("work from home");

    // Part Time
    const partTimeMatch =
      !partTime ||
      item.jobType
        ?.toLowerCase()
        .includes("part-time") ||
      item.type
        ?.toLowerCase()
        .includes("part-time") ||
      item.employmentType
        ?.toLowerCase()
        .includes("part-time");

    // Stipend
    const stipendValue = getStipendValue(item.stipend);

    const stipendMatch =
      stipendValue >= stipend[0] &&
      stipendValue <= stipend[1];

    return (
      categoryMatch &&
      locationMatch &&
      workFromHomeMatch &&
      partTimeMatch &&
      stipendMatch
    );
  });

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setCategory("");
    setLocation("");
    setWorkFromHome(false);
    setPartTime(false);
    setStipend([0, 100000]);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <CircularProgress />
        </Box>

        <Footer />
      </>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          background: "#f8fafc",
          minHeight: "70vh",
          py: 5,
        }}
      >
        <Container maxWidth="xl">

          <Grid container spacing={4}>

            {/* ================================= */}
            {/* FILTER SIDEBAR */}
            {/* ================================= */}

            <Grid item xs={12} md={3}>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  position: "sticky",
                  top: 20,
                }}
              >

                {/* HEADER */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >

                    <FilterAltOutlinedIcon
                      sx={{
                        color: "#00A5EC",
                      }}
                    />

                    <Typography fontWeight={700}>
                      {t("internships.filters")}
                    </Typography>

                  </Box>

                  <Button
                    onClick={clearFilters}
                    sx={{
                      color: "#00A5EC",
                      textTransform: "none",
                      fontSize: 13,
                    }}
                  >
                    {t("internships.clearAll")}
                  </Button>

                </Box>

                {/* ================================= */}
                {/* CATEGORY */}
                {/* ================================= */}

                <Typography
                  fontWeight={600}
                  mb={1}
                >
                  {t("internships.category")}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("internships.categoryPlaceholder")}
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  sx={{
                    mb: 3,
                  }}
                />

                {/* ================================= */}
                {/* LOCATION */}
                {/* ================================= */}

                <Typography
                  fontWeight={600}
                  mb={1}
                >
                  {t("internships.location")}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("internships.locationPlaceholder")}
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  sx={{
                    mb: 3,
                  }}
                />

                {/* ================================= */}
                {/* WORK FROM HOME */}
                {/* ================================= */}

                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={workFromHome}
                      onChange={(e) =>
                        setWorkFromHome(
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={t("internships.workFromHome")}
                  sx={{
                    display: "block",
                    mb: 1,
                  }}
                />

                {/* ================================= */}
                {/* PART TIME */}
                {/* ================================= */}

                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={partTime}
                      onChange={(e) =>
                        setPartTime(
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={t("internships.partTime")}
                  sx={{
                    display: "block",
                    mb: 3,
                  }}
                />

                {/* ================================= */}
                {/* STIPEND */}
                {/* ================================= */}

                <Typography
                  fontWeight={600}
                  mb={2}
                >
                  {t("internships.monthlyStipend")}
                </Typography>

                <Slider
                  value={stipend}
                  onChange={(event, newValue) =>
                    setStipend(newValue)
                  }
                  valueLabelDisplay="auto"
                  min={0}
                  max={100000}
                  step={1000}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >

                  <Typography fontSize={13}>
                    ₹0
                  </Typography>

                  <Typography fontSize={13}>
                    ₹50K
                  </Typography>

                  <Typography fontSize={13}>
                    ₹100K
                  </Typography>

                </Box>

              </Paper>

            </Grid>

            {/* ================================= */}
            {/* RESULTS */}
            {/* ================================= */}

            <Grid item xs={12} md={9}>

              {/* RESULT COUNT */}

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                }}
              >

                <Typography
                  fontWeight={600}
                  textAlign="center"
                >
                  {t("internships.internshipsFound", {
                    count: filteredInternships.length,
                  })}
                </Typography>

              </Paper>

              {/* NO RESULTS */}

              {filteredInternships.length === 0 ? (

                <Typography
                  textAlign="center"
                  sx={{
                    py: 8,
                    color: "text.secondary",
                  }}
                >
                  {t("internships.noInternshipsFound")}
                </Typography>

              ) : (

                /* INTERNSHIP CARDS */

                <Grid container spacing={3}>

                  {filteredInternships.map(
                    (internship) => (

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={4}
                        key={internship._id}
                      >

                        <InternshipCard
                          internship={internship}
                          type="internship"
                        />

                      </Grid>

                    )
                  )}

                </Grid>

              )}

            </Grid>

          </Grid>

        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default Internships;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Container,
//   TextField,
//   Grid,
//   Typography,
//   CircularProgress,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Slider,
//   Paper,
// } from "@mui/material";

// import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

// import InternshipCard from "./Home/InternshipCard";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";

// const Internships = () => {
//   const { t } = useTranslation();

//   const [internships, setInternships] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ==========================================
//   // FILTERS
//   // ==========================================

//   const [category, setCategory] = useState("");
//   const [location, setLocation] = useState("");

//   const [workFromHome, setWorkFromHome] = useState(false);
//   const [partTime, setPartTime] = useState(false);

//   const [stipend, setStipend] = useState([0, 100000]);

//   // ==========================================
//   // FETCH INTERNSHIPS
//   // ==========================================

//   useEffect(() => {
//     fetchInternships();
//   }, []);

//   const fetchInternships = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:8000/api/internships"
//       );

//       console.log("Internships:", res.data);

//       if (Array.isArray(res.data)) {
//         setInternships(res.data);
//       } else {
//         setInternships(res.data?.internships || []);
//       }
//     } catch (error) {
//       console.error(
//         "Fetch Internships Error:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // STIPEND NUMBER HELPER
//   // ==========================================

//   const getStipendValue = (value) => {
//     if (typeof value === "number") {
//       return value;
//     }

//     const number = String(value || "")
//       .replace(/,/g, "")
//       .replace(/[^\d.]/g, "");

//     return Number(number) || 0;
//   };

//   // ==========================================
//   // FILTER INTERNSHIPS
//   // ==========================================

//   const filteredInternships = internships.filter((item) => {
//     // Category
//     const categoryMatch =
//       !category ||
//       item.category
//         ?.toLowerCase()
//         .includes(category.toLowerCase());

//     // Location
//     const locationMatch =
//       !location ||
//       item.location
//         ?.toLowerCase()
//         .includes(location.toLowerCase());

//     // Work From Home
//     const workFromHomeMatch =
//       !workFromHome ||
//       item.location
//         ?.toLowerCase()
//         .includes("work from home") ||
//       item.workMode
//         ?.toLowerCase()
//         .includes("work from home") ||
//       item.workType
//         ?.toLowerCase()
//         .includes("work from home");

//     // Part Time
//     const partTimeMatch =
//       !partTime ||
//       item.jobType
//         ?.toLowerCase()
//         .includes("part-time") ||
//       item.type
//         ?.toLowerCase()
//         .includes("part-time") ||
//       item.employmentType
//         ?.toLowerCase()
//         .includes("part-time");

//     // Stipend
//     const stipendValue = getStipendValue(item.stipend);

//     const stipendMatch =
//       stipendValue >= stipend[0] &&
//       stipendValue <= stipend[1];

//     return (
//       categoryMatch &&
//       locationMatch &&
//       workFromHomeMatch &&
//       partTimeMatch &&
//       stipendMatch
//     );
//   });

//   // ==========================================
//   // CLEAR FILTERS
//   // ==========================================

//   const clearFilters = () => {
//     setCategory("");
//     setLocation("");
//     setWorkFromHome(false);
//     setPartTime(false);
//     setStipend([0, 100000]);
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return (
//       <>
//         <Navbar />

//         <Box
//           sx={{
//             minHeight: "70vh",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             background: "#f8fafc",
//           }}
//         >
//           <CircularProgress />
//         </Box>

//         <Footer />
//       </>
//     );
//   }

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           background: "#f8fafc",
//           minHeight: "70vh",
//           py: 5,
//         }}
//       >
//         <Container maxWidth="xl">

//           <Grid container spacing={4}>

//             {/* ================================= */}
//             {/* FILTER SIDEBAR */}
//             {/* ================================= */}

//             <Grid item xs={12} md={3}>

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   borderRadius: 3,
//                   border: "1px solid #e5e7eb",
//                   position: "sticky",
//                   top: 20,
//                 }}
//               >

//                 {/* HEADER */}

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     mb: 3,
//                   }}
//                 >

//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                     }}
//                   >

//                     <FilterAltOutlinedIcon
//                       sx={{
//                         color: "#00A5EC",
//                       }}
//                     />

//                     <Typography fontWeight={700}>
//                       {t("internships.filters")}
//                     </Typography>

//                   </Box>

//                   <Button
//                     onClick={clearFilters}
//                     sx={{
//                       color: "#00A5EC",
//                       textTransform: "none",
//                       fontSize: 13,
//                     }}
//                   >
//                     {t("internships.clearAll")}
//                   </Button>

//                 </Box>

//                 {/* ================================= */}
//                 {/* CATEGORY */}
//                 {/* ================================= */}

//                 <Typography
//                   fontWeight={600}
//                   mb={1}
//                 >
//                   {t("internships.category")}
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder={t("internships.categoryPlaceholder")}
//                   value={category}
//                   onChange={(e) =>
//                     setCategory(e.target.value)
//                   }
//                   sx={{
//                     mb: 3,
//                   }}
//                 />

//                 {/* ================================= */}
//                 {/* LOCATION */}
//                 {/* ================================= */}

//                 <Typography
//                   fontWeight={600}
//                   mb={1}
//                 >
//                   {t("internships.location")}
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder={t("internships.locationPlaceholder")}
//                   value={location}
//                   onChange={(e) =>
//                     setLocation(e.target.value)
//                   }
//                   sx={{
//                     mb: 3,
//                   }}
//                 />

//                 {/* ================================= */}
//                 {/* WORK FROM HOME */}
//                 {/* ================================= */}

//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       size="small"
//                       checked={workFromHome}
//                       onChange={(e) =>
//                         setWorkFromHome(
//                           e.target.checked
//                         )
//                       }
//                     />
//                   }
//                   label={t("internships.workFromHome")}
//                   sx={{
//                     display: "block",
//                     mb: 1,
//                   }}
//                 />

//                 {/* ================================= */}
//                 {/* PART TIME */}
//                 {/* ================================= */}

//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       size="small"
//                       checked={partTime}
//                       onChange={(e) =>
//                         setPartTime(
//                           e.target.checked
//                         )
//                       }
//                     />
//                   }
//                   label={t("internships.partTime")}
//                   sx={{
//                     display: "block",
//                     mb: 3,
//                   }}
//                 />

//                 {/* ================================= */}
//                 {/* STIPEND */}
//                 {/* ================================= */}

//                 <Typography
//                   fontWeight={600}
//                   mb={2}
//                 >
//                   {t("internships.monthlyStipend")}
//                 </Typography>

//                 <Slider
//                   value={stipend}
//                   onChange={(event, newValue) =>
//                     setStipend(newValue)
//                   }
//                   valueLabelDisplay="auto"
//                   min={0}
//                   max={100000}
//                   step={1000}
//                 />

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mt: 1,
//                   }}
//                 >

//                   <Typography fontSize={13}>
//                     ₹0
//                   </Typography>

//                   <Typography fontSize={13}>
//                     ₹50K
//                   </Typography>

//                   <Typography fontSize={13}>
//                     ₹100K
//                   </Typography>

//                 </Box>

//               </Paper>

//             </Grid>

//             {/* ================================= */}
//             {/* RESULTS */}
//             {/* ================================= */}

//             <Grid item xs={12} md={9}>

//               {/* RESULT COUNT */}

//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   mb: 3,
//                   borderRadius: 3,
//                   border: "1px solid #e5e7eb",
//                 }}
//               >

//                 <Typography
//                   fontWeight={600}
//                   textAlign="center"
//                 >
//                   {t("internships.internshipsFound", {
//                     count: filteredInternships.length,
//                   })}
//                 </Typography>

//               </Paper>

//               {/* NO RESULTS */}

//               {filteredInternships.length === 0 ? (

//                 <Typography
//                   textAlign="center"
//                   sx={{
//                     py: 8,
//                     color: "text.secondary",
//                   }}
//                 >
//                   {t("internships.noInternshipsFound")}
//                 </Typography>

//               ) : (

//                 /* INTERNSHIP CARDS */

//                 <Grid container spacing={3}>

//                   {filteredInternships.map(
//                     (internship) => (

//                       <Grid
//                         item
//                         xs={12}
//                         sm={6}
//                         lg={4}
//                         key={internship._id}
//                       >

//                         <InternshipCard
//                           internship={internship}
//                           type="internship"
//                         />

//                       </Grid>

//                     )
//                   )}

//                 </Grid>

//               )}

//             </Grid>

//           </Grid>

//         </Container>
//       </Box>

//       <Footer />
//     </>
//   );
// };

// export default Internships;

