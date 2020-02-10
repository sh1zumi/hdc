const downloader = require('../modules/nhentai/download')

exports.command = 'download <bookIDs..>'

exports.describe = 'Download a book from source'

exports.builder = {
  destination: {
    describe: 'The save directory.',
    alias: 'd',
    default: '.'
  }
}

exports.handler = (argv) => {
    downloader.downloadBooks(argv.bookIDs, {
        delay: 1,
        directory: argv.destination,
        naming: (page, pageCount) => (page + '').padStart(3, '0')
    }).then(res => {
        console.log('complete')
    }).catch(err => {
        console.error(err)
    })
}