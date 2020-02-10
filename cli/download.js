const download = require('../modules/nhentai/download')

exports.command = 'download <bookId>'

exports.describe = 'Download a book from source'

exports.builder = {
  destination: {
    describe: 'The saving directory.',
    alias: 'd',
    default: '.'
  }
}

exports.handler = (argv) => {
    download.downloadBook(argv.bookId, {
        delay: 1,
        directory: argv.destination,
        naming: (page, pageCount) => (page + '').padStart(3, '0')
    }).then(res => {
        console.log('complete')
    }).catch(err => {
        console.error(err)
    })
}