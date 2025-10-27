import { useEffect } from "react";
import DataOverviewTable from "./components/DataOverviewTable";
import { useDataStore } from "./stores/useDataStore";

export default function App() {
  const generateInitialData = useDataStore((s) => s.generateInitialData);
  useEffect(() => {
    generateInitialData(5000);
  }, [generateInitialData]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 gap-6">
      <DataOverviewTable />
      <DataOverviewTable />
    </div>
  );
}
