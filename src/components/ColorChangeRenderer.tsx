import { useState } from "react";
import type { ICellRendererParams } from "ag-grid-community";

const ColorPickerRenderer = (props: ICellRendererParams) => {
  const { data, context } = props;
  const [color, setColor] = useState(data.rowColor || "#ffffff");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    context.updateRowColor(data.field_3, newColor);
  };

  return (
    <div className="flex justify-center items-center">
      <input
        type="color"
        value={color}
        onChange={handleChange}
        className="cursor-pointer w-8 h-8 border-none rounded-md shadow-sm"
        title="Select row color"
      />
    </div>
  );
};

export default ColorPickerRenderer;
