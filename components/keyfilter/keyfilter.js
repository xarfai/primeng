"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var domhandler_1 = require("../dom/domhandler");
var forms_1 = require("@angular/forms");
exports.KEYFILTER_VALIDATOR = {
    provide: forms_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return KeyFilter; }),
    multi: true
};
var KeyFilter = (function () {
    function KeyFilter(el, domHandler) {
        this.el = el;
        this.domHandler = domHandler;
    }
    Object.defineProperty(KeyFilter.prototype, "pattern", {
        get: function () {
            return this._pattern;
        },
        set: function (_pattern) {
            this._pattern = _pattern;
            this.regex = KeyFilter.DEFAULT_MASKS[this._pattern] || this._pattern;
        },
        enumerable: true,
        configurable: true
    });
    KeyFilter.prototype.isNavKeyPress = function (e) {
        var k = e.keyCode;
        k = this.domHandler.getBrowser().safari ? (KeyFilter.SAFARI_KEYS[k] || k) : k;
        return (k >= 33 && k <= 40) || k == KeyFilter.KEYS.RETURN || k == KeyFilter.KEYS.TAB || k == KeyFilter.KEYS.ESC;
    };
    ;
    KeyFilter.prototype.isSpecialKey = function (e) {
        var k = e.keyCode;
        var c = e.charCode;
        return k == 9 || k == 13 || k == 27 || k == 16 || k == 17 || (k >= 18 && k <= 20) ||
            (this.domHandler.getBrowser().opera && !e.shiftKey && (k == 8 || (k >= 33 && k <= 35) || (k >= 36 && k <= 39) || (k >= 44 && k <= 45)));
    };
    KeyFilter.prototype.getKey = function (e) {
        var k = e.keyCode || e.charCode;
        return this.domHandler.getBrowser().safari ? (KeyFilter.SAFARI_KEYS[k] || k) : k;
    };
    KeyFilter.prototype.getCharCode = function (e) {
        return e.charCode || e.keyCode || e.which;
    };
    ;
    KeyFilter.prototype.onKeyPress = function (e) {
        if (this.pValidateOnly) {
            return;
        }
        var browser = this.domHandler.getBrowser();
        if (e.ctrlKey || e.altKey) {
            return;
        }
        var k = this.getKey(e);
        if (browser.mozilla && (this.isNavKeyPress(e) || k == KeyFilter.KEYS.BACKSPACE || (k == KeyFilter.KEYS.DELETE && e.charCode == 0))) {
            return;
        }
        var c = this.getCharCode(e);
        var cc = String.fromCharCode(c);
        var ok = true;
        if (browser.mozilla && (this.isSpecialKey(e) || !cc)) {
            return;
        }
        ok = this.regex.test(cc);
        if (!ok) {
            e.preventDefault();
        }
    };
    KeyFilter.prototype.validate = function (c) {
        var value = this.el.nativeElement.value;
        if (!this.regex.test(value)) {
            return {
                validatePattern: false
            };
        }
    };
    KeyFilter.DEFAULT_MASKS = {
        pint: /[\d]/,
        'int': /[\d\-]/,
        pnum: /[\d\.]/,
        money: /[\d\.\s,]/,
        num: /[\d\-\.]/,
        hex: /[0-9a-f]/i,
        email: /[a-z0-9_\.\-@]/i,
        alpha: /[a-z_]/i,
        alphanum: /[a-z0-9_]/i
    };
    KeyFilter.KEYS = {
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        BACKSPACE: 8,
        DELETE: 46
    };
    KeyFilter.SAFARI_KEYS = {
        63234: 37,
        // left
        63235: 39,
        // right
        63232: 38,
        // up
        63233: 40,
        // down
        63276: 33,
        // page up
        63277: 34,
        // page down
        63272: 46,
        // delete
        63273: 36,
        // home
        63275: 35 // end
    };
    KeyFilter.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[pKeyFilter]',
                    providers: [domhandler_1.DomHandler, exports.KEYFILTER_VALIDATOR]
                },] },
    ];
    /** @nocollapse */
    KeyFilter.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: domhandler_1.DomHandler, },
    ]; };
    KeyFilter.propDecorators = {
        "pValidateOnly": [{ type: core_1.Input },],
        "pattern": [{ type: core_1.Input, args: ['pKeyFilter',] },],
        "onKeyPress": [{ type: core_1.HostListener, args: ['keypress', ['$event'],] },],
    };
    return KeyFilter;
}());
exports.KeyFilter = KeyFilter;
var KeyFilterModule = (function () {
    function KeyFilterModule() {
    }
    KeyFilterModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    exports: [KeyFilter],
                    declarations: [KeyFilter]
                },] },
    ];
    /** @nocollapse */
    KeyFilterModule.ctorParameters = function () { return []; };
    return KeyFilterModule;
}());
exports.KeyFilterModule = KeyFilterModule;
//# sourceMappingURL=keyfilter.js.map