"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var domhandler_1 = require("../dom/domhandler");
var Draggable = (function () {
    function Draggable(el, domHandler, zone) {
        this.el = el;
        this.domHandler = domHandler;
        this.zone = zone;
        this.onDragStart = new core_1.EventEmitter();
        this.onDragEnd = new core_1.EventEmitter();
        this.onDrag = new core_1.EventEmitter();
    }
    Draggable.prototype.ngAfterViewInit = function () {
        this.bindMouseListeners();
    };
    Draggable.prototype.bindDragListener = function () {
        var _this = this;
        if (!this.dragListener) {
            this.zone.runOutsideAngular(function () {
                _this.dragListener = _this.drag.bind(_this);
                _this.el.nativeElement.addEventListener('drag', _this.dragListener);
            });
        }
    };
    Draggable.prototype.unbindDragListener = function () {
        var _this = this;
        if (this.dragListener) {
            this.zone.runOutsideAngular(function () {
                _this.el.nativeElement.removeEventListener('drag', _this.dragListener);
                _this.dragListener = null;
            });
        }
    };
    Draggable.prototype.bindMouseListeners = function () {
        var _this = this;
        if (!this.mouseOverListener && this.mouseLeaveListener) {
            this.zone.runOutsideAngular(function () {
                _this.mouseOverListener = _this.mouseover.bind(_this);
                _this.mouseLeaveListener = _this.mouseleave.bind(_this);
                _this.el.nativeElement.addEventListener('mouseover', _this.mouseOverListener);
                _this.el.nativeElement.addEventListener('mouseleave', _this.mouseLeaveListener);
            });
        }
    };
    Draggable.prototype.unbindMouseListeners = function () {
        var _this = this;
        if (this.mouseOverListener && this.mouseLeaveListener) {
            this.zone.runOutsideAngular(function () {
                _this.el.nativeElement.removeEventListener('mouseover', _this.mouseOverListener);
                _this.el.nativeElement.removeEventListener('mouseleave', _this.mouseLeaveListener);
                _this.mouseOverListener = null;
                _this.mouseLeaveListener = null;
            });
        }
    };
    Draggable.prototype.drag = function (event) {
        this.onDrag.emit(event);
    };
    Draggable.prototype.dragStart = function (event) {
        if (this.allowDrag()) {
            if (this.dragEffect) {
                event.dataTransfer.effectAllowed = this.dragEffect;
            }
            event.dataTransfer.setData('text', this.scope);
            this.onDragStart.emit(event);
            this.bindDragListener();
        }
        else {
            event.preventDefault();
        }
    };
    Draggable.prototype.dragEnd = function (event) {
        this.onDragEnd.emit(event);
        this.unbindDragListener();
    };
    Draggable.prototype.mouseover = function (event) {
        this.handle = event.target;
    };
    Draggable.prototype.mouseleave = function (event) {
        this.handle = null;
    };
    Draggable.prototype.allowDrag = function () {
        if (this.dragHandle && this.handle)
            return this.domHandler.matches(this.handle, this.dragHandle);
        else
            return true;
    };
    Draggable.prototype.ngOnDestroy = function () {
        this.unbindDragListener();
        this.unbindMouseListeners();
    };
    Draggable.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[pDraggable]',
                    host: {
                        '[draggable]': 'true'
                    },
                    providers: [domhandler_1.DomHandler]
                },] },
    ];
    /** @nocollapse */
    Draggable.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: domhandler_1.DomHandler, },
        { type: core_1.NgZone, },
    ]; };
    Draggable.propDecorators = {
        "scope": [{ type: core_1.Input, args: ['pDraggable',] },],
        "dragEffect": [{ type: core_1.Input },],
        "dragHandle": [{ type: core_1.Input },],
        "onDragStart": [{ type: core_1.Output },],
        "onDragEnd": [{ type: core_1.Output },],
        "onDrag": [{ type: core_1.Output },],
        "dragStart": [{ type: core_1.HostListener, args: ['dragstart', ['$event'],] },],
        "dragEnd": [{ type: core_1.HostListener, args: ['dragend', ['$event'],] },],
    };
    return Draggable;
}());
exports.Draggable = Draggable;
var Droppable = (function () {
    function Droppable(el, domHandler, zone) {
        this.el = el;
        this.domHandler = domHandler;
        this.zone = zone;
        this.onDragEnter = new core_1.EventEmitter();
        this.onDragLeave = new core_1.EventEmitter();
        this.onDrop = new core_1.EventEmitter();
    }
    Droppable.prototype.ngAfterViewInit = function () {
        this.bindDragOverListener();
    };
    Droppable.prototype.bindDragOverListener = function () {
        var _this = this;
        if (!this.dragOverListener) {
            this.zone.runOutsideAngular(function () {
                _this.dragOverListener = _this.dragOver.bind(_this);
                _this.el.nativeElement.addEventListener('dragover', _this.dragOverListener);
            });
        }
    };
    Droppable.prototype.unbindDragOverListener = function () {
        var _this = this;
        if (this.dragOverListener) {
            this.zone.runOutsideAngular(function () {
                _this.el.nativeElement.removeEventListener('dragover', _this.dragOverListener);
                _this.dragOverListener = null;
            });
        }
    };
    Droppable.prototype.dragOver = function (event) {
        event.preventDefault();
    };
    Droppable.prototype.drop = function (event) {
        if (this.allowDrop(event)) {
            event.preventDefault();
            this.onDrop.emit(event);
        }
    };
    Droppable.prototype.dragEnter = function (event) {
        event.preventDefault();
        if (this.dropEffect) {
            event.dataTransfer.dropEffect = this.dropEffect;
        }
        this.onDragEnter.emit(event);
    };
    Droppable.prototype.dragLeave = function (event) {
        event.preventDefault();
        this.onDragLeave.emit(event);
    };
    Droppable.prototype.allowDrop = function (event) {
        var dragScope = event.dataTransfer.getData('text');
        if (typeof (this.scope) == "string" && dragScope == this.scope) {
            return true;
        }
        else if (this.scope instanceof Array) {
            for (var j = 0; j < this.scope.length; j++) {
                if (dragScope == this.scope[j]) {
                    return true;
                }
            }
        }
        return false;
    };
    Droppable.prototype.ngOnDestroy = function () {
        this.unbindDragOverListener();
    };
    Droppable.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[pDroppable]',
                    providers: [domhandler_1.DomHandler]
                },] },
    ];
    /** @nocollapse */
    Droppable.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: domhandler_1.DomHandler, },
        { type: core_1.NgZone, },
    ]; };
    Droppable.propDecorators = {
        "scope": [{ type: core_1.Input, args: ['pDroppable',] },],
        "dropEffect": [{ type: core_1.Input },],
        "onDragEnter": [{ type: core_1.Output },],
        "onDragLeave": [{ type: core_1.Output },],
        "onDrop": [{ type: core_1.Output },],
        "drop": [{ type: core_1.HostListener, args: ['drop', ['$event'],] },],
        "dragEnter": [{ type: core_1.HostListener, args: ['dragenter', ['$event'],] },],
        "dragLeave": [{ type: core_1.HostListener, args: ['dragleave', ['$event'],] },],
    };
    return Droppable;
}());
exports.Droppable = Droppable;
var DragDropModule = (function () {
    function DragDropModule() {
    }
    DragDropModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    exports: [Draggable, Droppable],
                    declarations: [Draggable, Droppable]
                },] },
    ];
    /** @nocollapse */
    DragDropModule.ctorParameters = function () { return []; };
    return DragDropModule;
}());
exports.DragDropModule = DragDropModule;
//# sourceMappingURL=dragdrop.js.map