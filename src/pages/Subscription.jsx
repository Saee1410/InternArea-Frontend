import { useState } from "react";
import axios from "axios";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Check,
  Crown,
  Shield,
  Star,
  Zap,
} from "lucide-react";

import { useTranslation } from "react-i18next";

const plans = [
  {
    name: "Free",
    plan: "free",
    price: 0,
    applications: "1 application / month",
    icon: <Shield size={32} />,
    description: "Perfect for getting started",
    features: [
      "1 internship application per month",
      "Browse internships",
      "Browse jobs",
      "Create profile",
    ],
  },
  {
    name: "Bronze",
    plan: "bronze",
    price: 100,
    applications: "3 applications / month",
    icon: <Star size={32} />,
    description: "For students applying regularly",
    features: [
      "3 internship applications per month",
      "Browse internships",
      "Browse jobs",
      "Create profile",
    ],
  },
  {
    name: "Silver",
    plan: "silver",
    price: 300,
    applications: "5 applications / month",
    icon: <Zap size={32} />,
    description: "For active internship seekers",
    features: [
      "5 internship applications per month",
      "Browse internships",
      "Browse jobs",
      "Create profile",
    ],
  },
  {
    name: "Gold",
    plan: "gold",
    price: 1000,
    applications: "Unlimited applications",
    icon: <Crown size={32} />,
    description: "Best for serious job seekers",
    features: [
      "Unlimited internship applications",
      "Browse internships",
      "Browse jobs",
      "Create profile",
    ],
  },
];

