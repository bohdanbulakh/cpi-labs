const fs = require('fs')
const util = require('util')

function asyncMap(array, mapFn) {
    const result = array.map(mapFn)
    return Promise.allSettled(result)
}

function main() {
    const array = ['../test/file.txt', '../test/file2.txt']
    const mapFn = (elem) => util.promisify(setTimeout)(2 * 1000)
        .then(() => util.promisify(fs.readFile)(elem, 'utf-8'))

    asyncMap(array, mapFn).then((result) => {
        console.log(result.map(res => res.status === 'fulfilled' ? res.value : res.reason))
    })
}


main()
