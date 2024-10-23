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

  const agency = JSON.parse(localStorage.getItem("user"))?._id;

  //alert(agency);

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

    fetchUsers();

    // Fetch notification settings by ID
    const fetchNotificationSettings = async () => {
      try {
        const response = await axios.get(`${base_url}/notifications/${agency}`);
        const notificationData = response.data;

        // Log the response for debugging
        console.log("API Response:", notificationData);

        // Check if notificationData exists and is not an empty array
        if (Array.isArray(notificationData) && notificationData.length > 0) {
          const firstNotification = notificationData[0]; // Assuming you want the first object in the array

          // Update the form data based on the response
          setRoleData({
            toAddress: firstNotification.toAddress || [],
            ccAddress: firstNotification.ccAddress || [],
            subject: firstNotification.subject || "",
            message: firstNotification.message || "",
            attachment: firstNotification.attachment || "",
          });
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

    fetchNotificationSettings();
  }, [agency]);

  // Handle form field change for select and text inputs
  const handleChange = (name) => (event) => {
    const value = event.target?.value || event; // For text or CKEditor fields
    setRoleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle CKEditor change
  const handleCKEditorChange = (event) => {
    // Use the event to get the value from the TextArea
    const { value } = event.target; // Extracting the value from the event
    setRoleData((prevData) => ({
      ...prevData,
      message: value, // Update message state with the new value
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxData((prevData) => ({
      ...prevData,
      [id]: checked,
    }));
  };

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoleData({
        ...roleData,
        attachment: file,
      });
    }
  };

  const reUpload = () => {
    setRoleData({
      ...roleData,
      attachment: "",
    });
  };

  // Save notification settings
  const handleSave = async () => {
    try {
      const payload = {
        ...roleData,
        to: roleData.toAddress, // Already an array
        cc: roleData.ccAddress, // Already an array
        agency: agency,
        oneDayBeforeDueDate: checkboxData.oneDayBeforeDueDate,
        oneDayAfterDueDate: checkboxData.oneDayAfterDueDate,
        assignNewTask: checkboxData.assignNewTask,
      };

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
      } else {
        await axios.post(`${base_url}/notifications`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Notification settings created successfully");
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
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
                    onClick={() => console.log(`Edit ${section.label}`)}
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
                        value={roleData[id]}
                        onChange={handleChange(id)}
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
