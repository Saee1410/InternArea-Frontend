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
  const { t } = useTranslation();

  const [filter, setFilter] = useState("all");

  const [internships, setInternships] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    fetchInternships();
    fetchJobs();
  }, []);

  // ==========================================
  // FETCH INTERNSHIPS
  // ==========================================

  const fetchInternships = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8000/api/internships"
      );

      console.log("Internships:", res.data);

      if (Array.isArray(res.data)) {
        setInternships(res.data);
      } else {
        setInternships(res.data?.internships || []);
      }
    } catch (error) {
      console.error(
        "Internship Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/jobs"
      );

      console.log("Jobs:", res.data);

      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        setJobs(res.data?.jobs || []);
      }
    } catch (error) {
      console.error(
        "Job Error:",
        error.response?.data || error.message
      );
    }
  };

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
                  <Typography color="text.secondary">
                    {t("internshipSection.noInternships")}
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
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
                  mt={8}
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
                        mt: 3,
                      }}
                    >
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                        spacing={18}
                      >

                        {/* 10K+ */}
                        <Grid item xs={4}>
                          <Box
                            sx={{
                              textAlign: "center",
                              borderRight: "1px solid #E2E8F0",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "24px",
                                  sm: "30px",
                                },
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
                        <Grid item xs={4}>
                          <Box
                            sx={{
                              textAlign: "center",
                              borderRight: "1px solid #E2E8F0",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "24px",
                                  sm: "30px",
                                },
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
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "24px",
                                  sm: "30px",
                                },
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
                  </Grid>
                )}
              </>
            )}
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
//   const { t } = useTranslation();

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
//   }, []);

//   // ==========================================
//   // FETCH INTERNSHIPS
//   // ==========================================

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
//         "http://localhost:8000/api/jobs"
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
                 
//                  <Box
//   sx={{
//     width: "100%",
//     backgroundColor: "#F8FAFC",
//     border: "1px solid #E2E8F0",
//     borderRadius: "12px",
//     py: 2.5,
//     px: 2,
//     mt: 3,
//   }}
// >
//   <Grid
//     container
//     alignItems="center"
//     justifyContent="center"
//     spacing={18}
//   >
//     {/* 10K+ */}
//     <Grid item xs={4}>
//       <Box
//         sx={{
//           textAlign: "center",
//           borderRight: "1px solid #E2E8F0",
//         }}
//       >
//         <Typography
//           sx={{
//             fontSize: { xs: "24px", sm: "30px" },
//             fontWeight: 800,
//             color: "#008BDC",
//             lineHeight: 1.2,
//           }}
//         >
//           10K+
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: "14px",
//             color: "#64748B",
//             fontWeight: 500,
//             mt: 0.5,
//           }}
//         >
//           internships
//         </Typography>
//       </Box>
//     </Grid>

//     {/* 200K+ */}
//     <Grid item xs={4}>
//       <Box
//         sx={{
//           textAlign: "center",
//           borderRight: "1px solid #E2E8F0",
//         }}
//       >
//         <Typography
//           sx={{
//             fontSize: { xs: "24px", sm: "30px" },
//             fontWeight: 800,
//             color: "#008BDC",
//             lineHeight: 1.2,
//           }}
//         >
//           200K+
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: "14px",
//             color: "#64748B",
//             fontWeight: 500,
//             mt: 0.5,
//           }}
//         >
//           students
//         </Typography>
//       </Box>
//     </Grid>

//     {/* 500K+ */}
//     <Grid item xs={4}>
//       <Box sx={{ textAlign: "center" }}>
//         <Typography
//           sx={{
//             fontSize: { xs: "24px", sm: "30px" },
//             fontWeight: 800,
//             color: "#008BDC",
//             lineHeight: 1.2,
//           }}
//         >
//           500K+
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: "14px",
//             color: "#64748B",
//             fontWeight: 500,
//             mt: 0.5,
//           }}
//         >
//           learners
//         </Typography>
//       </Box>
//     </Grid>
//   </Grid>
// </Box>
                
//               </Grid>

              

//               // <Grid item xs={6} md={3}>
//               //   <Typography variant="h4" fontWeight="800" color="#008BDC">
//               //     21Mn+
//               //   </Typography>
//               //   <Typography variant="body2" color="#64748B">
//               //     active students
//               //   </Typography>
//               // </Grid>

//               // <Grid item xs={6} md={3}>
//               //   <Typography variant="h4" fontWeight="800" color="#008BDC">
//               //     600K+
//               //   </Typography>
//               //   <Typography variant="body2" color="#64748B">
//               //     learners
//               //   </Typography>
//               // </Grid>
//               //     </Grid>
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

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Container,
//   TextField,
//   ToggleButton,
//   ToggleButtonGroup,
//   Grid,
//   Typography,
//   CircularProgress,
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";

// import InternshipCard from "./InternshipCard";

// function InternshipSection() {
//   const { t } = useTranslation();

//   const [searchTerm, setSearchTerm] = useState("");
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
//   }, []);

//   // ==========================================
//   // FETCH INTERNSHIPS
//   // ==========================================

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
//         "http://localhost:8000/api/jobs"
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
//     const search = searchTerm.toLowerCase().trim();

