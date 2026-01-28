import React, { useState } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    const updated = selectedOptions.includes(value)
      ? selectedOptions.filter((v) => v !== value)
      : [...selectedOptions, value];

    setSelectedOptions(updated);
    onChange?.(updated);
  };

  const removeOption = (value: string) => {
    const updated = selectedOptions.filter((v) => v !== value);
    setSelectedOptions(updated);
    onChange?.(updated);
  };

  const selectedTexts = selectedOptions
    .map((value) => options.find((o) => o.value === value)?.text)
    .filter(Boolean);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <div
          onClick={toggleDropdown}
          className="flex min-h-[44px] cursor-pointer flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 transition focus-within:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
        >
          {selectedTexts.length > 0 ? (
            selectedTexts.map((text, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-white"
              >
                {text}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(selectedOptions[idx]);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">Select option</span>
          )}

          <span className="ml-auto text-gray-500">
            <svg
              className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 7l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {isOpen && (
          <div
            className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-600 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center px-3 py-2 text-left text-sm transition hover:bg-blue-500/20 dark:hover:bg-blue-500/30 ${
                  selectedOptions.includes(option.value)
                    ? "bg-blue-500/10"
                    : ""
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
