const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const LegendasTvCrawler = require('../crawlers/legendas-tv')
const Title = require('../database/models/title-model')
const Subtitle = require('../database/models/subtitle-model')
const logger = require('../utils/logger')
const mongo = require('../database/mongodb')



class SubtitleService {
    constructor() {
        this.crawler = new LegendasTvCrawler()
        this.db = mongo
    }

    async getAndSaveTitles(searchText) {
        await Title.deleteMany({})
        const titles = await this.crawler.searchTitles(searchText)
        try {
            const documents = await Title.create(titles.map(t => ({ ...t, crawled: false })))
            return documents
        } catch (err) {
            logger.error(err.message)
        }
    }

    async getAndSaveSubtitleLinks() {
        await Subtitle.deleteMany({})
        let title = await Title.findOne({ crawled: false })
        while (title !== null) {
            try {
                const subtitleLinks = await this.crawler.getSubtitlesLinks(title.id)
                await Subtitle.create(subtitleLinks.map(s => ({ ...s, crawled: false })))
                await Title.findOneAndUpdate({ id: title.id }, { crawled: true })
                title = await Title.findOne({ crawled: false })
            } catch (err) {
                logger.error(err.message)
                return
            }
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
            const [totalCount, crawledCount] = await this.countSubtitles()
            logger.info(`Atualizando ${crawledCount} de ${totalCount} legendas.`)
            subtitle = await Subtitle.findOne({ crawled: false })
        }
    }

    async countItems(Model) {
        const totalCount = await Model.countDocuments({})
        const crawledCount = await Model.countDocuments({ crawled: true })
        return [totalCount, crawledCount]
    }
}


module.exports = SubtitleService