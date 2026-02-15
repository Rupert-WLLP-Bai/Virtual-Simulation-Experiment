import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface Step {
  /** 步骤标题 */
  title: string;
  /** 步骤描述（可选） */
  description?: string;
}

export interface StepsProps {
  /** 步骤数据 */
  steps: Step[];
  /** 当前步骤索引（从0开始） */
  currentStep: number;
  /** 点击步骤跳转 */
  onStepClick?: (step: number) => void;
  /** 是否允许点击跳转 */
  clickable?: boolean;
  /** 方向：horizontal 或 vertical */
  direction?: "horizontal" | "vertical";
  /** 类名 */
  className?: string;
}

export function Steps({
  steps,
  currentStep,
  onStepClick,
  clickable = false,
  direction = "horizontal",
  className,
}: StepsProps) {
  const isVertical = direction === "vertical";

  return (
    <div
      className={cn(
        "flex",
        isVertical ? "flex-col" : "flex-row items-center",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = clickable && onStepClick;

        return (
          <div
            key={index}
            className={cn(
              "flex",
              isVertical
                ? "flex-row items-start flex-1"
                : "flex-col items-center flex-1",
              isClickable && "cursor-pointer"
            )}
            onClick={() => isClickable && onStepClick?.(index)}
          >
            {/* Step indicator */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full border-2 transition-all",
                isVertical ? "w-8 h-8 mr-3 shrink-0" : "w-8 h-8 mb-2 shrink-0",
                isCompleted
                  ? "bg-green-600 border-green-600 text-white"
                  : isCurrent
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300 text-gray-300"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step content */}
            <div
              className={cn(
                isVertical ? "flex-1 pb-6" : "text-center pb-8",
                !isLast(index, steps.length) && "relative"
              )}
            >
              <div
                className={cn(
                  "font-medium",
                  isCurrent
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-400"
                )}
              >
                {step.title}
              </div>
              {step.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {step.description}
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast(index, steps.length) && (
              <div
                className={cn(
                  "absolute bg-gray-200 dark:bg-gray-700",
                  isVertical
                    ? "left-[15px] top-8 bottom-0 w-0.5 h-auto"
                    : "top-4 left-1/2 right-0 h-0.5",
                  isCompleted && "bg-green-600",
                  isVertical ? "hidden" : "block"
                )}
                style={
                  isVertical
                    ? {
                        height: "calc(100% - 32px)",
                        transform: "translateX(0)",
                      }
                    : undefined
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function isLast(index: number, length: number) {
  return index === length - 1;
}

export interface ExperimentStepsProps {
  /** 实验步骤数据 */
  steps: Step[];
  /** 当前步骤索引（从0开始） */
  currentStep: number;
  /** 上一步回调 */
  onPrev?: () => void;
  /** 下一步回调 */
  onNext?: () => void;
  /** 步骤点击回调 */
  onStepClick?: (step: number) => void;
  /** 是否显示底部导航 */
  showNavigation?: boolean;
  /** 上一步按钮文本 */
  prevText?: string;
  /** 下一步/完成按钮文本 */
  nextText?: string;
  /** 是否最后一步 */
  isLastStep?: boolean;
  /** 类名 */
  className?: string;
}

export function ExperimentSteps({
  steps,
  currentStep,
  onPrev,
  onNext,
  onStepClick,
  showNavigation = true,
  prevText = "上一步",
  nextText = "下一步",
  isLastStep = false,
  className,
}: ExperimentStepsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <Steps
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
        clickable={!!onStepClick}
      />
      {showNavigation && (
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={currentStep === 0}
          >
            {prevText}
          </Button>
          <Button onClick={onNext} disabled={currentStep >= steps.length - 1}>
            {isLastStep ? "完成" : nextText}
          </Button>
        </div>
      )}
    </div>
  );
}
