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

const Jobs = () => {
  const { t, i18n } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const [workFromHome, setWorkFromHome] = useState(false);
  const [partTime, setPartTime] = useState(false);

  const [salary, setSalary] = useState([0, 100]);

  // ==========================================
  // FETCH JOBS
  // ==========================================

  useEffect(() => {
    fetchJobs();
  }, [i18n.language]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const currentLang = i18n.language || "en";

      const res = await axios.get(
        `${API_URL}/api/jobs`,
        {
          params: { lang: currentLang },
        }
      );

      console.log("Jobs:", res.data);

      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        setJobs(res.data?.jobs || []);
      }
    } catch (error) {
      console.log(
        "Job Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // NUMBER HELPER
  // ==========================================

  const getNumber = (value) => {
    if (typeof value === "number") {
      return value;
    }

    const number = String(value || "")
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "");

    return Number(number) || 0;
  };

  // ==========================================
  // WORK FROM HOME HELPER
  // ==========================================

  const isWorkFromHome = (item) => {
    const workValues = [
      item.location,
      item.workMode,
      item.workType,
      item.remote,
      item.remoteType,
      item.jobType,
      item.type,
      item.employmentType,
    ];

    return workValues.some((value) => {
      const text = String(value || "").toLowerCase().trim();

      return (
        text.includes("work from home") ||
        text.includes("work-from-home") ||
        text.includes("remote") ||
        text.includes("wfh") ||
        text.includes("work remotely")
      );
    });
  };

  // ==========================================
  // FILTER JOBS
  // ==========================================

  const filteredJobs = jobs.filter((item) => {
    const categoryMatch =
      !category ||
      item.category
        ?.toLowerCase()
        .includes(category.toLowerCase());

    const locationMatch =
      !location ||
      item.location
        ?.toLowerCase()
        .includes(location.toLowerCase());

    const experienceMatch =
      !experience ||
      item.experience
        ?.toLowerCase()
        .includes(experience.toLowerCase());

    // WORK FROM HOME
    const workFromHomeMatch =
      !workFromHome || isWorkFromHome(item);

    // PART TIME
    const partTimeMatch =
      !partTime ||
      String(item.jobType || "")
        .toLowerCase()
        .includes("part-time") ||
      String(item.type || "")
        .toLowerCase()
        .includes("part-time") ||
      String(item.employmentType || "")
        .toLowerCase()
        .includes("part-time");

    const salaryValue = getNumber(
      item.salary ||
        item.annualSalary ||
        item.ctc
    );

    const salaryMatch =
      salaryValue >= salary[0] &&
      salaryValue <= salary[1];

    return (
      categoryMatch &&
      locationMatch &&
      experienceMatch &&
      workFromHomeMatch &&
      partTimeMatch &&
      salaryMatch
    );
  });

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setCategory("");
    setLocation("");
    setExperience("");
    setWorkFromHome(false);
    setPartTime(false);
    setSalary([0, 100]);
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
                      {t("jobs.filters")}
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
                    {t("jobs.clearAll")}
                  </Button>

                </Box>

                {/* CATEGORY */}

                <Typography
                  fontWeight={600}
                  mb={1}
                >
                  {t("jobs.category")}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("jobs.categoryPlaceholder")}
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  sx={{
                    mb: 3,
                  }}
                />

                {/* LOCATION */}

                <Typography
                  fontWeight={600}
                  mb={1}
                >
                  {t("jobs.location")}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("jobs.locationPlaceholder")}
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  sx={{
                    mb: 3,
                  }}
                />

                {/* EXPERIENCE */}

                <Typography
                  fontWeight={600}
                  mb={1}
                >
                  {t("jobs.experience")}
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder={t("jobs.experiencePlaceholder")}
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                  sx={{
                    mb: 3,
                  }}
                />

                {/* WORK FROM HOME */}

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
                  label={t("jobs.workFromHome")}
                  sx={{
                    display: "block",
                    mb: 1,
                  }}
                />

                {/* PART TIME */}

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
                  label={t("jobs.partTime")}
                  sx={{
                    display: "block",
                    mb: 3,
                  }}
                />

                {/* SALARY */}

                <Typography
                  fontWeight={600}
                  mb={2}
                >
                  {t("jobs.annualSalary")}
                </Typography>

                <Slider
                  value={salary}
                  onChange={(e, value) =>
                    setSalary(value)
                  }
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >

                  <Typography fontSize={13}>
                    ₹0L
                  </Typography>

                  <Typography fontSize={13}>
                    ₹50L
                  </Typography>

                  <Typography fontSize={13}>
                    ₹100L
                  </Typography>

                </Box>

              </Paper>

            </Grid>

            {/* ================================= */}
            {/* RESULTS */}
            {/* ================================= */}

            <Grid item xs={12} md={9}>

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
                  {t("jobs.jobsFound", {
                    count: filteredJobs.length,
                  })}
                </Typography>

              </Paper>

              {/* NO RESULTS */}

              {filteredJobs.length === 0 ? (

                <Typography
                  textAlign="center"
                  sx={{
                    py: 8,
                    color: "text.secondary",
                  }}
                >
                  {t("jobs.noJobsFound")}
                </Typography>

              ) : (

                <Grid container spacing={3}>

                  {filteredJobs.map((job) => (

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={4}
                      key={job._id}
                    >

                      <InternshipCard
                        internship={job}
                        type="job"
                      />

                    </Grid>

                  ))}

                </Grid>

              )}

            </Grid>

          </Grid>

        </Container>

        <Footer />

      </Box>
    </>
  );
};

