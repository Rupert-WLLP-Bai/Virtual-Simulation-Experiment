import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ExportPDFProps {
  /** 要导出为PDF的DOM元素的ID */
  targetId: string;
  /** 导出按钮文本 */
  label?: string;
  /** PDF 文件名 */
  filename?: string;
  /** PDF 方向：portrait 或 landscape */
  orientation?: "portrait" | "landscape";
  /** PDF 页面大小 */
  pageSize?: "a4" | "letter";
  /** 是否显示为下拉菜单 */
  dropdown?: boolean;
  /** 自定义按钮变体 */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** 自定义按钮尺寸 */
  size?: "default" | "sm" | "lg" | "icon";
  /** 类名 */
  className?: string;
  /** 导出成功回调 */
  onSuccess?: (blob: Blob) => void;
  /** 导出失败回调 */
  onError?: (error: Error) => void;
  /** 自定义缩放比例 */
  scale?: number;
}

export function ExportPDF({
  targetId,
  label = "导出 PDF",
  filename = "export",
  orientation = "portrait",
  pageSize = "a4",
  dropdown = false,
  variant = "default",
  size = "default",
  className,
  onSuccess,
  onError,
  scale = 2,
}: ExportPDFProps) {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: "pdf" | "png" = "pdf") => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      const error = new Error(`Target element with id "${targetId}" not found`);
      onError?.(error);
      return;
    }

    setLoading(true);
    try {
      const canvas = await html2canvas(targetElement, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      if (format === "png") {
        // Export as PNG
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        // Export as PDF
        const imgWidth = pageSize === "a4" ? 210 : 215.9;
        const pageHeight = pageSize === "a4" ? 297 : 279.4;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF({
          orientation,
          unit: "mm",
          format: pageSize,
        });

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;

        // Add more pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
          );
          heightLeft -= pageHeight;
        }

        pdf.save(`${filename}.pdf`);
      }

      setShowDropdown(false);
    } catch (error) {
      console.error("Export failed:", error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (dropdown) {
    return (
      <div className={cn("relative", className)} ref={dropdownRef}>
        <Button
          variant={variant}
          size={size}
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <FileDown />}
          {label}
        </Button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border z-50">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
              onClick={() => handleExport("pdf")}
              disabled={loading}
            >
              导出为 PDF
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-md"
              onClick={() => handleExport("png")}
              disabled={loading}
            >
              导出为 PNG
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => handleExport("pdf")}
      disabled={loading}
      className={className}
    >
      {loading ? <Loader2 className="animate-spin" /> : <FileDown />}
      {label}
    </Button>
  );
}
