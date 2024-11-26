const fs = require('fs')
const util = require("util")

async function asyncMap(map, iterator) {
    const data = [];

    for await (const item of iterator) {
        try {
            data.push({
                status: 'fulfilled',
                value: await map(item),
            });
        } catch (error) {
            data.push({
                status: 'rejected',
                reason: error,
            });
        }
    }

    return data;
}

const main = async () => {
    const arrays = [
        ['3', '../test/file1.txt'],
        ['../test/file1.txt', '6', '1'],
        ['../test/file1.txt', '../test/file2.txt'],
    ]
    const mapFn = (elem) => util.promisify(setTimeout)(1000)
        .then(() => util.promisify(fs.readFile)(elem, 'utf-8'))

    const test = {
        generator: async function* (array) {
            for (const item of array) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                yield item;
            }
        },

        iterable: (array) => ({
            [Symbol.asyncIterator]() {
                let index = 0;

                return {
                    async next() {
                        return {
                            value: await array[index++],
                            done: index > array.length
                        };
                    }
                }
            }
        })
    }

    for (const array of arrays) {
        console.log(await asyncMap(mapFn, test.iterable(array)))
    }

}

main()
