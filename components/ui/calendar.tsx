import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  mode?: "single";
}

export function Calendar({ selected, onSelect, mode = "single" }: CalendarProps) {
  return (
    <div className="rounded-md border p-2 bg-white">
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        modifiersClassNames={{
          selected: "bg-blue-500 text-white",
          today: "font-bold underline",
        }}
      />
    </div>
  );
}
