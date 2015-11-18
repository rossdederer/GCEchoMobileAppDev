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
 * Extension that provides detail rows for @see:FlexGrid controls.
 */
module wijmo.grid.detail {
    'use strict';

    /**
     * Specifies when and how the row details are displayed.
     */
    export enum DetailVisibilityMode {
        /**
         * Details are shown or hidden in code, using the 
         * @see:showDetail and @see:hideDetail methods.
         */
        Code,
        /**
         * Details are shown for the row that is currently selected.
         */
        Selection,
        /**
         * Details are shown or hidden using buttons added to the row headers.
         * Only one row may be expanded at a time.
         */
        ExpandSingle,
        /**
         * Details are shown or hidden using buttons added to the row headers.
         * Multiple rows may be expanded at a time.
         */
        ExpandMulti,
    }

    /**
     * Implements detail rows for @see:FlexGrid controls.
     *
     * To add detail rows to a @see:FlexGrid control, create an instance of a
     * @see:FlexGridDetailProvider and set the @see:createDetailCell property
     * to a function that creates elements to be displayed in the detail cells.
     *
     * For example:
     *
     * <pre>// create FlexGrid to show categories
     * var gridCat = new wijmo.grid.FlexGrid('#gridCat');
     * gridCat.itemsSource = getCategories();
     * // add detail rows showing products in each category
     * var detailProvider = new wijmo.grid.detail.FlexGridDetailProvider(gridCat);
     * detailProvider.createDetailCell = function (row) {
     *   var cell = document.createElement('div');
     *   var gridProducts = new wijmo.grid.FlexGrid(cell);
     *   gridProducts.itemsSource = getProducts(row.dataItem.CategoryID);
     *   return cell;
     * }</pre>
     *
     * The @see:FlexGridDetailProvider provides a @see:detailVisibilityMode property
     * that determines when the detail rows should be displayed. The default value for
     * this property is <b>ExpandSingle</b>, which adds collapse/expand icons to the
     * row headers.
     */
    export class FlexGridDetailProvider {
        _g: FlexGrid;
        _maxHeight: number;
        _mode = DetailVisibilityMode.ExpandSingle;
        _toSel: number;
        _createDetailCellFn: Function;
        _disposeDetailCellFn: Function;
        _rowHasDetailFn: Function;

        /**
         * Initializes a new instance of a @see:FlexGridDetailProvider.
         *
         * @param grid @see:FlexGrid that will receive detail rows.
         */
        constructor(grid: FlexGrid) {
            this._g = grid;

            // custom merging for cells and row headers
            grid.mergeManager = new DetailMergeManager(grid);

            // expand/collapse detail
            grid.rowHeaders.hostElement.addEventListener('click', this._hdrClick.bind(this));

            // show details, collapse/expand icons
            grid.formatItem.addHandler(this._formatItem, this);

            // show details for selected cell
            grid.selectionChanged.addHandler(this._selectionChanged, this);

            // refresh controls to update layout when detail rows are resized
            grid.resizedRow.addHandler(this._resizedRow, this);

            // hide all details when grid is refreshed
            var self = this;
            grid.loadingRows.addHandler(function () {
                self.hideDetail();
            });

            // hide detail when dragging row
            grid.draggingRow.addHandler(function (s, e: CellRangeEventArgs) {
                self.hideDetail(e.row);
            });

            // keep detail row at the start even with frozen columns (TFS 131863)
            grid.formatItem.addHandler(function (s, e: FormatItemEventArgs) {
                if (e.panel == s.cells) {
                    var row = s.rows[e.row];
                    if (row instanceof DetailRow) {
                        e.cell.style.left = '0';
                    }
                }
            });
        }

        // ** object model

