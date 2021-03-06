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
 *  - naming `function` optional - The naming rules
 */
async function downloadBookPage(mediaId, page, fileExtension, options) {
    // Apply defaults to options 
    const defaultOptions = { 
        directory: '.'
    }
    options = Object.assign({}, defaultOptions, options)

    const namingFunc = _.isFunction(options.naming) ? options.naming : (page => page)
    const filename = page + '.' + fileExtension
    const reqPath = path.join('galleries', mediaId, filename)
    const url = nhentaiCfg.imageOrigin + '/' + reqPath

    return axios({
        method: 'get',
        url: url,
        responseType: 'stream'
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
        const name = namingFunc(page) + '.' + fileExtension
        const outputPath = path.join(options.directory, name)

        res.data.pipe(fs.createWriteStream(outputPath))
        return {
            url: url,
            output: {
                path: outputPath,
                name: name
            }
        }
    })
    .catch( err => {
        console.log(url + '     Failed')
    })
}

const fileExtensionMap = {
    j: 'jpg',
    p: 'png',
    g: 'gif'
}

/**
 * Download certain book
 * @param {string} bookId The book ID
 * @param {object} options Configuration for the download operation
 *  - delay `number` `optional` - Delay for subsequent tasks
 *  - directory `string` optional - The save directory
 *  - naming `function` optional - The naming rules
 */
async function downloadBook(bookId, options) {
    // Apply defaults to options 
    const defaultOptions = { 
        delay: 500,
        directory: '.'
    }
    options = Object.assign({}, defaultOptions, options)

    const namingFunc = _.isFunction(options.naming) ? options.naming : ((page, pageCount) => page)

    return fetch.getBookInfo(bookId).then( res => {
        console.log('Found book ' + res.title.japanese)

        const mediaId = res['media_id']
        if (!_.isString(mediaId)) {
            throw Error('Media ID not found')
        }

        // Create initial empty promise
        let task = new Promise(resolve => { resolve() })
        const imageMetas = res.images.pages
        const totalPages = imageMetas.length

        // Return immediately if there is no image
        if (!_.isArray(imageMetas) || totalPages === 0) { 
            console.log('No images found')
            return task
        }
        console.log(totalPages + ' images found')

        const bookTitle = res.title.japanese || res.title.english || bookId
        const dir = path.join(options.directory, bookTitle)
        console.log('Will save to ' + dir)

        // Chain the download tasks
        for (let i = 0; i < totalPages; i++) {
            const meta = imageMetas[i]
            const ext = fileExtensionMap[meta.t]
            const page = i + 1
            const opt = {
                directory: dir,
                naming: (page => namingFunc(page, totalPages) )
            }
            task = task.then(v => {
                return downloadBookPage(mediaId, page, ext, opt)
            }).then(res => {
                console.log('[' + page + '/' + totalPages + '] ' + res.url + '     ->    ' + res.output.name)
            })

            // Apply delay for subsequent tasks
            if (i !== 0 && options.delay > 0) {
                task = task.then( v => new Promise(resolve => setTimeout(resolve, options.delay)) )
            }
        }
        return task
    })
}

/**
 * Download certain books
 * @param {string|string[]} bookIDs The book IDs
 * @param {object} options Configuration for the download operation
 *  - delay `number` `optional` - Delay for subsequent tasks
 *  - directory `string` optional - The save directory
 *  - naming `function` optional - The naming rules
 */
async function downloadBooks(bookIDs, options) {
    let IDs = []
    
    if (!_.isArray(bookIDs)) {
        IDs.push(bookIDs)
    } else {
        IDs = bookIDs
    }

    const mappedIDs = IDs.map( v => _.toString(v) )
    let task = new Promise(resolve => { resolve() })
    for (let i = 0; i < mappedIDs.length; i++) {
        task = task.then( v => downloadBook(mappedIDs[i], options) )
    }
    return task
}

module.exports = {
    downloadBookPage: downloadBookPage,
    downloadBook: downloadBook,
    downloadBooks: downloadBooks
} 