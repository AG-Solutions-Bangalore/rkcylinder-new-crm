import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CYLINDER_API, VENDOR_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialState = {
  cylinder_year: new Date().getFullYear().toString(),
  cylinder_date: new Date().toISOString().split('T')[0],
  vendor_id: "",
  cylinder_count: "",
  batch_no: "",
};

const CylinderForm = ({ isOpen, onClose }) => {
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const { trigger: fetchBatchNo, loading: batchLoading } = useApiMutation();
  const { trigger: submitCylinder, loading: submitLoading } = useApiMutation();
  const queryClient = useQueryClient();

  const { data: vendorData } = useGetApiMutation({
    url: VENDOR_API.list,
    queryKey: ["vendor-dropdown"],
  });

  useEffect(() => {
    if (isOpen) {
      setData(initialState);
      setErrors({});
      generateBatchNo();
    }
  }, [isOpen]);

  const generateBatchNo = async () => {
    try {
      const res = await fetchBatchNo({
        url: CYLINDER_API.batchNo,
        method: "get"
      });
      if (res?.batch_no) {
        setData(prev => ({ ...prev, batch_no: res.batch_no }));
      }
    } catch (err) {
      toast.error("Failed to generate batch number");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!data.cylinder_year) newErrors.cylinder_year = "Required";
    if (!data.cylinder_date) newErrors.cylinder_date = "Required";
    if (!data.vendor_id) newErrors.vendor_id = "Required";
    if (!data.cylinder_count || isNaN(data.cylinder_count)) newErrors.cylinder_count = "Invalid count";
    if (!data.batch_no) newErrors.batch_no = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("cylinder_year", data.cylinder_year);
    formData.append("cylinder_date", data.cylinder_date);
    formData.append("vendor_id", data.vendor_id);
    formData.append("cylinder_count", data.cylinder_count);
    formData.append("batch_no", data.batch_no);

    try {
      const res = await submitCylinder({
        url: CYLINDER_API.create,
        method: "post",
        data: formData,
      });

      if (res?.code === 201 || res?.code === 200) {
        toast.success(res?.msg || "Batch created successfully");
        onClose();
        queryClient.invalidateQueries({ queryKey: ["cylinderlist"] });
      } else {
        toast.error(res?.msg || "Failed to create batch");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Cylinder Batch</DialogTitle>
        </DialogHeader>

        {(submitLoading || batchLoading) && <LoadingBar />}

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch No *</label>
              <Input
                value={data.batch_no}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Input
                type="date"
                value={data.cylinder_date}
                onChange={(e) => setData({ ...data, cylinder_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cylinder Year *</label>
              <Input
                placeholder="Year"
                value={data.cylinder_year}
                onChange={(e) => setData({ ...data, cylinder_year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Count *</label>
              <Input
                placeholder="Count"
                type="number"
                value={data.cylinder_count}
                onChange={(e) => setData({ ...data, cylinder_count: e.target.value })}
              />
              {errors.cylinder_count && <p className="text-xs text-red-500">{errors.cylinder_count}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vendor *</label>
            <Select
              onValueChange={(value) => setData({ ...data, vendor_id: value })}
              value={data.vendor_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendorData?.data?.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id.toString()}>
                    {vendor.vendor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vendor_id && <p className="text-xs text-red-500">{errors.vendor_id}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={submitLoading}>Create Batch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CylinderForm;
