import { Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class DatePickerPage extends HelperBase{

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerFromToday(numberOfDaysFromToday: number) {

        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)

        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', { month: "short" })
        const expectedMonthLong = date.toLocaleString('En-US', { month: "long" })
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndyear = await this.page.locator('nb-calendar-view-mode').textContent()
        console.log(calendarMonthAndyear)
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        while (!calendarMonthAndyear.includes(expectedMonthAndYear)) { //if calendar date does not match the expected calendar date, then...
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndyear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).first().click()
        return dateToAssert
    }
}