"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../src/helpers");
describe('testing authentication', function () {
    test('empty string should result in some string', function () {
        expect(!(0, helpers_1.authentication)('', '')).toBe('');
    });
});
