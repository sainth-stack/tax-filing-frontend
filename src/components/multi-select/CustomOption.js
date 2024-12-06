import React from 'react';
import { components } from 'react-select';

const CustomOption = ({ children, ...props }) => {
  const { isSelected } = props;

  return (
    <components.Option {...props}>
      <div className="flex items-center w-full">
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
        />
        <span>{children}</span>
      </div>
    </components.Option>
  );
};

export default CustomOption;
