const fs = require('fs');

function asyncMap(array, mapFn, callback) {
    const result = new Array(array.length).fill(null)
    let isError = false
    let processedCount = 0

    for (const [index, item] of array.entries()) {
        mapFn(item, (error, mapped) => {
            if (isError) return
            if (error) {
                isError = true
                callback(error, null)
            }
            result[index] = mapped
            processedCount++;

            if (processedCount === array.length) callback(null, result)
        })
    }
}

function main() {
    const arrays = [
        ['3', '../test/file1.txt'],
        ['../test/file1.txt', '6', '1'],
        ['../test/file1.txt', '../test/file2.txt'],
    ]

    const mapFn = (fileName, callback) => {
        setTimeout(
            () => fs.readFile(fileName, (error, fileContent) => {
                callback(error, fileContent?.toString())
            }), 2 * 1000
        )
    }

    for (const array of arrays) {
        asyncMap(array, mapFn, (error, mapped) => {
            console.log(error ? `Error:\t${error}\n` : `Result:\t${mapped.join('')}\n`)
        })
    }
}

main()
