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

  const API_URL = import.meta.env.VITE_API_URL;

  // ==========================================
  // STATE
  // ==========================================

  const [filter, setFilter] = useState("all");

  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH INTERNSHIPS + JOBS
  // ==========================================

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      try {
        const lang = i18n.language || "en";

        // -------------------------------
        // FETCH INTERNSHIPS
        // -------------------------------

        const internshipRes = await axios.get(
          `${API_URL}/api/internships`,
          {
            params: {
              lang,
            },
          }
        );

        console.log(
          "Internships Response:",
          internshipRes.data
        );

        const internshipData = Array.isArray(
          internshipRes.data
        )
          ? internshipRes.data
          : internshipRes.data?.data ||
            internshipRes.data?.internships ||
            [];

        setInternships(internshipData);

        // -------------------------------
        // FETCH JOBS
        // -------------------------------

        const jobRes = await axios.get(
          `${API_URL}/api/jobs`,
          {
            params: {
              lang,
            },
          }
        );

        console.log(
          "Jobs Response:",
          jobRes.data
        );

        const jobData = Array.isArray(jobRes.data)
          ? jobRes.data
          : jobRes.data?.data ||
            jobRes.data?.jobs ||
            [];

        setJobs(jobData);

      } catch (error) {
        console.error(
          "Data Fetching Error:",
          error.response?.data || error.message
        );

        setInternships([]);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [i18n.language, API_URL]);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredInternships =
    filter === "all" || filter === "internship"
      ? internships
      : [];

  const filteredJobs =
    filter === "all" || filter === "job"
      ? jobs
      : [];

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        background: "#F8FAFC",
        py: {
          xs: 5,
          md: 7,
        },
      }}
    >
      <Container maxWidth="lg">

        {/* ==========================================
            FILTER BUTTONS
        ========================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 5,
          }}
        >
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(event, value) => {
              if (value) {
                setFilter(value);
              }
            }}
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,

              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                border: "1px solid #CBD5E1",
                borderRadius: "8px !important",
                color: "#475569",
              },

              "& .Mui-selected": {
                bgcolor: "#008BDC !important",
                color: "#FFFFFF !important",
                borderColor: "#008BDC !important",
              },
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
        </Box>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* ==========================================
                INTERNSHIPS
            ========================================== */}

            {(filter === "all" ||
              filter === "internship") && (
              <Box mb={6}>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="#0F172A"
                  mb={3}
                  sx={{
                    fontSize: {
                      xs: "1.7rem",
                      md: "2.1rem",
                    },
                  }}
                >
                  {t(
                    "internshipSection.latestInternships"
                  )}
                </Typography>

                {filteredInternships.length === 0 ? (
                  <Typography color="text.secondary">
                    {t(
                      "internshipSection.noInternships"
                    )}
                  </Typography>
                ) : (
                  <Grid
                    container
                    spacing={3}
                  >
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
              </Box>
            )}

            {/* ==========================================
                JOBS
            ========================================== */}

            {(filter === "all" ||
              filter === "job") && (
              <Box mb={6}>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="#0F172A"
                  mb={3}
                  sx={{
                    fontSize: {
                      xs: "1.7rem",
                      md: "2.1rem",
                    },
                  }}
                >
                  {t(
                    "internshipSection.latestJobs"
                  )}
                </Typography>

                {filteredJobs.length === 0 ? (
                  <Typography color="text.secondary">
                    {t(
                      "internshipSection.noJobs"
                    )}
                  </Typography>
                ) : (
                  <Grid
                    container
                    spacing={3}
                  >
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
              </Box>
            )}

            {/* ==========================================
                STATS
            ========================================== */}

            <Box
              sx={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "14px",
                py: 3,
                px: 2,
                mt: 4,
              }}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="center"
              >

                {/* 10K+ */}

                <Grid
                  item
                  xs={12}
                  sm={4}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      py: {
                        xs: 2,
                        sm: 0,
                      },
                      borderRight: {
                        sm: "1px solid #E2E8F0",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "26px",
                          sm: "30px",
                        },
                        fontWeight: 800,
                        color: "#008BDC",
                      }}
                    >
                      10K+
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                      }}
                    >
                      {t(
                        "internshipSection.internships"
                      )}
                    </Typography>
                  </Box>
                </Grid>

                {/* 200K+ */}

                <Grid
                  item
                  xs={12}
                  sm={4}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      py: {
                        xs: 2,
                        sm: 0,
                      },
                      borderRight: {
                        sm: "1px solid #E2E8F0",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "26px",
                          sm: "30px",
                        },
                        fontWeight: 800,
                        color: "#008BDC",
                      }}
                    >
                      200K+
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                      }}
                    >
                      {t(
                        "internshipSection.students"
                      )}
                    </Typography>
                  </Box>
                </Grid>

                {/* 500K+ */}

                <Grid
                  item
                  xs={12}
                  sm={4}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      py: {
                        xs: 2,
                        sm: 0,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "26px",
                          sm: "30px",
                        },
                        fontWeight: 800,
                        color: "#008BDC",
                      }}
                    >
                      500K+
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748B",
                        fontWeight: 500,
                      }}
                    >
                      {t(
                        "internshipSection.learners"
                      )}
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
//    const API_URL = import.meta.env.VITE_API_URL;

