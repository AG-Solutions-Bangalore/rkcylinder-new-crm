import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { VENDOR_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";
import { useState } from "react";
import VendorForm from "./vendor-form";

const VendorList = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: VENDOR_API.list,
    queryKey: ["vendorlist"],
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
    { header: "Name", accessorKey: "vendor_name" },
    { header: "Mobile", accessorKey: "vendor_mobile" },
    { header: "Email", accessorKey: "vendor_email" },
    { header: "State", accessorKey: "vendor_state" },
    {
      header: "Status",
      accessorKey: "vendor_status",
      cell: ({ row }) => {
        const status = row.original.vendor_status;
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
        data={data?.vendor || []}
        columns={columns}
        loading={isLoading}
        pageSize={10}
        searchPlaceholder="Search vendor..."
        addButton={{
          onClick: handleCreate,
          label: "Add Vendor",
        }}
      />
      <VendorForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vendorId={selectedId}
      />
    </>
  );
};

export default VendorList;
