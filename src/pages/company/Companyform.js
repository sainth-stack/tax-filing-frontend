import React, { useState } from 'react';
import CustomInput from '../../components/input';
import SelectInput from '../../components/select';
import { sections } from './data';

const CompanyForm = () => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <header className="text-black p-4 rounded-t-lg" style={{background:"#f5f5f5"}}>
        <h1 className="text-2xl font-bold">Create New Company</h1>
      </header>
      <form onSubmit={handleSubmit} className="p-6">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-8 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {section.fields.map((field, index) => {
                if (field.type === 'select') {
                  return (
                    <SelectInput
                      key={index}
                      id={field.id}
                      label={field.label}
                      options={field.options}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      required={field.required}
                    />
                  );
                }
                return (
                  <CustomInput
                    key={index}
                    type={field.type}
                    id={field.id}
                    label={field.label}
                    required={field.required}
                    onChange={handleInputChange}
                    value={formData[field.id]}
                    placeholder={field.placeholder || ''}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
