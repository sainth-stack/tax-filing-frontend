import axios from "axios";
import { useState } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

const ExistingCustomer = ({
  setCustomer,
  formData,
  setFormData,
  setShowModel,
}) => {
  const [formData2, setFormData2] = useState({ pan: "" });
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCompanyData = async (pan) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4500/api/companies/pan/${pan}`
      );
      setCompanyData(response.data.companyDetails);
      setFormData({
        ...formData,
        company: response?.data?.companyDetails?.companyName,
      });
      setShowModel(false);
    } catch (error) {
      console.error(
        "Error fetching company data:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to fetch company data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-96 max-w-full overflow-auto">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Company Information
          </h2>
          <IconButton
            onClick={() => setCustomer(null)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <CloseOutlined style={{ fontSize: "1.25rem" }} />
          </IconButton>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-4">
            <CircularProgress size={30} />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <>
              <label className="w-full flex flex-col mb-0">
                <span className="text-sm font-medium text-gray-700 mb-1">
                  PAN:
                </span>
                <input
                  type="text"
                  placeholder="Enter PAN Number"
                  value={formData2.pan}
                  onChange={(e) =>
                    setFormData2({
                      ...formData2,
                      pan: e.target.value,
                    })
                  }
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              {formData2.pan && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition duration-150"
                  type="button"
                  onClick={() => fetchCompanyData(formData2.pan)}
                >
                  Fetch Company Data
                </button>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExistingCustomer;
