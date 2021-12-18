"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const file_parser_1 = require("./file_parser");
exports.sortDependeces = () => {
    let activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'groovy')
        return;
    let fileText = activeEditor.document.getText();
    activeEditor.edit(editBuilder => {
        let deps = new file_parser_1.default(fileText).dependences();
        const lines = [];
        deps.map((dep) => {
            if (!activeEditor)
                return;
            const range = new vscode.Range(dep.start_line, 0, dep.start_line + 1, 0);
            editBuilder.delete(range);
            lines.push(dep.line);
        });
        lines.sort();
        removeBlanks(lines);
        removeDuplicates(lines);
        lines.push("");
        const position = new vscode.Position(deps[0].start_line, 0);
        editBuilder.insert(position, lines.join('\n'));
    });
};
exports.sortImports = () => {
    let activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'groovy')
        return;
    const importCondition = (text) => { return text.startsWith("import"); };
    return sortLines(activeEditor, importCondition, true);
};
function sortLines(textEditor, condition, addBlanksLines) {
    const lines = [];
    let lastImportLine;
    let firstImportLine;
    for (let i = 0; i <= textEditor.document.lineCount - 1; i++) {
        let text = textEditor.document.lineAt(i).text;
        if (condition(text.replace(/^\s\s*/, ''))) {
            if (firstImportLine == undefined)
                firstImportLine = i;
            lastImportLine = i;
            lines.push(text);
        }
    }
    if (lines.length == 0)
        return;
    lines.sort();
    removeBlanks(lines);
    removeDuplicates(lines);
    if (addBlanksLines)
        addBlanks(lines);
    return textEditor.edit(editBuilder => {
        const range = new vscode.Range(firstImportLine, 0, lastImportLine, textEditor.document.lineAt(lastImportLine).text.length);
        editBuilder.replace(range, lines.join('\n'));
    });
}
function removeBlanks(lines) {
    for (let i = 0; i < lines.length; ++i) {
        if (lines[i].trim() === '') {
            lines.splice(i, 1);
            i--;
        }
    }
}
function removeDuplicates(lines) {
    for (let i = 1; i < lines.length; ++i) {
        if (lines[i - 1] === lines[i]) {
            lines.splice(i, 1);
            i--;
        }
    }
}
function addBlanks(lines) {
    for (let i = 1; i < lines.length; ++i) {
        let lastPackage = lines[i - 1].split(" ")[1].split(".");
        let currentPackage = lines[i].split(" ")[1].split(".");
        if (currentPackage[0] == lastPackage[0]) {
            continue;
        }
        lines.splice(i, 0, "");
        i++;
    }
}
//# sourceMappingURL=sort_lines.js.map