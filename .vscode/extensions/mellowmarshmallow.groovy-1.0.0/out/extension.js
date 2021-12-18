"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const document_symbol_provider_1 = require("./components/document-symbol-provider");
const definition_provider_1 = require("./components/definition-provider");
const hover_provider_1 = require("./components/hover-provider");
function activate(context) {
    //! console.log('Congratulations, your extension "groovy-plugin" is now active!');
    const selector = { scheme: 'file', language: 'groovy' };
    context.subscriptions.push(...[
        vscode.languages.registerDocumentSymbolProvider(selector, new document_symbol_provider_1.GroovyDocumentSymbolProvider()),
        vscode.languages.registerDefinitionProvider(selector, new definition_provider_1.GroovyDefinitionProvider()),
        vscode.languages.registerHoverProvider(selector, new hover_provider_1.GroovyHoverProvider())
    ]);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map