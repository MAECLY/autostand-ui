import * as React from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar, formatIsoDate, parseIsoDate } from "./calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";

export interface DatePickerProps {
  id?: string;
  /** Selected filing date, `YYYY-MM-DD`. */
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

function displayLabel(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DatePicker({
  id,
  value,
  onChange,
  disabled = false,
  className,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => {
    setDraft(value);
  }, [value]);

  function commit(next: string) {
    onChange(next);
    setOpen(false);
  }

  function commitTyped() {
    const parsed = parseIsoDate(draft.trim());
    if (parsed) commit(formatIsoDate(parsed));
  }

  return (
    <>
      <Button
        id={id}
        type="button"
        variant="outline"
        disabled={disabled}
        className={cn("justify-start font-normal", className)}
        onClick={() => setOpen(true)}
      >
        <CalendarDays />
        {value.length > 0 ? displayLabel(value) : placeholder}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Pick a date</DialogTitle>
            <DialogDescription>
              Choose a filing date from the calendar, or type `YYYY-MM-DD`.
            </DialogDescription>
          </DialogHeader>

          <Calendar
            value={value}
            onChange={commit}
          />

          <div className="space-y-2">
            <Label htmlFor={id ? `${id}-typed` : undefined}>ISO date</Label>
            <Input
              id={id ? `${id}-typed` : undefined}
              value={draft}
              spellCheck={false}
              autoComplete="off"
              placeholder="YYYY-MM-DD"
              className="font-mono"
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitTyped}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitTyped();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
