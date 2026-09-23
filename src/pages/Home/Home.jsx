import { Box } from "@mui/material";

import Navbar from "../../components/layout/Navbar";
import Hero from "./Hero";
import InternshipSection from "./InternshipSection";
import Footer from "../../components/layout/Footer";
import CommunitySection from "./CommunitySection";

function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Hero />

        {/* Community Slider */}
        <Box sx={{ mt: -30 }}>
        <CommunitySection />
        </Box>

        {/* Internship */}
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
//       {/* Navbar */}
//       <Navbar />

//       {/* Main */}
//       <Box
//         component="main"
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           gap: 0, // Hero आणि InternshipSection मधील direct gap zero केला आहे
//         }}
//       >
//         {/* Hero Section */}
//         <Hero />

      

//         {/* Internship Section (Negative margin देऊन spacing अजुन कमी केली आहे) */}
//         <Box sx={{ mt: -35, position: "relative", zIndex: 1 }}>
//           <InternshipSection />
//         </Box>
//       </Box>
     

//       {/* Footer */}
//       <Footer />
//     </Box>
//   );
// }

// export default Home;


// import { Box } from "@mui/material";

// import Navbar from "../../components/layout/Navbar";
// import Hero from "./Hero";
// import InternshipSection from "./InternshipSection";
// import Footer from "../../components/layout/Footer";

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

//       {/* Navbar */}

//       <Navbar />

//       {/* Main */}

//       <Box
//         component="main"
//         sx={{
//           flex: 1,
//         }}
//       >

//         {/* Hero Section */}

//         <Hero />

//         {/* Internship Section */}

//         <InternshipSection />

//       </Box>

//       {/* Footer */}

//       <Footer />

//     </Box>

//   );

// }

// export default Home;











// import Navbar from "../../components/layout/Navbar";
// import Hero from "./Hero";
// import InternshipSection from "./InternshipSection";
// import Footer from "../../components/layout/Footer";

// function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-[#f8fafc]">

//       {/* Navbar */}
//       <Navbar />

//       {/* Main Content */}
//       <main className="flex-1">

//         {/* Hero Section */}
//         <Hero />

//         {/* Latest Internships */}
//         <InternshipSection />

//       </main>

//       {/* Footer */}
//       <Footer />

//     </div>
//   );
// }

// export default Home;



