/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { Loading } from "./Loading";

type Colors = "gray" | "yellow" | "blue" | "red" | "green" | "transparent";

interface ButtonProps {
  outline?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  title?: string;
  color?: Colors;
  type?: "submit" | "button" | "reset";
  href?: string;
  label?: string;
  children?: ReactNode;
  onClick?: (e: any) => Promise<void> | void;
}

function getColorsClassName(color: Colors, outline: boolean, disabled: boolean) {
  if (disabled) {
    return outline
      ? "text-gray-200 border-gray-200"
      : "text-gray-400 bg-gray-200";
  }
  if (outline) {
    switch (color) {
      default:
      case "gray":
        return "text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600";

      case "blue":
        return "text-blue-500 border-blue-500 hover:text-white hover:bg-blue-500";

      case "yellow":
        return "text-yellow-500 border-yellow-500 hover:text-white hover:bg-yellow-500";

      case "green":
        return "text-green-500 border-green-500 hover:text-white hover:bg-green-500";

      case "red":
        return "text-red-500 border-red-500 hover:text-white hover:bg-red-500";

      case "transparent":
        return "text-gray-600 border-gray-600 border-2 hover:text-white hover:bg-gray-600 transition";
    }
  }
  switch (color) {
    default:
    case "gray":
      return "text-white bg-gray-600 hover:bg-gray-700";

    case "blue":
      return "text-white bg-blue-500 hover:bg-blue-600";

    case "yellow":
      return "text-white bg-yellow-500 hover:bg-yellow-600";

    case "green":
      return "text-white bg-green-500 hover:bg-green-600";

    case "red":
      return "text-white bg-red-500 hover:bg-red-600";

    case "transparent":
      return "text-gray-600 border-gray-600 border-2 hover:text-white hover:bg-gray-600 transition";
  }
}

export function Button({
  outline = false,
  disabled,
  loading,
  className,
  title,
  color = "gray",
  href,
  label,
  type = "button",
  onClick,
  children
}: ButtonProps) {
  const d = disabled || loading || false;

  const colors = getColorsClassName(color, outline, d);
  const cl = `outline-none whitespace-nowrap inline-flex items-center justify-center text-sm font-extrabold px-4 py-2 shadow-sm font-medium ${d && "cursor-not-allowed"} ${colors} ${className}`;

  const child = <Loading loading={loading}>{children || label}</Loading>;

  const onClickButton = async (e: MouseEvent) => {
    if (!d && onClick) {
      await onClick(e);
    }
  };

  if (href) {
    if (d) {
      return (
        <a
          title={title}
          className={cl}
        >
          {child}
        </a>
      );
    }
    return (
      <Link href={href}>
        <a
          title={title}
          className={cl}
        >
          {child}
        </a>
      </Link>
    );
  }
  return (
    <button
      title={title}
      disabled={d}
      className={cl}
      type={type}
      onClick={onClickButton}
    >
      {child}
    </button>
  );
}
