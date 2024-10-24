import React, { useEffect, useState } from "react";
import { Grid, Box, Button, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // Import edit icon
import Layout from "../../components/Layout/Layout";
import { checkboxJson, getFormFields } from "./Notificationsdata";
import axios from "axios";
import { base_url } from "../../const";
import AttachmentInput from "../../components/AttachmentInput/AttachmentInput";
import CustomInput from "../../components/input";
import MultiSelectInput from "../../components/multi-select";
import TextArea from "../../components/text-area";

const NotificationSettings = () => {
  const [notificationId, setNotificationId] = useState("");
  const [activeForm, setActiveForm] = useState("oneDayBeforeDueDate"); // Track the currently active form
  const [checkboxData, setCheckboxData] = useState({
    oneDayBeforeDueDate: {
      status: false,
      name: "One Day Before DueDate",
      roleData: { toAddress: [], ccAddress: [], subject: "", message: "", attachment: "" },
    },
    oneDayAfterDueDate: {
      status: false,
      name: "One Day After DueDate",
      roleData: { toAddress: [], ccAddress: [], subject: "", message: "", attachment: "" },
    },
    assignNewTask: {
      status: false,
      name: "Assign New Task",
      roleData: { toAddress: [], ccAddress: [], subject: "", message: "", attachment: "" },
    },
  });

  const agency = JSON.parse(localStorage.getItem("user"))?.agency;

  useEffect(() => {
    if (agency) fetchNotificationSettings(agency);
    else console.error("Agency ID not found in localStorage.");
  }, [agency]);

  const fetchNotificationSettings = async (agencyId) => {
    try {
      const { data } = await axios.get(`${base_url}/notifications/${agencyId}`);
      console.log("API Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        const firstNotification = data[0];
        setNotificationId(firstNotification._id || "");

        setCheckboxData((prev) => ({
          ...prev,
          oneDayBeforeDueDate: {
            ...prev.oneDayBeforeDueDate,
            status: firstNotification.oneDayBeforeDueDate?.status || false,
            roleData: { ...firstNotification?.oneDayBeforeDueDate?.roleData },
          },
          oneDayAfterDueDate: {
            ...prev.oneDayAfterDueDate,
            status: firstNotification.oneDayAfterDueDate?.status || false,
            roleData: { ...firstNotification?.oneDayAfterDueDate?.roleData },
          },
          assignNewTask: {
            ...prev.assignNewTask,
            status: firstNotification.assignNewTask?.status || false,
            roleData: { ...firstNotification?.assignNewTask?.roleData },
          },
        }));
      } else {
        console.warn("No notification data found for agency:", agencyId);
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error.message);
    }
  };

  const handleCheckboxChange = (id) => (event) => {
    const { checked } = event.target;
    setCheckboxData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: checked, // Update status properly
      },
    }));
  };
  const handleRoleDataChange = (id, field) => (event) => {
    const value = event.target?.value ?? event; // Handle both input event and direct values

    setCheckboxData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        roleData: {
          ...prev[id].roleData,
          [field]: value, // Update the specific field inside roleData
        },
      },
    }));
  };
  const handleUpload = (id) => (event) => {
    const file = event.target.files[0]; // Safely extract the first file

    if (file) {
      setCheckboxData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          roleData: {
            ...prev[id].roleData,
            attachment: file, // Update attachment field
          },
        },
      }));
    }
  };


  const handleSave = async () => {
    try {
      if (!agency) {
        console.error("Missing agency ID.");
        return;
      }

      const payload = { agency, ...checkboxData };

      if (notificationId) {
        await axios.put(`${base_url}/notifications/${notificationId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Notification settings updated successfully.");
      } else {
        await axios.post(`${base_url}/notifications`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Notification settings created successfully.");
      }
    } catch (error) {
      console.error("Error saving notification settings:", error.message);
    }
  };

  const toggleEditForm = (key) => {
    setActiveForm((prev) => (prev === key ? null : key)); // Toggle form visibility
  };

  return (
    <Layout>
      <Box sx={{ backgroundColor: "background.paper", borderRadius: 2 }}>
        <Typography variant="h6">Notification Settings</Typography>
        <Grid container spacing={3}>
          <Grid item md={4} mt={2}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} mx={4}>
              {Object.keys(checkboxData).map((key) => {
                return (
                  <Box key={key} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <input
                      type="checkbox"
                      id={key}
                      checked={checkboxData[key].status}
                      onChange={handleCheckboxChange(key)}
                      style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <label htmlFor={key} style={{ marginLeft: "5px" }}>
                      {checkboxJson.find((section) => section.id === key)?.label}
                    </label>
                    <IconButton onClick={() => toggleEditForm(key)} size="small" sx={{ marginLeft: "10px" }}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                )
              })}
              <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: "2rem" }}>
                <Button variant="contained" sx={{ bgcolor: "#008080" }} onClick={handleSave}>
                  Save Settings
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8} padding={4}>
            {activeForm && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Display the name at the top right */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {checkboxData[activeForm].name}
                  </Typography>
                  <Button variant="outlined" onClick={() => setActiveForm(null)}>
                    Close
                  </Button>
                </Box>

                {/* Render form fields dynamically */}
                {console.log(checkboxData)}
                {getFormFields().map(({ id, label, type, ...rest }) => (
                  <Box key={`${activeForm}-${id}`} sx={{ mb: 2 }}>
                    {type === "select" && (
                      <MultiSelectInput
                        label={label}
                        name={id}
                        options={rest.options}
                        value={checkboxData[activeForm].roleData[id]}
                        onChange={handleRoleDataChange(activeForm, id)}
                        {...rest}
                      />
                    )}
                    {type === "text" && (
                      <CustomInput
                        label={label}
                        name={id}
                        value={checkboxData[activeForm].roleData[id] || ""}
                        onChange={handleRoleDataChange(activeForm, id)}
                        fullWidth
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 5 } }}
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
                          value={checkboxData[activeForm].roleData.message}
                          onChange={handleRoleDataChange(activeForm, "message")}
                          placeholder={rest.placeholder}
                          style={{
                            height: '170px'
                          }}
                        />

                      </Box>
                    )}
                    {type === "attachment" && (
                      <AttachmentInput
                        attachment={checkboxData[activeForm].roleData.attachment}
                        onUpload={handleUpload(activeForm)}
                        {...rest}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

        </Grid>
      </Box>
    </Layout>
  );
};

export default NotificationSettings;
