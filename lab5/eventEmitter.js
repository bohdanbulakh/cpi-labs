const fs = require('fs');
const util = require('util');
const EventEmitter = require('events');

async function asyncMap(array, mapFn) {
    return new Promise(async (resolve, reject) => {
        const emitter = new EventEmitter({captureRejections: true});
        const result = [];

        emitter.on('data', async (isLast, item) => {
            result.push(await mapFn(item));
            if (isLast) resolve(result);
        });

        emitter.on('error', (error) => {
            reject(error);
        });

        for (const [index, item] of array.entries()) {
            const isLast = index === array.length - 1;
            emitter.emit('data', isLast, item);
        }
    });
}

const main = async () => {
    const arrays = [
        ['3', '../test/file1.txt'],
        ['../test/file1.txt', '6', '1'],
        ['../test/file1.txt', '../test/file2.txt'],
    ];
    const mapFn = (elem) => util.promisify(setTimeout)(1000)
        .then(() => util.promisify(fs.readFile)(elem, 'utf-8'));

    for (const array of arrays) {
        try {
            console.log({ result: await asyncMap(array, mapFn) });
        } catch (error) {
            console.error(error);
        }
    }

};

main();
