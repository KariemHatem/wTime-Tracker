import { ChartData } from "chart.js";
import { CHART_COLORS } from "../const";

const chartColors = CHART_COLORS;

// Build Bar
export function buildBarData(
  labels: string[],
  targetMinutes: number[],
  workedMinutes: number[],
  workedColor: string,
): ChartData<"bar"> {
  return {
    labels,
    datasets: [
      {
        label: "Target (h)",
        data: targetMinutes,
        backgroundColor: chartColors.target,
      },
      {
        label: "Worked (h)",
        data: workedMinutes,
        backgroundColor: workedColor,
      },
    ],
  };
}
