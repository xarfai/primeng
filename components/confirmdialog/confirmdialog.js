"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var common_1 = require("@angular/common");
var domhandler_1 = require("../dom/domhandler");
var shared_1 = require("../common/shared");
var button_1 = require("../button/button");
var confirmationservice_1 = require("../common/confirmationservice");
var ConfirmDialog = (function () {
    function ConfirmDialog(el, domHandler, renderer, confirmationService, zone) {
        var _this = this;
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.confirmationService = confirmationService;
        this.zone = zone;
        this.acceptIcon = 'fa-check';
        this.acceptLabel = 'Yes';
        this.acceptVisible = true;
        this.rejectIcon = 'fa-close';
        this.rejectLabel = 'No';
        this.rejectVisible = true;
        this.closeOnEscape = true;
        this.closable = true;
        this.responsive = true;
        this.subscription = confirmationService.requireConfirmation$.subscribe(function (confirmation) {
            if (confirmation.key === _this.key) {
                _this.confirmation = confirmation;
                _this.message = _this.confirmation.message || _this.message;
                _this.icon = _this.confirmation.icon || _this.icon;
                _this.header = _this.confirmation.header || _this.header;
                _this.rejectVisible = _this.confirmation.rejectVisible == null ? _this.rejectVisible : _this.confirmation.rejectVisible;
                _this.acceptVisible = _this.confirmation.acceptVisible == null ? _this.acceptVisible : _this.confirmation.acceptVisible;
                if (_this.confirmation.accept) {
                    _this.confirmation.acceptEvent = new core_1.EventEmitter();
                    _this.confirmation.acceptEvent.subscribe(_this.confirmation.accept);
                }
                if (_this.confirmation.reject) {
                    _this.confirmation.rejectEvent = new core_1.EventEmitter();
                    _this.confirmation.rejectEvent.subscribe(_this.confirmation.reject);
                }
                _this.visible = true;
            }
        });
    }
    Object.defineProperty(ConfirmDialog.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (val) {
            this._visible = val;
            if (this._visible) {
                if (!this.positionInitialized) {
                    this.center();
                    this.positionInitialized = true;
                }
                this.el.nativeElement.children[0].style.zIndex = ++domhandler_1.DomHandler.zindex;
                this.bindGlobalListeners();
                this.executePostShowActions = true;
            }
            if (this._visible)
                this.enableModality();
            else
                this.disableModality();
        },
        enumerable: true,
        configurable: true
    });
    ConfirmDialog.prototype.ngAfterViewInit = function () {
        this.contentContainer = this.domHandler.findSingle(this.el.nativeElement, '.ui-dialog-content');
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.el.nativeElement);
            else
                this.domHandler.appendChild(this.el.nativeElement, this.appendTo);
        }
    };
    ConfirmDialog.prototype.ngAfterViewChecked = function () {
        if (this.executePostShowActions) {
            this.domHandler.findSingle(this.el.nativeElement.children[0], 'button').focus();
            this.executePostShowActions = false;
        }
    };
    ConfirmDialog.prototype.center = function () {
        var container = this.el.nativeElement.children[0];
        var elementWidth = this.domHandler.getOuterWidth(container);
        var elementHeight = this.domHandler.getOuterHeight(container);
        if (elementWidth == 0 && elementHeight == 0) {
            container.style.visibility = 'hidden';
            container.style.display = 'block';
            elementWidth = this.domHandler.getOuterWidth(container);
            elementHeight = this.domHandler.getOuterHeight(container);
            container.style.display = 'none';
            container.style.visibility = 'visible';
        }
        var viewport = this.domHandler.getViewport();
        var x = (viewport.width - elementWidth) / 2;
        var y = (viewport.height - elementHeight) / 2;
        container.style.left = x + 'px';
        container.style.top = y + 'px';
    };
    ConfirmDialog.prototype.enableModality = function () {
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = this.el.nativeElement.children[0].style.zIndex - 1;
            this.domHandler.addMultipleClasses(this.mask, 'ui-widget-overlay ui-dialog-mask');
            document.body.appendChild(this.mask);
            this.domHandler.addClass(document.body, 'ui-overflow-hidden');
        }
    };
    ConfirmDialog.prototype.disableModality = function () {
        if (this.mask) {
            document.body.removeChild(this.mask);
            this.domHandler.removeClass(document.body, 'ui-overflow-hidden');
            this.mask = null;
        }
    };
    ConfirmDialog.prototype.close = function (event) {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit();
        }
        this.hide();
        event.preventDefault();
    };
    ConfirmDialog.prototype.hide = function () {
        this.visible = false;
        this.unbindGlobalListeners();
    };
    ConfirmDialog.prototype.moveOnTop = function () {
        this.el.nativeElement.children[0].style.zIndex = ++domhandler_1.DomHandler.zindex;
    };
    ConfirmDialog.prototype.bindGlobalListeners = function () {
        var _this = this;
        if (this.closeOnEscape && this.closable && !this.documentEscapeListener) {
            this.documentEscapeListener = this.renderer.listen('document', 'keydown', function (event) {
                if (event.which == 27) {
                    if (_this.el.nativeElement.children[0].style.zIndex == domhandler_1.DomHandler.zindex && _this.visible) {
                        _this.close(event);
                    }
                }
            });
        }
        if (this.responsive) {
            this.zone.runOutsideAngular(function () {
                _this.documentResponsiveListener = _this.center.bind(_this);
                window.addEventListener('resize', _this.documentResponsiveListener);
            });
        }
    };
    ConfirmDialog.prototype.unbindGlobalListeners = function () {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
        if (this.documentResponsiveListener) {
            window.removeEventListener('resize', this.documentResponsiveListener);
            this.documentResponsiveListener = null;
        }
    };
    ConfirmDialog.prototype.ngOnDestroy = function () {
        this.disableModality();
        if (this.documentResponsiveListener) {
            this.documentResponsiveListener();
        }
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
        }
        if (this.appendTo && this.appendTo === 'body') {
            document.body.removeChild(this.el.nativeElement);
        }
        this.subscription.unsubscribe();
    };
    ConfirmDialog.prototype.accept = function () {
        if (this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit();
        }
        this.hide();
        this.confirmation = null;
    };
    ConfirmDialog.prototype.reject = function () {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit();
        }
        this.hide();
        this.confirmation = null;
    };
    ConfirmDialog.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-confirmDialog',
                    template: "\n        <div [ngClass]=\"{'ui-dialog ui-confirmdialog ui-widget ui-widget-content ui-corner-all ui-shadow':true,'ui-dialog-rtl':rtl}\" \n            [style.display]=\"visible ? 'block' : 'none'\" [style.width.px]=\"width\" [style.height.px]=\"height\" (mousedown)=\"moveOnTop()\" [@dialogState]=\"visible ? 'visible' : 'hidden'\">\n            <div class=\"ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top\">\n                <span class=\"ui-dialog-title\" *ngIf=\"header\">{{header}}</span>\n                <a *ngIf=\"closable\" [ngClass]=\"{'ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all':true}\" href=\"#\" role=\"button\" (click)=\"close($event)\">\n                    <span class=\"fa fa-fw fa-close\"></span>\n                </a>\n            </div>\n            <div class=\"ui-dialog-content ui-widget-content\">\n                <i [ngClass]=\"'fa'\" [class]=\"icon\" *ngIf=\"icon\"></i>\n                <span class=\"ui-confirmdialog-message\" [innerHTML]=\"message\"></span>\n            </div>\n            <div class=\"ui-dialog-footer ui-widget-content\" *ngIf=\"footer\">\n                <ng-content select=\"p-footer\"></ng-content>\n            </div>\n            <div class=\"ui-dialog-footer ui-widget-content\" *ngIf=\"!footer\">\n                <button type=\"button\" pButton [icon]=\"acceptIcon\" [label]=\"acceptLabel\" (click)=\"accept()\" [class]=\"acceptButtonStyleClass\" *ngIf=\"acceptVisible\"></button>\n                <button type=\"button\" pButton [icon]=\"rejectIcon\" [label]=\"rejectLabel\" (click)=\"reject()\" [class]=\"rejectButtonStyleClass\" *ngIf=\"rejectVisible\"></button>\n            </div>\n        </div>\n    ",
                    animations: [
                        animations_1.trigger('dialogState', [
                            animations_1.state('hidden', animations_1.style({
                                opacity: 0
                            })),
                            animations_1.state('visible', animations_1.style({
                                opacity: 1
                            })),
                            animations_1.transition('visible => hidden', animations_1.animate('400ms ease-in')),
                            animations_1.transition('hidden => visible', animations_1.animate('400ms ease-out'))
                        ])
                    ],
                    providers: [domhandler_1.DomHandler]
                },] },
    ];
    /** @nocollapse */
    ConfirmDialog.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: domhandler_1.DomHandler, },
        { type: core_1.Renderer2, },
        { type: confirmationservice_1.ConfirmationService, },
        { type: core_1.NgZone, },
    ]; };
    ConfirmDialog.propDecorators = {
        "header": [{ type: core_1.Input },],
        "icon": [{ type: core_1.Input },],
        "message": [{ type: core_1.Input },],
        "acceptIcon": [{ type: core_1.Input },],
        "acceptLabel": [{ type: core_1.Input },],
        "acceptVisible": [{ type: core_1.Input },],
        "rejectIcon": [{ type: core_1.Input },],
        "rejectLabel": [{ type: core_1.Input },],
        "rejectVisible": [{ type: core_1.Input },],
        "acceptButtonStyleClass": [{ type: core_1.Input },],
        "rejectButtonStyleClass": [{ type: core_1.Input },],
        "width": [{ type: core_1.Input },],
        "height": [{ type: core_1.Input },],
        "closeOnEscape": [{ type: core_1.Input },],
        "rtl": [{ type: core_1.Input },],
        "closable": [{ type: core_1.Input },],
        "responsive": [{ type: core_1.Input },],
        "appendTo": [{ type: core_1.Input },],
        "key": [{ type: core_1.Input },],
        "footer": [{ type: core_1.ContentChild, args: [shared_1.Footer,] },],
        "visible": [{ type: core_1.Input },],
    };
    return ConfirmDialog;
}());
exports.ConfirmDialog = ConfirmDialog;
var ConfirmDialogModule = (function () {
    function ConfirmDialogModule() {
    }
    ConfirmDialogModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule, button_1.ButtonModule],
                    exports: [ConfirmDialog, button_1.ButtonModule, shared_1.SharedModule],
                    declarations: [ConfirmDialog]
                },] },
    ];
    /** @nocollapse */
    ConfirmDialogModule.ctorParameters = function () { return []; };
    return ConfirmDialogModule;
}());
exports.ConfirmDialogModule = ConfirmDialogModule;
//# sourceMappingURL=confirmdialog.js.map