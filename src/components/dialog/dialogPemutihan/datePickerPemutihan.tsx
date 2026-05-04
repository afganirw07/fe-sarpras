"use client";

import React, { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerTanggalSuratProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  className?: string;
}

export default function DatePickerTanggalSurat({
  value,
  onChange,
  label = "Tanggal Surat",
  className,
}: DatePickerTanggalSuratProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Tutup kalender saat klik di luar ──────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // ── Tutup kalender saat tekan Escape ─────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCalendar(false);
    };
    if (showCalendar) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showCalendar]);

  const formattedDate = value
    ? value.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200/70 bg-gray-50/50 p-4",
        "dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      {/* Label section */}
      <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </p>

      {/* Trigger + Calendar wrapper */}
      <div ref={wrapperRef} className="relative w-fit">

        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setShowCalendar((prev) => !prev)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all",
            "hover:border-blue-400 hover:ring-4 hover:ring-blue-500/10",
            "focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
            "dark:border-white/10 dark:bg-white/5 dark:text-white",
            showCalendar && "border-blue-500 ring-4 ring-blue-500/10"
          )}
        >
          <CalendarIcon
            size={15}
            className={cn(
              "shrink-0 transition-colors",
              showCalendar ? "text-blue-500" : "text-gray-400"
            )}
          />
          {formattedDate ? (
            <span className="font-medium text-gray-800 dark:text-white">
              {formattedDate}
            </span>
          ) : (
            <span className="text-gray-400">Pilih tanggal surat</span>
          )}
        </button>

        {/* Calendar dropdown */}
        {showCalendar && (
          <div
            className={cn(
              "absolute left-0 top-full z-50 mt-2",
              "rounded-xl border border-gray-200 bg-white shadow-lg",
              "dark:border-white/10 dark:bg-black"
            )}
          >
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                if (date) {
                  onChange(date);
                  setShowCalendar(false);
                }
              }}
              initialFocus
              className="rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}