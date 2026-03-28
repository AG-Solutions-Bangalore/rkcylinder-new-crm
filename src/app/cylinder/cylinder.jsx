import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { CYLINDER_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, List, Eye } from "lucide-react";
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
    {
      header: "SL No",
      id: "slNo",
      cell: ({ row }) => row.index + 1,
    },
    { header: "Vendor", accessorKey: "vendor_name" },
    { header: "Cyl Count", accessorKey: "cylinder_count" },
    { header: "Status", accessorKey: "cylinder_status" },
    { header: "R K Batch No", accessorKey: "cylinder_batch_nos" },
    {
      header: "Date",
      accessorKey: "cylinder_date",
      cell: ({ row }) => {
        const date = row.original.cylinder_date;
        return date ? new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-") : "";
      },
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleViewSubItems(row.original.id)}
            title="View Cylinder Info"
          >
            <Eye className="h-5 w-5 text-green-600" />
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
        data={data?.cylinder || []}
        columns={columns}
        loading={isLoading}
        pageSize={10}
        searchPlaceholder="Search batch..."
        addButton={{
          onClick: handleCreate,
          label: "Create Batch",
        }}
      />
      {isDialogOpen && (
        <CylinderForm
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          cylinderId={selectedId}
        />
      )}
    </>
  );
};

export default CylinderList;
