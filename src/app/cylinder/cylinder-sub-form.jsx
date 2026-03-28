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
  cylinder_sub_barcode: "",
  cylinder_sub_company_no: "",
  cylinder_sub_manufacturer_id: "",
  cylinder_sub_manufacturer_month: "",
  cylinder_sub_manufacturer_year: "",
  cylinder_sub_batch_no: "",
  cylinder_sub_weight: "",
  // Branch 2 extras
  cylinder_sub_previous_test_date: "",
  cylinder_sub_n_t_d: "",
  cylinder_sub_n_weight: "",
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
    url: MANUFACTURER_API.dropdown,
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
          url: `web-fetch-cylinder-sub-by-id/${subId}`,
        });

        console.log("Cylinder Sub Detail Response:", res);
        const subData = res?.cylindersub || res?.data;
        if (subData) {
          setData({
            ...subData,
            cylinder_sub_manufacturer_id: subData.cylinder_sub_manufacturer_id?.toString() || "",
            depressurization: subData.depressurization || "No",
            cleaning: subData.cleaning || "No",
            inspection: subData.inspection || "No",
            bung_check: subData.bung_check || "No",
            hydro_testing: subData.hydro_testing || "No",
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
    if (!data.cylinder_sub_barcode?.trim()) newErrors.cylinder_sub_barcode = "Required";
    if (!data.cylinder_sub_company_no?.trim()) newErrors.cylinder_sub_company_no = "Required";
    if (!data.cylinder_sub_manufacturer_id) newErrors.cylinder_sub_manufacturer_id = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (stayOpen = false) => {
    if (!validate()) return;

    const formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    formData.append("id", cylinderId); // Main batch id is often sent as 'id' in create sub

    try {
      const res = await submitSub({
        url: isEditMode ? CYLINDER_API.updateSub(subId) : "web-create-cylinder-sub",
        method: isEditMode ? "put" : "post",
        data: formData,
      });

      if (res?.code === 200 || res?.code === 201) {
        toast.success(res?.msg || "Saved successfully");
        queryClient.invalidateQueries({ queryKey: ["cylindersublist", cylinderId] });
        
        if (stayOpen) {
          setData(initialState);
          setErrors({});
        } else {
          onClose();
        }
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
              value={data.cylinder_sub_barcode}
              onChange={(e) => setData({ ...data, cylinder_sub_barcode: e.target.value })}
            />
            {errors.cylinder_sub_barcode && <p className="text-xs text-red-500">{errors.cylinder_sub_barcode}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cylinder No *</label>
            <Input
              placeholder="Cylinder No"
              value={data.cylinder_sub_company_no}
              onChange={(e) => setData({ ...data, cylinder_sub_company_no: e.target.value })}
            />
            {errors.cylinder_sub_company_no && <p className="text-xs text-red-500">{errors.cylinder_sub_company_no}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Manufacturer *</label>
            <Select
              onValueChange={(value) => setData({ ...data, cylinder_sub_manufacturer_id: value })}
              value={data.cylinder_sub_manufacturer_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturerData?.manufacturer?.map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.manufacturer_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cylinder_sub_manufacturer_id && <p className="text-xs text-red-500">{errors.cylinder_sub_manufacturer_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Input
                placeholder="MM"
                value={data.cylinder_sub_manufacturer_month}
                onChange={(e) => setData({ ...data, cylinder_sub_manufacturer_month: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Input
                placeholder="YY"
                value={data.cylinder_sub_manufacturer_year}
                onChange={(e) => setData({ ...data, cylinder_sub_manufacturer_year: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Batch No</label>
            <Input
              placeholder="Batch No"
              value={data.cylinder_sub_batch_no}
              onChange={(e) => setData({ ...data, cylinder_sub_batch_no: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tare Weight</label>
            <Input
              placeholder="Weight"
              value={data.cylinder_sub_weight}
              onChange={(e) => setData({ ...data, cylinder_sub_weight: e.target.value })}
            />
          </div>

          {isBranchTwo && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prev Test Date</label>
                <Input
                  type="date"
                  value={data.cylinder_sub_previous_test_date}
                  onChange={(e) => setData({ ...data, cylinder_sub_previous_test_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">NTD</label>
                <Input
                  type="date"
                  value={data.cylinder_sub_n_t_d}
                  onChange={(e) => setData({ ...data, cylinder_sub_n_t_d: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">N-Weight</label>
                <Input
                  placeholder="N-Weight"
                  value={data.cylinder_sub_n_weight}
                  onChange={(e) => setData({ ...data, cylinder_sub_n_weight: e.target.value })}
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

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            {!isEditMode && (
              <Button onClick={() => handleSave(true)} disabled={submitLoading} variant="secondary">
                Submit & Next
              </Button>
            )}
            <Button onClick={() => handleSave(false)} disabled={submitLoading}>
              {isEditMode ? "Update" : "Finish"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CylinderSubForm;
