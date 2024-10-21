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

    return promise.then(() => result)
}

function main() {
    const testData = [
        ['1', '1'],
        ['../test/file2.txt', '2'],
        ['../test/file1.txt', '../test/file2.txt']
    ]

    const mapFn = (elem) => util.promisify(setTimeout)(2 * 1000)
        .then(() => util.promisify(fs.readFile)(elem, 'utf-8'))

    const test = {
        promises: (arrays) => {
            for (const array of arrays) {
                asyncMap(array, mapFn)
                    .then(
                        result => console.log(`Result:\n${result.join('')}\n\n`),
                        error => console.log(`Error:\n${error.message}\n\n`),
                    )
            }
        },

        asyncAwait: async (arrays) => {
            for (const array of arrays) {
                try {
                    const result = await asyncMap(array, mapFn)
                    console.log(`Result:\n${result.join('')}\n\n`)
                } catch (error) {
                    console.log(`Error:\n${error.message}\n\n`)
                }
            }
        }
    }

    test.promises(testData)
}

main()
