import React from "react";

const CompanyForm = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Left Side */}
        <div className="space-y-4">
          {/* company */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Company Details</h2>

            <label className="font-medium" htmlFor="company">
              Company *
            </label>
            <input
              type="text"
              id="company"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="constitution">
              Constitution *
            </label>
            <input
              type="text"
              id="constitution"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="client-status">
              Client Status *
            </label>
            <input
              type="text"
              id="client-status"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="authorised-person">
              Authorised Person *
            </label>
            <input
              type="text"
              id="authorised-person"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="phone">
              Phone *
            </label>
            <input
              type="text"
              id="phone"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="mail-id">
              Mail ID *
            </label>
            <input
              type="text"
              id="mail-id"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>

          {/* ESI */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">
              Employer State Insurance
            </h2>

            <label className="font-medium" htmlFor="esi-number">
              ESI Number *
            </label>
            <input
              type="text"
              id="esi-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="esi-user-id">
              ESI User ID *
            </label>
            <input
              type="text"
              id="esi-user-id"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="esi-password">
              ESI Password *
            </label>
            <input
              type="password"
              id="esi-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>

          {/* TDS
           */}
          <div className="flex flex-col">
            {/* TDS */}
            <h2 className="text-lg font-semibold mb-2">TDS</h2>

            <label className="font-medium" htmlFor="tan">
              TAN *
            </label>
            <input
              type="text"
              id="tan"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="tan-password">
              TAN Password *
            </label>
            <input
              type="password"
              id="tan-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="traces-username">
              Traces Username *
            </label>
            <input
              type="text"
              id="traces-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="traces-password">
              Traces Password *
            </label>
            <input
              type="password"
              id="traces-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>

          {/* MSME/Udyam */}
          <div className="flex flex-col">
            {/* MSME/Udyam */}
            <h2 className="text-lg font-semibold mb-2">MSME/Udyam</h2>

            <label className="font-medium" htmlFor="msme-udyam">
              MSME/Udyam *
            </label>
            <input
              type="text"
              id="msme-udyam"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="msme-number">
              MSME Number *
            </label>
            <input
              type="text"
              id="msme-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>

          {/* Import Export */}
          <div className="flex flex-col">
            {/* Import Export Code */}
            <h2 className="text-lg font-semibold mb-2">Import Export Code</h2>

            <label className="font-medium" htmlFor="iec-number">
              IEC Number *
            </label>
            <input
              type="text"
              id="iec-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="dgft-username">
              DGFT Username *
            </label>
            <input
              type="text"
              id="dgft-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="dgft-password">
              DGFT Password *
            </label>
            <input
              type="password"
              id="dgft-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="icegate-username">
              ICEGATE Username *
            </label>
            <input
              type="text"
              id="icegate-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="icegate-password">
              ICEGATE Password *
            </label>
            <input
              type="password"
              id="icegate-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>

          {/* MCA */}
          <div className="flex flex-col">
            {/* MCA */}
            <h2 className="text-lg font-semibold mb-2">MCA</h2>
            <label className="font-medium" htmlFor="cin-llp">
              CIN/LLP *
            </label>
            <input
              type="text"
              id="cin-llp"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="mca-username">
              MCA Username *
            </label>
            <input
              type="text"
              id="mca-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="mca-password">
              MCA Password *
            </label>
            <input
              type="password"
              id="mca-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="bank-overdraft">
              Bank Overdraft/ Cash Credit
            </label>
            <input
              type="text"
              id="bank-overdraft"
              className="p-1 border border-gray-300 rounded text-sm w-full"
            />
            <label className="font-medium" htmlFor="renewal-date">
              Renewal Date
            </label>
            <input
              type="date"
              id="renewal-date"
              className="p-1 border border-gray-300 rounded text-sm w-full"
            />

            <label className="font-medium" htmlFor="iec-file">
              IEC Document*
            </label>
            <input
              type="file"
              id="iec-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            {/* Partnership Firm Form C */}
            <label className="font-medium" htmlFor="form-c-file">
              Form C Document*
            </label>
            <input
              type="file"
              id="form-c-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
        </div>

        {/* Center */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Center</h2>
          {/* Income tax
           */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Income Tax</h2>

            <label className="font-medium" htmlFor="income-tax">
              Income Tax *
            </label>
            <input
              type="text"
              id="income-tax"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="pan">
              PAN *
            </label>
            <input
              type="text"
              id="pan"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="income-tax-password">
              Income Tax Password *
            </label>
            <input
              type="password"
              id="income-tax-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* Provident Fund */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Provident Fund</h2>

            <label className="font-medium" htmlFor="pf-number">
              PF Number *
            </label>
            <input
              type="text"
              id="pf-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="pf-user-id">
              PF User ID *
            </label>
            <input
              type="text"
              id="pf-user-id"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="pf-password">
              PF Password *
            </label>
            <input
              type="password"
              id="pf-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* ESI Number */}
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="esi-number">
              ESI Number*
            </label>
            <input
              type="text"
              id="esi-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="esi-user-id">
              ESI User ID*
            </label>
            <input
              type="text"
              id="esi-user-id"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="esi-password">
              ESI Password*
            </label>
            <input
              type="password"
              id="esi-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* PT EC Number */}
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="pt-ec-number">
              PT EC Number*
            </label>
            <input
              type="text"
              id="pt-ec-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="ec-user-name">
              EC User Name*
            </label>
            <input
              type="text"
              id="ec-user-name"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="ec-password">
              EC Password*
            </label>
            <input
              type="password"
              id="ec-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="pt-number">
              PT Number*
            </label>
            <input
              type="text"
              id="pt-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="pt-username">
              PT Username*
            </label>
            <input
              type="text"
              id="pt-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="pt-password">
              PT Password*
            </label>
            <input
              type="password"
              id="pt-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* FSSAI */}
          <div className="flex flex-col">
            {/* FSSAI */}
            <h2 className="text-lg font-semibold mb-2">FSSAI</h2>

            <label className="font-medium" htmlFor="fssai-number">
              FSSAI Number *
            </label>
            <input
              type="text"
              id="fssai-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="fssai-username">
              FSSAI Username *
            </label>
            <input
              type="text"
              id="fssai-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="fssai-password">
              FSSAI Password *
            </label>
            <input
              type="password"
              id="fssai-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="fssai-renewal-date">
              FSSAI Renewal Date *
            </label>
            <input
              type="date"
              id="fssai-renewal-date"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* Partnership */}
          <div className="flex flex-col">
            {/* Partnership Firm Form C */}
            <h2 className="text-lg font-semibold mb-2">
              Partnership Firm Form C
            </h2>

            <label className="font-medium" htmlFor="form-c-number">
              Form C Number *
            </label>
            <input
              type="text"
              id="form-c-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* attchments-center */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold"> Attachments</h2>

            <label className="font-medium" htmlFor="pan-file">
              PAN Document*
            </label>
            <input
              type="file"
              id="pan-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* GST */}
            <label className="font-medium" htmlFor="gst-file">
              GST Document*
            </label>
            <input
              type="file"
              id="gst-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* ESI */}
            <label className="font-medium" htmlFor="esi-file">
              ESI Document*
            </label>
            <input
              type="file"
              id="esi-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* Provident Fund */}
            <label className="font-medium" htmlFor="pf-file">
              PF Document*
            </label>
            <input
              type="file"
              id="pf-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* Professional Tax */}
            <label className="font-medium" htmlFor="pt-file">
              Professional Tax Document*
            </label>
            <input
              type="file"
              id="pt-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            {/* Shram Suvidha Portal */}
            <label className="font-medium" htmlFor="lin-file">
              Shram Suvidha Document*
            </label>
            <input
              type="file"
              id="lin-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* MCA */}
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          {/* GST
           */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">GST</h2>

            <label className="font-medium" htmlFor="gst">
              GST *
            </label>
            <input
              type="text"
              id="gst"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="gstin">
              GSTIN *
            </label>
            <input
              type="text"
              id="gstin"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="gst-username">
              GST User Name *
            </label>
            <input
              type="text"
              id="gst-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="gst-password">
              GST Password *
            </label>
            <input
              type="password"
              id="gst-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="gst-status">
              GST Status *
            </label>
            <input
              type="text"
              id="gst-status"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* shop and
           */}
          <div className="flex flex-col">
            {/* Professional Tax For Institution */}
            <h2 className="text-lg font-semibold mb-2">
              Professional Tax For Institution
            </h2>

            <label className="font-medium" htmlFor="pt-ec-number">
              PT EC Number *
            </label>
            <input
              type="text"
              id="pt-ec-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="ec-user-name">
              EC User Name *
            </label>
            <input
              type="text"
              id="ec-user-name"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="ec-password">
              EC Password *
            </label>
            <input
              type="password"
              id="ec-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          vishnu
          <div className="flex flex-col">
            {/* Shop and Commercial Establishment */}
            <h2 className="text-lg font-semibold mb-2">
              Shop and Commercial Establishment
            </h2>

            <label className="font-medium" htmlFor="se-number">
              SE Number *
            </label>
            <input
              type="text"
              id="se-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="se-username">
              SE Username *
            </label>
            <input
              type="text"
              id="se-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="se-password">
              SE Password *
            </label>
            <input
              type="password"
              id="se-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="se-renewal-date">
              SE Renewal Date *
            </label>
            <input
              type="date"
              id="se-renewal-date"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* Factory Licence */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Factory Licence</h2>

            <label className="font-medium" htmlFor="factory-licence-number">
              Factory Licence Number *
            </label>
            <input
              type="text"
              id="factory-licence-number"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="fl-username">
              FL User Name *
            </label>
            <input
              type="text"
              id="fl-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="fl-password">
              FL Password *
            </label>
            <input
              type="password"
              id="fl-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="fl-renewal-date">
              FL Renewal Date *
            </label>
            <input
              type="date"
              id="fl-renewal-date"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* Shram   */}
          <div className="flex flex-col">
            {/* Shram Suvidha Portal */}
            <h2 className="text-lg font-semibold mb-2">Shram Suvidha Portal</h2>

            <label className="font-medium" htmlFor="lin">
              LIN *
            </label>
            <input
              type="text"
              id="lin"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="ss-username">
              S S Username *
            </label>
            <input
              type="text"
              id="ss-username"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            <label className="font-medium" htmlFor="ss-password">
              S S Password *
            </label>
            <input
              type="password"
              id="ss-password"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
          </div>
          {/* Attachments */}
          <div className="flex flex-col">
            {/* TAN */}
            <label className="font-medium" htmlFor="tan-file">
              TAN Document*
            </label>
            <input
              type="file"
              id="tan-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* Shop and Commercial Establishment */}
            <label className="font-medium" htmlFor="se-file">
              Shop and Commercial Establishment Document*
            </label>
            <input
              type="file"
              id="se-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* MSME */}
            <label className="font-medium" htmlFor="msme-file">
              MSME Document*
            </label>
            <input
              type="file"
              id="msme-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* FSSAI */}
            <label className="font-medium" htmlFor="fssai-file">
              FSSAI Document*
            </label>
            <input
              type="file"
              id="fssai-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />

            {/* Factory License */}
            <label className="font-medium" htmlFor="fl-file">
              Factory License Document*
            </label>
            <input
              type="file"
              id="fl-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            <label className="font-medium" htmlFor="cin-file">
              CIN Document*
            </label>
            <input
              type="file"
              id="cin-file"
              className="p-1 border border-gray-300 rounded text-sm w-full"
              required
            />
            {/* Import and Export Code */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
