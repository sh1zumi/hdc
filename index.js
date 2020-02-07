const fetch = require('./modules/nhentai/fetch')
const download = require('./modules/nhentai/download')

const yargs = require('yargs')

const argv = yargs
    .command({
        command: 'download <bookId>',
        desc: 'Download a book from source',
        handler: (argv) => {
            download.downloadBook(argv.bookId, {
                delay: 1,
                directory: '.',
                naming: (page, pageCount) => (page + '').padStart(3, '0')
            }).then(res => {
                console.log('complete')
            }).catch(err => {
                console.error(err)
            })
        }
    })
    .help()
    .alias('help', 'h')
    .argv