export const sections = [
    {
      title: 'Company Details',
      fields: [
        { type: 'text', id: 'constitution', label: 'Constitution', required: true },
        {
          type: 'select',
          id: 'client-status',
          label: 'Client Status',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ],
          required: true
        },
        { type: 'text', id: 'authorised-person', label: 'Authorised Person', required: true },
        { type: 'text', id: 'phone', label: 'Phone', required: true },
        { type: 'text', id: 'mail-id', label: 'Mail ID', required: true },
      ],
    },
    {
      title: 'Employer State Insurance',
      fields: [
        { type: 'text', id: 'esi-number', label: 'ESI Number', required: true },
        { type: 'text', id: 'esi-user-id', label: 'ESI User ID', required: true },
        { type: 'password', id: 'esi-password', label: 'ESI Password', required: true },
      ],
    },
    {
      title: 'TDS',
      fields: [
        { type: 'text', id: 'tan', label: 'TAN', required: true },
        { type: 'password', id: 'tan-password', label: 'TAN Password', required: true },
        { type: 'text', id: 'traces-username', label: 'Traces Username', required: true },
        { type: 'password', id: 'traces-password', label: 'Traces Password', required: true },
      ],
    },
    {
      title: 'MSME/Udyam',
      fields: [
        { type: 'text', id: 'msme-udyam', label: 'MSME/Udyam', required: true },
        { type: 'text', id: 'msme-number', label: 'MSME Number', required: true },
      ],
    },
    {
      title: 'Import Export Code',
      fields: [
        { type: 'text', id: 'iec-number', label: 'IEC Number', required: true },
        { type: 'text', id: 'dgft-username', label: 'DGFT Username', required: true },
        { type: 'password', id: 'dgft-password', label: 'DGFT Password', required: true },
        { type: 'text', id: 'icegate-username', label: 'ICEGATE Username', required: true },
        { type: 'password', id: 'icegate-password', label: 'ICEGATE Password', required: true },
      ],
    },
    {
      title: 'MCA',
      fields: [
        { type: 'text', id: 'cin-llp', label: 'CIN/LLP', required: true },
        { type: 'text', id: 'mca-username', label: 'MCA Username', required: true },
        { type: 'password', id: 'mca-password', label: 'MCA Password', required: true },
        { type: 'text', id: 'bank-overdraft', label: 'Bank Overdraft/ Cash Credit' },
        { type: 'date', id: 'renewal-date', label: 'Renewal Date' },
        { type: 'file', id: 'iec-file', label: 'IEC Document', required: true },
        { type: 'file', id: 'form-c-file', label: 'Form C Document', required: true },
      ],
    },
    {
      title: 'Income Tax',
      fields: [
        { type: 'text', id: 'income-tax', label: 'Income Tax', required: true },
        { type: 'text', id: 'pan', label: 'PAN', required: true },
        { type: 'password', id: 'income-tax-password', label: 'Income Tax Password', required: true },
      ],
    },
    {
      title: 'Provident Fund',
      fields: [
        { type: 'text', id: 'pf-number', label: 'PF Number', required: true },
        { type: 'text', id: 'pf-user-id', label: 'PF User ID', required: true },
        { type: 'password', id: 'pf-password', label: 'PF Password', required: true },
      ],
    },
    {
      title: 'ESI Number',
      fields: [
        { type: 'text', id: 'esi-number', label: 'ESI Number', required: true },
        { type: 'text', id: 'esi-user-id', label: 'ESI User ID', required: true },
        { type: 'password', id: 'esi-password', label: 'ESI Password', required: true },
      ],
    },
    {
      title: 'PT EC Number',
      fields: [
        { type: 'text', id: 'pt-ec-number', label: 'PT EC Number', required: true },
        { type: 'text', id: 'ec-user-name', label: 'EC User Name', required: true },
        { type: 'password', id: 'ec-password', label: 'EC Password', required: true },
        { type: 'text', id: 'pt-number', label: 'PT Number', required: true },
        { type: 'text', id: 'pt-username', label: 'PT Username', required: true },
        { type: 'password', id: 'pt-password', label: 'PT Password', required: true },
      ],
    },
    {
      title: 'FSSAI',
      fields: [
        { type: 'text', id: 'fssai-number', label: 'FSSAI Number', required: true },
        { type: 'text', id: 'fssai-username', label: 'FSSAI Username', required: true },
        { type: 'password', id: 'fssai-password', label: 'FSSAI Password', required: true },
        { type: 'date', id: 'fssai-renewal-date', label: 'FSSAI Renewal Date', required: true },
      ],
    },
    {
      title: 'Partnership Firm Form C',
      fields: [
        { type: 'text', id: 'form-c-number', label: 'Form C Number', required: true },
      ],
    },
    {
      title: 'Attachments',
      fields: [
        { type: 'file', id: 'pan-file', label: 'PAN Document', required: true },
        { type: 'file', id: 'gst-file', label: 'GST Document', required: true },
        { type: 'file', id: 'esi-file', label: 'ESI Document', required: true },
        { type: 'file', id: 'pf-file', label: 'PF Document', required: true },
        { type: 'file', id: 'pt-file', label: 'Professional Tax Document', required: true },
        { type: 'file', id: 'lin-file', label: 'Shram Suvidha Portal Document', required: true },
      ],
    },
  ];