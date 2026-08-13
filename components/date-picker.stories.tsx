import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { DatePicker } from "./date-picker";

function ControlledDatePicker() {
  const [value, setValue] = useState("2026-08-03");
  return (
    <div className="flex flex-col items-start gap-3">
      <DatePicker id="story-date" value={value} onChange={setValue} />
      <p className="font-mono text-xs text-muted-foreground">{value}</p>
    </div>
  );
}

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Button + Dialog calendar for a `YYYY-MM-DD` filing date. Type an ISO date in the dialog to jump without hunting through months.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "2026-08-03",
    onChange: () => undefined,
  },
  render: () => <ControlledDatePicker />,
};
