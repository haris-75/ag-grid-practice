import type { DataRow } from "./types";

const randomString = (length = 8): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const randomDate = (): string => {
  const start = new Date(2020, 0, 1);
  const end = new Date(2025, 11, 31);
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
};

const generateRow = (): DataRow => {
  const obj: Record<string, string | number | boolean> = {};

  for (let j = 1; j <= 50; j++) {
    switch (j % 5) {
      case 1:
        obj[`field_${j}`] = Math.floor(Math.random() * 10000);
        break;
      case 2:
        obj[`field_${j}`] = parseFloat((Math.random() * 1000).toFixed(6));
        break;
      case 3:
        obj[`field_${j}`] = randomString(8);
        break;
      case 4:
        obj[`field_${j}`] = Math.random() > 0.5;
        break;
      case 0:
        obj[`field_${j}`] = randomDate();
        break;
    }
  }

  return obj as DataRow;
};

export function generateDataArray(n: number): DataRow[] {
  return Array.from({ length: n }, () => generateRow());
}
