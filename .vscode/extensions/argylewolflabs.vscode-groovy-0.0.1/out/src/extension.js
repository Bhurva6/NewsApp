"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const groovy_document_symbol_provider_1 = require("./groovy_document_symbol_provider");
function activate(context) {
    console.log("groovy symbols active v 0.0.1");
    var selector = {
        language: 'groovy',
        scheme: 'file'
    };
    context.subscriptions.push(vscode_1.languages.registerDocumentSymbolProvider(selector, new groovy_document_symbol_provider_1.default));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map