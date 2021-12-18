"use strict";
// Example
// {
//   name: "some_method",
//   type: "def",
//   start_line: 2,
//   end_line: 5
// }
Object.defineProperty(exports, "__esModule", { value: true });
class CodeBlock {
    isComplete() {
        return this.start_line && this.end_line;
    }
}
class FileParser {
    constructor(fileText, token, document) {
        this.fileText = fileText;
        this.lines = this.fileText.split("\n");
    }
    symbol_informations() {
        var blocks = [];
        var stack = [];
        this.lines.forEach((line, index) => {
            let lineParse = new LineParse(line);
            if (lineParse.isBlock()) {
                let blockType = lineParse.getBlockType();
                var block = {
                    name: lineParse.getBlockName(blockType),
                    start_line: index,
                    type: blockType,
                    end_line: index
                };
                blocks = [...blocks, block];
            }
        });
        return this.getPermitedBlocks(blocks);
    }
    getPermitedBlocks(blocks) {
        return blocks.filter((block) => (block.end_line && _.includes(["def", "class"], block.type)));
    }
}
exports.default = FileParser;
const blockTypes = ["class", "def"];
const functionRegEx = /(def|public|private|protected|boolean|double|string|int|long|integer)+\s+\w*\s*[a-z]*\(.*\).\{/i;
class LineParse {
    constructor(line) { this.line = line; }
    isAClassBlock() { return /class /.test(this.line); }
    isAFunctionBlock() {
        return this.line.match(functionRegEx);
    }
    isBlock() {
        return (this.isAClassBlock() ||
            this.isAFunctionBlock());
    }
    getBlockType() {
        if (this.isAClassBlock()) {
            return "class";
        }
        if (this.isAFunctionBlock()) {
            return "def";
        }
        return undefined;
    }
    getBlockName(blockType) {
        if (blockType == "class") {
            return this.line.replace("class", "").replace("{", "").trim();
        }
        if (blockType == "def") {
            let name = this.line.split('(')[0].replace(/(def|public|private|protected)/i, "").trim();
            return name;
        }
        return undefined;
    }
}
const _ = {
    includes: (array, value) => (array.indexOf(value) != -1)
};
//# sourceMappingURL=file_parser.js.map