//     const searchMatch =
//       !search ||
//       item.company?.toLowerCase().includes(search) ||
//       item.title?.toLowerCase().includes(search) ||
//       item.location?.toLowerCase().includes(search) ||
//       item.category?.toLowerCase().includes(search);

//     if (filter === "all") {
//       return searchMatch;
//     }

//     return (
//       searchMatch &&
//       item.type?.toLowerCase() === filter
//     );
//   });

//   // ==========================================
//   // FILTER JOBS
//   // ==========================================

//   const filteredJobs = jobs.filter((item) => {
//     const search = searchTerm.toLowerCase().trim();

//     return (
//       !search ||
//       item.company?.toLowerCase().includes(search) ||
//       item.title?.toLowerCase().includes(search) ||
//       item.location?.toLowerCase().includes(search) ||
//       item.category?.toLowerCase().includes(search)
//     );
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
//             SEARCH
//         ========================================== */}

//         <TextField
//           fullWidth
//           placeholder={t(
//             "internshipSection.searchPlaceholder"
//           )}
//           value={searchTerm}
//           onChange={(e) =>
//             setSearchTerm(e.target.value)
//           }
//           sx={{
//             mb: 4,
//             background: "#fff",
//           }}
//           InputProps={{
//             startAdornment: (
//               <SearchIcon
//                 sx={{
//                   color: "gray",
//                   mr: 1,
//                 }}
//               />
//             ),
//           }}
//         />

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

//             {(filter === "all" ||
//               filter === "internship") && (
//               <>
//                 <Typography
//                   variant="h4"
//                   fontWeight={700}
//                   mb={3}
//                 >
//                   {t(
//                     "internshipSection.latestInternships"
//                   )}
//                 </Typography>

//                 {filteredInternships.length === 0 ? (
//                   <Typography
//                     color="text.secondary"
//                   >
//                     {t(
//                       "internshipSection.noInternships"
//                     )}
//                   </Typography>
//                 ) : (
//                   <Grid container spacing={3}>
//                     {filteredInternships.map(
//                       (internship) => (
//                         <Grid
//                           item
//                           xs={12}
//                           sm={6}
//                           lg={4}
//                           key={internship._id}
//                         >
//                           <InternshipCard
//                             internship={internship}
//                             type="internship"
//                           />
//                         </Grid>
//                       )
//                     )}
//                   </Grid>
//                 )}
//               </>
//             )}

//             {/* ==========================================
//                 JOBS
//             ========================================== */}

//             {(filter === "all" ||
//               filter === "job") && (
//               <>
//                 <Typography
//                   variant="h4"
//                   fontWeight={700}
//                   mt={8}
//                   mb={3}
//                 >
//                   {t(
//                     "internshipSection.latestJobs"
//                   )}
//                 </Typography>

//                 {filteredJobs.length === 0 ? (
//                   <Typography
//                     color="text.secondary"
//                   >
//                     {t(
//                       "internshipSection.noJobs"
//                     )}
//                   </Typography>
//                 ) : (
//                   <Grid container spacing={3}>
//                     {filteredJobs.map((job) => (
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
//           </>
//         )}

//       </Container>
//     </Box>
//   );
// }

// export default InternshipSection;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Container,
//   TextField,
//   ToggleButton,
//   ToggleButtonGroup,
//   Grid,
//   Typography,
//   CircularProgress,
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";

// import InternshipCard from "./InternshipCard";

// function InternshipSection() {
//   const { t } = useTranslation();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [internships, setInternships] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchInternships();
//     fetchJobs();
//   }, []);

//   const fetchInternships = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:8000/api/internships"
//       );

//       console.log(res.data);
//       setInternships(res.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/jobs"
//       );

//       setJobs(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const filteredInternships = internships.filter((item) => {
//     const searchMatch =
//       item.company
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       item.title
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       item.location
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase());

//     if (filter === "all") return searchMatch;

//     return (
//       searchMatch &&
//       item.type?.toLowerCase() === filter
//     );
//   });

//   const filteredJobs = jobs.filter((item) => {
//     return (
//       item.company
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       item.title
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       item.location
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//   });

//   return (
//     <Box
//       sx={{
//         background: "#f8fafc",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="lg">

//         {/* Search */}
//         <TextField
//           fullWidth
//           placeholder={t("internshipSection.searchPlaceholder")}
//           value={searchTerm}
//           onChange={(e) =>
//             setSearchTerm(e.target.value)
//           }
//           sx={{
//             mb: 4,
//             background: "#fff",
//           }}
//           InputProps={{
//             startAdornment: (
//               <SearchIcon
//                 sx={{
//                   color: "gray",
//                   mr: 1,
//                 }}
//               />
//             ),
//           }}
//         />

//         {/* Filters */}
//         <ToggleButtonGroup
//           value={filter}
//           exclusive
//           onChange={(e, value) => {
//             if (value) setFilter(value);
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

