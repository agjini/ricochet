import React from "react";
import { Label } from "./Label";

type Colors = "yellow" | "blue" | "red" | "green" | "gray";

interface SwitchProps {
  label?: string;
  required?: boolean;
  color?: Colors;
  inactiveColor?: Colors;
  value?: boolean;
  onChange?: (value: boolean) => any;
}

function getColor(color: Colors) {
  switch (color) {
    default:
    case "blue":
      return "bg-blue-400";

    case "yellow":
      return "bg-yellow-400";

    case "green":
      return "bg-green-400";

    case "red":
      return "bg-red-400";

    case "gray":
      return "bg-gray-300";
  }
}

export function Switch({
  label,
  required,
  color = "green",
  value,
  inactiveColor = "gray",
  onChange,
}: SwitchProps) {
  const cl = getColor(color);
  const iCl = getColor(inactiveColor);

  return (
    <>
      {label && <Label label={label} required={required} />}
      <div
        role="checkbox"
        tabIndex={-1}
        aria-checked={value}
        className={`outline-none shadow-inner my-2 mr-2 w-12 h-8 flex items-center rounded-full cursor-pointer p-1 duration-300 ease-in-out ${
          value ? cl : iCl
        }`}
        onClick={() => {
          if (onChange) {
            onChange(!value);
          }
        }}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow transform duration-300 ease-in-out ${
            value && "translate-x-4"
          }`}
        />
      </div>
    </>
  );
}