//   const [filter, setFilter] = useState("all");

//   const [internships, setInternships] = useState([]);
//   const [jobs, setJobs] = useState([]);

//   const [loading, setLoading] = useState(true);

//   // ==========================================
//   // FETCH DATA TOGETHER (PREVENT RACE CONDITION)
//   // ==========================================

//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         const lang = i18n.language || "en";

//         // १. आधी Internships मागवा
//         const intRes = await axios.get(`${API_URL}/api/internships`, {
//           params: { lang },
//         });
        
//         console.log("Internships Response:", intRes.data);
//         if (Array.isArray(intRes.data)) {
//           setInternships(intRes.data);
//         } else {
//           setInternships(intRes.data?.data || intRes.data?.internships || []);
//         }

//         // २. मग Jobs मागवा (LibreTranslate वर ताण येऊ नये म्हणून क्रमाने)
//         const jobRes = await axios.get(`${API_URL}/api/jobs`, {
//           params: { lang },
//         });

//         console.log("Jobs Response:", jobRes.data);
//         if (Array.isArray(jobRes.data)) {
//           setJobs(jobRes.data);
//         } else {
//           setJobs(jobRes.data?.data || jobRes.data?.jobs || []);
//         }

//       } catch (error) {
//         console.error(
//           "Data Fetching Error:",
//           error.response?.data || error.message
//         );
//       } finally {
//         setLoading(false); // दोन्ही डेटा आल्यावरच लोडर बंद होईल
//       }
//     };

//     fetchAllData();
//   }, [i18n.language]);

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
//                   <Typography color="text.secondary" mb={4}>
//                     {t("internshipSection.noInternships")}
//                   </Typography>
//                 ) : (
//                   <Grid container spacing={3} mb={6}>
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
//                   mt={4}
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
//                   </Grid>
//                 )}
//               </>
//             )}

//             {/* ==========================================
//                 STATS
//             ========================================== */}

//             <Box
//               sx={{
//                 width: "100%",
//                 backgroundColor: "#F8FAFC",
//                 border: "1px solid #E2E8F0",
//                 borderRadius: "12px",
//                 py: 2.5,
//                 px: 2,
//                 mt: 6,
//               }}
//             >
//               <Grid
//                 container
//                 alignItems="center"
//                 justifyContent="center"
//                 spacing={4}
//               >
//                 {/* 10K+ */}
//                 <Grid item xs={12} sm={4}>
//                   <Box
//                     sx={{
//                       textAlign: "center",
//                       borderRight: { sm: "1px solid #E2E8F0" },
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: { xs: "24px", sm: "30px" },
//                         fontWeight: 800,
//                         color: "#008BDC",
//                         lineHeight: 1.2,
//                       }}
//                     >
//                       10K+
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontSize: "14px",
//                         color: "#64748B",
//                         fontWeight: 500,
//                         mt: 0.5,
//                       }}
//                     >
//                       {t("internshipSection.internships")}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 {/* 200K+ */}
//                 <Grid item xs={12} sm={4}>
//                   <Box
//                     sx={{
//                       textAlign: "center",
//                       borderRight: { sm: "1px solid #E2E8F0" },
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: { xs: "24px", sm: "30px" },
//                         fontWeight: 800,
//                         color: "#008BDC",
//                         lineHeight: 1.2,
//                       }}
//                     >
//                       200K+
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontSize: "14px",
//                         color: "#64748B",
//                         fontWeight: 500,
//                         mt: 0.5,
//                       }}
//                     >
//                       {t("internshipSection.students")}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 {/* 500K+ */}
//                 <Grid item xs={12} sm={4}>
//                   <Box sx={{ textAlign: "center" }}>
//                     <Typography
//                       sx={{
//                         fontSize: { xs: "24px", sm: "30px" },
//                         fontWeight: 800,
//                         color: "#008BDC",
//                         lineHeight: 1.2,
//                       }}
//                     >
//                       500K+
//                     </Typography>
//                     <Typography
//                       sx={{
//                         fontSize: "14px",
//                         color: "#64748B",
//                         fontWeight: 500,
//                         mt: 0.5,
//                       }}
//                     >
//                       {t("internshipSection.learners")}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Box>
//           </>
//         )}

