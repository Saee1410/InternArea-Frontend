import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

import InternshipCard from "./InternshipCard";

function InternshipSection() {
  const { t, i18n } = useTranslation();

  const [filter, setFilter] = useState("all");

  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DATA TOGETHER (PREVENT RACE CONDITION)
  // ==========================================

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || "en";

        // १. आधी Internships मागवा
        const intRes = await axios.get("http://localhost:8000/api/internships", {
          params: { lang },
        });
        
        console.log("Internships Response:", intRes.data);
        if (Array.isArray(intRes.data)) {
          setInternships(intRes.data);
        } else {
          setInternships(intRes.data?.data || intRes.data?.internships || []);
        }

        // २. मग Jobs मागवा (LibreTranslate वर ताण येऊ नये म्हणून क्रमाने)
        const jobRes = await axios.get("http://localhost:8000/api/jobs", {
          params: { lang },
        });

        console.log("Jobs Response:", jobRes.data);
        if (Array.isArray(jobRes.data)) {
          setJobs(jobRes.data);
        } else {
          setJobs(jobRes.data?.data || jobRes.data?.jobs || []);
        }

      } catch (error) {
        console.error(
          "Data Fetching Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false); // दोन्ही डेटा आल्यावरच लोडर बंद होईल
      }
    };

    fetchAllData();
  }, [i18n.language]);

  // ==========================================
  // FILTER INTERNSHIPS
  // ==========================================

  const filteredInternships = internships.filter((item) => {
    if (filter === "all") {
      return true;
    }
    return item.type?.toLowerCase() === filter;
  });

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        background: "#f8fafc",
        py: 6,
      }}
    >
      <Container maxWidth="lg">

        {/* ==========================================
            FILTER BUTTONS
        ========================================== */}

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(e, value) => {
            if (value) {
              setFilter(value);
            }
          }}
          sx={{
            mb: 5,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <ToggleButton value="all">
            {t("internshipSection.all")}
          </ToggleButton>

          <ToggleButton value="internship">
            {t("internshipSection.internship")}
          </ToggleButton>

          <ToggleButton value="job">
            {t("internshipSection.jobs")}
          </ToggleButton>
        </ToggleButtonGroup>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={10}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* ==========================================
                INTERNSHIPS
            ========================================== */}

            {(filter === "all" || filter === "internship") && (
              <>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  mb={3}
                >
                  {t("internshipSection.latestInternships")}
                </Typography>

                {filteredInternships.length === 0 ? (
                  <Typography color="text.secondary" mb={4}>
                    {t("internshipSection.noInternships")}
                  </Typography>
                ) : (
                  <Grid container spacing={3} mb={6}>
                    {filteredInternships.map((internship) => (
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
                    ))}
                  </Grid>
                )}
              </>
            )}

            {/* ==========================================
                JOBS
            ========================================== */}

            {(filter === "all" || filter === "job") && (
              <>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  mt={4}
                  mb={3}
                >
                  {t("internshipSection.latestJobs")}
                </Typography>

                {jobs.length === 0 ? (
                  <Typography color="text.secondary">
                    {t("internshipSection.noJobs")}
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {jobs.map((job) => (
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
              </>
            )}

            {/* ==========================================
                STATS
            ========================================== */}

            <Box
              sx={{
                width: "100%",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                py: 2.5,
                px: 2,
                mt: 6,
              }}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={4}
              >
                {/* 10K+ */}
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      textAlign: "center",
                      borderRight: { sm: "1px solid #E2E8F0" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "24px", sm: "30px" },
                        fontWeight: 800,
                        color: "#008BDC",
                        lineHeight: 1.2,
                      }}
                    >
                      10K+
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                        mt: 0.5,
                      }}
                    >
                      {t("internshipSection.internships")}
                    </Typography>
                  </Box>
                </Grid>

                {/* 200K+ */}
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      textAlign: "center",
                      borderRight: { sm: "1px solid #E2E8F0" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "24px", sm: "30px" },
                        fontWeight: 800,
                        color: "#008BDC",
                        lineHeight: 1.2,
                      }}
                    >
                      200K+
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                        mt: 0.5,
                      }}
                    >
                      {t("internshipSection.students")}
                    </Typography>
                  </Box>
                </Grid>

                {/* 500K+ */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "24px", sm: "30px" },
                        fontWeight: 800,
                        color: "#008BDC",
                        lineHeight: 1.2,
                      }}
                    >
                      500K+
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                        mt: 0.5,
                      }}
                    >
                      {t("internshipSection.learners")}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}

      </Container>
    </Box>
  );
}

