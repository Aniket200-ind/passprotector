//! src/components/features/PasswordCategoryChart.tsx

"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface PasswordCategoryChartProps {
  data: CategoryData[];
}

export function PasswordCategoryChart({ data }: PasswordCategoryChartProps) {
  return (
    <ChartContainer
      config={data.reduce((acc, item) => {
        acc[item.name.toLowerCase()] = {
          label: item.name,
          color: item.color,
        };
        return acc;
      }, {} as Record<string, { label: string; color: string }>)}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            // @ts-expect-error - Recharts supports function radius but types don't reflect this
            outerRadius={({ width, height }) => Math.min(width, height) * 0.35}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                style={{ filter: "url(#glow)" }}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