export default Jobs;




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

// const Jobs = () => {
//   const { t, i18n } = useTranslation();
//    const API_URL = import.meta.env.VITE_API_URL;

//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [category, setCategory] = useState("");
//   const [location, setLocation] = useState("");
//   const [experience, setExperience] = useState("");

//   const [workFromHome, setWorkFromHome] = useState(false);
//   const [partTime, setPartTime] = useState(false);

//   const [salary, setSalary] = useState([0, 100]);

//   // ==========================================
//   // FETCH JOBS
//   // ==========================================

//   useEffect(() => {
//     fetchJobs();
//   }, [i18n.language]);

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);

//       const currentLang = i18n.language || "en";

//       const res = await axios.get(
//         `${API_URL}/api/jobs`,
//         {
//           params: { lang: currentLang },
//         }
//       );

//       console.log("Jobs:", res.data);

//       if (Array.isArray(res.data)) {
//         setJobs(res.data);
//       } else {
//         setJobs(res.data?.jobs || []);
//       }
//     } catch (error) {
//       console.log(
//         "Job Error:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // NUMBER HELPER
//   // ==========================================

//   const getNumber = (value) => {
//     if (typeof value === "number") {
//       return value;
//     }

//     const number = String(value || "")
//       .replace(/,/g, "")
//       .replace(/[^\d.]/g, "");

//     return Number(number) || 0;
//   };

//   // ==========================================
//   // FILTER JOBS
//   // ==========================================

//   const filteredJobs = jobs.filter((item) => {
//     const categoryMatch =
//       !category ||
//       item.category
//         ?.toLowerCase()
//         .includes(category.toLowerCase());

//     const locationMatch =
//       !location ||
//       item.location
//         ?.toLowerCase()
//         .includes(location.toLowerCase());

//     const experienceMatch =
//       !experience ||
//       item.experience
//         ?.toLowerCase()
//         .includes(experience.toLowerCase());

//     const workFromHomeMatch =
//       !workFromHome ||
//       item.location
//         ?.toLowerCase()
//         .includes("work from home") ||
//       item.workMode
//         ?.toLowerCase()
//         .includes("work from home");

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

//     const salaryValue = getNumber(
//       item.salary ||
//         item.annualSalary ||
//         item.ctc
//     );

//     const salaryMatch =
//       salaryValue >= salary[0] &&
//       salaryValue <= salary[1];

//     return (
//       categoryMatch &&
//       locationMatch &&
//       experienceMatch &&
//       workFromHomeMatch &&
//       partTimeMatch &&
//       salaryMatch
//     );
//   });

//   // ==========================================
//   // CLEAR FILTERS
//   // ==========================================

//   const clearFilters = () => {
//     setCategory("");
//     setLocation("");
//     setExperience("");
//     setWorkFromHome(false);
//     setPartTime(false);
//     setSalary([0, 100]);
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
//                       {t("jobs.filters")}
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
//                     {t("jobs.clearAll")}
//                   </Button>

//                 </Box>

//                 {/* CATEGORY */}

//                 <Typography
//                   fontWeight={600}
//                   mb={1}
//                 >
//                   {t("jobs.category")}
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder={t("jobs.categoryPlaceholder")}
//                   value={category}
//                   onChange={(e) =>
//                     setCategory(e.target.value)
//                   }
//                   sx={{
//                     mb: 3,
//                   }}
//                 />

//                 {/* LOCATION */}

