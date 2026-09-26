import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sendingId, setSendingId] = useState(null);

  const navigate = useNavigate();

  // =========================================
  // FETCH USERS
  // =========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8000/api/auth/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);

      setError(
        error.response?.data?.message ||
          t("users.failedToFetch")
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SEND FRIEND REQUEST
  // =========================================

  const sendFriendRequest = async (userId) => {
    try {
      setSendingId(userId);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/friends/request",
        {
          receiverId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          t("users.friendRequestSent")
      );
    } catch (error) {
      console.error(
        "Send Friend Request Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          t("users.friendRequestFailed")
      );
    } finally {
      setSendingId(null);
    }
  };

  // =========================================
  // LOADING
  // =========================================

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
          }}
        >
          <CircularProgress />
        </Box>

        <Footer />
      </>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          p: 3,
          minHeight: "70vh",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          {t("users.title")}
        </Typography>

        {/* SUCCESS MESSAGE */}

        {message && (
          <Typography
            color="success.main"
            mb={2}
          >
            {message}
          </Typography>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <Typography
            color="error"
            mb={2}
          >
            {error}
          </Typography>
        )}

        {/* USERS */}

        {users.length === 0 ? (
          <Typography color="text.secondary">
            {t("users.noUsers")}
          </Typography>
        ) : (
          users.map((user) => (
            <Card
              key={user._id}
              sx={{
                mb: 2,
                borderRadius: 3,
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* USER INFO */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={user.profilePhoto || ""}
                    sx={{
                      width: 50,
                      height: 50,
                    }}
                  >
                    {user.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold">
                      {user.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                {/* BUTTONS */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  {/* VIEW PROFILE */}

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(`/profile/${user._id}`)
                    }
                    sx={{
                      borderRadius: "25px",
                      px: 3,
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {t("users.viewProfile")}
                  </Button>

                  {/* SEND FRIEND REQUEST */}

                  <Button
                    variant="contained"
                    disabled={sendingId === user._id}
                    onClick={() =>
                      sendFriendRequest(user._id)
                    }
                    sx={{
                      borderRadius: "25px",
                      px: 3,
                      textTransform: "none",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sendingId === user._id
                      ? t("users.sending")
                      : t("users.addFriend")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Footer />
    </>
  );
};

export default Users;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Button,
//   Avatar,
//   CircularProgress,
// } from "@mui/material";

// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [sendingId, setSendingId] = useState(null);

//   const navigate = useNavigate();

//   // =========================================
//   // FETCH USERS
//   // =========================================

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "http://localhost:8000/api/auth/users",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setUsers(response.data.users || []);
//     } catch (error) {
//       console.error("Fetch Users Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to fetch users"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================
//   // SEND FRIEND REQUEST
//   // =========================================

//   const sendFriendRequest = async (userId) => {
//     try {
//       setSendingId(userId);
//       setMessage("");
//       setError("");

//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         "http://localhost:8000/api/friends/request",
//         {
//           receiverId: userId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(
//         response.data.message ||
//           "Friend request sent successfully!"
//       );
//     } catch (error) {
//       console.error(
//         "Send Friend Request Error:",
//         error
//       );

//       setError(
//         error.response?.data?.message ||
//           "Failed to send friend request"
//       );
//     } finally {
//       setSendingId(null);
//     }
//   };

//   // =========================================
//   // LOADING
//   // =========================================

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
//           }}
//         >
//           <CircularProgress />
//         </Box>

//         <Footer />
//       </>
//     );
//   }

//   // =========================================
//   // UI
//   // =========================================

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           maxWidth: "900px",
//           mx: "auto",
//           p: 3,
//           minHeight: "70vh",
//         }}
//       >
//         <Typography
//           variant="h4"
//           fontWeight="bold"
//           mb={3}
//         >
//           Users
//         </Typography>

//         {/* SUCCESS MESSAGE */}

//         {message && (
//           <Typography
//             color="success.main"
//             mb={2}
//           >
//             {message}
//           </Typography>
//         )}

//         {/* ERROR MESSAGE */}

//         {error && (
//           <Typography
//             color="error"
//             mb={2}
//           >
//             {error}
//           </Typography>
//         )}

//         {/* USERS */}

//         {users.length === 0 ? (
//           <Typography color="text.secondary">
//             No other users found.
//           </Typography>
//         ) : (
//           users.map((user) => (
//             <Card
//               key={user._id}
//               sx={{
//                 mb: 2,
//                 borderRadius: 3,
//               }}
//             >
//               <CardContent
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: 2,
//                 }}
//               >
//                 {/* USER INFO */}

//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 2,
//                   }}
//                 >
//                   <Avatar
//                     src={user.profilePhoto || ""}
//                     sx={{
//                       width: 50,
//                       height: 50,
//                     }}
//                   >
//                     {user.name
//                       ?.charAt(0)
//                       ?.toUpperCase()}
//                   </Avatar>

//                   <Box>
//                     <Typography fontWeight="bold">
//                       {user.name}
//                     </Typography>

//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                     >
//                       {user.email}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 {/* BUTTONS */}

//                 <Box
//                   sx={{
//                     display: "flex",
//                     gap: 1,
//                   }}
//                 >
//                   {/* VIEW PROFILE */}

//                   <Button
//                     variant="outlined"
//                     onClick={() =>
//                       navigate(`/profile/${user._id}`)
//                     }
//                     sx={{
//                       borderRadius: "25px",
//                       px: 3,
//                       textTransform: "none",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     View Profile
//                   </Button>

//                   {/* SEND FRIEND REQUEST */}

//                   <Button
//                     variant="contained"
//                     disabled={sendingId === user._id}
//                     onClick={() =>
//                       sendFriendRequest(user._id)
//                     }
//                     sx={{
//                       borderRadius: "25px",
//                       px: 3,
//                       textTransform: "none",
//                       fontWeight: "bold",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {sendingId === user._id
//                       ? "Sending..."
//                       : "Add Friend"}
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </Box>

//       <Footer />
//     </>
//   );
// };

// export default Users;

