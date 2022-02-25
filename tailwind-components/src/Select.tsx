import React, { Fragment, ReactNode } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  getIndicationRingColor,
  Indication,
  IndicationMessage,
} from "./Indication";
import { Arrow } from "./Arrow";
import { Label } from "./Label";

interface SelectProps<T, K> {
  label?: string;
  icon?: ReactNode;
  inline?: boolean;
  className?: string;
  placeholder?: string;
  required?: boolean;
  options: T[];
  value?: K;
  keyExtract?: string | ((o: T) => K);
  render?: string | ((o: T) => ReactNode);
  onChange?: (value: K) => any;
  indication?: IndicationMessage;
  notifyIndication?: boolean;
}

function renderOption(
  o: any,
  render: string | ((o: any) => ReactNode)
): ReactNode {
  if (typeof render === "string") {
    return o[render];
  }
  return render(o);
}

function getValue(o: any, keyExtract?: string | ((o: any) => any)): any {
  if (!keyExtract) {
    return o;
  }

  if (typeof keyExtract === "string") {
    return o[keyExtract];
  }
  return keyExtract(o);
}

export function Select<T, K>({
  className = "",
  inline,
  icon,
  required,
  placeholder,
  label,
  options,
  value,
  onChange,
  indication,
  render = "label",
  keyExtract,
  notifyIndication,
}: SelectProps<T, K>) {
  const indicationRingColor = getIndicationRingColor(indication);

  const focusClass = "ring-1 focus:ring-blue-300";

  const effectivePlaceholder = (
    <span className="text-gray-400">{placeholder || "vide"}</span>
  );

  const selectedOption = keyExtract
    ? options.find((o) => getValue(o, keyExtract) === value)
    : value;

  return (
    <div
      className={`flex ${inline ? "items-center" : "flex-col"} ${className}`}
    >
      <Label className="mr-3" required={required} label={label} />
      <Listbox value={value} onChange={(v) => onChange && v && onChange(v)}>
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button
                className={`cursor-pointer relative w-full pl-3 pr-10 text-left bg-white rounded ring-1 p-2 mt-2 mb-1 focus:outline-none ${focusClass} sm:text-sm ${indicationRingColor}`}
              >
                <span className="block truncate text-gray-700">
                  {icon}
                  {selectedOption
                    ? renderOption(selectedOption, render)
                    : effectivePlaceholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Arrow className="w-5 h-5 text-gray-500" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="z-10 absolute bottom-12 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {options.map((option, optionIndex) => (
                    <Listbox.Option
                      key={optionIndex}
                      className={({ active }) => `${
                        active
                          ? "text-yellow-900 bg-yellow-100"
                          : "text-gray-900"
                      }
                          cursor-default select-none relative py-2 pl-7`}
                      value={getValue(option, keyExtract)}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-bold" : "font-normal"
                            } text-gray-700 block truncate`}
                          >
                            {renderOption(option, render)}
                          </span>
                          {selected ? (
                            <span
                              className={`${
                                active ? "text-yellow-600" : "text-yellow-600"
                              }
                                absolute font-bold inset-y-0 left-0 flex items-center pl-2`}
                            >
                              <i className="mdi mdi-check" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      <Indication
        className="mt-1 mb-2"
        value={indication}
        notify={notifyIndication}
      />
    </div>
  );
}