//                 <Typography
//                   fontWeight={600}
//                   mb={1}
//                 >
//                   {t("jobs.location")}
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder={t("jobs.locationPlaceholder")}
//                   value={location}
//                   onChange={(e) =>
//                     setLocation(e.target.value)
//                   }
//                   sx={{
//                     mb: 3,
//                   }}
//                 />

//                 {/* EXPERIENCE */}

//                 <Typography
//                   fontWeight={600}
//                   mb={1}
//                 >
//                   {t("jobs.experience")}
//                 </Typography>

//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder={t("jobs.experiencePlaceholder")}
//                   value={experience}
//                   onChange={(e) =>
//                     setExperience(e.target.value)
//                   }
//                   sx={{
//                     mb: 3,
//                   }}
//                 />

//                 {/* WORK FROM HOME */}

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
//                   label={t("jobs.workFromHome")}
//                   sx={{
//                     display: "block",
//                     mb: 1,
//                   }}
//                 />

//                 {/* PART TIME */}

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
//                   label={t("jobs.partTime")}
//                   sx={{
//                     display: "block",
//                     mb: 3,
//                   }}
//                 />

//                 {/* SALARY */}

//                 <Typography
//                   fontWeight={600}
//                   mb={2}
//                 >
//                   {t("jobs.annualSalary")}
//                 </Typography>

//                 <Slider
//                   value={salary}
//                   onChange={(e, value) =>
//                     setSalary(value)
//                   }
//                   valueLabelDisplay="auto"
//                   min={0}
//                   max={100}
//                   step={1}
//                 />

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mt: 1,
//                   }}
//                 >

//                   <Typography fontSize={13}>
//                     ₹0L
//                   </Typography>

//                   <Typography fontSize={13}>
//                     ₹50L
//                   </Typography>

//                   <Typography fontSize={13}>
//                     ₹100L
//                   </Typography>

//                 </Box>

//               </Paper>

//             </Grid>

//             {/* ================================= */}
//             {/* RESULTS */}
//             {/* ================================= */}

//             <Grid item xs={12} md={9}>

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
//                   {t("jobs.jobsFound", {
//                     count: filteredJobs.length,
//                   })}
//                 </Typography>

//               </Paper>

//               {/* NO RESULTS */}

//               {filteredJobs.length === 0 ? (

//                 <Typography
//                   textAlign="center"
//                   sx={{
//                     py: 8,
//                     color: "text.secondary",
//                   }}
//                 >
//                   {t("jobs.noJobsFound")}
//                 </Typography>

//               ) : (

//                 <Grid container spacing={3}>

//                   {filteredJobs.map((job) => (

//                     <Grid
//                       item
//                       xs={12}
//                       sm={6}
//                       lg={4}
//                       key={job._id}
//                     >

//                       <InternshipCard
//                         internship={job}
//                         type="job"
//                       />

//                     </Grid>

//                   ))}

//                 </Grid>

//               )}

//             </Grid>

//           </Grid>

//         </Container>

//         <Footer />

//       </Box>
//     </>
//   );
// };

// export default Jobs;



// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useTranslation } from "react-i18next";

// // import {
// //   Box,
// //   Container,
// //   TextField,
// //   Grid,
// //   Typography,
// //   CircularProgress,
// //   Checkbox,
// //   FormControlLabel,
// //   Button,
// //   Slider,
// //   Paper,
// // } from "@mui/material";

// // import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

// // import InternshipCard from "./Home/InternshipCard";
// // import Navbar from "../components/layout/Navbar";
// // import Footer from "../components/layout/Footer";

// // const Jobs = () => {
// //   const { t } = useTranslation();

// //   const [jobs, setJobs] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [category, setCategory] = useState("");
// //   const [location, setLocation] = useState("");
// //   const [experience, setExperience] = useState("");

// //   const [workFromHome, setWorkFromHome] = useState(false);
// //   const [partTime, setPartTime] = useState(false);

// //   const [salary, setSalary] = useState([0, 100]);

// //   // ==========================================
// //   // FETCH JOBS
// //   // ==========================================

// //   useEffect(() => {
// //     fetchJobs();
// //   }, []);

// //   const fetchJobs = async () => {
// //     try {
// //       setLoading(true);

// //       const res = await axios.get(
// //         "http://localhost:8000/api/jobs"
// //       );

// //       console.log("Jobs:", res.data);

// //       if (Array.isArray(res.data)) {
// //         setJobs(res.data);
// //       } else {
// //         setJobs(res.data?.jobs || []);
// //       }
// //     } catch (error) {
// //       console.log(
// //         "Job Error:",
// //         error.response?.data || error.message
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ==========================================
// //   // NUMBER HELPER
// //   // ==========================================

