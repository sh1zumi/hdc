const nhentaiCfg = require('./config')
const fetch = require('./fetch')

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const axios = require('axios')

/**
 * Download certain page of specific book
 * 
 * @param {string} mediaId The media ID of the book
 * @param {number} page The page number
 * @param {string} fileExtension The file extension of the downloaded page
 * @param {object} options Configuration for the download operation
 *  - directory `string` `optional` - The save directory
 */
async function downloadBookPage(mediaId, page, fileExtension, options) {
    // Apply defaults to options 
    let defaultOptions = { 
        directory: '.'
    }
    options = Object.assign(defaultOptions, options)

    let filename = page + '.' + fileExtension
    let reqPath = path.join('galleries', mediaId, filename)
    let url = nhentaiCfg.imageOrigin + '/' + reqPath

    return new Promise(resolve => {
        console.log('Attempt to download ' + url)
        resolve()
    })
    .then( _ => {
        return axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        })    
    })
    .then( res => {
        return fs.promises.access(options.directory)
        .catch( _ => {
            console.log('Directory ' + options.directory + 'not found. Creating one')
            return fs.promises.mkdir(options.directory, { recursive: true })
        })
        .then(_ => res)
    })
    .then( res => {
        let outputPath = path.join(options.directory, filename)

        res.data.pipe(fs.createWriteStream(outputPath))
        console.log('Saved as ' + filename)
    })
}

const fileExtensionMap = {
    j: 'jpg',
    p: 'png',
    g: 'gif'
}

/**
 * Download certain book
 * @param {string} bookId - The book ID
 * @param {object} options Configuration for the download operation
 *  - delay `number` `optional` - Delay for subsequent tasks
 *  - directory `string` optional - The save directory
 */
async function downloadBook(bookId, options) {
    // Apply defaults to options 
    let defaultOptions = { 
        delay: 500,
        directory: '.'
    }
    options = Object.assign(defaultOptions, options)

    return fetch.getBookInfo(bookId).then( res => {
        console.log('Found book ' + res.title.japanese)

        let mediaId = res['media_id']
        if (!_.isString(mediaId)) {
            throw Error('Media ID not found')
        }

        // Create initial empty promise
        let task = new Promise(resolve => { resolve() })
        let imageMetas = res.images.pages

        // Return immediately if there is no image
        if (!_.isArray(imageMetas) || imageMetas.length === 0) { 
            console.log('No images found')
            return task
        }
        console.log(imageMetas.length + ' images found')

        let bookTitle = res.title.japanese || res.title.english || bookId
        let dir = path.join(options.directory, bookTitle)

        // Chain the download tasks
        for (let i = 0; i < imageMetas.length; i++) {
            let meta = imageMetas[i]
            let ext = fileExtensionMap[meta.t]
            let page = i + 1
            let opt = {
                directory: dir
            }
            task = task.then( v => downloadBookPage(mediaId, page, ext, opt) )

            // Apply delay for subsequent tasks
            if (i !== 0) {
                task = task.then( v => new Promise(resolve => setTimeout(resolve, options.delay)) )
            }
        }
        return task
    })
}

module.exports = {
    downloadBookPage: downloadBookPage,
    downloadBook: downloadBook
} 