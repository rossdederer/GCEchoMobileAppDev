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
var wijmo;
(function (wijmo) {
    (function (_grid) {
        /**
        * Extension that provides an Excel-style filtering UI for @see:FlexGrid controls.
        */
        (function (filter) {
            'use strict';

            /**
            * Specifies types of column filter.
            */
            (function (FilterType) {
                /** No filter. */
                FilterType[FilterType["None"] = 0] = "None";

                /** A filter based on two conditions. */
                FilterType[FilterType["Condition"] = 1] = "Condition";

                /** A filter based on a set of values. */
                FilterType[FilterType["Value"] = 2] = "Value";

                /** A filter that combines condition and value filters. */
                FilterType[FilterType["Both"] = 3] = "Both";
            })(filter.FilterType || (filter.FilterType = {}));
            var FilterType = filter.FilterType;

            /**
            * Implements an Excel-style filter for @see:FlexGrid controls.
            *
            * To enable filtering on a @see:FlexGrid control, create an instance
            * of the @see:FlexGridFilter and pass the grid as a parameter to the
            * constructor. For example:
            *
            * <pre>
            * // create FlexGrid
            * var flex = new wijmo.grid.FlexGrid('#gridElement');
            * // enable filtering on the FlexGrid
            * var filter = new wijmo.grid.filter.FlexGridFilter(flex);
            * </pre>
            *
            * Once this is done, a filter icon is added to the grid's column headers.
            * Clicking the icon shows an editor where the user can edit the filter
            * conditions for that column.
            *
            * The @see:FlexGridFilter class depends on the <b>wijmo.grid</b> and
            * <b>wijmo.input</b> modules.
            */
            var FlexGridFilter = (function () {
                /**
                * Initializes a new instance of the @see:FlexGridFilter.
                *
                * @param grid The @see:FlexGrid to filter.
                */
                function FlexGridFilter(grid) {
                    this._showIcons = true;
                    this._showSort = true;
                    this._defFilterType = 3 /* Both */;
                    /**
                    * Occurs after the filter is applied.
                    */
                    this.filterApplied = new wijmo.Event();
                    /**
                    * Occurs when a column filter is about to be edited by the user.
                    *
                    * Use this event to customize the column filter if you want to
                    * override the default settings for the filter.
                    *
                    * For example, the code below sets the operator used by the filter
                    * conditions to 'contains' if they are null:
                    *
                    * <pre>filter.filterChanging.addHandler(function (s, e) {
                    *   var cf = filter.getColumnFilter(e.col);
                    *   if (!cf.valueFilter.isActive && cf.conditionFilter.condition1.operator == null) {
                    *     cf.filterType = wijmo.grid.filter.FilterType.Condition;
                    *     cf.conditionFilter.condition1.operator = wijmo.grid.filter.Operator.CT;
                    *   }
                    * });</pre>
                    */
                    this.filterChanging = new wijmo.Event();
                    /**
                    * Occurs after a column filter has been edited by the user.
                    *
                    * Use the event parameters to determine the column that owns
                    * the filter and whether changes were applied or canceled.
                    */
                    this.filterChanged = new wijmo.Event();
                    // check dependencies
                    var depErr = 'Missing dependency: FlexGridFilter requires ';
                    wijmo.assert(wijmo.grid.FlexGrid != null, depErr + 'wijmo.grid.');
                    wijmo.assert(wijmo.input.ComboBox != null, depErr + 'wijmo.input.');

                    // initialize filter
                    this._filters = [];
                    this._grid = wijmo.asType(grid, _grid.FlexGrid, false);
                    this._grid.formatItem.addHandler(this._formatItem.bind(this));
                    this._grid.itemsSourceChanged.addHandler(this.clear.bind(this));
                    this._grid.hostElement.addEventListener('mousedown', this._mouseDown.bind(this), true);

                    // initialize column filters
                    this._grid.invalidate();
                }
                Object.defineProperty(FlexGridFilter.prototype, "grid", {
                    /**
                    * Gets a reference to the @see:FlexGrid that owns this filter.
                    */
                    get: function () {
                        return this._grid;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FlexGridFilter.prototype, "showFilterIcons", {
                    /**
                    * Gets or sets a value indicating whether the @see:FlexGridFilter adds filter
                    * editing buttons to the grid's column headers.
                    *
                    * If you set this property to false, then you are responsible for providing
                    * a way for users to edit, clear, and apply the filters.
                    */
                    get: function () {
                        return this._showIcons;
                    },
                    set: function (value) {
                        if (value != this.showFilterIcons) {
                            this._showIcons = wijmo.asBoolean(value);
                            if (this._grid) {
                                this._grid.invalidate();
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FlexGridFilter.prototype, "showSortButtons", {
                    /**
                    * Gets or sets a value indicating whether the filter editor should include
                    * sort buttons.
                    *
                    * By default, the editor shows sort buttons like Excel does. But since users
                    * can sort columns by clicking their headers, sort buttons in the filter editor
                    * may not be desirable in some circumstances.
                    */
                    get: function () {
                        return this._showSort;
                    },
                    set: function (value) {
                        this._showSort = wijmo.asBoolean(value);
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Gets the filter for the given column.
                *
                * @param col The @see:Column that the filter applies to (or column name or index).
                * @param create Whether to create the filter if it does not exist.
                */
                FlexGridFilter.prototype.getColumnFilter = function (col, create) {
                    if (typeof create === "undefined") { create = true; }
                    // get the column by name or index, check type
                    if (wijmo.isString(col)) {
                        col = this._grid.columns.getColumn(col);
                    } else if (wijmo.isNumber(col)) {
                        col = this._grid.columns[col];
                    }
                    col = wijmo.asType(col, _grid.Column);

                    for (var i = 0; i < this._filters.length; i++) {
                        if (this._filters[i].column == col) {
                            return this._filters[i];
                        }
                    }

                    // not found, create one now
                    if (create && col.binding) {
                        var cf = new filter.ColumnFilter(this, col);
                        this._filters.push(cf);
                        return cf;
                    }

                    // not found, not created
                    return null;
                };

                Object.defineProperty(FlexGridFilter.prototype, "defaultFilterType", {
                    /**
                    * Gets or sets the default filter type to use.
                    *
                    * This value can be overridden in filters for specific columns.
                    * For example, the code below creates a filter that filters by
                    * conditions on all columns except the "ByValue" column:
                    *
                    * <pre>
                    * var f = new wijmo.grid.filter.FlexGridFilter(flex);
                    * f.defaultFilterType = wijmo.grid.filter.FilterType.Condition;
                    * var col = flex.columns.getColumn('ByValue'),
                    *     cf = f.getColumnFilter(col);
                    * cf.filterType = wijmo.grid.filter.FilterType.Value;
                    * </pre>
                    */
                    get: function () {
                        return this._defFilterType;
                    },
                    set: function (value) {
                        if (value != this.defaultFilterType) {
                            this._defFilterType = wijmo.asEnum(value, FilterType, false);
                            this._grid.invalidate();
                            this.clear();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FlexGridFilter.prototype, "filterDefinition", {
                    /**
                    * Gets or sets the current filter definition as a JSON string.
                    */
                    get: function () {
                        var def = {
                            defaultFilterType: this.defaultFilterType,
                            filters: []
                        };
                        for (var i = 0; i < this._filters.length; i++) {
                            var cf = this._filters[i];
                            if (cf && cf.column && cf.column.binding) {
                                if (cf.conditionFilter.isActive) {
                                    var cfc = cf.conditionFilter;
                                    def.filters.push({
                                        binding: cf.column.binding,
                                        type: 'condition',
                                        condition1: { operator: cfc.condition1.operator, value: cfc.condition1.value },
                                        and: cfc.and,
                                        condition2: { operator: cfc.condition2.operator, value: cfc.condition2.value }
                                    });
                                } else if (cf.valueFilter.isActive) {
                                    var cfv = cf.valueFilter;
                                    def.filters.push({
                                        binding: cf.column.binding,
                                        type: 'value',
                                        filterText: cfv.filterText,
                                        showValues: cfv.showValues
                                    });
                                }
                            }
                        }
                        return JSON.stringify(def);
                    },
                    set: function (value) {
                        var def = JSON.parse(wijmo.asString(value));
                        this.clear();
                        this.defaultFilterType = def.defaultFilterType;
                        for (var i = 0; i < def.filters.length; i++) {
                            var cfs = def.filters[i], col = this._grid.columns.getColumn(cfs.binding), cf = this.getColumnFilter(col, true);
                            if (cf) {
                                switch (cfs.type) {
                                    case 'condition':
                                        var cfc = cf.conditionFilter, val = wijmo.changeType(cfs.condition1.value, col.dataType, col.format);
                                        cfc.condition1.value = val ? val : cfs.condition1.value; // TFS 125144 (to handle times)
                                        cfc.condition1.operator = cfs.condition1.operator;
                                        cfc.and = cfs.and;
                                        val = wijmo.changeType(cfs.condition2.value, col.dataType, col.format);
                                        cfc.condition2.value = val ? val : cfs.condition2.value; // TFS 125144 (to handle times)
                                        cfc.condition2.operator = cfs.condition2.operator;
                                        break;
                                    case 'value':
                                        var cfv = cf.valueFilter;
                                        cfv.filterText = cfs.filterText;
                                        cfv.showValues = cfs.showValues;
                                        break;
                                }
                            }
                        }
                        this.apply();
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Gets the current filter definition as an OData string.
                */
                FlexGridFilter.prototype.getODataFilterDefinition = function () {
                    return this._asOData();
                };

                /**
                * Shows the filter editor for the given grid column.
                *
                * @param col The @see:Column that contains the filter to edit.
                */
                FlexGridFilter.prototype.editColumnFilter = function (col) {
                    // remove current editor
                    this.closeEditor();

                    // get column by name of by reference
                    col = wijmo.isString(col) ? this._grid.columns.getColumn(col) : wijmo.asType(col, _grid.Column, false);

                    // raise filterChanging event
                    var e = new _grid.CellRangeEventArgs(this._grid.cells, new _grid.CellRange(-1, col.index));
                    this.onFilterChanging(e);
                    if (e.cancel) {
                        return;
                    }
                    e.cancel = true; // assume the changes will be canceled

                    // get the header cell to position editor
                    var ch = this._grid.columnHeaders, rc = ch.getCellBoundingRect(ch.rows.length - 1, col.index);

                    // get the filter and the editor
                    var div = document.createElement('div'), flt = this.getColumnFilter(col), edt = new filter.ColumnFilterEditor(div, flt, this.showSortButtons);
                    wijmo.addClass(div, 'wj-dropdown-panel');

                    // handle RTL
                    var rtl = getComputedStyle(this._grid.hostElement).direction == 'rtl';
                    if (rtl) {
                        div.dir = 'rtl';
                    }

                    // apply filter when it changes
                    var self = this;
                    edt.filterChanged.addHandler(function () {
                        e.cancel = false; // the changes were not canceled
                        setTimeout(function () {
                            if (!e.cancel) {
                                self.apply();
                            }
                        });
                    });

                    // close editor when editor button is clicked
                    edt.buttonClicked.addHandler(function () {
                        self.closeEditor();
                        self.onFilterChanged(e);
                    });

                    // close editor when it loses focus (changes are not applied)
                    edt.lostFocus.addHandler(function () {
                        setTimeout(function () {
                            var ctl = wijmo.Control.getControl(self._divEdt);
                            if (ctl && !ctl.containsFocus()) {
                                self.closeEditor();
                            }
                        }, 10); //200); // let others handle it first
                    });

                    // show editor and give it focus
                    var host = document.body;
                    host.appendChild(div);
                    wijmo.showPopup(div, rc);
                    edt.focus();

                    // save reference to editor
                    this._divEdt = div;
                    this._edtCol = col;
                };

                /**
                * Closes the filter editor.
                */
                FlexGridFilter.prototype.closeEditor = function () {
                    if (this._divEdt) {
                        wijmo.hidePopup(this._divEdt, true); // remove editor from DOM
                        var edt = wijmo.Control.getControl(this._divEdt);
                        if (edt) {
                            edt.dispose();
                        }
                        this._divEdt = null;
                        this._edtCol = null;
                    }
                };

                /**
                * Applies the current column filters to the grid.
                */
                FlexGridFilter.prototype.apply = function () {
                    var cv = this._grid.collectionView;
                    if (cv) {
                        if (cv.filter) {
                            cv.refresh();
                        } else {
                            cv.filter = this._filter.bind(this);
                        }
                    }

                    // apply OData filter definition if this is an ODataCollectionView
                    if (wijmo.odata) {
                        var odataView = wijmo.tryCast(cv, wijmo.odata.ODataCollectionView);
                        if (odataView && odataView.filterOnServer) {
                            odataView.filterDefinition = this.getODataFilterDefinition();
                        }
                    }

                    // and fire the event
                    this.onFilterApplied();
                };

                /**
                * Clears all column filters.
                */
                FlexGridFilter.prototype.clear = function () {
                    if (this._filters.length) {
                        this._filters = [];
                        this.apply();
                    }
                };

                /**
                * Raises the @see:filterApplied event.
                */
                FlexGridFilter.prototype.onFilterApplied = function (e) {
                    this.filterApplied.raise(this, e);
                };

                /**
                * Raises the @see:filterChanging event.
                */
                FlexGridFilter.prototype.onFilterChanging = function (e) {
                    this.filterChanging.raise(this, e);
                };

                /**
                * Raises the @see:filterChanged event.
                */
                FlexGridFilter.prototype.onFilterChanged = function (e) {
                    this.filterChanged.raise(this, e);
                };

                // ** implementation
                // predicate function used to filter the CollectionView
                FlexGridFilter.prototype._filter = function (item) {
                    for (var i = 0; i < this._filters.length; i++) {
                        if (!this._filters[i].apply(item)) {
                            return false;
                        }
                    }
                    return true;
                };

                // handle the formatItem event to add filter icons to the column header cells
                FlexGridFilter.prototype._formatItem = function (sender, e) {
                    // check that this is a filter cell
                    if (e.panel.cellType == 2 /* ColumnHeader */ && e.row == this._grid.columnHeaders.rows.length - 1) {
                        // check that this column should have a filter
                        var col = this._grid.columns[e.col], cf = this.getColumnFilter(col, this.defaultFilterType != 0 /* None */);
                        if (cf && cf.filterType != 0 /* None */) {
                            // handle RTL
                            var rtl = getComputedStyle(this._grid.hostElement).direction == 'rtl';

                            // show filter glyph for this column
                            if (this._showIcons) {
                                var filterGlyph = '<div ' + FlexGridFilter._WJA_FILTER + ' style ="float:' + (rtl ? 'left' : 'right') + ' ;cursor:pointer;padding:0px 4px">' + '<span class="wj-glyph-filter"></span>' + '</div>';
                                e.cell.innerHTML = filterGlyph + e.cell.innerHTML;
                            }

                            // update filter classes
                            wijmo.toggleClass(e.cell, 'wj-filter-on', cf.isActive);
                            wijmo.toggleClass(e.cell, 'wj-filter-off', !cf.isActive);
                        } else {
                            // remove filter classes
                            wijmo.removeClass(e.cell, 'wj-filter-on');
                            wijmo.removeClass(e.cell, 'wj-filter-off');
                        }
                    }
                };

                // handle mouse down to show/hide the filter editor
                FlexGridFilter.prototype._mouseDown = function (e) {
                    if (this._hasAttribute(e.target, FlexGridFilter._WJA_FILTER)) {
                        var ht = this._grid.hitTest(e);
                        if (ht.panel == this._grid.columnHeaders) {
                            var col = this._grid.columns[ht.col], self = this;
                            if (this._divEdt && this._edtCol == col) {
                                this.closeEditor();
                            } else {
                                setTimeout(function () {
                                    self.editColumnFilter(col);
                                }, this._divEdt ? 100 : 0); // allow some time to close editors (TFS 117746)
                            }

                            //e.stopImmediatePropagation();
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    }
                };

                // checks whether an element or any of its ancestors contains an attribute
                FlexGridFilter.prototype._hasAttribute = function (e, att) {
                    for (; e; e = e.parentNode) {
                        if (e.getAttribute && e.getAttribute(att) != null)
                            return true;
                    }
                    return false;
                };

                // gets the filter definition as an OData filter string
                // http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
                FlexGridFilter.prototype._asOData = function () {
                    var def = '';
                    for (var c = 0; c < this.grid.columns.length; c++) {
                        var col = this.grid.columns[c], cf = this.getColumnFilter(col, false);
                        if (cf && cf.isActive) {
                            if (def) {
                                def += ' and ';
                            }
                            if (cf.conditionFilter && cf.conditionFilter.isActive) {
                                def += this._asODataConditionFilter(cf.conditionFilter);
                            } else if (cf.valueFilter && cf.valueFilter.isActive) {
                                def += this._asODataValueFilter(cf.valueFilter);
                            }
                        }
                    }
                    return def;
                };
                FlexGridFilter.prototype._asODataValueFilter = function (vf) {
                    var col = vf.column, fld = col.binding, val = '';
                    for (var key in vf.showValues) {
                        var value = wijmo.changeType(key, col.dataType, col.format);
                        if (val)
                            val += ' or ';
                        val += '(' + fld + ' eq ' + this._asODataValue(value, col.dataType) + ')';
                    }
                    return '(' + val + ')';
                };
                FlexGridFilter.prototype._asODataConditionFilter = function (cf) {
                    var val = this._asODataCondition(cf, cf.condition1);
                    if (cf.condition2.operator != null) {
                        val += (cf.and ? ' and ' : ' or ') + this._asODataCondition(cf, cf.condition2);
                    }
                    return '(' + val + ')';
                };
                FlexGridFilter.prototype._asODataCondition = function (cf, cond) {
                    var fld = cf.column.binding, val = this._asODataValue(cond.value, cf.column.dataType);
                    switch (cond.operator) {
                        case 0:
                            return fld + ' eq ' + val;
                        case 1:
                            return fld + ' ne ' + val;
                        case 2:
                            return fld + ' gt ' + val;
                        case 3:
                            return fld + ' gt ' + val;
                        case 4:
                            return fld + ' lt ' + val;
                        case 5:
                            return fld + ' le ' + val;
                        case 6:
                            return 'startswith(' + fld + ',' + val + ')';
                        case 7:
                            return 'endswith(' + fld + ',' + val + ')';
                        case 8:
                            return 'indexof(' + fld + ',' + val + ') gt -1';
                        case 9:
                            return 'indexof(' + fld + ',' + val + ') lt 0';
                    }
                };
                FlexGridFilter.prototype._asODataValue = function (val, dataType) {
                    if (wijmo.isString(val)) {
                        return "'" + val.replace(/'/g, "\'") + "'";
                    } else if (wijmo.isDate(val)) {
                        return "datetime'" + val.toISOString() + "'";
                    } else if (val != null) {
                        return val.toString();
                    }
                    return dataType == 1 /* String */ ? "''" : null;
                };
                FlexGridFilter._WJA_FILTER = 'wj-filter';
                return FlexGridFilter;
            })();
            filter.FlexGridFilter = FlexGridFilter;
        })(_grid.filter || (_grid.filter = {}));
        var filter = _grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexGridFilter.js.map

var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (filter) {
            'use strict';

            
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=IColumnFilter.js.map

var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (filter) {
            'use strict';

            /**
            * Defines a filter for a column on a @see:FlexGrid control.
            *
            * The @see:ColumnFilter contains a @see:ConditionFilter and a
            * @see:ValueFilter; only one of them may be active at a time.
            *
            * This class is used by the @see:FlexGridFilter class; you
            * rarely use it directly.
            */
            var ColumnFilter = (function () {
                /**
                * Initializes a new instance of a @see:ColumnFilter.
                *
                * @param owner The @see:FlexGridFilter that owns this column filter.
                * @param column The @see:Column to filter.
                */
                function ColumnFilter(owner, column) {
                    this._owner = owner;
                    this._col = column;
                    this._valueFilter = new filter.ValueFilter(column);
                    this._conditionFilter = new filter.ConditionFilter(column);
                }
                Object.defineProperty(ColumnFilter.prototype, "filterType", {
                    /**
                    * Gets or sets the types of filtering provided by this filter.
                    *
                    * Setting this property to null causes the filter to use the value
                    * defined by the owner filter's @see:defaultFilterType property.
                    */
                    get: function () {
                        return this._filterType != null ? this._filterType : this._owner.defaultFilterType;
                    },
                    set: function (value) {
                        if (value != this._filterType) {
                            var wasActive = this.isActive;
                            this.clear();
                            this._filterType = wijmo.asEnum(value, filter.FilterType, true);
                            if (wasActive) {
                                this._owner.apply();
                            } else if (this._col.grid) {
                                this._col.grid.invalidate();
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ColumnFilter.prototype, "valueFilter", {
                    /**
                    * Gets the @see:ValueFilter in this @see:ColumnFilter.
                    */
                    get: function () {
                        return this._valueFilter;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ColumnFilter.prototype, "conditionFilter", {
                    /**
                    * Gets the @see:ConditionFilter in this @see:ColumnFilter.
                    */
                    get: function () {
                        return this._conditionFilter;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ColumnFilter.prototype, "column", {
                    // ** IColumnFilter
                    /**
                    * Gets the @see:Column being filtered.
                    */
                    get: function () {
                        return this._col;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ColumnFilter.prototype, "isActive", {
                    /**
                    * Gets a value indicating whether the filter is active.
                    */
                    get: function () {
                        return this._conditionFilter.isActive || this._valueFilter.isActive;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Gets a value indicating whether a value passes the filter.
                *
                * @param value The value to test.
                */
                ColumnFilter.prototype.apply = function (value) {
                    return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
                };

                /**
                * Clears the filter.
                */
                ColumnFilter.prototype.clear = function () {
                    this._valueFilter.clear();
                    this._conditionFilter.clear();
                };

                // ** IQueryInterface
                /**
                * Returns true if the caller queries for a supported interface.
                *
                * @param interfaceName Name of the interface to look for.
                */
                ColumnFilter.prototype.implementsInterface = function (interfaceName) {
                    return interfaceName == 'IColumnFilter';
                };
                return ColumnFilter;
            })();
            filter.ColumnFilter = ColumnFilter;
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ColumnFilter.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (_filter) {
            'use strict';

            // globalization info
            wijmo.culture.FlexGridFilter = {
                // filter
                ascending: '\u2191 Ascending',
                descending: '\u2193 Descending',
                apply: 'Apply',
                clear: 'Clear',
                conditions: 'Filter by Condition',
                values: 'Filter by Value',
                // value filter
                search: 'Search',
                selectAll: 'Select All',
                null: '(nothing)',
                // condition filter
                header: 'Show items where the value',
                and: 'And',
                or: 'Or',
                stringOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: 0 /* EQ */ },
                    { name: 'Does not equal', op: 1 /* NE */ },
                    { name: 'Begins with', op: 6 /* BW */ },
                    { name: 'Ends with', op: 7 /* EW */ },
                    { name: 'Contains', op: 8 /* CT */ },
                    { name: 'Does not contain', op: 9 /* NC */ }
                ],
                numberOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: 0 /* EQ */ },
                    { name: 'Does not equal', op: 1 /* NE */ },
                    { name: 'Is Greater than', op: 2 /* GT */ },
                    { name: 'Is Greater than or equal to', op: 3 /* GE */ },
                    { name: 'Is Less than', op: 4 /* LT */ },
                    { name: 'Is Less than or equal to', op: 5 /* LE */ }
                ],
                dateOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: 0 /* EQ */ },
                    { name: 'Is Before', op: 4 /* LT */ },
                    { name: 'Is After', op: 2 /* GT */ }
                ],
                booleanOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: 0 /* EQ */ },
                    { name: 'Does not equal', op: 1 /* NE */ }
                ]
            };

            /**
            * The editor used to inspect and modify column filters.
            *
            * This class is used by the @see:FlexGridFilter class; you
            * rarely use it directly.
            */
            var ColumnFilterEditor = (function (_super) {
                __extends(ColumnFilterEditor, _super);
                /**
                * Initializes a new instance of the @see:ColumnFilterEditor.
                *
                * @param element The DOM element that hosts the control, or a selector
                * for the host element (e.g. '#theCtrl').
                * @param filter The @see:ColumnFilter to edit.
                * @param sortButtons Whether to show sort buttons in the editor.
                */
                function ColumnFilterEditor(element, filter, sortButtons) {
                    if (typeof sortButtons === "undefined") { sortButtons = true; }
                    _super.call(this, element);
                    /**
                    * Occurs after the filter is modified.
                    */
                    this.filterChanged = new wijmo.Event();
                    /**
                    * Occurs when one of the editor buttons is clicked.
                    */
                    this.buttonClicked = new wijmo.Event();

                    // save reference to filter being edited
                    this._filter = wijmo.asType(filter, _filter.ColumnFilter);

                    // instantiate and apply template
                    var tpl = this.getTemplate();
                    this.applyTemplate('wj-control wj-columnfiltereditor wj-content', tpl, {
                        _divSort: 'div-sort',
                        _btnAsc: 'btn-asc',
                        _btnDsc: 'btn-dsc',
                        _divType: 'div-type',
                        _aVal: 'a-val',
                        _aCnd: 'a-cnd',
                        _divEdtVal: 'div-edt-val',
                        _divEdtCnd: 'div-edt-cnd',
                        _btnApply: 'btn-apply',
                        _btnClear: 'btn-clear'
                    });

                    // localization
                    this._btnAsc.textContent = wijmo.culture.FlexGridFilter.ascending;
                    this._btnDsc.textContent = wijmo.culture.FlexGridFilter.descending;
                    this._aVal.textContent = wijmo.culture.FlexGridFilter.values;
                    this._aCnd.textContent = wijmo.culture.FlexGridFilter.conditions;
                    this._btnApply.textContent = wijmo.culture.FlexGridFilter.apply;
                    this._btnClear.textContent = wijmo.culture.FlexGridFilter.clear;

                    // show the filter that is active
                    var ft = (this.filter.conditionFilter.isActive || (filter.filterType & 2 /* Value */) == 0) ? 1 /* Condition */ : 2 /* Value */;
                    this._showFilter(ft);

                    // hide sort buttons if the collection view is not sortable
                    // or if the user doesn't want them
                    var col = this.filter.column, view = col.grid.collectionView;
                    if (!sortButtons || !view || !view.canSort) {
                        this._divSort.style.display = 'none';
                    }

                    // initialize all values
                    this.updateEditor();

                    // handle button clicks
                    var bnd = this._btnClicked.bind(this);
                    this._btnApply.addEventListener('click', bnd);
                    this._btnClear.addEventListener('click', bnd);
                    this._btnAsc.addEventListener('click', bnd);
                    this._btnDsc.addEventListener('click', bnd);
                    this._aVal.addEventListener('click', bnd);
                    this._aCnd.addEventListener('click', bnd);

                    // commit/dismiss on Enter/Esc
                    var self = this;
                    this.hostElement.addEventListener('keydown', function (e) {
                        switch (e.keyCode) {
                            case 13 /* Enter */:
                                switch (e.target.tagName) {
                                    case 'A':
                                    case 'BUTTON':
                                        self._btnClicked(e); // TFS 123049
                                        break;
                                    default:
                                        self.updateFilter();
                                        self.onFilterChanged();
                                        self.onButtonClicked();
                                        break;
                                }
                                e.preventDefault();
                                break;
                            case 27 /* Escape */:
                                self.onButtonClicked();
                                e.preventDefault();
                                break;
                        }
                    });
                }
                Object.defineProperty(ColumnFilterEditor.prototype, "filter", {
                    /**
                    * Gets a reference to the @see:ColumnFilter being edited.
                    */
                    get: function () {
                        return this._filter;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Updates editor with current filter settings.
                */
                ColumnFilterEditor.prototype.updateEditor = function () {
                    if (this._edtVal) {
                        this._edtVal.updateEditor();
                    }
                    if (this._edtCnd) {
                        this._edtCnd.updateEditor();
                    }
                };

                /**
                * Updates filter to reflect the current editor values.
                */
                ColumnFilterEditor.prototype.updateFilter = function () {
                    switch (this._getFilterType()) {
                        case 2 /* Value */:
                            this._edtVal.updateFilter();
                            this.filter.conditionFilter.clear();
                            break;
                        case 1 /* Condition */:
                            this._edtCnd.updateFilter();
                            this.filter.valueFilter.clear();
                            break;
                    }
                };

                /**
                * Raises the @see:filterChanged event.
                */
                ColumnFilterEditor.prototype.onFilterChanged = function (e) {
                    this.filterChanged.raise(this, e);
                };

                /**
                * Raises the @see:buttonClicked event.
                */
                ColumnFilterEditor.prototype.onButtonClicked = function (e) {
                    this.buttonClicked.raise(this, e);
                };

                // ** implementation
                // shows the value or filter editor
                ColumnFilterEditor.prototype._showFilter = function (filterType) {
                    // create editor if we have to
                    if (filterType == 2 /* Value */ && this._edtVal == null) {
                        this._edtVal = new _filter.ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
                    }
                    if (filterType == 1 /* Condition */ && this._edtCnd == null) {
                        this._edtCnd = new _filter.ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
                    }

                    // show selected editor
                    if ((filterType & this.filter.filterType) != 0) {
                        if (filterType == 2 /* Value */) {
                            this._divEdtVal.style.display = '';
                            this._divEdtCnd.style.display = 'none';
                            this._enableLink(this._aVal, false);
                            this._enableLink(this._aCnd, true);
                        } else {
                            this._divEdtVal.style.display = 'none';
                            this._divEdtCnd.style.display = '';
                            this._enableLink(this._aVal, true);
                            this._enableLink(this._aCnd, false);
                        }
                    }

                    switch (this.filter.filterType) {
                        case 0 /* None */:
                        case 1 /* Condition */:
                        case 2 /* Value */:
                            this._divType.style.display = 'none';
                            break;
                        default:
                            this._divType.style.display = '';
                            break;
                    }
                };

                // enable/disable filter switch links
                ColumnFilterEditor.prototype._enableLink = function (a, enable) {
                    a.style.textDecoration = enable ? '' : 'none';
                    a.style.fontWeight = enable ? '' : 'bold';
                    if (enable) {
                        a.href = '';
                    } else {
                        a.removeAttribute('href');
                    }
                };

                // gets the type of filter currently being edited
                ColumnFilterEditor.prototype._getFilterType = function () {
                    return this._divEdtVal.style.display != 'none' ? 2 /* Value */ : 1 /* Condition */;
                };

                // handle buttons
                ColumnFilterEditor.prototype._btnClicked = function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // ignore disabled elements
                    if (wijmo.hasClass(e.target, 'wj-state-disabled')) {
                        return;
                    }

                    // switch filters
                    if (e.target == this._aVal) {
                        this._showFilter(2 /* Value */);
                        this._edtVal.focus();
                        return;
                    }
                    if (e.target == this._aCnd) {
                        this._showFilter(1 /* Condition */);
                        this._edtCnd.focus();
                        return;
                    }

                    // apply sort
                    if (e.target == this._btnAsc || e.target == this._btnDsc) {
                        var col = this.filter.column, binding = col.sortMemberPath ? col.sortMemberPath : col.binding, view = col.grid.collectionView, sortDesc = new wijmo.collections.SortDescription(binding, e.target == this._btnAsc);
                        view.sortDescriptions.deferUpdate(function () {
                            view.sortDescriptions.clear();
                            view.sortDescriptions.push(sortDesc);
                        });
                    }

                    // apply/clear filter
                    if (e.target == this._btnApply) {
                        this.updateFilter();
                        this.onFilterChanged();
                    } else if (e.target == this._btnClear) {
                        if (this.filter.isActive) {
                            this.filter.clear();
                            this.onFilterChanged();
                        }
                    }

                    // show current filter state
                    this.updateEditor();

                    // raise event so caller can close the editor and apply the new filter
                    this.onButtonClicked();
                };
                ColumnFilterEditor.controlTemplate = '<div>' + '<div wj-part="div-sort">' + '<a wj-part="btn-asc" href="" style="min-width:95px"></a>&nbsp;&nbsp;&nbsp;' + '<a wj-part="btn-dsc" href="" style="min-width:95px"></a>' + '</div>' + '<div style="text-align:right;margin:10px 0px;font-size:80%">' + '<div wj-part="div-type">' + '<a wj-part="a-cnd" href="" tab-index="-1"></a>' + '&nbsp;|&nbsp;' + '<a wj-part="a-val" href="" tab-index="-1"></a>' + '</div>' + '</div>' + '<div wj-part="div-edt-val"></div>' + '<div wj-part="div-edt-cnd"></div>' + '<div style="text-align:right;margin-top:10px">' + '<a wj-part="btn-apply" href=""></a>&nbsp;&nbsp;' + '<a wj-part="btn-clear" href=""></a>' + '</div>';
                return ColumnFilterEditor;
            })(wijmo.Control);
            _filter.ColumnFilterEditor = ColumnFilterEditor;
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ColumnFilterEditor.js.map

var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (filter) {
            'use strict';

            /**
            * Defines a value filter for a column on a @see:FlexGrid control.
            *
            * Value filters contain an explicit list of values that should be
            * displayed by the grid.
            */
            var ValueFilter = (function () {
                /**
                * Initializes a new instance of a @see:ValueFilter.
                *
                * @param column The column to filter.
                */
                function ValueFilter(column) {
                    this._maxValues = 250;
                    this._col = column;
                    this._bnd = column.binding ? new wijmo.Binding(column.binding) : null;
                }
                Object.defineProperty(ValueFilter.prototype, "showValues", {
                    /**
                    * Gets or sets an object with all the formatted values that should be shown on the value list.
                    */
                    get: function () {
                        return this._values;
                    },
                    set: function (value) {
                        this._values = value;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ValueFilter.prototype, "filterText", {
                    /**
                    * Gets or sets a string used to filter the list of display values.
                    */
                    get: function () {
                        return this._filterText;
                    },
                    set: function (value) {
                        this._filterText = wijmo.asString(value);
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ValueFilter.prototype, "maxValues", {
                    /**
                    * Gets or sets the maximum number of elements on the list of display values.
                    *
                    * Adding too many items to the list makes searching difficult and hurts
                    * performance. This property limits the number of items displayed at any time,
                    * but users can still use the search box to filter the items they are
                    * interested in.
                    *
                    * This property is set to 250 by default.
                    */
                    get: function () {
                        return this._maxValues;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ValueFilter.prototype, "maxValue", {
                    set: function (value) {
                        this._maxValues = wijmo.asNumber(value, false, true);
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ValueFilter.prototype, "uniqueValues", {
                    /**
                    * Gets or sets an array containing the unique values to be displayed on the list.
                    *
                    * If this property is set to null, the list will be filled based on the grid data.
                    *
                    * Explicitly assigning the list of unique values is more efficient than building
                    * the list from the data, and is required for value filters to work properly when
                    * the data is filtered on the server (because in this case some values might not
                    * be present on the client so the list will be incomplete).
                    *
                    * For example, the code below provides a list of countries to be used in the
                    * @see:ValueFilter for the column bound to the 'country' field:
                    *
                    * <pre>// create filter for a FlexGrid
                    * var filter = new wijmo.grid.filter.FlexGridFilter(grid);
                    * // assign list of unique values to country filter
                    * var cf = filter.getColumnFilter('country');
                    * cf.valueFilter.uniqueValues = countries;</pre>
                    */
                    get: function () {
                        return this._uniqueValues;
                    },
                    set: function (value) {
                        this._uniqueValues = wijmo.asArray(value);
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ValueFilter.prototype, "column", {
                    // ** IColumnFilter
                    /**
                    * Gets the @see:Column to filter.
                    */
                    get: function () {
                        return this._col;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ValueFilter.prototype, "isActive", {
                    /**
                    * Gets a value indicating whether the filter is active.
                    *
                    * The filter is active if there is at least one value is selected.
                    */
                    get: function () {
                        return this._values != null;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Gets a value indicating whether a value passes the filter.
                *
                * @param value The value to test.
                */
                ValueFilter.prototype.apply = function (value) {
                    var col = this.column;

                    // no binding or no values? accept everything
                    if (!col.binding || !this._values || !Object.keys(this._values).length) {
                        return true;
                    }

                    // retrieve the formatted value
                    value = this._bnd.getValue(value);
                    value = col.dataMap ? col.dataMap.getDisplayValue(value) : wijmo.Globalize.format(value, col.format);

                    // apply conditions
                    return this._values[value] != undefined;
                };

                /**
                * Clears the filter.
                */
                ValueFilter.prototype.clear = function () {
                    this.showValues = null;
                    this.filterText = null;
                };

                // ** IQueryInterface
                /**
                * Returns true if the caller queries for a supported interface.
                *
                * @param interfaceName Name of the interface to look for.
                */
                ValueFilter.prototype.implementsInterface = function (interfaceName) {
                    return interfaceName == 'IColumnFilter';
                };
                return ValueFilter;
            })();
            filter.ValueFilter = ValueFilter;
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ValueFilter.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (_filter) {
            'use strict';

            /**
            * The editor used to inspect and modify @see:ValueFilter objects.
            *
            * This class is used by the @see:FlexGridFilter class; you
            * rarely use it directly.
            */
            var ValueFilterEditor = (function (_super) {
                __extends(ValueFilterEditor, _super);
                /**
                * Initializes a new instance of the @see:ValueFilterEditor.
                *
                * @param element The DOM element that hosts the control, or a selector
                * for the host element (e.g. '#theCtrl').
                * @param filter The @see:ValueFilter to edit.
                */
                function ValueFilterEditor(element, filter) {
                    _super.call(this, element);

                    // save reference to filter
                    this._filter = wijmo.asType(filter, _filter.ValueFilter, false);

                    // instantiate and apply template
                    var tpl = this.getTemplate();
                    this.applyTemplate('wj-control', tpl, {
                        _divFilter: 'div-filter',
                        _cbSelectAll: 'cb-select-all',
                        _spSelectAll: 'sp-select-all',
                        _divValues: 'div-values'
                    });

                    // localization
                    this._spSelectAll.textContent = wijmo.culture.FlexGridFilter.selectAll;

                    // create sorted/filtered collection view with the values
                    var sortBinding = filter.column.dataMap ? 'text' : 'value';
                    this._view = new wijmo.collections.CollectionView();
                    this._view.sortDescriptions.push(new wijmo.collections.SortDescription(sortBinding, true));
                    this._view.filter = this._filterValues.bind(this);
                    this._view.collectionChanged.addHandler(this._updateSelectAllCheck, this);

                    // create search combo and value list
                    this._filterText = '';
                    this._cmbFilter = new wijmo.input.ComboBox(this._divFilter, {
                        placeholder: wijmo.culture.FlexGridFilter.search
                    });
                    this._lbValues = new wijmo.input.ListBox(this._divValues, {
                        displayMemberPath: 'text',
                        checkedMemberPath: 'show',
                        itemsSource: this._view,
                        itemFormatter: function (index, item) {
                            return item ? item : wijmo.culture.FlexGridFilter.null;
                        }
                    });

                    // add event listeners
                    this._cmbFilter.textChanged.addHandler(this._filterTextChanged, this);
                    this._cbSelectAll.addEventListener('click', this._cbSelectAllClicked.bind(this));

                    // initialize all values
                    this.updateEditor();
                }
                Object.defineProperty(ValueFilterEditor.prototype, "filter", {
                    /**
                    * Gets a reference to the @see:ValueFilter being edited.
                    */
                    get: function () {
                        return this._filter;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Updates editor with current filter settings.
                */
                ValueFilterEditor.prototype.updateEditor = function () {
                    var col = this._filter.column, values = [];

                    // get list of uniquw values
                    if (this._filter.uniqueValues) {
                        var uvalues = this._filter.uniqueValues;
                        for (var i = 0; i < uvalues.length; i++) {
                            var value = uvalues[i];
                            values.push({ value: value, text: value.toString() });
                        }
                    } else {
                        var keys = {}, view = col.grid.collectionView, src = view ? view.sourceCollection : [];
                        for (var i = 0; i < src.length; i++) {
                            var value = col._binding.getValue(src[i]), text = col.dataMap ? col.dataMap.getDisplayValue(value) : wijmo.Globalize.format(value, col.format);
                            if (!(text in keys)) {
                                keys[text] = true;
                                values.push({ value: value, text: text });
                            }
                        }
                    }

                    // check the items that are currently selected
                    var showValues = this._filter.showValues;
                    if (!showValues || Object.keys(showValues).length == 0) {
                        for (var i = 0; i < values.length; i++) {
                            values[i].show = true;
                        }
                    } else {
                        for (var key in showValues) {
                            for (var i = 0; i < values.length; i++) {
                                if (values[i].text == key) {
                                    values[i].show = true;
                                    break;
                                }
                            }
                        }
                    }

                    // honor isContentHtml property
                    this._lbValues.isContentHtml = col.isContentHtml;

                    // load filter and apply immediately
                    this._cmbFilter.text = this._filter.filterText;
                    this._filterText = this._cmbFilter.text.toLowerCase();

                    // show the values
                    this._view.pageSize = this._filter.maxValues;
                    this._view.sourceCollection = values;
                    this._view.moveCurrentToPosition(-1);
                };

                /**
                * Updates filter to reflect the current editor values.
                */
                ValueFilterEditor.prototype.updateFilter = function () {
                    // build list of values to show
                    var showValues = {}, items = this._view.items;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (item.show) {
                            showValues[item.text] = true;
                        }
                    }

                    // save to filter
                    this._filter.showValues = showValues;
                    this._filter.filterText = this._filterText;
                };

                // ** implementation
                // filter items on the list
                ValueFilterEditor.prototype._filterTextChanged = function () {
                    var self = this;
                    if (self._toText) {
                        clearTimeout(self._toText);
                    }
                    self._toText = setTimeout(function () {
                        // apply the filter
                        var filter = self._cmbFilter.text.toLowerCase();
                        if (filter != self._filterText) {
                            self._filterText = filter;
                            self._view.refresh();

                            // select all items that pass the filter (Excel behavior)
                            self._cbSelectAll.checked = true;
                            self._cbSelectAllClicked();
                        }
                    }, 500);
                };

                // filter values for display
                ValueFilterEditor.prototype._filterValues = function (value) {
                    if (this._filterText) {
                        return value && value.text ? value.text.toLowerCase().indexOf(this._filterText) > -1 : false;
                    }
                    return true;
                };

                // handle clicks on 'Select All' checkbox
                ValueFilterEditor.prototype._cbSelectAllClicked = function () {
                    var checked = this._cbSelectAll.checked, values = this._view.items;
                    for (var i = 0; i < values.length; i++) {
                        values[i].show = checked;
                    }
                    this._view.refresh();
                };

                // update state of 'Select All' checkbox when values are checked/unchecked
                ValueFilterEditor.prototype._updateSelectAllCheck = function () {
                    // count checked items
                    var checked = 0, values = this._view.items;
                    for (var i = 0; i < values.length; i++) {
                        if (values[i].show)
                            checked++;
                    }

                    // update checkbox
                    if (checked == 0) {
                        this._cbSelectAll.checked = false;
                        this._cbSelectAll.indeterminate = false;
                    } else if (checked == values.length) {
                        this._cbSelectAll.checked = true;
                        this._cbSelectAll.indeterminate = false;
                    } else {
                        this._cbSelectAll.indeterminate = true;
                    }
                    // REVIEW: disable Apply button if nothing is selected
                    //toggleClass(this._btnApply, 'wj-state-disabled', checked == 0);
                    //this._btnApply.style.cursor = (checked == 0) ? 'default' : '';
                };
                ValueFilterEditor.controlTemplate = '<div>' + '<div wj-part="div-filter"></div>' + '<br/>' + '<label style="margin-left:11px">' + '<input wj-part="cb-select-all" type="checkbox"> ' + '<span wj-part="sp-select-all"></span>' + '</label>' + '<br/>' + '<div wj-part="div-values" class="wj-dropdown" style="height:150px"></div>' + '</div>';
                return ValueFilterEditor;
            })(wijmo.Control);
            _filter.ValueFilterEditor = ValueFilterEditor;
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ValueFilterEditor.js.map

var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (filter) {
            'use strict';

            /**
            * Defines a condition filter for a column on a @see:FlexGrid control.
            *
            * Condition filters contain two conditions that may be combined
            * using an 'and' or an 'or' operator.
            *
            * This class is used by the @see:FlexGridFilter class; you will
            * rarely use it directly.
            */
            var ConditionFilter = (function () {
                /**
                * Initializes a new instance of a @see:ConditionFilter.
                *
                * @param column The column to filter.
                */
                function ConditionFilter(column) {
                    this._c1 = new filter.FilterCondition();
                    this._c2 = new filter.FilterCondition();
                    this._and = true;
                    this._col = column;
                    this._bnd = column.binding ? new wijmo.Binding(column.binding) : null;
                }
                Object.defineProperty(ConditionFilter.prototype, "condition1", {
                    /**
                    * Gets the first condition in the filter.
                    */
                    get: function () {
                        return this._c1;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ConditionFilter.prototype, "condition2", {
                    /**
                    * Gets the second condition in the filter.
                    */
                    get: function () {
                        return this._c2;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ConditionFilter.prototype, "and", {
                    /**
                    * Gets a value indicating whether to combine the two conditions
                    * with an AND or an OR operator.
                    */
                    get: function () {
                        return this._and;
                    },
                    set: function (value) {
                        this._and = wijmo.asBoolean(value);
                        this._bnd = this.column && this.column.binding ? new wijmo.Binding(this.column.binding) : null;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ConditionFilter.prototype, "column", {
                    // ** IColumnFilter
                    /**
                    * Gets the @see:Column to filter.
                    */
                    get: function () {
                        return this._col;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(ConditionFilter.prototype, "isActive", {
                    /**
                    * Gets a value indicating whether the filter is active.
                    *
                    * The filter is active if at least one of the two conditions
                    * has its operator and value set to a valid combination.
                    */
                    get: function () {
                        return this._c1.isActive || this._c2.isActive;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Returns a value indicating whether a value passes this filter.
                *
                * @param value The value to test.
                */
                ConditionFilter.prototype.apply = function (value) {
                    var col = this.column, c1 = this.condition1, c2 = this.condition2;

                    // no binding or not active? accept everything
                    if (!col.binding || !this.isActive) {
                        return true;
                    }

                    // retrieve the value
                    value = this._bnd.getValue(value);
                    if (col.dataMap) {
                        value = col.dataMap.getDisplayValue(value);
                    } else if (wijmo.isDate(value)) {
                        if (wijmo.isString(c1.value) || wijmo.isString(c2.value)) {
                            value = wijmo.Globalize.format(value, col.format);
                        }
                    } else if (wijmo.isNumber(value)) {
                        value = wijmo.Globalize.parseFloat(wijmo.Globalize.format(value, col.format));
                    }

                    // apply conditions
                    var rv1 = c1.apply(value), rv2 = c2.apply(value);

                    // combine results
                    if (c1.isActive && c2.isActive) {
                        return this._and ? rv1 && rv2 : rv1 || rv2;
                    } else {
                        return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
                    }
                };

                /**
                * Clears the filter.
                */
                ConditionFilter.prototype.clear = function () {
                    this.condition1.clear();
                    this.condition2.clear();
                    this.and = true;
                };

                // ** IQueryInterface
                /**
                * Returns true if the caller queries for a supported interface.
                *
                * @param interfaceName Name of the interface to look for.
                */
                ConditionFilter.prototype.implementsInterface = function (interfaceName) {
                    return interfaceName == 'IColumnFilter';
                };
                return ConditionFilter;
            })();
            filter.ConditionFilter = ConditionFilter;
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ConditionFilter.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (_filter) {
            'use strict';

            /**
            * The editor used to inspect and modify @see:ConditionFilter objects.
            *
            * This class is used by the @see:FlexGridFilter class; you
            * rarely use it directly.
            */
            var ConditionFilterEditor = (function (_super) {
                __extends(ConditionFilterEditor, _super);
                /**
                * Initializes a new instance of a @see:ConditionFilterEditor.
                *
                * @param element The DOM element that hosts the control, or a selector
                * for the host element (e.g. '#theCtrl').
                * @param filter The @see:ConditionFilter to edit.
                */
                function ConditionFilterEditor(element, filter) {
                    _super.call(this, element);

                    // save reference to filter
                    this._filter = wijmo.asType(filter, _filter.ConditionFilter, false);

                    // instantiate and apply template
                    var tpl = this.getTemplate();
                    this.applyTemplate('wj-control', tpl, {
                        _divHdr: 'div-hdr',
                        _divCmb1: 'div-cmb1',
                        _divVal1: 'div-val1',
                        _btnAnd: 'btn-and',
                        _btnOr: 'btn-or',
                        _spAnd: 'sp-and',
                        _spOr: 'sp-or',
                        _divCmb2: 'div-cmb2',
                        _divVal2: 'div-val2'
                    });

                    // localization
                    this._divHdr.textContent = wijmo.culture.FlexGridFilter.header;
                    this._spAnd.textContent = wijmo.culture.FlexGridFilter.and;
                    this._spOr.textContent = wijmo.culture.FlexGridFilter.or;

                    // create combos and value editors
                    this._cmb1 = this._createOperatorCombo(this._divCmb1);
                    this._cmb2 = this._createOperatorCombo(this._divCmb2);
                    this._val1 = this._createValueInput(this._divVal1);
                    this._val2 = this._createValueInput(this._divVal2);

                    // add event listeners
                    var andOr = this._btnAndOrChanged.bind(this);
                    this._btnAnd.addEventListener('change', andOr);
                    this._btnOr.addEventListener('change', andOr);

                    // initialize all values
                    this.updateEditor();
                }
                Object.defineProperty(ConditionFilterEditor.prototype, "filter", {
                    /**
                    * Gets a reference to the @see:ConditionFilter being edited.
                    */
                    get: function () {
                        return this._filter;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Updates editor with current filter settings.
                */
                ConditionFilterEditor.prototype.updateEditor = function () {
                    // initialize conditions
                    var c1 = this._filter.condition1, c2 = this._filter.condition2;
                    this._cmb1.selectedValue = c1.operator;
                    this._cmb2.selectedValue = c2.operator;
                    if (this._val1 instanceof wijmo.input.ComboBox) {
                        this._val1.text = wijmo.changeType(c1.value, 1 /* String */, null);
                        this._val2.text = wijmo.changeType(c2.value, 1 /* String */, null);
                    } else {
                        this._val1.value = c1.value;
                        this._val2.value = c2.value;
                    }

                    // initialize and/or buttons
                    this._btnAnd.checked = this._filter.and;
                    this._btnOr.checked = !this._filter.and;
                };

                /**
                * Updates filter to reflect the current editor values.
                */
                ConditionFilterEditor.prototype.updateFilter = function () {
                    // initialize conditions
                    var col = this._filter.column, c1 = this._filter.condition1, c2 = this._filter.condition2;
                    c1.operator = this._cmb1.selectedValue;
                    c2.operator = this._cmb2.selectedValue;
                    if (this._val1 instanceof wijmo.input.ComboBox) {
                        // store condition values to the types specified by the column, except for
                        // time values, which are dates but must be stored as strings (TFS 123969)
                        var dt = col.dataType == 4 /* Date */ ? 1 /* String */ : col.dataType;
                        c1.value = wijmo.changeType(this._val1.text, dt, col.format);
                        c2.value = wijmo.changeType(this._val2.text, dt, col.format);
                    } else {
                        c1.value = this._val1.value;
                        c2.value = this._val2.value;
                    }

                    // initialize and/or operator
                    this._filter.and = this._btnAnd.checked;
                };

                // ** implementation
                // create operator combo
                ConditionFilterEditor.prototype._createOperatorCombo = function (element) {
                    // get operator list based on column data type
                    var col = this._filter.column, list = wijmo.culture.FlexGridFilter.stringOperators;
                    if (col.dataType == 4 /* Date */ && !this._isTimeFormat(col.format)) {
                        list = wijmo.culture.FlexGridFilter.dateOperators;
                    } else if (col.dataType == 2 /* Number */ && !col.dataMap) {
                        list = wijmo.culture.FlexGridFilter.numberOperators;
                    } else if (col.dataType == 3 /* Boolean */ && !col.dataMap) {
                        list = wijmo.culture.FlexGridFilter.booleanOperators;
                    }

                    // create and initialize the combo
                    var cmb = new wijmo.input.ComboBox(element);
                    cmb.itemsSource = list;
                    cmb.displayMemberPath = 'name';
                    cmb.selectedValuePath = 'op';

                    // return combo
                    return cmb;
                };

                // create operator input
                ConditionFilterEditor.prototype._createValueInput = function (element) {
                    var col = this._filter.column, ctl = null;
                    if (col.dataType == 4 /* Date */ && !this._isTimeFormat(col.format)) {
                        ctl = new wijmo.input.InputDate(element);
                        ctl.format = col.format;
                    } else if (col.dataType == 2 /* Number */ && !col.dataMap) {
                        ctl = new wijmo.input.InputNumber(element);
                        ctl.format = col.format;
                    } else {
                        ctl = new wijmo.input.ComboBox(element);
                        if (col.dataMap) {
                            ctl.itemsSource = col.dataMap.getDisplayValues();
                            ctl.isEditable = true;
                        } else if (col.dataType == 3 /* Boolean */) {
                            ctl.itemsSource = [true, false];
                        }
                    }
                    ctl.required = false;
                    return ctl;
                };

                // checks whether a format represents a time (and not just a date)
                ConditionFilterEditor.prototype._isTimeFormat = function (fmt) {
                    if (!fmt)
                        return false;
                    fmt = wijmo.culture.Globalize.calendar.patterns[fmt] || fmt;
                    return /[Hmst]+/.test(fmt);
                };

                // update and/or buttons
                ConditionFilterEditor.prototype._btnAndOrChanged = function (e) {
                    this._btnAnd.checked = e.target == this._btnAnd;
                    this._btnOr.checked = e.target == this._btnOr;
                };
                ConditionFilterEditor.controlTemplate = '<div>' + '<div wj-part="div-hdr"></div>' + '<div wj-part="div-cmb1"></div><br/>' + '<div wj-part="div-val1"></div><br/>' + '<div style="text-align:center">' + '<label><input wj-part="btn-and" type="radio"> <span wj-part="sp-and"></span> </label>&nbsp;&nbsp;&nbsp;' + '<label><input wj-part="btn-or" type="radio"> <span wj-part="sp-or"></span> </label>' + '</div>' + '<div wj-part="div-cmb2"></div><br/>' + '<div wj-part="div-val2"></div><br/>' + '</div>';
                return ConditionFilterEditor;
            })(wijmo.Control);
            _filter.ConditionFilterEditor = ConditionFilterEditor;
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ConditionFilterEditor.js.map

var wijmo;
(function (wijmo) {
    (function (grid) {
        (function (filter) {
            'use strict';

            /**
            * Defines a filter condition.
            *
            * This class is used by the @see:FlexGridFilter class; you will rarely have to use it directly.
            */
            var FilterCondition = (function () {
                function FilterCondition() {
                    this._op = null;
                }
                Object.defineProperty(FilterCondition.prototype, "operator", {
                    /**
                    * Gets or sets the operator used by this @see:FilterCondition.
                    */
                    get: function () {
                        return this._op;
                    },
                    set: function (value) {
                        this._op = wijmo.asEnum(value, Operator, true);
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FilterCondition.prototype, "value", {
                    /**
                    * Gets or sets the value used by this @see:FilterCondition.
                    */
                    get: function () {
                        return this._val;
                    },
                    set: function (value) {
                        this._val = value;
                        this._strVal = wijmo.isString(value) ? value.toString().toLowerCase() : null;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FilterCondition.prototype, "isActive", {
                    /**
                    * Gets a value indicating whether the condition is active.
                    */
                    get: function () {
                        switch (this._op) {
                            case null:
                                return false;

                            case 0 /* EQ */:
                            case 1 /* NE */:
                                return true;

                            default:
                                return this._val != null || this._strVal != null;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Clears the condition.
                */
                FilterCondition.prototype.clear = function () {
                    this.operator = null;
                    this.value = null;
                };

                /**
                * Returns a value that determines whether the given value passes this
                * @see:FilterCondition.
                *
                * @param value The value to test.
                */
                FilterCondition.prototype.apply = function (value) {
                    // use lower-case strings for all operations
                    var val = this._strVal || this._val;
                    if (wijmo.isString(value)) {
                        value = value.toLowerCase();
                    }

                    switch (this._op) {
                        case null:
                            return true;
                        case 0 /* EQ */:
                            return wijmo.isDate(value) && wijmo.isDate(val) ? wijmo.DateTime.sameDate(value, val) : value == val;
                        case 1 /* NE */:
                            return value != val;
                        case 2 /* GT */:
                            return value > val;
                        case 3 /* GE */:
                            return value >= val;
                        case 4 /* LT */:
                            return value < val;
                        case 5 /* LE */:
                            return value <= val;
                        case 6 /* BW */:
                            return this._strVal && wijmo.isString(value) ? value.indexOf(this._strVal) == 0 : false;
                        case 7 /* EW */:
                            return this._strVal && wijmo.isString(value) && value.length >= this._strVal.length ? value.substr(value.length - this._strVal.length) == val : false;
                        case 8 /* CT */:
                            return this._strVal && wijmo.isString(value) ? value.indexOf(this._strVal) > -1 : false;
                        case 9 /* NC */:
                            return this._strVal && wijmo.isString(value) ? value.indexOf(this._strVal) < 0 : false;
                    }
                    throw 'Unknown operator';
                };
                return FilterCondition;
            })();
            filter.FilterCondition = FilterCondition;

            /**
            * Specifies filter condition operators.
            */
            (function (Operator) {
                /** Equals. */
                Operator[Operator["EQ"] = 0] = "EQ";

                /** Does not equal. */
                Operator[Operator["NE"] = 1] = "NE";

                /** Greater than. */
                Operator[Operator["GT"] = 2] = "GT";

                /** Greater than or equal to. */
                Operator[Operator["GE"] = 3] = "GE";

                /** Less than. */
                Operator[Operator["LT"] = 4] = "LT";

                /** Less than or equal to. */
                Operator[Operator["LE"] = 5] = "LE";

                /** Begins with. */
                Operator[Operator["BW"] = 6] = "BW";

                /** Ends with. */
                Operator[Operator["EW"] = 7] = "EW";

                /** Contains. */
                Operator[Operator["CT"] = 8] = "CT";

                /** Does not contain. */
                Operator[Operator["NC"] = 9] = "NC";
            })(filter.Operator || (filter.Operator = {}));
            var Operator = filter.Operator;
        })(grid.filter || (grid.filter = {}));
        var filter = grid.filter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FilterCondition.js.map

