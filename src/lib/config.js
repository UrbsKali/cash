// @ts-nocheck
import { dev } from '$app/environment';

let basePath = ''


if (dev) {
    basePath = ""
}

export const config = {
    basePath: basePath
};

export function currentOrigin() {
    return window.location.origin + basePath;
}

export function parseURI(uri) {
    if (typeof uri == 'string') return basePath + uri;
    else {
        // go recusively and check each uri props 
        uri.forEach(element => {
            if (element.uri) element.uri = parseURI(element.uri);
            if (element.sub) element.sub = parseURI(element.sub);
        });
        return uri
    }
}