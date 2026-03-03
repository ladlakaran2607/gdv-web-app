"use client";

import { useEffect, useState } from "react";

interface ScoreBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
}

export default function ScoreBar({ value, color = "var(--color-teal)", height = 6 }: ScoreBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div
      className="rounded-full overflow-hidden"
      style={{ background: "var(--color-grey-100)", height }}
    >
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}
