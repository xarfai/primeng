"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var domhandler_1 = require("../dom/domhandler");
var router_1 = require("@angular/router");
var TieredMenuSub = (function () {
    function TieredMenuSub(domHandler) {
        this.domHandler = domHandler;
        this.autoZIndex = true;
        this.baseZIndex = 0;
    }
    TieredMenuSub.prototype.onItemMouseEnter = function (event, item, menuitem) {
        if (menuitem.disabled) {
            return;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        this.activeItem = item;
        var nextElement = item.children[0].nextElementSibling;
        if (nextElement) {
            var sublist = nextElement.children[0];
            if (this.autoZIndex) {
                sublist.style.zIndex = String(this.baseZIndex + (++domhandler_1.DomHandler.zindex));
            }
            sublist.style.zIndex = String(++domhandler_1.DomHandler.zindex);
            sublist.style.top = '0px';
            sublist.style.left = this.domHandler.getOuterWidth(item.children[0]) + 'px';
        }
    };
    TieredMenuSub.prototype.onItemMouseLeave = function (event) {
        var _this = this;
        this.hideTimeout = setTimeout(function () {
            _this.activeItem = null;
        }, 250);
    };
    TieredMenuSub.prototype.itemClick = function (event, item) {
        if (item.disabled) {
            event.preventDefault();
            return true;
        }
        if (!item.url) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
    };
    TieredMenuSub.prototype.listClick = function (event) {
        this.activeItem = null;
    };
    TieredMenuSub.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-tieredMenuSub',
                    template: "\n        <ul [ngClass]=\"{'ui-widget-content ui-corner-all ui-shadow ui-submenu-list': !root}\" (click)=\"listClick($event)\">\n            <ng-template ngFor let-child [ngForOf]=\"(root ? item : item.items)\">\n                <li *ngIf=\"child.separator\" class=\"ui-menu-separator ui-widget-content\">\n                <li *ngIf=\"!child.separator\" #listItem [ngClass]=\"{'ui-menuitem ui-widget ui-corner-all':true,'ui-menuitem-active':listItem==activeItem}\"\n                    [class]=\"child.styleClass\" [ngStyle]=\"child.style\"\n                    (mouseenter)=\"onItemMouseEnter($event, listItem, child)\" (mouseleave)=\"onItemMouseLeave($event)\">\n                    <a *ngIf=\"!child.routerLink\" [href]=\"child.url||'#'\" class=\"ui-menuitem-link ui-corner-all\" [attr.target]=\"child.target\" [attr.title]=\"child.title\" [attr.id]=\"child.id\"\n                        [ngClass]=\"{'ui-state-disabled':child.disabled}\" (click)=\"itemClick($event, child)\">\n                        <span class=\"ui-menuitem-icon fa fa-fw\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"ui-menuitem-text\">{{child.label}}</span>\n                        <span class=\"ui-submenu-icon fa fa-fw fa-caret-right\" *ngIf=\"child.items\"></span>\n                    </a>\n                    <a *ngIf=\"child.routerLink\" [routerLink]=\"child.routerLink\" [queryParams]=\"child.queryParams\" [routerLinkActive]=\"'ui-state-active'\" \n                        [routerLinkActiveOptions]=\"child.routerLinkActiveOptions||{exact:false}\" [href]=\"child.url||'#'\" \n                        class=\"ui-menuitem-link ui-corner-all\" [attr.target]=\"child.target\" [attr.title]=\"child.title\" [attr.id]=\"child.id\"\n                        [ngClass]=\"{'ui-state-disabled':child.disabled}\" (click)=\"itemClick($event, child)\">\n                        \n                        <span class=\"ui-menuitem-icon fa fa-fw\" *ngIf=\"child.icon\" [ngClass]=\"child.icon\"></span>\n                        <span class=\"ui-menuitem-text\">{{child.label}}</span>\n                        <span class=\"ui-submenu-icon fa fa-fw fa-caret-right\" *ngIf=\"child.items\"></span>\n                    </a>\n                    <p-tieredMenuSub class=\"ui-submenu\" [item]=\"child\" *ngIf=\"child.items\" [baseZIndex]=\"baseZIndex\" [autoZIndex]=\"autoZIndex\"></p-tieredMenuSub>\n                </li>\n            </ng-template>\n        </ul>\n    ",
                    providers: [domhandler_1.DomHandler]
                },] },
    ];
    /** @nocollapse */
    TieredMenuSub.ctorParameters = function () { return [
        { type: domhandler_1.DomHandler, },
    ]; };
    TieredMenuSub.propDecorators = {
        "item": [{ type: core_1.Input },],
        "root": [{ type: core_1.Input },],
        "autoZIndex": [{ type: core_1.Input },],
        "baseZIndex": [{ type: core_1.Input },],
    };
    return TieredMenuSub;
}());
exports.TieredMenuSub = TieredMenuSub;
var TieredMenu = (function () {
    function TieredMenu(el, domHandler, renderer) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.autoZIndex = true;
        this.baseZIndex = 0;
    }
    TieredMenu.prototype.ngAfterViewInit = function () {
        this.container = this.el.nativeElement.children[0];
        if (this.popup) {
            if (this.appendTo) {
                if (this.appendTo === 'body')
                    document.body.appendChild(this.container);
                else
                    this.domHandler.appendChild(this.container, this.appendTo);
            }
        }
    };
    TieredMenu.prototype.toggle = function (event) {
        if (this.container.offsetParent)
            this.hide();
        else
            this.show(event);
    };
    TieredMenu.prototype.show = function (event) {
        this.preventDocumentDefault = true;
        this.moveOnTop();
        this.container.style.display = 'block';
        this.domHandler.absolutePosition(this.container, event.currentTarget);
        this.domHandler.fadeIn(this.container, 250);
        this.bindDocumentClickListener();
    };
    TieredMenu.prototype.hide = function () {
        this.container.style.display = 'none';
        this.unbindDocumentClickListener();
    };
    TieredMenu.prototype.moveOnTop = function () {
        if (this.autoZIndex) {
            this.container.style.zIndex = String(this.baseZIndex + (++domhandler_1.DomHandler.zindex));
        }
    };
    TieredMenu.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    TieredMenu.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function () {
                if (!_this.preventDocumentDefault) {
                    _this.hide();
                }
                _this.preventDocumentDefault = false;
            });
        }
    };
    TieredMenu.prototype.ngOnDestroy = function () {
        if (this.popup) {
            if (this.documentClickListener) {
                this.unbindDocumentClickListener();
            }
            if (this.appendTo) {
                this.el.nativeElement.appendChild(this.container);
            }
        }
    };
    TieredMenu.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'p-tieredMenu',
                    template: "\n        <div [ngClass]=\"{'ui-tieredmenu ui-widget ui-widget-content ui-corner-all':true, 'ui-tieredmenu-dynamic ui-shadow':popup}\" \n            [class]=\"styleClass\" [ngStyle]=\"style\">\n            <p-tieredMenuSub [item]=\"model\" root=\"root\" [baseZIndex]=\"baseZIndex\" [autoZIndex]=\"autoZIndex\"></p-tieredMenuSub>\n        </div>\n    ",
                    providers: [domhandler_1.DomHandler]
                },] },
    ];
    /** @nocollapse */
    TieredMenu.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: domhandler_1.DomHandler, },
        { type: core_1.Renderer2, },
    ]; };
    TieredMenu.propDecorators = {
        "model": [{ type: core_1.Input },],
        "popup": [{ type: core_1.Input },],
        "style": [{ type: core_1.Input },],
        "styleClass": [{ type: core_1.Input },],
        "appendTo": [{ type: core_1.Input },],
        "autoZIndex": [{ type: core_1.Input },],
        "baseZIndex": [{ type: core_1.Input },],
    };
    return TieredMenu;
}());
exports.TieredMenu = TieredMenu;
var TieredMenuModule = (function () {
    function TieredMenuModule() {
    }
    TieredMenuModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule, router_1.RouterModule],
                    exports: [TieredMenu, router_1.RouterModule],
                    declarations: [TieredMenu, TieredMenuSub]
                },] },
    ];
    /** @nocollapse */
    TieredMenuModule.ctorParameters = function () { return []; };
    return TieredMenuModule;
}());
exports.TieredMenuModule = TieredMenuModule;
//# sourceMappingURL=tieredmenu.js.map