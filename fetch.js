#!/usr/bin/env node
import {getText} from 'any-text';
import got from 'got';
import {createWriteStream} from 'fs';
import {mkdir, writeFile} from 'fs/promises';
import stream from 'stream';
import {promisify} from 'util';
import {
    ALL_DIRECTORIES,
    parseDirectoryListing,
    readJSON,
    fileExists
} from './util.js';

const MONTHS = {
    'januar': 1,
    'februar': 2,
    'mart': 3,
    'april': 4,
    'maj': 5,
    'jun': 6,
    'jul': 7,
    'avgust': 8,
    'septembar': 9,
    'oktobar': 10,
    'novembar': 11,
    'decembar': 12,
    // Special rules - not actual month names
    'prvi': 4,
    'drugi': 5
};
const SEPARATOR = Array(81).join('-');
const COLLOQUIA_REGEX = /Kolokvijum(?: (1|2|3))?/;
const COLLOQUIA_2017_REGEX = /k(\d)(?:_resenja)?_2017/;
const pipeline = promisify(stream.pipeline);

function classify(filename) {
    if (
        filename.includes('rez') ||
        filename.includes('Rez') ||
        filename.endsWith('.xls') ||
        filename.endsWith('.xlsx') ||
        filename.includes('spisak')
    ) {
        return 'res';
    }
    let baseType;
    const match = COLLOQUIA_REGEX.exec(filename);
    if (!match) {
        const match2 = COLLOQUIA_2017_REGEX.exec(filename);
        if (!match2) {
            if (filename.includes('resenja')) {
                // April 2006
                return 'k1-sol';
            }
            return 'res';
        }
        // June 2017
        if (filename.includes('resenja')) {
            return `k${match2[1]}-sol`;
        } else {
            return `k${match2[1]}`;
        }
    }
    if (match[1]) {
        baseType = `k${match[1]}`;
    } else {
        baseType = 'k';
    }
    if (filename.includes('Resenja')) {
        return `${baseType}-sol`;
    }
    return baseType;
}

function getLocalFilename(baseDir, year, month, file, type) {
    if (file.endsWith('.doc')) {
        return `doc/${baseDir}/${year}-${month}-${type}.doc`;
    }
    return `pdf/${baseDir}/${year}/${month}/${type}.pdf`;
}

async function processMonth(baseDir, dates, client, year, month) {
    console.info('Processing month', month, year);
    const {files} = parseDirectoryListing(await client(`${year}/${month}`));
    if (files.length === 0) {
        console.info('Skipping month', month, year, 'as there are no files');
        return;
    }
    const monthNormalized = decodeURIComponent(month)
        .trim()
        .replace(/\s*-\s*nadoknad.*|\s*nadoknada\s*-\s*/, '')
        .toLowerCase();
    const monthNum = MONTHS[monthNormalized];
    if (!monthNum) {
        console.error('Failed to obtain month number!');
        return;
    }
    await mkdir(`pdf/${baseDir}/${year}/${monthNum}`, {
        recursive: true
    });
    await mkdir(`${baseDir}/${year}/${monthNum}`, {
        recursive: true
    });
    for (const [file, date] of Object.entries(files)) {
        dates[`${baseDir}-${year}-${month}-${file}`] = date;
        const type = classify(file);
        if (type === 'res') {
            console.info('Skipping', file, 'as it only contains results');
            continue;
        }
        const markdownFile = `${baseDir}/${year}/${monthNum}/${type}.md`;
        if (await fileExists(markdownFile)) {
            console.info('Skipping', file, 'as', markdownFile, 'exists');
            continue;
        }
        const url = `${year}/${month}/${file}`;
        console.info('Downloading', url);
        const pdfFile = getLocalFilename(baseDir, year, monthNum, file, type);
        await pipeline(client.stream(url), createWriteStream(pdfFile));
        const text = await getText(pdfFile);
        await writeFile(markdownFile, `${url}\n${SEPARATOR}\n${text}`, {
            encoding: 'utf-8'
        });
    }
}

async function processYear(baseDir, dates, client, year) {
    if (isNaN(year)) {
        console.error('Year cannot be parsed!');
        return;
    }
    console.info('Processing year', year);
    const {directories} = parseDirectoryListing(await client(`${year}`));
    for (const month in directories) {
        await processMonth(baseDir, dates, client, year, month);
    }
}

async function processSubject(baseDir, dates) {
    console.info('Processing subject', baseDir);
    const {baseUrl} = await readJSON(`${baseDir}/meta.json`);
    await mkdir(`doc/${baseDir}`, {
        recursive: true
    });
    const client = got.extend({
        headers: {
            'User-Agent': 'OS-kolokvijumi-spider'
        },
        method: 'GET',
        prefixUrl: baseUrl,
        resolveBodyOnly: true,
        retry: {
            limit: 0
        }
    });
    const {directories} = parseDirectoryListing(await client(''));
    for (const year in directories) {
        await processYear(baseDir, dates, client, Number(year));
    }
}

async function writeDates(dates) {
    const fileContent = Object
        .entries(dates)
        .map(([file, date]) => `${file}: ${date.toJSON()}`)
        .join('\n');
    await writeFile('dates.yml', fileContent);
}

async function main() {
    const dirArg = process.argv[2];
    if (dirArg && !dirArg.startsWith('--')) {
        await processSubject(dirArg, {});
    } else {
        const dates = {};
        for (const dir of ALL_DIRECTORIES) {
            await processSubject(dir, dates);
        }
        await writeDates(dates);
    }
}

main();
