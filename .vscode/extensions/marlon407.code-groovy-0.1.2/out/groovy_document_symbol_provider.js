"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const file_parser_1 = require("./file_parser");
class GoDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        let fileText = document.getText();
        let symbol_informations = new file_parser_1.default(fileText).symbol_informations();
        return symbol_informations.map((symbol_information) => {
            const { name, type, start_line, end_line } = symbol_information;
            const symbolKinds = {
                "class": vscode.SymbolKind.Class,
                "def": vscode.SymbolKind.Function,
                "public": vscode.SymbolKind.Function,
                "private": vscode.SymbolKind.Function,
                "protected": vscode.SymbolKind.Function
            };
            var rage = new vscode.Range(new vscode.Position(start_line, 0), new vscode.Position(end_line, 0));
            return new vscode.SymbolInformation(name, symbolKinds[type], rage);
        });
    }
}
exports.default = GoDocumentSymbolProvider;
//# sourceMappingURL=groovy_document_symbol_provider.js.map