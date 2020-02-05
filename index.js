const fetch = require('./modules/nhentai/fetch')
const download = require('./modules/nhentai/download')
// const yargs = require('yargs');

// const argv = yargs
//     .command('lyr', 'Tells whether an year is leap year or not', {
//         year: {
//             description: 'the year to check for',
//             alias: 'y',
//             type: 'number',
//         }
//     })
//     .option('time', {
//         alias: 't',
//         description: 'Tell the present Time',
//         type: 'boolean',
//     })
//     .help()
//     .alias('help', 'h')
//     .argv;

// if (argv.time) {
//     console.log('The current time is: ', new Date().toLocaleTimeString());
// }

// if (argv._.includes('lyr')) {
//     const year = argv.year || new Date().getFullYear();
//     if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
//         console.log(`${year} is a Leap Year`);
//     } else {
//         console.log(`${year} is NOT a Leap Year`);
//     }
// }

// console.log(argv);

// download.downloadBookPage({
//     mediaId: 1014314,
//     page: 1,
//     fileExtension: 'jpg'
// }).then(res => {
//     console.log('complete')
// })

fetch.getBookInfo(269972)
.then(function (response) {
    console.log(response.data)
})