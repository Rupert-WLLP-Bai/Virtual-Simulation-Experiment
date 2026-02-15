/**
 * COSMIC 功能点度量计算
 */

export interface CosmicEntry {
  id: string;
  name: string;
  type: "Entry" | "Exit" | "Read" | "Write";
  objects: string[];
}

export interface CosmicResult {
  entry: number;
  exit: number;
  read: number;
  write: number;
  total: number;
  fp: number; // 功能点数 (= total)
}

/**
 * 计算 COSMIC 功能点
 */
export function cosmic(entries: CosmicEntry[]): CosmicResult {
  const result: CosmicResult = { entry: 0, exit: 0, read: 0, write: 0, total: 0, fp: 0 };

  entries.forEach((e) => {
    const count = e.objects.length || 1;
    switch (e.type) {
      case "Entry":
        result.entry += count;
        break;
      case "Exit":
        result.exit += count;
        break;
      case "Read":
        result.read += count;
        break;
      case "Write":
        result.write += count;
        break;
    }
  });

  result.total = result.entry + result.exit + result.read + result.write;
  result.fp = result.total;

  return result;
}
