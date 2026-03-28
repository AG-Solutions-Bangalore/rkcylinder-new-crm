import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { CYLINDER_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { ContextPanel } from "@/lib/context-panel";
import { ArrowLeft, Edit } from "lucide-react";
import { useContext, useState } from "react";
import CylinderSubForm from "./cylinder-sub-form";

const CylinderSubList = ({ cylinderId, onBack }) => {
  const { userInfo } = useContext(ContextPanel);
  const isBranchTwo = userInfo?.branchId === "2" || userInfo?.branchId === 2;
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Guessing the endpoint for sub-items list
  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: `web-fetch-cylinder-sub-list/${cylinderId}`,
    queryKey: ["cylindersublist", cylinderId],
  });

  const handleEdit = (id) => {
    setSelectedSubId(id);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedSubId(null);
    setIsDialogOpen(true);
  }

  const columns = [
    { header: "Barcode (RK Serial)", accessorKey: "barcode" },
    { header: "Company No", accessorKey: "company_no" },
    { header: "Manufacturer", accessorKey: "manufacturer_name" },
    { header: "Month", accessorKey: "month" },
    { header: "Year", accessorKey: "year" },
    { header: "Weight", accessorKey: "weight" },
    ...(isBranchTwo ? [
      { header: "Prev Test Date", accessorKey: "prev_test_date" },
      { header: "NTD", accessorKey: "next_test_date" },
      { header: "N-Weight", accessorKey: "new_weight" },
    ] : []),
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
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
      </div>

      {isLoading && <LoadingBar />}
      <DataTable
        data={data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search serial..."
        addButton={{
          onClick: handleCreate,
          label: "Add Serial No",
        }}
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
