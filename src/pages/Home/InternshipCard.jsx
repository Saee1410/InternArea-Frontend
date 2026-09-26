import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Building2,
  MapPin,
  IndianRupee,
  Clock3,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";

function InternshipCard({ internship, type }) {
  const navigate = useNavigate();

  // i18next
  const { t } = useTranslation();

  const handleViewDetails = () => {
    if (type === "job") {
      navigate(`/details/job/${internship._id}`);
    } else {
      console.log(internship._id);
      navigate(`/details/internship/${internship._id}`);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 1,
        border: "1px solid #e5e7eb",
        transition: "0.3s",

        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-5px)",
        },
      }}
    >
      {/* Top Content */}
      <CardContent
        sx={{
          p: 3,
        }}
      >
        {/* Badge + Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={t("internshipCard.activelyHiring")}
            size="small"
            sx={{
              color: "#00A5EC",
              background: "#eaf7ff",
              fontWeight: 500,
            }}
          />

          <Building2
            size={22}
            color="#9ca3af"
          />
        </Box>

        {/* Company */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mt: 3,
          }}
        >
          {internship.company}
        </Typography>

        {/* Role */}
        <Typography
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          {internship.title}
        </Typography>

        {/* Details */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "#6b7280",
            }}
          >
            <MapPin size={18} />

            <Typography>
              {internship.location}
            </Typography>
          </Box>

          {/* Stipend */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "#6b7280",
            }}
          >
            <IndianRupee size={18} />

            <Typography>
              {internship.stipend}
            </Typography>
          </Box>

          {/* Duration */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "#6b7280",
            }}
          >
            <Clock3 size={18} />

            <Typography>
              {internship.duration}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Bottom */}
      <CardActions
        sx={{
          borderTop: "1px solid #f1f1f1",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Job / Internship */}
        <Chip
          label={
            type === "job"
              ? t("internshipCard.job")
              : t("internshipCard.internship")
          }
          size="small"
          sx={{
            background: "#f3f4f6",
            color: "#374151",
          }}
        />

        {/* View Details */}
        <Button
          endIcon={<ArrowRight size={18} />}
          onClick={handleViewDetails}
          sx={{
            color: "#00A5EC",
            fontWeight: "600",
            textTransform: "none",
          }}
        >
          {t("internshipCard.viewDetails")}
        </Button>
      </CardActions>
    </Card>
  );
}

export default InternshipCard;