        /**
         * Gets the @see:FlexGrid that owns this @see:FlexGridDetailProvider.
         */
        get grid(): FlexGrid {
            return this._g;
        }
        /**
         * Gets or sets a value that determines when row details are displayed.
         */
        get detailVisibilityMode(): DetailVisibilityMode {
            return this._mode;
        }
        set detailVisibilityMode(value: DetailVisibilityMode) {
            if (value != this._mode) {
                this._mode = asEnum(value, DetailVisibilityMode);
                this.hideDetail();
                this._g.invalidate();
            }
        }
        /**
         * Gets or sets the maximum height of the detail rows, in pixels.
         */
        get maxHeight(): number { 
            return this._maxHeight;
        }
        set maxHeight(value: number) { 
            this._maxHeight = asNumber(value, true);
        }
        /**
         * Gets or sets the callback function that creates detail cells.
         *
         * The callback function takes a @see:Row as a parameter and
         * returns an HTML element representing the row details.
         * For example:
         *
         * <pre>// create detail cells for a given row
         * dp.createDetailCell = function (row) {
         *   var cell = document.createElement('div');
         *   var detailGrid = new wijmo.grid.FlexGrid(cell, {
         *     itemsSource: getProducts(row.dataItem.CategoryID),
         *     headersVisibility: wijmo.grid.HeadersVisibility.Column
         *   });
         *   return cell;
         * };</pre>
         */
        get createDetailCell(): Function {
            return this._createDetailCellFn;
        }
        set createDetailCell(value: Function) {
            this._createDetailCellFn = asFunction(value, true);
        }
        /**
         * Gets or sets the callback function that disposes of detail cells.
         *
         * The callback function takes a @see:Row as a parameter and
         * disposes of any resources associated with the detail cell.
         *
         * This function is optional. Use it in cases where the 
         * @see:createDetailCell function allocates resources that are not
         * automatically garbage-collected.
         */
        get disposeDetailCell(): Function {
            return this._disposeDetailCellFn;
        }
        set disposeDetailCell(value: Function) {
            this._disposeDetailCellFn = asFunction(value, true);
        }
        /**
         * Gets or sets the callback function that determines whether a row 
         * has details.
         *
         * The callback function takes a @see:Row as a parameter and
         * returns a boolean value that indicates whether the row has
         * details. For example:
         *
         * <pre>// remove details from items with odd CategoryID
         * dp.rowHasDetail = function (row) {
         *   return row.dataItem.CategoryID % 2 == 0;
         * };</pre>
         *
         * Setting this property to null indicates all rows have details.
         */
        get rowHasDetail(): Function {
            return this._rowHasDetailFn;
        }
        set rowHasDetail(value: Function) {
            this._rowHasDetailFn = asFunction(value, true);
        }
        /**
         * Gets a value that determines if a row's details are visible.
         *
         * @param row Row or index of the row to investigate.
         */
        isDetailVisible(row: any): boolean {
            var rows = this._g.rows;
            row = this._toIndex(row);
            if (rows[row] instanceof DetailRow) {
                return true;
            }
            if (row < rows.length - 1 && rows[row + 1] instanceof DetailRow) {
                return true;
            }
            return false;
        }
        /**
         * Gets a value that determines if a row has details to show.
         *
         * @param row Row or index of the row to investigate.
         */
        isDetailAvailable(row: any): boolean {
            var rows = this._g.rows;
            row = this._toIndex(row);
            return this._hasDetail(row);
        }
        /**
         * Hides the detail row for a given row.
         *
         * @param row Row or index of the row that will have its details hidden.
         * This parameter is optional. If not provided, all detail rows are hidden.
         */
        hideDetail(row?: any) {
            var rows = this._g.rows;

            // if 'row' is not provided, hide all details
            if (row == null) {
                for (var r = 0; r < rows.length; r++) {
                    if (rows[r] instanceof DetailRow) {
                        this.hideDetail(r);
                    }
                }
                return;
            }

            // remove detail for a given row
            row = this._toIndex(row);

            // skip to next row if this is the main row
            if (!(rows[row] instanceof DetailRow) && 
                row < rows.length - 1 && 
                rows[row + 1] instanceof DetailRow) {
                row++;
            }

            // if we have a detail row, dispose of any child controls 
            // (to avoid memory leaks) and remove the row
            if (rows[row] instanceof DetailRow) {
                if (this.disposeDetailCell) {
                    this.disposeDetailCell(rows[row]);
                }
                Control.disposeAll(rows[row].detail);
                rows.removeAt(row);
            }
        }
        /**
         * Shows the detail row for a given row.
         *
         * @param row Row or index of the row that will have its details shown.
         * @param hideOthers Whether to hide details for all other rows.
         */
        showDetail(row: any, hideOthers = false) {
            var rows = this._g.rows;

            // convert rows into indices
            row = this._toIndex(row);

            // show this
            if (!this.isDetailVisible(row) && this._hasDetail(row)) {

                // create detail row and cell element
                var detailRow = new DetailRow(rows[row]);
                detailRow.detail = this._createDetailCell(rows[row]);

                // insert new detail row below the current row and show it
                if (detailRow.detail) {
                    rows.insert(row + 1, detailRow);
                    this._g.scrollIntoView(row, -1);
                }
            }

            // hide others
            if (hideOthers) {
                var sel = this._g.selection,
                    updateSelection = false;
                if (row > 0 && rows[row] instanceof DetailRow) {
                    row--;
                }
                for (var r = 0; r < rows.length - 1; r++) {
                    if (r != row && rows[r + 1] instanceof DetailRow) {
                        this.hideDetail(r);
                        if (r < row) {
                            row--;
                        }
                        if (r < sel.row) {
                            sel.row--;
                            sel.row2--;
                            updateSelection = true;
                        }
                    }
                }
                if (updateSelection) {
                    this._g.select(sel, false);
                }
            }
        }

