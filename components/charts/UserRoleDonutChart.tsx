"use client";

import { memo, useMemo } from "react";
import ReactECharts from "echarts-for-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

/**
 * Hoisted fallback data - avoids recreation on each render
 * @see rerender-memo-with-default-value
 */
const FALLBACK_DATA = [
  { name: "Admin", value: 0 },
  { name: "Editor", value: 0 },
  { name: "Viewer", value: 0 },
];

export interface UserRoleDonutChartProps {
  /** Dynamic data: users aggregated by role. When provided, chart uses real data. */
  data?: { name: string; value: number }[];
}

/**
 * Donut chart: users by role (dynamic from API or fallback).
 * @see rerender-memo - Wrapped in memo to prevent unnecessary re-renders
 */
export const UserRoleDonutChart = memo(function UserRoleDonutChart({ data }: UserRoleDonutChartProps) {
  // Memoize chart data transformation to avoid recalculation on parent re-renders
  const chartData = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((d, i) => ({ ...d, itemStyle: { color: COLORS[i % COLORS.length] } }));
    }
    return FALLBACK_DATA.map((d, i) => ({
      ...d,
      itemStyle: { color: COLORS[i] },
    }));
  }, [data]);

  // Memoize option object to prevent ECharts from re-rendering unnecessarily
  const option = useMemo(() => ({
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e2e8f0",
      textStyle: { color: "#334155" },
    },
    legend: {
      orient: "vertical",
      right: "8%",
      top: "center",
      textStyle: { color: "#64748b" },
      itemGap: 12,
    },
    series: [
      {
        name: "Users by role",
        type: "pie",
        radius: ["45%", "70%"],
        center: ["40%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: false },
          itemStyle: { scale: true },
        },
        data: chartData,
      },
    ],
  }), [chartData]);

  return (
    <ReactECharts
      option={option}
      style={{ height: 280, width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge
    />
  );
});
