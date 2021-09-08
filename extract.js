#!/usr/bin/env node
'use strict';
import {appendFile, readdir} from 'fs/promises';
import {getText} from 'any-text';

const SEPARATOR = Array(81).join('-');

async function main() {
    const subject = process.argv[2];
    if (!subject) {
        console.error('Please provide the subject you are extracting!');
        return;
    }
    for (const year of await readdir(`pdf/${subject}`)) {
        for (const month of await readdir(`pdf/${subject}/${year}`)) {
            for (const typeExt of await readdir(`pdf/${subject}/${year}/${month}`)) {
                const [type] = typeExt.split('.');
                const text = await getText(`pdf/${subject}/${year}/${month}/${typeExt}`);
                await appendFile(`${subject}/${year}/${month}/${type}.md`, `${SEPARATOR}\n${text}`, {
                    encoding: 'utf-8'
                });
            }
        }
    }
}

main();
