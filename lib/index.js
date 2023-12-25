"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMin = exports.getMax = void 0;
var lodash_1 = require("lodash");
function getMin(array) {
    return array.reduce(function (acc, value) {
        return (0, lodash_1.isNil)(value) ? acc : (0, lodash_1.isNil)(acc) ? value : acc < value ? acc : value;
    }, null);
}
exports.getMin = getMin;
function getMax(array) {
    return array.reduce(function (acc, value) {
        return (0, lodash_1.isNil)(value) ? acc : (0, lodash_1.isNil)(acc) ? value : acc > value ? acc : value;
    }, null);
}
exports.getMax = getMax;
//# sourceMappingURL=index.js.map