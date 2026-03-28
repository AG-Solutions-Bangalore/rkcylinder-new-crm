import { CYLINDER_API } from "@/constants/apiConstants";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/use-mutation";
import useAppLogout from "@/utils/logout";
import { LogOut, ScanLine, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import CylinderDetails from "../cylinder/cylinder-details";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UserViewCylinder = () => {
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const inputRef = useRef(null);
  const handleLogout = useAppLogout();
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
        toast.error("No cylinder found for this barcode.");
      }
    } catch (err) {
      toast.error("Failed to fetch cylinder details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-xl mx-auto space-y-8">
      <div className="w-full flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
                <ScanLine className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h2 className="text-lg font-bold">Cylinder Scanner</h2>
                <p className="text-xs text-muted-foreground">Scan or enter barcode</p>
            </div>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setIsLogoutDialogOpen(true)} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page and your session will end.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirm Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <form onSubmit={handleSearch} className="w-full space-y-4">
        <div className="relative group">
          <Input
            ref={inputRef}
            placeholder="RK Serial / Barcode Number"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="h-16 text-2xl pr-16 bg-white/5 border-white/10 focus:ring-primary/50 transition-all text-center tracking-widest"
          />
          <Button 
            type="submit" 
            className="absolute right-2 top-2 h-12 w-12 rounded-lg shadow-xl hover:scale-105 active:scale-95 transition-transform"
            disabled={loading}
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground animate-pulse">
           Focus input and scan barcode for automatic search
        </p>
      </form>

      {loading && <LoadingBar />}

      {result && (
        <div className="w-full animate-in fade-in zoom-in duration-300">
           <CylinderDetails data={result} />
        </div>
      )}
    </div>
  );
};

export default UserViewCylinder;
