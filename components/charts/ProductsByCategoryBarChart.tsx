"use client";

import ReactECharts from "echarts-for-react";

export interface ProductsByCategoryBarChartProps {
  /** Dynamic data: { category name, count }. When empty, shows placeholder. */
  data: { name: string; value: number }[];
}

/**
 * Bar chart: products count by category (dynamic from API).
 */
export function ProductsByCategoryBarChart({ data }: ProductsByCategoryBarChartProps) {
  const hasData = data.length > 0;
  const categories = hasData ? data.map((d) => d.name) : ["No data"];
  const values = hasData ? data.map((d) => d.value) : [0];

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e2e8f0",
      textStyle: { color: "#334155" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
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
        name: "Products",
        type: "bar",
        data: values,
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
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 280, width: "100%" }}
      opts={{ renderer: "canvas" }}
      notMerge
    />
  );
}
