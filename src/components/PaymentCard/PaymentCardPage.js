import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";

const PaymentCard = ({ title, paymentAmount }) => {
  return (
    <Card
      sx={{
        maxWidth: 300,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 4,
        textAlign: "center",
        p: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
            {paymentAmount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const PaymentCardPage = () => {
  return (
    <Grid container spacing={3} justifyContent="start">
      <Grid item>
        <PaymentCard title="Payment Received" paymentAmount="$50,000.00" />
      </Grid>
      <Grid item>
        <PaymentCard title="Payment Pending" paymentAmount="$40,000.00" />
      </Grid>
    </Grid>
  );
};

export default PaymentCardPage;
