/*
    *
    * Wijmo Library 5.20152.90
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    * 
    * Licensed under the Wijmo Commercial License. 
    * sales@wijmo.com
    * http://wijmo.com/products/wijmo-5/license/
    *
    */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /**
    * Defines the @see:RadialGauge, @see:LinearGauge, and @see:BulletGraph
    * controls.
    *
    * Unlike many gauge controls, Wijmo gauges concentrate on the data being
    * displayed, with little extraneous color and markup elements. They were
    * designed to be easy to use and to read, especially on small-screen devices.
    *
    * Wijmo gauges are composed of @see:Range objects. Every Wijmo gauge has
    * at least two ranges: the "face" and the "pointer".
    *
    * <ul><li>
    * The "face" represents the gauge background. The "min" and "max"
    * properties of the face range correspond to the "min" and "max" properties
    * of the gauge control, and limit the values that the gauge can display.
    * </li><li>
    * The "pointer" is the range that indicates the gauge's current value. The
    * "max" property of the pointer range corresponds to the "value" property
    * of the gauge.
    * </li></ul>
    *
    * In addition to these two special ranges, gauges may have any number of
    * additional ranges added to their "ranges" collection. These additional
    * ranges can be used for two things:
    *
    * <ul><li>
    * By default, the extra ranges appear as part of the gauge background.
    * This way you can show 'zones' within the gauge, like 'good,' 'average,'
    * and 'bad' for example.
    * </li><li>
    * If you set the gauge's "showRanges" property to false, the additional
    * ranges are not shown. Instead, they are used to automatically set the
    * color of the "pointer" based on the current value.
    * </li></ul>
    */
    (function (gauge) {
        'use strict';

        /**
        * Specifies which values to display as text.
        */
        (function (ShowText) {
            /** Do not show any text in the gauge. */
            ShowText[ShowText["None"] = 0] = "None";

            /** Show the gauge's @see:value as text. */
            ShowText[ShowText["Value"] = 1] = "Value";

            /** Show the gauge's @see:min and @see:max values as text. */
            ShowText[ShowText["MinMax"] = 2] = "MinMax";

            /** Show the gauge's @see:value, @see:min, and @see:max as text. */
            ShowText[ShowText["All"] = 3] = "All";
        })(gauge.ShowText || (gauge.ShowText = {}));
        var ShowText = gauge.ShowText;

        /**
        * Base class for the Wijmo Gauge controls (abstract).
        */
        var Gauge = (function (_super) {
            __extends(Gauge, _super);
            /**
            * Initializes a new instance of a @see:Gauge control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function Gauge(element, options) {
                _super.call(this, element, null, true);
                // property storage
                this._ranges = new wijmo.collections.ObservableArray();
                this._rngElements = [];
                this._format = 'n0';
                this._showRanges = true;
                this._shadow = true;
                this._animated = true;
                this._readOnly = true;
                this._step = 1;
                this._showText = 0 /* None */;
                // protected
                this._thickness = 0.8;
                this._initialized = false;
                /**
                * Occurs when the value shown on the gauge changes.
                */
                this.valueChanged = new wijmo.Event();
                // scales a value to a percentage based on the gauge's min and max properties
                this._getPercent = function (value) {
                    var pct = (this.max > this.min) ? (value - this.min) / (this.max - this.min) : 0;
                    return Math.max(0, Math.min(1, pct));
                };
                Gauge._ctr++;

                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-gauge', tpl, {
                    _dSvg: 'dsvg',
                    _svg: 'svg',
                    _filter: 'filter',
                    _gFace: 'gface',
                    _gRanges: 'granges',
                    _gPointer: 'gpointer',
                    _gCover: 'gcover',
                    _pFace: 'pface',
                    _pPointer: 'ppointer',
                    _cValue: 'cvalue',
                    _tValue: 'value',
                    _tMin: 'min',
                    _tMax: 'max'
                });

                // apply filter id to template
                this._filterID = 'wj-gauge-filter-' + Gauge._ctr.toString(36);
                this._filter.setAttribute('id', this._filterID);

                // initialize main ranges
                this._face = new gauge.Range();
                this._pointer = new gauge.Range();
                this._face.propertyChanged.addHandler(this._rangeChanged, this);
                this._pointer.propertyChanged.addHandler(this._rangeChanged, this);

                // invalidate control and re-create range elements when ranges change
                var self = this;
                this._ranges.collectionChanged.addHandler(function () {
                    // check types
                    var arr = self._ranges;
                    for (var i = 0; i < arr.length; i++) {
                        var rng = wijmo.tryCast(arr[i], gauge.Range);
                        if (!rng) {
                            throw 'ranges array must contain Range objects.';
                        }
                    }

                    // remember ranges are dirty and invalidate
                    self._rangesDirty = true;
                    self.invalidate();
                });

                // keyboard handling
                this.addEventListener(this.hostElement, 'keydown', this._keydown.bind(this));

                // mouse handling
                this.addEventListener(this.hostElement, 'click', function (e) {
                    if (e.button == 0) {
                        self.focus();
                        self._applyMouseValue(e);
                    }
                });
                this.addEventListener(this.hostElement, 'mousedown', function (e) {
                    if (e.button == 0) {
                        self.focus();
                        self._applyMouseValue(e);
                    }
                });
                this.addEventListener(this.hostElement, 'mousemove', function (e) {
                    if (e.buttons == 1) {
                        self._applyMouseValue(e, true);
                    }
                });

                // touch handling
                if ('ontouchstart' in window) {
                    this.addEventListener(this.hostElement, 'touchstart', function (e) {
                        self.focus();
                        if (!e.defaultPrevented && !self.isReadOnly && self._applyMouseValue(e, true)) {
                            e.preventDefault();
                        }
                    });
                    this.addEventListener(this.hostElement, 'touchmove', function (e) {
                        if (!e.defaultPrevented && !self.isReadOnly && self._applyMouseValue(e, true)) {
                            e.preventDefault();
                        }
                    });
                }

                // use wheel to increase/decrease the value
                var evt = 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
                this.addEventListener(this.hostElement, evt, function (e) {
                    if (!e.defaultPrevented && !self.isReadOnly && self.containsFocus() && self.value != null && self.hitTest(e)) {
                        var step = wijmo.clamp(e.wheelDelta || -e.detail, -1, +1);
                        self.value = wijmo.clamp(self.value + (self.step || 1) * step, self.min, self.max);
                        e.preventDefault();
                    }
                });

                // initialize control options
                this.initialize(options);

                // ensure face and text are updated
                this.invalidate();
            }
            Object.defineProperty(Gauge.prototype, "value", {
                /**
                * Gets or sets the value to display on the gauge.
                */
                get: function () {
                    return this._pointer.max;
                },
                set: function (value) {
                    if (value != this._pointer.max) {
                        this._pointer.max = wijmo.asNumber(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "min", {
                /**
                * Gets or sets the minimum value that can be displayed on the gauge.
                */
                get: function () {
                    return this._face.min;
                },
                set: function (value) {
                    this._face.min = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "max", {
                /**
                * Gets or sets the maximum value that can be displayed on the gauge.
                */
                get: function () {
                    return this._face.max;
                },
                set: function (value) {
                    this._face.max = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "origin", {
                /**
                * Gets or sets the starting point used for painting the range.
                *
                * By default, this property is set to null, which causes the value range
                * to start at the gauge's minimum value, or zero if the minimum is less
                * than zero.
                */
                get: function () {
                    return this._origin;
                },
                set: function (value) {
                    if (value != this._origin) {
                        this._origin = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "isReadOnly", {
                /**
                * Gets or sets a value indicating whether the user can edit the value using the mouse and
                * the keyboard.
                */
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    this._setAttribute(this._svg, 'cursor', this._readOnly ? null : 'pointer');
                    this._setAttribute(this._svg, 'user-select', this._readOnly ? null : 'none');
                    this._setAttribute(this._svg, 'moz-user-select', this._readOnly ? null : 'none');
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "step", {
                /**
                * Gets or sets the amount to add to or subtract from the @see:value property
                * when the user presses the arrow keys or moves the mouse wheel.
                */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    this._step = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "format", {
                /**
                * Gets or sets the format string to use for displaying the gauge values
                * as text.
                */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this._format) {
                        this._format = wijmo.asString(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "thickness", {
                /**
                * Gets or sets the thickness of the gauge, on a scale between zero and one.
                *
                * Setting the thickness to one causes the gauge to fill as much of the
                * control area as possible. Smaller values create thinner gauges.
                */
                get: function () {
                    return this._thickness;
                },
                set: function (value) {
                    if (value != this._thickness) {
                        this._thickness = wijmo.clamp(wijmo.asNumber(value, false), 0, 1);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "face", {
                /**
                * Gets the @see:Range used to represent the gauge's overall geometry
                * and appearance.
                */
                get: function () {
                    return this._face;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "pointer", {
                /**
                * Gets the @see:Range used to represent the gauge's current value.
                */
                get: function () {
                    return this._pointer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "showText", {
                /**
                * Gets or sets the @see:ShowText values to display as text in the gauge.
                */
                get: function () {
                    return this._showText;
                },
                set: function (value) {
                    if (value != this._showText) {
                        this._showText = wijmo.asEnum(value, ShowText);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "thumbSize", {
                /**
                * Gets or sets the size of the element that shows the gauge's current value, in pixels.
                */
                get: function () {
                    return this._thumbSize;
                },
                set: function (value) {
                    if (value != this._thumbSize) {
                        this._thumbSize = wijmo.asNumber(value, true, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "showRanges", {
                /**
                * Gets or sets a value indicating whether the gauge displays the ranges contained in the @see:ranges property.
                *
                * If this property is set to false, the ranges contained in the @see:ranges property are not
                * displayed in the gauge. Instead, they are used to interpolate the color of the @see:pointer
                * range while animating value changes.
                */
                get: function () {
                    return this._showRanges;
                },
                set: function (value) {
                    if (value != this._showRanges) {
                        this._showRanges = wijmo.asBoolean(value);
                        this._animColor = null;
                        this._rangesDirty = true;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "hasShadow", {
                /**
                * Gets or sets a value indicating whether the gauge displays a shadow effect.
                */
                get: function () {
                    return this._shadow;
                },
                set: function (value) {
                    if (value != this._shadow) {
                        this._shadow = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "isAnimated", {
                /**
                * Gets or sets a value indicating whether the gauge animates value changes.
                */
                get: function () {
                    return this._animated;
                },
                set: function (value) {
                    if (value != this._animated) {
                        this._animated = wijmo.asBoolean(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Gauge.prototype, "ranges", {
                /**
                * Gets the collection of ranges in this gauge.
                */
                get: function () {
                    return this._ranges;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:valueChanged event.
            */
            Gauge.prototype.onValueChanged = function () {
                this.valueChanged.raise(this);
            };

            /**
            * Refreshes the control.
            *
            * @param fullUpdate Indicates whether to update the control layout as well as the content.
            */
            Gauge.prototype.refresh = function (fullUpdate) {
                if (typeof fullUpdate === "undefined") { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);

                // update ranges if they are dirty
                if (this._rangesDirty) {
                    this._rangesDirty = false;
                    var gr = this._gRanges;

                    for (var i = 0; i < this._rngElements.length; i++) {
                        var e = this._rngElements[i];
                        e.rng.propertyChanged.removeHandler(this._rangeChanged);
                    }
                    while (gr.lastChild) {
                        gr.removeChild(gr.lastChild);
                    }
                    this._rngElements = [];

                    // add elements for each range and listen to changes
                    if (this._showRanges) {
                        for (var i = 0; i < this.ranges.length; i++) {
                            var rng = this.ranges[i];
                            rng.propertyChanged.addHandler(this._rangeChanged, this);
                            this._rngElements.push({
                                rng: rng,
                                el: this._createElement('path', gr)
                            });
                        }
                    }
                }

                // update text elements
                this._showElement(this._tValue, (this.showText & 1 /* Value */) != 0);
                this._showElement(this._tMin, (this.showText & 2 /* MinMax */) != 0);
                this._showElement(this._tMax, (this.showText & 2 /* MinMax */) != 0);
                this._showElement(this._cValue, (this.showText & 1 /* Value */) != 0 || this._thumbSize > 0);
                this._updateText();

                // update face and pointer
                var filterUrl = this._getFilterUrl();
                this._setAttribute(this._pFace, 'filter', filterUrl);
                this._setAttribute(this._pPointer, 'filter', filterUrl);
                this._updateRange(this._face);
                this._updateRange(this._pointer);

                for (var i = 0; i < this.ranges.length; i++) {
                    this._updateRange(this.ranges[i]);
                }

                // ready
                this._initialized = true;
            };

            /**
            * Gets a number that corresponds to the value of the gauge at a given point.
            *
            * For example:
            *
            * <pre>
            * // hit test a point when the user clicks on the gauge
            * gauge.hostElement.addEventListener('click', function (e) {
            *   var ht = gauge.hitTest(e.pageX, e.pageY);
            *   if (ht != null) {
            *     console.log('you clicked the gauge at value ' + ht.toString());
            *   }
            * });
            * </pre>
            *
            * @param pt The point to investigate, in window coordinates, or a MouseEvent object,
            * or the x coordinate of the point.
            * @param y The Y coordinate of the point (if the first parameter is a number).
            * @return Value of the gauge at the point, or null if the point is not on the gauge's face.
            */
            Gauge.prototype.hitTest = function (pt, y) {
                // get point in page coordinates
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                } else if (!(pt instanceof wijmo.Point)) {
                    pt = wijmo.mouseToPage(pt);
                }
                pt = wijmo.asType(pt, wijmo.Point);

                // convert point to gauge client coordinates
                var rc = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
                pt.x -= rc.left + pageXOffset;
                pt.y -= rc.top + pageYOffset;

                // get gauge value from point
                return this._getValueFromPoint(pt);
            };

            // ** implementation
            // gets the unique filter ID used by this gauge
            Gauge.prototype._getFilterUrl = function () {
                return this.hasShadow ? 'url(#' + this._filterID + ')' : null;
            };

            // gets the path element that represents a Range
            Gauge.prototype._getRangeElement = function (rng) {
                if (rng == this._face) {
                    return this._pFace;
                } else if (rng == this._pointer) {
                    return this._pPointer;
                }
                for (var i = 0; i < this._rngElements.length; i++) {
                    var rngEl = this._rngElements[i];
                    if (rngEl.rng == rng) {
                        return rngEl.el;
                    }
                }
                return null;
            };

            // handle changes to range objects
            Gauge.prototype._rangeChanged = function (rng, e) {
                // when pointer.max changes, raise valueChanged
                if (rng == this._pointer && e.propertyName == 'max') {
                    this.onValueChanged();
                    this._updateText();
                }

                // when face changes, invalidate the whole gauge
                if (rng == this._face) {
                    this.invalidate();
                    return;
                }

                // update pointer with animation
                if (rng == this._pointer && e.propertyName == 'max') {
                    // clear pending animations if any
                    if (this._animInterval) {
                        clearInterval(this._animInterval);
                    }

                    // animate
                    if (this.isAnimated && !this.isUpdating && this._initialized) {
                        var self = this, s1 = this._getPointerColor(e.oldValue), s2 = this._getPointerColor(e.newValue), c1 = s1 ? new wijmo.Color(s1) : null, c2 = s2 ? new wijmo.Color(s2) : null;
                        this._animInterval = wijmo.animate(function (pct) {
                            self._animColor = (c1 && c2) ? wijmo.Color.interpolate(c1, c2, pct).toString() : null;
                            self._updateRange(rng, e.oldValue + pct * (e.newValue - e.oldValue));
                            if (pct >= 1) {
                                self._animColor = null;
                                self._updateRange(rng);
                                self._updateText();
                                self._animInterval = null;
                            }
                        });
                        return;
                    }
                }

                // update range without animation
                this._updateRange(rng);
            };

            // creates an SVG element with the given tag and appends it to a given element
            Gauge.prototype._createElement = function (tag, parent, cls) {
                var e = document.createElementNS(Gauge._SVGNS, tag);
                if (cls) {
                    e.setAttribute('class', cls);
                }
                parent.appendChild(e);
                return e;
            };

            // centers an SVG text element at a given point
            Gauge.prototype._centerText = function (e, value, center) {
                if (e.getAttribute('display') != 'none') {
                    e.textContent = wijmo.Globalize.format(value, this.format);
                    var box = wijmo.Rect.fromBoundingRect(e.getBBox()), x = (center.x - box.width / 2), y = (center.y + box.height / 4);
                    e.setAttribute('x', this._fix(x));
                    e.setAttribute('y', this._fix(y));
                }
            };

            // method used in JSON-style initialization
            Gauge.prototype._copy = function (key, value) {
                if (key == 'ranges') {
                    var arr = wijmo.asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var r = new gauge.Range();
                        wijmo.copy(r, arr[i]);
                        this.ranges.push(r);
                    }
                    return true;
                } else if (key == 'pointer') {
                    wijmo.copy(this.pointer, value);
                    return true;
                }
                return false;
            };

            // shows or hides an element
            Gauge.prototype._showElement = function (e, show) {
                this._setAttribute(e, 'display', show ? '' : 'none');
            };

            // sets or clears an attribute
            Gauge.prototype._setAttribute = function (e, att, value) {
                if (value) {
                    e.setAttribute(att, value);
                } else {
                    e.removeAttribute(att);
                }
            };

            // updates the element for a given range
            Gauge.prototype._updateRange = function (rng, value) {
                if (typeof value === "undefined") { value = rng.max; }
                // update pointer's min value
                if (rng == this._pointer) {
                    rng.min = this.origin != null ? this.origin : (this.min < 0 && this.max > 0) ? 0 : this.min;
                }

                // update the range's element
                var e = this._getRangeElement(rng);
                if (e) {
                    this._updateRangeElement(e, rng, value);
                    var color = rng.color;
                    if (rng == this._pointer) {
                        color = this._animColor ? this._animColor : this._getPointerColor(rng.max);
                    }
                    this._setAttribute(e, 'style', color ? 'fill:' + color : null);
                }
            };

            // gets the color for the pointer range based on the gauge ranges
            Gauge.prototype._getPointerColor = function (value) {
                var rng;
                if (!this._showRanges) {
                    for (var i = 0; i < this._ranges.length; i++) {
                        var r = this._ranges[i];
                        if (value >= r.min && value <= r.max) {
                            if (rng == null || rng.max - rng.min > r.max - r.min) {
                                rng = r;
                            }
                        }
                    }
                    if (rng) {
                        return rng.color;
                    }
                }
                return this._pointer.color;
            };

            // keyboard handling
            Gauge.prototype._keydown = function (e) {
                if (!this._readOnly && this._step) {
                    var handled = true;
                    switch (e.keyCode) {
                        case 37 /* Left */:
                        case 40 /* Down */:
                            this.value = wijmo.clamp(this.value - this.step, this.min, this.max);
                            break;
                        case 39 /* Right */:
                        case 38 /* Up */:
                            this.value = wijmo.clamp(this.value + this.step, this.min, this.max);
                            break;
                        case 36 /* Home */:
                            this.value = this.min;
                            break;
                        case 35 /* End */:
                            this.value = this.max;
                            break;
                        default:
                            handled = false;
                            break;
                    }
                    if (handled) {
                        e.preventDefault();
                    }
                }
            };

            // apply value based on mouse/pointer position
            Gauge.prototype._applyMouseValue = function (e, instant) {
                if (!this.isReadOnly && this.containsFocus()) {
                    var value = this.hitTest(e);
                    if (value != null) {
                        // disable animation for instant changes
                        var a = this._animated;
                        if (instant) {
                            this._animated = false;
                        }

                        // make the change
                        if (this._step != null) {
                            value = Math.round(value / this._step) * this._step;
                        }
                        this.value = wijmo.clamp(value, this.min, this.max);

                        // restore animation and return true
                        this._animated = a;
                        return true;
                    }
                }

                // not editable or hit-test off the gauge? return false
                return false;
            };

            // ** virtual methods (must be overridden in derived classes)
            // updates the range element
            Gauge.prototype._updateRangeElement = function (e, rng, value) {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };

            // updates the text elements
            Gauge.prototype._updateText = function () {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };

            // gets the value at a given point (in gauge client coordinates)
            Gauge.prototype._getValueFromPoint = function (pt) {
                return null;
            };

            // formats numbers or points with up to 4 decimals
            Gauge.prototype._fix = function (n) {
                return wijmo.isNumber(n) ? parseFloat(n.toFixed(4)).toString() : this._fix(n.x) + ' ' + this._fix(n.y);
            };
            Gauge._SVGNS = 'http://www.w3.org/2000/svg';
            Gauge._ctr = 0;

            Gauge.controlTemplate = '<div wj-part="dsvg" style="width:100%;height:100%">' + '<svg wj-part="svg" width="100%" height="100%" style="overflow:visible">' + '<defs>' + '<filter wj-part="filter">' + '<feOffset dx="3" dy="3"></feOffset>' + '<feGaussianBlur result="offset-blur" stdDeviation="5"></feGaussianBlur>' + '<feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite>' + '<feFlood flood-color="black" flood-opacity="0.2" result="color"></feFlood>' + '<feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite>' + '<feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>' + '</filter>' + '</defs>' + '<g wj-part="gface" class="wj-face" style="cursor:inherit">' + '<path wj-part="pface"/>' + '</g>' + '<g wj-part="granges" style="cursor:inherit"/>' + '<g wj-part="gpointer" class="wj-pointer" style="cursor:inherit">' + '<path wj-part="ppointer"/>' + '</g>' + '<g wj-part="gcover" style="cursor:inherit">' + '<circle wj-part="cvalue" class="wj-pointer"/>' + '<text wj-part="value" class="wj-value"/>' + '<text wj-part="min" class="wj-min"/>' + '<text wj-part="max" class="wj-max"/>' + '</g>' + '</svg>' + '</div>';
            return Gauge;
        })(wijmo.Control);
        gauge.Gauge = Gauge;
    })(wijmo.gauge || (wijmo.gauge = {}));
    var gauge = wijmo.gauge;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Gauge.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (gauge) {
        'use strict';

        /**
        * Represents the direction in which the pointer of a @see:LinearGauge
        * increases.
        */
        (function (GaugeDirection) {
            /** Gauge value increases from left to right. */
            GaugeDirection[GaugeDirection["Right"] = 0] = "Right";

            /** Gauge value increases from right to left. */
            GaugeDirection[GaugeDirection["Left"] = 1] = "Left";

            /** Gauge value increases from bottom to top. */
            GaugeDirection[GaugeDirection["Up"] = 2] = "Up";

            /** Gauge value increases from top to bottom. */
            GaugeDirection[GaugeDirection["Down"] = 3] = "Down";
        })(gauge.GaugeDirection || (gauge.GaugeDirection = {}));
        var GaugeDirection = gauge.GaugeDirection;

        /**
        * The @see:LinearGauge displays a linear scale with an indicator
        * that represents a single value and optional ranges to represent
        * reference values.
        *
        * If you set the gauge's @see:isReadOnly property to false, then the
        * user will be able to edit the value by clicking on the gauge.
        *
        * @fiddle:t842jozb
        */
        var LinearGauge = (function (_super) {
            __extends(LinearGauge, _super);
            /**
            * Initializes a new instance of a @see:LinearGauge control.
            *
            * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options JavaScript object containing initialization data for the control.
            */
            function LinearGauge(element, options) {
                _super.call(this, element, null);
                // property storage
                this._direction = 0 /* Right */;

                // customize
                wijmo.addClass(this.hostElement, 'wj-lineargauge');

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(LinearGauge.prototype, "direction", {
                /**
                * Gets or sets the direction in which the gauge is filled.
                */
                get: function () {
                    return this._direction;
                },
                set: function (value) {
                    if (value != this._direction) {
                        this._direction = wijmo.asEnum(value, GaugeDirection);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            // virtual methods
            // updates the element for a given range
            LinearGauge.prototype._updateRangeElement = function (e, rng, value) {
                // update the path
                var rc = this._getRangeRect(rng, value);
                this._updateSegment(e, rc);

                // check whether we have to show text and/or thumb
                var showText = (rng == this._pointer) && (this.showText & 1 /* Value */) != 0, showThumb = showText || this.thumbSize > 0;

                // calculate thumb center
                if (showText || showThumb) {
                    var x = rc.left + rc.width / 2, y = rc.top + rc.height / 2;
                    switch (this.direction) {
                        case 0 /* Right */:
                            x = rc.right;
                            break;
                        case 1 /* Left */:
                            x = rc.left;
                            break;
                        case 2 /* Up */:
                            y = rc.top;
                            break;
                        case 3 /* Down */:
                            y = rc.bottom;
                            break;
                    }
                }

                // update text
                if (showText) {
                    this._centerText(this._tValue, value, new wijmo.Point(x, y));
                }

                // update thumb
                if (showText || showThumb) {
                    // don't call getBBox if _tValue is not visible, it throws in FireFox (TFS 129851)
                    rc = showText ? wijmo.Rect.fromBoundingRect(this._tValue.getBBox()) : new wijmo.Rect(x, y, 0, 0);
                    var color = this._animColor ? this._animColor : this._getPointerColor(rng.max), radius = this.thumbSize != null ? this.thumbSize / 2 : Math.max(rc.width, rc.height) * .8, ce = this._cValue;
                    this._setAttribute(ce, 'cx', this._fix(x));
                    this._setAttribute(ce, 'cy', this._fix(y));
                    this._setAttribute(ce, 'style', color ? 'fill:' + color : null);
                    this._setAttribute(ce, 'r', this._fix(radius));
                }
            };

            // updates the text elements
            LinearGauge.prototype._updateText = function () {
                var rc = this._getRangeRect(this._face);
                switch (this.direction) {
                    case 0 /* Right */:
                        this._setText(this._tMin, this.min, rc, 'left');
                        this._setText(this._tMax, this.max, rc, 'right');
                        break;
                    case 1 /* Left */:
                        this._setText(this._tMin, this.min, rc, 'right');
                        this._setText(this._tMax, this.max, rc, 'left');
                        break;
                    case 2 /* Up */:
                        this._setText(this._tMin, this.min, rc, 'bottom');
                        this._setText(this._tMax, this.max, rc, 'top');
                        break;
                    case 3 /* Down */:
                        this._setText(this._tMin, this.min, rc, 'top');
                        this._setText(this._tMax, this.max, rc, 'bottom');
                        break;
                }
            };

            // ** private stuff
            // draws a rectangular segment at the specified position
            LinearGauge.prototype._updateSegment = function (path, rc) {
                var data = {
                    p1: this._fix(new wijmo.Point(rc.left, rc.top)),
                    p2: this._fix(new wijmo.Point(rc.right, rc.top)),
                    p3: this._fix(new wijmo.Point(rc.right, rc.bottom)),
                    p4: this._fix(new wijmo.Point(rc.left, rc.bottom))
                };
                var content = wijmo.format('M {p1} L {p2} L {p3} L {p4} Z', data);
                path.setAttribute('d', content);
            };

            // positions a text element
            LinearGauge.prototype._setText = function (e, value, rc, pos) {
                if (e.getAttribute('display') != 'none') {
                    e.textContent = wijmo.Globalize.format(value, this.format);
                    var box = wijmo.Rect.fromBoundingRect(e.getBBox()), pt = new wijmo.Point(rc.left + rc.width / 2 - box.width / 2, rc.top + rc.height / 2 + box.height / 2);
                    switch (pos) {
                        case 'top':
                            pt.y = rc.top - 4;
                            break;
                        case 'left':
                            pt.x = rc.left - 4 - box.width;
                            break;
                        case 'right':
                            pt.x = rc.right + 4;
                            break;
                        case 'bottom':
                            pt.y = rc.bottom + 4 + box.height;
                            break;
                    }
                    e.setAttribute('x', this._fix(pt.x));
                    e.setAttribute('y', this._fix(pt.y));
                }
            };

            // gets a rectangle that represents a Range
            LinearGauge.prototype._getRangeRect = function (rng, value) {
                if (typeof value === "undefined") { value = rng.max; }
                // get gauge size
                var rc = new wijmo.Rect(0, 0, this.hostElement.clientWidth, this.hostElement.clientHeight);

                // get face rect (account for thickness, text or thumb at edges)
                var padding = this.thumbSize ? Math.ceil(this.thumbSize / 2) : 0;
                if (this.showText != 0 /* None */) {
                    padding = Math.max(padding, 3 * parseInt(getComputedStyle(this.hostElement).fontSize));
                }
                switch (this.direction) {
                    case 0 /* Right */:
                    case 1 /* Left */:
                        rc = rc.inflate(-padding, -rc.height * (1 - this.thickness * rng.thickness) / 2);
                        break;
                    case 2 /* Up */:
                    case 3 /* Down */:
                        rc = rc.inflate(-rc.width * (1 - this.thickness * rng.thickness) / 2, -padding);
                        break;
                }

                // get range rect
                var pctMin = this._getPercent(rng.min), pctMax = this._getPercent(value);
                switch (this.direction) {
                    case 0 /* Right */:
                        rc.left += rc.width * pctMin;
                        rc.width *= (pctMax - pctMin);
                        break;
                    case 1 /* Left */:
                        rc.left = rc.right - rc.width * pctMax;
                        rc.width = rc.width * (pctMax - pctMin);
                        break;
                    case 3 /* Down */:
                        rc.top += rc.height * pctMin;
                        rc.height *= (pctMax - pctMin);
                        break;
                    case 2 /* Up */:
                        rc.top = rc.bottom - rc.height * pctMax;
                        rc.height = rc.height * (pctMax - pctMin);
                        break;
                }

                // done
                return rc;
            };

            // gets the gauge value at a given point (in gauge client coordinates)
            LinearGauge.prototype._getValueFromPoint = function (pt) {
                // get face rectangle to calculate coordinates
                var rc = this._getRangeRect(this._face);

                // accept clicks anywhere to be touch-friendly
                //if (!rc.contains(pt)) {
                //    return null;
                //}
                // get position in control coordinates (min to max)
                var pct = 0;
                switch (this.direction) {
                    case 0 /* Right */:
                        pct = (pt.x - rc.left) / rc.width;
                        break;
                    case 1 /* Left */:
                        pct = (rc.right - pt.x) / rc.width;
                        break;
                    case 2 /* Up */:
                        pct = (rc.bottom - pt.y) / rc.height;
                        break;
                    case 3 /* Down */:
                        pct = (pt.y - rc.top) / rc.height;
                        break;
                }

                // done
                return this.min + pct * (this.max - this.min);
            };
            return LinearGauge;
        })(gauge.Gauge);
        gauge.LinearGauge = LinearGauge;
    })(wijmo.gauge || (wijmo.gauge = {}));
    var gauge = wijmo.gauge;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=LinearGauge.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (gauge) {
        'use strict';

        /**
        * The @see:RadialGauge displays a circular scale with an indicator
        * that represents a single value and optional ranges to represent
        * reference values.
        *
        * If you set the gauge's @see:isReadOnly property to false, then the
        * user can edit the value by clicking on the gauge.
        *
        * @fiddle:7ec2144u
        */
        var RadialGauge = (function (_super) {
            __extends(RadialGauge, _super);
            /**
            * Initializes a new instance of a @see:RadialGauge control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function RadialGauge(element, options) {
                _super.call(this, element, null);
                // property storage
                this._startAngle = 0;
                this._sweepAngle = 180;
                this._autoScale = true;

                // customize
                wijmo.addClass(this.hostElement, 'wj-radialgauge');
                this._thickness = .4;
                this.showText = 3 /* All */;

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(RadialGauge.prototype, "startAngle", {
                /**
                * Gets or sets the starting angle for the gauge, in degrees.
                *
                * Angles are measured in degrees, clockwise, starting from the 9 o'clock position.
                */
                get: function () {
                    return this._startAngle;
                },
                set: function (value) {
                    if (value != this._startAngle) {
                        this._startAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RadialGauge.prototype, "sweepAngle", {
                /**
                * Gets or sets the sweeping angle for the gauge, in degrees.
                *
                * Angles are measured in degrees, clockwise, starting from the 9 o'clock position.
                */
                get: function () {
                    return this._sweepAngle;
                },
                set: function (value) {
                    if (value != this._sweepAngle) {
                        this._sweepAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RadialGauge.prototype, "autoScale", {
                /**
                * Gets or sets a value indicating whether the gauge automatically scales to fill the host element.
                */
                get: function () {
                    return this._autoScale;
                },
                set: function (value) {
                    if (value != this._autoScale) {
                        this._autoScale = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            // virtual methods
            /**
            * Refreshes the control.
            *
            * @param fullUpdate Indicates whether to update the control layout as well as the content.
            */
            RadialGauge.prototype.refresh = function (fullUpdate) {
                if (typeof fullUpdate === "undefined") { fullUpdate = true; }
                // clear viewbox
                this._setAttribute(this._svg, 'viewBox', null);

                // update gauge
                _super.prototype.refresh.call(this, fullUpdate);

                // set viewbox to auto-scale
                if (this._autoScale) {
                    var rc = wijmo.Rect.fromBoundingRect(this._pFace.getBBox());
                    if ((this.showText & 1 /* Value */) != 0) {
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(this._tValue.getBBox()));
                    }
                    if ((this.showText & 2 /* MinMax */) != 0) {
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(this._tMin.getBBox()));
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(this._tMax.getBBox()));
                    }
                    var viewBox = [this._fix(rc.left), this._fix(rc.top), this._fix(rc.width), this._fix(rc.height)].join(' ');
                    this._setAttribute(this._svg, 'viewBox', viewBox);

                    // clear cached transform matrix
                    this._ctmInv = null;
                }
            };

            // updates the element for a given range
            RadialGauge.prototype._updateRangeElement = function (e, rng, value) {
                var rc = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect()), center = new wijmo.Point(rc.width / 2, rc.height / 2), radius = Math.min(rc.width, rc.height) / 2, faceThickness = radius * this.thickness, rngThickness = faceThickness * rng.thickness, outer = radius - (faceThickness - rngThickness) / 2, inner = outer - rngThickness, start = this.startAngle + 180, sweep = this.sweepAngle, ps = this._getPercent(rng.min), pe = this._getPercent(value), rngStart = start + sweep * ps, rngSweep = sweep * (pe - ps);

                // update path
                this._updateSegment(e, center, outer, inner, rngStart, rngSweep);

                // update thumb
                if (rng == this._pointer && this.thumbSize > 0) {
                    var color = this._animColor ? this._animColor : this._getPointerColor(rng.max), pt = this._getPoint(center, start + sweep * this._getPercent(value), (outer + inner) / 2), ce = this._cValue;
                    this._setAttribute(ce, 'cx', this._fix(pt.x));
                    this._setAttribute(ce, 'cy', this._fix(pt.y));
                    this._setAttribute(ce, 'style', color ? 'fill:' + color : null);
                    this._setAttribute(ce, 'r', this._fix(this.thumbSize / 2));
                }
            };

            // updates the content and position of the text elements
            RadialGauge.prototype._updateText = function () {
                var rc = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect()), center = new wijmo.Point(rc.width / 2, rc.height / 2), outer = Math.min(rc.width, rc.height) / 2, inner = Math.max(0, outer * (1 - this.thickness)), start = this.startAngle + 180, sweep = this.sweepAngle;

                // show thumb if it has a size
                this._showElement(this._cValue, this.thumbSize > 0);

                // hide min/max if sweep angle > 300 degrees
                var show = (this.showText & 2 /* MinMax */) != 0 && Math.abs(sweep) <= 300;
                this._showElement(this._tMin, show);
                this._showElement(this._tMax, show);

                // update text/position
                this._centerText(this._tValue, this.value, center);
                this._centerText(this._tMin, this.min, this._getPoint(center, start - 10, (outer + inner) / 2));
                this._centerText(this._tMax, this.max, this._getPoint(center, start + sweep + 10, (outer + inner) / 2));
            };

            // draws a radial segment at the specified position
            RadialGauge.prototype._updateSegment = function (path, ctr, rOut, rIn, start, sweep) {
                sweep = Math.min(Math.max(sweep, -359.99), 359.99);
                var p1 = this._getPoint(ctr, start, rIn), p2 = this._getPoint(ctr, start, rOut), p3 = this._getPoint(ctr, start + sweep, rOut), p4 = this._getPoint(ctr, start + sweep, rIn);
                var data = {
                    large: Math.abs(sweep) > 180 ? 1 : 0,
                    cw: sweep > 0 ? 1 : 0,
                    ccw: sweep > 0 ? 0 : 1,
                    or: this._fix(rOut),
                    ir: this._fix(rIn),
                    p1: this._fix(p1),
                    p2: this._fix(p2),
                    p3: this._fix(p3),
                    p4: this._fix(p4)
                };
                var content = wijmo.format('M {p1} ' + 'L {p2} A {or} {or} 0 {large} {cw} {p3} ' + 'L {p4} A {ir} {ir} 0 {large} {ccw} {p1} Z', data);
                path.setAttribute('d', content);
            };

            // converts polar to cartesian coordinates
            RadialGauge.prototype._getPoint = function (ctr, angle, radius) {
                angle = angle * Math.PI / 180;
                return new wijmo.Point(ctr.x + radius * Math.cos(angle), ctr.y + radius * Math.sin(angle));
            };

            // gets the gauge value at a given point (in gauge client coordinates)
            RadialGauge.prototype._getValueFromPoint = function (pt) {
                // convert client coordinates to SVG viewport
                // the getCTM matrix transforms viewport into client coordinates
                // the inverse matrix transforms client into viewport, which is what we want
                if (this.autoScale) {
                    if (!this._ctmInv) {
                        this._ctmInv = this._pFace.getCTM().inverse();
                        this._svgPt = this._svg.createSVGPoint();
                    }
                    this._svgPt.x = pt.x;
                    this._svgPt.y = pt.y;
                    this._svgPt = this._svgPt.matrixTransform(this._ctmInv);
                    pt.x = this._svgPt.x;
                    pt.y = this._svgPt.y;
                }

                // calculate geometry
                var rc = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect()), center = new wijmo.Point(rc.width / 2, rc.height / 2), outer = Math.min(rc.width, rc.height) / 2, inner = outer * (1 - this.thickness), dx = pt.x - center.x, dy = pt.y - center.y;

                // check that the point is within the face
                var r2 = dy * dy + dx * dx;
                if (r2 > outer * outer + 16 || r2 < inner * inner - 16) {
                    return null;
                }

                // calculate angle, percentage
                var ang = (Math.PI - Math.atan2(-dy, dx)) * 180 / Math.PI;
                while (ang < this.startAngle)
                    ang += 360;
                while (ang > this.startAngle + this.sweepAngle)
                    ang -= 360;
                var pct = (ang - this.startAngle) / this.sweepAngle;
                return this.min + pct * (this.max - this.min);
            };
            return RadialGauge;
        })(gauge.Gauge);
        gauge.RadialGauge = RadialGauge;
    })(wijmo.gauge || (wijmo.gauge = {}));
    var gauge = wijmo.gauge;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=RadialGauge.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (gauge) {
        'use strict';

        /**
        * The @see:BulletGraph is a type of linear gauge designed specifically for use
        * in dashboards. It displays a single key measure along with a comparative
        * measure and qualitative ranges to instantly signal whether the measure is
        * good, bad, or in some other state.
        *
        * Bullet Graphs were created and popularized by dashboard design expert
        * Stephen Few. You can find more details and examples on
        * <a href="http://en.wikipedia.org/wiki/Bullet_graph">Wikipedia</a>.
        *
        * @fiddle:8uxb1vwf
        */
        var BulletGraph = (function (_super) {
            __extends(BulletGraph, _super);
            /**
            * Initializes a new instance of a @see:BulletGraph control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function BulletGraph(element, options) {
                _super.call(this, element, null);

                // customize
                wijmo.addClass(this.hostElement, 'wj-bulletgraph');
                this._pointer.thickness = .35;

                // add reference ranges
                this._rngTarget = new gauge.Range('target');
                this._rngTarget.thickness = .8;
                this._rngTarget.color = 'black';
                this._rngGood = new gauge.Range('good');
                this._rngGood.color = 'rgba(0,0,0,.15)';
                this._rngBad = new gauge.Range('bad');
                this._rngBad.color = 'rgba(0,0,0,.3)';
                this.ranges.push(this._rngBad);
                this.ranges.push(this._rngGood);
                this.ranges.push(this._rngTarget);

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(BulletGraph.prototype, "target", {
                /**
                * Gets or sets the target value for the measure.
                */
                get: function () {
                    return this._rngTarget.max;
                },
                set: function (value) {
                    this._rngTarget.max = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BulletGraph.prototype, "good", {
                /**
                * Gets or sets a reference value considered good for the measure.
                */
                get: function () {
                    return this._rngGood.max;
                },
                set: function (value) {
                    this._rngGood.max = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BulletGraph.prototype, "bad", {
                /**
                * Gets or sets a reference value considered bad for the measure.
                */
                get: function () {
                    return this._rngBad.max;
                },
                set: function (value) {
                    this._rngBad.max = value;
                },
                enumerable: true,
                configurable: true
            });

            // ** implementation
            // gets a rectangle that represents a Range
            BulletGraph.prototype._getRangeRect = function (rng, value) {
                if (typeof value === "undefined") { value = rng.max; }
                // let base class calculate the rectangle
                var rc = _super.prototype._getRangeRect.call(this, rng, value);

                // make target range rect look like a bullet
                if (rng == this._rngTarget) {
                    switch (this.direction) {
                        case 0 /* Right */:
                            rc.left = rc.right - 1;
                            rc.width = 3;
                            break;
                        case 1 /* Left */:
                            rc.width = 3;
                            break;
                        case 2 /* Up */:
                            rc.height = 3;
                            break;
                        case 3 /* Down */:
                            rc.top = rc.bottom - 1;
                            rc.height = 3;
                            break;
                    }
                }

                // done
                return rc;
            };
            return BulletGraph;
        })(gauge.LinearGauge);
        gauge.BulletGraph = BulletGraph;
    })(wijmo.gauge || (wijmo.gauge = {}));
    var gauge = wijmo.gauge;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=BulletGraph.js.map

var wijmo;
(function (wijmo) {
    (function (gauge) {
        'use strict';

        /**
        * Defines ranges to be used with @see:Gauge controls.
        *
        * @see:Range objects have @see:min and @see:max properties that
        * define the range's domain, as well as @see:color and @see:thickness
        * properties that define the range's appearance.
        *
        * Every @see:Gauge control has at least two ranges:
        * the 'face' defines the minimum and maximum values for the gauge, and
        * the 'pointer' displays the gauge's current value.
        *
        * In addition to the built-in ranges, gauges may have additional
        * ranges used to display regions of significance (for example,
        * low, medium, and high values).
        */
        var Range = (function () {
            /**
            * Initializes a new instance of a @see:Range.
            *
            * @param name The name of the range.
            */
            function Range(name) {
                this._min = 0;
                this._max = 100;
                this._thickness = 1;
                /**
                * Occurs when the value of a property changes.
                */
                this.propertyChanged = new wijmo.Event();
                this._name = name;
            }
            Object.defineProperty(Range.prototype, "min", {
                /**
                * Gets or sets the minimum value for this range.
                */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._setProp('_min', wijmo.asNumber(value));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Range.prototype, "max", {
                /**
                * Gets or sets the maximum value for this range.
                */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._setProp('_max', wijmo.asNumber(value));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Range.prototype, "color", {
                /**
                * Gets or sets the color used to display this range.
                */
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._setProp('_color', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Range.prototype, "thickness", {
                /**
                * Gets or sets the thickness of this range as a percentage of
                * the parent gauge's thickness.
                */
                get: function () {
                    return this._thickness;
                },
                set: function (value) {
                    this._setProp('_thickness', wijmo.clamp(wijmo.asNumber(value), 0, 1));
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Range.prototype, "name", {
                /**
                * Gets or sets the name of this @see:Range.
                */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._setProp('_name', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:propertyChanged event.
            *
            * @param e @see:PropertyChangedEventArgs that contains the property
            * name, old, and new values.
            */
            Range.prototype.onPropertyChanged = function (e) {
                this.propertyChanged.raise(this, e);
            };

            // ** implementation
            // sets property value and notifies about the change
            Range.prototype._setProp = function (name, value) {
                var oldValue = this[name];
                if (value != oldValue) {
                    this[name] = value;
                    var e = new wijmo.PropertyChangedEventArgs(name.substr(1), oldValue, value);
                    this.onPropertyChanged(e);
                }
            };
            Range._ctr = 0;
            return Range;
        })();
        gauge.Range = Range;
    })(wijmo.gauge || (wijmo.gauge = {}));
    var gauge = wijmo.gauge;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Range.js.map

