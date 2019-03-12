export const top = arr => arr[arr.length - 1];
export const first = arr => arr[0];
export const forget = (id, arr) => arr.filter(item => item.id !== id);
export const snip = arr => arr.splice(-1, 1);
