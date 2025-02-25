import React, { useEffect,useState } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import axios from 'axios'
import {base_url} from '../../const'
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
  const [paymentData,setPaymentData] = useState({

  })
  const fetchPayments = async (agencyName) => {
    try {
      if (!agencyName) {
        console.error("Agency name is missing");
        return;
      }
  
      const response = await axios.get(
        `${base_url}/payments-data?agencyName=${agencyName}`
      );
  
      if (response?.data) {
        console.log("Payments data received:", response.data);
        setPaymentData(response?.data)
      } else {
        console.error("No payments data received");
      }
    } catch (error) {
      console.error(
        "Error fetching payments:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    fetchPayments(user.agency)
  },[])
  return (
    <Grid container spacing={3} justifyContent="start">
      <Grid item>
        <PaymentCard title="Payment Received" paymentAmount={paymentData?.completedAmount || 0} />
      </Grid>
      <Grid item>
        <PaymentCard title="Payment Pending" paymentAmount={paymentData?.pendingAmount || 0}/>
      </Grid>
    </Grid>
  );
};

export default PaymentCardPage;
