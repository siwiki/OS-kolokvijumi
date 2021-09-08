#!/usr/bin/env node
'use strict';
import {rename, readdir} from 'fs/promises';

const FILE_REGEX = /^(\d+)-(\d+)-(.+)\.pdf$/;

async function main() {
    for (const file of await readdir('doc2pdf')) {
        const [_, year, month, type] = FILE_REGEX.exec(file);
        await rename(`doc2pdf/${file}`, `pdf/${process.argv[2]}/${year}/${month}/${type}.pdf`);
    }
}

main();
