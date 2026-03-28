import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { REPORT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { FileDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import ReportFilter from "./report-filter";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const VendorReport = () => {
  const [data, setData] = useState([]);
  const { trigger: fetchReport, loading } = useApiMutation();
  const reportRef = useRef(null);

  useEffect(() => {
    handleFilter({ fromDate: new Date().toISOString().split('T')[0], toDate: new Date().toISOString().split('T')[0] });
  }, []);

  const handleFilter = async (params) => {
    const formData = new FormData();
    formData.append("from_date", params.fromDate);
    formData.append("to_date", params.toDate);

    try {
      const res = await fetchReport({
        url: REPORT_API.vendor,
        method: "post",
        data: {}, // Reference shows empty object for vendor report
      });

      console.log("Vendor API Response:", res);
      if (res?.vendor) {
        setData(res.vendor);
      } else {
        setData([]);
        toast.info("No data found.");
      }
    } catch (err) {
      toast.error("Failed to fetch report data.");
    }
  };

  const exportPDF = async () => {
    if (!reportRef.current || data.length === 0) return;
    
    try {
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save("vendor-report.pdf");
    } catch (error) {
        toast.error("Failed to generate PDF.");
    }
  };

  const columns = [
    { header: "Name", accessorKey: "vendor_name" },
    { header: "Address", accessorKey: "vendor_address" },
    { header: "State", accessorKey: "vendor_state" },
    { header: "Mobile", accessorKey: "vendor_mobile" },
    { header: "Email", accessorKey: "vendor_email" },
    { header: "Status", accessorKey: "vendor_status" },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendor Report</h2>
        <Button onClick={exportPDF} disabled={data.length === 0} variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <ReportFilter onFilter={handleFilter} isLoading={loading} />

      {loading && <LoadingBar />}
      
      <div ref={reportRef} className="bg-white rounded-lg p-2 overflow-hidden text-black">
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          pageSize={20}
          searchPlaceholder="Search result..."
        />
      </div>
    </div>
  );
};

export default VendorReport;