//       </Container>
//     </Box>
//   );
// }

// export default InternshipSection;



// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useTranslation } from "react-i18next";

// // import {
// //   Box,
// //   Container,
// //   ToggleButton,
// //   ToggleButtonGroup,
// //   Grid,
// //   Typography,
// //   CircularProgress,
// // } from "@mui/material";

// // import InternshipCard from "./InternshipCard";

// // function InternshipSection() {
// //   const { t, i18n } = useTranslation();

// //   const [filter, setFilter] = useState("all");

// //   const [internships, setInternships] = useState([]);
// //   const [jobs, setJobs] = useState([]);

// //   const [loading, setLoading] = useState(true);

// //   // ==========================================
// //   // FETCH DATA
// //   // ==========================================

// //   useEffect(() => {
// //     fetchInternships();
// //     fetchJobs();
// //   }, [i18n.language]);

// //   // ==========================================
// //   // FETCH INTERNSHIPS
// //   // ==========================================

// //   const fetchInternships = async () => {
// //     try {
// //       setLoading(true);

// //       const res = await axios.get(
// //         "http://localhost:8000/api/internships",
// //         {
// //           params: {
// //             lang: i18n.language,
// //           }
// //         }
// //       );

// //       console.log("Internships:", res.data);

// //       if (Array.isArray(res.data)) {
// //         setInternships(res.data);
// //       } else {
// //         setInternships(res.data?.internships || []);
// //       }
// //     } catch (error) {
// //       console.error(
// //         "Internship Error:",
// //         error.response?.data || error.message
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ==========================================
// //   // FETCH JOBS
// //   // ==========================================

// //   const fetchJobs = async () => {
// //     try {
// //       const res = await axios.get(
// //         "http://localhost:8000/api/jobs",
// //         {
// //           params: {
// //             lang: i18n.language,
// //           },
// //         }
// //       );

// //       console.log("Jobs:", res.data);

// //       if (Array.isArray(res.data)) {
// //         setJobs(res.data);
// //       } else {
// //         setJobs(res.data?.jobs || []);
// //       }
// //     } catch (error) {
// //       console.error(
// //         "Job Error:",
// //         error.response?.data || error.message
// //       );
// //     }
// //   };

// //   // ==========================================
// //   // FILTER INTERNSHIPS
// //   // ==========================================

// //   const filteredInternships = internships.filter((item) => {
// //     if (filter === "all") {
// //       return true;
// //     }

// //     return item.type?.toLowerCase() === filter;
// //   });

// //   // ==========================================
// //   // UI
// //   // ==========================================

// //   return (
// //     <Box
// //       sx={{
// //         background: "#f8fafc",
// //         py: 6,
// //       }}
// //     >
// //       <Container maxWidth="lg">

// //         {/* ==========================================
// //             FILTER BUTTONS
// //         ========================================== */}

// //         <ToggleButtonGroup
// //           value={filter}
// //           exclusive
// //           onChange={(e, value) => {
// //             if (value) {
// //               setFilter(value);
// //             }
// //           }}
// //           sx={{
// //             mb: 5,
// //             flexWrap: "wrap",
// //             gap: 2,
// //           }}
// //         >
// //           <ToggleButton value="all">
// //             {t("internshipSection.all")}
// //           </ToggleButton>

// //           <ToggleButton value="internship">
// //             {t("internshipSection.internship")}
// //           </ToggleButton>

// //           <ToggleButton value="job">
// //             {t("internshipSection.jobs")}
// //           </ToggleButton>
// //         </ToggleButtonGroup>

// //         {/* ==========================================
// //             LOADING
// //         ========================================== */}

// //         {loading ? (
// //           <Box
// //             display="flex"
// //             justifyContent="center"
// //             alignItems="center"
// //             py={10}
// //           >
// //             <CircularProgress />
// //           </Box>
// //         ) : (
// //           <>
// //             {/* ==========================================
// //                 INTERNSHIPS
// //             ========================================== */}

// //             {(filter === "all" || filter === "internship") && (
// //               <>
// //                 <Typography
// //                   variant="h4"
// //                   fontWeight={700}
// //                   mb={3}
// //                 >
// //                   {t("internshipSection.latestInternships")}
// //                 </Typography>

// //                 {filteredInternships.length === 0 ? (
// //                   <Typography color="text.secondary">
// //                     {t("internshipSection.noInternships")}
// //                   </Typography>
// //                 ) : (
// //                   <Grid container spacing={3}>
// //                     {filteredInternships.map((internship) => (
// //                       <Grid
// //                         item
// //                         xs={12}
// //                         sm={6}
// //                         lg={4}
// //                         key={internship._id}
// //                       >
// //                         <InternshipCard
// //                           internship={internship}
// //                           type="internship"
// //                         />
// //                       </Grid>
// //                     ))}
// //                   </Grid>
// //                 )}
// //               </>
// //             )}

