import type { ColDef } from "ag-grid-community";
export type DataRow = {
  field_1: number;
  field_2: number;
  field_3: string;
  field_4: boolean;
  field_5: string;
  field_6: number;
  field_7: number;
  field_8: string;
  field_9: boolean;
  field_10: string;
  field_11: number;
  field_12: number;
  field_13: string;
  field_14: boolean;
  field_15: string;
  field_16: number;
  field_17: number;
  field_18: string;
  field_19: boolean;
  field_20: string;
  field_21: number;
  field_22: number;
  field_23: string;
  field_24: boolean;
  field_25: string;
  field_26: number;
  field_27: number;
  field_28: string;
  field_29: boolean;
  field_30: string;
  field_31: number;
  field_32: number;
  field_33: string;
  field_34: boolean;
  field_35: string;
  field_36: number;
  field_37: number;
  field_38: string;
  field_39: boolean;
  field_40: string;
  field_41: number;
  field_42: number;
  field_43: string;
  field_44: boolean;
  field_45: string;
  field_46: number;
  field_47: number;
  field_48: string;
  field_49: boolean;
  field_50: string;
};

export type DataRow2 = {
  id: string;
  [key: `field_${number}`]: string | number | boolean;
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
