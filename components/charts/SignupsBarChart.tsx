"use client";

import { memo } from "react";
import ReactECharts from "echarts-for-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const SIGNUPS = [120, 132, 101, 134, 90, 230];

/**
 * Hoisted chart option - avoids recreation on each render
 * @see rendering-hoist-jsx - Extract static JSX/config outside components
 */
const CHART_OPTION = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#e2e8f0",
    textStyle: { color: "#334155" },
  },
  grid: { left: "3%", right: "4%", bottom: "3%", top: "15%", containLabel: true },
  xAxis: {
    type: "category",
    data: MONTHS,
    axisLine: { lineStyle: { color: "#e2e8f0" } },
    axisLabel: { color: "#64748b" },
  },
  yAxis: {
    type: "value",
    axisLine: { show: false },
    splitLine: { lineStyle: { color: "#f1f5f9" } },
    axisLabel: { color: "#64748b" },
  },
  series: [
    {
      name: "Signups",
      type: "bar",
      data: SIGNUPS,
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#6366f1" },
            { offset: 1, color: "#8b5cf6" },
          ],
        },
      },
      barWidth: "50%",
    },
  ],
} as const;

/**
 * Bar chart: new signups by month.
 * Suited for portfolio — shows comparison and bar styling.
 * @see rerender-memo - Wrapped in memo to prevent unnecessary re-renders
 */
export const SignupsBarChart = memo(function SignupsBarChart() {
  return (
    <ReactECharts
      option={CHART_OPTION}
      style={{ height: 280, width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge
    />
  );
});
