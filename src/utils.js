export const PI2 = Math.PI * 2;

export function normalizeRadians(rad) {
    return ((rad + Math.PI) % PI2) - Math.PI
}

// I found this on the internet
export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const COLORS = [
    // '#fc5c65',
    '#fd9644',
    // '#fed330',
    '#26de81',
    // '#2bcbba',
    '#eb3b5a',
    // '#fa8231',
    // '#f7b731',
    // '#20bf6b',
    // '#0fb9b1',
    '#45aaf2',
    // '#4b7bec',
    '#a55eea',
    '#fff',
    // '#778ca3',
    // '#2d98da',
    // '#3867d6',
    // '#8854d0',
    // '#a5b1c2',
    // '#4b6584',
];

export function colorFromName(name) {
    let nr = name
        .split("")
        .map(x => (x.charCodeAt(0) - 97))
        .reduce((a, b) => a + b);

    return COLORS[nr % COLORS.length];
}