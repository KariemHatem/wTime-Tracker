export function formatMinutes(n?: number | null): string {
  const v = n ?? 0;
  const h = Math.floor(v / 60),
    m = v % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatDateForApi(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}
