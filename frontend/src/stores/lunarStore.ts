import { create } from 'zustand'
import { FetchLunarData } from '../../wailsjs/go/zhanbu/App'

interface LunarData {
  query_timestamp: string
  query_timezone: string
  timezone: string
  datetime: string
  datetime_rfc3339: string
  timestamp_unix: number
  weekday: number
  weekday_cn: string
  lunar_year: number
  lunar_month: number
  lunar_day: number
  is_leap_month: boolean
  lunar_year_cn: string
  lunar_month_cn: string
  lunar_day_cn: string
  ganzhi_year: string
  ganzhi_month: string
  ganzhi_day: string
  zodiac: string
}

type LunarStore = {
  lunarData: LunarData | null
  loading: boolean
  error: string | null
  refreshLunarData: () => Promise<LunarData | null>
}

const useLunarStore = create<LunarStore>((set) => ({
  lunarData: null,
  loading: false,
  error: null,

  refreshLunarData: async () => {
    set({ loading: true, error: null })
    try {
      const result = await FetchLunarData()
      const data: LunarData = JSON.parse(result)
      set({ lunarData: data, loading: false })
      return data
    } catch (e) {
      set({ loading: false, error: (e as Error).message })
      return null
    }
  },
}))

export default useLunarStore