// //   const getNumber = (value) => {
// //     if (typeof value === "number") {
// //       return value;
// //     }

// //     const number = String(value || "")
// //       .replace(/,/g, "")
// //       .replace(/[^\d.]/g, "");

// //     return Number(number) || 0;
// //   };

// //   // ==========================================
// //   // FILTER JOBS
// //   // ==========================================

// //   const filteredJobs = jobs.filter((item) => {
// //     const categoryMatch =
// //       !category ||
// //       item.category
// //         ?.toLowerCase()
// //         .includes(category.toLowerCase());

// //     const locationMatch =
// //       !location ||
// //       item.location
// //         ?.toLowerCase()
// //         .includes(location.toLowerCase());

// //     const experienceMatch =
// //       !experience ||
// //       item.experience
// //         ?.toLowerCase()
// //         .includes(experience.toLowerCase());

// //     const workFromHomeMatch =
// //       !workFromHome ||
// //       item.location
// //         ?.toLowerCase()
// //         .includes("work from home") ||
// //       item.workMode
// //         ?.toLowerCase()
// //         .includes("work from home");

// //     const partTimeMatch =
// //       !partTime ||
// //       item.jobType
// //         ?.toLowerCase()
// //         .includes("part-time") ||
// //       item.type
// //         ?.toLowerCase()
// //         .includes("part-time") ||
// //       item.employmentType
// //         ?.toLowerCase()
// //         .includes("part-time");

// //     const salaryValue = getNumber(
// //       item.salary ||
// //         item.annualSalary ||
// //         item.ctc
// //     );

// //     const salaryMatch =
// //       salaryValue >= salary[0] &&
// //       salaryValue <= salary[1];

// //     return (
// //       categoryMatch &&
// //       locationMatch &&
// //       experienceMatch &&
// //       workFromHomeMatch &&
// //       partTimeMatch &&
// //       salaryMatch
// //     );
// //   });

// //   // ==========================================
// //   // CLEAR FILTERS
// //   // ==========================================

// //   const clearFilters = () => {
// //     setCategory("");
// //     setLocation("");
// //     setExperience("");
// //     setWorkFromHome(false);
// //     setPartTime(false);
// //     setSalary([0, 100]);
// //   };

// //   // ==========================================
// //   // LOADING
// //   // ==========================================

// //   if (loading) {
// //     return (
// //       <>
// //         <Navbar />

// //         <Box
// //           sx={{
// //             minHeight: "70vh",
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             background: "#f8fafc",
// //           }}
// //         >
// //           <CircularProgress />
// //         </Box>

// //         <Footer />
// //       </>
// //     );
// //   }

// //   // ==========================================
// //   // UI
// //   // ==========================================

// //   return (
// //     <>
// //       <Navbar />

// //       <Box
// //         sx={{
// //           background: "#f8fafc",
// //           minHeight: "70vh",
// //           py: 5,
// //         }}
// //       >
// //         <Container maxWidth="xl">

// //           <Grid container spacing={4}>

// //             {/* ================================= */}
// //             {/* FILTER SIDEBAR */}
// //             {/* ================================= */}

// //             <Grid item xs={12} md={3}>

// //               <Paper
// //                 elevation={0}
// //                 sx={{
// //                   p: 3,
// //                   borderRadius: 3,
// //                   border: "1px solid #e5e7eb",
// //                   position: "sticky",
// //                   top: 20,
// //                 }}
// //               >

// //                 {/* HEADER */}

// //                 <Box
// //                   sx={{
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     alignItems: "center",
// //                     mb: 3,
// //                   }}
// //                 >

// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: 1,
// //                     }}
// //                   >

// //                     <FilterAltOutlinedIcon
// //                       sx={{
// //                         color: "#00A5EC",
// //                       }}
// //                     />

// //                     <Typography fontWeight={700}>
// //                       {t("jobs.filters")}
// //                     </Typography>

// //                   </Box>

// //                   <Button
// //                     onClick={clearFilters}
// //                     sx={{
// //                       color: "#00A5EC",
// //                       textTransform: "none",
// //                       fontSize: 13,
// //                     }}
// //                   >
// //                     {t("jobs.clearAll")}
// //                   </Button>

// //                 </Box>

// //                 {/* CATEGORY */}

// //                 <Typography
// //                   fontWeight={600}
// //                   mb={1}
// //                 >
// //                   {t("jobs.category")}
// //                 </Typography>

// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   placeholder={t("jobs.categoryPlaceholder")}
// //                   value={category}
// //                   onChange={(e) =>
// //                     setCategory(e.target.value)
// //                   }
// //                   sx={{
// //                     mb: 3,
// //                   }}
// //                 />

