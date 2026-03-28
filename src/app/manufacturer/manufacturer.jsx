import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { MANUFACTURER_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";
import { useState } from "react";
import ManufacturerForm from "./manufacturer-form";

const ManufacturerList = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: MANUFACTURER_API.list,
    queryKey: ["manufacturerlist"],
  });

  const handleCreate = () => {
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const columns = [
    { header: "Name", accessorKey: "manufacturer_name" },
    { header: "Mobile", accessorKey: "manufacturer_mobile" },
    { header: "Email", accessorKey: "manufacturer_email" },
    { header: "State", accessorKey: "manufacturer_state" },
    { header: "Address", accessorKey: "manufacturer_address" },
    {
      header: "Status",
      accessorKey: "manufacturer_status",
      cell: ({ row }) => {
        const status = row.original.manufacturer_status;
        const isActive = status === "Active" || status === 1;

        return (
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full inline-block
              ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {status}
          </span>
        );
      },
    },
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
      {isLoading && <LoadingBar />}
      <DataTable
        data={data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search manufacturer..."
        addButton={{
          onClick: handleCreate,
          label: "Add Manufacturer",
        }}
      />
      <ManufacturerForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        manufacturerId={selectedId}
      />
    </>
  );
};

export default ManufacturerList;
