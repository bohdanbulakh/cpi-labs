const fs = require('fs')
const util = require("util")

function asyncMap(array, mapFn) {
    const result = []

    let promise = Promise.resolve()

    for (const item of array) {
        promise = promise
            .then(() => mapFn(item))
            .then(res => {
                result.push(res)
            })
    }

    return promise
        .then(() => result)
        .catch((err) => Promise.reject(err))
}

function main() {
    const arrays = [
        ['1', '1'],
        ['2', '../test/file2.txt'],
        ['../test/file1.txt', '../test/file2.txt']
    ]

    const mapFn = (elem) => util.promisify(setTimeout)(5 * 1000)
        .then(() => util.promisify(fs.readFile)(elem, 'utf-8'))

    for (const array of arrays) {
        asyncMap(array, mapFn)
            .then(
                result => console.log(`Result:\n${result.join('')}\n\n`),
                error => console.log(`Error:\n${error.message}\n\n`),
            )
    }
}

main()
