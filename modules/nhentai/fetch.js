const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const axios = require('axios')
const nhentaiCfg = require('./config')

/**
 * Retrieve the info of certain book
 * @param {string} bookId - The book ID
 */
async function getBookInfo(bookId) {
    if (!_.isString(bookId)) {
        bookId = _.toString(bookId)
    }

    let reqPath = path.join('api', 'gallery', bookId)

    return axios({
        method: 'get',
        url: nhentaiCfg.defaultOrigin + '/' + reqPath,
        responseType: 'json'
    }).then( res => {
        return res.data
    })
}

module.exports = {
    getBookInfo: getBookInfo
}