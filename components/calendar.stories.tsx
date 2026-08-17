import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Calendar } from "./calendar";

function ControlledCalendar() {
  const [value, setValue] = useState("2026-08-03");
  return (
    <div className="space-y-3">
      <Calendar value={value} onChange={setValue} />
      <p className="font-mono text-xs text-muted-foreground">{value}</p>
    </div>
  );
}

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Monday-start month grid. `value` / `onChange` use local `YYYY-MM-DD` filing dates — never UTC midnight.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "2026-08-03",
    onChange: () => undefined,
  },
  render: () => <ControlledCalendar />,
};
