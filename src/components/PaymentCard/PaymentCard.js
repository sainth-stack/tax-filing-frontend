import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CardMedia,
} from "@mui/material";
const PaymentCard = ({
  title,
  image,
  description,
  buttonText,
  paymentAmount,
}) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        boxShadow: 3,
        borderRadius: 3,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.005)",
          boxShadow: 5,
        },
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt="Payment Card"
        sx={{
          maxHeight: "3.5rem",
          boxShadow: "1px 2px 3px gray",
          objectFit: "cover",
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      />
      <CardContent>
        <CustomTypography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: ".8rem", sm: "1.2rem" },
          }}
        >
          {title}
        </CustomTypography>
        <CustomTypography
          variant="body2"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: "text.secondary",
          }}
        >
          {description}
        </CustomTypography>
        <CustomTypography
          sx={{
            fontWeight: "600",
            fontSize: { xs: ".8rem", sm: "1rem" },
            textAlign: "right",
            display: "block",
          }}
        >
          {paymentAmount}
        </CustomTypography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          
          sx={{
            fontSize: ".5rem",
            fontWeight: "bold",
            borderRadius: 3,
            "&:hover": { backgroundColor: "#1976d2" },
          }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PaymentCard;




/* for custom typography componenatt */


const CustomTypography = ({ children, variant, sx }) => (
  <Typography variant={variant} sx={sx}>
    {children}
  </Typography>
);