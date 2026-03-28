import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ReportFilter = ({ onFilter, isLoading }) => {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ fromDate, toDate });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">From Date</label>
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="bg-white/5 border-white/10 h-10"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">To Date</label>
        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="bg-white/5 border-white/10 h-10"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="h-10 px-6">
        Generate Report
      </Button>
    </form>
  );
};

export default ReportFilter;
