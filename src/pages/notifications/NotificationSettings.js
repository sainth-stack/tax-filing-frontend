import React, { useEffect, useState } from "react";
import { Grid, Box, Button, Typography } from "@mui/material";
import Layout from "../../components/Layout/Layout";
import { checkboxJson, getFormFields } from "./Notificationsdata";
import axios from "axios";
import { base_url } from "../../const";
import SelectInput from "./../../components/select/index";
import CKEditorContainer from "../../components/Checkbox/CKEditorContainer";
import AttachmentInput from "./../../components/AttachmentInput/AttachmentInput";
import CustomInput from "../../components/input";
import MultiSelectInput from "../../components/multi-select";
import TextArea from "../../components/text-area";

const NotificationSettings = () => {
  const [toOptions, setToOptions] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);
  const [notificationId, setNotificationId] = useState("");
  const [roleData, setRoleData] = useState({
    toAddress: [],
    ccAddress: [],
    subject: "",
    message: "",
    attachment: "",
  });
  const [checkboxData, setCheckboxData] = useState({
    oneDayBeforeDueDate: false,
    oneDayAfterDueDate: false,
    assignNewTask: false,
  });

  // Safely get agency from localStorage
  const agency = JSON.parse(localStorage.getItem("user"))?._id;

  // If agency is not found, alert or handle it
  if (!agency) {
    console.error("Agency ID not found in localStorage.");
    // You could also show a UI warning here or redirect the user to login
  }

  // Fetch user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(`${base_url}/users/filter`, {
          agency,
        });
        const users = response?.data?.map((user) => ({
          id: `${user.firstName} ${user.lastName}`,
          label: `${user.firstName} ${user.lastName}` || user.email,
        }));
        setToOptions(users);
        setCcOptions(users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Only fetch if agency is valid
  }, [agency]);

  // Fetch notification settings by agency ID
  const fetchNotificationSettings = async (agency) => {
    try {
      const response = await axios.get(`${base_url}/notifications/${agency}`);
      const notificationData = response.data;

      // Log the response for debugging
      console.log("API Response:", notificationData);

      // If notification data exists, populate the form with it
      if (Array.isArray(notificationData) && notificationData.length > 0) {
        const firstNotification = notificationData[0]; // Assume the first notification object

        console.log("first not ", firstNotification.subject);
        // Update the form fields with the fetched data
        setRoleData({
          toAddress: firstNotification.toAddress || [],
          ccAddress: firstNotification.ccAddress || [],
          subject: firstNotification.subject || "",
          message: firstNotification.message || "",
          attachment: firstNotification.attachment || "",
        });

        // Set notification ID for updating
        setNotificationId(firstNotification._id || null);

        // Update checkbox states
        setCheckboxData({
          oneDayBeforeDueDate: firstNotification.oneDayBeforeDueDate || false,
          oneDayAfterDueDate: firstNotification.oneDayAfterDueDate || false,
          assignNewTask: firstNotification.assignNewTask || false,
        });
      } else {
        console.warn("No notification data found for the agency:", agency);
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error.message);
    }
  };

  const handleChange = (id) => (event) => {
    const value = event.target?.value; // Directly use the event value

    // Set roleData, ensuring value is always a string
    setRoleData((prevData) => ({
      ...prevData,
      [id]: value || "", // Set to empty string if value is undefined or null
    }));
  };

  // Handle CKEditor change (or other text editor)
  const handleCKEditorChange = (event) => {
    const { value } = event.target; // Extract the value
    setRoleData((prevData) => ({
      ...prevData,
      message: value, // Update message state
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxData((prevData) => ({
      ...prevData,
      [id]: checked, // Dynamically update based on checkbox id
    }));
  };

  // Handle file upload for attachments
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoleData((prevData) => ({
        ...prevData,
        attachment: file, // Set the uploaded file
      }));
    }
  };

  // Clear attachment
  const reUpload = () => {
    setRoleData((prevData) => ({
      ...prevData,
      attachment: "", // Clear attachment
    }));
  };

  // Save notification settings (create or update)
  const handleSave = async () => {
    try {
      // Check if required fields are missing
      if (!roleData || !agency) {
        console.error("Missing required fields: roleData or agency");
        return; // Stop execution if important data is missing
      }

      const payload = {
        ...roleData,
        to: roleData.toAddress, // Already an array
        cc: roleData.ccAddress, // Already an array
        agency: agency,
        oneDayBeforeDueDate: checkboxData.oneDayBeforeDueDate,
        oneDayAfterDueDate: checkboxData.oneDayAfterDueDate,
        assignNewTask: checkboxData.assignNewTask,
      };

      // If notificationId exists, update; otherwise, create a new notification
      if (notificationId) {
        await axios.put(
          `${base_url}/notifications/${notificationId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Notification settings updated successfully");
        // You can also trigger a success toast or visual indicator here
      } else {
        await axios.post(`${base_url}/notifications`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Notification settings created successfully");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          "Error saving notification settings:",
          error.response.data
        );
      } else {
        console.error("Error saving notification settings:", error.message);
      }
    }
  };

  return (
    <Layout>
      <Box sx={{ backgroundColor: "background.paper", borderRadius: 2 }}>
        <Typography variant="h6">Notification Settings</Typography>
        <Grid container spacing={3}>
          <Grid item md={4}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              mx={4}
            >
              {checkboxJson.map((section) => (
                <Box key={section.id} sx={{ mb: 2 }}>
                  <input
                    type="checkbox"
                    id={section.id}
                    checked={checkboxData[section.id]}
                    onChange={handleCheckboxChange}
                    className="m-2"
                    style={{ marginRight: "10px", padding: "5px" }}
                  />
                  <label htmlFor={section.id} style={{ marginLeft: "5px" }}>
                    {section.label}
                  </label>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ marginLeft: 1, minWidth: "30px", padding: "0 6px" }} // Adjust size and margin
                    onClick={() => fetchNotificationSettings(agency)} // Pass the ID to the function
                    //onClick={alert(agency)} // Pass the ID to the function
                  >
                    Edit
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>
          {/* Form Section */}
          <Grid item xs={12} md={8} padding={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {getFormFields().map((field) => {
                const { id, label, type, ...rest } = field;

                return (
                  <Box key={id}>
                    {type === "select" && (
                      <MultiSelectInput
                        label={label}
                        placeholder={field.placeholder}
                        name={id}
                        options={field.options}
                        value={roleData[id]}
                        onChange={handleChange(id)}
                        {...rest}
                      />
                    )}

                    {type === "text" && (
                      <CustomInput
                        label={label}
                        name={id}
                        value={roleData[id] || ""} // Ensure this is a string
                        onChange={handleChange(id)} // Pass the handler that updates the state
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          style: { borderRadius: 5 },
                        }}
                        {...rest}
                      />
                    )}

                    {type === "textarea" && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {label}
                        </Typography>
                        <TextArea
                          id={id}
                          value={roleData.message} // Set the value from state
                          onChange={handleCKEditorChange} // Pass the updated function
                          placeholder={field.placeholder} // Placeholder from the field
                          className="" // Add any class names if necessary
                          style={{}} // Add any styles if necessary
                          labelStyles={{}} // Add any label styles if necessary
                          disabled={false} // Set disabled prop if needed
                        />
                      </Box>
                    )}

                    {type === "attachment" && (
                      <AttachmentInput
                        attachment={roleData.attachment}
                        onUpload={handleUpload}
                        onReUpload={reUpload}
                        {...rest}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "2rem",
              }}
            >
              <Button
                variant="contained"
                sx={{ bgcolor: "#008080" }}
                onClick={handleSave}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default NotificationSettings;
