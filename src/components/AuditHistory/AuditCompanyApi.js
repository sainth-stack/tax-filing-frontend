// services/auditService.js
import axios from "axios";
/* import { base_url } from "./../../const"; */
const FetchCompanyAuditTrail = async () => {
  try {
    const response = await axios.get(`http://localhost:4500/api/audit-history`);

    console.log("response auit", response);
    return await response.data.logs;
  } catch (error) {
    console.error("Error fetching audit trail:", error);
    throw error;
  }
};
export default FetchCompanyAuditTrail;
