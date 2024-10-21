const fs = require('fs')
const util = require('util')

function asyncMap(array, mapFn) {
    const result = array.map(mapFn)
    return Promise.allSettled(result)
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
                asyncMap(array, mapFn).then((result) => {
                    console.log(result.map(res => res.status === 'fulfilled' ? res.value : res.reason).join('\n') + '\n---\t---\t---')
                })
            }
        },
        asyncAwait: async (arrays) => {
            for (const array of arrays) {
                const result = await asyncMap(array, mapFn)
                console.log(result.map(res => res.status === 'fulfilled' ? res.value : res.reason).join('\n') +'\n---\t---\t---')
            }
        }
    }

    test.promises(testData)

}


main()