        // ** implementation

        // convert Row objects into row indices
        _toIndex(row: any): number {
            if (row instanceof Row) {
                row = row.index;
            }
            return asNumber(row, false, true);
        }

        // expand/collapse detail row
        _hdrClick(e: MouseEvent) {
            if (this._mode == DetailVisibilityMode.ExpandMulti || this._mode == DetailVisibilityMode.ExpandSingle) {
                var g = this._g,
                    ht = g.hitTest(e);
                if (ht.row > -1) {
                    var row = g.rows[ht.row];
                    if (this.isDetailVisible(ht.row)) {
                        this.hideDetail(ht.row);
                    } else {
                        this.showDetail(ht.row, this._mode == DetailVisibilityMode.ExpandSingle);
                    }
                }
            }
        }

        // expand selected row (but not too often)
        _selectionChanged(s: FlexGrid, e: EventArgs) {
            if (this._mode == DetailVisibilityMode.Selection) {
                var self = this;
                if (self._toSel) {
                    clearTimeout(self._toSel);
                }
                self._toSel = setTimeout(function () {
                    if (s.selection.row > -1) { // TFS 121667
                        self.showDetail(s.selection.row, true);
                    } else {
                        self.hideDetail();
                    }
                }, 300);
            }
        }

        // show details, collapse/expand icons
        _formatItem(s, e: FormatItemEventArgs) {
            var g = this._g,
                row = e.panel.rows[e.row],
                self = this;

            // show detail in detail row
            if (e.panel == g.cells && row instanceof DetailRow && row.detail != null) {

                // add detail to cell
                addClass(e.cell, 'wj-detail');
                e.cell.textContent = '';
                e.cell.style.textAlign = ''; // TFS 130035
                e.cell.appendChild(row.detail);

                // set row height (once)
                if (row.height == null) {

                    // make sure controls in detail cell are properly sized
                    Control.refreshAll(e.cell)

                    // calculate height needed for the detail plus padding
                    var cs = getComputedStyle(e.cell),
                        h = row.detail.scrollHeight + parseInt(cs.paddingTop) + parseInt(cs.paddingBottom);

                    // honor max height
                    if (self._maxHeight > 0 && h > self._maxHeight) {
                        h = self._maxHeight;
                    }

                    // apply height
                    row.height = h;

                    // make the cell element fill the row
                    if (!row.detail.style.height) {
                        row.detail.style.height = '100%';
                    }

                    // make inner FlexGrid controls fill the row
                    var gridHost = <HTMLElement>row.detail.querySelector('.wj-flexgrid');
                    if (gridHost && !gridHost.style.height) {
                        gridHost.style.height = '100%';
                    }
                } else {
                    setTimeout(function () {
                        wijmo.Control.refreshAll(row.detail);
                    });
                }
            }

            // show collapse/expand icon
            if (this._mode == DetailVisibilityMode.ExpandMulti ||
                this._mode == DetailVisibilityMode.ExpandSingle) {

                // if this row has details, add collapse/expand icons
                if (e.panel == g.rowHeaders && e.col == 0 && this._hasDetail(e.row)) {

                    // if the next row is, the icon is a 'minus' (collapse)
                    var minus = e.row < g.rows.length - 1 && g.rows[e.row + 1] instanceof DetailRow;

                    // show icon
                    e.cell.innerHTML = minus
                        ? '<span class="wj-glyph-minus"></span>'
                        : '<span class="wj-glyph-plus"></span>';
                }
            }
        }

