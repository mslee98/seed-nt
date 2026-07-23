import type { BankRow } from '../types/banks'

const WEEKDAY_ALIASES: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
}

/** Postgres `time` 문자열(HH:MM[:SS])을 분 단위로 변환 */
function parseTimeToMinutes(value: string | null): number | null {
  if (!value) return null
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(value.trim())
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  if (hours > 23 || minutes > 59) return null

  return hours * 60 + minutes
}

function getKoreaNowParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const weekday = parts.find((part) => part.type === 'weekday')?.value?.toLowerCase() ?? ''
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0')

  return {
    weekdayIndex: WEEKDAY_ALIASES[weekday] ?? now.getDay(),
    minutesOfDay: hour * 60 + minute,
  }
}

function isWithinTimeWindow(
  minutesOfDay: number,
  start: string | null,
  end: string | null,
): boolean {
  const startMinutes = parseTimeToMinutes(start)
  const endMinutes = parseTimeToMinutes(end)
  if (startMinutes == null || endMinutes == null) return false

  // 자정 넘어가는 구간 (예: 23:30 ~ 01:00)
  if (startMinutes <= endMinutes) {
    return minutesOfDay >= startMinutes && minutesOfDay < endMinutes
  }
  return minutesOfDay >= startMinutes || minutesOfDay < endMinutes
}

function matchesRegularMaintenanceRule(rule: string | null, weekdayIndex: number): boolean {
  if (!rule) return false

  const normalized = rule.trim().toLowerCase()
  if (!normalized) return false

  if (/^\d$/.test(normalized)) {
    return Number(normalized) === weekdayIndex
  }

  const alias = WEEKDAY_ALIASES[normalized]
  if (alias != null) return alias === weekdayIndex

  return false
}

export function isBankUnderMaintenance(bank: Pick<
  BankRow,
  | 'daily_maintenance_start'
  | 'daily_maintenance_end'
  | 'regular_maintenance_rule'
  | 'regular_maintenance_start'
  | 'regular_maintenance_end'
>, now = new Date()): boolean {
  const { weekdayIndex, minutesOfDay } = getKoreaNowParts(now)

  if (isWithinTimeWindow(minutesOfDay, bank.daily_maintenance_start, bank.daily_maintenance_end)) {
    return true
  }

  if (
    matchesRegularMaintenanceRule(bank.regular_maintenance_rule, weekdayIndex) &&
    isWithinTimeWindow(minutesOfDay, bank.regular_maintenance_start, bank.regular_maintenance_end)
  ) {
    return true
  }

  return false
}
