import { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type { GetRowIdParams } from "ag-grid-community";
import ToggleRenderer from "./ToggleRenderer";
import { useDataStore } from "../stores/useDataStore";
import type { DataRow } from "../types";

const DataOverviewTable = () => {
  const rowData = useDataStore((s) => s.rowData);
  const colDefs = useDataStore((s) => s.colDefs);

  const gridRef = useRef<AgGridReact<DataRow> | null>(null);
  const defaultColDef = useMemo(() => ({ flex: 1, minWidth: 120 }), []);
  const frameworkComponents = useMemo(
    () => ({ toggleRenderer: ToggleRenderer }),
    []
  );
  const getRowId = (p: GetRowIdParams<DataRow>) => p.data.id;

  return (
    <div className="w-full max-w-7xl">
      <div className="rounded-xl border border-gray-300 shadow-md overflow-hidden bg-white">
        <div className="text-2xl font-semibold text-gray-700 p-4 border-b border-gray-200 bg-gray-50">
          Data Overview
        </div>
        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
            animateRows
            components={frameworkComponents}
            getRowId={getRowId}
            suppressClickEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DataOverviewTable;