export default InternshipSection;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Container,
//   ToggleButton,
//   ToggleButtonGroup,
//   Grid,
//   Typography,
//   CircularProgress,
// } from "@mui/material";

// import InternshipCard from "./InternshipCard";

// function InternshipSection() {
//   const { t, i18n } = useTranslation();

//   const [filter, setFilter] = useState("all");

//   const [internships, setInternships] = useState([]);
//   const [jobs, setJobs] = useState([]);

//   const [loading, setLoading] = useState(true);

//   // ==========================================
//   // FETCH DATA
//   // ==========================================

//   useEffect(() => {
//     fetchInternships();
//     fetchJobs();
//   }, [i18n.language]);

//   // ==========================================
//   // FETCH INTERNSHIPS
//   // ==========================================

//   const fetchInternships = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:8000/api/internships",
//         {
//           params: {
//             lang: i18n.language,
//           }
//         }
//       );

//       console.log("Internships:", res.data);

//       if (Array.isArray(res.data)) {
//         setInternships(res.data);
//       } else {
//         setInternships(res.data?.internships || []);
//       }
//     } catch (error) {
//       console.error(
//         "Internship Error:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // FETCH JOBS
//   // ==========================================

//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/jobs",
//         {
//           params: {
//             lang: i18n.language,
//           },
//         }
//       );

//       console.log("Jobs:", res.data);

//       if (Array.isArray(res.data)) {
//         setJobs(res.data);
//       } else {
//         setJobs(res.data?.jobs || []);
//       }
//     } catch (error) {
//       console.error(
//         "Job Error:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   // ==========================================
//   // FILTER INTERNSHIPS
//   // ==========================================

//   const filteredInternships = internships.filter((item) => {
//     if (filter === "all") {
//       return true;
//     }

//     return item.type?.toLowerCase() === filter;
//   });

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <Box
//       sx={{
//         background: "#f8fafc",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="lg">

//         {/* ==========================================
//             FILTER BUTTONS
//         ========================================== */}

//         <ToggleButtonGroup
//           value={filter}
//           exclusive
//           onChange={(e, value) => {
//             if (value) {
//               setFilter(value);
//             }
//           }}
//           sx={{
//             mb: 5,
//             flexWrap: "wrap",
//             gap: 2,
//           }}
//         >
//           <ToggleButton value="all">
//             {t("internshipSection.all")}
//           </ToggleButton>

//           <ToggleButton value="internship">
//             {t("internshipSection.internship")}
//           </ToggleButton>

//           <ToggleButton value="job">
//             {t("internshipSection.jobs")}
//           </ToggleButton>
//         </ToggleButtonGroup>

//         {/* ==========================================
//             LOADING
//         ========================================== */}

//         {loading ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             py={10}
//           >
//             <CircularProgress />
//           </Box>
//         ) : (
//           <>
//             {/* ==========================================
//                 INTERNSHIPS
//             ========================================== */}

//             {(filter === "all" || filter === "internship") && (
//               <>
//                 <Typography
//                   variant="h4"
//                   fontWeight={700}
//                   mb={3}
//                 >
//                   {t("internshipSection.latestInternships")}
//                 </Typography>

//                 {filteredInternships.length === 0 ? (
//                   <Typography color="text.secondary">
//                     {t("internshipSection.noInternships")}
//                   </Typography>
//                 ) : (
//                   <Grid container spacing={3}>
//                     {filteredInternships.map((internship) => (
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
//                     ))}
//                   </Grid>
//                 )}
//               </>
//             )}

