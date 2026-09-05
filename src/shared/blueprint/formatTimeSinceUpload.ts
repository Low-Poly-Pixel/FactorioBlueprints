const SECOND_MS = 1000
const MINUTE_MS = 60 * SECOND_MS
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

const pluralize = (value: number, unit: string): string =>
  `${value} ${unit}${value === 1 ? '' : 's'}`

export const formatTimeSinceUpload = (uploadedAtMs: number): string => {
  const diffMs = Math.max(Date.now() - uploadedAtMs, 0)

  if (diffMs < MINUTE_MS)
    return pluralize(Math.floor(diffMs / SECOND_MS), 'second')
  if (diffMs < HOUR_MS)
    return pluralize(Math.floor(diffMs / MINUTE_MS), 'minute')
  if (diffMs < DAY_MS) return pluralize(Math.floor(diffMs / HOUR_MS), 'hour')

  const diffDays = Math.floor(diffMs / DAY_MS)
  if (diffDays < 7) return pluralize(diffDays, 'day')
  if (diffDays < 30) return pluralize(Math.floor(diffDays / 7), 'week')
  if (diffDays < 365) return pluralize(Math.floor(diffDays / 30), 'month')
  return pluralize(Math.floor(diffDays / 365), 'year')
}