// //                 {/* LOCATION */}

// //                 <Typography
// //                   fontWeight={600}
// //                   mb={1}
// //                 >
// //                   {t("jobs.location")}
// //                 </Typography>

// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   placeholder={t("jobs.locationPlaceholder")}
// //                   value={location}
// //                   onChange={(e) =>
// //                     setLocation(e.target.value)
// //                   }
// //                   sx={{
// //                     mb: 3,
// //                   }}
// //                 />

// //                 {/* EXPERIENCE */}

// //                 <Typography
// //                   fontWeight={600}
// //                   mb={1}
// //                 >
// //                   {t("jobs.experience")}
// //                 </Typography>

// //                 <TextField
// //                   fullWidth
// //                   size="small"
// //                   placeholder={t("jobs.experiencePlaceholder")}
// //                   value={experience}
// //                   onChange={(e) =>
// //                     setExperience(e.target.value)
// //                   }
// //                   sx={{
// //                     mb: 3,
// //                   }}
// //                 />

// //                 {/* WORK FROM HOME */}

// //                 <FormControlLabel
// //                   control={
// //                     <Checkbox
// //                       size="small"
// //                       checked={workFromHome}
// //                       onChange={(e) =>
// //                         setWorkFromHome(
// //                           e.target.checked
// //                         )
// //                       }
// //                     />
// //                   }
// //                   label={t("jobs.workFromHome")}
// //                   sx={{
// //                     display: "block",
// //                     mb: 1,
// //                   }}
// //                 />

// //                 {/* PART TIME */}

// //                 <FormControlLabel
// //                   control={
// //                     <Checkbox
// //                       size="small"
// //                       checked={partTime}
// //                       onChange={(e) =>
// //                         setPartTime(
// //                           e.target.checked
// //                         )
// //                       }
// //                     />
// //                   }
// //                   label={t("jobs.partTime")}
// //                   sx={{
// //                     display: "block",
// //                     mb: 3,
// //                   }}
// //                 />

// //                 {/* SALARY */}

// //                 <Typography
// //                   fontWeight={600}
// //                   mb={2}
// //                 >
// //                   {t("jobs.annualSalary")}
// //                 </Typography>

// //                 <Slider
// //                   value={salary}
// //                   onChange={(e, value) =>
// //                     setSalary(value)
// //                   }
// //                   valueLabelDisplay="auto"
// //                   min={0}
// //                   max={100}
// //                   step={1}
// //                 />

// //                 <Box
// //                   sx={{
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     mt: 1,
// //                   }}
// //                 >

// //                   <Typography fontSize={13}>
// //                     ₹0L
// //                   </Typography>

// //                   <Typography fontSize={13}>
// //                     ₹50L
// //                   </Typography>

// //                   <Typography fontSize={13}>
// //                     ₹100L
// //                   </Typography>

// //                 </Box>

// //               </Paper>

// //             </Grid>

// //             {/* ================================= */}
// //             {/* RESULTS */}
// //             {/* ================================= */}

// //             <Grid item xs={12} md={9}>

// //               <Paper
// //                 elevation={0}
// //                 sx={{
// //                   p: 3,
// //                   mb: 3,
// //                   borderRadius: 3,
// //                   border: "1px solid #e5e7eb",
// //                 }}
// //               >

// //                 <Typography
// //                   fontWeight={600}
// //                   textAlign="center"
// //                 >
// //                   {t("jobs.jobsFound", {
// //                     count: filteredJobs.length,
// //                   })}
// //                 </Typography>

// //               </Paper>

// //               {/* NO RESULTS */}

// //               {filteredJobs.length === 0 ? (

// //                 <Typography
// //                   textAlign="center"
// //                   sx={{
// //                     py: 8,
// //                     color: "text.secondary",
// //                   }}
// //                 >
// //                   {t("jobs.noJobsFound")}
// //                 </Typography>

// //               ) : (

// //                 <Grid container spacing={3}>

// //                   {filteredJobs.map((job) => (

// //                     <Grid
// //                       item
// //                       xs={12}
// //                       sm={6}
// //                       lg={4}
// //                       key={job._id}
// //                     >

// //                       <InternshipCard
// //                         internship={job}
// //                         type="job"
// //                       />

// //                     </Grid>

// //                   ))}

// //                 </Grid>

// //               )}

// //             </Grid>

// //           </Grid>

// //         </Container>

// //         <Footer />

// //       </Box>
// //     </>
// //   );
// // };

// // export default Jobs;


