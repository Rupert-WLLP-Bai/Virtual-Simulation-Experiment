# 迁移 Review 通过门禁（Gate）

## 1. 适用范围
- 适用于 `docs/migration/02-task-breakdown.md` 中所有 `INF-*`、`EXP-*`、`INT-*` 任务。
- 每个子agent提交都必须经过本 Gate，自测通过后才可进入主集成分支。

## 2. 阻断规则（Blocking）
- `P0`：数据错误、功能不可用、页面崩溃、路由不可达、导出不可读、严重安全问题。
- `P1`：核心流程受损、明显错误结果、菜单挂载错误导致无法操作。
- 只要存在 `P0/P1`，一律 **不通过**。

## 3. 必过检查项（Hard Gate Checklist）
1. 构建通过：
   - `bun run build` 必须成功。
2. 测试通过：
   - `bun test --bail` 必须成功。
3. 路由可达：
   - 该任务涉及的实验页可从侧栏进入，禁止出现 404。
4. 菜单与数据一致：
   - `src/db/index.ts` 的 `experiments` 数据与页面路由映射一致（名称、path、module_id）。
5. 表单可用性：
   - 输入框、下拉框可见可输入；文字与背景对比清晰；禁用“白底白字”。
6. 导出可读性：
   - `ExportPDF` 导出内容无白字白底、无关键内容丢失。
7. 静态资源有效：
   - logo/图片/文件链接不允许 404 或回退成 `index.html`。
8. 计算正确性：
   - 新增或改动算法必须有最少 1 组可复核样例（输入->输出）与预期一致。
9. 无调试残留：
   - 不允许遗留临时 `console.log`、mock 占位文案、空实现按钮。

## 4. 软性通过条件（Soft Gate）
- `P2`：允许带票通过，但单任务最多 2 条，且必须附修复计划。
- `P3`：可记录为优化项，不阻断合并。

## 5. 子agent提交必须附带证据（Review Evidence）
- 改动文件清单（按任务ID归类）。
- 执行命令与结果：
  - `bun run build`
  - `bun test --bail`
- 功能核对结果：
  - 路由路径
  - 菜单入口位置
  - 关键输入/输出示例
  - PDF 导出截图或说明（至少说明目标元素ID与导出文件名）
- 风险与未决项：
  - 未迁移能力
  - 假设条件
  - 后续任务依赖

## 6. 最终通过判定（Pass/Fail）
- **Pass**：Hard Gate 全部通过，且无 `P0/P1`。
- **Conditional Pass**：Hard Gate 通过，存在 `P2` 且已建跟踪项。
- **Fail**：任一 Hard Gate 失败，或存在 `P0/P1` 未关闭。

## 7. 建议在编排器中实现的自动化关卡
1. Task-Level Gate（每个子agent分支）：
   - build + test + 任务自检模板。
2. Wave-Level Gate（每个并行批次结束）：
   - 关键路由冒烟 + 菜单一致性校验。
3. Integration Gate（INT-01 之后）：
   - 全量实验可达性 + 导出抽检 + 算法抽检。
4. Release Gate（INT-04 前）：
   - 无 `P0/P1`，`P2` 有跟踪，输出发布说明。
