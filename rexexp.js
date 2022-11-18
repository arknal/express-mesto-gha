const regExp = /^http?:\/\/(?:www\.?)/;
const reg = /^http?:\/\/(?:www\.)?[a-zA-Z0-9а-яА-я-]{1,}\.[a-zA-Zа-яА-я]{1,}\b(?:[a-zA-Z0-9._~:/?#[]@!\$&'()\*+,;=-])*/;
console.log('http://ya./path/to/deep/$$$$$$'.search(reg));
