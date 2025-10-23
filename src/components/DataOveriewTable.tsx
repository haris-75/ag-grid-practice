import { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type { GetRowIdParams, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { DataRow } from "../types";
import ToggleRenderer from "../components/ToggleRenderer";

interface DataOverviewTableProps {
  rowData: DataRow[];
  setRowData: React.Dispatch<React.SetStateAction<DataRow[]>>;
  colDefs: ColDef[];
}

const DataOverviewTable = ({
  rowData,
  setRowData,
  colDefs,
}: DataOverviewTableProps) => {
  const gridRef = useRef<AgGridReact<DataRow> | null>(null);
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 120,
    }),
    []
  );
  const frameworkComponents = useMemo(
    () => ({
      toggleRenderer: ToggleRenderer,
    }),
    []
  );
  const getRowId = (params: GetRowIdParams): string => params.data.field_3;

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
            animateRows={true}
            components={frameworkComponents}
            context={{ setRowData }}
            getRowId={getRowId}
          />
        </div>
      </div>
    </div>
  );
};

export default DataOverviewTable;
