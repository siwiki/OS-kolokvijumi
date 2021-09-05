#!/usr/bin/env node
'use strict';
import {readFile, readdir, writeFile} from 'fs/promises';
import {argv} from 'process';

var BASE_DIR = './os1';
var BASE_URL = '';
var CATEGORIES = {};
var KEYWORDS = {};

const MONTHS = ['', 'januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
const TYPES = {
    k: 'kolokvijum',
    k1: 'prvi kolokvijum',
    k2: 'drugi kolokvijum',
    k3: 'treći kolokvijum'
};
const isWeb = !process.argv.includes('--print');

async function processFile(year, month, type, categories) {
    const text = await readFile(`${BASE_DIR}/${year}/${month}/${type}.md`, {
        encoding: 'utf-8'
    });
    const sections = text.split(/-{60,100}/);
    if (sections.length === 2) {
        // Not yet processed
        return;
    }
    const url = sections
        .shift()
        .trim()
        .split('/')
        .map(s => encodeURIComponent(s))
        .join('/');
    let task = 0;
    for (const section of sections) {
        ++task;
        const sectionTrimmed = section.trim();
        const firstLine = sectionTrimmed.split('\n', 1)[0].trim().split(' ');
        const category = firstLine[0];
        const keywords = firstLine.slice(1);
        const content = sectionTrimmed.replace(/.*[\r\n]*/, '');
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push({url, content, year, month, type, task, keywords});
    }
}

async function getYears() {
    const arg = argv.find(arg => arg.startsWith('--year='));
    if (arg) {
        return arg.substring(7).split(',').map(year => year.trim());
    } else {
        return (await readdir(BASE_DIR)).filter((x) => !(isNaN(x))).reverse();
    }
}

function formatUrls(url, solutionUrl) {
    const urlRow = (url && isWeb) ?
        `- [Postavka](${BASE_URL}${url})\n` :
        '';
    const solutionUrlRow = (solutionUrl && isWeb) ?
        `- [Rešenje](${BASE_URL}${solutionUrl})\n` :
        '';
    return `${urlRow}${solutionUrlRow}`;
}

function addIndices(keywords){
    return keywords.map(keyword => `\\index{${KEYWORDS[keyword]}}`).join(' ');
}

async function main() {
    let meta = await readFile(`${process.argv[2]}/meta.json`, { encoding : 'utf-8'});
    meta = JSON.parse(meta);
    BASE_DIR = process.argv[2];
    BASE_URL = meta.BASE_URL;
    CATEGORIES = meta.CATEGORIES;
    KEYWORDS = meta.KEYWORDS;

    const categories = {};
    for (const year of await getYears()) {
        for (const month of await readdir(`${BASE_DIR}/${year}`)) {
            for (const typeExt of await readdir(`${BASE_DIR}/${year}/${month}`)) {
                await processFile(year, month, typeExt.split('.')[0], categories);
            }
        }
    }
    // Connect solutions to categories
    const categoriesConnected = {};
    for (const category in categories) {
        const entries = categories[category];
        if (entries.length === 0) {
            continue;
        }
        categoriesConnected[category] = [];
        for (const entry of entries) {
            const {content, type, year, month, task} = entry;
            if (type.endsWith('-sol')) {
                continue;
            }
            const solution = entries.find(
                entry2 => entry2.type === `${type}-sol` &&
                          entry2.year === year &&
                          entry2.month === month &&
                          entry2.task === task
            );
            if (!solution) {
                console.error('No solution for', entry);
                categoriesConnected[category].push({
                    ...entry,
                    solutionUrl: '#nema'
                });
                continue;
            }
            categoriesConnected[category].push({
                ...entry,
                content: `${content}\n\n### Rešenje\n\n${solution.content}`,
                solutionUrl: solution.url
            });
        }
    }
    const header = await readFile(`${BASE_DIR}/header.md`, {
        encoding: 'utf-8'
    });
    const footer = await readFile(`${BASE_DIR}/footer.md`, {
        encoding: 'utf-8'
    });
    const categoryKeys = Object.keys(CATEGORIES);
    await writeFile(
        isWeb ? 'combined-web.md' : 'combined-print.md',
        `${header}${Object.entries(categoriesConnected).sort(
            ([category1], [category2]) => categoryKeys.indexOf(category1) - categoryKeys.indexOf(category2)
        ).map(
            ([category, entries]) => `# ${CATEGORIES[category]}\n${entries.map(
                ({url, content, year, month, type, task, solutionUrl, keywords}) =>
                    `## ${task}. zadatak, ${TYPES[type]}, ${MONTHS[month]} ${year}.\n${addIndices(keywords)}\n\n${formatUrls(url, solutionUrl)}\n${content}`
            ).join('\n\n')}`
        ).join('\n\n\\pagebreak\n')}${footer}`,
        {
            encoding: 'utf-8'
        }
    );
}

main();
