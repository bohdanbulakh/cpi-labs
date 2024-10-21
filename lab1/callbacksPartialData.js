const fs = require('fs');

function asyncMap(array, mapFn, callback) {
    const result = new Array(array.length);

    let count = 0;

    for (const [index, item] of array.entries()) {
        mapFn(item, (error, mapped) => {
            result[index] = error ?? mapped

            if (count === array.length - 1) callback(result)
            count++
        })
    }
}

function main() {
    const array = ['1', '../test/file1.txt', '6', '../test/file2.txt']

    const mapFn = (fileName, callback) => {
        fs.readFile(fileName, (error, mapped) => {
            callback(error, mapped?.toString())
        })
    }

    asyncMap(array, mapFn, (mapped) => {
        console.log(mapped)
    })
}

main()
