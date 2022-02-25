import React from "react";
import dynamic from "next/dynamic";
import {
  getIndicationRingColor,
  Indication,
  IndicationMessage,
} from "./Indication";
import "react-quill/dist/quill.snow.css";
import { Label } from "./Label";

export const onServerSide = () => typeof window === "undefined";
export const onClientSide = () => !onServerSide();

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichInputProps {
  className?: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => any;
  indication?: IndicationMessage;
  notifyIndication?: boolean;
}

export function RichInput({
  className,
  label,
  value,
  onChange,
  indication,
  required,
  notifyIndication,
}: RichInputProps) {
  const indicationRingColor = getIndicationRingColor(indication);

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme

        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ script: "sub" }, { script: "super" }],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    clipboard: { matchVisual: false },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "size",
    "color",
    "background",
    "list",
    "script",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
  ];

  return onClientSide() ? (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <Label label={label} required={required} />
      </div>
      <ReactQuill
        className={`prose max-w-none mt-2 mb-1 min-h-96 outline-none rounded ring-1 focus:ring-blue-300 ${indicationRingColor}`}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />

      <Indication
        className="mt-1 mb-2"
        value={indication}
        notify={notifyIndication}
      />
    </div>
  ) : (
    <>
      <span className="flex items-center">
        <Label label={label} required={required} />
      </span>
      <textarea
        className={`prose outline-none mt-2 my-2 mb-3 bg-white ${indicationRingColor}`}
        value={value}
        readOnly
      />
      <Indication
        className="mt-1 mb-2"
        value={indication}
        notify={notifyIndication}
      />
    </>
  );
}
