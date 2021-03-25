#!/usr/bin/env node
'use strict';
import {readFile, readdir, writeFile} from 'fs/promises';

const BASE_URL = 'http://os.etf.bg.ac.rs/OS1/kolokvijumi/';
const CATEGORIES = {
    page: 'Stranična organizacija',
    cont: 'Kontinualna alokacija',
    segment: 'Segmentna organizacija',
    segpage: 'Segmentno-stranična organizacija',
    dynload: 'Dinamičko učitavanje',
    overlay: 'Preklopi',
    interrupt: 'Prekidi',
    syscall: 'Sistemski pozivi',
    semaphore: 'Semafori',
    // Same as above?
    concurrency: 'Konkurentnost',
    io: 'Ulaz/izlaz',
    cmd: 'Komandna linija',
    ipc: 'Komunikacija između procesa',
    filesystem: 'Fajl sistem'
};
const MONTHS = ['', 'januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
const TYPES = {
    k: 'kolokvijum',
    k1: 'prvi kolokvijum',
    k2: 'drugi kolokvijum',
    k3: 'treći kolokvijum'
};

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

async function main() {
    const categories = {};
    for (const year of await readdir('md')) {
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
    await writeFile('combined.md', `${header}${Object.entries(categoriesConnected).map(
        ([category, entries]) => `# ${CATEGORIES[category]}\n${entries.map(
            ({url, content, year, month, type, task, solutionUrl}) =>
                `## ${task}. zadatak, ${TYPES[type]}, ${MONTHS[month]} ${year}.\n- [Postavka](${BASE_URL}${url})\n- [Rešenje](${BASE_URL}${solutionUrl})\n\n${content}`
        ).join('\n\n')}`
    ).join('\n\n\\pagebreak\n')}${footer}`, {
        encoding: 'utf-8'
    });
}

main();
