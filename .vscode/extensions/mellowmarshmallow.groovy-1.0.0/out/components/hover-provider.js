"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroovyHoverProvider = void 0;
const vscode = require("vscode");
const utils = require("../lib/utility");
//
// --- utility functions ----------------------------------------
//
function createMarkdownString() {
    return new vscode.MarkdownString();
}
function createHoverObject(contents) {
    return new vscode.Hover(contents);
}
function searchForFunction(document, word) {
    //* <type> <name> (<args>)
    const pattern = new RegExp(`^(${utils.types.join('|')})\\s+${word}\\s*\\(.*\\)`);
    for (let i = 0; i < document.lineCount; i++) {
        const curr = document.lineAt(i).text;
        if (curr.match(pattern)) {
            const mdString = createMarkdownString();
            // remove opening curly braces (if possible)
            mdString.appendCodeblock(curr.split('{')[0], 'groovy');
            return createHoverObject(mdString);
        }
    }
    return undefined;
}
function searchForField(document, word) {
    //* @groovy.transfrom.Field <type> <name>
    const pattern = new RegExp(`^@groovy.transform.Field\\s+(${utils.types.join('|')})\\s+${word}`);
    for (let i = 0; i < document.lineCount; i++) {
        const curr = document.lineAt(i).text;
        if (curr.match(pattern)) {
            const mdString = createMarkdownString();
            // remove semicolon (if possible)
            mdString.appendCodeblock(curr.split(';')[0], 'groovy');
            return createHoverObject(mdString);
        }
    }
    return undefined;
}
//
// --- main implementation ----------------------------------------
//
function getHoverObject(document, line, word) {
    return __awaiter(this, void 0, void 0, function* () {
        // patterns for matching functions: '<name> (<args>)' and '.&<name>'
        const functionCallPattern = new RegExp(`${word}\\s*\\(.*\\)`);
        const functionPassPattern = new RegExp(`\\.&${word}`);
        if (line.match(functionCallPattern) || line.match(functionPassPattern)) {
            return searchForFunction(document, word);
        }
        // pattern for matching fields (assume all UPPERCASE)
        const fieldPattern = new RegExp(`[A-Z_][A-Z0-9_]*`);
        if (word.match(fieldPattern)) {
            return searchForField(document, word);
        }
        //TODO add support for (local) variables
        return undefined;
    });
}
//
// --- export ----------------------------------------
//
class GroovyHoverProvider {
    provideHover(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO add support for Groovy string interpolation
            const word = utils.getWord(document, position);
            // check whitespace since word could be entire document...
            if (word === undefined || word.includes(' ')) {
                return undefined;
            }
            const uris = yield vscode.workspace.findFiles('**/*.{groovy,gvy}');
            const documents = yield Promise.all(uris.map((uri) => vscode.workspace.openTextDocument(uri)));
            const hovers = yield Promise.all(documents.map((doc) => getHoverObject(doc, document.lineAt(position.line).text, word)));
            const hover = hovers.find((hover) => hover !== undefined);
            return hover === undefined ? undefined : hover;
        });
    }
}
exports.GroovyHoverProvider = GroovyHoverProvider;
//# sourceMappingURL=hover-provider.js.map