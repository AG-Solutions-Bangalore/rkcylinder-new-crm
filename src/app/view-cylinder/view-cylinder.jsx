import { CYLINDER_API } from "@/constants/apiConstants";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/use-mutation";
import { ContextPanel } from "@/lib/context-panel";
import { Search } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import CylinderDetails from "../cylinder/cylinder-details";

const ViewCylinder = () => {
  const { userInfo } = useContext(ContextPanel);
  const branchId = userInfo?.branchId;
  const serialLabel = branchId === 2 || branchId === "2" ? "Cylinder No" : "RK Serial No";

  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);
  const { trigger: fetchDetails, loading } = useApiMutation();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!barcode.trim()) return;

    try {
      const res = await fetchDetails({
        url: CYLINDER_API.detailsByBarcode(barcode),
        method: "get"
      });

      if (res?.data) {
        setResult(res.data);
      } else {
        setResult(null);
        toast.error(`No cylinder found for this ${serialLabel}.`);
      }
    } catch (err) {
      toast.error("Failed to fetch cylinder details.");
    }
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-6">
      <div className="w-full max-w-2xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Search Cylinder Details</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
                <Input
                    ref={inputRef}
                    placeholder={`Enter ${serialLabel}`}
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="h-12 bg-white/5 border-white/10"
                />
            </div>
            <Button type="submit" disabled={loading} className="gap-2">
                <Search className="h-4 w-4" />
                Search
            </Button>
        </form>
      </div>

      {loading && <LoadingBar />}

      {result && (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
           <CylinderDetails data={result} branchId={branchId} />
        </div>
      )}
    </div>
  );
};

export default ViewCylinder;
