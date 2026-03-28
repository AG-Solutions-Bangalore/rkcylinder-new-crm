const CylinderDetails = ({ data, branchId }) => {
  if (!data) return null;

  const serialLabel = branchId === 2 || branchId === "2" ? "Cylinder No" : "RK Serial No";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <DetailCard label="Vendor Name" value={data.vendor_name} />
      <DetailCard label="Tare Weight" value={data.weight} />
      <DetailCard label="Registration Date" value={data.registration_date} />
      <DetailCard label={serialLabel} value={data.barcode} />
      <DetailCard label="Batch Number" value={data.batch_no} />
      <DetailCard label="Month/Year" value={`${data.month}/${data.year}`} />
      <DetailCard label="Manufacturer" value={data.manufacturer_name} />
      <DetailCard label="Internal RK Batch" value={data.internal_batch_no || data.batch_no} />
    </div>
  );
};

const DetailCard = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-sm">
    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-lg font-semibold text-foreground">{value || "N/A"}</p>
  </div>
);

export default CylinderDetails;
