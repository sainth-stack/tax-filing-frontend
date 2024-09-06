import React from "react";

const CustomFileInput = ({ id, label, required, onChange, link,readOnly }) => {
  console.log(label,readOnly)
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label} 
      </label>
      <input
        type="file"
        id={id}
        required={required}
        onChange={onChange}
        readOnly={readOnly}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:shadow-md"
      />
      {(link && typeof(link) ==="string") && (
        <div className="mt-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View file
          </a>
        </div>
      )}
    </div>
  );
};

export default CustomFileInput;
