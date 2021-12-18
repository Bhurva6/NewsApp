"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWord = exports.isValidName = exports.isKeyword = exports.insideString = exports.insideComment = exports.types = exports.keywords = void 0;
//
// --- export constants ----------------------------------------
//
exports.keywords = [
    'abstract', 'as', 'assert',
    'boolean', 'break', 'byte',
    'case', 'catch', 'char',
    'class', 'const', 'continue',
    'def', 'default', 'do',
    'double', 'else', 'enum',
    'extends', 'false', 'final',
    'finally', 'float', 'for',
    'goto', 'if', 'implements',
    'import', 'in', 'instanceof',
    'int', 'interface', 'long',
    'native', 'new', 'null',
    'package', 'private', 'protected',
    'public', 'return', 'short',
    'static', 'strictfp', 'super',
    'switch', 'synchronized', 'this',
    'threadsafe', 'throw', 'throws',
    'transient', 'true', 'try',
    'void', 'volatile', 'while',
    'Math', 'Integer', 'Float',
    'Double', 'Long', 'BigDecimal',
    'Date', 'Geocode', 'Object',
    'Closure', 'String', 'Set',
    'Array', 'InvokerHelper', 'Exception',
    'Rowbinding'
];
exports.types = [
    'boolean', 'byte', 'char',
    'def', 'double', 'float',
    'int', 'long', 'short',
    'void', 'Object', 'Closure',
    'String', 'List', 'Map'
];
//
// --- export functions ----------------------------------------
//
function insideComment(line) {
    // checks if passed line is an inline comment
    // note that this function does not support multiline commments
    return line.trimStart().startsWith('//');
}
exports.insideComment = insideComment;
function insideString(line, offset) {
    line = line.slice(0, offset + 1).trim();
    let stringIdentifier = '';
    let inString = false;
    for (let i = 0; i < line.length; i++) {
        const curr = line[i];
        // check if current character matches a string identifier
        if (stringIdentifier === '' && ['"', "'"].includes(curr)) {
            stringIdentifier = curr;
        }
        // check if string identifier is set and it is being escaped
        else if (stringIdentifier !== '' && curr === '\\' && line[i + 1] === stringIdentifier) {
            i++;
        }
        if (curr === stringIdentifier) {
            inString = !inString;
        }
    }
    return inString || line[line.length - 1] === stringIdentifier;
}
exports.insideString = insideString;
function isKeyword(word) {
    return exports.keywords.includes(word);
}
exports.isKeyword = isKeyword;
function isValidName(word) {
    return word.trim().match(/^[a-zA-Z_]\w*$/) !== null;
}
exports.isValidName = isValidName;
function getWord(document, position) {
    const line = document.lineAt(position.line).text;
    if (insideComment(line) || insideString(line, position.character)) {
        return undefined;
    }
    const wordRange = document.getWordRangeAtPosition(position);
    if (wordRange === undefined) {
        return undefined;
    }
    const word = document.getText(wordRange);
    if (isKeyword(word) || !isValidName(word)) {
        return undefined;
    }
    return word;
}
exports.getWord = getWord;
//# sourceMappingURL=utility.js.map