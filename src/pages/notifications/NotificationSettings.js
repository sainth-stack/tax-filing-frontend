import React, { useEffect, useState } from "react";
import { Grid, Box, TextField, Button, Input, Typography } from "@mui/material";
import SelectInput from "../../components/select";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Layout from "../../components/Layout/Layout";
import { checkboxJson, formFields, getFormFields } from "./Notificationsdata";
import AttachmentInput from "../../components/AttachmentInput/AttachmentInput";
import axios from "axios";
import CKEditorContainer from "./../../components/Checkbox/CKEditorContainer";

const NotificationSettings = () => {
  const [toOptions, setToOptions] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);

  const formFields = getFormFields(toOptions, ccOptions);
  const [roleData, setRoleData] = useState({
    toAddress: "",
    ccAddress: "",
    subject: "",
    message: "",
    attachment: "",
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4500/api/users/all");

        console.log("checking users", response.data.data);
        const users = response.data.data.map((user) => ({
          id: user._id, // Using '_id' as the identifier for each user
          label: user.firstName || user.email, // Display user's first name, fallback to email if firstName is missing
        }));

        setToOptions(users); // Set options for 'toAddress'
        setCcOptions(users); // Set options for 'ccAddress'
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRoleData({ ...roleData, [name]: value });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoleData({
        ...roleData,
        attachment: URL.createObjectURL(file),
      });
    }
  };

  const reUpload = () => {
    setRoleData({
      ...roleData,
      attachment: "",
    });
  };

  return (
    <>
      <Layout>
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Notification Settings</Typography>
          <Grid container spacing={3}>
            {/* Checkboxes Section */}
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
                      className="m-2"
                      style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <label htmlFor={section.id} style={{ marginLeft: "5px" }}>
                      {section.label}
                    </label>
                    {/* Child Checkboxes */}
                    {section.items &&
                      section.items.map((item) => (
                        <Box key={item.id} sx={{ ml: 4, mt: 1 }}>
                          <input
                            type="checkbox"
                            id={item.id}
                            style={{ marginRight: "10px", padding: "5px" }}
                          />
                          <label
                            htmlFor={item.id}
                            style={{ marginLeft: "5px" }}
                          >
                            {item.label}
                          </label>
                        </Box>
                      ))}
                  </Box>
                ))}

                {/* Save Button */}
              </Box>
              <Button
                variant="contained"
                sx={{ bgcolor: "#008080", marginLeft: "3rem" }}
                onClick={() => console.log("Save Settings")}
              >
                Save Settings
              </Button>
            </Grid>

            {/* Form Section */}
            <Grid item xs={12} md={8} padding={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {formFields.map((field) => {
                  const { id, label, type, ...rest } = field;

                  // Render fields based on their type
                  return (
                    <Box key={id}>
                      {type === "select" && (
                        <SelectInput
                          label={label}
                          placeholder={field.placeholder}
                          name={id}
                          options={field.options} // Pass options for dropdown
                          value={roleData[id]}
                          onChangeText={handleChange}
                          {...rest} // Spread additional props if any
                        />
                      )}

                      {type === "text" && (
                        <TextField
                          label={label}
                          name={id}
                          value={roleData[id]}
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            style: { borderRadius: 5 },
                          }}
                          {...rest}
                        />
                      )}

                      {type === "ckeditor" && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {label}
                          </Typography>
                          <CKEditorContainer
                            onChange={handleChange} // Pass the handleChange function
                            message={roleData.message} // Pass the current message value
                          />
                        </Box>
                      )}

                      {type === "attachment" && (
                        <AttachmentInput
                          attachment={roleData.attachment}
                          onUpload={handleUpload}
                          onReUpload={reUpload}
                          {...rest} // Spread additional props for attachments if needed
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export default NotificationSettings;
