import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REPORT_API, VENDOR_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { FileDown, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import LoadingBar from "@/components/loader/loading-bar";
import { useApiMutation } from "@/hooks/use-mutation";
import DataTable from "@/components/common/data-table";

const CylinderDetailsReport = () => {
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [vendorId, setVendorId] = useState("all");
    const [barcode, setBarcode] = useState("");
    const [data, setData] = useState([]);

    const { data: vendorData } = useGetApiMutation({
        url: VENDOR_API.list,
        queryKey: ["vendor-dropdown"],
    });

    const { trigger: fetchReport, loading } = useApiMutation();

    const handleFilter = async (e) => {
        e?.preventDefault();
        const formData = new FormData();
        formData.append("cylinder_date_from", fromDate);
        formData.append("cylinder_date_to", toDate);
        if (vendorId !== "all") formData.append("cylinder_vendor_id", vendorId);
        if (barcode.trim()) formData.append("cylinder_sub_barcode", barcode);

        try {
            const res = await fetchReport({
                url: REPORT_API.cylinderDetails,
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
            toast.error("Failed to fetch report.");
        }
    };

    const handleDownloadCSV = async () => {
        const formData = new FormData();
        formData.append("cylinder_date_from", fromDate);
        formData.append("cylinder_date_to", toDate);
        if (vendorId !== "all") formData.append("cylinder_vendor_id", vendorId);
        if (barcode.trim()) formData.append("cylinder_sub_barcode", barcode);

        try {
            toast.loading("Preparing download...");
            const res = await fetchReport({
                url: REPORT_API.downloadCylinderDetails,
                method: "post",
                data: formData,
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Cylinder_Details_${fromDate}_to_${toDate}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.dismiss();
            toast.success("Download started.");
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to download CSV.");
        }
    };

    const columns = [
        { header: "Cylinder Date", accessorKey: "cylinder_date" },
        { header: "R K Serial No", accessorKey: "cylinder_sub_barcode" },
        { header: "Manufacturer", accessorKey: "manufacturer_name" },
        { header: "Batch No", accessorKey: "cylinder_sub_batch_no" },
        { header: "Cylinder No", accessorKey: "cylinder_sub_company_no" },
        { 
            header: "Month/Year", 
            cell: ({ row }) => `${row.original.cylinder_sub_manufacturer_month}/${row.original.cylinder_sub_manufacturer_year}` 
        },
        { header: "Tare Weight", accessorKey: "cylinder_sub_weight" },
    ];

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Cylinder Details Report</h2>
                <Button onClick={handleDownloadCSV} variant="default" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download CSV
                </Button>
            </div>

            <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 items-end">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">From Date</label>
                    <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-white/5 border-white/10 h-10" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">To Date</label>
                    <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-white/5 border-white/10 h-10" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Vendor</label>
                    <Select onValueChange={setVendorId} value={vendorId}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                            <SelectValue placeholder="Select Vendor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Vendors</SelectItem>
                            {vendorData?.vendor?.map(v => (
                                <SelectItem key={v.id} value={v.id.toString()}>{v.vendor_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">RK Serial No</label>
                    <Input 
                        placeholder="Search Serial No..." 
                        value={barcode} 
                        onChange={(e) => setBarcode(e.target.value)} 
                        className="bg-white/5 border-white/10 h-10" 
                    />
                </div>
                <Button type="submit" disabled={loading} className="h-10">Show Report</Button>
            </form>

            <DataTable 
                data={data}
                columns={columns}
                loading={loading}
                pageSize={20}
                searchPlaceholder="Search in report..."
            />
        </div>
    );
};

export default CylinderDetailsReport;
