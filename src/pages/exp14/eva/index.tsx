import { useMemo, useState } from "react";
import { ExportPDF } from "@/components/ui/export-pdf";
import { FormulaBlock } from "@/components/ui/formula";
import { StatisticCard } from "@/components/ui/statistic-card";
import { LineChart } from "@/components/ui/chart";

interface PhaseInput {
  name: string;
  pv: number;
  ev: number;
  ac: number;
}

interface PhaseMetric extends PhaseInput {
  sv: number;
  cv: number;
  spi: number;
  cpi: number;
  cumulativePv: number;
  cumulativeEv: number;
  cumulativeAc: number;
}

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

export default function EvaPage() {
  const [phases, setPhases] = useState<PhaseInput[]>([
    { name: "需求与立项", pv: 120, ev: 110, ac: 130 },
    { name: "设计与开发", pv: 260, ev: 240, ac: 280 },
    { name: "测试与修复", pv: 180, ev: 170, ac: 175 },
    { name: "部署与验收", pv: 90, ev: 95, ac: 88 },
  ]);

  const updatePhase = (index: number, field: keyof PhaseInput, value: string | number) => {
    setPhases((prev) =>
      prev.map((phase, i) =>
        i === index
          ? {
              ...phase,
              [field]: field === "name" ? String(value) : Number(value),
            }
          : phase
      )
    );
  };

  const addPhase = () => {
    setPhases((prev) => [...prev, { name: `阶段${prev.length + 1}`, pv: 0, ev: 0, ac: 0 }]);
  };

  const removePhase = (index: number) => {
    setPhases((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const phaseMetrics = useMemo<PhaseMetric[]>(() => {
    let cumulativePv = 0;
    let cumulativeEv = 0;
    let cumulativeAc = 0;

    return phases.map((phase) => {
      cumulativePv += phase.pv;
      cumulativeEv += phase.ev;
      cumulativeAc += phase.ac;

      const sv = phase.ev - phase.pv;
      const cv = phase.ev - phase.ac;
      const spi = safeDivide(phase.ev, phase.pv);
      const cpi = safeDivide(phase.ev, phase.ac);

      return {
        ...phase,
        sv,
        cv,
        spi,
        cpi,
        cumulativePv,
        cumulativeEv,
        cumulativeAc,
      };
    });
  }, [phases]);

  const totals = useMemo(() => {
    const totalPv = phaseMetrics.reduce((sum, row) => sum + row.pv, 0);
    const totalEv = phaseMetrics.reduce((sum, row) => sum + row.ev, 0);
    const totalAc = phaseMetrics.reduce((sum, row) => sum + row.ac, 0);

    const totalSv = totalEv - totalPv;
    const totalCv = totalEv - totalAc;
    const totalSpi = safeDivide(totalEv, totalPv);
    const totalCpi = safeDivide(totalEv, totalAc);

    const bac = totalPv;
    const eac = totalCpi === 0 ? Number.POSITIVE_INFINITY : bac / totalCpi;
    const etc = Number.isFinite(eac) ? eac - totalAc : Number.POSITIVE_INFINITY;
    const vac = Number.isFinite(eac) ? bac - eac : Number.NEGATIVE_INFINITY;

    return {
      totalPv,
      totalEv,
      totalAc,
      totalSv,
      totalCv,
      totalSpi,
      totalCpi,
      bac,
      eac,
      etc,
      vac,
    };
  }, [phaseMetrics]);

  const conclusion = useMemo(() => {
    const schedule = totals.totalSpi >= 1 ? "进度总体可控" : "进度存在滞后";
    const cost = totals.totalCpi >= 1 ? "成本控制较好" : "成本存在超支风险";
    return `${schedule}，${cost}。`;
  }, [totals.totalSpi, totals.totalCpi]);

  return (
    <div className="p-6 bg-white rounded-lg shadow" id="experiment-content">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">EVA 挣值分析</h1>
          <ExportPDF targetId="experiment-content" filename="EVA挣值分析.pdf" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <FormulaBlock
            formulas={[
              { label: "进度偏差", formula: String.raw`SV=EV-PV` },
              { label: "成本偏差", formula: String.raw`CV=EV-AC` },
              { label: "进度绩效指数", formula: String.raw`SPI=\frac{EV}{PV}` },
              { label: "成本绩效指数", formula: String.raw`CPI=\frac{EV}{AC}` },
              { label: "完工估算", formula: String.raw`EAC=\frac{BAC}{CPI}` },
            ]}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">阶段输入</h2>
            <button onClick={addPhase} className="px-3 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">
              + 添加阶段
            </button>
          </div>

          <table className="w-full min-w-[860px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">阶段</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">PV（计划值）</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">EV（挣值）</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">AC（实际成本）</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase, index) => (
                <tr key={`${phase.name}-${index}`} className="border-t border-gray-200">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={phase.name}
                      onChange={(e) => updatePhase(index, "name", e.target.value)}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={phase.pv}
                      onChange={(e) => updatePhase(index, "pv", e.target.value)}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={phase.ev}
                      onChange={(e) => updatePhase(index, "ev", e.target.value)}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={phase.ac}
                      onChange={(e) => updatePhase(index, "ac", e.target.value)}
                      className="w-full px-3 py-2 exp-input"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => removePhase(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={phases.length <= 1}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">阶段指标</h2>
          <table className="w-full min-w-[980px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm text-gray-700">阶段</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">SV</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">CV</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">SPI</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">CPI</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">累计 PV</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">累计 EV</th>
                <th className="px-3 py-2 text-left text-sm text-gray-700">累计 AC</th>
              </tr>
            </thead>
            <tbody>
              {phaseMetrics.map((row, index) => (
                <tr key={`${row.name}-${index}`} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-sm text-gray-800">{row.name}</td>
                  <td className={`px-3 py-2 text-sm font-medium ${row.sv >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {row.sv.toFixed(2)}
                  </td>
                  <td className={`px-3 py-2 text-sm font-medium ${row.cv >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {row.cv.toFixed(2)}
                  </td>
                  <td className={`px-3 py-2 text-sm font-medium ${row.spi >= 1 ? "text-green-600" : "text-amber-600"}`}>
                    {row.spi.toFixed(3)}
                  </td>
                  <td className={`px-3 py-2 text-sm font-medium ${row.cpi >= 1 ? "text-green-600" : "text-amber-600"}`}>
                    {row.cpi.toFixed(3)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700">{row.cumulativePv.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{row.cumulativeEv.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{row.cumulativeAc.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="总 PV(BAC)" value={totals.totalPv.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="总 EV" value={totals.totalEv.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="总 AC" value={totals.totalAc.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="结论" value={conclusion} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatisticCard title="总 SV" value={totals.totalSv.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="总 CV" value={totals.totalCv.toFixed(2)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="SPI" value={totals.totalSpi.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="CPI" value={totals.totalCpi.toFixed(3)} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatisticCard title="EAC" value={Number.isFinite(totals.eac) ? totals.eac.toFixed(2) : "∞"} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="ETC" value={Number.isFinite(totals.etc) ? totals.etc.toFixed(2) : "∞"} className="border border-gray-200 rounded-lg p-4" />
          <StatisticCard title="VAC" value={Number.isFinite(totals.vac) ? totals.vac.toFixed(2) : "-"} className="border border-gray-200 rounded-lg p-4" />
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">累计 PV/EV/AC 趋势</h2>
          <LineChart
            title=""
            xAxisData={phaseMetrics.map((row) => row.name)}
            series={[
              { name: "累计 PV", data: phaseMetrics.map((row) => Math.round(row.cumulativePv * 100) / 100), color: "#2563eb" },
              { name: "累计 EV", data: phaseMetrics.map((row) => Math.round(row.cumulativeEv * 100) / 100), color: "#16a34a" },
              { name: "累计 AC", data: phaseMetrics.map((row) => Math.round(row.cumulativeAc * 100) / 100), color: "#dc2626" },
            ]}
            height={340}
          />
        </div>
      </div>
    </div>
  );
}
