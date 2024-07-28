import React from "react";

const CustomFileInput = ({ id, label, required, onChange, link }) => {
  console.log(typeof(link))
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        id={id}
        required={required}
        onChange={onChange}
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
