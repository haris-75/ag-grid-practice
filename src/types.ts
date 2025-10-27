import type { ColDef } from "ag-grid-community";
export type DataCell = string | number | boolean;

export type DataRow = {
  id: string;
  [key: string]: DataCell;
};

export interface ColumnObject extends ColDef {
  field: string;
  headerName: string;
  sortable: boolean;
  filter: boolean;
  resizable: boolean;
  editable?: boolean;
  cellRenderer?: string;
}

export interface GetRowIdParams {
  data: DataRow;
}

export interface IDataStoreSelector {
  rowData: DataRow[];
}

export interface IColDefsSelector {
  colDefs: ColDef[];
}
