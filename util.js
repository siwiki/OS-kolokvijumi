import {readFile} from 'fs/promises';

const DIRECTORY_REGEX = /<img src="\/icons\/[^"]+" alt="\[([^\]]+)\]">(?:<\/td><td>)?\s*<a href="([^"]+)">[^<]+<\/a>(?:<\/td><td align="right">)?\s*(\d+-(?:\w{3}|\d+)-\d+ \d+:\d+)/g;
export const ALL_DIRECTORIES = ['os1', 'os2'];

export function parseDirectoryListing(content) {
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

export async function readJSON(path) {
    return JSON.parse(await readFile(path, {
        encoding : 'utf-8'
    }));
}
