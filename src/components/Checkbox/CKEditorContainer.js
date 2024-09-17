// components/CKEditorContainer.js
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CKEditorContainer = ({ onChange, message }) => (
  <CKEditor
    editor={ClassicEditor}
    data={message}
    onChange={(event, editor) => {
      const data = editor.getData();
      onChange({ target: { name: "message", value: data } });
    }}
  />
);

export default CKEditorContainer;
