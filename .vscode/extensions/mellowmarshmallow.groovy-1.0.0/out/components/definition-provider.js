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
exports.GroovyDefinitionProvider = void 0;
const vscode = require("vscode");
const utils = require("../lib/utility");
//
// --- utility functions ----------------------------------------
//
function createPosition(line, character) {
    return new vscode.Position(line, character);
}
function createDefinition(uri, range) {
    return new vscode.Location(uri, range);
}
//
// --- main implementation ----------------------------------------
//
function getDefinition(document, word) {
    return __awaiter(this, void 0, void 0, function* () {
        // search for declaration containing word inside the document
        //* <type> <name>
        const pattern = new RegExp(`(${utils.types.join('|')})\\s+${word}`);
        for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
            const line = document.lineAt(lineNumber).text;
            if (line.match(pattern)) {
                return createDefinition(document.uri, createPosition(lineNumber, line.indexOf(word)));
            }
        }
        return undefined;
    });
}
//
// --- export ----------------------------------------
//
class GroovyDefinitionProvider {
    provideDefinition(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            //* limitations: returns the first occurrence of a matching declaration (i.e. doesn't care about type)
            const word = utils.getWord(document, position);
            if (word === undefined) {
                return undefined;
            }
            const uris = yield vscode.workspace.findFiles('**/*.{groovy,gvy}');
            const documents = yield Promise.all(uris.map((uri) => vscode.workspace.openTextDocument(uri)));
            const locations = yield Promise.all(documents.map((doc) => getDefinition(doc, word)));
            const location = locations.find((location) => location !== undefined);
            return location === undefined ? undefined : location;
        });
    }
}
exports.GroovyDefinitionProvider = GroovyDefinitionProvider;
//# sourceMappingURL=definition-provider.js.map