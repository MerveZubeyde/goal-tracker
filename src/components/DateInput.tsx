"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateInputProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative w-64">
      <label htmlFor="date-input" className="sr-only">
        Select a date
      </label>
      <input
        id="date-input"
        ref={inputRef}
        type="text"
        readOnly
        aria-haspopup="dialog"
        aria-expanded={showPicker}
        aria-controls="date-picker-popup"
        className="w-full px-4 py-3 rounded-2xl border border-[var(--color-accent)] text-[var(--color-background)] cursor-pointer bg-[var(--color-primary)]"
        value={value ? value.toLocaleDateString() : ""}
        onClick={() => setShowPicker((prev) => !prev)}
        placeholder="Select a date"
        tabIndex={0}
      />
      {showPicker && (
        <div
          id="date-picker-popup"
          ref={pickerRef}
          className="absolute z-10 mt-2 date-picker-popup"
          role="dialog"
          aria-modal="true"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (date) {
                onChange(date);
                setShowPicker(false);
              }
            }}
            modifiersClassNames={{
              selected: "rdp-day_selected",
              today: "rdp-day_today",
            }}
          />
        </div>
      )}
    </div>
  );
}
