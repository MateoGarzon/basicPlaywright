import { Page, test, expect, request } from "@playwright/test";
import { waitForAsync } from "@angular/core/testing";
import tags from '../test-data/tags.json'

test.beforeEach(async ({ page }) => {
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.goto(process.env.URL)

})

test('has title', async ({ page }) => {
    // replace information in the api call
    await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a MOCK test title"
        responseBody.articles[0].description = "This is a MOCK test description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })


    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description')
})

test('Delete article', async ({ page, request }) => {

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": { "title": "This is a test article", "description": "This is a test description", "body": "This is a test Body", "tagList": [] }
        }
    })

    await expect(articleResponse.status()).toEqual(201)
    await page.getByText('Global Feed').click()
    await page.getByText('This is a test article').click()
    await page.getByRole('button', { name: " Delete Article " }).first().click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title')
})

test('Intercept API calls', async ({ page, request }) => {
    await page.getByText('New Article').click()
    await page.getByRole('textbox', { name: "Article Title" }).fill('This is a new test article')
    await page.getByRole('textbox', { name: "What's this article about?" }).fill('This is a new article description')
    await page.getByRole('textbox', { name: "Write your article (in markdown)" }).fill('This is te body of the new article.')
    await page.getByRole('button', { name: " Publish Article " }).click()
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug

    await expect(page.locator('.article-page h1')).toContainText('This is a new test article')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a new test article')

    const deleteArticleRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)
    await expect(deleteArticleRequest.status()).toEqual(204)
})