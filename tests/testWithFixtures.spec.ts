import { test } from '../test-options'
import {faker} from '@faker-js/faker'


test('parametrized methods', async ({ pageManager, formLayoutsPage }) => {

    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(100)}@test.com`

    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'password123', 'Option 1')
    await pageManager.onFormLayoutsPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)


})