import { create } from 'zustand'
import { FetchLunarData } from '../../wailsjs/go/main/App'

const initialState = {
  lunarData: null,
  loading: false,
  error: null,
  queryTimestamp: null,
  queryTimezone: null,
  timezone: null,
  datetime: null,
  datetimeRfc3339: null,
  timestampUnix: null,
  weekday: null,
  weekdayCn: null,
  lunarYear: null,
  lunarMonth: null,
  lunarDay: null,
  isLeapMonth: false,
  lunarYearCn: null,
  lunarMonthCn: null,
  lunarDayCn: null,
  ganzhiYear: null,
  ganzhiMonth: null,
  ganzhiDay: null,
  zodiac: null,
}

const useLunarStore = create((set) => ({
  ...initialState,

  setLunarData: (data) => {
    if (data) {
      set({
        lunarData: data,
        error: null,
        queryTimestamp: data.query_timestamp,
        queryTimezone: data.query_timezone,
        timezone: data.timezone,
        datetime: data.datetime,
        datetimeRfc3339: data.datetime_rfc3339,
        timestampUnix: data.timestamp_unix,
        weekday: data.weekday,
        weekdayCn: data.weekday_cn,
        lunarYear: data.lunar_year,
        lunarMonth: data.lunar_month,
        lunarDay: data.lunar_day,
        isLeapMonth: data.is_leap_month,
        lunarYearCn: data.lunar_year_cn,
        lunarMonthCn: data.lunar_month_cn,
        lunarDayCn: data.lunar_day_cn,
        ganzhiYear: data.ganzhi_year,
        ganzhiMonth: data.ganzhi_month,
        ganzhiDay: data.ganzhi_day,
        zodiac: data.zodiac,
      })
    } else {
      set(initialState)
    }
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearLunarData: () => set(initialState),

  refreshLunarData: async () => {
    set({ loading: true, error: null })
    try {
      const result = await FetchLunarData()
      const data = JSON.parse(result)
      set({
        lunarData: data,
        loading: false,
        error: null,
        queryTimestamp: data.query_timestamp,
        queryTimezone: data.query_timezone,
        timezone: data.timezone,
        datetime: data.datetime,
        datetimeRfc3339: data.datetime_rfc3339,
        timestampUnix: data.timestamp_unix,
        weekday: data.weekday,
        weekdayCn: data.weekday_cn,
        lunarYear: data.lunar_year,
        lunarMonth: data.lunar_month,
        lunarDay: data.lunar_day,
        isLeapMonth: data.is_leap_month,
        lunarYearCn: data.lunar_year_cn,
        lunarMonthCn: data.lunar_month_cn,
        lunarDayCn: data.lunar_day_cn,
        ganzhiYear: data.ganzhi_year,
        ganzhiMonth: data.ganzhi_month,
        ganzhiDay: data.ganzhi_day,
        zodiac: data.zodiac,
      })
      return data
    } catch (e) {
      set({ loading: false, error: e.message })
      return null
    }
  },
}))

export default useLunarStore
