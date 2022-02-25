import React from "react";
import {DateTime} from "luxon";
import {
  getIndicationRingColor,
  Indication,
  IndicationMessage,
} from "./Indication";
import { Label } from "./Label";

type InputType =
  | "textarea"
  | "number"
  | "text"
  | "password"
  | "date"
  | "email"
  | "file"
  | "checkbox";

type ValueOf<T extends InputType> = T extends "checkbox"
  ? boolean
  : T extends "date"
  ? Date
  : T extends "number"
  ? number
  : string;

interface TextInputProps<T extends InputType> {
  className?: string;
  label?: string;
  name?: string;
  title?: string;
  iconLeft?: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  type: T;
  value?: ValueOf<T>;
  onChange?: (value: ValueOf<T>) => any;
  indication?: IndicationMessage;
  notifyIndication?: boolean;
  autoComplete?: "off" | "new-password";
  validateOnBlur?: boolean;
}

function parseDateTime(date: DateTime | Date | string | number): DateTime {
  if (date instanceof DateTime) {
    return date;
  }
  if (date instanceof Date) {
    return DateTime.fromJSDate(date);
  }
  if (typeof(date) === "string") {
    return DateTime.fromISO(date);
  }
  return DateTime.fromMillis(date);
}

export function TextInput<T extends InputType>({
  placeholder,
  className,
  name,
  label,
  title,
  type,
  value,
  onChange,
  indication,
  notifyIndication,
  required,
  multiple,
  disabled,
  iconLeft,
  autoComplete,
  validateOnBlur = false,
}: TextInputProps<T>) {
  const indicationRingColor = getIndicationRingColor(indication);

  const v =
    type === "date"
      ? parseDateTime(value as string).toFormat("yyyy-MM-dd", {locale:"fr"})
      : (value as string);

  const onChangeEvent = (e: any) => {
    if (onChange) {
      if (type === "checkbox") {
        onChange(e.target.checked);
      } else {
        onChange(e.target.value);
      }
    }
  };

  const inputClass = `outline-none rounded ${indicationRingColor} ring-1 focus:ring-blue-300 p-2 mt-2 mb-1 bg-white text-sm ${
    type !== "checkbox" && "w-full"
  }`;

  return (
    <div className={`flex ${type !== "checkbox" && "flex-col"} ${className}`}>
      <Label label={label} required={required} error={!!indication} />
      <div className={`relative ${type === "checkbox" && "ml-4"}`}>
        {type === "textarea" ? (
          <textarea
            title={title}
            name={name}
            placeholder={placeholder}
            className={`w-full ${iconLeft && "pl-11"} ${inputClass}`}
            defaultValue={v}
            onChange={(s) => {
              if (!validateOnBlur) {
                onChangeEvent(s);
              }
            }}
            onBlur={(s) => {
              if (validateOnBlur) {
                onChangeEvent(s);
              }
            }}
            disabled={disabled}
          />
        ) : (
          <input
            title={title}
            name={name}
            placeholder={placeholder}
            className={`${iconLeft && "pl-11"} ${inputClass}`}
            multiple={multiple}
            type={type}
            defaultValue={v}
            disabled={disabled}
            autoComplete={autoComplete}
            onChange={(s) => {
              if (!validateOnBlur) {
                onChangeEvent(s);
              }
            }}
            onBlur={(s) => {
              if (validateOnBlur) {
                onChangeEvent(s);
              }
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter" && validateOnBlur) {
                event.preventDefault();
                onChangeEvent(event);
              }
            }}
          />
        )}
        {iconLeft && (
          <div className="overflow-hidden absolute text-2xl top-0 py-3 px-3 text-gray-400">
            <i className={`mdi mdi-${iconLeft}`} />
          </div>
        )}
      </div>
      <Indication
        className="mt-1 mb-2"
        value={indication}
        notify={notifyIndication}
      />
    </div>
  );
}
