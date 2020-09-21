const mongo = require('./database/mongodb')
const { program } = require('commander')
const SubtitleService = require('./services/subtitle-service')
const Subtitle = require('./database/models/subtitle-model')
const Title = require('./database/models/title-model')
const logger = require('./utils/logger')

const service = new SubtitleService()

program
    .option('-c, --crawl')
    .option('-u, --update')
    .option('--count')
    .option('-t, --text <type>', 'Nome do filme', 'Os Simpsons')

program.parse(process.argv)


const run = async () => {
    try {
        if (program.crawl) {
            await service.getAndSaveTitles(program.text)
            const [totalCountTitles,] = await service.countItems(Title)
            logger.info(`BUSCANDO LEGENDAS PARA ${totalCountTitles} TÍTULOS`)
            await service.getAndSaveSubtitleLinks()
            const [totalCountSUbtitles,] = await service.countItems(Subtitle)
            logger.info(`FORAM ENCONTRADAS ${totalCountSUbtitles} LEGENDAS.`)
            await service.getAndUpdateSubtitles()
        } else if (program.update) {
            await service.getAndUpdateSubtitles()
        } else if (program.count) {
            const [totalCount, crawledCount] = await service.countItems(Subtitle)
            logger.info(`FORAM ENCONTRADAS ${totalCount} LEGENDAS.`)
            logger.info(`LEGENDAS ATUALIZADAS: ${crawledCount}/${totalCount}.`)
        }
    } catch (err) {
        logger.error(err.message)
        logger.info('OCORREU UM ERRO, POR FAVOR TENTE NOVAMENTE')
        process.exit(1)
    } finally {
        service.crawler.browser ? service.crawler.browser.close() : ''
        mongo.connection.close()
    }
}

run()
