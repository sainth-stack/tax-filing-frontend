import React, { useState } from "react";
import { Grid, Box, TextField, Button, Input, Typography } from "@mui/material";
import SelectInput from "../../components/select";
import CKEditorContainer from "../../components/Checkbox/CKEditorContainer";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Layout from "../../components/Layout/Layout";
import { checkboxJson } from "./Notificationsdata";

const NotificationSettings = () => {
  const [roleData, setRoleData] = useState({
    toAddress: "",
    ccAddress: "",
    subject: "",
    message: "",
    attachment: "",
  });

  const handleChangeSearch = ({ target: { name, value } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
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
            <Grid item md={6}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                mx={6}
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
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <SelectInput
                  label="To*"
                  placeholder="--Select--"
                  name="toAddress"
                  options={[]} // Add appropriate options here
                  value={roleData.toAddress}
                  onChangeText={handleChangeSearch}
                />
                <SelectInput
                  label="CC"
                  placeholder="--Select--"
                  name="ccAddress"
                  options={[]} // Add appropriate options here
                  value={roleData.ccAddress}
                  onChangeText={handleChangeSearch}
                />
                <TextField
                  label="Subject*"
                  name="subject"
                  value={roleData.subject}
                  onChange={handleChangeSearch}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: { borderRadius: 5 },
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Message*
                  </Typography>
                  {roleData.toAddress ? (
                    <CKEditorContainer
                      onChange={handleChangeSearch}
                      message={roleData.message}
                    />
                  ) : (
                    <TextField
                      name="message"
                      value={roleData.message}
                      onChange={handleChangeSearch}
                      multiline
                      rows={5}
                      fullWidth
                      variant="outlined"
                      disabled
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Attachment
                  </Typography>
                  {roleData.attachment ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <a
                        href={roleData.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="contained"
                          startIcon={<UploadFileIcon />}
                        >
                          View
                        </Button>
                      </a>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<RemoveCircleIcon />}
                        onClick={reUpload}
                      >
                        Re-Upload
                      </Button>
                    </Box>
                  ) : (
                    <label htmlFor="upload-file">
                      <Input
                        id="upload-file"
                        type="file"
                        name="attachment"
                        onChange={handleUpload}
                        sx={{ display: "none" }}
                      />
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadFileIcon />}
                        fullWidth
                      >
                        Upload File
                      </Button>
                    </label>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export default NotificationSettings;
