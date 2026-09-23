import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import {
  Box,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const OtherUserProfile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Friend Request States
  const [friendStatus, setFriendStatus] = useState("none");
  const [friendLoading, setFriendLoading] = useState(false);
  const [friendMessage, setFriendMessage] = useState("");

  // =========================================
  // FETCH OTHER USER PROFILE
  // =========================================

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setFriendMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8000/api/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Other User:", response.data);

      setUser(response.data);
    } catch (error) {
      console.error("Fetch User Profile Error:", error);

      setFriendMessage(
        error.response?.data?.message ||
          "Failed to load user profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SEND FRIEND REQUEST
  // =========================================

  const sendFriendRequest = async () => {
    try {
      setFriendLoading(true);
      setFriendMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/friends/request",
        {
          receiverId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Friend Request Response:",
        response.data
      );

      setFriendStatus("pending");

      setFriendMessage(
        response.data.message ||
          "Friend request sent successfully"
      );
    } catch (error) {
      console.error(
        "Friend Request Error:",
        error
      );

      setFriendMessage(
        error.response?.data?.message ||
          "Something went wrong while sending friend request"
      );
    } finally {
      setFriendLoading(false);
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
  // USER NOT FOUND
  // =========================================

  if (!user) {
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
          <Typography color="error">
            {friendMessage || "User not found"}
          </Typography>
        </Box>

        <Footer />
      </>
    );
  }

  // =========================================
  // PROFILE UI
  // =========================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: "#f5f7fb",
          py: 5,
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: "700px",
            mx: "auto",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              height: "180px",
              background:
                "linear-gradient(135deg, #1976d2, #7b1fa2)",
            }}
          />

          {/* PROFILE CONTENT */}

          <Box
            sx={{
              px: 4,
              pb: 4,
              textAlign: "center",
            }}
          >
            {/* PROFILE PHOTO */}

            <Avatar
              src={user.profilePhoto || ""}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mt: -7,
                border: "5px solid white",
                fontSize: "40px",
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>

            {/* NAME */}

            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mt: 2,
              }}
            >
              {user.name}
            </Typography>

            {/* EMAIL */}

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {user.email}
            </Typography>

            {/* =========================================
                ADD FRIEND BUTTON
            ========================================= */}

            <Button
              variant="contained"
              onClick={sendFriendRequest}
              disabled={
                friendLoading ||
                friendStatus === "pending"
              }
              sx={{
                mt: 3,
                borderRadius: "25px",
                px: 4,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {friendLoading
                ? "Sending..."
                : friendStatus === "pending"
                ? "Request Sent"
                : "Add Friend"}
            </Button>

            {/* FRIEND MESSAGE */}

            {friendMessage && (
              <Typography
                sx={{
                  mt: 1.5,
                  color: "primary.main",
                }}
              >
                {friendMessage}
              </Typography>
            )}

            {/* =========================================
                USER DETAILS
            ========================================= */}

            <Box
              sx={{
                mt: 4,
                textAlign: "left",
              }}
            >
              {/* PHONE */}

              {user.phone && (
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold">
                    Phone
                  </Typography>

                  <Typography color="text.secondary">
                    {user.phone}
                  </Typography>
                </Box>
              )}

              {/* LOCATION */}

              {user.location && (
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold">
                    Location
                  </Typography>

                  <Typography color="text.secondary">
                    {user.location}
                  </Typography>
                </Box>
              )}

              {/* QUALIFICATION */}

              {user.qualification && (
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold">
                    Qualification
                  </Typography>

                  <Typography color="text.secondary">
                    {user.qualification}
                  </Typography>
                </Box>
              )}

              {/* SKILLS */}

              {user.skills && (
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold">
                    Skills
                  </Typography>

                  <Typography color="text.secondary">
                    {user.skills}
                  </Typography>
                </Box>
              )}

              {/* BIO */}

              {user.bio && (
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <Typography fontWeight="bold">
                    Bio
                  </Typography>

                  <Typography color="text.secondary">
                    {user.bio}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* FOOTER */}

      <Footer />
    </>
  );
};

export default OtherUserProfile;
