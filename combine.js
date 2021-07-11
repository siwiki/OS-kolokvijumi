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
const KEYWORDS = {
    pthreads : 'Sinhronizacija!POSIX niti',
    psemaphore : 'Sinhronizacija!POSIX semafori',
    lnk_scndPass : 'Linker!Drugi prolaz',
    lnk_firstPass : 'Linker!Prvi prolaz',
    setjmp : 'setjmp',
    longjmp : 'longjmp',
    cont_shr_mem_rel : 'Kontinualna alokacija!shrink uz mem/free i relocate',
    cont_re_bfree : 'Kontinualna alokacija!realocate iza je prazno',
    cont_tabl : 'Kontinualna alokacija!tablica',
    cont_extend : 'Kontinualna alokacija!extend uz mem allocate, free, copy',
    cont_komp : 'Kontinualna alokacija!kompakcija',
    cont_free_bf : 'Kontinualna alokacija!free uz spajanje iza i ispred',
    cont_extend_aloc : 'Kontinualna alokacija!extend uz alloc',
    cont_extend_free : 'Kontinualna alokacija!extend iz slobodnog',
    cont_bestFit : 'Kontinualna alokacija!best fit',
    cont_firstFit : 'Kontinualna alokacija!first fit',
    cont_worstFit : 'Kontinualna alokacija!worst fit',
    cont_rel : 'Kontinualna alokacija!relocate',
    segpg_fsd : 'Segmentno-stranična!find seg desc',
    segpg_hpf : 'Segmentno-stranična!handle page fault',
    segpg_va : 'Segmentno-stranična!VA',
    segpg_fa : 'Segmentno-stranična!FA',
    segpg_teorija : 'Segmentno-stranična!teorija', 
    dynload_lm : 'Dinamičko učitavanje!load module',
    dynload_dlarr_otBlck : 'Dinamičko učitavanje!DLArray 1 u 2 bloka',
    dynload_georeg : 'Dinamičko učitavanje!GeoRegion',
    overlay_cotf : 'Preklopi!ciklična obrada u 2 faze',
    overlay_ensure : 'Preklopi!ensure overlay',
    overlay_axb : 'Preklopi!AxB=C',
    overlay_dlarr_impl : 'Preklopi!implementacija DLArray',
    overlay_syscall_asm : 'Preklopi!syscall asembler',
    syscall_crt_thr_run : 'create thread rekurzivno i zameni run',
    syscall_fork : 'fork',
    syscall_tree : 'stablo',
    syscall_spawn : 'spawn',
    thread_join : 'thread join',
    thread_arg : 'thread arg proširenje',
    thread_arr : 'niz od N da se podeli u K niti',
    thread_pipe : 'pipe',
    thread_bin_search : 'binarni search niz u threads',
    thread_asm : 'asembler',
    thread_opt : 'optimistička kontrola konkurentnosti',
    thread_lav : 'lavirint',
    context_wc : 'čekanje dece',
    context_hdlrs : 'handler',
    context_sig : 'signal',
    context_disp : 'dispatch',
    context_cre_thr : 'create thread',
    context_yield_disp : 'yield dispatch',
    context_yield : 'yield',
    context_append : 'append',
    context_resume : 'resume',
    context_ter: 'teorija tablica',
    context_sus : 'suspend',
    semimpl_spinlck : 'spin lock',
    semimpl_busy_wait : 'busy wait',
    semimpl_mutex : 'mutex',
    semimpl_ext_event : 'external event',
    buffer_int : 'naizmenično čekanje',
    buffer_bounded : 'bounded buffer'
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

function addIndices(keywords){
    return keywords.map(keyword => `\\index{${KEYWORDS[keyword]}}`).join(' ');
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
