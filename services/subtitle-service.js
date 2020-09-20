const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const LegendasTvCrawler = require('../crawlers/legendas-tv')
const Title = require('../database/models/title-model')
const Subtitle = require('../database/models/subtitle-model')



class SubtitleService {
    constructor() {
        this.crawler = new LegendasTvCrawler()
    }

    async getAndSaveTitles(searchText) {
        const titles = await this.crawler.searchTitles(searchText)
        const documents = await Title.create(titles.map(t => ({ ...t, crawled: false })))
        return documents
    }

    async getAndSaveSubtitleLinks() {
        let title = await Title.findOne({ crawled: false })
        while (title !== null) {
            const subtitleLinks = await this.crawler.getSubtitlesLinks(title.id)
            await Subtitle.create(subtitleLinks.map(s => ({ ...s, crawled: false })))
            await Title.findOneAndUpdate({ id: title.id }, { crawled: true })
            title = await Title.findOne({ crawled: false })
        }
    }

    async getAndUpdateSubtitles() {
        let subtitle = await Subtitle.findOne({ crawled: false })
        while (subtitle !== null) {
            const subtitleData = await this.crawler.getSubtitleData(subtitle.url)
            await Subtitle.findOneAndUpdate(
                { _id: ObjectId(subtitle.id) },
                { ...subtitleData, crawled: true }
            )
            subtitle = await Subtitle.findOne({ crawled: false })
        }
    }
}


module.exports = SubtitleService