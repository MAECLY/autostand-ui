import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./button";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** Parse `YYYY-MM-DD` as a local calendar date (not UTC midnight). */
export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatIsoDate(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

/** Monday-start grid covering the month, padded to full weeks. */
function monthCells(month: Date): Date[] {
  const first = startOfMonth(month);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    const cell = new Date(start);
    cell.setDate(start.getDate() + i);
    cells.push(cell);
  }
  return cells;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export interface CalendarProps {
  /** Selected filing date, `YYYY-MM-DD`. */
  value: string;
  onChange: (iso: string) => void;
  className?: string;
}

export function Calendar({ value, onChange, className }: CalendarProps) {
  const selected = parseIsoDate(value) ?? new Date();
  const [visible, setVisible] = React.useState(() => startOfMonth(selected));
  const today = new Date();
  const cells = monthCells(visible);

  return (
    <div className={cn("w-[17.5rem] space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 px-0"
          aria-label="Previous month"
          onClick={() => setVisible((current) => addMonths(current, -1))}
        >
          <ChevronLeft />
        </Button>
        <p className="text-sm font-medium text-foreground">
          {visible.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 px-0"
          aria-label="Next month"
          onClick={() => setVisible((current) => addMonths(current, 1))}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day) => {
          const iso = formatIsoDate(day);
          const inMonth = day.getMonth() === visible.getMonth();
          const isSelected = sameDay(day, selected);
          const isToday = sameDay(day, today);

          return (
            <button
              key={iso}
              type="button"
              aria-current={isSelected ? "true" : undefined}
              aria-label={iso}
              onClick={() => onChange(iso)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md text-xs transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                inMonth ? "text-foreground" : "text-muted-foreground",
                isSelected && "bg-secondary font-medium",
                !isSelected && "hover:bg-elevated",
                isToday && !isSelected && "ring-1 ring-border",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