//         {/* Loading */}
//         {loading ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             py={10}
//           >
//             <CircularProgress />
//           </Box>
//         ) : (
//           <>
//             {/* Internships */}
//             {(filter === "all" ||
//               filter === "internship") && (
//               <>
//                 <Typography
//                   variant="h4"
//                   fontWeight={700}
//                   mb={3}
//                 >
//                   {t("internshipSection.latestInternships")}
//                 </Typography>

//                 {filteredInternships.length === 0 ? (
//                   <Typography>
//                     {t("internshipSection.noInternships")}
//                   </Typography>
//                 ) : (
//                   <Grid container spacing={3}>
//                     {filteredInternships.map(
//                       (internship) => (
//                         <Grid
//                           item
//                           xs={12}
//                           sm={6}
//                           lg={4}
//                           key={internship._id}
//                         >
//                           <InternshipCard
//                             internship={internship}
//                             type="internship"
//                           />
//                         </Grid>
//                       )
//                     )}
//                   </Grid>
//                 )}
//               </>
//             )}

//             {/* Jobs */}
//             {(filter === "all" ||
//               filter === "job") && (
//               <>
//                 <Typography
//                   variant="h4"
//                   fontWeight={700}
//                   mt={8}
//                   mb={3}
//                 >
//                   {t("internshipSection.latestJobs")}
//                 </Typography>

//                 {filteredJobs.length === 0 ? (
//                   <Typography>
//                     {t("internshipSection.noJobs")}
//                   </Typography>
//                 ) : (
//                   <Grid container spacing={3}>
//                     {filteredJobs.map((job) => (
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
//           </>
//         )}

//       </Container>
//     </Box>
//   );
// }

// export default InternshipSection;



// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Box,
//   Container,
//   TextField,
//   ToggleButton,
//   ToggleButtonGroup,
//   Grid,
//   Typography,
//   CircularProgress,
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";

// import InternshipCard from "./InternshipCard";

// function InternshipSection() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [internships, setInternships] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchInternships();
//     fetchJobs();
//   }, []);

//   const fetchInternships = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:8000/api/internships"
//       );

//       console.log(res.data);
//       setInternships(res.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/jobs"
//       );
//       setJobs(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const filteredInternships = internships.filter((item) => {
//     const searchMatch =
//       item.company
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       item.title
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       item.location
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase());

//     if (filter === "all") return searchMatch;

//     return (
//       searchMatch &&
//       item.type?.toLowerCase() === filter
//     );
//   });

//   const filteredJobs = jobs.filter((item) => {
//     return (
//       item.company
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//         item.title
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//         item.location
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//   });


//   return (
//     <Box
//       sx={{
//         background: "#f8fafc",
//         py: 6,
//       }}
//     >
//       <Container maxWidth="lg">

//         {/* Search */}

//         <TextField
//           fullWidth
//           placeholder="Search internships..."
//           value={searchTerm}
//           onChange={(e) =>
//             setSearchTerm(e.target.value)
//           }
//           sx={{
//             mb: 4,
//             background: "#fff",
//           }}
//           InputProps={{
//             startAdornment: (
//               <SearchIcon
//                 sx={{
//                   color: "gray",
//                   mr: 1,
//                 }}
//               />
//             ),
//           }}
//         />

//         {/* Filters */}

//         <ToggleButtonGroup
//           value={filter}
//           exclusive
//           onChange={(e, value) => {
//             if (value) setFilter(value);
//           }}
//           sx={{
//             mb: 5,
//             flexWrap: "wrap",
//             gap: 2,
//           }}
//         >
//           <ToggleButton value="all">
//              All
//            </ToggleButton>

//            <ToggleButton value="internship">
//              Internship
//            </ToggleButton>

//            <ToggleButton value="job">
//              Jobs
//            </ToggleButton>
//          </ToggleButtonGroup>

//         {/* Loading */}

//         {/* Loading */}

// {loading ? (
//   <Box
//     display="flex"
//     justifyContent="center"
//     py={10}
//   >
//     <CircularProgress />
//   </Box>
// ) : (
//   <>
//     {(filter === "all" || filter === "internship") && (
//       <>
//         <Typography
//           variant="h4"
//           fontWeight={700}
//           mb={3}
//         >
//           Latest Internships
//         </Typography>

//         {filteredInternships.length === 0 ? (
//           <Typography>No Internships Found</Typography>
//         ) : (
//           <Grid container spacing={3}>
//             {filteredInternships.map((internship) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 lg={4}
//                 key={internship._id}
//               >
//                 <InternshipCard
//                   internship={internship}
//                   type="internship"
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </>
//     )}

//     {(filter === "all" || filter === "job") && (
//       <>
//         <Typography
//           variant="h4"
//           fontWeight={700}
//           mt={8}
//           mb={3}
//         >
//           Latest Jobs
//         </Typography>

//         {filteredJobs.length === 0 ? (
//           <Typography>No Jobs Found</Typography>
//         ) : (
//           <Grid container spacing={3}>
//             {filteredJobs.map((job) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 lg={4}
//                 key={job._id}
//               >
                

//                 <InternshipCard
//                   internship={job}
//                   type="job"
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </>
//     )}

    
//   </>
// )}
        
//       </Container>
//     </Box>
//   );
// }

// export default InternshipSection;