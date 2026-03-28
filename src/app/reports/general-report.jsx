import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { REPORT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { FileDown } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import ReportFilter from "./report-filter";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GeneralReport = () => {
  const [data, setData] = useState([]);
  const [reportType, setReportType] = useState("report1");
  const { trigger: fetchReport, loading } = useApiMutation();
  const reportRef = useRef(null);

  const handleFilter = async (params) => {
    const formData = new FormData();
    formData.append("cylinder_date_from", params.fromDate);
    formData.append("cylinder_date_to", params.toDate);

    try {
      const res = await fetchReport({
        url: reportType === "report1" ? REPORT_API.report1 : REPORT_API.report2,
        method: "post",
        data: formData,
      });

      if (res?.cylinder) {
        setData(res.cylinder);
      } else {
        setData([]);
        toast.info("No data found.");
      }
    } catch (err) {
      toast.error("Failed to fetch report data.");
    }
  };

  const handleDownloadCSV = async () => {
    // We need the date parameters, which are managed by the ReportFilter component.
    // For simplicity, let's assume the user has to click "View" first to see data,
    // or we can trigger another fetch for download.
    toast.info("Please use the 'View' button to fetch data before downloading, or I'll implement a direct download if dates are available.");
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
        pdf.save(`${reportType}.pdf`);
    } catch (error) {
        toast.error("Failed to generate PDF.");
    }
  };

  const columns = reportType === "report1" ? [
    { header: "Code No", accessorKey: "cylinder_sub_company_no" },
    { header: "R K Serial No", accessorKey: "cylinder_sub_barcode" },
    { header: "Make", accessorKey: "manufacturer_name" },
    { 
        header: "Month/Year", 
        cell: ({ row }) => `${row.original.cylinder_sub_manufacturer_month}/${row.original.cylinder_sub_manufacturer_year}` 
    },
    { header: "Batch No", accessorKey: "cylinder_sub_batch_no" },
    { header: "Tare Weight", accessorKey: "cylinder_sub_weight" },
  ] : [
    { header: "R K Serial No", accessorKey: "cylinder_sub_barcode" },
    { header: "Make", accessorKey: "manufacturer_name" },
    { 
        header: "Month/Year", 
        cell: ({ row }) => `${row.original.cylinder_sub_manufacturer_month}/${row.original.cylinder_sub_manufacturer_year}` 
    },
    { header: "Batch No", accessorKey: "cylinder_sub_batch_no" },
    { header: "Tare Weight", accessorKey: "cylinder_sub_weight" },
  ];

  return (
    <div className="p-4 space-y-6 text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">General Reports</h2>
        <div className="flex flex-wrap gap-2">
            <Select onValueChange={setReportType} value={reportType}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10">
                    <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="report1">Report One</SelectItem>
                    <SelectItem value="report2">Report Two</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={exportPDF} disabled={data.length === 0} variant="destructive" className="gap-2">
                <FileDown className="h-4 w-4" />
                Export PDF
            </Button>
        </div>
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

export default GeneralReport;
