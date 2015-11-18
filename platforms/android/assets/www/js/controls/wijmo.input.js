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
    (function (input) {
        'use strict';

        /**
        * DropDown control (abstract).
        *
        * Contains an input element and a button used to show or hide the drop-down.
        *
        * Derived classes must override the _createDropDown method to create whatever
        * editor they want to show in the drop down area (a list of items, a calendar,
        * a color editor, etc).
        */
        var DropDown = (function (_super) {
            __extends(DropDown, _super);
            /**
            * Initializes a new instance of a @see:DropDown control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function DropDown(element, options) {
                _super.call(this, element, null, true);
                // property storage
                this._showBtn = true;
                /**
                * Occurs when the value of the @see:text property changes.
                */
                this.textChanged = new wijmo.Event();
                /**
                * Occurs before the drop down is shown or hidden.
                */
                this.isDroppedDownChanging = new wijmo.Event();
                /**
                * Occurs after the drop down is shown or hidden.
                */
                this.isDroppedDownChanged = new wijmo.Event();

                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-dropdown wj-content', tpl, {
                    _tbx: 'input',
                    _btn: 'btn',
                    _dropDown: 'dropdown'
                }, 'input');

                // set reference element (used for positioning the drop-down)
                this._elRef = this._tbx;

                // create drop-down element, update button display
                this._createDropDown();
                this._updateBtn();

                // host element events
                var self = this;
                this.addEventListener(this.hostElement, 'focus', function () {
                    if (!self.isTouching) {
                        self._tbx.focus();
                    }
                });

                // use blur+capture to emulate focusout (not supported in FireFox)
                this.addEventListener(this.hostElement, 'blur', this._blur.bind(this), true);
                this.addEventListener(this.dropDown, 'blur', this._blur.bind(this), true);

                // keyboard events
                this.addEventListener(this.hostElement, 'keydown', this._keydown.bind(this));
                this.addEventListener(this.dropDown, 'keydown', this._keydown.bind(this));

                // textbox events
                this.addEventListener(this._tbx, 'input', function () {
                    self._setText(self.text, false);
                });
                this.addEventListener(this._tbx, 'focus', function () {
                    setTimeout(function () {
                        if (document.activeElement == self._tbx) {
                            self.selectAll();
                        }
                    });
                });

                // IE 9 does not fire an input event when the user removes characters from input
                // filled by keyboard, cut, or drag operations.
                // https://developer.mozilla.org/en-US/docs/Web/Events/input
                // so subscribe to keyup and set the text just in case (TFS 111189)
                if (document.doctype && navigator.appVersion.indexOf("MSIE 9") > -1) {
                    this.addEventListener(this._tbx, 'keyup', function () {
                        self._setText(self.text, false);
                    });
                }

                // drop-down button event
                this.addEventListener(this._btn, 'click', function (e) {
                    self.isDroppedDown = !self.isDroppedDown;
                    e.preventDefault();
                    e.stopPropagation();

                    // transfer focus to textbox if this was a click
                    if (!self.isTouching && document.activeElement == self._btn) {
                        self.selectAll();
                    }
                });

                // stop propagation of clicks on the drop-down element
                // (since they are not children of the hostElement, which can confuse
                // elements such as Bootstrap menus)
                this.addEventListener(this._dropDown, 'click', function (e) {
                    e.stopPropagation();
                });

                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    this._copyOriginalAttributes(this._tbx);
                }
            }
            //--------------------------------------------------------------------------
            //#region ** overrides
            // check whether this control or its drop-down contain the focused element.
            DropDown.prototype.containsFocus = function () {
                return _super.prototype.containsFocus.call(this) || wijmo.contains(this._dropDown, document.activeElement);
            };

            // close drop-down when disposing
            DropDown.prototype.dispose = function () {
                this.isDroppedDown = false;
                _super.prototype.dispose.call(this);
            };

            // reposition dropdown when refreshing
            DropDown.prototype.refresh = function (fullUpdate) {
                if (typeof fullUpdate === "undefined") { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);

                // update popup/focus
                if (this.isDroppedDown) {
                    if (getComputedStyle(this.hostElement).display != 'none') {
                        var ae = document.activeElement;
                        wijmo.showPopup(this._dropDown, this.hostElement);
                        if (ae instanceof HTMLElement && ae != document.activeElement) {
                            ae.focus();
                        }
                    }
                }
            };

            // reposition dropdown when window size changes
            DropDown.prototype._handleResize = function () {
                if (this.isDroppedDown) {
                    this.refresh();
                }
            };

            Object.defineProperty(DropDown.prototype, "text", {
                //#endregion
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets or sets the text shown on the control.
                */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DropDown.prototype, "inputElement", {
                /**
                * Gets the HTML input element hosted by the control.
                *
                * Use this property in situations where you want to customize the
                * attributes of the input element.
                */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DropDown.prototype, "placeholder", {
                /**
                * Gets or sets the string shown as a hint when the control is empty.
                */
                get: function () {
                    return this._tbx.placeholder;
                },
                set: function (value) {
                    this._tbx.placeholder = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DropDown.prototype, "isDroppedDown", {
                /**
                * Gets or sets a value indicating whether the drop down is currently visible.
                */
                get: function () {
                    return this._dropDown.style.display != 'none';
                },
                set: function (value) {
                    value = wijmo.asBoolean(value) && !this.disabled;
                    if (value != this.isDroppedDown && this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                        var dd = this._dropDown;
                        if (value) {
                            if (!dd.style.minWidth) {
                                dd.style.minWidth = this.hostElement.getBoundingClientRect().width + 'px';
                            }
                            dd.style.display = 'block';
                            this._updateDropDown();
                        } else {
                            if (this.containsFocus()) {
                                if (this.isTouching && this.showDropDownButton) {
                                    this._btn.focus();
                                } else {
                                    this._tbx.focus();
                                }
                            }
                            wijmo.hidePopup(dd);
                        }
                        this._updateFocusState();
                        this.onIsDroppedDownChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DropDown.prototype, "dropDown", {
                /**
                * Gets the drop down element shown when the @see:isDroppedDown
                * property is set to true.
                */
                get: function () {
                    return this._dropDown;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DropDown.prototype, "showDropDownButton", {
                /**
                * Gets or sets a value indicating whether the control should display a drop-down button.
                */
                get: function () {
                    return this._showBtn;
                },
                set: function (value) {
                    this._showBtn = wijmo.asBoolean(value);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Sets the focus to the control and selects all its content.
            */
            DropDown.prototype.selectAll = function () {
                if (this._elRef == this._tbx) {
                    wijmo.setSelectionRange(this._tbx, 0, this.text.length);
                }
            };

            /**
            * Raises the @see:textChanged event.
            */
            DropDown.prototype.onTextChanged = function (e) {
                this.textChanged.raise(this, e);
            };

            /**
            * Raises the @see:isDroppedDownChanging event.
            */
            DropDown.prototype.onIsDroppedDownChanging = function (e) {
                this.isDroppedDownChanging.raise(this, e);
                return !e.cancel;
            };

            /**
            * Raises the @see:isDroppedDownChanged event.
            */
            DropDown.prototype.onIsDroppedDownChanged = function (e) {
                this.isDroppedDownChanged.raise(this, e);
            };

            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // close the drop-down when losing focus
            DropDown.prototype._blur = function () {
                var self = this;
                setTimeout(function () {
                    if (!self.containsFocus()) {
                        self.isDroppedDown = false;
                    }
                }, 100);
            };

            // handle keyboard events
            DropDown.prototype._keydown = function (e) {
                // not if prevented
                if (e.defaultPrevented) {
                    return;
                }

                switch (e.keyCode) {
                    case 9 /* Tab */:
                    case 27 /* Escape */:
                        this.isDroppedDown = false;
                        break;

                    case 115 /* F4 */:
                    case 13 /* Enter */:
                        this.isDroppedDown = !this.isDroppedDown;
                        if (!this.isDroppedDown) {
                            this.focus();
                        }
                        if (e.keyCode == 115 /* F4 */) {
                            e.preventDefault();
                        }
                        break;

                    case 40 /* Down */:
                    case 38 /* Up */:
                        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
                            this.isDroppedDown = (e.keyCode == 40 /* Down */);
                            e.preventDefault();
                        }
                        break;
                }
            };

            // update text in textbox
            DropDown.prototype._setText = function (text, fullMatch) {
                // make sure we have a string
                if (text == null)
                    text = '';
                text = text.toString();

                // update element
                if (text != this._tbx.value) {
                    this._tbx.value = text;
                }

                // fire change event
                if (text != this._oldText) {
                    this._oldText = text;
                    this.onTextChanged();
                }
            };

            // update drop-down button visibility
            DropDown.prototype._updateBtn = function () {
                this._btn.tabIndex = -1;
                this._btn.style.display = this._showBtn ? '' : 'none';
            };

            // create the drop-down element
            DropDown.prototype._createDropDown = function () {
                // override in derived classes
            };

            // update drop down content before showing it
            DropDown.prototype._updateDropDown = function () {
                if (this.isDroppedDown) {
                    wijmo.showPopup(this._dropDown, this.hostElement);
                }
            };
            DropDown.controlTemplate = '<div style="position:relative" class="wj-template">' + '<div class="wj-input">' + '<div class="wj-input-group wj-input-btn-visible">' + '<input wj-part="input" type="text" class="wj-form-control" />' + '<span wj-part="btn" class="wj-input-group-btn" tabindex="-1">' + '<button class="wj-btn wj-btn-default" type="button" tabindex="-1">' + '<span class="wj-glyph-down"></span>' + '</button>' + '</span>' + '</div>' + '</div>' + '<div wj-part="dropdown" class="wj-content wj-dropdown-panel" ' + 'style="display:none;position:absolute;z-index:100;width:auto">' + '</div>' + '</div>';
            return DropDown;
        })(wijmo.Control);
        input.DropDown = DropDown;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=DropDown.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:Calendar control displays a one-month calendar and allows users
        * to select a date.
        *
        * You may use the @see:min and @see:max properties to restrict the range
        * of dates that the user can select.
        *
        * Use the @see:value property to get or set the currently selected date.
        *
        * The example below shows a <b>Date</b> value with date and time information
        * using an @see:InputDate and an @see:InputTime control. Notice how both controls
        * are bound to the same controller variable, and each edits the appropriate information
        * (either date or time). The example also shows a @see:Calendar control that allows
        * users to select the date with a single click.
        *
        * @fiddle:vgc3Y
        */
        var Calendar = (function (_super) {
            __extends(Calendar, _super);
            /**
            * Initializes a new instance of a @see:Calendar.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function Calendar(element, options) {
                _super.call(this, element);
                /**
                * Occurs after a new date is selected.
                */
                this.valueChanged = new wijmo.Event();
                /**
                * Occurs after the @see:displayMonth property changes.
                */
                this.displayMonthChanged = new wijmo.Event();
                /**
                * Occurs when an element representing a day in the calendar has been created.
                *
                * This event can be used to format calendar items for display. It is similar
                * in purpose to the @see:itemFormatter property, but has the advantage
                * of allowing multiple independent handlers.
                *
                * For example, the code below uses the @see:formatItem event to disable weekends
                * so they appear dimmed in the calendar:
                *
                * <pre>// disable Sundays and Saturdays
                * calendar.formatItem.addHandler(function (s, e) {
                *   var day = e.data.getDay();
                *   if (day == 0 || day == 6) {
                *     wijmo.addClass(e.item, 'wj-state-disabled');
                *   }
                * });</pre>
                */
                this.formatItem = new wijmo.Event();

                // initialize value (current date)
                this._value = new Date();
                this._currMonth = this._getMonth(this._value);

                // create child elements
                this._createChildren();

                // update the control
                this.refresh(true);

                // handle mouse and keyboard
                // The 'click' event may not be triggered on iOS Safari if focus changed
                // during previous tap. So use 'mouseup' instead.
                //this.addEventListener(this.hostElement, 'click', this._click.bind(this));
                this.addEventListener(this.hostElement, 'mouseup', this._click.bind(this));
                this.addEventListener(this.hostElement, 'keydown', this._keydown.bind(this));

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(Calendar.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets or sets the currently selected date.
                */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (!wijmo.DateTime.equals(this._value, value)) {
                        // check type
                        value = wijmo.asDate(value, true);

                        // honor ranges (but keep the time)
                        if (value) {
                            if (this._min != null) {
                                var min = wijmo.DateTime.fromDateTime(this._min, value);
                                if (value < min) {
                                    value = min;
                                }
                            }
                            if (this._max != null && value > this._max) {
                                var max = wijmo.DateTime.fromDateTime(this._max, value);
                                if (value > max) {
                                    value = max;
                                }
                            }
                        }

                        // update control
                        if (!wijmo.DateTime.equals(this._value, value) && this._isValidDate(value)) {
                            this._value = value;
                            this.displayMonth = this._getMonth(value);
                            this.invalidate(false);
                            this.onValueChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "min", {
                /**
                * Gets or sets the earliest date that the user can select in the calendar.
                */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    if (value != this.min) {
                        this._min = wijmo.asDate(value, true);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "max", {
                /**
                * Gets or sets the latest date that the user can select in the calendar.
                */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    if (value != this.max) {
                        this._max = wijmo.asDate(value, true);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "firstDayOfWeek", {
                /**
                * Gets or sets a value that represents the first day of the week,
                * the one displayed in the first column of the calendar.
                *
                * Setting this property to null causes the calendar to use the default
                * for the current culture. In the English culture, the first day of the
                * week is Sunday (0); in most European cultures, the first day of the
                * week is Monday (1).
                */
                get: function () {
                    return this._fdw;
                },
                set: function (value) {
                    if (value != this._fdw) {
                        this._fdw = wijmo.asNumber(value, true);
                        if (this._fdw && (this._fdw > 6 || this._fdw < 0)) {
                            throw 'firstDayOfWeek must be between 0 and 6 (Sunday to Saturday).';
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "displayMonth", {
                /**
                * Gets or sets the month displayed in the calendar.
                */
                get: function () {
                    return this._currMonth;
                },
                set: function (value) {
                    if (!wijmo.DateTime.equals(this.displayMonth, value)) {
                        value = wijmo.asDate(value);
                        if (this._isValidMonth(value)) {
                            this._currMonth = this._getMonth(value);
                            this.invalidate(true);
                            this.onDisplayMonthChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "showHeader", {
                /**
                * Gets or sets a value indicating whether the control displays the header
                * area with the current month and navigation buttons.
                */
                get: function () {
                    return this._tblHdr.style.display != 'none';
                },
                set: function (value) {
                    this._tblHdr.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "monthView", {
                /**
                * Gets or sets a value indicating whether the calendar displays a month or a year.
                */
                get: function () {
                    return this._tblMonth.style.display != 'none';
                },
                set: function (value) {
                    if (value != this.monthView) {
                        this._tblMonth.style.display = value ? '' : 'none';
                        this._tblYear.style.display = value ? 'none' : '';
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "itemFormatter", {
                /**
                * Gets or sets a formatter function to customize dates in the calendar.
                *
                * The formatter function can add any content to any date. It allows
                * complete customization of the appearance and behavior of the calendar.
                *
                * If specified, the function takes two parameters:
                * <ul>
                *     <li>the date being formatted </li>
                *     <li>the HTML element that represents the date</li>
                * </ul>
                *
                * For example, the code below shows weekends with a yellow background:
                * <pre>
                * calendar.itemFormatter = function(date, element) {
                *   var day = date.getDay();
                *   element.style.backgroundColor = day == 0 || day == 6 ? 'yellow' : '';
                * }
                * </pre>
                */
                get: function () {
                    return this._itemFormatter;
                },
                set: function (value) {
                    if (value != this._itemFormatter) {
                        this._itemFormatter = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Calendar.prototype, "itemValidator", {
                /**
                * Gets or sets a validator function to determine whether dates are valid for selection.
                *
                * If specified, the validator function should take one parameter representing the
                * date to be tested, and should return false if the date is invalid and should not
                * be selectable.
                *
                * For example, the code below shows weekends in a disabled state and prevents users
                * from selecting those dates:
                * <pre>
                * calendar.itemValidator = function(date) {
                *   var weekday = date.getDay();
                *   return weekday != 0 && weekday != 6;
                * }
                * </pre>
                */
                get: function () {
                    return this._itemValidator;
                },
                set: function (value) {
                    if (value != this._itemValidator) {
                        this._itemValidator = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:valueChanged event.
            */
            Calendar.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };

            /**
            * Raises the @see:displayMonthChanged event.
            */
            Calendar.prototype.onDisplayMonthChanged = function (e) {
                this.displayMonthChanged.raise(this, e);
            };

            /**
            * Raises the @see:formatItem event.
            *
            * @param e @see:FormatItemEventArgs that contains the event data.
            */
            Calendar.prototype.onFormatItem = function (e) {
                this.formatItem.raise(this, e);
            };

            /**
            * Refreshes the control.
            *
            * @param fullUpdate Indicates whether to update the control layout as well as the content.
            */
            Calendar.prototype.refresh = function (fullUpdate) {
                if (typeof fullUpdate === "undefined") { fullUpdate = true; }
                var cells, cell, day, fdw = this.firstDayOfWeek != null ? this.firstDayOfWeek : wijmo.Globalize.getFirstDayOfWeek();

                // call base class to suppress any pending invalidations
                _super.prototype.refresh.call(this, fullUpdate);

                // calculate first day of the calendar
                this._firstDay = wijmo.DateTime.addDays(this.displayMonth, -(this.displayMonth.getDay() - fdw + 7) % 7);

                // update current month (e.g. January 2014)
                this._spMonth.textContent = wijmo.Globalize.format(this.displayMonth, 'y');

                // update week day headers (localizable)
                cells = this._tblMonth.querySelectorAll('td');
                for (var i = 0; i < 7 && i < cells.length; i++) {
                    day = wijmo.DateTime.addDays(this._firstDay, i);
                    cells[i].textContent = wijmo.Globalize.format(day, 'ddd');
                }

                for (var i = 7; i < cells.length; i++) {
                    cell = cells[i];
                    day = wijmo.DateTime.addDays(this._firstDay, i - 7);
                    cell.textContent = day.getDate().toString();
                    cell.className = '';
                    var invalid = !this._isValidDate(day);
                    wijmo.toggleClass(cell, 'wj-state-invalid', invalid);
                    wijmo.toggleClass(cell, 'wj-state-disabled', invalid || day.getMonth() != this.displayMonth.getMonth() || !this._isValidDay(day));
                    wijmo.toggleClass(cell, 'wj-state-selected', wijmo.DateTime.sameDate(day, this.value));
                    cell.style.fontWeight = wijmo.DateTime.sameDate(day, new Date()) ? 'bold' : '';

                    // customize the display
                    if (this.itemFormatter) {
                        this.itemFormatter(day, cell);
                    }
                    if (this.formatItem.hasHandlers) {
                        var e = new input.FormatItemEventArgs(i, day, cell);
                        this.onFormatItem(e);
                    }
                }

                // hide rows that belong to the next month
                var rows = this._tblMonth.querySelectorAll('tr');
                if (rows.length) {
                    day = wijmo.DateTime.addDays(this._firstDay, 28);
                    rows[rows.length - 2].style.display = (day.getMonth() == this.displayMonth.getMonth()) ? '' : 'none';
                    day = wijmo.DateTime.addDays(this._firstDay, 35);
                    rows[rows.length - 1].style.display = (day.getMonth() == this.displayMonth.getMonth()) ? '' : 'none';
                }

                // update current year
                cells = this._tblYear.querySelectorAll('td');
                if (cells.length) {
                    cells[0].textContent = this.displayMonth.getFullYear().toString();
                }

                for (var i = 1; i < cells.length; i++) {
                    cell = cells[i];
                    day = new Date(this.displayMonth.getFullYear(), i - 1, 1);
                    cell.textContent = wijmo.Globalize.format(day, 'MMM');
                    cell.className = '';
                    wijmo.toggleClass(cell, 'wj-state-disabled', !this._isValidMonth(day));
                    wijmo.toggleClass(cell, 'wj-state-selected', wijmo.DateTime.sameDate(this._getMonth(day), this.displayMonth));
                }
            };

            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // check whether a day is within the valid range
            Calendar.prototype._isValidDay = function (value) {
                if (this.min && value < wijmo.DateTime.fromDateTime(this.min, value))
                    return false;
                if (this.max && value > wijmo.DateTime.fromDateTime(this.max, value))
                    return false;
                return true;
            };

            // check whether a month is within the valid range
            Calendar.prototype._isValidMonth = function (value) {
                var y = value.getFullYear(), m = value.getMonth(), first = new Date(y, m, 1), last = wijmo.DateTime.addDays(new Date(y, m + 1), -1);
                return this._isValidDay(first) || this._isValidDay(last);
            };

            // check whether a date should be selectable by the user
            Calendar.prototype._isValidDate = function (value) {
                return this.itemValidator && value ? this.itemValidator(value) : true;
            };

            // create child elements
            Calendar.prototype._createChildren = function () {
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-calendar', tpl, {
                    _tblHdr: 'tbl-header',
                    _tdMonth: 'btn-month',
                    _spMonth: 'span-month',
                    _btnPrev: 'btn-prev',
                    _btnToday: 'btn-today',
                    _btnNext: 'btn-next',
                    _tblMonth: 'tbl-month',
                    _tblYear: 'tbl-year'
                });

                // populate month calendar
                var tr = document.createElement('TR');
                wijmo.addClass(tr, 'wj-header');
                for (var d = 0; d < 7; d++) {
                    tr.appendChild(document.createElement('TD'));
                }
                this._tblMonth.appendChild(tr);
                for (var w = 0; w < 6; w++) {
                    tr = document.createElement('TR');
                    for (var d = 0; d < 7; d++) {
                        tr.appendChild(document.createElement('TD'));
                    }
                    this._tblMonth.appendChild(tr);
                }

                // populate year calendar
                tr = document.createElement('TR');
                wijmo.addClass(tr, 'wj-header');
                var td = document.createElement('TD');
                td.setAttribute('colspan', '4');
                tr.appendChild(td);
                this._tblYear.appendChild(tr);
                for (var i = 0; i < 3; i++) {
                    tr = document.createElement('TR');
                    for (var j = 0; j < 4; j++) {
                        tr.appendChild(document.createElement('TD'));
                    }
                    this._tblYear.appendChild(tr);
                }
            };

            // handle clicks on the calendar
            Calendar.prototype._click = function (e) {
                var handled = false;

                // get element that was clicked
                var elem = e.target;

                // switch month/year view
                if (wijmo.contains(this._tdMonth, elem)) {
                    this.monthView = !this.monthView;
                    handled = true;
                } else if (wijmo.contains(this._btnPrev, elem)) {
                    this._navigateDate(this.monthView, -1);
                    handled = true;
                } else if (wijmo.contains(this._btnNext, elem)) {
                    this._navigateDate(this.monthView, +1);
                    handled = true;
                } else if (wijmo.contains(this._btnToday, elem)) {
                    this._navigateDate(this.monthView, 0);
                    handled = true;
                }

                // select day/month
                if (!handled && elem) {
                    elem = wijmo.closest(elem, 'TD');
                    if (elem) {
                        if (this.monthView) {
                            var index = this._getCellIndex(this._tblMonth, elem);
                            if (index > 6) {
                                this.value = wijmo.DateTime.fromDateTime(wijmo.DateTime.addDays(this._firstDay, index - 7), this.value);
                                handled = true;
                            }
                        } else {
                            var index = this._getCellIndex(this._tblYear, elem);
                            if (index > 0) {
                                this.displayMonth = new Date(this.displayMonth.getFullYear(), index - 1, 1);
                                this.monthView = true;
                                handled = true;
                            }
                        }
                    }
                }

                // if we handled the mouse, prevent browser from seeing it
                if (handled) {
                    e.preventDefault();
                    //e.stopPropagation();
                }
            };

            // gets the index of a cell in a table
            Calendar.prototype._getCellIndex = function (tbl, cell) {
                var cells = tbl.querySelectorAll('TD');
                for (var i = 0; i < cells.length; i++) {
                    if (cells[i] == cell)
                        return i;
                }
                return -1;
            };

            // handle keyboard events
            Calendar.prototype._keydown = function (e) {
                // not interested in ctrl/shift keys
                if (!e.ctrlKey && !e.shiftKey) {
                    var handled = true;
                    if (this.monthView) {
                        switch (e.keyCode) {
                            case 37 /* Left */:
                                this.value = this._addDays(-1);
                                break;
                            case 39 /* Right */:
                                this.value = this._addDays(+1);
                                break;
                            case 38 /* Up */:
                                this.value = this._addDays(-7);
                                break;
                            case 40 /* Down */:
                                this.value = this._addDays(+7);
                                break;
                            case 34 /* PageDown */:
                                this.displayMonth = this._addMonths(+1);
                                break;
                            case 33 /* PageUp */:
                                this.displayMonth = this._addMonths(-1);
                                break;
                            default:
                                handled = false;
                                break;
                        }
                    } else {
                        switch (e.keyCode) {
                            case 37 /* Left */:
                                this.displayMonth = this._addMonths(-1);
                                break;
                            case 39 /* Right */:
                                this.displayMonth = this._addMonths(+1);
                                break;
                            case 38 /* Up */:
                                this.displayMonth = this._addMonths(-4);
                                break;
                            case 40 /* Down */:
                                this.displayMonth = this._addMonths(+4);
                                break;
                            case 34 /* PageDown */:
                                this.displayMonth = this._addMonths(+12);
                                break;
                            case 33 /* PageUp */:
                                this.displayMonth = this._addMonths(-12);
                                break;
                            case 13 /* Enter */:
                                this.monthView = true;
                                break;
                            default:
                                handled = false;
                                break;
                        }
                    }

                    // if we handled the key, prevent browser from seeing it
                    if (handled) {
                        e.preventDefault();
                        //e.stopPropagation();
                    }
                }
            };

            // gets the month being displayed in the calendar
            Calendar.prototype._getMonth = function (date) {
                if (!date)
                    date = new Date();
                return new Date(date.getFullYear(), date.getMonth(), 1);
            };

            // adds a given number of days to the current value (preserving time)
            Calendar.prototype._addDays = function (days) {
                var dt = wijmo.DateTime.addDays(this.value, days);
                return wijmo.DateTime.fromDateTime(dt, this.value);
            };

            // adds a given number of months to the current display month
            Calendar.prototype._addMonths = function (months) {
                return wijmo.DateTime.addMonths(this.displayMonth, months);
            };

            // change display month by a month or a year, or skip to the current
            Calendar.prototype._navigateDate = function (month, skip) {
                switch (skip) {
                    case 0:
                        if (month) {
                            this.value = new Date();
                        } else {
                            this.displayMonth = this._getMonth(new Date());
                        }
                        break;
                    case +1:
                        if (month) {
                            this.displayMonth = wijmo.DateTime.addMonths(this.displayMonth, +1);
                        } else {
                            this.displayMonth = new Date(this.displayMonth.getFullYear() + 1, 0, 1);
                        }
                        break;
                    case -1:
                        if (month) {
                            this.displayMonth = wijmo.DateTime.addMonths(this.displayMonth, -1);
                        } else {
                            this.displayMonth = new Date(this.displayMonth.getFullYear() - 1, 11, 1);
                        }
                        break;
                }
            };
            Calendar.controlTemplate = '<div class="wj-calendar-outer wj-content">' + '<div wj-part="tbl-header" class="wj-calendar-header">' + '<div wj-part="btn-month" class="wj-month-select">' + '<span wj-part="span-month"></span> <span class="wj-glyph-down"></span>' + '</div>' + '<div class="wj-btn-group">' + '<button type="button" wj-part="btn-prev" tabindex="-1" class="wj-btn wj-btn-default"><span class="wj-glyph-left"></span></button>' + '<button type="button" wj-part="btn-today" tabindex="-1" class="wj-btn wj-btn-default"><span class="wj-glyph-circle"></span></button>' + '<button type="button" wj-part="btn-next" tabindex="-1" class="wj-btn wj-btn-default"><span class="wj-glyph-right"></span></button>' + '</div>' + '</div>' + '<table wj-part="tbl-month" class="wj-calendar-month" />' + '<table wj-part="tbl-year" class="wj-calendar-year" style="display:none" />' + '</div>';
            return Calendar;
        })(wijmo.Control);
        input.Calendar = Calendar;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Calendar.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:ColorPicker control allows users to select a color by clicking
        * on panels to adjust color channels (hue, saturation, brightness, alpha).
        *
        * Use the @see:value property to get or set the currently selected color.
        *
        * The control is used as a drop-down for the @see:InputColor control.
        *
        * @fiddle:84xvsz90
        */
        var ColorPicker = (function (_super) {
            __extends(ColorPicker, _super);
            /**
            * Initializes a new instance of a @see:ColorPicker.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function ColorPicker(element, options) {
                _super.call(this, element);
                this._hsb = [.5, 1, 1];
                this._alpha = 1;
                /**
                * Occurs when the color changes.
                */
                this.valueChanged = new wijmo.Event();

                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-colorpicker wj-content', tpl, {
                    _eSB: 'div-sb',
                    _eHue: 'div-hue',
                    _eAlpha: 'div-alpha',
                    _ePreview: 'div-pv',
                    _ePal: 'div-pal',
                    _eText: 'div-text'
                });

                // build palette
                this._palette = '#FFF,#000, #F00,#FFC000,#FFFF00,#92D050,#00B050,#00B0F0,#0070C0,#7030A0'.split(',');
                this._updatePalette();

                // build hue gradient
                // (use an image since IE9 doesn't support multi-stop gradients)
                this._eHue.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAD4CAIAAACi6hsPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAGvSURBVDhPXdBPaM9xHMfxz4pWaxcmtoOhpdXSVpiyHWxqmVpDjaU5rK34XfypjTJ/p+ZPay6jhsOsRrKwaJElf9IQq03WIkv4FeMwMq221tfje1ByeFzfvd7PEKWGEKWTQRZLySWfVRRTQjmVbKWGOhLsZT+HaeY0bbTTQSfdXOcWffTzmAFeMcwoYyT5ygS/mA5hNgphip98J8kHRnnNSwZ4yH1uc4OrdHGR87RximYO0cgedlLLdqqoYAPrWMtKVrCcJSxiPmnMJUQp/Bsyk2xyyKOAQooopYwKtlDNDur5G7SBJo7RQiv/B+2hl3s84CkvGGKEOOYnxolj/mYmhBmDJ5ngCx95xxsGecYj4pB3iENeoZMO2mmlhaMcpIE4ZII6aqhmM3HMMkooopB88sghm0wySCeVlCjMCVFIYx4LWUwOeRSwhmLWU84mqqihll3sppEmjnOSs5zjEl1c4yZ99POE5wwxwns+840fTDFLFKaZZIJxkozxlmEGGSC+GF++Sy89dHOZC8Rr4lVnOMERDrCPBPXEX22jko2UEn+/mnxyWUYWC0gnNUQh/AEc0HJs6cex0gAAAABJRU5ErkJggg==)';
                this._eHue.style.backgroundSize = 'contain';

                // add filter gradients to IE 9
                if (navigator.appVersion.indexOf('MSIE 9') > -1) {
                    this._eSB.children[0].style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffffff,endColorstr=#00ffffff,GradientType=1)';
                    this._eSB.children[1].style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#ff000000,GradientType=0)';
                }

                // add cursors to panels
                tpl = ColorPicker._tplCursor;
                this._cSB = wijmo.createElement(tpl);
                this._cHue = wijmo.createElement(tpl);
                this._cHue.style.width = '100%';
                this._cAlpha = wijmo.createElement(tpl);
                this._cAlpha.style.height = '100%';
                this._eSB.appendChild(this._cSB);
                this._eHue.appendChild(this._cHue);
                this._eAlpha.appendChild(this._cAlpha);

                // handle mouse
                var self = this;
                this.addEventListener(this.hostElement, 'mousedown', function (e) {
                    document.addEventListener('mousemove', mouseMove);
                    document.addEventListener('mouseup', mouseUp);
                    self._mouseDown(e);
                });
                var mouseMove = function (e) {
                    self._mouseMove(e);
                };
                var mouseUp = function (e) {
                    document.removeEventListener('mousemove', mouseMove);
                    document.removeEventListener('mouseup', mouseUp);
                    self._mouseUp(e);
                };

                // handle clicks on the palette
                this.addEventListener(this.hostElement, 'click', function (e) {
                    var el = e.target;
                    if (el && el.tagName == 'DIV' && wijmo.contains(self._ePal, el)) {
                        var color = el.style.backgroundColor;
                        if (color) {
                            self.value = new wijmo.Color(color).toString();
                        }
                    }
                });

                // initialize value to white
                this.value = '#ffffff';

                // initialize control options
                this.initialize(options);

                // initialize control
                this._updatePanels();
            }
            Object.defineProperty(ColorPicker.prototype, "showAlphaChannel", {
                /**
                * Gets or sets a value indicating whether the @see:ColorPicker allows users
                * to edit the color's alpha channel (transparency).
                */
                get: function () {
                    return this._eAlpha.parentElement.style.display != 'none';
                },
                set: function (value) {
                    this._eAlpha.parentElement.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ColorPicker.prototype, "showColorString", {
                /**
                * Gets or sets a value indicating whether the @see:ColorPicker shows a string representation
                * of the current color.
                */
                get: function () {
                    return this._eText.style.display != 'none';
                },
                set: function (value) {
                    this._eText.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ColorPicker.prototype, "value", {
                /**
                * Gets or sets the currently selected color.
                */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this.value) {
                        // save new value
                        this._value = wijmo.asString(value);
                        this._eText.innerText = this._value;

                        // parse new color, convert to hsb values
                        var c = new wijmo.Color(this._value), hsb = c.getHsb();

                        // check whether the color really changed
                        if (this._hsb[0] != hsb[0] || this._hsb[1] != hsb[1] || this._hsb[2] != hsb[2] || this._alpha != c.a) {
                            // update hsb channels (but keep hue when s/b go to zero)
                            if (hsb[2] == 0) {
                                hsb[0] = this._hsb[0];
                                hsb[1] = this._hsb[1];
                            } else if (hsb[1] == 0) {
                                hsb[0] = this._hsb[0];
                            }
                            this._hsb = hsb;
                            this._alpha = c.a;

                            // raise valueChanged event
                            this.onValueChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ColorPicker.prototype, "palette", {
                /**
                * Gets or sets an array that contains the colors in the palette.
                *
                * The palette contains ten colors, represented by an array with
                * ten strings. The first two colors are usually white and black.
                */
                get: function () {
                    return this._palette;
                },
                set: function (value) {
                    value = wijmo.asArray(value);
                    for (var i = 0; i < value.length && i < this._palette.length; i++) {
                        var entry = wijmo.asString(value[i]);
                        this._palette[i] = entry;
                    }
                    this._updatePalette();
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:valueChanged event.
            */
            ColorPicker.prototype.onValueChanged = function () {
                this._updatePanels();
                this.valueChanged.raise(this);
            };

            // ** event handlers
            ColorPicker.prototype._mouseDown = function (e) {
                this._htDown = this._getTargetPanel(e);
                if (this._htDown) {
                    e.preventDefault();
                    this.focus();
                    this._mouseMove(e);
                }
            };
            ColorPicker.prototype._mouseMove = function (e) {
                if (this._htDown) {
                    var rc = this._htDown.getBoundingClientRect();
                    if (this._htDown == this._eHue) {
                        this._hsb[0] = wijmo.clamp((e.clientY - rc.top) / rc.height, 0, .99);
                        this._updateColor();
                    } else if (this._htDown == this._eSB) {
                        this._hsb[1] = wijmo.clamp((e.clientX - rc.left) / rc.width, 0, 1);
                        this._hsb[2] = wijmo.clamp(1 - (e.clientY - rc.top) / rc.height, 0, 1);
                        this._updateColor();
                    } else if (this._htDown == this._eAlpha) {
                        this._alpha = wijmo.clamp((e.clientX - rc.left) / rc.width, 0, 1);
                        this._updateColor();
                    }
                }
            };
            ColorPicker.prototype._mouseUp = function (e) {
                this._htDown = null;
            };

            // update color value to reflect new hsb values
            ColorPicker.prototype._updateColor = function () {
                var c = wijmo.Color.fromHsb(this._hsb[0], this._hsb[1], this._hsb[2], this._alpha);
                this.value = c.toString();
                this._updatePanels();
            };

            // updates the color elements in the palette
            ColorPicker.prototype._updatePalette = function () {
                var white = new wijmo.Color('#fff'), black = new wijmo.Color('#000');

                // clear the current palette
                this._ePal.innerHTML = '';

                for (var i = 0; i < this._palette.length; i++) {
                    var div = wijmo.createElement('<div style="float:left;width:10%;box-sizing:border-box;padding:1px">'), clr = new wijmo.Color(this._palette[i]), hsb = clr.getHsb();

                    // add palette color
                    div.appendChild(this._makePalEntry(clr, 4));

                    for (var r = 0; r < 5; r++) {
                        if (hsb[1] == 0) {
                            var pct = r * .1 + (hsb[2] > .5 ? .05 : .55);
                            clr = wijmo.Color.interpolate(white, black, pct);
                        } else {
                            clr = wijmo.Color.fromHsb(hsb[0], 0.1 + r * 0.2, 1 - r * 0.1);
                        }
                        div.appendChild(this._makePalEntry(clr, 0));
                    }

                    // add color and shades to palette
                    this._ePal.appendChild(div);
                }
            };

            // creates a palette entry with the given color
            ColorPicker.prototype._makePalEntry = function (color, margin) {
                var e = document.createElement('div');
                wijmo.setCss(e, {
                    width: '100%',
                    cursor: 'pointer',
                    backgroundColor: color.toString(),
                    marginBottom: margin
                });
                e.innerHTML = '&nbsp';
                return e;
            };

            // update color and cursor on all panels
            ColorPicker.prototype._updatePanels = function () {
                var clrHue = wijmo.Color.fromHsb(this._hsb[0], 1, 1, 1), clrSolid = wijmo.Color.fromHsb(this._hsb[0], this._hsb[1], this._hsb[2], 1);
                this._eSB.style.backgroundColor = clrHue.toString();
                this._eAlpha.style.background = 'linear-gradient(to right, transparent 0%, ' + clrSolid.toString() + ' 100%)';
                if (navigator.appVersion.indexOf('MSIE 9') > -1) {
                    this._eAlpha.style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=' + clrSolid.toString() + ', GradientType = 1)';
                }
                this._ePreview.style.backgroundColor = this.value;

                this._cHue.style.top = (this._hsb[0] * 100).toFixed(0) + '%';
                this._cSB.style.left = (this._hsb[1] * 100).toFixed(0) + '%';
                this._cSB.style.top = (100 - this._hsb[2] * 100).toFixed(0) + '%';
                this._cAlpha.style.left = (this._alpha * 100).toFixed(0) + '%';
            };

            // gets the design panel that contains the mouse target
            ColorPicker.prototype._getTargetPanel = function (e) {
                var target = e.target;
                if (wijmo.contains(this._eSB, target))
                    return this._eSB;
                if (wijmo.contains(this._eHue, target))
                    return this._eHue;
                if (wijmo.contains(this._eAlpha, target))
                    return this._eAlpha;
                return null;
            };
            ColorPicker.controlTemplate = '<div style="position:relative;width:100%;height:100%">' + '<div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px">' + '<div wj-part="div-pal">' + '<div style="float:left;width:10%;box-sizing:border-box;padding:2px">' + '<div style="background-color:black;width:100%">&nbsp;</div>' + '<div style="height:6px"></div>' + '</div>' + '</div>' + '<div wj-part="div-text" style="position:absolute;bottom:0px;display:none"></div>' + '</div>' + '<div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px">' + '<div wj-part="div-sb" class="wj-colorbox" style="position:relative;float:left;width:89%;height:89%">' + '<div style="position:absolute;width:100%;height:100%;background:linear-gradient(to right, white 0%,transparent 100%)"></div>' + '<div style="position:absolute;width:100%;height:100%;background:linear-gradient(to top, black 0%,transparent 100%)"></div>' + '</div>' + '<div style="float:left;width:1%;height:89%"></div>' + '<div style="float:left;width:10%;height:89%">' + '<div wj-part="div-hue" class="wj-colorbox" style="position:relative;width:100%;height:100%;cursor:pointer"></div>' + '</div>' + '<div style="float:left;width:89%;height:1%"></div>' + '<div style="float:left;width:89%;height:10%">' + '<div style="width:100%;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAAcSURBVBhXY/iPBBYgAWpKQGkwgMqDAdUk/v8HAM7Mm6GatDUYAAAAAElFTkSuQmCC)">' + '<div wj-part="div-alpha" class="wj-colorbox" style="position:relative;width:100%;height:100%;cursor:pointer"></div>' + '</div>' + '</div>' + '<div style="float:left;width:1%;height:10%"></div>' + '<div style="float:left;width:10%;height:10%">' + '<div wj-part="div-pv" class="wj-colorbox" style="width:100%;height:100%"></div>' + '</div>' + '</div>' + '</div>';
            ColorPicker._tplCursor = '<div style="position:absolute;left:50%;top:50%;width:7px;height:7px;transform:translate(-50%,-50%);border:2px solid #f0f0f0;border-radius:50px;box-shadow:0px 0px 4px 2px #0f0f0f;"></div>';
            return ColorPicker;
        })(wijmo.Control);
        input.ColorPicker = ColorPicker;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ColorPicker.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:ListBox control displays a list of items which may contain
        * plain text or HTML, and allows users to select items with the mouse or
        * the keyboard.
        *
        * Use the @see:selectedIndex property to determine which item is currently
        * selected.
        *
        * You can populate a @see:ListBox using an array of strings or you can use
        * an array of objects, in which case the @see:displayPath property determines
        * which object property is displayed on the list.
        *
        * To display HTML rather than plain text, set the @see:isContentHtml property
        * to true.
        *
        * The example below creates a @see:ListBox control and populates it using
        * a 'countries' array. The control updates its @see:selectedIndex and
        * @see:selectedItem properties as the user moves the selection.
        *
        * @fiddle:8HnLx
        */
        var ListBox = (function (_super) {
            __extends(ListBox, _super);
            /**
            * Initializes a new instance of a @see:ListBox.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function ListBox(element, options) {
                _super.call(this, element);
                this._html = false;
                this._search = '';
                /**
                * Occurs when the value of the @see:selectedIndex property changes.
                */
                this.selectedIndexChanged = new wijmo.Event();
                /**
                * Occurs when the list of items changes.
                */
                this.itemsChanged = new wijmo.Event();
                /**
                * Occurs before the list items are generated.
                */
                this.loadingItems = new wijmo.Event();
                /**
                * Occurs after the list items are generated.
                */
                this.loadedItems = new wijmo.Event();
                /**
                * Occurs when the current item is checked or unchecked by the user.
                *
                * This event is raised when the @see:checkedMemberPath is set to the name of a
                * property to add checkboxes to each item in the control.
                *
                * Use the @see:selectedItem property to retrieve the item that was checked or
                * unchecked.
                */
                this.itemChecked = new wijmo.Event();
                /**
                * Occurs when the value of the @see:checkedItems property changes.
                */
                this.checkedItemsChanged = new wijmo.Event();
                /**
                * Occurs when an element representing a list item has been created.
                *
                * This event can be used to format list items for display. It is similar
                * in purpose to the @see:itemFormatter property, but has the advantage
                * of allowing multiple independent handlers.
                */
                this.formatItem = new wijmo.Event();

                // instantiate and apply template
                this.applyTemplate('wj-control wj-listbox wj-content', null, null);

                // initializing from <select> tag
                if (this._orgTag == 'SELECT') {
                    this._copyOriginalAttributes(this.hostElement);
                    this._populateSelectElement(this.hostElement);
                }

                // make sure the list can get the focus
                // no, this is handled by the Control class (TFS 127785)
                //this._e.tabIndex = 0;
                // handle mouse and keyboard
                var e = this.hostElement;
                this.addEventListener(e, 'click', this._click.bind(this));
                this.addEventListener(e, 'keydown', this._keydown.bind(this));
                this.addEventListener(e, 'keypress', this._keypress.bind(this));

                // initialize control options
                this.initialize(options);
            }
            //--------------------------------------------------------------------------
            //#region ** overrides
            /**
            * Refreshes the list.
            */
            ListBox.prototype.refresh = function () {
                _super.prototype.refresh.call(this);
                this._populateList();
            };

            Object.defineProperty(ListBox.prototype, "itemsSource", {
                //#endregion
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets or sets the array or @see:ICollectionView object that contains the list items.
                */
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    if (this._items != value) {
                        // unbind current collection view
                        if (this._cv) {
                            this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                            this._cv = null;
                        }

                        // save new data source and collection view
                        this._items = value;
                        this._cv = wijmo.asCollectionView(value);

                        // bind new collection view
                        if (this._cv != null) {
                            this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                        }

                        // update the list
                        this._populateList();
                        this.onItemsChanged();
                        this.onSelectedIndexChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "collectionView", {
                /**
                * Gets the @see:ICollectionView object used as the item source.
                */
                get: function () {
                    return this._cv;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "isContentHtml", {
                /**
                * Gets or sets a value indicating whether items contain plain text or HTML.
                */
                get: function () {
                    return this._html;
                },
                set: function (value) {
                    if (value != this._html) {
                        this._html = wijmo.asBoolean(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "itemFormatter", {
                /**
                * Gets or sets a function used to customize the values shown on the list.
                * The function takes two arguments, the item index and the default text or html, and
                * returns the new text or html to display.
                *
                * NOTE: If the formatting function needs a scope (i.e. a meaningful 'this'
                * value), then remember to set the filter using the 'bind' function to
                * specify the 'this' object. For example:
                * <pre>
                *   listBox.itemFormatter = customItemFormatter.bind(this);
                *   function customItemFormatter(index, content) {
                *     if (this.makeItemBold(index)) {
                *       content = '&lt;b&gt;' + content + '&lt;/b&gt;';
                *     }
                *     return content;
                *   }
                * </pre>
                */
                get: function () {
                    return this._itemFormatter;
                },
                set: function (value) {
                    if (value != this._itemFormatter) {
                        this._itemFormatter = wijmo.asFunction(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "displayMemberPath", {
                /**
                * Gets or sets the name of the property to use as the visual representation of the items.
                */
                get: function () {
                    return this._pathDisplay;
                },
                set: function (value) {
                    if (value != this._pathDisplay) {
                        this._pathDisplay = wijmo.asString(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "selectedValuePath", {
                /**
                * Gets or sets the name of the property used to get the @see:selectedValue
                * from the @see:selectedItem.
                */
                get: function () {
                    return this._pathValue;
                },
                set: function (value) {
                    this._pathValue = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "checkedMemberPath", {
                /**
                * Gets or sets the name of the property used to control the checkboxes
                * placed next to each item.
                *
                * Use this property to create multi-select lisboxes.
                * When an item is checked or unchecked, the control raises the @see:itemChecked event.
                * Use the @see:selectedItem property to retrieve the item that was checked or unchecked,
                * or use the @see:checkedItems property to retrieve the list of items that are currently
                * checked.
                */
                get: function () {
                    return this._pathChecked;
                },
                set: function (value) {
                    if (value != this._pathChecked) {
                        this._pathChecked = wijmo.asString(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Gets the string displayed for the item at a given index.
            *
            * The string may be plain text or HTML, depending on the setting
            * of the @see:isContentHtml property.
            *
            * @param index The index of the item.
            */
            ListBox.prototype.getDisplayValue = function (index) {
                // get the text or html
                var item = null;
                if (index > -1 && this._cv && this._cv.items) {
                    item = this._cv.items[index];
                    if (item && this.displayMemberPath) {
                        //assert(this.displayMemberPath in item, 'item does not define displayMemberPath property "' + this.displayMemberPath + '".');
                        item = item[this.displayMemberPath];
                    }
                }
                var text = item != null ? item.toString() : '';

                // allow caller to override/modify the text or html
                if (this.itemFormatter) {
                    text = this.itemFormatter(index, text);
                }

                // return the result
                return text;
            };

            /**
            * Gets the text displayed for the item at a given index (as plain text).
            *
            * @param index The index of the item.
            */
            ListBox.prototype.getDisplayText = function (index) {
                var children = this.hostElement.children, item = index > -1 && index < children.length ? children[index] : null;
                return item != null ? item.textContent : '';
            };

            Object.defineProperty(ListBox.prototype, "selectedIndex", {
                /**
                * Gets or sets the index of the currently selected item.
                */
                get: function () {
                    return this._cv ? this._cv.currentPosition : -1;
                },
                set: function (value) {
                    if (this._cv) {
                        this._cv.moveCurrentToPosition(wijmo.asNumber(value));
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "selectedItem", {
                /**
                * Gets or sets the item that is currently selected.
                */
                get: function () {
                    return this._cv ? this._cv.currentItem : null;
                },
                set: function (value) {
                    if (this._cv) {
                        this._cv.moveCurrentTo(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "selectedValue", {
                /**
                * Gets or sets the value of the @see:selectedItem obtained using the @see:selectedValuePath.
                */
                get: function () {
                    var item = this.selectedItem;
                    if (item && this.selectedValuePath) {
                        item = item[this.selectedValuePath];
                    }
                    return item;
                },
                set: function (value) {
                    var path = this.selectedValuePath, index = -1;
                    if (this._cv) {
                        for (var i = 0; i < this._cv.items.length; i++) {
                            var item = this._cv.items[i];
                            if ((path && item[path] == value) || (!path && item == value)) {
                                index = i;
                                break;
                            }
                        }
                        this.selectedIndex = index;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ListBox.prototype, "maxHeight", {
                /**
                * Gets or sets the maximum height of the list.
                */
                get: function () {
                    return parseFloat(this.hostElement.style.maxHeight);
                },
                set: function (value) {
                    this.hostElement.style.maxHeight = wijmo.asNumber(value) + 'px';
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Highlights the selected item and scrolls it into view.
            */
            ListBox.prototype.showSelection = function () {
                var index = this.selectedIndex, host = this.hostElement, children = host.children, e;

                for (var i = 0; i < children.length; i++) {
                    e = children[i];
                    wijmo.toggleClass(e, 'wj-state-selected', i == index);
                }

                // scroll into view
                if (index > -1 && index < children.length) {
                    e = children[index];
                    var rco = e.getBoundingClientRect();
                    var rcc = this.hostElement.getBoundingClientRect();
                    if (rco.bottom > rcc.bottom) {
                        host.scrollTop += rco.bottom - rcc.bottom;
                    } else if (rco.top < rcc.top) {
                        host.scrollTop -= rcc.top - rco.top;
                    }
                }
            };

            /**
            * Gets the checked state of an item on the list.
            *
            * This method is applicable only on multi-select listboxes
            * (see the @see:checkedMemberPath property).
            *
            * @param index Item index.
            */
            ListBox.prototype.getItemChecked = function (index) {
                var item = this._cv.items[index];
                if (wijmo.isObject(item) && this.checkedMemberPath) {
                    return item[this.checkedMemberPath];
                }
                var cb = this._getCheckbox(index);
                return cb ? cb.checked : false;
            };

            /**
            * Sets the checked state of an item on the list.
            *
            * This method is applicable only on multi-select listboxes
            * (see the @see:checkedMemberPath property).
            *
            * @param index Item index.
            * @param checked Item's new checked state.
            */
            ListBox.prototype.setItemChecked = function (index, checked) {
                this._setItemChecked(index, checked, true);
            };

            /**
            * Toggles the checked state of an item on the list.
            * This method is applicable only on multi-select listboxes
            * (see the @see:checkedMemberPath property).
            *
            * @param index Item index.
            */
            ListBox.prototype.toggleItemChecked = function (index) {
                var checked = !this.getItemChecked(index);
                this.setItemChecked(index, !checked);
            };

            Object.defineProperty(ListBox.prototype, "checkedItems", {
                /**
                * Gets or sets an array containing the items that are currently checked.
                */
                get: function () {
                    var arr = [];
                    if (this._cv) {
                        for (var i = 0; i < this._cv.items.length; i++) {
                            if (this.getItemChecked(i)) {
                                arr.push(this._cv.items[i]);
                            }
                        }
                    }
                    return arr;
                },
                set: function (value) {
                    var cv = this._cv, arr = wijmo.asArray(value, false);
                    if (cv && arr) {
                        var pos = cv.currentPosition;
                        for (var i = 0; i < cv.items.length; i++) {
                            var item = cv.items[i];
                            this._setItemChecked(i, arr.indexOf(item) > -1, false);
                        }
                        cv.moveCurrentToPosition(pos);
                        this.onCheckedItemsChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:selectedIndexChanged event.
            */
            ListBox.prototype.onSelectedIndexChanged = function (e) {
                this.selectedIndexChanged.raise(this, e);
            };

            /**
            * Raises the @see:itemsChanged event.
            */
            ListBox.prototype.onItemsChanged = function (e) {
                this.itemsChanged.raise(this, e);
            };

            /**
            * Raises the @see:loadingItems event.
            */
            ListBox.prototype.onLoadingItems = function (e) {
                this.loadingItems.raise(this, e);
            };

            /**
            * Raises the @see:loadedItems event.
            */
            ListBox.prototype.onLoadedItems = function (e) {
                this.loadedItems.raise(this, e);
            };

            /**
            * Raises the @see:itemCheched event.
            */
            ListBox.prototype.onItemChecked = function (e) {
                this.itemChecked.raise(this, e);
            };

            /**
            * Raises the @see:checkedItemsChanged event.
            */
            ListBox.prototype.onCheckedItemsChanged = function (e) {
                this.checkedItemsChanged.raise(this, e);
            };

            /**
            * Raises the @see:formatItem event.
            *
            * @param e @see:FormatItemEventArgs that contains the event data.
            */
            ListBox.prototype.onFormatItem = function (e) {
                this.formatItem.raise(this, e);
            };

            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // sets the checked state of an item on the list
            ListBox.prototype._setItemChecked = function (index, checked, notify) {
                if (typeof notify === "undefined") { notify = true; }
                // update data item
                var item = this._cv.items[index];
                if (wijmo.isObject(item)) {
                    var ecv = wijmo.tryCast(this._cv, 'IEditableCollectionView');
                    if (item[this.checkedMemberPath] != checked) {
                        this._checking = true;
                        if (ecv) {
                            ecv.editItem(item);
                            item[this.checkedMemberPath] = checked;
                            ecv.commitEdit();
                        } else {
                            item[this.checkedMemberPath] = checked;
                            this._cv.refresh();
                        }
                        this._checking = false;
                    }
                }

                // update checkbox value
                var cb = this._getCheckbox(index);
                if (cb && cb.checked != checked) {
                    cb.checked = checked;
                }

                // fire events
                if (notify) {
                    this.onItemChecked();
                    this.onCheckedItemsChanged();
                }
            };

            // handle changes to the data source
            ListBox.prototype._cvCollectionChanged = function (sender, e) {
                if (!this._checking) {
                    this._populateList();
                    this.onItemsChanged();
                }
            };
            ListBox.prototype._cvCurrentChanged = function (sender, e) {
                this.showSelection();
                this.onSelectedIndexChanged();
            };

            // populate the list from the current itemsSource
            ListBox.prototype._populateList = function () {
                // get ready to populate
                var host = this.hostElement;
                if (host) {
                    // remember if we have focus
                    var focus = this.containsFocus();

                    // fire event so user can clean up any current items
                    this.onLoadingItems();

                    // populate
                    host.innerHTML = '';
                    if (this._cv) {
                        for (var i = 0; i < this._cv.items.length; i++) {
                            // get item text
                            var text = this.getDisplayValue(i);
                            if (this._html != true) {
                                text = wijmo.escapeHtml(text);
                            }

                            // add checkbox
                            if (this.checkedMemberPath) {
                                var checked = this._cv.items[i][this.checkedMemberPath];
                                text = '<label><input type="checkbox" tabindex="-1"' + (checked ? ' checked' : '') + '> ' + text + '</label>';
                            }

                            // build item
                            var item = document.createElement('div');
                            item.innerHTML = text;
                            item.className = 'wj-listbox-item';
                            if (wijmo.hasClass(item.firstChild, 'wj-separator')) {
                                item.className += ' wj-separator';
                            }

                            // allow custom formatting
                            if (this.formatItem.hasHandlers) {
                                var e = new FormatItemEventArgs(i, this._cv.items[i], item);
                                this.onFormatItem(e);
                            }

                            // add item to list
                            host.appendChild(item);
                        }
                    }

                    // make sure the list is not totally empty
                    // or min-height/max-height won't work properly in IE/Edge
                    if (host.children.length == 0) {
                        host.appendChild(document.createElement('div'));
                    }

                    // restore focus
                    if (focus && !this.containsFocus()) {
                        this.focus();
                    }

                    // scroll selection into view
                    this.showSelection();

                    // fire event so user can hook up to items
                    this.onLoadedItems();
                }
            };

            // click to select elements
            ListBox.prototype._click = function (e) {
                // select the item that was clicked
                var children = this.hostElement.children;
                for (var index = 0; index < children.length; index++) {
                    if (wijmo.contains(children[index], e.target)) {
                        this.selectedIndex = index;
                        break;
                    }
                }

                // handle checkboxes
                if (this.checkedMemberPath && this.selectedIndex > -1) {
                    var cb = this._getCheckbox(this.selectedIndex);
                    if (cb == e.target) {
                        this.setItemChecked(this.selectedIndex, cb.checked);
                    }
                }

                // take focus away from any input elements in non-selected items
                if (this.containsFocus() && document.activeElement != this.hostElement) {
                    this.focus();
                }
            };

            // handle keydown (cursor keys)
            ListBox.prototype._keydown = function (e) {
                var handled = true, index = this.selectedIndex, host = this.hostElement, children = host.children;
                switch (e.keyCode) {
                    case 40 /* Down */:
                        if (index < children.length - 1) {
                            this.selectedIndex++;
                        }
                        break;
                    case 38 /* Up */:
                        if (index > 0) {
                            this.selectedIndex--;
                        }
                        break;
                    case 36 /* Home */:
                        this.selectedIndex = 0;
                        break;
                    case 35 /* End */:
                        this.selectedIndex = children.length - 1;
                        break;
                    case 34 /* PageDown */:
                        if (this.selectedIndex > -1) {
                            var index = this.selectedIndex, height = host.offsetHeight, offset = 0;
                            for (var i = index + 1; i < this._cv.items.length; i++) {
                                var itemHeight = children[i].scrollHeight;
                                if (offset + itemHeight > height) {
                                    this.selectedIndex = i;
                                    break;
                                }
                                offset += itemHeight;
                            }
                            if (this.selectedIndex == index) {
                                this._cv.moveCurrentToLast();
                            }
                        }
                        break;
                    case 33 /* PageUp */:
                        if (this.selectedIndex > -1) {
                            var index = this.selectedIndex, height = host.offsetHeight, offset = 0;
                            for (var i = index - 1; i > 0; i--) {
                                var itemHeight = children[i].scrollHeight;
                                if (offset + itemHeight > height) {
                                    this.selectedIndex = i;
                                    break;
                                }
                                offset += itemHeight;
                            }
                            if (this.selectedIndex == index) {
                                this._cv.moveCurrentToFirst();
                            }
                        }
                        break;
                    case 32 /* Space */:
                        if (this.checkedMemberPath && this.selectedIndex > -1) {
                            var cb = this._getCheckbox(this.selectedIndex);
                            if (cb) {
                                e.preventDefault();
                                this.setItemChecked(this.selectedIndex, !cb.checked);
                            }
                        }
                        break;
                    default:
                        handled = false;
                        break;
                }
                if (handled) {
                    e.preventDefault();
                }
            };

            // handle keypress (select/search)
            ListBox.prototype._keypress = function (e) {
                if (!e.defaultPrevented) {
                    // auto search
                    if (e.charCode > 32 || (e.charCode == 32 && this._search)) {
                        e.preventDefault();

                        // update search string
                        this._search += String.fromCharCode(e.charCode).toLowerCase();
                        var self = this;
                        if (self._toSearch) {
                            clearTimeout(self._toSearch);
                        }
                        self._toSearch = setTimeout(function () {
                            self._toSearch = 0;
                            self._search = '';
                        }, 600);

                        // perform search
                        var cnt = this.hostElement.childElementCount;
                        for (var off = this._search.length > 1 ? 0 : 1; off < cnt; off++) {
                            var idx = (this.selectedIndex + off) % cnt, txt = this.getDisplayText(idx).trim().toLowerCase();
                            if (txt.indexOf(this._search) == 0) {
                                this.selectedIndex = idx;
                                break;
                            }
                        }
                    }
                }
            };

            // gets the checkbox element in a listbox item
            ListBox.prototype._getCheckbox = function (index) {
                var li = this.hostElement.children[index];
                return li.querySelector('input[type=checkbox]');
            };

            // build collectionView from OPTION elements items in a SELECT element
            ListBox.prototype._populateSelectElement = function (hostElement) {
                var children = hostElement.children, items = [], selIndex = -1;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (child.tagName == 'OPTION') {
                        // keep track of selected item
                        if (child.hasAttribute('selected')) {
                            selIndex = items.length;
                        }

                        // add option to collectionView
                        if (child.innerHTML) {
                            items.push({
                                hdr: child.innerHTML,
                                val: child.getAttribute('value'),
                                cmdParam: child.getAttribute('cmd-param')
                            });
                        } else {
                            items.push({
                                hdr: '<div class="wj-separator" style="width:100%;height:1px;margin:3px 0px;background-color:rgba(0,0,0,.2)"/>'
                            });
                        }

                        // remove child from host
                        hostElement.removeChild(child);
                        i--;
                    }
                }

                // apply items to control
                if (items) {
                    this.displayMemberPath = 'hdr';
                    this.selectedValuePath = 'val';
                    this.itemsSource = items;
                    this.selectedIndex = selIndex;
                }
            };
            return ListBox;
        })(wijmo.Control);
        input.ListBox = ListBox;

        /**
        * Provides arguments for the @see:formatItem event.
        */
        var FormatItemEventArgs = (function (_super) {
            __extends(FormatItemEventArgs, _super);
            /**
            * Initializes a new instance of a @see:FormatItemEventArgs.
            *
            * @param index Index of the item being formatted.
            * @param data Data item being formatted.
            * @param item Element that represents the list item to be formatted.
            */
            function FormatItemEventArgs(index, data, item) {
                _super.call(this);
                this._index = wijmo.asNumber(index);
                this._data = data;
                this._item = wijmo.asType(item, HTMLElement);
            }
            Object.defineProperty(FormatItemEventArgs.prototype, "index", {
                /**
                * Gets the index of the data item in the list.
                */
                get: function () {
                    return this._index;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FormatItemEventArgs.prototype, "data", {
                /**
                * Gets the data item being formatted.
                */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FormatItemEventArgs.prototype, "item", {
                /**
                * Gets a reference to the element that represents the list item to be formatted.
                */
                get: function () {
                    return this._item;
                },
                enumerable: true,
                configurable: true
            });
            return FormatItemEventArgs;
        })(wijmo.EventArgs);
        input.FormatItemEventArgs = FormatItemEventArgs;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ListBox.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:ComboBox control allows users to pick strings from lists.
        *
        * The control automatically completes entries as the user types, and allows users
        * to show a drop-down list with the items available.
        *
        * Use the @see:selectedIndex or the @see:text properties to determine which
        * item is currently selected.
        *
        * The @see:isEditable property determines whether users can enter values that
        * are not present in the list.
        *
        * The example below creates a @see:ComboBox control and populates it with a list
        * of countries. The @see:ComboBox searches for the country as the user types.
        * The <b>isEditable</b> property is set to false, so the user is forced to
        * select one of the items in the list.
        *
        * The example also shows how to create and populate a @see:ComboBox using
        * an HTML <b>&lt;select;&gt</b> element with <b>&lt;option;&gt</b> child
        * elements.
        *
        * @fiddle:8HnLx
        */
        var ComboBox = (function (_super) {
            __extends(ComboBox, _super);
            /**
            * Initializes a new instance of a @see:ComboBox control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function ComboBox(element, options) {
                _super.call(this, element);
                // property storage
                this._required = true;
                this._editable = false;
                // private stuff
                this._composing = false;
                this._deleting = false;
                this._settingText = false;
                /**
                * Occurs when the value of the @see:selectedIndex property changes.
                */
                this.selectedIndexChanged = new wijmo.Event();

                // handle IME
                var self = this;
                this.addEventListener(this._tbx, 'compositionstart', function () {
                    self._composing = true;
                });
                this.addEventListener(this._tbx, 'compositionend', function () {
                    self._composing = false;
                    self._setText(self.text, true);
                });

                // use wheel to scroll through the items
                var evt = 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
                this.addEventListener(this.hostElement, evt, function (e) {
                    if (self.containsFocus() && !self.isDroppedDown && !e.defaultPrevented) {
                        if (self.selectedIndex > -1) {
                            var step = wijmo.clamp(e.wheelDelta || -e.detail, -1, +1);
                            self.selectedIndex = wijmo.clamp(self.selectedIndex - step, 0, self.collectionView.items.length - 1);
                            e.preventDefault();
                        }
                    }
                });

                // initializing from <select> tag
                if (this._orgTag == 'SELECT') {
                    this._copyOriginalAttributes(this.hostElement);
                    this._lbx._populateSelectElement(this.hostElement);
                }

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(ComboBox.prototype, "itemsSource", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets or sets the array or @see:ICollectionView object that contains the items to select from.
                */
                get: function () {
                    return this._lbx.itemsSource;
                },
                set: function (value) {
                    this._lbx.itemsSource = value;
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "collectionView", {
                /**
                * Gets the @see:ICollectionView object used as the item source.
                */
                get: function () {
                    return this._lbx.collectionView;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "displayMemberPath", {
                /**
                * Gets or sets the name of the property to use as the visual representation of the items.
                */
                get: function () {
                    return this._lbx.displayMemberPath;
                },
                set: function (value) {
                    this._lbx.displayMemberPath = value;
                    var text = this.getDisplayText();
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "selectedValuePath", {
                /**
                * Gets or sets the name of the property used to get the @see:selectedValue from the @see:selectedItem.
                */
                get: function () {
                    return this._lbx.selectedValuePath;
                },
                set: function (value) {
                    this._lbx.selectedValuePath = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "isContentHtml", {
                /**
                * Gets or sets a value indicating whether the drop-down list displays items as plain text or as HTML.
                */
                get: function () {
                    return this._lbx.isContentHtml;
                },
                set: function (value) {
                    if (value != this.isContentHtml) {
                        this._lbx.isContentHtml = wijmo.asBoolean(value);
                        var text = this.getDisplayText();
                        if (this.text != text) {
                            this._setText(text, true);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "itemFormatter", {
                /**
                * Gets or sets a function used to customize the values shown in the drop-down list.
                * The function takes two arguments, the item index and the default text or html, and
                * returns the new text or html to display.
                *
                * NOTE: If the formatting function needs a scope (i.e. a meaningful 'this'
                * value), then remember to set the filter using the 'bind' function to
                * specify the 'this' object. For example:
                * <pre>
                *   comboBox.itemFormatter = customItemFormatter.bind(this);
                *   function customItemFormatter(index, content) {
                *     if (this.makeItemBold(index)) {
                *       content = '&lt;b&gt;' + content + '&lt;/b&gt;';
                *     }
                *     return content;
                *   }
                * </pre>
                */
                get: function () {
                    return this._lbx.itemFormatter;
                },
                set: function (value) {
                    this._lbx.itemFormatter = wijmo.asFunction(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "selectedIndex", {
                /**
                * Gets or sets the index of the currently selected item in the drop-down list.
                */
                get: function () {
                    return this._lbx.selectedIndex;
                },
                set: function (value) {
                    if (value != this.selectedIndex) {
                        this._lbx.selectedIndex = value;
                    }
                    var text = this.getDisplayText(value);
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "selectedItem", {
                /**
                * Gets or sets the item that is currently selected in the drop-down list.
                */
                get: function () {
                    return this._lbx.selectedItem;
                },
                set: function (value) {
                    this._lbx.selectedItem = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "selectedValue", {
                /**
                * Gets or sets the value of the @see:selectedItem, obtained using the @see:selectedValuePath.
                */
                get: function () {
                    return this._lbx.selectedValue;
                },
                set: function (value) {
                    this._lbx.selectedValue = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "required", {
                /**
                * Gets or sets whether the control value must be set to a non-null value
                * or whether it can be set to null (by deleting the content of the control).
                */
                get: function () {
                    return this._required;
                },
                set: function (value) {
                    this._required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "isEditable", {
                /**
                * Gets or sets a value that enables or disables editing of the text
                * in the input element of the @see:ComboBox (defaults to false).
                */
                get: function () {
                    return this._editable;
                },
                set: function (value) {
                    this._editable = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "maxDropDownHeight", {
                /**
                * Gets or sets the maximum height of the drop-down list.
                */
                get: function () {
                    return this._lbx.maxHeight;
                },
                set: function (value) {
                    this._lbx.maxHeight = wijmo.asNumber(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ComboBox.prototype, "maxDropDownWidth", {
                /**
                * Gets or sets the maximum width of the drop-down list.
                *
                * The width of the drop-down list is also limited by the width of
                * the control itself (that value represents the drop-down's minimum width).
                */
                get: function () {
                    var lbx = this._dropDown;
                    return parseInt(lbx.style.maxWidth);
                },
                set: function (value) {
                    var lbx = this._dropDown;
                    lbx.style.maxWidth = wijmo.asNumber(value) + 'px';
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Gets the string displayed for the item at a given index (as plain text).
            *
            * @param index The index of the item to retrieve the text for.
            */
            ComboBox.prototype.getDisplayText = function (index) {
                if (typeof index === "undefined") { index = this.selectedIndex; }
                return this._lbx.getDisplayText(index);
            };

            /**
            * Raises the @see:selectedIndexChanged event.
            */
            ComboBox.prototype.onSelectedIndexChanged = function (e) {
                this._updateBtn();
                this.selectedIndexChanged.raise(this, e);
            };

            /**
            * Gets the index of the first item that matches a given string.
            *
            * @param text The text to search for.
            * @param fullMatch A value indicating whether to look for a full match or just the start of the string.
            * @return The index of the item, or -1 if not found.
            */
            ComboBox.prototype.indexOf = function (text, fullMatch) {
                var cv = this.collectionView;
                if (cv && cv.items && text) {
                    text = text.toString().toLowerCase();
                    for (var i = 0; i < cv.items.length; i++) {
                        var t = this.getDisplayText(i).toLowerCase();
                        if (fullMatch) {
                            if (t == text) {
                                return i;
                            }
                        } else {
                            if (t.indexOf(text) == 0) {
                                return i;
                            }
                        }
                    }
                }
                return -1;
            };

            Object.defineProperty(ComboBox.prototype, "listBox", {
                /**
                * Gets the @see:ListBox control shown in the drop-down.
                */
                get: function () {
                    return this._lbx;
                },
                enumerable: true,
                configurable: true
            });

            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // show current selection when dropping down
            ComboBox.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    this._lbx.showSelection();
                    if (!this.isTouching) {
                        this.selectAll();
                    }
                }
            };

            // update button visibility and value list
            ComboBox.prototype._updateBtn = function () {
                var cv = this.collectionView;
                this._btn.style.display = this._showBtn && cv && cv.items.length ? '' : 'none';
            };

            // create the drop-down element
            ComboBox.prototype._createDropDown = function () {
                var self = this;

                // create the drop-down element
                this._lbx = new input.ListBox(this._dropDown);

                // limit the size of the drop-down
                this._lbx.maxHeight = 200;

                // update our selection when user picks an item from the ListBox
                // or when the selected index changes because the list changed
                this._lbx.selectedIndexChanged.addHandler(function () {
                    self._updateBtn();
                    self.selectedIndex = self._lbx.selectedIndex;
                    self.onSelectedIndexChanged();
                });

                // update button display when item list changes
                this._lbx.itemsChanged.addHandler(function () {
                    self._updateBtn();
                });

                // close the drop-down when the user clicks to select an item
                this.addEventListener(this._dropDown, 'click', function () {
                    self.isDroppedDown = false;
                });
            };

            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // update text in textbox
            ComboBox.prototype._setText = function (text, fullMatch) {
                // not while composing IME text...
                if (this._composing)
                    return;

                // prevent reentrant calls while moving CollectionView cursor
                if (this._settingText)
                    return;
                this._settingText = true;

                // make sure we have a string
                if (text == null)
                    text = '';
                text = text.toString();

                // get variables we need
                var index = this.selectedIndex, cv = this.collectionView, start = this._getSelStart(), len = -1;

                // try autocompletion
                if (!this.isEditable || !this._deleting) {
                    index = this.indexOf(text, fullMatch);
                    if (index < 0 && fullMatch) {
                        index = this.indexOf(text, false);
                    }
                    if (index < 0 && start > 0) {
                        index = this.indexOf(text.substr(0, start), false);
                    }
                    if (index < 0 && !this.isEditable && cv && cv.items) {
                        if (this.required || text) {
                            index = Math.max(0, this.indexOf(this._oldText, false));
                        }
                    }
                    if (index > -1) {
                        len = start;
                        text = this.getDisplayText(index);
                    }
                }

                // update collectionView
                if (cv) {
                    cv.moveCurrentToPosition(index);
                }

                // update element
                if (text != this._tbx.value) {
                    this._tbx.value = text;
                }

                // update text selection
                if (len > -1 && this.containsFocus() && !this.isTouching) {
                    this._setSelectionRange(len, text.length);
                }

                // call base class to fire textChanged event
                _super.prototype._setText.call(this, text, fullMatch);

                // clear flags
                this._deleting = false;
                this._settingText = false;
            };

            // skip to the next/previous item that starts with a given string, wrapping
            ComboBox.prototype._findNext = function (text, step) {
                if (this.collectionView) {
                    text = text.toLowerCase();
                    var len = this.collectionView.items.length, index, t;
                    for (var i = 1; i <= len; i++) {
                        index = (this.selectedIndex + i * step + len) % len;
                        t = this.getDisplayText(index).toLowerCase();
                        if (t.indexOf(text) == 0) {
                            return index;
                        }
                    }
                }
                return this.selectedIndex;
            };

            // override to select items with the keyboard
            ComboBox.prototype._keydown = function (e) {
                // allow base class
                _super.prototype._keydown.call(this, e);

                // if the base class handled this, we're done
                if (e.defaultPrevented) {
                    return;
                }

                // if the input element is not visible, we're done (e.g. menu)
                if (this._elRef != this._tbx) {
                    return;
                }

                // remember we pressed a key when handling the TextChanged event
                if (e.keyCode == 8 /* Back */ || e.keyCode == 46 /* Delete */) {
                    this._deleting = true;
                }

                // not if we have no items
                var cv = this.collectionView;
                if (!cv || !cv.items) {
                    return;
                }

                // handle key
                var start = -1;
                switch (e.keyCode) {
                    case 38 /* Up */:
                        start = this._getSelStart();
                        this.selectedIndex = this._findNext(this.text.substr(0, start), -1);
                        this._setSelectionRange(start, this.text.length);
                        e.preventDefault();
                        break;

                    case 40 /* Down */:
                        start = this._getSelStart();
                        this.selectedIndex = this._findNext(this.text.substr(0, start), +1);
                        this._setSelectionRange(start, this.text.length);
                        e.preventDefault();
                        break;

                    case 13 /* Enter */:
                        this._setSelectionRange(0, this.text.length);
                        break;
                }
            };

            // set selection range in input element (if it is visible)
            ComboBox.prototype._setSelectionRange = function (start, end) {
                if (this._elRef == this._tbx) {
                    wijmo.setSelectionRange(this._tbx, start, end);
                }
            };

            // get selection start in an extra-safe way (TFS 82372)
            ComboBox.prototype._getSelStart = function () {
                return this._tbx && this._tbx.value ? this._tbx.selectionStart : 0;
            };
            return ComboBox;
        })(input.DropDown);
        input.ComboBox = ComboBox;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ComboBox.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /**
    * Defines input controls for strings, numbers, dates, times, and colors.
    */
    (function (input) {
        'use strict';

        /**
        * The @see:AutoComplete control is an input control that allows callers
        * to customize the item list as the user types.
        *
        * The control is similar to the @see:ComboBox, except the item source is a
        * function (@see:itemsSourceFunction) rather than a static list. For example,
        * you can look up items on remote databases as the user types.
        *
        * The example below creates an @see:AutoComplete control and populates it using
        * a 'countries' array. The @see:AutoComplete searches for the country as the user
        * types, and narrows down the list of countries that match the current input.
        *
        * @fiddle:8HnLx
        */
        var AutoComplete = (function (_super) {
            __extends(AutoComplete, _super);
            //private _itemFormatter: Function;
            /**
            * Initializes a new instance of an @see:AutoComplete control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function AutoComplete(element, options) {
                _super.call(this, element);
                this._minLength = 2;
                this._maxItems = 6;
                this._itemCount = 0;
                this._delay = 500;
                this._query = '';
                this._handlingCallback = false;
                this.isEditable = true;
                this.isContentHtml = true;
                this.itemFormatter = this._defaultFormatter.bind(this);
                if (options) {
                    this.initialize(options);
                }
            }
            Object.defineProperty(AutoComplete.prototype, "minLength", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets or sets the minimum input length to trigger autocomplete suggestions.
                */
                get: function () {
                    return this._minLength;
                },
                set: function (value) {
                    this._minLength = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AutoComplete.prototype, "maxItems", {
                /**
                * Gets or sets the maximum number of items to display in the drop-down list.
                */
                get: function () {
                    return this._maxItems;
                },
                set: function (value) {
                    this._maxItems = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AutoComplete.prototype, "delay", {
                /**
                * Gets or sets the delay, in milliseconds, between when a keystroke occurs
                * and when the search is performed.
                */
                get: function () {
                    return this._delay;
                },
                set: function (value) {
                    this._delay = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AutoComplete.prototype, "itemsSourceFunction", {
                /**
                * Gets or sets a function that provides list items dynamically as the user types.
                *
                * The function takes three parameters:
                * <ul>
                *     <li>the query string typed by the user</li>
                *     <li>the maximum number of items to return</li>
                *     <li>the callback function to call when the results become available</li>
                * </ul>
                *
                * For example:
                * <pre>
                * autoComplete.itemsSourceFunction = function (query, max, callback) {
                *   // get results from the server
                *   var params = { query: query, max: max };
                *   $.getJSON('companycatalog.ashx', params, function (response) {
                *     // return results to the control
                *     callback(response);
                *   });
                * };
                * </pre>
                */
                get: function () {
                    return this._itemsSourceFn;
                },
                set: function (value) {
                    this._itemsSourceFn = wijmo.asFunction(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AutoComplete.prototype, "cssMatch", {
                /**
                * Gets or sets the name of the css class used to highlight any parts
                * of the content that match the search terms.
                *
                * By default, this property is set to null, which causes the matching
                * terms to be shown in bold. You can set it to the name of a css class
                * to change the way the matches are displayed.
                *
                * The example below shows how you could use a specific css class called
                * 'match' to highlight the matches:
                *
                * <pre>
                * &lt;!-- css style for highlighting matches --&gt;
                * .match {
                *   background-color: yellow;
                *   color:black;
                * }
                * // assign css style to cssMatch property
                * autoComplete.cssMatch = 'match';
                * </pre>
                */
                get: function () {
                    return this._cssMatch;
                },
                set: function (value) {
                    this._cssMatch = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // override to make up/down keys work properly
            AutoComplete.prototype._keydown = function (e) {
                if (!e.defaultPrevented && this.isDroppedDown) {
                    switch (e.keyCode) {
                        case 38 /* Up */:
                        case 40 /* Down */:
                            this.selectAll();
                            break;
                    }
                }
                _super.prototype._keydown.call(this, e);
            };

            // update text in textbox
            AutoComplete.prototype._setText = function (text) {
                // don't call base class (to avoid autocomplete)
                // don't do this while handling the itemsSourcefunction callback
                if (this._handlingCallback) {
                    return;
                }

                // resetting...
                if (!text && this.selectedIndex > -1) {
                    this.selectedIndex = -1;
                }

                // raise textChanged
                if (text != this._oldText) {
                    // assign only if necessary to prevent occasionally swapping chars (Android 4.4.2)
                    if (this._tbx.value != text) {
                        this._tbx.value = text;
                    }
                    this._oldText = text;
                    this.onTextChanged();

                    // no text? no filter...
                    if (!text && this.collectionView) {
                        this.collectionView.filter = this._query = null;
                        this.isDroppedDown = false;
                        return;
                    }
                }

                // update list when user types in some text
                var self = this;
                if (self._toSearch) {
                    clearTimeout(self._toSearch);
                }
                if (text != this.getDisplayText()) {
                    // get new search terms on a timeOut (so the control doesn't update too often)
                    self._toSearch = setTimeout(function () {
                        self._toSearch = null;

                        // get search terms
                        var terms = self.text.trim().toLowerCase();
                        if (terms.length >= self._minLength && terms != self._query) {
                            // save new search terms
                            self._query = terms;

                            // escape regex characters in the terms string
                            terms = terms.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

                            // build regular expressions for searching and highlighting the items
                            self._rxMatch = new RegExp('(?=.*' + terms.replace(/ /g, ')(?=.*') + ')', 'ig');
                            self._rxHighlight = new RegExp('(' + terms.replace(/ /g, '|') + ')', 'ig');

                            // update list
                            //self.isDroppedDown = false;
                            if (self.itemsSourceFunction) {
                                self.itemsSourceFunction(terms, self.maxItems, self._itemSourceFunctionCallback.bind(self));
                            } else {
                                self._updateItems();
                            }
                        }
                    }, this._delay);
                }
            };

            // populate list with results from itemSourceFunction
            AutoComplete.prototype._itemSourceFunctionCallback = function (result) {
                // update the itemsSource
                this._handlingCallback = true;
                var cv = wijmo.asCollectionView(result);
                if (cv) {
                    cv.moveCurrentToPosition(-1);
                }
                this.itemsSource = cv;
                this.isDroppedDown = true;
                this._handlingCallback = false;

                // refresh to update the drop-down position
                this.refresh();
            };

            // closing the drop-down: commit the change
            AutoComplete.prototype.onIsDroppedDownChanged = function (e) {
                // do not call super because it selects the whole text, and we don't
                // want to do that while the user is typing
                //super.onIsDroppedDownChanged(e);
                this.isDroppedDownChanged.raise(this, e);

                // select the whole text only if we have a selected item
                this._query = '';
                if (this.selectedIndex > -1) {
                    this._setText(this.getDisplayText());
                    if (!this.isTouching) {
                        this.selectAll();
                    }
                } else if (!this.isTouching) {
                    this._tbx.focus();
                }
            };

            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // apply the filter to show only the matches
            AutoComplete.prototype._updateItems = function () {
                var cv = this.collectionView;
                if (cv) {
                    // apply the filter
                    this._handlingCallback = true;
                    cv.beginUpdate();
                    this._itemCount = 0;
                    cv.filter = this._filter.bind(this);
                    cv.moveCurrentToPosition(-1);
                    cv.endUpdate();
                    this._handlingCallback = false;

                    // show/hide the drop-down
                    this.isDroppedDown = cv.items.length > 0 && this.containsFocus();
                    if (cv.items.length == 0 && !this.isEditable) {
                        this.selectedIndex = -1;
                    }

                    // refresh to update the drop-down position
                    this.refresh();
                }
            };

            // filter the items and show only the matches
            AutoComplete.prototype._filter = function (item) {
                // honor maxItems
                if (this._itemCount >= this._maxItems) {
                    return false;
                }

                // apply filter to item
                if (this.displayMemberPath) {
                    item = item[this.displayMemberPath];
                }
                var text = item != null ? item.toString() : '';

                // count matches
                if (this._rxMatch.test(text)) {
                    this._itemCount++;
                    return true;
                }

                // no pass
                return false;
            };

            // default item formatter: show matches in bold
            AutoComplete.prototype._defaultFormatter = function (index, text) {
                var r = '<b>$1</b>';
                if (this._cssMatch) {
                    r = '<span class=' + this._cssMatch + '>$1</span>';
                }
                return text.replace(this._rxHighlight, r);
            };
            return AutoComplete;
        })(input.ComboBox);
        input.AutoComplete = AutoComplete;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=AutoComplete.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:Menu control shows a text element with a drop-down list of commands that the user
        * can invoke by click or touch.
        *
        * The @see:Menu control inherits from @see:ComboBox, so you populate and style it
        * in the same way that you do the @see:ComboBox (see the @see:itemsSource property).
        *
        * The @see:Menu control adds an @see:itemClicked event that fires when the user selects
        * an item from the menu. The event handler can inspect the @see:Menu control to determine
        * which item was clicked. For example:
        *
        * <pre>
        * var menu = new wijmo.input.Menu(hostElement);
        * menu.header = 'Main Menu';
        * menu.itemsSource = ['option 1', 'option 2', 'option 3'];
        * menu.itemClicked.addHandler(function(sender, args) {
        * var menu = sender;
        *   alert('Thanks for selecting item ' + menu.selectedIndex + ' from menu ' + menu.header + '!');
        * });
        * </pre>
        *
        * The example below illustrates how you can create value pickers, command-based menus, and
        * menus that respond to the <b>itemClicked</b> event. The menus in this example are based
        * on HTML <b>&lt;select;&gt</b> and <b>&lt;option;&gt</b> elements.
        *
        * @fiddle:BX853
        */
        var Menu = (function (_super) {
            __extends(Menu, _super);
            /**
            * Initializes a new instance of a @see:Menu control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function Menu(element, options) {
                _super.call(this, element);
                /**
                * Occurs when the user picks an item from the menu.
                *
                * The handler can determine which item was picked by reading the event sender's
                * @see:selectedIndex property.
                */
                this.itemClicked = new wijmo.Event();

                // replace textbox with header div
                this._tbx.style.display = 'none';
                var tpl = '<div wj-part="header" class="wj-form-control" style="cursor:default"/>';
                this._hdr = wijmo.createElement(tpl);
                this._tbx.parentElement.insertBefore(this._hdr, this._tbx);
                this._elRef = this._hdr;

                // this is not required
                this.required = false;

                // initializing from <select> tag
                if (this._orgTag == 'SELECT') {
                    this.header = this.hostElement.getAttribute('header');
                    if (this._lbx.itemsSource) {
                        this.commandParameterPath = 'cmdParam';
                    }
                }

                // change some defaults
                this.isContentHtml = true;
                this.maxDropDownHeight = 500;

                // toggle drop-down when clicking on the header
                // or fire the click event if this menu is a split-button
                var self = this;
                this.addEventListener(this._hdr, 'click', function () {
                    if (self._isButton) {
                        self.isDroppedDown = false;
                        self._raiseCommand(wijmo.EventArgs.empty);
                    } else {
                        self.isDroppedDown = !self.isDroppedDown;
                    }
                });

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(Menu.prototype, "header", {
                /**
                * Gets or sets the HTML text shown in the @see:Menu element.
                */
                get: function () {
                    return this._hdr.innerHTML;
                },
                set: function (value) {
                    this._hdr.innerHTML = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Menu.prototype, "command", {
                /**
                * Gets or sets the command to execute when an item is clicked.
                *
                * Commands are objects that implement two methods:
                * <ul>
                *  <li><b>executeCommand(parameter)</b> This method executes the command.</li>
                *  <li><b>canExecuteCommand(parameter)</b> This method returns a Boolean value
                *      that determines whether the controller can execute the command.
                *      If this method returns false, the menu option is disabled.</li>
                * </ul>
                *
                * You can also set commands on individual items using the @see:commandPath
                * property.
                */
                get: function () {
                    return this._command;
                },
                set: function (value) {
                    this._command = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Menu.prototype, "commandPath", {
                /**
                * Gets or sets the name of the property that contains the command to
                * execute when the user clicks an item.
                *
                * Commands are objects that implement two methods:
                * <ul>
                *  <li><b>executeCommand(parameter)</b> This method executes the command.</li>
                *  <li><b>canExecuteCommand(parameter)</b> This method returns a Boolean value
                *      that determines whether the controller can execute the command.
                *      If this method returns false, the menu option is disabled.</li>
                * </ul>
                */
                get: function () {
                    return this._cmdPath;
                },
                set: function (value) {
                    this._cmdPath = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Menu.prototype, "commandParameterPath", {
                /**
                * Gets or sets the name of the property that contains a parameter to use with
                * the command specified by the @see:commandPath property.
                */
                get: function () {
                    return this._cmdParamPath;
                },
                set: function (value) {
                    this._cmdParamPath = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Menu.prototype, "isButton", {
                /**
                * Gets or sets a value that determines whether this @see:Menu should act
                * as a split button instead of a regular menu.
                *
                * The difference between regular menus and split buttons is what happens
                * when the user clicks the menu header.
                * In regular menus, clicking the header shows or hides the menu options.
                * In split buttons, clicking the header raises the @see:menuItemClicked event
                * and/or invokes the command associated with the last option selected by
                * the user as if the user had picked the item from the drop-down list.
                *
                * If you want to differentiate between clicks on menu items and the button
                * part of a split button, check the value of the @see:isDroppedDown property
                * of the event sender. If that is true, then a menu item was clicked; if it
                * is false, then the button was clicked.
                *
                * For example, the code below implements a split button that uses the drop-down
                * list only to change the default item/command, and triggers actions only when
                * the button is clicked:
                *
                * <pre>&lt;-- view --&gt;
                * &lt;wj-menu is-button="true" header="Run" value="browser"
                *   item-clicked="menuItemClicked(s, e)"&gt;
                *   &lt;wj-menu-item value="'Internet Explorer'"&gt;Internet Explorer&lt;/wj-menu-item&gt;
                *   &lt;wj-menu-item value="'Chrome'"&gt;Chrome&lt;/wj-menu-item&gt;
                *   &lt;wj-menu-item value="'FireFox'"&gt;FireFox&lt;/wj-menu-item&gt;
                *   &lt;wj-menu-item value="'Safari'"&gt;Safari&lt;/wj-menu-item&gt;
                *   &lt;wj-menu-item value="'Opera'"&gt;Opera&lt;/wj-menu-item&gt;
                * &lt;/wj-menu&gt;
                *
                * // controller
                * $scope.browser = 'Internet Explorer';
                * $scope.menuItemClicked = function (s, e) {
                *   // if not dropped down, click was on the button
                *   if (!s.isDroppedDown) {
                *     alert('running ' + $scope.browser);
                *   }
                *}</pre>
                */
                get: function () {
                    return this._isButton;
                },
                set: function (value) {
                    this._isButton = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Menu.prototype, "owner", {
                /**
                * Gets or sets the element that owns this @see:Menu.
                *
                * This variable is set by the wj-context-menu directive in case a single
                * menu is used as a context menu for several different elements.
                */
                get: function () {
                    return this._owner;
                },
                set: function (value) {
                    this._enableDisableItems(); // TFS 122978
                    this._owner = wijmo.asType(value, HTMLElement, true);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:itemClicked event.
            */
            Menu.prototype.onItemClicked = function (e) {
                this.itemClicked.raise(this, e);
            };

            // override onTextChanged to raise itemClicked and/or to invoke commands
            // if the change was made by the user
            Menu.prototype.onTextChanged = function (e) {
                _super.prototype.onTextChanged.call(this, e);
                if (!this._closing && this.isDroppedDown) {
                    this._raiseCommand(e);
                }
            };

            // override onIsDroppedDownChanged to clear the selection when showing the menu
            Menu.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    // suspend events
                    this._closing = true;

                    // save current item in case the user presses the split button
                    // while the drop-down is open (TFS 119513)
                    this._defaultItem = this.selectedItem;

                    // reset menu
                    this.required = false;
                    this.selectedIndex = -1;

                    // enable/disable items
                    this._enableDisableItems();

                    // restore events
                    this._closing = false;
                } else {
                    // closed the drop-down, make sure we have a selected item (TFS 122720)
                    if (!this.selectedItem) {
                        this.selectedItem = this._defaultItem;
                    }
                }
            };

            // ** implementation
            // raise itemClicked and/or invoke the current command
            Menu.prototype._raiseCommand = function (e) {
                // execute command if available
                var item = this.selectedItem, cmd = this._getCommand(item);
                if (cmd) {
                    var parm = this._cmdParamPath ? item[this._cmdParamPath] : null;
                    if (!this._canExecuteCommand(cmd, parm)) {
                        return;
                    }
                    this._executeCommand(cmd, parm);
                }

                // raise itemClicked
                this.onItemClicked(e);
            };

            // gets the command to be executed when an item is clicked
            Menu.prototype._getCommand = function (item) {
                var cmd = item && this.commandPath ? item[this.commandPath] : null;
                return cmd ? cmd : this.command;
            };

            // execute a command
            // cmd may be an object that implements the ICommand interface or it may be just a function
            // parm is an optional parameter passed to the command.
            Menu.prototype._executeCommand = function (cmd, parm) {
                if (cmd && !wijmo.isFunction(cmd)) {
                    cmd = cmd['executeCommand'];
                }
                if (wijmo.isFunction(cmd)) {
                    cmd(parm);
                }
            };

            // checks whether a command can be executed
            Menu.prototype._canExecuteCommand = function (cmd, parm) {
                if (cmd) {
                    var x = cmd['canExecuteCommand'];
                    if (wijmo.isFunction(x)) {
                        return x(parm);
                    }
                }
                return true;
            };

            // enable/disable the menu options
            Menu.prototype._enableDisableItems = function () {
                if (this.collectionView && (this.command || this.commandPath)) {
                    var items = this.collectionView.items;
                    for (var i = 0; i < items.length; i++) {
                        var cmd = this._getCommand(items[i]), parm = this.commandParameterPath ? items[i][this.commandParameterPath] : null;
                        if (cmd) {
                            var el = this._lbx.hostElement.children[i];
                            wijmo.toggleClass(el, 'wj-state-disabled', !this._canExecuteCommand(cmd, parm));
                        }
                    }
                }
            };
            return Menu;
        })(input.ComboBox);
        input.Menu = Menu;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Menu.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// initialize header format
wijmo.culture.MultiSelect = {
    itemsSelected: '{count:n0} items selected'
};

var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:MultiSelect control allows users to select multiple items from
        * drop-down lists that contain custom objects or simple strings.
        *
        * The @see:MultiSelect control extends @see:ComboBox, with all the usual
        * properties, including @see:itemsSource and @see:displayMemberPath.
        *
        * Like the @see:ListBox control, it has a @see:checkedMemberPath property
        * that defines the name of the property that determines whether an item is
        * checked or not.
        *
        * The items currently checked (selected) can be obtained using the
        * @see:checkedItems property.</p>
        *
        * The control header is fully customizable. By default, it shows up to two items
        * selected and the item count after that. You can change the maximum number of
        * items to display (@see:maxHeaderItems), the message shown when no items are selected
        * (@see:placeholder), and the format string used to show the item count (@see:headerFormat).
        * Or you can provide a function to generate the header content based on whatever criteria
        * your application requires (@see:headerFormatter).
        */
        var MultiSelect = (function (_super) {
            __extends(MultiSelect, _super);
            /**
            * Initializes a new instance of a @see:MultiSelect control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function MultiSelect(element, options) {
                _super.call(this, element);
                this._maxHdrItems = 2;
                this._hdrFmt = wijmo.culture.MultiSelect.itemsSelected;
                /**
                * Occurs when the value of the @see:checkedItems property changes.
                */
                this.checkedItemsChanged = new wijmo.Event();

                // make header element read-only
                this.inputElement.setAttribute('readonly', '');

                // toggle drop-down when clicking on the header
                var self = this;
                this.addEventListener(this.inputElement, 'click', function () {
                    self.isDroppedDown = !self.isDroppedDown;
                });

                // make listbox a multi-select
                this.checkedMemberPath = null;

                // do NOT close the drop-down when the user clicks to select an item
                this.removeEventListener(this.dropDown, 'click');

                // update header now, when the itemsSource changes, and when items are selected
                var self = this;
                self._updateHeader();
                self.listBox.itemsChanged.addHandler(function () {
                    self._updateHeader();
                });
                self.listBox.checkedItemsChanged.addHandler(function () {
                    self._updateHeader();
                    self.onCheckedItemsChanged();
                });

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(MultiSelect.prototype, "checkedMemberPath", {
                //** object model
                /**
                * Gets or sets the name of the property used to control the checkboxes
                * placed next to each item.
                */
                get: function () {
                    var p = this.listBox.checkedMemberPath;
                    return p != MultiSelect._DEF_CHECKED_PATH ? p : null;
                },
                set: function (value) {
                    value = wijmo.asString(value);
                    this.listBox.checkedMemberPath = value ? value : MultiSelect._DEF_CHECKED_PATH;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MultiSelect.prototype, "maxHeaderItems", {
                /**
                * Gets or sets the maximum number of items to display on the control header.
                *
                * If no items are selected, the header displays the text specified by the
                * @see:placeholder property.
                *
                * If the number of selected items is smaller than or equal to the value of the
                * @see:maxHeaderItems property, the selected items are shown in the header.
                *
                * If the number of selected items is greater than @see:maxHeaderItems, the
                * header displays the selected item count instead.
                */
                get: function () {
                    return this._maxHdrItems;
                },
                set: function (value) {
                    if (this._maxHdrItems != value) {
                        this._maxHdrItems = wijmo.asNumber(value);
                        this._updateHeader();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MultiSelect.prototype, "headerFormat", {
                /**
                * Gets or sets the format string used to create the header content
                * when the control has more than @see:maxHeaderItems items checked.
                *
                * The format string may contain the '{count}' replacement string
                * which gets replaced with the number of items currently checked.
                * The default value for this property in the English culture is
                * '{count:n0} items selected'.
                */
                get: function () {
                    return this._hdrFmt;
                },
                set: function (value) {
                    if (value != this._hdrFmt) {
                        this._hdrFmt = wijmo.asString(value);
                        this._updateHeader();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MultiSelect.prototype, "headerFormatter", {
                /**
                * Gets or sets a function that gets the HTML in the control header.
                *
                * By default, the control header content is determined based on the
                * @see:placeholder, @see:maxHeaderItems, and on the current selection.
                *
                * You may customize the header content by specifying a function that
                * returns a custom string based on whatever criteria your application
                * requires.
                */
                get: function () {
                    return this._hdrFormatter;
                },
                set: function (value) {
                    if (value != this._hdrFormatter) {
                        this._hdrFormatter = wijmo.asFunction(value);
                        this._updateHeader();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MultiSelect.prototype, "checkedItems", {
                /**
                * Gets or sets an array containing the items that are currently checked.
                */
                get: function () {
                    return this.listBox.checkedItems;
                },
                set: function (value) {
                    this.listBox.checkedItems = value;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:checkedItemsChanged event.
            */
            MultiSelect.prototype.onCheckedItemsChanged = function (e) {
                this.checkedItemsChanged.raise(this, e);
            };

            //** implementation
            // update header when refreshing
            MultiSelect.prototype.refresh = function (fullUpdate) {
                if (typeof fullUpdate === "undefined") { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                this._updateHeader();
            };

            // textbox is read-only!
            MultiSelect.prototype._setText = function (text, fullMatch) {
                // keep existing text
            };

            // give focus to list when dropping down
            MultiSelect.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    this.dropDown.focus();
                }
            };

            // toggle checkbox when spacebar is pressed
            MultiSelect.prototype._keydown = function (e) {
                _super.prototype._keydown.call(this, e);
                if (!e.defaultPrevented && e.keyCode == 32 /* Space */) {
                    if (this.isDroppedDown) {
                        var idx = this.selectedIndex;
                        if (idx > -1) {
                            this._lbx.toggleItemChecked(idx);
                        }
                    }
                    e.preventDefault();
                }
            };

            // update the value of the control header
            MultiSelect.prototype._updateHeader = function () {
                if (this._hdrFormatter) {
                    this.inputElement.value = this._hdrFormatter();
                } else {
                    // get selected items
                    var items = this.checkedItems;

                    // build header
                    var hdr = '';
                    if (items.length > 0) {
                        if (items.length <= this._maxHdrItems) {
                            if (this.displayMemberPath) {
                                for (var i = 0; i < items.length; i++) {
                                    items[i] = items[i][this.displayMemberPath];
                                }
                            }
                            hdr = items.join(', ');
                        } else {
                            hdr = wijmo.format(this.headerFormat, {
                                count: items.length
                            });
                        }
                    }

                    // set header
                    this.inputElement.value = hdr;
                }
            };
            MultiSelect._DEF_CHECKED_PATH = '$checked';
            return MultiSelect;
        })(input.ComboBox);
        input.MultiSelect = MultiSelect;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=MultiSelect.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * Specifies actions that trigger showing and hiding @see:Popup controls.
        */
        (function (PopupTrigger) {
            /** No triggers; popups must be shown and hidden using code. */
            PopupTrigger[PopupTrigger["None"] = 0] = "None";

            /** Show or hide when the owner element is clicked. */
            PopupTrigger[PopupTrigger["Click"] = 1] = "Click";

            /** Hide the popup when it loses focus. */
            PopupTrigger[PopupTrigger["Blur"] = 2] = "Blur";
        })(input.PopupTrigger || (input.PopupTrigger = {}));
        var PopupTrigger = input.PopupTrigger;

        /**
        * Class that shows an element as a popup.
        *
        * Popups may be have @see:owner elements, in which case they behave
        * as rich tooltips that may be shown or hidden based on actions
        * specified by the @see:showTrigger and @see:hideTrigger properties.
        *
        * Popups with no owner elements behave like dialogs. They are centered
        * on the screen and are displayed using the @see:show method.
        *
        * To close a @see:Popup, call the @see:hide method. Alternatively,
        * any clickable elements within a @see:Popup that have the 'wj-hide'
        * class will hide the @see:Popup when clicked. For example, the
        * @see:Popup below will be hidden when the user presses the
        * OK or Cancel buttons:
        *
        * <pre>&lt;button id="btnPopup"&gt;Show Popup&lt;/button&gt;
        * &lt;wj-popup owner="#btnPopup" style="padding:12px"&gt;
        *   &lt;p&gt;Press one of the buttons below to hide the Popup.&lt;/p&gt;
        *   &lt;hr/&gt;
        *   &lt;button class="wj-hide" ng-click="handleOK()"&gt;OK&lt;/button&gt;
        *   &lt;button class="wj-hide"&gt;Cancel&lt;/button&gt;
        * &lt;/wj-popup&gt;</pre>
        */
        var Popup = (function (_super) {
            __extends(Popup, _super);
            /**
            * Initializes a new instance of a @see:Popup control.
            *
            * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options JavaScript object containing initialization data for the control.
            */
            function Popup(element, options) {
                // initialize
                _super.call(this, element, null, true);
                this._showTrigger = 1 /* Click */;
                this._hideTrigger = 2 /* Blur */;
                this._fadeIn = true;
                this._fadeOut = true;
                this._click = this._handleClick.bind(this);
                this._blur = this._handleBlur.bind(this);
                /**
                * Occurs before the @see:Popup is shown.
                */
                this.showing = new wijmo.Event();
                /**
                * Occurs after the @see:Popup has been shown.
                */
                this.shown = new wijmo.Event();
                /**
                * Occurs before the @see:Popup is hidden.
                */
                this.hiding = new wijmo.Event();
                /**
                * Occurs after the @see:Popup has been hidden.
                */
                this.hidden = new wijmo.Event();
                wijmo.addClass(this.hostElement, 'wj-control wj-content wj-popup');

                // start hidden
                wijmo.hidePopup(this.hostElement, false);

                // hide Popup when user presses Escape key
                var self = this;
                self.addEventListener(self.hostElement, 'keydown', function (e) {
                    if (!e.defaultPrevented && e.keyCode == 27 /* Escape */) {
                        self.hide();
                    }
                });

                // hide Popup when user clicks an element with the 'wj-hide' class
                self.addEventListener(self.hostElement, 'click', function (e) {
                    if (wijmo.hasClass(e.target, 'wj-hide')) {
                        self.hide();
                    }
                });

                // auto-hide modeless Popup when losing focus
                self.addEventListener(self.hostElement, 'blur', this._blur, true);

                // apply options after control is fully initialized
                self.initialize(options);
            }
            Object.defineProperty(Popup.prototype, "owner", {
                // ** object model
                /**
                * Gets or sets the element that owns this @see:Popup.
                *
                * If the @see:owner is null, the @see:Popup behaves like a dialog.
                * It is centered on the screen and must be shown using the
                * @see:show method.
                */
                get: function () {
                    return this._owner;
                },
                set: function (value) {
                    // disconnect previous owner
                    if (this._owner) {
                        this.removeEventListener(this._owner, 'click');
                        this.removeEventListener(this._owner, 'blur');
                    }

                    // set new owner
                    this._owner = value != null ? wijmo.getElement(value) : null;

                    // connect new owner
                    if (this._owner) {
                        this.addEventListener(this._owner, 'click', this._click, true);
                        this.addEventListener(this._owner, 'blur', this._blur, true);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Popup.prototype, "showTrigger", {
                /**
                * Gets or sets the actions that show the @see:Popup.
                *
                * By default, the @see:showTrigger property is set to @see:PopupTrigger.Click,
                * which causes the popup to appear when the user clicks the owner element.
                *
                * If you set the @see:showTrigger property to @see:PopupTrigger.None, the popup
                * will be shown only when the @see:show method is called.
                */
                get: function () {
                    return this._showTrigger;
                },
                set: function (value) {
                    this._showTrigger = wijmo.asEnum(value, PopupTrigger);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Popup.prototype, "hideTrigger", {
                /**
                * Gets or sets the actions that hide the @see:Popup.
                *
                * By default, the @see:hideTrigger property is set to @see:PopupTrigger.Blur,
                * which hides the popup when it loses focus.
                *
                * If you set the @see:hideTrigger property to @see:PopupTrigger.Click, the popup
                * will be hidden only when the owner element is clicked.
                *
                * If you set the @see:hideTrigger property to @see:PopupTrigger.None, the popup
                * will be hidden only when the @see:hide method is called.
                */
                get: function () {
                    return this._hideTrigger;
                },
                set: function (value) {
                    this._hideTrigger = wijmo.asEnum(value, PopupTrigger);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Popup.prototype, "fadeIn", {
                /**
                * Gets or sets a value that determines whether popups should be shown using a
                * fade-in animation.
                */
                get: function () {
                    return this._fadeIn;
                },
                set: function (value) {
                    this._fadeIn = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Popup.prototype, "fadeOut", {
                /**
                * Gets or sets a value that determines whether popups should be hidden using a
                * fade-out animation.
                */
                get: function () {
                    return this._fadeOut;
                },
                set: function (value) {
                    this._fadeOut = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Popup.prototype, "modal", {
                /**
                * Gets or sets a value that determines whether the @see:Popup should
                * be displayed as a modal dialog.
                *
                * Modal dialogs show a dark backdrop that makes the Popup stand out from
                * other content on the page.
                *
                * If you want to make a dialog truly modal, also set the @see:hideTrigger
                * property to @see:PopupTrigger.None, so users won't be able to click the
                * backdrop to dismiss the dialog. In this case, the dialog will close only
                * if the @see:close method is called or if the user presses the Escape key.
                */
                get: function () {
                    return this._modal;
                },
                set: function (value) {
                    this._modal = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Popup.prototype, "isVisible", {
                /**
                * Gets a value that determines whether the @see:Popup is currently visible.
                */
                get: function () {
                    return this.hostElement.style.display != 'none';
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Shows the @see:Popup.
            *
            * @param modal Whether to show the popup as a modal dialog. If provided, this
            * sets the value of the @see:modal property.
            */
            Popup.prototype.show = function (modal) {
                if (!this.isVisible) {
                    // raise event
                    var e = new wijmo.CancelEventArgs();
                    if (this.onShowing(e)) {
                        // honor modal parameter
                        if (modal != null) {
                            this.modal = wijmo.asBoolean(modal);
                        }

                        // show modal backdrop
                        if (this._modal) {
                            this._showBackdrop();
                        }

                        // show the popup using a rectangle as reference (to avoid copying styles)
                        var ref = this._owner ? this._owner.getBoundingClientRect() : null;
                        wijmo.showPopup(this.hostElement, ref, false, this._fadeIn);

                        // raise shown event
                        this.onShown(e);

                        // set the focus to the first input element on the popup
                        var self = this;
                        setTimeout(function () {
                            var inputs = self.hostElement.querySelectorAll('input');
                            for (var i = 0; i < inputs.length; i++) {
                                var el = inputs[i];
                                if (!el.disabled && el.tabIndex > -1) {
                                    try  {
                                        if (document.activeElement != el) {
                                            el.focus();
                                        }
                                        break;
                                    } catch (x) {
                                    }
                                }
                            }
                            if (!self.containsFocus()) {
                                self.hostElement.tabIndex = 0;
                                self.hostElement.focus();
                            }
                        }, 200);
                    }
                }
            };

            /**
            * Hides the @see:Popup.
            */
            Popup.prototype.hide = function () {
                if (this.isVisible) {
                    var e = new wijmo.CancelEventArgs();
                    if (this.onHiding(e)) {
                        if (this._modal) {
                            wijmo.hidePopup(this._bkdrop, true, this.fadeOut);
                        }
                        wijmo.hidePopup(this.hostElement, true, this.fadeOut);
                        this.onHidden(e);
                    }
                }
            };

            /**
            * Raises the @see:showing event.
            */
            Popup.prototype.onShowing = function (e) {
                this.showing.raise(this, e);
                return !e.cancel;
            };

            /**
            * Raises the @see:shown event.
            */
            Popup.prototype.onShown = function (e) {
                this.shown.raise(this, e);
            };

            /**
            * Raises the @see:hiding event.
            */
            Popup.prototype.onHiding = function (e) {
                this.hiding.raise(this, e);
                return !e.cancel;
            };

            /**
            * Raises the @see:hidden event.
            */
            Popup.prototype.onHidden = function (e) {
                this.hidden.raise(this, e);
            };

            // ** overrides
            // reposition Popup when refreshing
            Popup.prototype.refresh = function (fullUpdate) {
                if (typeof fullUpdate === "undefined") { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.isVisible) {
                    var ae = document.activeElement, ref = this._owner ? this._owner.getBoundingClientRect() : null;
                    wijmo.showPopup(this.hostElement, ref);
                    if (this._modal && ae instanceof HTMLElement && ae != document.activeElement) {
                        ae.focus();
                    }
                }
            };

            // reposition Popup when window size changes
            Popup.prototype._handleResize = function () {
                if (this.isVisible) {
                    this.refresh();
                }
            };

            // ** implementation
            // toggle Popup when user clicks the owner element
            Popup.prototype._handleClick = function (e) {
                if (this.isVisible && (this._hideTrigger & 1 /* Click */)) {
                    this.hide();
                } else if (!this.isVisible && (this._showTrigger & 1 /* Click */)) {
                    this.show();
                }
            };

            // hide popup when owner element and popup lose focus
            Popup.prototype._handleBlur = function (e) {
                if (this.isVisible && (this._hideTrigger & 2 /* Blur */)) {
                    var self = this;
                    setTimeout(function () {
                        if (!self.containsFocus()) {
                            self.hide();
                        }
                    }, 100);
                }
            };

            // show/hide modal popup backdrop
            Popup.prototype._showBackdrop = function () {
                if (!this._bkdrop) {
                    // create backdrop element
                    this._bkdrop = document.createElement('div');
                    this._bkdrop.tabIndex = -1;
                    wijmo.addClass(this._bkdrop, 'wj-popup-backdrop');

                    // make it consume the mouse when hideTrigger is None
                    var self = this;
                    this.addEventListener(this._bkdrop, 'mousedown', function (e) {
                        if (self.hideTrigger == 0) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                }
                this._bkdrop.style.display = '';
                document.body.appendChild(this._bkdrop);
            };
            return Popup;
        })(wijmo.Control);
        input.Popup = Popup;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Popup.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:InputDate control allows users to type in dates using any format
        * supported by the @see:Globalize class, or to pick dates from a drop-down box
        * that shows a @see:Calendar control.
        *
        * Use the @see:min and @see:max properties to restrict the range of
        * values that the user can enter.
        *
        * Use the @see:value property to gets or set the currently selected date.
        *
        * The example below shows a <b>Date</b> value (that includes date and time information)
        * using an @see:InputDate and an an @see:InputTime control. Notice how both controls
        * are bound to the same controller variable, and each edits the appropriate information
        * (either date or time). The example also shows a @see:Calendar control that you can
        * use to select the date with a single click.
        *
        * @fiddle:vgc3Y
        */
        var InputDate = (function (_super) {
            __extends(InputDate, _super);
            // private stuff
            /**
            * Initializes a new instance of a @see:InputDate control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function InputDate(element, options) {
                _super.call(this, element);
                // property storage
                this._value = new Date();
                this._format = 'd';
                this._required = true;
                /**
                * Occurs after a new date is selected.
                */
                this.valueChanged = new wijmo.Event();

                // initialize mask provider
                this._maskProvider = new wijmo._MaskProvider(this._tbx);

                // default to numeric keyboard (like NumberInput)
                this._tbx.type = 'tel';

                // track changes to text
                this.addEventListener(this._tbx, 'blur', this._commitText.bind(this));

                // use wheel to increase/decrease the date
                var self = this, evt = 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
                this.addEventListener(this.hostElement, evt, function (e) {
                    if (self.containsFocus() && !self.isDroppedDown && !e.defaultPrevented) {
                        if (self.value != null) {
                            var step = wijmo.clamp(e.wheelDelta || -e.detail, -1, +1);
                            self.value = wijmo.DateTime.addDays(self.value, step);
                            self.selectAll();
                            e.preventDefault();
                        }
                    }
                });

                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    this._copyOriginalAttributes(this._tbx);
                    var value = this._tbx.getAttribute('value');
                    if (value) {
                        this.value = wijmo.Globalize.parseDate(value, 'yyyy-MM-dd');
                    }
                }

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(InputDate.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets the HTML input element hosted by the control.
                *
                * Use this property in situations where you want to customize the
                * attributes of the input element.
                */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "inputType", {
                /**
                * Gets or sets the "type" attribute of the HTML input element hosted by the control.
                *
                * By default, this property is set to "tel", a value that causes mobile devices to
                * show a numeric keypad that includes a negative sign and a decimal separator.
                *
                * Use this property to change the default setting if the default does not work well
                * for the current culture, device, or application. In those cases, try changing
                * the value to "number" or "text."
                *
                * Note that input elements with type "number" prevent selection in Chrome and therefore
                * is not recommended. For more details, see this link:
                * http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "value", {
                /**
                * Gets or sets the current date.
                */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (wijmo.DateTime.equals(this._value, value)) {
                        this._tbx.value = wijmo.Globalize.format(value, this.format);
                    } else {
                        // check type
                        value = wijmo.asDate(value, !this.required || (value == null && this._value == null));

                        // honor ranges (but keep the time)
                        if (value) {
                            if (this.min) {
                                var min = wijmo.DateTime.fromDateTime(this.min, value);
                                if (value < min) {
                                    value = min;
                                }
                            }
                            if (this.max) {
                                var max = wijmo.DateTime.fromDateTime(this.max, value);
                                if (value > max) {
                                    value = max;
                                }
                            }
                        }

                        // update control
                        if (this._isValidDate(value)) {
                            this._tbx.value = value ? wijmo.Globalize.format(value, this.format) : '';
                            if (!wijmo.DateTime.sameDate(this._value, value)) {
                                this._value = value;
                                this.onValueChanged();
                            }
                        } else {
                            this._tbx.value = value ? wijmo.Globalize.format(this.value, this.format) : '';
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "text", {
                /**
                * Gets or sets the text shown on the control.
                */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value, true);
                        this._commitText();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "required", {
                /**
                * Gets or sets a value indicating whether the control value must be a Date or whether it
                * can be set to null (by deleting the content of the control).
                */
                get: function () {
                    return this._required;
                },
                set: function (value) {
                    this._required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "min", {
                /**
                * Gets or sets the earliest date that the user can enter.
                */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._min = wijmo.asDate(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "max", {
                /**
                * Gets or sets the latest date that the user can enter.
                */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._max = wijmo.asDate(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "format", {
                /**
                * Gets or sets the format used to display the selected date.
                *
                * The format string is expressed as a .NET-style
                * <a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx" target="_blank">
                * Date format string</a>.
                */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "mask", {
                /**
                * Gets or sets a mask to use while editing.
                *
                * The mask format is the same one that the @see:wijmo.input.InputMask
                * control uses.
                *
                * If specified, the mask must be compatible with the value of
                * the @see:format property. For example, the mask '99/99/9999' can
                * be used for entering dates formatted as 'MM/dd/yyyy'.
                */
                get: function () {
                    return this._maskProvider.mask;
                },
                set: function (value) {
                    this._maskProvider.mask = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "calendar", {
                /**
                * Gets a reference to the @see:Calendar control shown in the drop-down box.
                */
                get: function () {
                    return this._calendar;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "itemValidator", {
                /**
                * Gets or sets a validator function to determine whether dates are valid for selection.
                *
                * If specified, the validator function should take one parameter representing the
                * date to be tested, and should return false if the date is invalid and should not
                * be selectable.
                *
                * For example, the code below prevents users from selecting dates that fall on
                * weekends:
                * <pre>
                * inputDate.itemValidator = function(date) {
                *   var weekday = date.getDay();
                *   return weekday != 0 && weekday != 6;
                * }
                * </pre>
                */
                get: function () {
                    return this._calendar.itemValidator;
                },
                set: function (value) {
                    if (value != this.itemValidator) {
                        this._calendar.itemValidator = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputDate.prototype, "itemFormatter", {
                /**
                * Gets or sets a formatter function to customize dates in the drop-down calendar.
                *
                * The formatter function can add any content to any date. It allows
                * complete customization of the appearance and behavior of the calendar.
                *
                * If specified, the function takes two parameters:
                * <ul>
                *     <li>the date being formatted </li>
                *     <li>the HTML element that represents the date</li>
                * </ul>
                *
                * For example, the code below shows weekends with a yellow background:
                * <pre>
                * inputDate.itemFormatter = function(date, element) {
                *   var day = date.getDay();
                *   element.style.backgroundColor = day == 0 || day == 6 ? 'yellow' : '';
                * }
                * </pre>
                */
                get: function () {
                    return this.calendar.itemFormatter;
                },
                set: function (value) {
                    if (value != this.itemFormatter) {
                        this.calendar.itemFormatter = wijmo.asFunction(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:valueChanged event.
            */
            InputDate.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };

            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // update value display in case culture changed
            InputDate.prototype.refresh = function () {
                this.isDroppedDown = false;
                if (this._maskProvider) {
                    this._maskProvider.refresh();
                }
                if (this._calendar) {
                    this._calendar.refresh();
                }
                this._tbx.value = wijmo.Globalize.format(this.value, this.format);
            };

            // override to send focus to drop-down when dropping down
            InputDate.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    this.dropDown.focus();
                }
            };

            // create the drop-down element
            InputDate.prototype._createDropDown = function () {
                var self = this;

                // create the drop-down element
                this._calendar = new input.Calendar(this._dropDown);
                this._dropDown.tabIndex = -1;

                // update our value to match calendar's
                this._calendar.valueChanged.addHandler(function () {
                    self.value = wijmo.DateTime.fromDateTime(self._calendar.value, self.value);
                });

                // close the drop-down when the user changes the date with the mouse
                var dtDown = self.value;
                this.addEventListener(this._dropDown, 'mousedown', function () {
                    dtDown = self.value;
                });

                // the 'click' event may not be triggered on iOS Safari if focus change
                // happens during previous tap, so use 'mouseup' instead.
                //this.addEventListener(this._dropDown, 'click', function () {
                this.addEventListener(this._dropDown, 'mouseup', function () {
                    var value = self._calendar.value;
                    if (value && !wijmo.DateTime.sameDate(dtDown, value)) {
                        self.isDroppedDown = false;
                    }
                });
            };

            // update drop down content and position before showing it
            InputDate.prototype._updateDropDown = function () {
                // update selected date, range
                this._calendar.value = this.value;
                this._calendar.min = this.min;
                this._calendar.max = this.max;

                // update size
                var cs = getComputedStyle(this.hostElement);
                this._dropDown.style.minWidth = parseFloat(cs.fontSize) * 18 + 'px';
                this._calendar.refresh(); // update layout/size now

                // let base class update position
                _super.prototype._updateDropDown.call(this);
            };

            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // override to commit text on Enter and cancel on Escape
            InputDate.prototype._keydown = function (e) {
                switch (e.keyCode) {
                    case 13 /* Enter */:
                        this._commitText();
                        this.selectAll();
                        break;
                    case 27 /* Escape */:
                        this.text = wijmo.Globalize.format(this.value, this.format);
                        this.selectAll();
                        break;
                }
                _super.prototype._keydown.call(this, e);
            };

            // parse date, commit if successful or revert
            InputDate.prototype._commitText = function () {
                var txt = this._tbx.value;
                if (!txt && !this.required) {
                    this.value = null;
                } else {
                    var dt = wijmo.Globalize.parseDate(txt, this.format);
                    if (dt) {
                        this.value = wijmo.DateTime.fromDateTime(dt, this.value);
                    } else {
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                    }
                }
            };

            // merge date and time information from two Date objects into a new Date object
            InputDate.prototype._setDate = function (value, time) {
                return new Date(value.getFullYear(), value.getMonth(), value.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
            };

            // check whether a date should be selectable by the user
            InputDate.prototype._isValidDate = function (value) {
                return this.itemValidator && value ? this.itemValidator(value) : true;
            };
            return InputDate;
        })(input.DropDown);
        input.InputDate = InputDate;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputDate.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:InputTime control allows users to enter times using any format
        * supported by the @see:Globalize class, or to pick times from a drop-down
        * list.
        *
        * The @see:min, @see:max, and @see:step properties determine the values shown
        * in the list.
        *
        * The @see:value property gets or sets a Date object that represents the time
        * selected by the user.
        *
        * The example below shows a <b>Date</b> value (that includes date and time information)
        * using an @see:InputDate and an @see:InputTime control. Notice how both controls
        * are bound to the same controller variable, and each edits the appropriate information
        * (either date or time). The example also shows a @see:Calendar control that can be
        * used to select the date with a single click.
        *
        * @fiddle:vgc3Y
        */
        var InputTime = (function (_super) {
            __extends(InputTime, _super);
            // private stuff
            /**
            * Initializes a new instance of a @see:InputTime control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function InputTime(element, options) {
                _super.call(this, element);
                // property storage
                this._value = new Date();
                this._format = 't';
                /**
                * Occurs after a new time is selected.
                */
                this.valueChanged = new wijmo.Event();

                // initialize mask provider
                this._maskProvider = new wijmo._MaskProvider(this._tbx);

                // default to numeric keyboard (like NumberInput)
                this._tbx.type = 'tel';

                // commit text when losing focus
                // use blur+capture to emulate focusout (not supported in FireFox)
                var self = this;
                this.addEventListener(this.hostElement, 'blur', function () {
                    self._commitText();
                }, true);

                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    var value = this._tbx.getAttribute('value');
                    if (value) {
                        this.value = wijmo.Globalize.parseDate(value, 'HH:mm:ss');
                    }
                }

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(InputTime.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets the HTML input element hosted by the control.
                *
                * Use this property in situations where you want to customize the
                * attributes of the input element.
                */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "inputType", {
                /**
                * Gets or sets the "type" attribute of the HTML input element hosted by the control.
                *
                * By default, this property is set to "tel", a value that causes mobile devices to
                * show a numeric keypad that includes a negative sign and a decimal separator.
                *
                * Use this property to change the default setting if the default does not work well
                * for the current culture, device, or application. In those cases, try changing
                * the value to "number" or "text."
                *
                * Note that input elements with type "number" prevent selection in Chrome and therefore
                * is not recommended. For more details, see this link:
                * http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "value", {
                /**
                * Gets or sets the current input time.
                */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    // check type
                    value = wijmo.asDate(value, !this.required);

                    // honor ranges (but keep the dates)
                    if (value) {
                        if (this._min != null && this._getTime(value) < this._getTime(this._min)) {
                            value = wijmo.DateTime.fromDateTime(value, this._min);
                        }
                        if (this._max != null && this._getTime(value) > this._getTime(this._max)) {
                            value = wijmo.DateTime.fromDateTime(value, this._max);
                        }
                    }

                    // update control
                    if (!wijmo.DateTime.equals(value, this._value)) {
                        this._setText(value ? wijmo.Globalize.format(value, this.format) : '', true);
                        this._value = value;
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "text", {
                /**
                * Gets or sets the text shown in the control.
                */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value, true);
                        this._commitText();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "min", {
                /**
                * Gets or sets the earliest time that the user can enter.
                */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._min = wijmo.asDate(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "max", {
                /**
                * Gets or sets the latest time that the user can enter.
                */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._max = wijmo.asDate(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "step", {
                /**
                * Gets or sets the number of minutes between entries in the drop-down list.
                */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    this._step = wijmo.asNumber(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "format", {
                /**
                * Gets or sets the format used to display the selected time (see @see:Globalize).
                *
                * The format string is expressed as a .NET-style
                * <a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx" target="_blank">
                * time format string</a>.
                */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                        if (this.collectionView && this.collectionView.items.length) {
                            this._updateItems();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputTime.prototype, "mask", {
                /**
                * Gets or sets a mask to use while the user is editing.
                *
                * The mask format is the same used by the @see:wijmo.input.InputMask
                * control.
                *
                * If specified, the mask must be compatible with the value of
                * the @see:format property. For example, you can use the mask '99:99 >LL'
                * for entering short times (format 't').
                */
                get: function () {
                    return this._maskProvider.mask;
                },
                set: function (value) {
                    this._maskProvider.mask = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:valueChanged event.
            */
            InputTime.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };

            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // update value display in case culture changed
            InputTime.prototype.refresh = function () {
                this.isDroppedDown = false;
                this._maskProvider.refresh();
                this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                this._updateItems();
            };

            // commit changes when the user picks a value from the list
            InputTime.prototype.onSelectedIndexChanged = function (e) {
                if (this.selectedIndex > -1) {
                    this._commitText();
                }
                _super.prototype.onSelectedIndexChanged.call(this, e);
            };

            // update items in drop-down list
            InputTime.prototype._updateItems = function () {
                var min = new Date(0, 0, 0, 0, 0), max = new Date(0, 0, 0, 23, 59, 59), step = wijmo.isNumber(this.step) ? this.step : 30, items = [];
                if (this.min) {
                    min.setHours(this.min.getHours(), this.min.getMinutes(), this.min.getSeconds());
                }
                if (this.max) {
                    max.setHours(this.max.getHours(), this.max.getMinutes(), this.max.getSeconds());
                }
                if (step > 0) {
                    for (var dt = min; dt <= max; dt = wijmo.DateTime.addMinutes(dt, step)) {
                        items.push(wijmo.Globalize.format(dt, this.format));
                    }
                }

                // update item source
                var text = this.text;
                this.itemsSource = items;
                this.text = text;
            };

            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // override to commit text on Enter and cancel on Escape
            InputTime.prototype._keydown = function (e) {
                _super.prototype._keydown.call(this, e);
                switch (e.keyCode) {
                    case 13 /* Enter */:
                        if (!this.isDroppedDown) {
                            this._commitText();
                            this.selectAll();
                        }
                        break;
                    case 27 /* Escape */:
                        this.text = wijmo.Globalize.format(this.value, this.format);
                        this.selectAll();
                        break;
                }
            };

            // parse date, commit if successful or revert
            InputTime.prototype._commitText = function () {
                if (!this.text && !this.required) {
                    this.value = null;
                } else {
                    var dt = wijmo.Globalize.parseDate(this.text, this.format);
                    if (dt) {
                        this.value = wijmo.DateTime.fromDateTime(this.value, dt);
                    } else {
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                    }
                }
            };

            // gets the time of day in seconds
            InputTime.prototype._getTime = function (value) {
                return value.getHours() * 3600 + value.getMinutes() * 60 + value.getSeconds();
            };
            return InputTime;
        })(input.ComboBox);
        input.InputTime = InputTime;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputTime.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:InputNumber control allows users to enter numbers.
        *
        * The control prevents users from accidentally entering invalid data and
        * formats the number as it is edited.
        *
        * Pressing the minus key reverses the sign of the value being edited,
        * regardless of cursor position.
        *
        * You may use the @see:min and @see:max properties to limit the range of
        * acceptable values, and the @see:step property to provide spinner buttons
        * that increase or decrease the value with a click.
        *
        * Use the @see:value property to get or set the currently selected number.
        *
        * The example below creates several @see:InputNumber controls and shows
        * the effect of using different formats, ranges, and step values.
        *
        * @fiddle:Cf9L9
        */
        var InputNumber = (function (_super) {
            __extends(InputNumber, _super);
            /**
            * Initializes a new instance of an @see:InputNumber control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function InputNumber(element, options) {
                _super.call(this, element);
                this._showBtn = true;
                this._required = true;
                this._decChar = '.';
                this._ehSelectAll = this.selectAll.bind(this);
                /**
                * Occurs when the value of the @see:text property changes.
                */
                this.textChanged = new wijmo.Event();
                /**
                * Occurs when the value of the @see:value property changes.
                */
                this.valueChanged = new wijmo.Event();

                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-inputnumber wj-content', tpl, {
                    _tbx: 'input',
                    _btnUp: 'btn-inc',
                    _btnDn: 'btn-dec'
                }, 'input');

                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    this._copyOriginalAttributes(this._tbx);
                    var value = this._tbx.getAttribute('value');
                    if (value) {
                        this.value = wijmo.Globalize.parseFloat(value);
                    }
                }

                // get localized decimal symbol
                this._decChar = wijmo.Globalize.getNumberDecimalSeparator();

                // update button display
                this._updateBtn();

                // hook up events
                var self = this;

                // handle IME
                this.addEventListener(this._tbx, 'compositionstart', function () {
                    self._composing = true;
                });
                this.addEventListener(this._tbx, 'compositionend', function () {
                    self._composing = false;
                    self._setText(self.text);
                });

                // textbox events
                var tb = self._tbx;
                this.addEventListener(tb, 'keypress', this._keypress.bind(this));
                this.addEventListener(tb, 'keydown', this._keydown.bind(this));
                this.addEventListener(tb, 'input', this._input.bind(this));
                this.addEventListener(tb, 'focus', function () {
                    setTimeout(self._ehSelectAll);
                });

                // inc/dec buttons: change value
                // if this was a tap, keep focus on button; OW transfer to textbox
                this.addEventListener(this._btnUp, 'click', function (e) {
                    if (self.value != null) {
                        self.value += self.step;
                        if (!self.isTouching) {
                            setTimeout(self._ehSelectAll);
                        }
                    }
                });
                this.addEventListener(this._btnDn, 'click', function (e) {
                    if (self.value != null) {
                        self.value -= self.step;
                        if (!self.isTouching) {
                            setTimeout(self._ehSelectAll);
                        }
                    }
                });

                // use wheel to increase/decrease the value
                var evt = 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
                this.addEventListener(this.hostElement, evt, function (e) {
                    if (self.containsFocus() && !e.defaultPrevented) {
                        if (self.value != null) {
                            var step = wijmo.clamp(e.wheelDelta || -e.detail, -1, +1);
                            self.value += (self.step || 1) * step;
                            setTimeout(self._ehSelectAll);
                            e.preventDefault();
                        }
                    }
                });

                // give focus to textbox unless touching
                this.addEventListener(this.hostElement, 'focus', function () {
                    if (!self.isTouching) {
                        tb.focus();
                    }
                });

                // use blur+capture to emulate focusout (not supported in FireFox)
                this.addEventListener(this.hostElement, 'blur', function () {
                    var text = wijmo.Globalize.format(self.value, self.format);
                    self._setText(text);
                }, true);

                // initialize value
                this.value = 0;

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(InputNumber.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets the HTML input element hosted by the control.
                *
                * Use this property in situations where you want to customize the
                * attributes of the input element.
                */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "inputType", {
                /**
                * Gets or sets the "type" attribute of the HTML input element hosted by the control.
                *
                * By default, this property is set to "tel", a value that causes mobile devices to
                * show a numeric keypad that includes a negative sign and a decimal separator.
                *
                * Use this property to change the default setting if the default does not work well
                * for the current culture, device, or application. In those cases, try changing
                * the value to "number" or "text."
                *
                * Note that input elements with type "number" prevent selection in Chrome and therefore
                * is not recommended. For more details, see this link:
                * http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "value", {
                /**
                * Gets or sets the current value of the control.
                */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this._value) {
                        value = wijmo.asNumber(value, !this.required || (value == null && this._value == null));
                        if (value == null) {
                            this._setText('');
                        } else if (!isNaN(value)) {
                            value = this._clamp(value);
                            var text = wijmo.Globalize.format(value, this.format);
                            this._setText(text);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "required", {
                /**
                * Gets or sets a value indicating whether the control value must be a number or whether it
                * can be set to null (by deleting the content of the control).
                */
                get: function () {
                    return this._required;
                },
                set: function (value) {
                    this._required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "min", {
                /**
                * Gets or sets the smallest number that the user can enter.
                */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._min = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "max", {
                /**
                * Gets or sets the largest number that the user can enter.
                */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._max = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "step", {
                /**
                * Gets or sets the amount to add or subtract to the @see:value property
                * when the user clicks the spinner buttons.
                */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    this._step = wijmo.asNumber(value, true);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "format", {
                /**
                * Gets or sets the format used to display the number being edited (see @see:Globalize).
                *
                * The format string is expressed as a .NET-style
                * <a href="http://msdn.microsoft.com/en-us/library/dwhawy9k(v=vs.110).aspx" target="_blank">
                * standard numeric format string</a>.
                */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "text", {
                /**
                * Gets or sets the text shown in the control.
                */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "placeholder", {
                /**
                * Gets or sets the string shown as a hint when the control is empty.
                */
                get: function () {
                    return this._tbx.placeholder;
                },
                set: function (value) {
                    this._tbx.placeholder = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputNumber.prototype, "showSpinner", {
                /**
                * Gets or sets a value indicating whether the control displays spinner buttons to increment
                * or decrement the value (the step property must be set to a non-zero value).
                */
                get: function () {
                    return this._showBtn;
                },
                set: function (value) {
                    this._showBtn = wijmo.asBoolean(value);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Sets the focus to the control and selects all its content.
            */
            InputNumber.prototype.selectAll = function () {
                var rng = this._getInputRange();
                wijmo.setSelectionRange(this._tbx, rng[0], rng[1]);
            };

            /**
            * Raises the @see:textChanged event.
            */
            InputNumber.prototype.onTextChanged = function (e) {
                this.textChanged.raise(this, e);
            };

            /**
            * Raises the @see:valueChanged event.
            */
            InputNumber.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };

            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            InputNumber.prototype.refresh = function (fullUpdate) {
                this._decChar = wijmo.Globalize.getNumberDecimalSeparator();
                this._setText(wijmo.Globalize.format(this.value, this.format));
            };

            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // make sure a value is > min and < max
            InputNumber.prototype._clamp = function (value) {
                return wijmo.clamp(value, this.min, this.max);
            };

            // checks whether a character is a digit, sign, or decimal point
            InputNumber.prototype._isNumeric = function (chr, digitsOnly) {
                if (typeof digitsOnly === "undefined") { digitsOnly = false; }
                var isNum = (chr == this._decChar) || (chr >= '0' && chr <= '9');
                if (!isNum && !digitsOnly) {
                    isNum = '+-()'.indexOf(chr) > -1;
                }
                return isNum;
            };

            // get the range of numeric characters within the current text
            InputNumber.prototype._getInputRange = function (digitsOnly) {
                if (typeof digitsOnly === "undefined") { digitsOnly = false; }
                var rng = [0, 0], text = this.text, hasStart = false;
                for (var i = 0; i < text.length; i++) {
                    if (this._isNumeric(text[i], digitsOnly)) {
                        if (!hasStart) {
                            rng[0] = i;
                            hasStart = true;
                        }
                        rng[1] = i + 1;
                    }
                }
                return rng;
            };

            // move the cursor to the left of the first digit
            InputNumber.prototype._moveToDigit = function () {
                var rng = this._getInputRange(true);
                wijmo.setSelectionRange(this._tbx, rng[0], rng[1]);
            };

            // update button visibility
            InputNumber.prototype._updateBtn = function () {
                if (this._showBtn && this._step) {
                    // show buttons and add class
                    this._btnUp.style.display = this._btnDn.style.display = '';
                    wijmo.addClass(this.hostElement, 'wj-input-show-spinner');
                } else {
                    // hide buttons and remove class
                    this._btnUp.style.display = this._btnDn.style.display = 'none';
                    wijmo.removeClass(this.hostElement, 'wj-input-show-spinner');
                }
            };

            // update text in textbox
            InputNumber.prototype._setText = function (text) {
                // not while composing IME text...
                if (this._composing)
                    return;

                // handle nulls
                if (!text) {
                    // if not required, allow setting to null
                    if (!this._required) {
                        this._tbx.value = '';
                        if (this._value != null) {
                            this._value = null;
                            this.onValueChanged();
                        }
                        if (this._oldText) {
                            this._oldText = text;
                            this.onTextChanged();
                        }
                        return;
                    }

                    // required, change text to zero
                    text = '0';
                }

                // let user start typing negative numbers
                if (text == '-' || text == ')') {
                    this._tbx.value = text;
                    wijmo.setSelectionRange(this._tbx, 1);
                    return;
                }

                // handle case when user deletes the opening parenthesis...
                if (text.length > 1 && text[text.length - 1] == ')' && text[0] != '(') {
                    text = text.substr(0, text.length - 1);
                }

                // parse input
                var value = wijmo.Globalize.parseFloat(text, this.format);
                if (isNaN(value)) {
                    this._tbx.value = this._oldText;
                    return;
                }

                // handle percentages
                if (this._oldText && this._oldText.indexOf('%') > -1 && text.indexOf('%') < 0) {
                    value /= 100;
                }

                // update text with formatted value
                text = wijmo.Globalize.format(value, this.format);
                if (text != this._tbx.value) {
                    this._tbx.value = text;
                }

                // update value, raise valueChanged
                value = this._clamp(value);
                if (value != this._value) {
                    this._value = value;
                    this.onValueChanged();
                }

                // raise textChanged
                if (text != this._oldText) {
                    this._oldText = text;
                    this.onTextChanged();
                }
            };

            // handle the keypress events
            InputNumber.prototype._keypress = function (e) {
                // not while composing IME text...
                if (this._composing)
                    return;

                if (e.charCode) {
                    // prevent invalid chars/validate cursor position (TFS 80733)
                    var chr = String.fromCharCode(e.charCode);
                    if (!this._isNumeric(chr)) {
                        e.preventDefault();
                    } else {
                        var rng = this._getInputRange(true);
                        if (this._tbx.selectionStart < rng[0]) {
                            wijmo.setSelectionRange(this._tbx, rng[0], rng[1]);
                        }
                    }

                    // handle minus sign
                    if (chr == '-') {
                        if (this.value != 0) {
                            this.value *= -1;
                            this._moveToDigit();
                        } else {
                            this._setText('-');
                        }
                        e.preventDefault();
                    }

                    // handle plus sign
                    if (chr == '+') {
                        this.value = Math.abs(this.value);
                        this._moveToDigit();
                        e.preventDefault();
                    }

                    // prevent extra decimals
                    if (chr == this._decChar) {
                        var pos = this._tbx.value.indexOf(chr);
                        if (pos > -1) {
                            if (this._getSelStart() <= pos) {
                                pos++;
                            }
                            wijmo.setSelectionRange(this._tbx, pos);
                            e.preventDefault();
                        }
                    }
                }
            };

            // handle the keydown event
            InputNumber.prototype._keydown = function (e) {
                // not while composing IME text...
                if (this._composing)
                    return;

                switch (e.keyCode) {
                    case 38 /* Up */:
                    case 40 /* Down */:
                        if (this.step) {
                            this.value = this._clamp(this.value + this.step * (e.keyCode == 38 /* Up */ ? +1 : -1));
                            setTimeout(this.selectAll.bind(this));
                            e.preventDefault();
                        }
                        break;

                    case 8 /* Back */:
                        if (this._getSelStart() == this._tbx.selectionEnd) {
                            var sel = this._getSelStart();
                            if (sel > 0 && this.text[sel - 1] == this._decChar) {
                                wijmo.setSelectionRange(this._tbx, sel - 1);
                                e.preventDefault();
                            }
                        }
                        break;

                    case 46 /* Delete */:
                        if (this._getSelStart() == this._tbx.selectionEnd) {
                            var sel = this._getSelStart();
                            if (sel > 0 && this.text[sel] == this._decChar) {
                                wijmo.setSelectionRange(this._tbx, sel + 1);
                                e.preventDefault();
                            }
                        }
                        break;
                }
            };

            // handle user input
            InputNumber.prototype._input = function (e) {
                // not while composing IME text...
                if (this._composing)
                    return;

                // remember cursor position
                var tbx = this._tbx, text = tbx.value, sel = this._getSelStart(), dec = text.indexOf(this._decChar);

                // set the text
                this._setText(text);

                // update cursor position
                if (text) {
                    // keep cursor position from the right
                    if (dec < 0 || sel <= dec) {
                        sel += tbx.value.length - text.length;
                    }

                    // handle cases when user deletes everything
                    if (this._oldText && this._oldText.indexOf(this._decChar) > -1 && tbx.value.indexOf(this._decChar) > -1 && dec < 0) {
                        sel = tbx.value.indexOf(this._decChar);
                    }

                    // make sure it's within the valid range
                    var rng = this._getInputRange();
                    if (sel < rng[0])
                        sel = rng[0];
                    if (sel > rng[1])
                        sel = rng[1];

                    // set cursor position
                    wijmo.setSelectionRange(tbx, sel);
                }
            };

            // get selection start
            InputNumber.prototype._getSelStart = function () {
                return this._tbx && this._tbx.value ? this._tbx.selectionStart : 0;
            };
            InputNumber.controlTemplate = '<div class="wj-input">' + '<div class="wj-input-group">' + '<span wj-part="btn-dec" class="wj-input-group-btn" tabindex="-1">' + '<button class="wj-btn wj-btn-default" type="button" tabindex="-1">-</button>' + '</span>' + '<input type="tel" wj-part="input" class="wj-form-control wj-numeric"/>' + '<span wj-part="btn-inc" class="wj-input-group-btn" tabindex="-1">' + '<button class="wj-btn wj-btn-default" type="button" tabindex="-1">+</button>' + '</span>' + '</div>';
            return InputNumber;
        })(wijmo.Control);
        input.InputNumber = InputNumber;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputNumber.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:InputMask control provides a way to govern what a user is allowed to input.
        *
        * The control prevents users from accidentally entering invalid data and
        * saves time by skipping over literals (such as slashes in dates) as the user types.
        *
        * The mask used to validate the input is defined by the @see:mask property,
        * which may contain one or more of the following special characters:
        *
        *  <dl class="dl-horizontal">
        *      <dt>0</dt>      <dd>Digit.</dd>
        *      <dt>9</dt>      <dd>Digit or space.</dd>
        *      <dt>#</dt>      <dd>Digit, sign, or space.</dd>
        *      <dt>L</dt>      <dd>Letter.</dd>
        *      <dt>l</dt>      <dd>Letter or space.</dd>
        *      <dt>A</dt>      <dd>Alphanumeric.</dd>
        *      <dt>a</dt>      <dd>Alphanumeric or space.</dd>
        *      <dt>.</dt>      <dd>Localized decimal point.</dd>
        *      <dt>,</dt>      <dd>Localized thousand separator.</dd>
        *      <dt>:</dt>      <dd>Localized time separator.</dd>
        *      <dt>/</dt>      <dd>Localized date separator.</dd>
        *      <dt>$</dt>      <dd>Localized currency symbol.</dd>
        *      <dt>&lt;</dt>   <dd>Converts characters that follow to lowercase.</dd>
        *      <dt>&gt;</dt>   <dd>Converts characters that follow to uppercase.</dd>
        *      <dt>|</dt>      <dd>Disables case conversion.</dd>
        *      <dt>\</dt>      <dd>Escapes any character, turning it into a literal.</dd>
        *      <dt>All others</dt><dd>Literals.</dd>
        *  </dl>
        */
        var InputMask = (function (_super) {
            __extends(InputMask, _super);
            /**
            * Initializes a new instance of an @see:InputMask control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function InputMask(element, options) {
                _super.call(this, element);
                /**
                * Occurs when the value of the @see:value property changes.
                */
                this.valueChanged = new wijmo.Event();

                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-inputmask wj-content', tpl, {
                    _tbx: 'input'
                }, 'input');

                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    // copy original attributes to new <input> element
                    this._copyOriginalAttributes(this._tbx);

                    // initialize value from attribute
                    var value = this._tbx.getAttribute('value');
                    if (value) {
                        this.value = value;
                    }
                }

                // create mask provider
                this._maskProvider = new wijmo._MaskProvider(this._tbx);

                // initialize control options
                this.initialize(options);

                // select all content when getting the focus
                var self = this;
                this.addEventListener(this._tbx, 'focus', function () {
                    setTimeout(function () {
                        self.selectAll();
                    });
                });
                this.addEventListener(this._tbx, 'input', function () {
                    setTimeout(function () {
                        self.onValueChanged();
                    });
                });
            }
            Object.defineProperty(InputMask.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets the HTML input element hosted by the control.
                *
                * Use this property in situations where you want to customize the
                * attributes of the input element.
                */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputMask.prototype, "value", {
                /**
                * Gets or sets the text currently shown in the control.
                */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.value) {
                        this._tbx.value = wijmo.asString(value);
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputMask.prototype, "rawValue", {
                /**
                * Gets or sets the raw value of the control (excluding mask literals).
                *
                * The raw value of the control excludes prompt and literal characters.
                * For example, if the @see:mask property is set to "AA-9999" and the
                * user enters the value "AB-1234", the @see:rawText property will return
                * "AB1234", excluding the hyphen that is part of the mask.
                */
                get: function () {
                    return this._maskProvider.getRawValue();
                },
                set: function (value) {
                    this.value = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputMask.prototype, "mask", {
                /**
                * Gets or sets the mask used to validate the input as the user types.
                *
                * The mask is defined as a string with one or more of the masking
                * characters listed in the @see:InputMask topic.
                */
                get: function () {
                    return this._maskProvider.mask;
                },
                set: function (value) {
                    var oldValue = this.value;
                    this._maskProvider.mask = wijmo.asString(value);
                    if (this.value != oldValue) {
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputMask.prototype, "promptChar", {
                /**
                * Gets or sets the symbol used to show input positions in the control.
                */
                get: function () {
                    return this._maskProvider.promptChar;
                },
                set: function (value) {
                    var oldValue = this.value;
                    this._maskProvider.promptChar = value;
                    if (this.value != oldValue) {
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputMask.prototype, "placeholder", {
                /**
                * Gets or sets the string shown as a hint when the control is empty.
                */
                get: function () {
                    return this._tbx.placeholder;
                },
                set: function (value) {
                    this._tbx.placeholder = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputMask.prototype, "maskFull", {
                /**
                * Gets a value that indicates whether the mask has been completely filled.
                */
                get: function () {
                    return this._maskProvider.maskFull;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Sets the focus to the control and selects all its content.
            */
            InputMask.prototype.selectAll = function () {
                var rng = this._maskProvider.getMaskRange();
                wijmo.setSelectionRange(this._tbx, rng[0], rng[1] + 1);
            };

            /**
            * Raises the @see:valueChanged event.
            */
            InputMask.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };

            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            InputMask.prototype.refresh = function (fullUpdate) {
                this._maskProvider.refresh();
            };
            InputMask.controlTemplate = '<div class="wj-input">' + '<div class="wj-input-group">' + '<input wj-part="input" class="wj-form-control"/>' + '</div>';
            return InputMask;
        })(wijmo.Control);
        input.InputMask = InputMask;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputMask.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (input) {
        'use strict';

        /**
        * The @see:InputColor control allows users to select colors by typing in
        * HTML-supported color strings, or to pick colors from a drop-down
        * that shows a @see:ColorPicker control.
        *
        * Use the @see:value property to get or set the currently selected color.
        *
        * @fiddle:84xvsz90
        */
        var InputColor = (function (_super) {
            __extends(InputColor, _super);
            /**
            * Initializes a new instance of an @see:InputColor control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options The JavaScript object containing initialization data for the control.
            */
            function InputColor(element, options) {
                _super.call(this, element);
                this._required = true;
                /**
                * Occurs after a new color is selected.
                */
                this.valueChanged = new wijmo.Event();

                // create preview element
                this._tbx.style.paddingLeft = '24px';
                this._ePreview = wijmo.createElement('<div class="wj-inputcolorbox" style="position:absolute;left:6px;top:6px;width:12px;bottom:6px;border:1px solid black"></div>');
                this.hostElement.style.position = 'relative';
                this.hostElement.appendChild(this._ePreview);

                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    this._tbx.type = '';
                    this._commitText();
                }

                // initialize value to white
                this.value = '#ffffff';

                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(InputColor.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                * Gets or sets the current color.
                */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this.value) {
                        if (value || !this.required) {
                            this.text = wijmo.asString(value);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputColor.prototype, "text", {
                /**
                * Gets or sets the text shown on the control.
                */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(wijmo.asString(value), true);
                        this._commitText();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputColor.prototype, "required", {
                /**
                * Gets or sets a value indicating whether the control value must be a color or whether it
                * can be set to null (by deleting the content of the control).
                */
                get: function () {
                    return this._required;
                },
                set: function (value) {
                    this._required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputColor.prototype, "showAlphaChannel", {
                /**
                * Gets or sets a value indicating whether the @see:ColorPicker allows users
                * to edit the color's alpha channel (transparency).
                */
                get: function () {
                    return this._colorPicker.showAlphaChannel;
                },
                set: function (value) {
                    this._colorPicker.showAlphaChannel = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(InputColor.prototype, "colorPicker", {
                /**
                * Gets a reference to the @see:ColorPicker control shown in the drop-down.
                */
                get: function () {
                    return this._colorPicker;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:valueChanged event.
            */
            InputColor.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };

            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // create the drop-down element
            InputColor.prototype._createDropDown = function () {
                var self = this;

                // create the drop-down element
                this._colorPicker = new input.ColorPicker(this._dropDown);
                wijmo.setCss(this._dropDown, {
                    minWidth: 420,
                    minHeight: 200
                });

                // update our value to match colorPicker's
                this._colorPicker.valueChanged.addHandler(function () {
                    self.value = self._colorPicker.value;
                });
            };

            // override to commit/cancel edits
            InputColor.prototype._keydown = function (e) {
                switch (e.keyCode) {
                    case 13 /* Enter */:
                        this.isDroppedDown = false;
                        this._commitText();
                        this.selectAll();
                        break;
                    case 27 /* Escape */:
                        this.isDroppedDown = false;
                        this.text = this.value;
                        this.selectAll();
                        break;
                }
                _super.prototype._keydown.call(this, e);
            };

            // commit content when losing focus
            InputColor.prototype._blur = function () {
                _super.prototype._blur.call(this);
                this._commitText();
            };

            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // assign new color to ColorPicker
            InputColor.prototype._commitText = function () {
                if (this.value != this.text) {
                    // allow empty values
                    if (!this.required && !this.text) {
                        this._value = this.text;
                        this._ePreview.style.backgroundColor = '';
                        return;
                    }

                    // parse and assign color to control
                    var c = wijmo.Color.fromString(this.text);
                    if (c) {
                        this._colorPicker.value = this.text;
                        this._value = this._colorPicker.value;
                        this._ePreview.style.backgroundColor = this.value;
                        this.onValueChanged();
                    } else {
                        this.text = this._value ? this._value : '';
                    }
                }
            };
            return InputColor;
        })(input.DropDown);
        input.InputColor = InputColor;
    })(wijmo.input || (wijmo.input = {}));
    var input = wijmo.input;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputColor.js.map