// //             {/* ==========================================
// //                 JOBS
// //             ========================================== */}

// //             {(filter === "all" || filter === "job") && (
// //               <>
// //                 <Typography
// //                   variant="h4"
// //                   fontWeight={700}
// //                   mt={8}
// //                   mb={3}
// //                 >
// //                   {t("internshipSection.latestJobs")}
// //                 </Typography>

// //                 {jobs.length === 0 ? (
// //                   <Typography color="text.secondary">
// //                     {t("internshipSection.noJobs")}
// //                   </Typography>
// //                 ) : (
// //                   <Grid container spacing={3}>
// //                     {jobs.map((job) => (
// //                       <Grid
// //                         item
// //                         xs={12}
// //                         sm={6}
// //                         lg={4}
// //                         key={job._id}
// //                       >
// //                         <InternshipCard
// //                           internship={job}
// //                           type="job"
// //                         />
// //                       </Grid>
// //                     ))}

// //                     {/* ==========================================
// //                         STATS
// //                     ========================================== */}

// //                     <Box
// //                       sx={{
// //                         width: "100%",
// //                         backgroundColor: "#F8FAFC",
// //                         border: "1px solid #E2E8F0",
// //                         borderRadius: "12px",
// //                         py: 2.5,
// //                         px: 2,
// //                         mt: 3,
// //                       }}
// //                     >
// //                       <Grid
// //                         container
// //                         alignItems="center"
// //                         justifyContent="center"
// //                         spacing={18}
// //                       >

// //                         {/* 10K+ */}
// //                         <Grid item xs={4}>
// //                           <Box
// //                             sx={{
// //                               textAlign: "center",
// //                               borderRight: "1px solid #E2E8F0",
// //                             }}
// //                           >
// //                             <Typography
// //                               sx={{
// //                                 fontSize: {
// //                                   xs: "24px",
// //                                   sm: "30px",
// //                                 },
// //                                 fontWeight: 800,
// //                                 color: "#008BDC",
// //                                 lineHeight: 1.2,
// //                               }}
// //                             >
// //                               10K+
// //                             </Typography>

// //                             <Typography
// //                               sx={{
// //                                 fontSize: "14px",
// //                                 color: "#64748B",
// //                                 fontWeight: 500,
// //                                 mt: 0.5,
// //                               }}
// //                             >
// //                               {t("internshipSection.internships")}
// //                             </Typography>
// //                           </Box>
// //                         </Grid>

// //                         {/* 200K+ */}
// //                         <Grid item xs={4}>
// //                           <Box
// //                             sx={{
// //                               textAlign: "center",
// //                               borderRight: "1px solid #E2E8F0",
// //                             }}
// //                           >
// //                             <Typography
// //                               sx={{
// //                                 fontSize: {
// //                                   xs: "24px",
// //                                   sm: "30px",
// //                                 },
// //                                 fontWeight: 800,
// //                                 color: "#008BDC",
// //                                 lineHeight: 1.2,
// //                               }}
// //                             >
// //                               200K+
// //                             </Typography>

// //                             <Typography
// //                               sx={{
// //                                 fontSize: "14px",
// //                                 color: "#64748B",
// //                                 fontWeight: 500,
// //                                 mt: 0.5,
// //                               }}
// //                             >
// //                               {t("internshipSection.students")}
// //                             </Typography>
// //                           </Box>
// //                         </Grid>

// //                         {/* 500K+ */}
// //                         <Grid item xs={4}>
// //                           <Box sx={{ textAlign: "center" }}>
// //                             <Typography
// //                               sx={{
// //                                 fontSize: {
// //                                   xs: "24px",
// //                                   sm: "30px",
// //                                 },
// //                                 fontWeight: 800,
// //                                 color: "#008BDC",
// //                                 lineHeight: 1.2,
// //                               }}
// //                             >
// //                               500K+
// //                             </Typography>

// //                             <Typography
// //                               sx={{
// //                                 fontSize: "14px",
// //                                 color: "#64748B",
// //                                 fontWeight: 500,
// //                                 mt: 0.5,
// //                               }}
// //                             >
// //                               {t("internshipSection.learners")}
// //                             </Typography>
// //                           </Box>
// //                         </Grid>

// //                       </Grid>
// //                     </Box>
// //                   </Grid>
// //                 )}
// //               </>
// //             )}
// //           </>
// //         )}

// //       </Container>
// //     </Box>
// //   );
// // }

// // export default InternshipSection;

