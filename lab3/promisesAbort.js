const fs = require('fs')
const util = require('util')

function asyncMap(array, controller, mapFn) {
    const result = []
    let promise = Promise.resolve()
    const {signal} = controller;

    for (const item of array) {
        promise = promise
            .then(() => mapFn(item, signal))
            .then(res => {
                result.push(res)
            })
    }

    return promise.then(() => result)
}

function main() {
    const testData = [['1', '1'], ['../test/file2.txt', '2'], ['../test/file1.txt', '../test/file2.txt']]

    const controller = new AbortController();

    const mapFn = (elem, signal) => new Promise((res, rej) => {
        const timeout = setTimeout(() => util.promisify(fs.readFile)(elem, 'utf-8')
            .then(res)
            .catch(rej)
            .then(() => {
                setTimeout(() => controller.abort(), 2000)
            }), 2000)

        signal.addEventListener('abort', () => {
            clearTimeout(timeout)
            rej(new Error("Aborted"));
        })
    })

    const test = {
        promises: (arrays) => {
            for (const array of arrays) {
                asyncMap(array, controller, mapFn)
                    .then(result => console.log(`Result:\n${result.join('')}\n\n`), error => console.log(`Error:\n${error.message}\n\n`))
                    .then(() => controller.abort())
            }
        },

        asyncAwait: async (arrays) => {
            for (const array of arrays) {
                try {
                    const result = await asyncMap(array, controller, mapFn)
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
