import { useEffect, useMemo, useState, useRef, type ReactElement } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, IRowNode } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import data from "./data.json";

type RowData = (typeof data)[number] & { [key: string]: any };
const App = () => {
  const gridRef = useRef<AgGridReact | null>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => {
        const sampleValue = data?.[0]?.[key];
        const isBoolean = typeof sampleValue === "boolean";

        return {
          field: key,
          headerName: key.replace(/_/g, " ").toUpperCase(),
          sortable: true,
          filter: true,
          resizable: true,
          editable: isBoolean, // ✅ only boolean columns editable
          cellRenderer: isBoolean ? "toggleRenderer" : undefined,
          cellStyle: {
            fontSize: "0.875rem",
            color: "#1f2937",
            borderBottom: "1px solid #e5e7eb",
          },
        };
      });
      setColDefs(columns);
      setRowData(data);
    }
  }, []);

  interface ToggleRendererColDef {
    field: string;
  }

  interface RefreshCellsParams {
    rowNodes: IRowNode<RowData>[];
    columns: string[];
  }

  interface ToggleRendererApi {
    refreshCells: (params: RefreshCellsParams) => void;
  }

  interface ToggleRendererProps {
    value: boolean;
    data: Record<string, unknown>;
    colDef: ToggleRendererColDef;
    api: ToggleRendererApi;
    node: IRowNode<RowData>;
  }

  const ToggleRenderer = (props: ToggleRendererProps): ReactElement => {
    const { value, data, colDef, api } = props;

    const handleToggle = () => {
      const newValue = !value;
      data[colDef.field] = newValue; // directly mutate the row value (AG Grid tracks this)
      api.refreshCells({ rowNodes: [props.node], columns: [colDef.field] });
    };

    return (
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={handleToggle}
      >
        <div
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
            value ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </div>
      </div>
    );
  };

  const defaultColDef = {
    flex: 1,
    minWidth: 120,
  };

  const frameworkComponents = useMemo(
    () => ({
      toggleRenderer: ToggleRenderer,
    }),
    []
  );

  const onCellValueChanged = () => {
    if (!gridRef.current || !gridRef.current.api) return;
    const updatedRows: RowData[] = [];
    gridRef.current.api.forEachNode((node: IRowNode<RowData>) => {
      if (node && node.data) updatedRows.push(node.data as RowData);
    });
    setRowData(updatedRows);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl">
        <div className="rounded-xl border border-gray-300 shadow-md overflow-hidden bg-white">
          <div className="text-2xl font-semibold text-gray-700 p-4 border-b border-gray-200 bg-gray-50">
            Data Overview
          </div>
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
              animateRows={true}
              frameworkComponents={frameworkComponents}
              onCellValueChanged={onCellValueChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
