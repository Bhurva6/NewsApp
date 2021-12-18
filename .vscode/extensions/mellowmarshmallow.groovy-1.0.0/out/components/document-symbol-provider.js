"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroovyDocumentSymbolProvider = void 0;
const vscode = require("vscode");
const utils = require("../lib/utility");
//
// --- internal variables ----------------------------------------
//
const patterns = {
    function: new RegExp(`^(${utils.types.join('|')})\\s+[a-zA-Z_]\\w*\\s*\\(.*\\)`),
    variable: new RegExp(`(${utils.types.join('|')})\\s+[a-zA-Z_]\\w*\\s*=`),
    functionEnd: /^}/
};
//
// --- utility functions ----------------------------------------
//
function getChunks(line) {
    return line.split(' ').filter(element => !element.match(/\s+/));
}
function createPosition(line, character) {
    return new vscode.Position(line, character);
}
function createRange(start, end) {
    return new vscode.Range(start, end);
}
function createDocumentSymbol(name, details, kind, range, selectionRange) {
    return new vscode.DocumentSymbol(name, details, kind, range, selectionRange);
}
//
// --- main implementation ----------------------------------------
//
function getDocumentSymbols(document) {
    let symbols = [];
    const documentEndPosition = document.lineAt(document.lineCount - 1).range.end;
    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
        let raw = document.lineAt(lineNumber);
        let line = raw.text;
        if (raw.isEmptyOrWhitespace || line.trimStart().startsWith('//')) {
            continue;
        }
        let name;
        let details;
        let kind;
        let range;
        let selectionRange;
        // check if line contains a field declaration
        // assume that fields are declared in the global space of the script
        if (line.startsWith('@groovy.transform.Field')) {
            //* @groovy.transform.Field <type> <name>
            name = getChunks(line)[2];
            details = '';
            kind = vscode.SymbolKind.Field;
            // used globally
            range = createRange(createPosition(0, 0), documentEndPosition);
            selectionRange = raw.range;
            symbols.push(createDocumentSymbol(name, details, kind, range, selectionRange));
        }
        // check if line contains a function declaration
        // assume that functions are declared in the global space of the script
        else if (line.match(patterns.function)) {
            //* def <name> (<parameters>)
            // convert 'name()' to 'name' if applicable
            name = getChunks(line)[1].split('(')[0];
            //TODO add <type> and <parameters> to details (?)
            details = '';
            kind = vscode.SymbolKind.Function;
            // used globally
            range = createRange(createPosition(0, 0), documentEndPosition);
            // edge case for 'placeholder' functions: def <name> (<parameters>) {}
            if (line.match(/{\s*}/)) {
                selectionRange = raw.range;
                symbols.push(createDocumentSymbol(name, details, kind, range, selectionRange));
            }
            // go through function block and find variables
            else {
                const startPosition = createPosition(lineNumber, 0);
                let variableDetails = [];
                lineNumber++;
                // add condition (should never trigger unless source is incorrectly formatted)
                while (lineNumber < document.lineCount) {
                    raw = document.lineAt(lineNumber);
                    line = raw.text;
                    // check if line contains a variable declaration
                    if (line.match(patterns.variable)) {
                        //* def <name> =
                        variableDetails.push({
                            name: getChunks(line.trim())[1],
                            details: '',
                            kind: vscode.SymbolKind.Variable,
                            selectionRange: raw.range
                        });
                    }
                    // check if line is end of function
                    else if (line.match(patterns.functionEnd)) {
                        // create function document symbol
                        selectionRange = createRange(startPosition, createPosition(lineNumber, 0));
                        let functionSymbol = createDocumentSymbol(name, details, kind, range, selectionRange);
                        // add the variables as children
                        variableDetails.forEach(variable => {
                            functionSymbol.children.push(createDocumentSymbol(variable.name, variable.details, variable.kind, selectionRange, variable.selectionRange));
                        });
                        symbols.push(functionSymbol);
                        break;
                    }
                    lineNumber++;
                }
            }
        }
    }
    return symbols;
}
//
// --- export ----------------------------------------
//
class GroovyDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return getDocumentSymbols(document);
    }
}
exports.GroovyDocumentSymbolProvider = GroovyDocumentSymbolProvider;
//# sourceMappingURL=document-symbol-provider.js.map