import { useEffect, useState } from 'react'

// Ethiopia is UTC+3 all year, so opening hours stay accurate for guests abroad.
const CAFE_OFFSET_MS = 3 * 60 * 60 * 1000

function cafeTime(date) {
  const local = new Date(date.getTime() + CAFE_OFFSET_MS)

  return {
    day: local.getUTCDay(),
    minutes: local.getUTCHours() * 60 + local.getUTCMinutes(),
  }
}

export function getOpenStatus(hours, date = new Date()) {
  const { day, minutes } = cafeTime(date)
  const schedule = hours.find(({ days }) => days.includes(day))

  if (!schedule) {
    return { isOpen: false, schedule: null }
  }

  return {
    isOpen: minutes >= schedule.openMinutes && minutes < schedule.closeMinutes,
    schedule,
  }
}

export function useOpenStatus(hours) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const refresh = () => setNow(new Date())
    const timer = window.setInterval(refresh, 60_000)

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return getOpenStatus(hours, now)
}
