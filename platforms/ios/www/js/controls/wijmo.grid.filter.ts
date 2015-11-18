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
/**
 * Extension that provides an Excel-style filtering UI for @see:FlexGrid controls.
 */
module wijmo.grid.filter {
    'use strict';

    /**
     * Specifies types of column filter.
     */
    export enum FilterType {
        /** No filter. */
        None = 0,
        /** A filter based on two conditions. */
        Condition = 1,
        /** A filter based on a set of values. */
        Value = 2,
        /** A filter that combines condition and value filters. */
        Both = 3
    }

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
    export class FlexGridFilter {
        static _WJA_FILTER = 'wj-filter';

        // members
        private _grid: FlexGrid;
        private _filters: ColumnFilter[];
        private _filterColumns: string[];
        private _divEdt: HTMLElement;
        private _edtCol: Column;
        private _showIcons = true;
        private _showSort = true;
        private _defFilterType = FilterType.Both;

        /**
         * Initializes a new instance of the @see:FlexGridFilter.
         *
         * @param grid The @see:FlexGrid to filter.
         */
        constructor(grid: FlexGrid) {

            // check dependencies
            var depErr = 'Missing dependency: FlexGridFilter requires ';
            assert(wijmo.grid.FlexGrid != null, depErr + 'wijmo.grid.');
            assert(wijmo.input.ComboBox != null, depErr + 'wijmo.input.');

            // initialize filter
            this._filters = [];
            this._grid = asType(grid, FlexGrid, false);
            this._grid.formatItem.addHandler(this._formatItem.bind(this));
            this._grid.itemsSourceChanged.addHandler(this.clear.bind(this));
            this._grid.hostElement.addEventListener('mousedown', this._mouseDown.bind(this), true);

            // initialize column filters
            this._grid.invalidate();
        }
        /**
         * Gets a reference to the @see:FlexGrid that owns this filter.
         */
        get grid(): FlexGrid {
            return this._grid;
        }
        /**
         * Gets or sets a value indicating whether the @see:FlexGridFilter adds filter
         * editing buttons to the grid's column headers.
         *
         * If you set this property to false, then you are responsible for providing
         * a way for users to edit, clear, and apply the filters.
         */
        get showFilterIcons(): boolean {
            return this._showIcons;
        }
        set showFilterIcons(value: boolean) {
            if (value != this.showFilterIcons) {
                this._showIcons = asBoolean(value);
                if (this._grid) {
                    this._grid.invalidate();
                }
            }
        }
        /**
         * Gets or sets a value indicating whether the filter editor should include
         * sort buttons.
         *
         * By default, the editor shows sort buttons like Excel does. But since users
         * can sort columns by clicking their headers, sort buttons in the filter editor
         * may not be desirable in some circumstances.
         */
        get showSortButtons(): boolean {
            return this._showSort;
        }
        set showSortButtons(value: boolean) {
            this._showSort = asBoolean(value);
        }
        /**
         * Gets the filter for the given column.
         *
         * @param col The @see:Column that the filter applies to (or column name or index).
         * @param create Whether to create the filter if it does not exist.
         */
        getColumnFilter(col: any, create = true): ColumnFilter {

            // get the column by name or index, check type
            if (isString(col)) {
                col = this._grid.columns.getColumn(col);
            } else if (isNumber(col)) {
                col = this._grid.columns[col];
            }
            col = asType(col, Column);

            // look for the filter
            for (var i = 0; i < this._filters.length; i++) {
                if (this._filters[i].column == col) {
                    return this._filters[i];
                }
            }

            // not found, create one now
            if (create && col.binding) {
                var cf = new ColumnFilter(this, col);
                this._filters.push(cf);
                return cf;
            }

            // not found, not created
            return null;
        }
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
        get defaultFilterType(): FilterType {
            return this._defFilterType;
        }
        set defaultFilterType(value: FilterType) {
            if (value != this.defaultFilterType) {
                this._defFilterType = asEnum(value, FilterType, false);
                this._grid.invalidate();
                this.clear();
            }
        }
        /**
         * Gets or sets the current filter definition as a JSON string.
         */
        get filterDefinition(): string {
            var def = {
                defaultFilterType: this.defaultFilterType,
                filters: []
            }
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
        }
        set filterDefinition(value: string) {
            var def = JSON.parse(asString(value));
            this.clear();
            this.defaultFilterType = def.defaultFilterType;
            for (var i = 0; i < def.filters.length; i++) {
                var cfs = def.filters[i],
                    col = this._grid.columns.getColumn(cfs.binding),
                    cf = this.getColumnFilter(col, true);
                if (cf) {
                    switch (cfs.type) {
                        case 'condition':
                            var cfc = cf.conditionFilter,
                                val = changeType(cfs.condition1.value, col.dataType, col.format);
                            cfc.condition1.value = val ? val : cfs.condition1.value; // TFS 125144 (to handle times)
                            cfc.condition1.operator = cfs.condition1.operator;
                            cfc.and = cfs.and;
                            val = changeType(cfs.condition2.value, col.dataType, col.format);
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
        }
        /**
         * Gets the current filter definition as an OData string.
         */
        getODataFilterDefinition(): string {
            return this._asOData();
        }
        /**
         * Shows the filter editor for the given grid column.
         *
         * @param col The @see:Column that contains the filter to edit.
         */
        editColumnFilter(col: any) {

            // remove current editor
            this.closeEditor();

            // get column by name of by reference
            col = isString(col)
                ? this._grid.columns.getColumn(col)
                : asType(col, Column, false);

            // raise filterChanging event
            var e = new CellRangeEventArgs(this._grid.cells, new CellRange(-1, col.index));
            this.onFilterChanging(e);
            if (e.cancel) {
                return;
            }
            e.cancel = true; // assume the changes will be canceled

            // get the header cell to position editor
            var ch = this._grid.columnHeaders,
                rc = ch.getCellBoundingRect(ch.rows.length - 1, col.index);

            // get the filter and the editor
            var div = document.createElement('div'),
                flt = this.getColumnFilter(col),
                edt = new ColumnFilterEditor(div, flt, this.showSortButtons);
            addClass(div, 'wj-dropdown-panel');

            // handle RTL
            var rtl = getComputedStyle(this._grid.hostElement).direction == 'rtl';
            if (rtl) {
                div.dir = 'rtl';
            }

            // apply filter when it changes
            var self = this;
            edt.filterChanged.addHandler(function () {
                e.cancel = false; // the changes were not canceled
                setTimeout(function () { // apply after other handlers have been called
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
                    var ctl = Control.getControl(self._divEdt);
                    if (ctl && !ctl.containsFocus()) {
                        self.closeEditor();
                    }
                }, 10); //200); // let others handle it first
            });

            // show editor and give it focus
            var host = document.body;
            host.appendChild(div);
            showPopup(div, rc);
            edt.focus();

            // save reference to editor
            this._divEdt = div;
            this._edtCol = col;
        }
        /**
         * Closes the filter editor.
         */
        closeEditor() {
            if (this._divEdt) {
                hidePopup(this._divEdt, true); // remove editor from DOM
                var edt = Control.getControl(this._divEdt);
                if (edt) { // dispose of editor to avoid memory leaks
                    edt.dispose();
                }
                this._divEdt = null;
                this._edtCol = null;
            }
        }
        /**
         * Applies the current column filters to the grid.
         */
        apply() {
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
                var odataView = tryCast(cv, wijmo.odata.ODataCollectionView);
                if (odataView && odataView.filterOnServer) {
                    odataView.filterDefinition = this.getODataFilterDefinition();
                }
            }

            // and fire the event
            this.onFilterApplied();
        }
        /**
         * Clears all column filters.
         */
        clear() {
            if (this._filters.length) {
                this._filters = [];
                this.apply();
            }
        }
        /**
         * Occurs after the filter is applied.
         */
        filterApplied = new Event();
        /**
         * Raises the @see:filterApplied event.
         */
        onFilterApplied(e?: EventArgs) {
            this.filterApplied.raise(this, e);
        }
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
        filterChanging = new Event();
        /**
         * Raises the @see:filterChanging event.
         */
        onFilterChanging(e: CellRangeEventArgs) {
            this.filterChanging.raise(this, e);
        }
        /**
         * Occurs after a column filter has been edited by the user.
         *
         * Use the event parameters to determine the column that owns
         * the filter and whether changes were applied or canceled.
         */
        filterChanged = new Event();
        /**
         * Raises the @see:filterChanged event.
         */
        onFilterChanged(e: CellRangeEventArgs) {
            this.filterChanged.raise(this, e);
        }

        // ** implementation

        // predicate function used to filter the CollectionView
        private _filter(item: any): boolean {
            for (var i = 0; i < this._filters.length; i++) {
                if (!this._filters[i].apply(item)) {
                    return false;
                }
            }
            return true;
        }

        // handle the formatItem event to add filter icons to the column header cells
        private _formatItem(sender: FlexGrid, e: FormatItemEventArgs) {

            // check that this is a filter cell
            if (e.panel.cellType == CellType.ColumnHeader &&
                e.row == this._grid.columnHeaders.rows.length - 1) {

                // check that this column should have a filter
                var col = this._grid.columns[e.col],
                    cf = this.getColumnFilter(col, this.defaultFilterType != FilterType.None);
                if (cf && cf.filterType != FilterType.None) {

                    // handle RTL
                    var rtl = getComputedStyle(this._grid.hostElement).direction == 'rtl';

                    // show filter glyph for this column
                    if (this._showIcons) {
                        var filterGlyph = '<div ' + FlexGridFilter._WJA_FILTER +
                            ' style ="float:' + (rtl ? 'left' : 'right') +' ;cursor:pointer;padding:0px 4px">' +
                            '<span class="wj-glyph-filter"></span>' +
                            '</div>';
                        e.cell.innerHTML = filterGlyph + e.cell.innerHTML;
                    }

                    // update filter classes
                    toggleClass(e.cell, 'wj-filter-on', cf.isActive);
                    toggleClass(e.cell, 'wj-filter-off', !cf.isActive);

                } else {

                    // remove filter classes
                    removeClass(e.cell, 'wj-filter-on');
                    removeClass(e.cell, 'wj-filter-off');
                }
            }
        }

        // handle mouse down to show/hide the filter editor
        _mouseDown(e) {
            if (this._hasAttribute(e.target, FlexGridFilter._WJA_FILTER)) {
                var ht = this._grid.hitTest(e);
                if (ht.panel == this._grid.columnHeaders) {
                    var col = this._grid.columns[ht.col],
                        self = this;
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
        }

        // checks whether an element or any of its ancestors contains an attribute
        _hasAttribute(e: any, att: string) {
            for (; e; e = e.parentNode) {
                if (e.getAttribute && e.getAttribute(att) != null) return true;
            }
            return false;
        }

        // gets the filter definition as an OData filter string
        // http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
        private _asOData(): string {
            var def = '';
            for (var c = 0; c < this.grid.columns.length; c++) {
                var col = this.grid.columns[c],
                    cf = this.getColumnFilter(col, false);
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
        }
        private _asODataValueFilter(vf: ValueFilter): string {
            var col = vf.column,
                fld = col.binding,
                val = '';
            for (var key in vf.showValues) {
                var value = wijmo.changeType(key, col.dataType, col.format);
                if (val) val += ' or ';
                val += '(' + fld + ' eq ' + this._asODataValue(value, col.dataType) + ')';
            }
            return '(' + val + ')';
        }
        private _asODataConditionFilter(cf: ConditionFilter): string {
            var val = this._asODataCondition(cf, cf.condition1);
            if (cf.condition2.operator != null) {
                val += (cf.and ? ' and ' : ' or ') + this._asODataCondition(cf, cf.condition2);
            }
            return '(' + val + ')';
        }
        private _asODataCondition(cf: ConditionFilter, cond: FilterCondition): string {
            var fld = cf.column.binding,
                val = this._asODataValue(cond.value, cf.column.dataType);
            switch (cond.operator) {
                case 0: // EQ = 0, 
                    return fld + ' eq ' + val;
                case 1: // NE = 1,
                    return fld + ' ne ' + val;
                case 2: // GT = 2, 
                    return fld + ' gt ' + val;
                case 3: // GE = 3, 
                    return fld + ' gt ' + val;
                case 4: // LT = 4, 
                    return fld + ' lt ' + val;
                case 5: // LE = 5, 
                    return fld + ' le ' + val;
                case 6: // BW = 6, 
                    return 'startswith(' + fld + ',' + val + ')';
                case 7: // EW = 7, 
                    return 'endswith(' + fld + ',' + val + ')';
                case 8: // CT = 8, 
                    return 'indexof(' + fld + ',' + val + ') gt -1';
                case 9: // NC = 9 
                    return 'indexof(' + fld + ',' + val + ') lt 0';
            }
        }
        private _asODataValue(val: any, dataType: DataType): string {
            if (isString(val)) {
                return "'" + val.replace(/'/g, "\'") + "'";
            } else if (isDate(val)) {
                return "datetime'" + val.toISOString() + "'";
            } else if (val != null) {
                return val.toString();
            }
            return dataType == DataType.String ? "''" : null;
        }
    }
}
module wijmo.grid.filter {
    'use strict';

    /**
     * Defines a filter for a column on a @see:FlexGrid control.
     *
     * This class is used by the @see:FlexGridFilter class; you 
     * rarely use it directly.
     */
    export interface IColumnFilter {
        column: Column;
        isActive: boolean;
        apply(value): boolean;
        clear(): void;
    }
}
module wijmo.grid.filter {
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
    export class ColumnFilter implements IColumnFilter {
        private _owner: FlexGridFilter;
        private _col: Column;
        private _valueFilter: ValueFilter;
        private _conditionFilter: ConditionFilter;
        private _filterType: FilterType;

        /**
         * Initializes a new instance of a @see:ColumnFilter.
         *
         * @param owner The @see:FlexGridFilter that owns this column filter.
         * @param column The @see:Column to filter.
         */
        constructor(owner: FlexGridFilter, column: Column) {
            this._owner = owner;
            this._col = column;
            this._valueFilter = new ValueFilter(column);
            this._conditionFilter = new ConditionFilter(column);
        }

        /**
         * Gets or sets the types of filtering provided by this filter.
         *
         * Setting this property to null causes the filter to use the value
         * defined by the owner filter's @see:defaultFilterType property.
         */
        get filterType() : FilterType {
            return this._filterType != null ? this._filterType : this._owner.defaultFilterType;
        }
        set filterType(value: FilterType) {
            if (value != this._filterType) {
                var wasActive = this.isActive;
                this.clear();
                this._filterType = asEnum(value, FilterType, true);
                if (wasActive) {
                    this._owner.apply();
                } else if (this._col.grid) {
                    this._col.grid.invalidate();
                }
            }
        }
        /**
         * Gets the @see:ValueFilter in this @see:ColumnFilter.
         */
        get valueFilter() : ValueFilter {
            return this._valueFilter;
        }
        /**
         * Gets the @see:ConditionFilter in this @see:ColumnFilter.
         */
        get conditionFilter() : ConditionFilter {
            return this._conditionFilter;
        }

        // ** IColumnFilter

        /**
         * Gets the @see:Column being filtered.
         */
        get column(): Column {
            return this._col;
        }
        /**
         * Gets a value indicating whether the filter is active.
         */
        get isActive(): boolean {
            return this._conditionFilter.isActive || this._valueFilter.isActive;
        }
        /**
         * Gets a value indicating whether a value passes the filter.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
        }
        /**
         * Clears the filter.
         */
        clear() {
            this._valueFilter.clear();
            this._conditionFilter.clear();
        }

        // ** IQueryInterface

        /**
         * Returns true if the caller queries for a supported interface.
         *
         * @param interfaceName Name of the interface to look for.
         */
        implementsInterface(interfaceName: string): boolean {
            return interfaceName == 'IColumnFilter';
        }
    }
}

module wijmo.grid.filter {
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
            { name: 'Equals', op: Operator.EQ },
            { name: 'Does not equal', op: Operator.NE },
            { name: 'Begins with', op: Operator.BW },
            { name: 'Ends with', op: Operator.EW },
            { name: 'Contains', op: Operator.CT },
            { name: 'Does not contain', op: Operator.NC }
        ],
        numberOperators: [
            { name: '(not set)', op: null },
            { name: 'Equals', op: Operator.EQ },
            { name: 'Does not equal', op: Operator.NE },
            { name: 'Is Greater than', op: Operator.GT },
            { name: 'Is Greater than or equal to', op: Operator.GE },
            { name: 'Is Less than', op: Operator.LT },
            { name: 'Is Less than or equal to', op: Operator.LE }
        ],
        dateOperators: [
            { name: '(not set)', op: null },
            { name: 'Equals', op: Operator.EQ },
            { name: 'Is Before', op: Operator.LT },
            { name: 'Is After', op: Operator.GT }
        ],
        booleanOperators: [
            { name: '(not set)', op: null },
            { name: 'Equals', op: Operator.EQ },
            { name: 'Does not equal', op: Operator.NE }
        ]
    };

    /**
     * The editor used to inspect and modify column filters.
     *
     * This class is used by the @see:FlexGridFilter class; you 
     * rarely use it directly.
     */
    export class ColumnFilterEditor extends Control {
        private _filter: ColumnFilter;
        private _edtVal: ValueFilterEditor;
        private _edtCnd: ConditionFilterEditor;

        private _divSort: HTMLElement;
        private _btnAsc: HTMLInputElement;
        private _btnDsc: HTMLInputElement;
        private _divType: HTMLInputElement;
        private _aCnd: HTMLLinkElement;
        private _aVal: HTMLLinkElement;
        private _divEdtVal: HTMLElement;
        private _divEdtCnd: HTMLElement;
        private _btnApply: HTMLLinkElement;
        private _btnClear: HTMLLinkElement;

        /**
         * Gets or sets the template used to instantiate @see:ColumnFilterEditor controls.
         */
        static controlTemplate = '<div>' +
            '<div wj-part="div-sort">' +
                '<a wj-part="btn-asc" href="" style="min-width:95px"></a>&nbsp;&nbsp;&nbsp;' +
                '<a wj-part="btn-dsc" href="" style="min-width:95px"></a>' +
            '</div>' +
            '<div style="text-align:right;margin:10px 0px;font-size:80%">' +
                '<div wj-part="div-type">' +
                    '<a wj-part="a-cnd" href="" tab-index="-1"></a>' + 
                    '&nbsp;|&nbsp;' +
                    '<a wj-part="a-val" href="" tab-index="-1"></a>' + 
                '</div>' +
            '</div>' +
            '<div wj-part="div-edt-val"></div>' +
            '<div wj-part="div-edt-cnd"></div>' +
            '<div style="text-align:right;margin-top:10px">' +
                '<a wj-part="btn-apply" href=""></a>&nbsp;&nbsp;' +
                '<a wj-part="btn-clear" href=""></a>' +
            '</div>';
        '</div>';

        /**
         * Initializes a new instance of the @see:ColumnFilterEditor.
         *
         * @param element The DOM element that hosts the control, or a selector 
         * for the host element (e.g. '#theCtrl').
         * @param filter The @see:ColumnFilter to edit.
         * @param sortButtons Whether to show sort buttons in the editor.
         */
        constructor(element: any, filter: ColumnFilter, sortButtons = true) {
            super(element);

            // save reference to filter being edited
            this._filter = asType(filter, ColumnFilter);

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
            var ft = (this.filter.conditionFilter.isActive || (filter.filterType & FilterType.Value) == 0)
                ? FilterType.Condition
                : FilterType.Value;
            this._showFilter(ft);

            // hide sort buttons if the collection view is not sortable
            // or if the user doesn't want them
            var col = this.filter.column,
                view = col.grid.collectionView;
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
                    case Key.Enter:
                        switch ((<HTMLElement>e.target).tagName) {
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
                    case Key.Escape:
                        self.onButtonClicked();
                        e.preventDefault();
                        break;
                }
            });
        }

        /**
         * Gets a reference to the @see:ColumnFilter being edited.
         */
        get filter(): ColumnFilter {
            return this._filter;
        }
        /**
         * Updates editor with current filter settings.
         */
        updateEditor() {
            if (this._edtVal) {
                this._edtVal.updateEditor();
            }
            if (this._edtCnd) {
                this._edtCnd.updateEditor();
            }
        }
        /**
         * Updates filter to reflect the current editor values.
         */
        updateFilter() {
            switch (this._getFilterType()) {
                case FilterType.Value:
                    this._edtVal.updateFilter();
                    this.filter.conditionFilter.clear();
                    break;
                case FilterType.Condition:
                    this._edtCnd.updateFilter();
                    this.filter.valueFilter.clear();
                    break;
            }
        }
        /**
         * Occurs after the filter is modified.
         */
        filterChanged = new Event();
        /**
         * Raises the @see:filterChanged event.
         */
        onFilterChanged(e?: EventArgs) {
            this.filterChanged.raise(this, e);
        }
        /**
         * Occurs when one of the editor buttons is clicked.
         */
        buttonClicked = new Event();
        /**
         * Raises the @see:buttonClicked event.
         */
        onButtonClicked(e?: EventArgs) {
            this.buttonClicked.raise(this, e);
        }

        // ** implementation

        // shows the value or filter editor
        private _showFilter(filterType: FilterType) {

            // create editor if we have to
            if (filterType == FilterType.Value && this._edtVal == null) {
                this._edtVal = new ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
            }
            if (filterType == FilterType.Condition && this._edtCnd == null) {
                this._edtCnd = new ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
            }

            // show selected editor
            if ((filterType & this.filter.filterType) != 0) {
                if (filterType == FilterType.Value) {
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

            // hide switch button if only one filter type is supported
            switch (this.filter.filterType) {
                case FilterType.None:
                case FilterType.Condition:
                case FilterType.Value:
                    this._divType.style.display = 'none';
                    break;
                default: 
                    this._divType.style.display = '';
                    break;
            }
        }

        // enable/disable filter switch links
        _enableLink(a: HTMLLinkElement, enable: boolean) {
            a.style.textDecoration = enable ? '' : 'none';
            a.style.fontWeight = enable ? '' : 'bold';
            if (enable) {
                a.href = '';
            } else {
                a.removeAttribute('href');
            }
        }


        // gets the type of filter currently being edited
        private _getFilterType() : FilterType {
            return this._divEdtVal.style.display != 'none' 
                ? FilterType.Value 
                : FilterType.Condition;
        }

        // handle buttons
        private _btnClicked(e) {
            e.preventDefault();
            e.stopPropagation();

            // ignore disabled elements
            if (hasClass(e.target, 'wj-state-disabled')) {
                return;
            }

            // switch filters
            if (e.target == this._aVal) {
                this._showFilter(FilterType.Value);
                this._edtVal.focus();
                return;
            }
            if (e.target == this._aCnd) {
                this._showFilter(FilterType.Condition);
                this._edtCnd.focus();
                return;
            }

            // apply sort
            if (e.target == this._btnAsc || e.target == this._btnDsc) {
                var col = this.filter.column,
                    binding = col.sortMemberPath ? col.sortMemberPath : col.binding,
                    view = col.grid.collectionView,
                    sortDesc = new wijmo.collections.SortDescription(binding, e.target == this._btnAsc);
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
        }
    }
}
module wijmo.grid.filter {
    'use strict';

    /**
     * Defines a value filter for a column on a @see:FlexGrid control.
     *
     * Value filters contain an explicit list of values that should be 
     * displayed by the grid.
     */
    export class ValueFilter implements IColumnFilter {
        private _col: Column;
        private _bnd: Binding;
        private _values: any;
        private _filterText: string;
        private _maxValues = 250;
        private _uniqueValues: any[];

        /**
         * Initializes a new instance of a @see:ValueFilter.
         *
         * @param column The column to filter.
         */
        constructor(column: Column) {
            this._col = column;
            this._bnd = column.binding ? new Binding(column.binding) : null;
        }
        /**
         * Gets or sets an object with all the formatted values that should be shown on the value list.
         */
        get showValues(): any {
            return this._values;
        }
        set showValues(value: any) {
            this._values = value;
        }
        /**
         * Gets or sets a string used to filter the list of display values.
         */
        get filterText(): string {
            return this._filterText;
        }
        set filterText(value: string) {
            this._filterText = asString(value);
        }
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
        get maxValues(): number {
            return this._maxValues;
        }
        set maxValue(value: number) {
            this._maxValues = asNumber(value, false, true);
        }
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
        get uniqueValues(): any[] {
            return this._uniqueValues;
        }
        set uniqueValues(value: any[]) {
            this._uniqueValues = asArray(value);
        }

        // ** IColumnFilter

        /**
         * Gets the @see:Column to filter.
         */
        get column(): Column {
            return this._col;
        }
        /**
         * Gets a value indicating whether the filter is active.
         *
         * The filter is active if there is at least one value is selected.
         */
        get isActive(): boolean {
            return this._values != null;
        }
        /**
         * Gets a value indicating whether a value passes the filter.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            var col = this.column;

            // no binding or no values? accept everything
            if (!col.binding || !this._values || !Object.keys(this._values).length) {
                return true;
            }

            // retrieve the formatted value
            value = this._bnd.getValue(value);
            value = col.dataMap
                ? col.dataMap.getDisplayValue(value)
                : Globalize.format(value, col.format);

            // apply conditions
            return this._values[value] != undefined;
        }
        /**
         * Clears the filter.
         */
        clear() {
            this.showValues = null;
            this.filterText = null;
        }

        // ** IQueryInterface

        /**
         * Returns true if the caller queries for a supported interface.
         *
         * @param interfaceName Name of the interface to look for.
         */
        implementsInterface(interfaceName: string): boolean {
            return interfaceName == 'IColumnFilter';
        }
    }
}
module wijmo.grid.filter {
    'use strict';

    /**
     * The editor used to inspect and modify @see:ValueFilter objects.
     *
     * This class is used by the @see:FlexGridFilter class; you 
     * rarely use it directly.
     */
    export class ValueFilterEditor extends Control {
        private _divFilter: HTMLElement;
        private _cmbFilter: wijmo.input.ComboBox;
        private _cbSelectAll: HTMLInputElement;
        private _spSelectAll: HTMLElement;
        private _divValues: HTMLElement;
        private _lbValues: wijmo.input.ListBox;

        private _filter: ValueFilter;
        private _toText: number;
        private _filterText: string;
        private _view: wijmo.collections.CollectionView;

        /**
         * Gets or sets the template used to instantiate @see:ColumnFilterEditor controls.
         */
        static controlTemplate = '<div>' +
            '<div wj-part="div-filter"></div>' +
            '<br/>' +
            '<label style="margin-left:11px">' + 
                '<input wj-part="cb-select-all" type="checkbox"> ' + 
                '<span wj-part="sp-select-all"></span>' +
            '</label>' +
            '<br/>' +
            '<div wj-part="div-values" class="wj-dropdown" style="height:150px"></div>' +
        '</div>';

        /**
         * Initializes a new instance of the @see:ValueFilterEditor.
         *
         * @param element The DOM element that hosts the control, or a selector 
         * for the host element (e.g. '#theCtrl').
         * @param filter The @see:ValueFilter to edit.
         */
        constructor(element: any, filter: ValueFilter) {
            super(element);

            // save reference to filter
            this._filter = asType(filter, ValueFilter, false);

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

        /**
         * Gets a reference to the @see:ValueFilter being edited.
         */
        get filter(): ValueFilter {
            return this._filter;
        }
        /**
         * Updates editor with current filter settings.
         */
        updateEditor() {
            var col = this._filter.column,
                values = [];

            // get list of uniquw values
            if (this._filter.uniqueValues) {  // explicit list provided
                var uvalues = this._filter.uniqueValues;
                for (var i = 0; i < uvalues.length; i++) {
                    var value = uvalues[i];
                    values.push({ value: value, text: value.toString()});
                }
            } else { // list not provided, get from data
                var keys = {},
                    view = col.grid.collectionView,
                    src = view ? view.sourceCollection : [];
                for (var i = 0; i < src.length; i++) {
                    var value = col._binding.getValue(src[i]),
                        text = col.dataMap ? col.dataMap.getDisplayValue(value) : Globalize.format(value, col.format);
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
        }
        /**
         * Updates filter to reflect the current editor values.
         */
        updateFilter() {

            // build list of values to show
            var showValues = {},
                items = this._view.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.show) {
                    showValues[item.text] = true;
                }
            }

            // save to filter
            this._filter.showValues = showValues;
            this._filter.filterText = this._filterText;
        }

        // ** implementation

        // filter items on the list
        private _filterTextChanged() {
            var self = this;
            if (self._toText) {
                clearTimeout(self._toText);
            }
            self._toText = setTimeout(function () {

                // apply the filter
                var filter = self._cmbFilter.text.toLowerCase();
                if (filter != self._filterText) { // TFS 128910
                    self._filterText = filter;
                    self._view.refresh();

                    // select all items that pass the filter (Excel behavior)
                    self._cbSelectAll.checked = true;
                    self._cbSelectAllClicked();
                }
            }, 500);
        }

        // filter values for display
        private _filterValues(value) {
            if (this._filterText) {
                return value && value.text
                    ? value.text.toLowerCase().indexOf(this._filterText) > -1
                    : false;
            }
            return true;
        }

        // handle clicks on 'Select All' checkbox
        private _cbSelectAllClicked() {
            var checked = this._cbSelectAll.checked,
                values = this._view.items;
            for (var i = 0; i < values.length; i++) {
                values[i].show = checked;
            }
            this._view.refresh();
        }

        // update state of 'Select All' checkbox when values are checked/unchecked
        private _updateSelectAllCheck() {

            // count checked items
            var checked = 0,
                values = this._view.items;
            for (var i = 0; i < values.length; i++) {
                if (values[i].show) checked++;
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
        }
    }
}
module wijmo.grid.filter {
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
    export class ConditionFilter implements IColumnFilter {
        private _col: Column;
        private _bnd: Binding;
        private _c1 = new FilterCondition();
        private _c2 = new FilterCondition();
        private _and = true;

        /**
         * Initializes a new instance of a @see:ConditionFilter.
         *
         * @param column The column to filter.
         */
        constructor(column: Column) {
            this._col = column;
            this._bnd = column.binding ? new Binding(column.binding) : null;
        }
        /**
         * Gets the first condition in the filter.
         */
        get condition1(): FilterCondition {
            return this._c1;
        }
        /**
         * Gets the second condition in the filter.
         */
        get condition2(): FilterCondition {
            return this._c2;
        }
        /**
         * Gets a value indicating whether to combine the two conditions 
         * with an AND or an OR operator.
         */
        get and(): boolean {
            return this._and;
        }
        set and(value: boolean) {
            this._and = asBoolean(value);
            this._bnd = this.column && this.column.binding 
                ? new Binding(this.column.binding)
                : null;
        }

        // ** IColumnFilter

        /**
         * Gets the @see:Column to filter.
         */
        get column(): Column {
            return this._col;
        }
        /**
         * Gets a value indicating whether the filter is active.
         *
         * The filter is active if at least one of the two conditions
         * has its operator and value set to a valid combination.
         */
        get isActive(): boolean {
            return this._c1.isActive || this._c2.isActive;
        }
        /**
         * Returns a value indicating whether a value passes this filter.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            var col = this.column,
                c1 = this.condition1,
                c2 = this.condition2;

            // no binding or not active? accept everything
            if (!col.binding || !this.isActive) {
                return true;
            }

            // retrieve the value
            value = this._bnd.getValue(value);
            if (col.dataMap) {
                value = col.dataMap.getDisplayValue(value);
            } else if (isDate(value)) {
                if (isString(c1.value) || isString(c2.value)) { // comparing times
                    value = Globalize.format(value, col.format);
                }
            } else if (isNumber(value)) { // use same precision for numbers (TFS 124098)
                value = Globalize.parseFloat(Globalize.format(value, col.format));
            }

            // apply conditions
            var rv1 = c1.apply(value),
                rv2 = c2.apply(value);

            // combine results
            if (c1.isActive && c2.isActive) {
                return this._and ? rv1 && rv2 : rv1 || rv2;
            } else {
                return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
            }
        }
        /**
         * Clears the filter.
         */
        clear() {
            this.condition1.clear();
            this.condition2.clear();
            this.and = true;
        }

        // ** IQueryInterface

        /**
         * Returns true if the caller queries for a supported interface.
         *
         * @param interfaceName Name of the interface to look for.
         */
        implementsInterface(interfaceName: string): boolean {
            return interfaceName == 'IColumnFilter';
        }
    }
}
module wijmo.grid.filter {
    'use strict';

    /**
     * The editor used to inspect and modify @see:ConditionFilter objects.
     *
     * This class is used by the @see:FlexGridFilter class; you 
     * rarely use it directly.
     */
    export class ConditionFilterEditor extends Control {
        private  _filter: ConditionFilter;
        private _cmb1: wijmo.input.ComboBox;
        private _val1: any;
        private _cmb2: wijmo.input.ComboBox;
        private _val2: any;

        private _divHdr: HTMLElement;
        private _divCmb1: HTMLElement;
        private _divVal1: HTMLElement;
        private _divCmb2: HTMLElement;
        private _divVal2: HTMLElement;
        private _spAnd: HTMLSpanElement;
        private _spOr: HTMLSpanElement;
        private _btnAnd: HTMLInputElement;
        private _btnOr: HTMLInputElement;

        /**
         * Gets or sets the template used to instantiate @see:ConditionFilterEditor controls.
         */
        static controlTemplate = '<div>' +
            '<div wj-part="div-hdr"></div>' +
            '<div wj-part="div-cmb1"></div><br/>' +
            '<div wj-part="div-val1"></div><br/>' +
            '<div style="text-align:center">' +
                '<label><input wj-part="btn-and" type="radio"> <span wj-part="sp-and"></span> </label>&nbsp;&nbsp;&nbsp;' +
                '<label><input wj-part="btn-or" type="radio"> <span wj-part="sp-or"></span> </label>' +
            '</div>' +
            '<div wj-part="div-cmb2"></div><br/>' +
            '<div wj-part="div-val2"></div><br/>' +
        '</div>';

        /**
         * Initializes a new instance of a @see:ConditionFilterEditor.
         *
         * @param element The DOM element that hosts the control, or a selector 
         * for the host element (e.g. '#theCtrl').
         * @param filter The @see:ConditionFilter to edit.
         */
        constructor(element: any, filter: ConditionFilter) {
            super(element);

            // save reference to filter
            this._filter = asType(filter, ConditionFilter, false);

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
                _divVal2: 'div-val2',
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

        /**
         * Gets a reference to the @see:ConditionFilter being edited.
         */
        get filter(): ConditionFilter {
            return this._filter;
        }
        /**
         * Updates editor with current filter settings.
         */
        updateEditor() {

            // initialize conditions
            var c1 = this._filter.condition1,
                c2 = this._filter.condition2;
            this._cmb1.selectedValue = c1.operator;
            this._cmb2.selectedValue = c2.operator;
            if (this._val1 instanceof wijmo.input.ComboBox) {
                this._val1.text = changeType(c1.value, DataType.String, null);
                this._val2.text = changeType(c2.value, DataType.String, null);
            } else {
                this._val1.value = c1.value;
                this._val2.value = c2.value;
            }

            // initialize and/or buttons
            this._btnAnd.checked = this._filter.and;
            this._btnOr.checked = !this._filter.and;
        }
        /**
         * Updates filter to reflect the current editor values.
         */
        updateFilter() {

            // initialize conditions
            var col = this._filter.column,
                c1 = this._filter.condition1,
                c2 = this._filter.condition2;
            c1.operator = this._cmb1.selectedValue;
            c2.operator = this._cmb2.selectedValue;
            if (this._val1 instanceof wijmo.input.ComboBox) {
                // store condition values to the types specified by the column, except for 
                // time values, which are dates but must be stored as strings (TFS 123969)
                var dt = col.dataType == DataType.Date ? DataType.String : col.dataType;
                c1.value = changeType(this._val1.text, dt, col.format);
                c2.value = changeType(this._val2.text, dt, col.format);
            } else {
                c1.value = this._val1.value;
                c2.value = this._val2.value;
            }

            // initialize and/or operator
            this._filter.and = this._btnAnd.checked;
        }

        // ** implementation

        // create operator combo
        private _createOperatorCombo(element) {

            // get operator list based on column data type
            var col = this._filter.column,
                list = wijmo.culture.FlexGridFilter.stringOperators;
            if (col.dataType == wijmo.DataType.Date && !this._isTimeFormat(col.format)) {
                list = wijmo.culture.FlexGridFilter.dateOperators;
            } else if (col.dataType == wijmo.DataType.Number && !col.dataMap) {
                list = wijmo.culture.FlexGridFilter.numberOperators;
            } else if (col.dataType == wijmo.DataType.Boolean && !col.dataMap) {
                list = wijmo.culture.FlexGridFilter.booleanOperators;
            }

            // create and initialize the combo
            var cmb = new wijmo.input.ComboBox(element);
            cmb.itemsSource = list;
            cmb.displayMemberPath = 'name';
            cmb.selectedValuePath = 'op';

            // return combo
            return cmb;
        }

        // create operator input
        private _createValueInput(element): Control {
            var col = this._filter.column,
                ctl = null;
            if (col.dataType == wijmo.DataType.Date && !this._isTimeFormat(col.format)) {
                ctl = new wijmo.input.InputDate(element);
                ctl.format = col.format;
            } else if (col.dataType == wijmo.DataType.Number && !col.dataMap) {
                ctl = new wijmo.input.InputNumber(element);
                ctl.format = col.format;
            } else {
                ctl = new wijmo.input.ComboBox(element);
                if (col.dataMap) {
                    ctl.itemsSource = col.dataMap.getDisplayValues();
                    ctl.isEditable = true;
                } else if (col.dataType == DataType.Boolean) {
                    ctl.itemsSource = [true, false];
                }
            }
            ctl.required = false;
            return ctl;
        }

        // checks whether a format represents a time (and not just a date)
        private _isTimeFormat(fmt: string): boolean {
            if (!fmt) return false;
            fmt = wijmo.culture.Globalize.calendar.patterns[fmt] || fmt;
            return /[Hmst]+/.test(fmt); // TFS 109409
        }

        // update and/or buttons
        private _btnAndOrChanged(e) {
            this._btnAnd.checked = e.target == this._btnAnd;
            this._btnOr.checked = e.target == this._btnOr;
        }
    }
} 
module wijmo.grid.filter {
    'use strict';

    /**
     * Defines a filter condition.
     *
     * This class is used by the @see:FlexGridFilter class; you will rarely have to use it directly.
     */
    export class FilterCondition {
        private _op: Operator = null;
        private _val: any;
        private _strVal: string;

        /**
         * Gets or sets the operator used by this @see:FilterCondition.
         */
        get operator(): Operator {
            return this._op;
        }
        set operator(value: Operator) {
            this._op = asEnum(value, Operator, true);
        }
        /**
         * Gets or sets the value used by this @see:FilterCondition.
         */
        get value(): any {
            return this._val;
        }
        set value(value: any) {
            this._val = value;
            this._strVal = isString(value) ? value.toString().toLowerCase() : null;
        }
        /**
         * Gets a value indicating whether the condition is active.
         */
        get isActive(): boolean {
            switch (this._op) {

                // no operator
                case null:
                    return false;

                // equals/does not equal do not require a value (can compare to null)
                case Operator.EQ:
                case Operator.NE:
                    return true;

                // other operators require a value
                default:
                    return this._val != null || this._strVal != null;
            }
        }
        /**
         * Clears the condition.
         */
        clear() {
            this.operator = null;
            this.value = null;
        }
        /**
         * Returns a value that determines whether the given value passes this
         * @see:FilterCondition.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            
            // use lower-case strings for all operations
            var val = this._strVal || this._val;
            if (isString(value)) {
                value = value.toLowerCase();
            }

            // apply operator
            switch (this._op) {
                case null:
                    return true;
                case Operator.EQ:
                    return wijmo.isDate(value) && wijmo.isDate(val) ? wijmo.DateTime.sameDate(value, val) : value == val;
                case Operator.NE:
                    return value != val;
                case Operator.GT:
                    return value > val;
                case Operator.GE:
                    return value >= val;
                case Operator.LT:
                    return value < val;
                case Operator.LE:
                    return value <= val;
                case Operator.BW:
                    return this._strVal && isString(value)
                        ? value.indexOf(this._strVal) == 0 
                        : false;
                case Operator.EW:
                    return this._strVal && isString(value) && value.length >= this._strVal.length 
                        ? value.substr(value.length - this._strVal.length) == val
                        : false;
                case Operator.CT:
                    return this._strVal && isString(value)
                        ? value.indexOf(this._strVal) > -1
                        : false;
                case Operator.NC:
                    return this._strVal && isString(value)
                        ? value.indexOf(this._strVal) < 0
                        : false;
            }
            throw 'Unknown operator';
        }
    }
    /**
     * Specifies filter condition operators.
     */
    export enum Operator {
        /** Equals. */
        EQ = 0, 
        /** Does not equal. */
        NE = 1, 
        /** Greater than. */
        GT = 2, 
        /** Greater than or equal to. */
        GE = 3, 
        /** Less than. */
        LT = 4, 
        /** Less than or equal to. */
        LE = 5, 
        /** Begins with. */
        BW = 6, 
        /** Ends with. */
        EW = 7, 
        /** Contains. */
        CT = 8, 
        /** Does not contain. */
        NC = 9 
    }
}
