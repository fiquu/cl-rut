"use strict";

var GROUP_REGEX = /(\d)(?=(\d{3})+\b)/g;

var CLEAN_REGEX = /[^\dk]+/gi;

var DIGITS_REGEX = /\D+/g;

var GROUP_REPLACE = "$1.";

var EMPTY = "";

var DASH = "-";

var K = "k";

function clean(value, parts) {
    value = String(value).replace(CLEAN_REGEX, EMPTY);
    var verifier = value.substr(-1, 1);
    var digits = value.substr(0, value.length - 1).replace(DIGITS_REGEX, EMPTY);
    if (parts) {
        return [ digits, verifier ];
    }
    return digits + verifier;
}

function format(value) {
    value = clean(value);
    if (value.length < 3) {
        return value;
    }
    var parts = clean(value, true);
    parts[0] = parts[0].replace(GROUP_REGEX, GROUP_REPLACE);
    return parts.join(DASH);
}

function validate(value) {
    if (!value || !String(value).length) {
        return true;
    }
    var parts = clean(value, true);
    var verifier = parts[1];
    var digits = parts[0];
    var m = 0;
    var r = 1;
    if (isNaN(verifier)) {
        verifier = K;
    }
    for (;digits; digits = Math.floor(parseInt(digits) / 10)) {
        r = (r + digits % 10 * (9 - m++ % 6)) % 11;
    }
    if (r) {
        return verifier === String(r - 1);
    }
    return verifier === K;
}

module.exports = {
    validate: validate,
    format: format,
    clean: clean
};