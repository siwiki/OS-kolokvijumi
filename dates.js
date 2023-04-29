import got from 'got';
import {writeFile} from 'fs/promises';
import {ALL_DIRECTORIES, parseDirectoryListing, readJSON} from './util.js';

async function main() {
    const dates = {};
    for (const dir of ALL_DIRECTORIES) {
        console.info('Processing', dir);
        const {baseUrl} = await readJSON(`${dir}/meta.json`);
        const baseHtml = await got(baseUrl).text();
        const {directories: yearDirs} = parseDirectoryListing(baseHtml);
        for (const year in yearDirs) {
            console.info('Current year:', year);
            const yearHtml = await got(`${baseUrl}${year}`).text();
            const {directories: monthDirs} = parseDirectoryListing(yearHtml);
            for (const month in monthDirs) {
                console.info('Current month:', month);
                const monthHtml = await got(`${baseUrl}${year}/${month}`).text();
                const {files} = parseDirectoryListing(monthHtml);
                for (const [file, date] of Object.entries(files)) {
                    dates[`${dir}-${year}-${month}-${file}`] = date;
                }
            }
        }
    }
    const fileContent = Object
        .entries(dates)
        .map(([file, date]) => `${file}: ${date.toJSON()}`)
        .join('\n');
    await writeFile('dates.yml', fileContent);
}

main();
