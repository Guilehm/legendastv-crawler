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
        this.browser = null
        this.page = null
        this.authenticated = false
    }

    async getBrowser() {
        return puppeteer.launch(this.options)
    }

    async goToPage(url) {
        console.log('going to page', url)
        this.page ? this.page.close() : ''
        const browser = this.browser || await this.getBrowser()
        this.browser = browser
        const page = await browser.newPage()
        page.setViewport(this.viewport)
        page.setUserAgent(this.userAgent)
        await page.goto(url)
        this.page = page
    }

    async doLogin() {
        const loginUrl = `${this.baseUrl}/login`
        await this.goToPage(loginUrl)
        await this.page.type('#UserUsername', this.username)
        await this.page.type('#UserPassword', this.password)
        await this.page.click('#UserLoginForm > button')
        this.authenticated = true
    }

    async searchTitles(searchText) {
        const searchUrl = `${this.baseUrl}/busca/${encodeURI(searchText)}`
        await this.goToPage(searchUrl)
        const titles = await this.page.$x('//section[@id="slider-select-title"]//div[@class="item"]')
        const promises = titles.map(title => this.page.evaluate(e => {
            const title = e.textContent
            const titleId = e.firstChild.attributes['data-filme'].value
            return { title, titleId }
        }, title))
        return Promise.all(promises)
    }

    async getSubtitlesLinks(titleId) {
        const searchUrl = `${this.baseUrl}/legenda/busca/-/1/-/0/${titleId}`
        await this.goToPage(searchUrl)
        const subtitlesXpath = await this.page.$x('//div[@class="gallery clearfix list_element"]/article/div//p[1]/a')
        const subtitlesLinks = subtitlesXpath
            .map(async s => await this.page.evaluate(e => e.href, s))
        return Promise.all(subtitlesLinks)
    }

    formatData(data) {
        const formatDate = date => {
            const [day, month, year] = date.split('/')
            return new Date([year, month, day].join('/'))
        }
        return {
            name: data.name.trim(''),
            downloadCount: parseInt(data.downloadCount),
            grade: null,
            likeRatio: parseInt(data.dislikes) ? parseFloat(
                parseInt(data.likes) / parseInt(data.dislikes)
            ).toFixed(2) : 100,
            sender: data.sender,
            sendDate: formatDate(data.sendDate),
            language: data.language,
            downloadUrl: data.downloadUrl,
        }
    }

    async getSubtitleData(subtitleUrl) {
        if (!this.authenticated) await this.doLogin()
        await this.goToPage(subtitleUrl)
        await this.page.waitForXPath('//h1')
        const name = await this.page.evaluate(e => e.textContent, (await this.page.$x('//h1/text()'))[0])
        const downloadCount = await this.page
            .evaluate(e => e.textContent, (await this.page.$x('//p/span[@class="number"]/text()'))[0])
        const likes = await this.page
            .evaluate(e => e.textContent, (await this.page.$x('//p/a[@class="ajax_rating"]//parent::p/text()'))[0])
        const dislikes = await this.page.evaluate(
            e => e.textContent,
            (await this.page.$x('//p/a[@class="ajax_rating"]//parent::p/following-sibling::p/text()'))[0]
        )
        const sender = await this.page
            .evaluate(e => e.textContent, (await this.page.$x('//span[@class="nume"]/a/text()'))[0])
        const sendDate = await this.page
            .evaluate(e => e.textContent, (await this.page.$x('//span[@class="date"]/text()'))[0])
        const language = await this.page.evaluate(e => e.textContent, (await this.page.$x('//h1/img/@title'))[0])
        const downloadId = await this.page.evaluate(
            e => e.textContent.split("'")[1].split('/')[2],
            (await this.page.$x('//button[@class="icon_arrow"]/@onclick'))[0]
        )
        return this.formatData({
            name,
            downloadCount,
            likes,
            dislikes,
            sender,
            sendDate,
            language,
            downloadUrl: `http://legendas.tv/downloadarquivo/${downloadId}`
        })
    }
}


module.exports = LegendasTvCrawler
