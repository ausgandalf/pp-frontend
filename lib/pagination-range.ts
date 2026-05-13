/** Page numbers for UI pagination (1-based). Inserts `'ellipsis'` where there is a gap. */
export function getPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total < 1) return []
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const set = new Set<number>()
  set.add(1)
  set.add(total)
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) set.add(p)
  }
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | 'ellipsis')[] = []
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!
    if (i > 0 && n - sorted[i - 1]! > 1) {
      out.push('ellipsis')
    }
    out.push(n)
  }
  return out
}
