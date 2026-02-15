import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { cn } from "@/lib/utils";

export interface LineChartProps {
  /** 图表标题 */
  title?: string;
  /** X轴数据 */
  xAxisData: string[];
  /** Y轴数据系列 */
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  /** 图表宽度 */
  width?: string | number;
  /** 图表高度 */
  height?: string | number;
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 是否显示图例 */
  showLegend?: boolean;
  /** 是否显示tooltip */
  showTooltip?: boolean;
  /** 类名 */
  className?: string;
  /** 是否平滑曲线 */
  smooth?: boolean;
}

export function LineChart({
  title,
  xAxisData,
  series,
  width = "100%",
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  smooth = false,
}: LineChartProps) {
  const option: EChartsOption = {
    title: title
      ? {
          text: title,
          left: "center",
        }
      : undefined,
    tooltip: showTooltip
      ? {
          trigger: "axis",
        }
      : undefined,
    legend: showLegend
      ? {
          data: series.map((s) => s.name),
          top: title ? 35 : 10,
        }
      : undefined,
    grid: showGrid
      ? {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        }
      : undefined,
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
    },
    yAxis: {
      type: "value",
    },
    series: series.map((s) => ({
      name: s.name,
      type: "line",
      data: s.data,
      smooth,
      itemStyle: s.color ? { color: s.color } : undefined,
      areaStyle: s.color
        ? {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: s.color + "40" },
                { offset: 1, color: s.color + "10" },
              ],
            },
          }
        : undefined,
    })),
  };

  return (
    <ReactECharts
      option={option}
      style={{ width, height }}
      className={cn(className)}
    />
  );
}

export interface BarChartProps {
  /** 图表标题 */
  title?: string;
  /** X轴数据 */
  xAxisData: string[];
  /** Y轴数据系列 */
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  /** 图表宽度 */
  width?: string | number;
  /** 图表高度 */
  height?: string | number;
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 是否显示图例 */
  showLegend?: boolean;
  /** 是否显示tooltip */
  showTooltip?: boolean;
  /** 类名 */
  className?: string;
  /** 是否水平柱状图 */
  horizontal?: boolean;
}

export function BarChart({
  title,
  xAxisData,
  series,
  width = "100%",
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  horizontal = false,
}: BarChartProps) {
  const option: EChartsOption = {
    title: title
      ? {
          text: title,
          left: "center",
        }
      : undefined,
    tooltip: showTooltip
      ? {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        }
      : undefined,
    legend: showLegend
      ? {
          data: series.map((s) => s.name),
          top: title ? 35 : 10,
        }
      : undefined,
    grid: showGrid
      ? {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        }
      : undefined,
    xAxis: horizontal
      ? {
          type: "value",
        }
      : {
          type: "category",
          data: xAxisData,
        },
    yAxis: horizontal
      ? {
          type: "category",
          data: xAxisData,
        }
      : {
          type: "value",
        },
    series: series.map((s) => ({
      name: s.name,
      type: "bar",
      data: horizontal ? s.data : s.data,
      itemStyle: s.color ? { color: s.color } : undefined,
    })),
  };

  return (
    <ReactECharts
      option={option}
      style={{ width, height }}
      className={cn(className)}
    />
  );
}

export interface TornadoChartProps {
  /** 图表标题 */
  title?: string;
  /** 图表宽度 */
  width?: string | number;
  /** 图表高度 */
  height?: string | number;
  /** X轴类别 */
  categories: string[];
  /** 数据系列 - 正值和负值 */
  series: {
    name: string;
    positive: number[];
    negative: number[];
    color?: string;
  }[];
  /** 类名 */
  className?: string;
}

export function TornadoChart({
  title,
  width = "100%",
  height = 400,
  categories,
  series,
  className,
}: TornadoChartProps) {
  // Calculate the maximum absolute value for symmetric bars
  const allValues = series.flatMap((s) => [...s.positive, ...s.negative]);
  const maxAbs = Math.max(...allValues.map(Math.abs));

  const option: EChartsOption = {
    title: title
      ? {
          text: title,
          left: "center",
        }
      : undefined,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: unknown) => {
        const items = params as Array<{ seriesName: string; value: number; color: string }>;
        let result = "";
        items.forEach((item) => {
          if (item.value !== 0) {
            result += `${item.seriesName}: ${Math.abs(item.value)}<br/>`;
          }
        });
        return result;
      },
    },
    legend: {
      data: series.map((s) => s.name),
      top: title ? 35 : 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      max: maxAbs,
      min: -maxAbs,
    },
    yAxis: {
      type: "category",
      data: categories,
    },
    series: series.flatMap((s) => [
      {
        name: s.name,
        type: "bar",
        stack: "total",
        data: s.positive,
        itemStyle: {
          color: s.color || "#3b82f6",
        },
      },
      {
        name: s.name,
        type: "bar",
        stack: "total",
        data: s.negative.map((v) => -v),
        itemStyle: {
          color: s.color ? s.color + "80" : "#3b82f680",
        },
      },
    ]),
  };

  return (
    <ReactECharts
      option={option}
      style={{ width, height }}
      className={cn(className)}
    />
  );
}
