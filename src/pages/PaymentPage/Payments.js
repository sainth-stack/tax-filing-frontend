import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";

import { CloseOutlined } from "@mui/icons-material";

import Layout from "../../components/Layout/Layout";
import axios from "axios";

import { base_url } from "../../const";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import PaymentForm from "./PaymentForm";
import SelectInput from "../../components/select";
import PaymentTable from "./PaymentTable";
import PaymentCardPage from "../../components/PaymentCard/PaymentCardPage";

const PaymentPage = () => {

  const [payments, setPayments] = useState([])
  const [totalPayments, setTotalPayments] = useState(0);
  
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0); // Default page 1
  const [pageSize, setPageSize] = useState(1);

  const [paymentId, setPaymentId] = useState("");
  const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({});

  const [view, setView] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [companyRefresh, setCompanyRefresh] = useState(false);
  const [showAutoGenModal, setShowAutoGenModal] = useState(false); // For modal visibility
  

  const location = useLocation();


 

  // console.log("comeplted from parent,completedTaskView", completedTaskView);

  const fetchPayments = async () => {
    try {
      console.log("User Data:", user);

      if (!user?.agency) {
        console.error("Agency name is missing");
        return;
      }

      let agencyName=user?.agency

      console.log("agency Name Vishnu",agencyName)
      // Fetch payments for the specific agency
     const response = await axios.get(
       `${base_url}/payments?agencyName=${user.agency}`
     );


      console.log("resposefdvnkjfnv",response.data)
    
      if (response?.data.data) {
        setPayments(response.data.data);
        setTotalPayments(response.data.totalPayments || 0); // Ensure totalPayments is always a number
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


  
  console.log("paymetn state",payments)

   useEffect(() => {
    
    fetchPayments();
  }, []);

  console.log("payments data from api ",payments)

  useEffect(() => {
    if (paymentId) {
      setShowForm(true);
      setPaymentId(paymentId);
    }
  }, [paymentId]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleShowForm = () => {
    setShowForm(!showForm);
    // alert("add new payment clicked")
  };
 const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDelete = async (id) => {
    // alert("payemtn id", id)
  console.log("pay going to delte",id)
  setLoading(true);

  try {
    await axios.delete(`${base_url}/payments/${id}`);
    setLoading(false);
    setPayments(payments.filter((payment) => payment._id !== id));
    toast.warn("Payment Deleted Successfully",{draggable:true});
  } catch (error) {
    setLoading(false);
    toast.error("Failed To Delete Payment");
    console.error("Error deleting payment:", error);
  }
};


  return (
    <Layout>
      
       <PaymentCardPage /> 

      <div className="container mx-auto my-6">
        <div className="flex flex-row gap-4 my-3"></div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label
            htmlFor="Table"
            className="block pt-4 mb-2 text-xl font-medium text-gray-900 ps-2"
          >
            Payments
          </label>
          <div>
            <Button
              variant="text"
              sx={{
                margin: ".7em",
                bgcolor: "teal",
                color: "white",
                "&:hover": {
                  bgcolor: "teal",
                  color: "white",
                  boxShadow: "1px 2px 3px gray",
                },
              }}
              onClick={handleShowForm}
            >
              Add Payments
            </Button>

            {showForm && (
              <Button
                variant="text"
                sx={{
                  margin: ".7em",
                  bgcolor: "red",
                  color: "white",
                  "&:hover": {
                    bgcolor: "white",
                    boxShadow: "1px 2px 3px gray",
                    color: "red",
                  },
                }}
                onClick={() => {
                  setPaymentId("");
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>


        {showForm || paymentId ? (
          <div className="justify-center">
            <PaymentForm
              {...{
                setPaymentId,
                paymentId,
                formData,
                setFormData,
                showForm,
           
                fetchPayments,

                setShowForm,
                view,
                setCompanyRefresh,
                companyRefresh,
              }}
            />
          </div>
        ) : (
          ""
        )}

        <div className="bg-white rounded-lg shadow-md">
          <PaymentTable
            {...{
              fetchPayments,
              totalPayments,
              setPaymentId,
              companyRefresh,
               handleDelete,
              payments,
              tasks,
              setPage,
              page,
              pageSize,
              setPageSize,
              formData,
            }}
            dataLoading={loading}
          />
        </div>
      </div>

      {/* Auto-Generation Modal */}
    
    </Layout>
  );
};

export default PaymentPage;
