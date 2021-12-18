"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const file_parser_1 = require("./file_parser");
class GroovyDocumentSymbolProvider {
    constructor() { }
    provideDocumentSymbols(document, token) {
        let fileText = document.getText();
        let symbol_informations = new file_parser_1.default(fileText, token, document).symbol_informations();
        return symbol_informations.map((symbol_information) => {
            const { name, type, start_line, end_line } = symbol_information;
            const symbolKinds = {
                "class": vscode_1.SymbolKind.Class,
                "def": vscode_1.SymbolKind.Function,
                "public": vscode_1.SymbolKind.Function,
                "private": vscode_1.SymbolKind.Function,
                "protected": vscode_1.SymbolKind.Function
            };
            var rage = new vscode_1.Range(new vscode_1.Position(start_line, 0), new vscode_1.Position(end_line, 0));
            return new vscode_1.SymbolInformation(name, symbolKinds[type], rage);
        });
    }
}
exports.default = GroovyDocumentSymbolProvider;
//# sourceMappingURL=groovy_document_symbol_provider.js.map