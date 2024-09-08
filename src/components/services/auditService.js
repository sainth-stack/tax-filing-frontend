// services/auditService.js
import { base_url } from "./../../const";
export const fetchAuditTrail = async (featureName) => {
  try {
    const response = await fetch(`${base_url}/{featureName}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching audit trail:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};
