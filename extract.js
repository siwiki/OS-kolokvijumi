#!/usr/bin/env node
'use strict';
import {appendFile, readdir} from 'fs/promises';
import {getText} from 'any-text';

const SEPARATOR = Array(81).join('-');

async function main() {
    for (const year of await readdir('pdf')) {
        for (const month of await readdir(`pdf/${year}`)) {
            for (const typeExt of await readdir(`pdf/${year}/${month}`)) {
                const [type] = typeExt.split('.');
                const text = await getText(`pdf/${year}/${month}/${typeExt}`);
                await appendFile(`md/${year}/${month}/${type}.md`, `${SEPARATOR}\n${text}`, {
                    encoding: 'utf-8'
                });
            }
        }
    }
}

main();
