import {expect, test} from '@playwright/test'

test.beforeEach(async({page}) =>{
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})


test('Locator Syntax Rules', async({page})=>{
    // by tag name
    page.locator('input')
    //by ID
    page.locator('#inputEmail')

    //by class
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle np-transition"]')

    //by combine different locators
    page.locator('input [placeholder="Email"]')

    //by partial text
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators',async({page})=>{
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name:"Sign in"}).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid').click()
    //await page.getByTitle('IoT Dashboard').click()
    await page.getByTestId('SignIn').click()
})

test('Locating child elements',  async({page}) =>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', {name:"Sign in"}).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating parent elements', async({page}) =>{
    await page.locator('nb-card', {hasText:"Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
        .getByRole('textbox', {name: "Email"}).click()
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing locators', async({page}) =>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    const passwordField = basicForm.getByRole('textbox', {name: "Password"})

    await emailField.fill('test@test.com')
    await passwordField.fill('test123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting values', async({page}) =>{
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    await expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLabels).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertions', async({page}) =>{
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    //General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()
})