/** "104 phút" -> "1 giờ 44 phút"; "45 phút" -> "45 phút" */
export function formatMovieTimeToHoursMinutes(timeStr: string): string {
  const match = /(\d+)\s*phút/i.exec(String(timeStr));
  const totalMins = match ? Number.parseInt(match[1], 10) : 0;
  if (totalMins < 60) return totalMins ? `${totalMins} phút` : timeStr;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}
