import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

export interface FormulaProps {
  /** LaTeX 公式内容 */
  formula: string;
  /** 是否块级显示 */
  displayMode?: boolean;
  /** 类名 */
  className?: string;
  /** 是否抛出错误 */
  throwOnError?: boolean;
  /** 错误显示方式 */
  errorColor?: string;
}

export function Formula({
  formula,
  displayMode = false,
  className,
  throwOnError = false,
  errorColor = "#dc2626",
}: FormulaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError,
          errorColor,
          trust: true,
          strict: false,
        });
      } catch (e) {
        console.error("KaTeX render error:", e);
      }
    }
  }, [formula, displayMode, throwOnError, errorColor]);

  return (
    <div
      ref={containerRef}
      className={cn(
        displayMode ? "text-center my-4" : "inline-block",
        className
      )}
    />
  );
}

export interface FormulaBlockProps {
  /** LaTeX 公式内容 */
  formula: string;
  /** 公式标题（可选） */
  title?: string;
  /** 类名 */
  className?: string;
}

export function FormulaBlock({ formula, title, className }: FormulaBlockProps) {
  return (
    <div className={cn("my-4", className)}>
      {title && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </div>
      )}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
        <Formula formula={formula} displayMode />
      </div>
    </div>
  );
}
