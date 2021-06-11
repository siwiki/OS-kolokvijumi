#!/usr/bin/env node
'use strict';
import {readFile, readdir, writeFile} from 'fs/promises';
import {argv} from 'process';

const BASE_URL = 'http://os.etf.bg.ac.rs/OS1/kolokvijumi/';
const CATEGORIES = {
    linker: 'Kompajler/linker',
    page: 'Stranična organizacija',
    cont: 'Kontinualna alokacija',
    segment: 'Segmentna organizacija',
    segpage: 'Segmentno-stranična organizacija',
    dynload: 'Dinamičko učitavanje',
    overlay: 'Preklopi',
    interrupt: 'Prekidi',
    syscall: 'Sistemski pozivi',
    thread: 'Interfejs niti',
    context: 'Promena konteksta',
    semimpl : 'Sinhronizacija procesa (implementacija)',
    semintr : 'Sinhronizacija procesa (interfejs)',
    buffer: 'Baferi, proizvođač/potrošač',
    io: 'Ulaz/izlaz',
    ioblock: 'Ulaz/izlaz (blokovski uređaji)',
    cmd: 'Komandna linija',
    fsintr: 'Fajl sistem (interfejs)',
    fsimpl: 'Fajl sistem (implementacija)',
    os : 'Uvod u operativne sisteme'
};
const MONTHS = ['', 'januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
const TYPES = {
    k: 'kolokvijum',
    k1: 'prvi kolokvijum',
    k2: 'drugi kolokvijum',
    k3: 'treći kolokvijum'
};
const isWeb = !process.argv.includes('--print');

async function processFile(year, month, type, categories) {
    const text = await readFile(`md/${year}/${month}/${type}.md`, {
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
        const category = sectionTrimmed.split('\n', 1)[0].trim();
        const content = sectionTrimmed.replace(/.*[\r\n]*/, '');
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push({url, content, year, month, type, task});
    }
}

async function getYears() {
    const arg = argv.find(arg => arg.startsWith('--year='));
    if (arg) {
        return arg.substring(7).split(',').map(year => year.trim());
    } else {
        return (await readdir('md')).reverse();
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

async function main() {
    const categories = {};
    for (const year of await getYears()) {
        for (const month of await readdir(`md/${year}`)) {
            for (const typeExt of await readdir(`md/${year}/${month}`)) {
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
    const header = await readFile('header.md', {
        encoding: 'utf-8'
    });
    const footer = await readFile('footer.md', {
        encoding: 'utf-8'
    });
    const categoryKeys = Object.keys(CATEGORIES);
    await writeFile(
        isWeb ? 'combined-web.md' : 'combined-print.md',
        `${header}${Object.entries(categoriesConnected).sort(
            ([category1], [category2]) => categoryKeys.indexOf(category1) - categoryKeys.indexOf(category2)
        ).map(
            ([category, entries]) => `# ${CATEGORIES[category]}\n${entries.map(
                ({url, content, year, month, type, task, solutionUrl}) =>
                    `## ${task}. zadatak, ${TYPES[type]}, ${MONTHS[month]} ${year}.\n${formatUrls(url, solutionUrl)}\n${content}`
            ).join('\n\n')}`
        ).join('\n\n\\pagebreak\n')}${footer}`,
        {
            encoding: 'utf-8'
        }
    );
}

main();