        // refresh controls to update layout when detail rows are resized
        _resizedRow(s, e: FormatItemEventArgs) {
            var row = e.panel.rows[e.row];
            if (row instanceof DetailRow && row.detail) {
                wijmo.Control.refreshAll(row.detail);
            }
        }

        // check if a row has details currently visible
        _hasVisibleDetail(row: Row): boolean {
            return row instanceof DetailRow || row instanceof GroupRow || row instanceof _NewRowTemplate
                ? false
                : true;
        }

        // check if a row has details to show
        _hasDetail(row: number): boolean {
            return isFunction(this._rowHasDetailFn)
                ? this._rowHasDetailFn(this._g.rows[row])
                : true;
        }

        // creates the cell element that will show details for a given row
        _createDetailCell(row: Row, col?: Column): HTMLElement {
            return this.createDetailCell
                ? this.createDetailCell(row, col)
                : null;
        }
    }
}
module wijmo.grid.detail {
    'use strict';

    /**
     * Merge manager class used by the @see:FlexGridDetailProvider class.
     *
     * The @see:DetailMergeManager merges detail cells (cells in a @see:DetailRow)
     * into a single detail cell that spans all grid columns.
     */
    export class DetailMergeManager extends MergeManager {

        /**
         * Initializes a new instance of a @see:DetailMergeManager object.
         *
         * @param grid The @see:FlexGrid object that owns this @see:DetailMergeManager.
         */
        constructor(grid: FlexGrid) {
            super(grid);
        }

        /**
         * Gets a @see:CellRange that specifies the merged extent of a cell
         * in a @see:GridPanel.
         *
         * @param panel The @see:GridPanel that contains the range.
         * @param r The index of the row that contains the cell.
         * @param c The index of the column that contains the cell.
         * @param clip Whether to clip the merged range to the grid's current view range.
         * @return A @see:CellRange that specifies the merged range, or null if the cell is not merged.
         */
        getMergedRange(panel: GridPanel, r: number, c: number, clip = true): CellRange {
            switch (panel.cellType) {

                // merge detail cells all the way across
                case CellType.Cell:
                    if (panel.rows[r] instanceof DetailRow) {
                        return new CellRange(r, 0, r, panel.columns.length - 1);
                    }
                    break;

                // merge row headers for main and detail rows
                case CellType.RowHeader:
                    if (panel.rows[r] instanceof DetailRow) {
                        return new CellRange(r - 1, c, r, c);
                    } else if (r < panel.rows.length - 1 && panel.rows[r + 1] instanceof DetailRow) {
                        return new CellRange(r, c, r + 1, c);
                    }
                    break;
            }

            // allow base class
            return super.getMergedRange(panel, r, c, clip);
        }
   }
}
module wijmo.grid.detail {
    'use strict';

    /**
     * Row that contains a single detail cell spanning all grid columns.
     */
    export class DetailRow extends wijmo.grid.Row {
        _detail: HTMLElement;

        /**
         * Initializes a new instance of a @see:DetailRow.
         * 
         * @param parentRow @see:Row that this @see:DetailRow provides details for.
         */
        constructor(parentRow: Row) {
            super();
            this.isReadOnly = true;
        }

        /**
         * Gets or sets the HTML element that represents the detail cell in this @see:DetailRow.
         */
        get detail() : HTMLElement {
            return this._detail;
        }
        set detail(value: HTMLElement) {
            this._detail = value;
        }
    }
}