//             {/* ==========================================
//                 JOBS
//             ========================================== */}

//             {(filter === "all" || filter === "job") && (
//               <>
//                 <Typography
//                   variant="h4"
//                   fontWeight={700}
//                   mt={8}
//                   mb={3}
//                 >
//                   {t("internshipSection.latestJobs")}
//                 </Typography>

//                 {jobs.length === 0 ? (
//                   <Typography color="text.secondary">
//                     {t("internshipSection.noJobs")}
//                   </Typography>
//                 ) : (
//                   <Grid container spacing={3}>
//                     {jobs.map((job) => (
//                       <Grid
//                         item
//                         xs={12}
//                         sm={6}
//                         lg={4}
//                         key={job._id}
//                       >
//                         <InternshipCard
//                           internship={job}
//                           type="job"
//                         />
//                       </Grid>
//                     ))}

//                     {/* ==========================================
//                         STATS
//                     ========================================== */}

//                     <Box
//                       sx={{
//                         width: "100%",
//                         backgroundColor: "#F8FAFC",
//                         border: "1px solid #E2E8F0",
//                         borderRadius: "12px",
//                         py: 2.5,
//                         px: 2,
//                         mt: 3,
//                       }}
//                     >
//                       <Grid
//                         container
//                         alignItems="center"
//                         justifyContent="center"
//                         spacing={18}
//                       >

//                         {/* 10K+ */}
//                         <Grid item xs={4}>
//                           <Box
//                             sx={{
//                               textAlign: "center",
//                               borderRight: "1px solid #E2E8F0",
//                             }}
//                           >
//                             <Typography
//                               sx={{
//                                 fontSize: {
//                                   xs: "24px",
//                                   sm: "30px",
//                                 },
//                                 fontWeight: 800,
//                                 color: "#008BDC",
//                                 lineHeight: 1.2,
//                               }}
//                             >
//                               10K+
//                             </Typography>

//                             <Typography
//                               sx={{
//                                 fontSize: "14px",
//                                 color: "#64748B",
//                                 fontWeight: 500,
//                                 mt: 0.5,
//                               }}
//                             >
//                               {t("internshipSection.internships")}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         {/* 200K+ */}
//                         <Grid item xs={4}>
//                           <Box
//                             sx={{
//                               textAlign: "center",
//                               borderRight: "1px solid #E2E8F0",
//                             }}
//                           >
//                             <Typography
//                               sx={{
//                                 fontSize: {
//                                   xs: "24px",
//                                   sm: "30px",
//                                 },
//                                 fontWeight: 800,
//                                 color: "#008BDC",
//                                 lineHeight: 1.2,
//                               }}
//                             >
//                               200K+
//                             </Typography>

//                             <Typography
//                               sx={{
//                                 fontSize: "14px",
//                                 color: "#64748B",
//                                 fontWeight: 500,
//                                 mt: 0.5,
//                               }}
//                             >
//                               {t("internshipSection.students")}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         {/* 500K+ */}
//                         <Grid item xs={4}>
//                           <Box sx={{ textAlign: "center" }}>
//                             <Typography
//                               sx={{
//                                 fontSize: {
//                                   xs: "24px",
//                                   sm: "30px",
//                                 },
//                                 fontWeight: 800,
//                                 color: "#008BDC",
//                                 lineHeight: 1.2,
//                               }}
//                             >
//                               500K+
//                             </Typography>

//                             <Typography
//                               sx={{
//                                 fontSize: "14px",
//                                 color: "#64748B",
//                                 fontWeight: 500,
//                                 mt: 0.5,
//                               }}
//                             >
//                               {t("internshipSection.learners")}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                       </Grid>
//                     </Box>
//                   </Grid>
//                 )}
//               </>
//             )}
//           </>
//         )}

//       </Container>
//     </Box>
//   );
// }

// export default InternshipSection;

