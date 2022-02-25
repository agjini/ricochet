import React, { memo } from "react";

interface DateTextProps {
  className?: string;
  value?: string | number | Date;
}

export function DateTextComponent({ className, value }: DateTextProps) {
  return <span className={className}>{Intl.DateTimeFormat("fr").format(value ? new Date(value) : new Date())}</span>;
}

export const DateText = memo(DateTextComponent);
