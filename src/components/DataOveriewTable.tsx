import { useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { GetRowIdParams, ColDef, RowClassParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { DataRow } from "../types";
import ToggleRenderer from "./ToggleRenderer";
import ColorChangeRenderer from "./ColorChangeRenderer";

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
      colorChangeRenderer: ColorChangeRenderer,
    }),
    []
  );

  const getRowId = (params: GetRowIdParams): string => params.data.field_3;

  const getRowStyle = useCallback((params: RowClassParams<DataRow>) => {
    const color = params.data?.rowColor;
    return color ? { backgroundColor: color } : undefined;
  }, []);

  // Function to update specific row color
  const updateRowColor = useCallback(
    (rowId: string, newColor: string) => {
      setRowData((prevData) =>
        prevData.map((row) =>
          row.field_3 === rowId ? { ...row, rowColor: newColor } : row
        )
      );

      // Refresh only that row in grid
      const rowNode = gridRef.current?.api.getRowNode(rowId);
      if (rowNode) {
        rowNode.setDataValue("rowColor", newColor);
        gridRef.current?.api.refreshCells({ rowNodes: [rowNode], force: true });
      }
    },
    [setRowData]
  );

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
            context={{ updateRowColor }}
            getRowId={getRowId}
            getRowStyle={getRowStyle}
            suppressRowClickSelection={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DataOverviewTable;
