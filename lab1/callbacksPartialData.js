const fs = require('fs');

function asyncMap(array, mapFn, callback) {
    const result = new Array(array.length).fill(null);
    let processedCount = 0;

    for (const [index, item] of array.entries()) {
        mapFn(item, (error, mapped) => {
            result[index] = error ?? mapped
            processedCount++
            if (processedCount === array.length) callback(result)
        })
    }
}

function main() {
    const array = ['1', '../test/file1.txt', '6', '../test/file2.txt']

    const mapFn = (fileName, callback) => {
        setTimeout(
            () => fs.readFile(fileName, (error, mapped) => {
                callback(error, mapped?.toString())
            }), 2 * 1000
        )
    }

    asyncMap(array, mapFn, (mapped) => {
        console.log(mapped)
    })
}

main()
