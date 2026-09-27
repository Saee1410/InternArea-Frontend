import { Box } from "@mui/material";

import Navbar from "../../components/layout/Navbar";
import Hero from "./Hero";
import InternshipSection from "./InternshipSection";
import CommunitySection from "./CommunitySection";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
        }}
      >
        {/* HERO */}
        <Hero />

        {/* COMMUNITY */}
        <CommunitySection />

        {/* INTERNSHIPS + JOBS */}
        <InternshipSection />
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;

// import { Box } from "@mui/material";

// import Navbar from "../../components/layout/Navbar";
// import Hero from "./Hero";
// import InternshipSection from "./InternshipSection";
// import Footer from "../../components/layout/Footer";
// import CommunitySection from "./CommunitySection";

// function Home() {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         background: "#f8fafc",
//       }}
//     >
//       <Navbar />

//       <Box
//         component="main"
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Hero />

//         {/* Community Slider */}
//         <Box
//           sx={{
//             mt: 0,
//           }}
//         >
//           <CommunitySection />
//         </Box>

//         {/* Internship */}
//         <InternshipSection />
//       </Box>

//       <Footer />
//     </Box>
//   );
// }

// export default Home;





// // import { Box } from "@mui/material";

// // import Navbar from "../../components/layout/Navbar";
// // import Hero from "./Hero";
// // import InternshipSection from "./InternshipSection";
// // import Footer from "../../components/layout/Footer";
// // import CommunitySection from "./CommunitySection";

// // function Home() {
// //   return (
// //     <Box
// //       sx={{
// //         minHeight: "100vh",
// //         display: "flex",
// //         flexDirection: "column",
// //         background: "#f8fafc",
// //       }}
// //     >
// //       <Navbar />

// //       <Box
// //         component="main"
// //         sx={{
// //           flex: 1,
// //           display: "flex",
// //           flexDirection: "column",
// //         }}
// //       >
// //         <Hero />

// //         {/* Community Slider */}
// //         <Box sx={{ mt: -30 }}>
// //         <CommunitySection />
// //         </Box>

// //         {/* Internship */}
// //         <InternshipSection />
// //       </Box>

// //       <Footer />
// //     </Box>
// //   );
// // }

// // export default Home;

