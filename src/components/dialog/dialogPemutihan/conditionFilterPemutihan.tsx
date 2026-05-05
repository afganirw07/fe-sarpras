// components/pemutihan/ConditionFilter.tsx
"use client";

import { cn } from "@/lib/utils";

type Condition = "Baik" | "Sedang" | "Buruk";

interface ConditionFilterProps {
  value: Condition | "";
  onChange: (value: Condition | "") => void;
  className?: string;
}

const OPTIONS: { label: string; value: Condition; className: string; activeClass: string }[] = [
  {
    value: "Baik",
    label: "Baik",
    className: "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20",
    activeClass: "bg-green-100 border-green-400 dark:bg-green-900/40 dark:border-green-500",
  },
  {
    value: "Sedang",
    label: "Sedang",
    className: "border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/20",
    activeClass: "bg-yellow-100 border-yellow-400 dark:bg-yellow-900/40 dark:border-yellow-500",
  },
  {
    value: "Buruk",
    label: "Buruk",
    className: "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20",
    activeClass: "bg-red-100 border-red-400 dark:bg-red-900/40 dark:border-red-500",
  },
];

export default function ConditionFilter({ value, onChange, className }: ConditionFilterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Tombol "Semua" */}
      <button
        type="button"
        onClick={() => onChange("")}
        className={cn(
          "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
          "border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10",
          value === "" && "bg-gray-100 border-gray-400 dark:bg-white/20 dark:border-white/30"
        )}
      >
        Semua
      </button>

      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? "" : opt.value)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
            opt.className,
            value === opt.value && opt.activeClass
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}