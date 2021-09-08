#!/usr/bin/env node
'use strict';
import got from 'got';
import {createWriteStream} from 'fs';
import {readFile, mkdir, writeFile} from 'fs/promises';
import stream from 'stream';
import {promisify} from 'util';

const DIRECTORY_REGEX = /<img src="\/icons\/[^"]+" alt="\[([^\]]+)\]">(?:<\/td><td>)?\s*<a href="([^"]+)">[^<]+<\/a>(?:<\/td><td align="right">)?\s*(\d+-(?:\w{3}|\d+)-\d+ \d+:\d+)/g;
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
const COLLOQUIA_REGEX = /Kolokvijum(?: (1|2|3))?/;
const COLLOQUIA_2017_REGEX = /k(\d)(?:_resenja)?_2017/;
const ALL_DIRECTORIES = ['os1', 'os2'];
const pipeline = promisify(stream.pipeline);

function parseDirectoryListing(content) {
    const listing = {
        directories: {},
        files: {}
    };
    let match;
    do {
        match = DIRECTORY_REGEX.exec(content);
        if (match) {
            if (match[1] === 'DIR') {
                listing.directories[match[2].slice(0, -1)] = new Date(match[3]);
            } else {
                listing.files[decodeURIComponent(match[2])] = new Date(match[3]);
            }
        }
    } while (match);
    return listing;
}

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

async function processMonth(baseDir, client, year, month) {
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
    for (const file in files) {
        const type = classify(file);
        if (type === 'res') {
            console.info('Skipping', file, 'as it only contains results');
            continue;
        }
        const url = `${year}/${month}/${file}`;
        console.info('Downloading', url);
        await pipeline(
            client.stream(url),
            createWriteStream(getLocalFilename(baseDir, year, monthNum, file, type))
        );
        await writeFile(`${baseDir}/${year}/${monthNum}/${type}.md`, `${url}\n`, {
            encoding: 'utf-8'
        });
    }
}

async function processYear(baseDir, client, year) {
    if (isNaN(year)) {
        console.error('Year cannot be parsed!');
        return;
    }
    console.info('Processing year', year);
    const {directories} = parseDirectoryListing(await client(`${year}`));
    for (const month in directories) {
        await processMonth(baseDir, client, year, month);
    }
}

async function processSubject(baseDir) {
    console.info('Processing subject', baseDir);
    const {baseUrl} = JSON.parse(await readFile(`${baseDir}/meta.json`, {
        encoding : 'utf-8'
    }));
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
        retry: 0
    });
    const {directories} = parseDirectoryListing(await client(''));
    for (const year in directories) {
        await processYear(baseDir, client, Number(year));
    }
}

async function main() {
    const dirArg = process.argv[2];
    if (dirArg && !dirArg.startsWith('--')) {
        await processSubject(dirArg);
    } else {
        for (const dir of ALL_DIRECTORIES) {
            await processSubject(dir);
        }
    }
}

main();
