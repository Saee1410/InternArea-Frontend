import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const FriendRequests = () => {
  const { t } = useTranslation();
 const API_URL = import.meta.env.VITE_API_URL;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================================
  // FETCH FRIEND REQUESTS
  // =========================================

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/friends/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(response.data.requests || []);
    } catch (error) {
      console.error(
        "Fetch Friend Requests Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("friendRequests.fetchFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ACCEPT REQUEST
  // =========================================

  const acceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/friends/request/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          t("friendRequests.acceptSuccess")
      );

      setRequests((prev) =>
        prev.filter(
          (request) => request._id !== requestId
        )
      );
    } catch (error) {
      console.error(
        "Accept Friend Request Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("friendRequests.acceptFailed")
      );
    }
  };

  // =========================================
  // REJECT REQUEST
  // =========================================

  const rejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/friends/request/${requestId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          t("friendRequests.rejectSuccess")
      );

      setRequests((prev) =>
        prev.filter(
          (request) => request._id !== requestId
        )
      );
    } catch (error) {
      console.error(
        "Reject Friend Request Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          t("friendRequests.rejectFailed")
      );
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
          maxWidth: "700px",
          mx: "auto",
          p: 3,
          minHeight: "70vh",
        }}
      >
        {/* PAGE TITLE */}

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          {t("friendRequests.title")}
        </Typography>

        {/* MESSAGE */}

        {message && (
          <Typography
            color="primary"
            sx={{
              mb: 2,
            }}
          >
            {message}
          </Typography>
        )}

        {/* NO REQUESTS */}

        {requests.length === 0 ? (
          <Typography color="text.secondary">
            {t("friendRequests.noRequests")}
          </Typography>
        ) : (
          requests.map((request) => {
            const sender = request.sender;

            return (
              <Card
                key={request._id}
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
                      src={
                        sender?.profilePhoto || ""
                      }
                    >
                      {sender?.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography fontWeight="bold">
                        {sender?.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {sender?.email}
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
                    <Button
                      variant="contained"
                      onClick={() =>
                        acceptRequest(
                          request._id
                        )
                      }
                    >
                      {t("friendRequests.accept")}
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        rejectRequest(
                          request._id
                        )
                      }
                    >
                      {t("friendRequests.reject")}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      <Footer />
    </>
  );
};

export default FriendRequests;
