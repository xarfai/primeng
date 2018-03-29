"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var CodeHighlighter = (function () {
    function CodeHighlighter(el) {
        this.el = el;
    }
    CodeHighlighter.prototype.ngOnInit = function () {
        if (window['Prism']) {
            window['Prism'].highlightElement(this.el.nativeElement);
        }
    };
    CodeHighlighter.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[pCode]'
                },] },
    ];
    /** @nocollapse */
    CodeHighlighter.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
    ]; };
    return CodeHighlighter;
}());
exports.CodeHighlighter = CodeHighlighter;
var CodeHighlighterModule = (function () {
    function CodeHighlighterModule() {
    }
    CodeHighlighterModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    exports: [CodeHighlighter],
                    declarations: [CodeHighlighter]
                },] },
    ];
    /** @nocollapse */
    CodeHighlighterModule.ctorParameters = function () { return []; };
    return CodeHighlighterModule;
}());
exports.CodeHighlighterModule = CodeHighlighterModule;
//# sourceMappingURL=codehighlighter.js.map