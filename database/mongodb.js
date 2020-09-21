const mongoose = require('mongoose')
const logger = require('../utils/logger')

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/legendastv'
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(() => logger.info('Conectado ao Mongo'))
    .catch(e => logger.error('Ocorreu um erro na conexão com o mongo', e))


module.exports = mongoose
