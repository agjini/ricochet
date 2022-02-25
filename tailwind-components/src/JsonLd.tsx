/* eslint-disable react/prop-types */
/* eslint-disable react/no-danger */
/* eslint-disable react/react-in-jsx-scope */

import React from "react";

export const JsonLd = ({ data }: any) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

