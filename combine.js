#!/usr/bin/env node
'use strict';
import {readFile, readdir, writeFile} from 'fs/promises';
import {argv} from 'process';

const MONTHS = ['', 'januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
const TYPES = {
    k: 'kolokvijum',
    k1: 'prvi kolokvijum',
    k2: 'drugi kolokvijum',
    k3: 'treći kolokvijum'
};
const isWeb = !process.argv.includes('--print');
const ALL_DIRECTORIES = ['os1', 'os2'];

async function processFile(year, month, type, categories, baseDir) {
    const text = await readFile(`${baseDir}/${year}/${month}/${type}.md`, {
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

async function getYears(baseDir) {
    const arg = argv.find(arg => arg.startsWith('--year='));
    if (arg) {
        return arg.substring(7).split(',').map(year => year.trim());
    } else {
        return (await readdir(baseDir)).filter((x) => !(isNaN(x))).reverse();
    }
}

function formatUrls(url, solutionUrl, baseUrl) {
    const urlRow = (url && isWeb) ?
        `- [Postavka](${baseUrl}${url})\n` :
        '';
    const solutionUrlRow = (solutionUrl && isWeb) ?
        `- [Rešenje](${baseUrl}${solutionUrl})\n` :
        '';
    return `${urlRow}${solutionUrlRow}`;
}

async function processDirectory(baseDir) {
    const meta = JSON.parse(await readFile(`${baseDir}/meta.json`, {
        encoding : 'utf-8'
    }));
    const {baseUrl} = meta;

    const categories = {};
    for (const year of await getYears(baseDir)) {
        for (const month of await readdir(`${baseDir}/${year}`)) {
            for (const typeExt of await readdir(`${baseDir}/${year}/${month}`)) {
                await processFile(year, month, typeExt.split('.')[0], categories, baseDir);
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
    const header = await readFile(`${baseDir}/header.md`, {
        encoding: 'utf-8'
    });
    const footer = await readFile(`${baseDir}/footer.md`, {
        encoding: 'utf-8'
    });
    const categoryKeys = Object.keys(meta.categories);
    await writeFile(
        isWeb ? `web.md` : `print.md`,
        `${header}${Object.entries(categoriesConnected).sort(
            ([category1], [category2]) => categoryKeys.indexOf(category1) - categoryKeys.indexOf(category2)
        ).map(
            ([category, entries]) => `# ${meta.categories[category]}\n${entries.map(
                ({url, content, year, month, type, task, solutionUrl, keywords}) =>
                    `## ${task}. zadatak, ${TYPES[type]}, ${MONTHS[month]} ${year}.\n${
                        keywords
                            .map(kw => `\\index{${meta.keywords[kw]}}`)
                            .join(' ')
                    }\n\n${formatUrls(url, solutionUrl, baseUrl)}\n${content}`
            ).join('\n\n')}`
        ).join('\n\n\\pagebreak\n')}${footer}`,
        {
            encoding: 'utf-8'
        }
    );
}

async function main() {
    const dirArg = process.argv[2];
    if (dirArg && !dirArg.startsWith('--')) {
        await processDirectory(dirArg);
    } else {
        for (const dir of ALL_DIRECTORIES) {
            await processDirectory(dir);
        }
    }
}

main();
