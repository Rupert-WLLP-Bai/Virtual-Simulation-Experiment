import { useEffect, useRef, useState } from "react";
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
  const [hasRenderError, setHasRenderError] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      try {
        setHasRenderError(false);
        // 自动将 * 转换为 \times 以正确显示乘号
        const processedFormula = formula.replace(/\s*\*\s*/g, " \\times ");
        katex.render(processedFormula, containerRef.current, {
          displayMode,
          throwOnError,
          errorColor,
          trust: true,
          strict: false,
        });
      } catch (e) {
        console.error("KaTeX render error:", e);
        setHasRenderError(true);
      }
    }
  }, [formula, displayMode, throwOnError, errorColor]);

  if (hasRenderError) {
    return (
      <div
        className={cn(
          displayMode ? "my-4 text-center overflow-x-auto" : "inline-block",
          className
        )}
      >
        <code className="text-sm text-red-600 break-all">{formula}</code>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        displayMode ? "text-center my-4 overflow-x-auto" : "inline-block",
        className
      )}
    />
  );
}

export interface FormulaBlockProps {
  /** LaTeX 公式内容 */
  formula?: string;
  /** 多个公式（数组形式） */
  formulas?: { label?: string; formula: string }[];
  /** 公式标题（可选） */
  title?: string;
  /** 类名 */
  className?: string;
}

export function FormulaBlock({ formula, formulas, title, className }: FormulaBlockProps) {
  const formulaList = formulas || (formula ? [{ formula }] : []);

  return (
    <div className={cn("my-4", className)}>
      {title && (
        <div className="text-sm text-gray-600 mb-2">
          {title}
        </div>
      )}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
        {formulaList.length > 0 ? (
          formulaList.map((item, index) => (
            <div key={index} className={cn(index > 0 ? "mt-3" : "", "min-w-max")}>
              {item.label && (
                <div className="text-sm text-gray-500 mb-1">{item.label}</div>
              )}
              <div className="text-center">
                <Formula formula={item.formula} displayMode />
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">公式未配置</div>
        )}
      </div>
    </div>
  );
}
