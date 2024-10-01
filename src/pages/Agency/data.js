export const sectionsData = (data) => {
    return [
        {
            title: "Agency Details",
            fields: [
                {
                    type: "text",
                    id: "AgencyDetails.agencyName", // Changed to camelCase
                    label: "Agency Name",
                    required: true,
                    placeholder: "Enter Agency Name",
                },
                {
                    type: "text",
                    id: "AgencyDetails.agencyLocation", // Changed to camelCase
                    label: "Agency Location",
                    required: true,
                    placeholder: "Enter Agency Location",
                },
                {
                    type: "date",
                    id: "AgencyDetails.effectiveFrom", // Changed to camelCase
                    label: " Start Date",
                    required: true,
                },
                {
                    type: "date",
                    id: "AgencyDetails.effectiveTo", // Changed to camelCase
                    label: " End Date",
                    required: true,
                },
            ]
        }
    ];
}
