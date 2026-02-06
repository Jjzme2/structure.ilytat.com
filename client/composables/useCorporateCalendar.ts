export interface CalendarEvent {
    id: string
    title: string
    date: string // YYYY-MM-DD
    type: 'holiday' | 'corporate' | 'tax' | 'user'
    isDefault?: boolean
}

export const useCorporateCalendar = () => {
    const getFixedHolidays = (year: number): CalendarEvent[] => [
        { id: `ny-${year}`, title: "New Year's Day", date: `${year}-01-01`, type: 'holiday', isDefault: true },
        { id: `ind-${year}`, title: "Independence Day", date: `${year}-07-04`, type: 'holiday', isDefault: true },
        { id: `vet-${year}`, title: "Veterans Day", date: `${year}-11-11`, type: 'holiday', isDefault: true },
        { id: `xmas-${year}`, title: "Christmas Day", date: `${year}-12-25`, type: 'holiday', isDefault: true },
    ]

    const getQuarterEnds = (year: number): CalendarEvent[] => [
        { id: `q1-${year}`, title: "Q1 Fiscal Close", date: `${year}-03-31`, type: 'corporate', isDefault: true },
        { id: `q2-${year}`, title: "Q2 Fiscal Close", date: `${year}-06-30`, type: 'corporate', isDefault: true },
        { id: `q3-${year}`, title: "Q3 Fiscal Close", date: `${year}-09-30`, type: 'corporate', isDefault: true },
        { id: `q4-${year}`, title: "Q4 Fiscal Close", date: `${year}-12-31`, type: 'corporate', isDefault: true },
        { id: `tax-${year}`, title: "Tax Day", date: `${year}-04-15`, type: 'tax', isDefault: true },
    ]

    // Helper to calculate floating holidays (like Thanksgiving - 4th Thursday in Nov)
    const getFloatingHolidays = (year: number): CalendarEvent[] => {
        const events: CalendarEvent[] = []

        // Memorial Day: Last Monday in May
        const may = new Date(year, 4, 31) // May 31
        const memDay = may.getDay() === 1 ? 31 : 31 - ((may.getDay() + 6) % 7)
        events.push({ id: `mem-${year}`, title: "Memorial Day", date: `${year}-05-${memDay.toString().padStart(2, '0')}`, type: 'holiday', isDefault: true })

        // Labor Day: 1st Monday in September
        const sept = new Date(year, 8, 1)
        const laborDay = sept.getDay() === 1 ? 1 : 1 + ((8 - sept.getDay()) % 7)
        events.push({ id: `labor-${year}`, title: "Labor Day", date: `${year}-09-${laborDay.toString().padStart(2, '0')}`, type: 'holiday', isDefault: true })

        // Thanksgiving: 4th Thursday in November
        const nov = new Date(year, 10, 1)
        const dayOfWeek = nov.getDay()
        const firstThursday = dayOfWeek <= 4 ? 5 - dayOfWeek : 12 - dayOfWeek
        const thanksgiving = firstThursday + 21
        events.push({ id: `thx-${year}`, title: "Thanksgiving", date: `${year}-11-${thanksgiving}`, type: 'holiday', isDefault: true })

        return events
    }

    const getAllCorporateEvents = (year: number): CalendarEvent[] => {
        return [
            ...getFixedHolidays(year),
            ...getQuarterEnds(year),
            ...getFloatingHolidays(year)
        ]
    }

    return {
        getAllCorporateEvents
    }
}
