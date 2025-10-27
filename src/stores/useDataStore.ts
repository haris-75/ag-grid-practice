import { create } from "zustand";
import type { ColDef } from "ag-grid-community";
import type { DataRow } from "../types";
import { generateDataArray, getColumnObject } from "../utils";

type Store = {
  rowData: DataRow[];
  colDefs: ColDef[];
  generateInitialData: (count?: number) => void;
  setRowData: (updater: (prev: DataRow[]) => DataRow[]) => void;
  setCell: (
    rowId: string,
    field: keyof DataRow,
    value: DataRow[keyof DataRow]
  ) => void;
};

export const useDataStore = create<Store>((set) => ({
  rowData: [],
  colDefs: [],

  generateInitialData: (count = 5000) => {
    const data = generateDataArray(count);
    const first = data[0];
    const cols: ColDef[] = first
      ? (Object.keys(first) as (keyof DataRow)[]).map((k) =>
          getColumnObject(String(k), first[k])
        )
      : [];
    set({ rowData: data, colDefs: cols });
  },

  setRowData: (updater) => set((s) => ({ rowData: updater(s.rowData) })),

  setCell: (rowId, field, value) =>
    set((s) => ({
      rowData: s.rowData.map((r) =>
        r.field_3 === rowId ? ({ ...r, [field]: value } as DataRow) : r
      ),
    })),
}));
