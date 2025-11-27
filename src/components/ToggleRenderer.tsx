import { type ReactElement } from "react";
import type { ICellRendererParams } from "ag-grid-community";
import type { DataRow } from "../types";
import { useDataStore } from "../stores/useDataStore";

const ToggleRenderer = (
  props: ICellRendererParams<DataRow, boolean>
): ReactElement => {
  const { value, data, colDef, api, node } = props;
  const setCell = useDataStore((s) => s.setCell);

  const field = colDef?.field;

  const handleToggle = () => {
    if (!field || !data) return;
    setCell(data.id, field, !value);
    api.refreshCells({
      rowNodes: [node],
      columns: [String(field)],
      force: true,
    });
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

export default ToggleRenderer;
