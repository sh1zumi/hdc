const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const axios = require('axios')
const nhentaiCfg = require('./config')

/**
 * Download certain page of specific book
 * @param {object} config - Configuration for the download operation
 *  - mediaId `number` - The media ID of the book
 *  - page `number` - The page number
 *  - directory `string` `optional` - The save directory
 *  - fileExtension `string` - The file extension of the downloaded page
 * }
 */
async function downloadBookPage(config) {
    let defaultCfg = { 
        page: 1,
        fileExtension: 'jpg',
        directory: '.'
    }
    let cfg = Object.assign(defaultCfg, config)
    let filename = cfg.page + '.' + cfg.fileExtension
    let reqPath = path.join('galleries', _.toString(cfg.mediaId), filename)

    return axios({
        method: 'get',
        url: nhentaiCfg.imageOrigin + '/' + reqPath,
        responseType: 'stream'
    })
    .then(function (response) {
        let outputPath = path.join(cfg.directory, filename)
        response.data.pipe(fs.createWriteStream(outputPath))
    })
    .catch( error => {
        console.log(error)
    })
}

module.exports = {
    downloadBookPage: downloadBookPage
}