function Subscriptions() {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // ==========================================
  // HANDLE SUBSCRIPTION
  // ==========================================

  const handleSubscribe = async (plan) => {
    try {
      setMessage("");

      const token = localStorage.getItem("token");

      // ==========================================
      // CHECK LOGIN
      // ==========================================

      if (!token) {
        setMessage(t("subscriptions.loginRequired"));
        setMessageType("warning");
        return;
      }

      // ==========================================
      // FREE PLAN
      // ==========================================

      if (plan === "free") {
        setMessage(t("subscriptions.freePlanMessage"));
        setMessageType("info");
        return;
      }

      setLoadingPlan(plan);

      // ==========================================
      // CREATE RAZORPAY ORDER
      // ==========================================

      const res = await axios.post(
        `${API_URL}/api/payment/subscription/create-order`,
        {
          plan: plan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create Order Response:", res.data);

      const { order, key } = res.data;

      // ==========================================
      // CHECK ORDER
      // ==========================================

      if (!order || !order.id) {
        console.error("Invalid Razorpay order:", res.data);

        setMessage(t("subscriptions.invalidOrder"));
        setMessageType("error");
        setLoadingPlan(null);

        return;
      }

      // ==========================================
      // CHECK RAZORPAY
      // ==========================================

      if (!window.Razorpay) {
        setMessage(t("subscriptions.razorpayNotLoaded"));

        setMessageType("error");
        setLoadingPlan(null);

        return;
      }

      // ==========================================
      // RAZORPAY CHECKOUT OPTIONS
      // ==========================================

      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "InternArea",
        description: `${plan.toUpperCase()} Subscription`,
        order_id: order.id,

        // ==========================================
        // PAYMENT SUCCESS
        // ==========================================

        handler: async function (response) {
          try {
            console.log("Razorpay Response:", response);

            const verifyResponse = await axios.post(
              `${API_URL}/api/payment/subscription/verify`,
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(
              "Subscription Verify Response:",
              verifyResponse.data
            );

            setMessage(
              verifyResponse.data.message ||
                t("subscriptions.activated")
            );

            setMessageType("success");
          } catch (error) {
            console.error(
              "Subscription Verification Error:",
              error
            );

            console.error(
              "Verification Status:",
              error.response?.status
            );

            console.error(
              "Verification Response:",
              error.response?.data
            );

            setMessage(
              error.response?.data?.message ||
                t("subscriptions.verificationFailed")
            );

            setMessageType("error");
          } finally {
            setLoadingPlan(null);
          }
        },

        // ==========================================
        // PAYMENT MODAL CLOSED
        // ==========================================

        modal: {
          ondismiss: function () {
            setLoadingPlan(null);

            setMessage(
              t("subscriptions.paymentCancelled")
            );

            setMessageType("warning");
          },
        },

        // ==========================================
        // RAZORPAY THEME
        // ==========================================

        theme: {
          color: "#1976d2",
        },
      };

      // ==========================================
      // CREATE RAZORPAY INSTANCE
      // ==========================================

      const razorpay = new window.Razorpay(options);

      // ==========================================
      // PAYMENT FAILED
      // ==========================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment Failed:",
            response.error
          );

          setMessage(
            response.error?.description ||
              t("subscriptions.paymentFailed")
          );

          setMessageType("error");
          setLoadingPlan(null);
        }
      );

      // ==========================================
      // OPEN RAZORPAY
      // ==========================================

      razorpay.open();
    } catch (error) {
      // ==========================================
      // CREATE ORDER ERROR
      // ==========================================

      console.error(
        "Subscription Payment Error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response Data:",
        error.response?.data
      );

      console.error(
        "Error Message:",
        error.message
      );

      // ==========================================
      // SHOW BACKEND MESSAGE
      // ==========================================

      setMessage(
        error.response?.data?.message ||
          t("subscriptions.createPaymentFailed")
      );

      // ==========================================
      // 403 = PAYMENT TIME RESTRICTION
      // ==========================================

      if (error.response?.status === 403) {
        setMessageType("warning");
      } else {
        setMessageType("error");
      }

      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: "#f8fafc",
          py: {
            xs: 5,
            md: 8,
          },
        }}
      >
        <Container maxWidth="lg">

          {/* ==========================================
              HEADER
          ========================================== */}

          <Box
            textAlign="center"
            mb={6}
          >
            <Chip
              label={t("subscriptions.plans")}
              color="primary"
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            />

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                },
              }}
            >
              {t("subscriptions.choosePlan")}
            </Typography>

            <Typography
              color="text.secondary"
              mt={2}
              maxWidth={650}
              mx="auto"
              lineHeight={1.7}
            >
              {t("subscriptions.subtitle")}
            </Typography>
          </Box>

          {/* ==========================================
              PAYMENT TIME INFO
          ========================================== */}

          <Alert
            severity="info"
            sx={{
              maxWidth: 850,
              mx: "auto",
              mb: 5,
              borderRadius: 2,
            }}
          >
            {t("subscriptions.paymentTime")}{" "}
            <strong>
              {t("subscriptions.paymentTimeRange")}
            </strong>
            .
          </Alert>

          {/* ==========================================
              MESSAGE
          ========================================== */}

          {message && (
            <Alert
              severity={messageType}
              sx={{
                maxWidth: 850,
                mx: "auto",
                mb: 5,
                borderRadius: 2,
              }}
            >
              {message}
            </Alert>
          )}

          {/* ==========================================
              PLANS
          ========================================== */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.plan}
                elevation={3}
                sx={{
                  borderRadius: 3,
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >

                {/* POPULAR BADGE */}

                {plan.plan === "silver" && (
                  <Chip
                    label={t("subscriptions.mostPopular")}
                    color="primary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontWeight: 600,
                    }}
                  />
                )}

                <CardContent
                  sx={{
                    p: 3.5,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >

                  {/* ICON */}

                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#eef4ff",
                      color: "primary.main",
                      mb: 3,
                    }}
                  >
                    {plan.icon}
                  </Box>

                  {/* PLAN NAME */}

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                  >
                    {t(
                      `subscriptions.planNames.${plan.plan}`
                    )}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mt={1}
                    minHeight={45}
                  >
                    {t(
                      `subscriptions.planDescriptions.${plan.plan}`
                    )}
                  </Typography>

                  {/* PRICE */}

                  <Box
                    display="flex"
                    alignItems="baseline"
                    gap={0.5}
                    mt={3}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                    >
                      ₹{plan.price}
                    </Typography>

                    {plan.price > 0 && (
                      <Typography
                        color="text.secondary"
                      >
                        {t("subscriptions.month")}
                      </Typography>
                    )}
                  </Box>

                  {/* APPLICATIONS */}

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      background: "#f8fafc",
                    }}
                  >
                    <Typography fontWeight={600}>
                      {t(
                        `subscriptions.applications.${plan.plan}`
                      )}
                    </Typography>
                  </Box>

                  {/* FEATURES */}

                  <Box
                    sx={{
                      mt: 3,
                      flexGrow: 1,
                    }}
                  >
                    {plan.features.map(
                      (feature, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="flex-start"
                          gap={1.2}
                          mb={1.5}
                        >
                          <Check
                            size={18}
                            style={{
                              minWidth: 18,
                              marginTop: 2,
                            }}
                          />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {t(
                              `subscriptions.features.${plan.plan}.${index}`
                            )}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Box>

                  {/* BUTTON */}

                  <Button
                    variant={
                      plan.plan === "free"
                        ? "outlined"
                        : "contained"
                    }
                    fullWidth
                    size="large"
                    onClick={() =>
                      handleSubscribe(plan.plan)
                    }
                    disabled={loadingPlan !== null}
                    sx={{
                      mt: 3,
                      py: 1.3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {loadingPlan === plan.plan ? (
                      <CircularProgress
                        size={23}
                        color="inherit"
                      />
                    ) : plan.plan === "free" ? (
                      t("subscriptions.currentFreePlan")
                    ) : (
                      t("subscriptions.upgradeTo", {
                        plan: t(
                          `subscriptions.planNames.${plan.plan}`
                        ),
                      })
                    )}
                  </Button>

                </CardContent>
              </Card>
            ))}
          </Box>

          {/* ==========================================
              BOTTOM INFORMATION
          ========================================== */}

          <Box
            sx={{
              mt: 6,
              p: 4,
              background: "white",
              borderRadius: 3,
              boxShadow: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              {t("subscriptions.bottomTitle")}
            </Typography>

            <Typography
              color="text.secondary"
              mt={1}
            >
              {t("subscriptions.bottomDescription")}
            </Typography>
          </Box>

        </Container>
      </Box>

      <Footer />
    </>
  );
}

export default Subscriptions;

