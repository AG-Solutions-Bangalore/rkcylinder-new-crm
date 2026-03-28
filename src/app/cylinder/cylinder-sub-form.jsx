import { GroupButton } from "@/components/group-button";
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
import { CYLINDER_API, MANUFACTURER_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { ContextPanel } from "@/lib/context-panel";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const initialState = {
  barcode: "",
  company_no: "",
  manufacturer_id: "",
  month: "",
  year: "",
  batch_no: "",
  weight: "",
  // Branch 2 extras
  prev_test_date: "",
  next_test_date: "",
  new_weight: "",
  // Quality checks (Branch 2 edit)
  depressurization: "No",
  cleaning: "No",
  inspection: "No",
  bung_check: "No",
  hydro_testing: "No",
};

const CylinderSubForm = ({ isOpen, onClose, subId, cylinderId }) => {
  const isEditMode = Boolean(subId);
  const { userInfo } = useContext(ContextPanel);
  const isBranchTwo = userInfo?.branchId === "2" || userInfo?.branchId === 2;
  
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const { trigger: fetchSub, loading } = useApiMutation();
  const { trigger: submitSub, loading: submitLoading } = useApiMutation();
  const queryClient = useQueryClient();

  const { data: manufacturerData } = useGetApiMutation({
    url: MANUFACTURER_API.list,
    queryKey: ["manufacturer-dropdown"],
  });

  useEffect(() => {
    if (!isOpen) return;

    if (!isEditMode) {
      setData(initialState);
      setErrors({});
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchSub({
          url: `web-fetch-cylinder-sub-by-id/${subId}`, // Guessing endpoint
        });

        if (res?.data) {
          setData({
            ...res.data,
            manufacturer_id: res.data.manufacturer_id?.toString() || "",
            depressurization: res.data.depressurization || "No",
            cleaning: res.data.cleaning || "No",
            inspection: res.data.inspection || "No",
            bung_check: res.data.bung_check || "No",
            hydro_testing: res.data.hydro_testing || "No",
          });
        }
      } catch (err) {
        toast.error("Failed to load sub-item data");
      }
    };

    fetchData();
  }, [isOpen, subId]);

  const validate = () => {
    const newErrors = {};
    if (!data.barcode.trim()) newErrors.barcode = "Required";
    if (!data.company_no.trim()) newErrors.company_no = "Required";
    if (!data.manufacturer_id) newErrors.manufacturer_id = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    formData.append("cylinder_id", cylinderId);

    try {
      const res = await submitSub({
        url: isEditMode ? CYLINDER_API.updateSub(subId) : "web-create-cylinder-sub", // Guessing create endpoint
        method: isEditMode ? "put" : "post",
        data: formData,
      });

      if (res?.code === 200 || res?.code === 201) {
        toast.success(res?.msg || "Saved successfully");
        onClose();
        queryClient.invalidateQueries({ queryKey: ["cylindersublist", cylinderId] });
      } else {
        toast.error(res?.msg || "Operation failed");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Cylinder Serial No" : "Add Cylinder Serial No"}
          </DialogTitle>
        </DialogHeader>

        {loading && <LoadingBar />}

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Barcode (RK Serial) *</label>
            <Input
              placeholder="Barcode"
              value={data.barcode}
              onChange={(e) => setData({ ...data, barcode: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company No *</label>
            <Input
              placeholder="Company No"
              value={data.company_no}
              onChange={(e) => setData({ ...data, company_no: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Manufacturer *</label>
            <Select
              onValueChange={(value) => setData({ ...data, manufacturer_id: value })}
              value={data.manufacturer_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturerData?.data?.map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.manufacturer_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Input
                placeholder="MM"
                value={data.month}
                onChange={(e) => setData({ ...data, month: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Input
                placeholder="YYYY"
                value={data.year}
                onChange={(e) => setData({ ...data, year: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Batch No</label>
            <Input
              placeholder="Batch No"
              value={data.batch_no}
              onChange={(e) => setData({ ...data, batch_no: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Weight</label>
            <Input
              placeholder="Weight"
              value={data.weight}
              onChange={(e) => setData({ ...data, weight: e.target.value })}
            />
          </div>

          {isBranchTwo && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prev Test Date</label>
                <Input
                  type="date"
                  value={data.prev_test_date}
                  onChange={(e) => setData({ ...data, prev_test_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">NTD</label>
                <Input
                  type="date"
                  value={data.next_test_date}
                  onChange={(e) => setData({ ...data, next_test_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">N-Weight</label>
                <Input
                  placeholder="N-Weight"
                  value={data.new_weight}
                  onChange={(e) => setData({ ...data, new_weight: e.target.value })}
                />
              </div>
            </>
          )}

          {isBranchTwo && isEditMode && (
            <div className="col-span-2 border-t pt-4 mt-2">
               <h3 className="text-sm font-bold mb-4">Quality Checks</h3>
               <div className="grid grid-cols-2 gap-4">
                  {['depressurization', 'cleaning', 'inspection', 'bung_check', 'hydro_testing'].map((field) => (
                    <div key={field} className="flex flex-col gap-2">
                      <label className="text-xs font-semibold capitalize">{field.replace('_', ' ')}</label>
                      <GroupButton
                        className="w-fit"
                        value={data[field]}
                        onChange={(val) => setData({ ...data, [field]: val })}
                        options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
                      />
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={submitLoading}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CylinderSubForm;
