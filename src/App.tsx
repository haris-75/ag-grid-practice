import {} from "react";
import DataOverviewTable from "./components/DataOveriewTable";
import { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColumnObject, DataRow } from "./types";
import { generateDataArray } from "./utils";

const getColumnObject = (
  key: string,
  value: DataRow[keyof DataRow]
): ColumnObject => {
  const isBoolean = typeof value === "boolean";
  return {
    field: key,
    headerName: key.replace(/_/g, " ").toUpperCase(),
    sortable: true,
    filter: true,
    resizable: true,
    editable: isBoolean,
    cellRenderer: isBoolean ? "toggleRenderer" : undefined,
    cellStyle: {
      fontSize: "0.875rem",
      color: "#1f2937",
      borderBottom: "1px solid #e5e7eb",
    },
  };
};

const App = () => {
  const initialData = useMemo(() => generateDataArray(5000), []);
  const [rowData, setRowData] = useState<DataRow[]>(initialData);

  const colDefs = useMemo<ColDef[]>(() => {
    if (!initialData || initialData.length === 0) return [];
    const sample = initialData[0];
    return Object.keys(sample).map((key) =>
      getColumnObject(key, sample[key as keyof DataRow])
    );
  }, [initialData]);

  useEffect(() => {
    if (initialData && initialData?.length > 0) setRowData(initialData);
  }, [setRowData]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <DataOverviewTable
        rowData={rowData}
        setRowData={setRowData}
        colDefs={colDefs}
      />
      <DataOverviewTable
        rowData={rowData}
        setRowData={setRowData}
        colDefs={colDefs}
      />
    </div>
  );
};

export default App;
