export function fmt(n: number, dec = 2): number {
  return +n.toFixed(dec);
}

export function fmtDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
