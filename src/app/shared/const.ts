// Chart Analytics Options
export const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { labels: { color: "#94a3b8" } } },
  scales: {
    x: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(148,163,184,0.08)" },
    },
    y: {
      ticks: { color: "#94a3b8" },
      grid: { color: "rgba(148,163,184,0.08)" },
      beginAtZero: true,
    },
  },
};

// Line Chart Options
export const LINE_OPTS = {
  ...CHART_OPTS,
  elements: { line: { tension: 0.3 } },
};

export const CHART_COLORS = {
  target: "rgba(148,163,184,0.2)",
  workedBlue: "#3b82f6",
  workedGreen: "#22c55e",
  productivity: "#22c55e",
  productivityFill: "rgba(34,197,94,.1)",
};
