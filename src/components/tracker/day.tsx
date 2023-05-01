import React from "react";

interface DayProps {
  intensity: number;
  onMouseOver?: (e: React.MouseEvent<HTMLTableDataCellElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLTableDataCellElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLTableDataCellElement>) => void;
  state?: "selected" | "unselected" | "neutral";
  description?: string;
}

export default function Day({
  intensity,
  onMouseOver,
  onMouseOut,
  onClick,
  state,
  description,
}: DayProps) {
  const className = `activity-monitor intensity-${intensity} ${state ?? ""}`;
  return (
    <td className="tooltip" style={{ padding: 0 }}>
      <span
        className={className}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
      />
      {description && (
        <span className="bg-red-600 padding-4px mt-10 tooltiptext">
          {description}
        </span>
      )}
    </td>
  );
}
