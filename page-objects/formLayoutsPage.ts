import {Page} from '@playwright/test'
import { HelperBase } from './helperBase';

export class FormLayoutsPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string){
        const usingTheGridForms = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridForms.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGridForms.getByRole('textbox', {name: 'Password'}).fill(password)
        await usingTheGridForms.getByRole('radio', {name: optionText}).check({force: true})
        await usingTheGridForms.getByRole('button').click()
    }
    /**
     * This Method fill out the In Line form with user details
     * @param name - should be first and last name
     * @param email - valid emaif for the test user
     * @param rememberMe - true or false if user session to be saved
     */
    async submitInLineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean ){
        const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
        await inlineForm.getByPlaceholder('Jane Doe').fill(name)
        await inlineForm.getByRole('textbox', {name: 'Email'}).fill(email)
        if(rememberMe)
            await inlineForm.getByRole('checkbox').check({force: true})
        await inlineForm.getByRole('button').click()
        
    }
}