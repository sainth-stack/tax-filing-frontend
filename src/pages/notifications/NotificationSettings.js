import React, { useEffect, useState } from "react";
import { Grid, Box, Button, Typography } from "@mui/material";
import Layout from "../../components/Layout/Layout";
import { checkboxJson, getFormFields } from "./Notificationsdata";
import axios from "axios";
import { base_url } from "../../const";
import CustomInput from "../../components/input";
import TextArea from "../../components/text-area";
import MultiSelectInput from "../../components/multi-select";

const NotificationSettings = () => {
  const [toOptions, setToOptions] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);
  const [notificationId, setNotificationId] = useState('');
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

  const agency = JSON.parse(localStorage.getItem("user"))?.agency;
  const formFields = getFormFields(toOptions, ccOptions);

  // Fetch user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(`${base_url}/users/filter`, { agency });
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

        // Update the form data based on the response
        setRoleData({
          toAddress: notificationData.toAddress || [],
          ccAddress: notificationData.ccAddress || [],
          subject: notificationData.subject,
          message: notificationData.message,
          attachment: notificationData.attachment || "",
        });
        setNotificationId(notificationData?._id);

        // Update checkbox states
        setCheckboxData({
          oneDayBeforeDueDate: notificationData.oneDayBeforeDueDate || false,
          oneDayAfterDueDate: notificationData.oneDayAfterDueDate || false,
          assignNewTask: notificationData.assignNewTask || false,
        });
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };

    fetchNotificationSettings();
  }, [agency]);

  // Handle form field change
  const handleChange = (name) => (selectedOptions) => {
    const values = typeof (selectedOptions) !== 'string' ? selectedOptions?.map(option => option.id) : selectedOptions; // Use .id instead of .value
    setRoleData((prevData) => ({
      ...prevData,
      [name]: values,
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
        await axios.put(`${base_url}/notifications/${notificationId}`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} mx={4}>
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
                </Box>
              ))}

              <Button
                variant="contained"
                sx={{ bgcolor: "#008080", marginLeft: "0rem", width: 'fit-content' }}
                onClick={handleSave}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} md={8} padding={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {formFields.map((field) => {
                const { id, label, type, options, ...rest } = field;
                return (
                  <Box key={id}>
                    {type === "select" && (
                      <MultiSelectInput
                        label={label}
                        options={options}
                        value={options.filter(option => roleData[id].includes(option.id))} // Use .id instead of .value
                        onChange={handleChange(id)} // Pass id to handleChange
                        {...rest}
                      />
                    )}

                    {type === "text" && (
                      <CustomInput
                        label={label}
                        name={id}
                        value={roleData[id]}
                        onChange={(e) => handleChange(id)(e.target.value)} // Update to directly use the input value
                        fullWidth
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 5 } }}
                        {...rest}
                      />
                    )}

                    {type === "ckeditor" && (
                      <Box>
                        <TextArea
                          id={id}
                          label={label}
                          value={roleData[id] || ""}
                          onChange={(e) => handleChange(id)(e.target.value)} // Update to directly use the input value
                          style={{ height: "200px" }}
                          name={id}
                        />
                      </Box>
                    )}

                    {/* Uncomment this if you want to handle attachment input */}
                    {/* {type === "attachment" && (
                      <AttachmentInput
                        attachment={roleData.attachment}
                        onUpload={handleUpload}
                        onReUpload={reUpload}
                        {...rest}
                      />
                    )} */}
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default NotificationSettings;
