import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatePickerPage } from '../page-objects/datePickerPage'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Navigate to Form page', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async ({ page }) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(100)}@test.com`

    pm.navigateTo().formLayoutPage()
    
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'password123', 'Option 1')
    await page.waitForTimeout(500)
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})

    pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerFromToday(3)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(4, 9)

})