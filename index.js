const yargs = require('yargs')

const argv = yargs
    .command(require('./cli/download'))
    .help()
    .alias('help', 'h')
    .argv