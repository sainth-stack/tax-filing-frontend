import React from "react";
import { Grid } from "@mui/material";
import PaymentCard from "./PaymentCard";
import Layout from "../Layout/Layout";

const PaymentCardPage = () => {
    return (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <PaymentCard
              title="Visa Card"
              image="https://e7.pngegg.com/pngimages/83/811/png-clipart-mastercard-visa-payment-business-credit-card-mastercard-text-trademark-thumbnail.png"
              description="Your trusted payment method for secure transactions."
              buttonText="Pay Now"
              paymentAmount="$50,000.00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PaymentCard
              title="MasterCard"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_VemUxgztGV4ggToCRRDxGE334P-7wQ_Tqw&s"
              description="Convenient and reliable payment option."
              buttonText="Pay Now"
              paymentAmount="$40,000.00"
            />
          </Grid>
        </Grid>
    );
};

export default PaymentCardPage;
