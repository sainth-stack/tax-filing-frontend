// components/CKEditorContainer.js
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Box } from "@mui/material";

const CKEditorContainer = ({ onChange, message }) => (
  <Box >
    <CKEditor
      editor={ClassicEditor}
      data={message}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange({ target: { name: "message", value: data } }); // Call onChange with the new message
      }}
    />
  </Box>
);

export default CKEditorContainer;
