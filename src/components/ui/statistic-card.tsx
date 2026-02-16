import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";

export interface StatisticCardProps {
  /** 标题 */
  title: string;
  /** 数值 */
  value: string | number;
  /** 数值前缀 */
  prefix?: string;
  /** 数值后缀 */
  suffix?: string;
  /** 描述文字 */
  description?: string;
  /** 趋势：up（上升）, down（下降）, neutral（无变化） */
  trend?: "up" | "down" | "neutral";
  /** 趋势值 */
  trendValue?: string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 数值颜色 */
  valueColor?: string;
  /** 数值颜色类名（如 text-green-600） */
  valueClassName?: string;
  /** 类名 */
  className?: string;
}

export function StatisticCard({
  title,
  value,
  prefix,
  suffix,
  description,
  trend,
  trendValue,
  icon,
  valueColor,
  valueClassName,
  className,
}: StatisticCardProps) {
  const valueColorStyle =
    valueColor && /^(#|rgb|hsl|var\()/i.test(valueColor)
      ? { color: valueColor }
      : undefined;
  const valueColorClass =
    valueColor && !valueColorStyle ? valueColor : "";

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 break-words leading-5">
          {title}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1 min-w-0">
          {prefix && (
            <span className="text-lg text-gray-500 shrink-0">{prefix}</span>
          )}
          <span
            className={cn(
              "text-2xl md:text-3xl font-bold leading-tight min-w-0 break-all",
              valueColorClass,
              valueClassName
            )}
            style={valueColorStyle}
          >
            {typeof value === "number"
              ? value.toLocaleString()
              : value}
          </span>
          {suffix && (
            <span className="text-lg text-gray-500 shrink-0">{suffix}</span>
          )}
        </div>
        {(description || (trend && trendValue)) && (
          <div className="mt-2 flex items-center text-sm">
            {trend && trendValue && (
              <span className={cn("mr-2 font-medium", getTrendColor())}>
                {getTrendIcon()} {trendValue}
              </span>
            )}
            {description && (
              <span className="text-gray-500 dark:text-gray-400">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export interface StatisticGridProps {
  /** 统计卡片数据 */
  items: StatisticCardProps[];
  /** 列数 */
  columns?: 1 | 2 | 3 | 4;
  /** 类名 */
  className?: string;
}

export function StatisticGrid({
  items,
  columns = 4,
  className,
}: StatisticGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {items.map((item, index) => (
        <StatisticCard key={index} {...item} />
      ))}
    </div>
  );
}
