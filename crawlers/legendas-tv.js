const puppeteer = require('puppeteer')

const { USER_AGENT, VIEWPORT, OPTIONS } = require('../settings')

const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD


class LegendasTvCrawler {
    constructor(
        baseUrl = 'http://legendas.tv',
        username = USERNAME,
        password = PASSWORD,
    ) {
        this.baseUrl = baseUrl
        this.options = OPTIONS
        this.userAgent = USER_AGENT
        this.viewport = VIEWPORT
        this.username = username
        this.password = password
    }

    async getBrowser() {
        return puppeteer.launch(this.options)
    }

    async goToPage(url) {
        const browser = await this.getBrowser()
        const page = await browser.newPage()
        page.setViewport(this.viewport)
        page.setUserAgent(this.userAgent)
        await page.goto(url)
        return page
    }

    async doLogin() {
        const loginUrl = `${this.baseUrl}/login`
        const page = await this.goToPage(loginUrl)
        await page.type('#UserUsername', this.username)
        await page.type('#UserPassword', this.password)
        await page.click('#UserLoginForm > button')
    }

}


module.exports = LegendasTvCrawler
