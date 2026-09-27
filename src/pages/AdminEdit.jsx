import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

import Navbar from "../components/layout/Navbar";

function AdminEdit() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    profilePhoto: "",
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // IMAGE COMPRESS & RESIZE
  // ==========================================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          const compressedBase64 =
            canvas.toDataURL("image/jpeg", 0.7);

          setFormData((prevData) => ({
            ...prevData,
            profilePhoto: compressedBase64,
          }));
        };
      };

      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // REMOVE PHOTO
  // ==========================================

  const handleRemovePhoto = () => {
    setFormData((prevData) => ({
      ...prevData,
      profilePhoto: "",
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(t("adminEdit.profileUpdated"));

      navigate("/admin");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          t("adminEdit.profileUpdateFailed")
      );
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: {
            xs: 3,
            sm: 6,
          },
          px: {
            xs: 1.5,
            sm: 2,
          },

          backgroundImage: `url('/profile.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(10px)",
            zIndex: 1,
          },
        }}
      >
        <Paper
          elevation={12}
          sx={{
            position: "relative",
            zIndex: 2,

            maxWidth: 600,
            width: "100%",

            mx: {
              xs: 0,
              sm: 2,
            },

            p: {
              xs: 2.2,
              sm: 4,
            },

            borderRadius: {
              xs: 3,
              sm: 4,
            },

            backgroundColor:
              "rgba(255, 255, 255, 0.92)",

            boxShadow:
              "0px 15px 35px rgba(0, 0, 0, 0.2)",

            backdropFilter: "blur(5px)",
          }}
        >
          {/* TITLE */}

          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            mb={{
              xs: 3,
              sm: 4,
            }}
            color="#1a202c"
            letterSpacing={0.5}
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "2.125rem",
              },
            }}
          >
            {t("adminEdit.title")}
          </Typography>

          {/* PROFILE PHOTO */}

          <Box
            display="flex"
            justifyContent="center"
            mb={{
              xs: 3,
              sm: 4,
            }}
          >
            <Box
              position="relative"
              display="inline-block"
            >
              <Avatar
                src={formData.profilePhoto}
                alt={formData.name}
                sx={{
                  width: {
                    xs: 110,
                    sm: 130,
                  },

                  height: {
                    xs: 110,
                    sm: 130,
                  },

                  border: "4px solid #ffffff",

                  boxShadow:
                    "0px 8px 25px rgba(0, 0, 0, 0.2)",
                }}
              />

              {/* UPLOAD */}

              <Tooltip
                title={t("adminEdit.uploadPhoto")}
                placement="top"
              >
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,

                    backgroundColor: "#1976d2",
                    color: "#fff",

                    boxShadow:
                      "0px 4px 10px rgba(0,0,0,0.3)",

                    border:
                      "2px solid #ffffff",

                    "&:hover": {
                      backgroundColor: "#115293",
                    },

                    p: 1,
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </IconButton>
              </Tooltip>

              {/* REMOVE */}

              {formData.profilePhoto && (
                <Tooltip
                  title={t("adminEdit.removePhoto")}
                  placement="top"
                >
                  <IconButton
                    onClick={handleRemovePhoto}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,

                      backgroundColor: "#d32f2f",
                      color: "#fff",

                      boxShadow:
                        "0px 4px 10px rgba(0,0,0,0.3)",

                      border:
                        "2px solid #ffffff",

                      "&:hover": {
                        backgroundColor: "#9a0007",
                      },

                      p: 0.8,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* FORM */}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t("adminEdit.profilePhotoUrl")}
              name="profilePhoto"
              value={formData.profilePhoto}
              onChange={handleChange}
              placeholder={t(
                "adminEdit.imageUrlPlaceholder"
              )}
              sx={{
                mb: {
                  xs: 2,
                  sm: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label={t("adminEdit.fullName")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{
                mb: {
                  xs: 2,
                  sm: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label={t("adminEdit.email")}
              value={formData.email}
              disabled
              sx={{
                mb: {
                  xs: 2,
                  sm: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label={t("adminEdit.phone")}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{
                mb: {
                  xs: 2,
                  sm: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label={t("adminEdit.location")}
              name="location"
              value={formData.location}
              onChange={handleChange}
              sx={{
                mb: {
                  xs: 3,
                  sm: 4,
                },
              }}
            />

            {/* SAVE BUTTON */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: {
                  xs: 1.5,
                  sm: 1.8,
                },

                borderRadius: 2.5,

                textTransform: "none",

                fontSize: {
                  xs: 16,
                  sm: 17,
                },

                fontWeight: "600",

                background:
                  "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",

                boxShadow:
                  "0 3px 5px 2px rgba(33, 203, 243, .3)",

                transition:
                  "all 0.3s ease",

                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",

                  boxShadow:
                    "0 6px 15px 2px rgba(33, 203, 243, .4)",
                },
              }}
            >
              {t("adminEdit.saveChanges")}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}

export default AdminEdit;







// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import {
//   Box,
//   Paper,
//   Typography,
//   Avatar,
//   TextField,
//   Button,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import DeleteIcon from "@mui/icons-material/Delete";

// import Navbar from "../components/layout/Navbar";

// function AdminEdit() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//    const API_URL = import.meta.env.VITE_API_URL;

//   const [formData, setFormData] = useState({
//     profilePhoto: "",
//     name: "",
//     email: "",
//     phone: "",
//     location: "",
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/api/profile`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setFormData(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Image Compress & Resize Logic
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;

//         img.onload = () => {
//           const canvas = document.createElement("canvas");

//           const MAX_WIDTH = 400;
//           const MAX_HEIGHT = 400;

//           let width = img.width;
//           let height = img.height;

//           if (width > height) {
//             if (width > MAX_WIDTH) {
//               height *= MAX_WIDTH / width;
//               width = MAX_WIDTH;
//             }
//           } else {
//             if (height > MAX_HEIGHT) {
//               width *= MAX_HEIGHT / height;
//               height = MAX_HEIGHT;
//             }
//           }

//           canvas.width = width;
//           canvas.height = height;

//           const ctx = canvas.getContext("2d");
//           ctx.drawImage(img, 0, 0, width, height);

//           const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

//           setFormData((prevData) => ({
//             ...prevData,
//             profilePhoto: compressedBase64,
//           }));
//         };
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   // Remove Photo Handler
//   const handleRemovePhoto = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       profilePhoto: "",
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem("token");

//       await axios.put(
//         `${API_URL}/api/profile`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert(t("adminEdit.profileUpdated"));
//       navigate("/admin");
//     } catch (error) {
//       console.log(error);

//       alert(
//         error.response?.data?.message ||
//           t("adminEdit.profileUpdateFailed")
//       );
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           minHeight: "100vh",
//           position: "relative",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           py: 6,
//           backgroundImage: `url('/profile.jpg')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",

//           "&::before": {
//             content: '""',
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.4)",
//             backdropFilter: "blur(10px)",
//             zIndex: 1,
//           },
//         }}
//       >
//         <Paper
//           elevation={12}
//           sx={{
//             position: "relative",
//             zIndex: 2,
//             maxWidth: 600,
//             width: "100%",
//             mx: 2,
//             p: 4,
//             borderRadius: 4,
//             backgroundColor: "rgba(255, 255, 255, 0.92)",
//             boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.2)",
//             backdropFilter: "blur(5px)",
//           }}
//         >
//           <Typography
//             variant="h4"
//             fontWeight="700"
//             textAlign="center"
//             mb={4}
//             color="#1a202c"
//             letterSpacing={0.5}
//           >
//             {t("adminEdit.title")}
//           </Typography>

//           {/* Profile Photo */}
//           <Box display="flex" justifyContent="center" mb={4}>
//             <Box position="relative" display="inline-block">
//               <Avatar
//                 src={formData.profilePhoto}
//                 alt={formData.name}
//                 sx={{
//                   width: 130,
//                   height: 130,
//                   border: "4px solid #ffffff",
//                   boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
//                 }}
//               />

//               <Tooltip
//                 title={t("adminEdit.uploadPhoto")}
//                 placement="top"
//               >
//                 <IconButton
//                   component="label"
//                   sx={{
//                     position: "absolute",
//                     bottom: 2,
//                     right: 2,
//                     backgroundColor: "#1976d2",
//                     color: "#fff",
//                     boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
//                     border: "2px solid #ffffff",
//                     "&:hover": {
//                       backgroundColor: "#115293",
//                     },
//                     p: 1,
//                   }}
//                 >
//                   <PhotoCameraIcon fontSize="small" />

//                   <input
//                     type="file"
//                     hidden
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                   />
//                 </IconButton>
//               </Tooltip>

//               {formData.profilePhoto && (
//                 <Tooltip
//                   title={t("adminEdit.removePhoto")}
//                   placement="top"
//                 >
//                   <IconButton
//                     onClick={handleRemovePhoto}
//                     sx={{
//                       position: "absolute",
//                       top: 2,
//                       right: 2,
//                       backgroundColor: "#d32f2f",
//                       color: "#fff",
//                       boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
//                       border: "2px solid #ffffff",
//                       "&:hover": {
//                         backgroundColor: "#9a0007",
//                       },
//                       p: 0.8,
//                     }}
//                   >
//                     <DeleteIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               )}
//             </Box>
//           </Box>

//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label={t("adminEdit.profilePhotoUrl")}
//               name="profilePhoto"
//               value={formData.profilePhoto}
//               onChange={handleChange}
//               placeholder={t("adminEdit.imageUrlPlaceholder")}
//               sx={{ mb: 3 }}
//             />

//             <TextField
//               fullWidth
//               label={t("adminEdit.fullName")}
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               sx={{ mb: 3 }}
//             />

//             <TextField
//               fullWidth
//               label={t("adminEdit.email")}
//               value={formData.email}
//               disabled
//               sx={{ mb: 3 }}
//             />

//             <TextField
//               fullWidth
//               label={t("adminEdit.phone")}
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               sx={{ mb: 3 }}
//             />

//             <TextField
//               fullWidth
//               label={t("adminEdit.location")}
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               sx={{ mb: 4 }}
//             />

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               size="large"
//               sx={{
//                 py: 1.8,
//                 borderRadius: 2.5,
//                 textTransform: "none",
//                 fontSize: 17,
//                 fontWeight: "600",
//                 background:
//                   "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
//                 boxShadow:
//                   "0 3px 5px 2px rgba(33, 203, 243, .3)",
//                 transition: "all 0.3s ease",

//                 "&:hover": {
//                   background:
//                     "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",
//                   boxShadow:
//                     "0 6px 15px 2px rgba(33, 203, 243, .4)",
//                 },
//               }}
//             >
//               {t("adminEdit.saveChanges")}
//             </Button>
//           </form>
//         </Paper>
//       </Box>
//     </>
//   );
// }

// export default AdminEdit;


