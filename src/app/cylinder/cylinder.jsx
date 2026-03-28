import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { CYLINDER_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, List } from "lucide-react";
import { useState } from "react";
import CylinderForm from "./cylinder-form";
import CylinderSubList from "./cylinder-sub-list";

const CylinderList = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewSubItemsId, setViewSubItemsId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: CYLINDER_API.list,
    queryKey: ["cylinderlist"],
  });

  const handleCreate = () => {
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleViewSubItems = (id) => {
    setViewSubItemsId(id);
  };

  const columns = [
    { header: "Batch No", accessorKey: "batch_no" },
    { header: "Year", accessorKey: "cylinder_year" },
    { header: "Date", accessorKey: "cylinder_date" },
    { header: "Count", accessorKey: "cylinder_count" },
    { header: "Vendor", accessorKey: "vendor_name" },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleViewSubItems(row.original.id)}
            title="View Serial Numbers"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return <ApiErrorPage onRetry={() => refetch()} />;
  }

  if (viewSubItemsId) {
    return (
      <CylinderSubList
        cylinderId={viewSubItemsId}
        onBack={() => setViewSubItemsId(null)}
      />
    );
  }

  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search batch..."
        addButton={{
          onClick: handleCreate,
          label: "Create Batch",
        }}
      />
      <CylinderForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cylinderId={selectedId}
      />
    </>
  );
};

export default CylinderList;
