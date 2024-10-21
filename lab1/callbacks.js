const fs = require('fs');

function asyncMap(array, mapFn, callback) {
    const result = []
    let isError = false

    for (const item of array) {
        mapFn(item, (error, mapped) => {
            if (isError) return
            if (error) {
                isError = true
                callback(error, null)
            }
            result.push(mapped)
            if (result.length === array.length) callback(null, result)
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
        fs.readFile(fileName, (error, mapped) => {
            callback(error, mapped?.toString())
        })
    }

    for (const array of arrays) {
        asyncMap(array, mapFn, (error, mapped) => {
            console.log(`Error:\t${error}\nResult:\t${mapped?.join('')}\n`)
        })
    }
}

main()
