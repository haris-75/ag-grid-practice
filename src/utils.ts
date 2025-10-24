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

const randomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 50 + Math.random() * 50;
  const lightness = 60 + Math.random() * 20;
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  return hslToHex(hue, saturation, lightness);
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

  return { ...obj, rowColor: randomColor() } as DataRow;
};

export function generateDataArray(n: number): DataRow[] {
  return Array.from({ length: n }, () => generateRow());
}
