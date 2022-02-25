/* eslint-disable react/no-danger */
import React from "react";

interface HtmlProps {
  body: string;
  className?: string;
}

export const Html = ({ body, className }: HtmlProps) => (
  <div
    className={`prose ${className}`}
    dangerouslySetInnerHTML={{ __html: body }}
  />
);
