import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { CYLINDER_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { ContextPanel } from "@/lib/context-panel";
import { ArrowLeft, Edit } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import CylinderSubForm from "./cylinder-sub-form";

const CylinderSubList = ({ cylinderId, onBack }) => {
  const { userInfo } = useContext(ContextPanel);
  const isBranchTwo = userInfo?.branchId === "2" || userInfo?.branchId === 2;
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Guessing the endpoint for sub-items list
  const { trigger: downloadCsv } = useApiMutation();
  const [batchData, setBatchData] = useState(null);

  // Fetch batch details (includes sub-items)
  const { data: detailData, isLoading: detailLoading, isError: detailError, refetch: refetchDetail } = useGetApiMutation({
    url: CYLINDER_API.byId(cylinderId),
    queryKey: ["cylindersublist", cylinderId], // Using same key for invalidation
  });

  useEffect(() => {
    if (detailData) {
      setBatchData(detailData);
    }
  }, [detailData]);

  const handleDownload = async () => {
    try {
      const res = await downloadCsv({
        url: "download-cylinder-details-report-in-view",
        method: "post",
        data: { cylinder_batch_nos: batchData?.cylinder?.cylinder_batch_nos },
        responseType: "blob",
      });

      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `subcylinderview_${cylinderId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      toast.error("Failed to download CSV");
    }
  };

  // The sub-items are included in the detailData from CYLINDER_API.byId
  const isLoading = detailLoading;
  const isError = detailError;
  const refetch = refetchDetail;

  const handleEdit = (id) => {
    setSelectedSubId(id);
    setIsDialogOpen(true);
  };

  const columns = [
    ...(userInfo?.branchId === 1 || userInfo?.branchId === "1"
      ? [{ header: "R K Serial No", accessorKey: "cylinder_sub_barcode" }]
      : []),

    { header: "R K Batch No", accessorKey: "cylinder_sub_barcode" },
    { header: "Cylinder No", accessorKey: "cylinder_sub_company_no" },
    { header: "Manufacturer", accessorKey: "manufacturer_name" },
    {
      header: "Month/Year",
      cell: ({ row }) =>
        `${row.original.cylinder_sub_manufacturer_month}/${row.original.cylinder_sub_manufacturer_year}`,
    },
    { header: "Batch No", accessorKey: "cylinder_sub_batch_no" },
    { header: "Tare Weight", accessorKey: "cylinder_sub_weight" },
    ...(isBranchTwo
      ? [
          {
            header: "Prev Test Date",
            accessorKey: "cylinder_sub_previous_test_date",
          },
          { header: "NTD", accessorKey: "cylinder_sub_n_t_d" },
          { header: "N-Weight", accessorKey: "cylinder_sub_n_weight" },
        ]
      : []),
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleEdit(row.original.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isError) {
    return <ApiErrorPage onRetry={() => refetch()} />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
          <h3 className="text-xl font-bold border-b-2 border-dashed border-blue-900">View Cylinder</h3>
        </div>
        {batchData && (
          <div className="flex gap-6 items-center bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Date</span>
              <span className="font-bold">{batchData.cylinder?.cylinder_date ? new Date(batchData.cylinder.cylinder_date).toLocaleDateString("en-GB").replace(/\//g, "-") : ""}</span>
            </div>
            <div className="flex flex-col border-l pl-6">
              <span className="text-xs font-semibold text-muted-foreground uppercase">R K Batch No</span>
              <span className="font-bold">{batchData.cylinder?.cylinder_batch_nos}</span>
            </div>
            <div className="flex flex-col border-l pl-6">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Vendor</span>
              <span className="font-bold">{batchData.vendor?.vendor_name}</span>
            </div>
            <Button 
              variant="default" 
              className="ml-4 bg-blue-600 hover:bg-blue-700 h-9"
              onClick={handleDownload}
            >
              Download List
            </Button>
          </div>
        )}
      </div>

      {isLoading && <LoadingBar />}
      <DataTable
        data={(() => {
          // Normalize the data source (handle case sensitivity and data wrappers)
          const source = detailData?.data || detailData;
          const rawData = source?.cylinderSub || source?.cylindersub;
          
          if (Array.isArray(rawData)) return rawData;
          if (rawData && typeof rawData === 'object') return [rawData];
          
          return [];
        })()}
        columns={columns}
        loading={isLoading}
        pageSize={10}
        searchPlaceholder="Search serial..."
      />
      <CylinderSubForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        subId={selectedSubId}
        cylinderId={cylinderId}
      />
    </>
  );
};

export default CylinderSubList;
