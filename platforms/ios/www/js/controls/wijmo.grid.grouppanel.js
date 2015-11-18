﻿/*
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
    (function (grid) {
        /**
        * Extension that provides a drag and drop UI for editing
        * groups in bound @see:FlexGrid controls.
        */
        (function (grouppanel) {
            'use strict';

            /**
            * The @see:GroupPanel control provides a drag and drop UI for editing
            * groups in a bound @see:FlexGrid control.
            *
            * It allows users to drag columns from the @see:FlexGrid into the
            * panel and to move groups within the panel. Users may click the
            * group markers in the panel to sort based on the group column or to
            * remove groups.
            *
            * In order to use a @see:GroupPanel, add it to a page that contains a
            * @see:FlexGrid control and set the panel's @see:grid property to the
            * @see:FlexGrid control. For example:
            *
            * <pre>// create a FlexGrid
            * var flex = new wijmo.grid.FlexGrid('#flex-grid');
            * flex.itemsSource = getData();
            * // add a GroupPanel to edit data groups
            * var groupPanel = new wijmo.grid.grouppanel.GroupPanel('#group-panel');
            * groupPanel.placeholder = "Drag columns here to create groups.";
            * groupPanel.grid = flex;</pre>
            */
            var GroupPanel = (function (_super) {
                __extends(GroupPanel, _super);
                /**
                * Initializes a new instance of a @see:GroupPanel control.
                *
                * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                * @param options The JavaScript object containing initialization data for the control.
                */
                function GroupPanel(element, options) {
                    _super.call(this, element);
                    this._hideGroupedCols = true;
                    this._maxGroups = 6;

                    // check dependencies
                    var depErr = 'Missing dependency: GroupPanel requires ';
                    wijmo.assert(grid.FlexGrid != null, depErr + 'wijmo.grid.');

                    // instantiate and apply template
                    var tpl = this.getTemplate();
                    this.applyTemplate('wj-grouppanel wj-control', tpl, {
                        _divMarkers: 'div-markers',
                        _divPH: 'div-ph'
                    });

                    // drag-drop events
                    var e = this.hostElement;
                    this.addEventListener(e, 'dragstart', this._dragStart.bind(this));
                    this.addEventListener(e, 'dragover', this._dragOver.bind(this));
                    this.addEventListener(e, 'drop', this._drop.bind(this));
                    this.addEventListener(e, 'dragend', this._dragEnd.bind(this));

                    // click markers to sort/delete groups
                    this.addEventListener(e, 'click', this._click.bind(this));

                    // apply options
                    this.initialize(options);
                }
                Object.defineProperty(GroupPanel.prototype, "hideGroupedColumns", {
                    /**
                    * Gets or sets a value indicating whether the panel hides grouped columns in the owner grid.
                    *
                    * The @see:FlexGrid displays grouping information in row headers, so it is
                    * usually a good idea to hide grouped columns since they display redundant
                    * information.
                    */
                    get: function () {
                        return this._hideGroupedCols;
                    },
                    set: function (value) {
                        if (value != this._hideGroupedCols) {
                            this._hideGroupedCols = wijmo.asBoolean(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(GroupPanel.prototype, "maxGroups", {
                    /**
                    * Gets or sets the maximum number of groups allowed.
                    */
                    get: function () {
                        return this._maxGroups;
                    },
                    set: function (value) {
                        if (value != this._maxGroups) {
                            this._maxGroups = wijmo.asNumber(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(GroupPanel.prototype, "placeholder", {
                    /**
                    * Gets or sets a string to display in the control when it contains no groups.
                    */
                    get: function () {
                        return this._divPH.textContent;
                    },
                    set: function (value) {
                        this._divPH.textContent = value;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(GroupPanel.prototype, "grid", {
                    /**
                    * Gets or sets the @see:FlexGrid that is connected to this @see:GroupPanel.
                    *
                    * Once a grid is connected to the panel, the panel displays the groups
                    * defined in the grid's data source. Users can drag grid columns
                    * into the panel to create new groups, drag groups within the panel to
                    * re-arrange the groups, or delete items in the panel to remove the groups.
                    */
                    get: function () {
                        return this._g;
                    },
                    set: function (value) {
                        value = wijmo.asType(value, grid.FlexGrid, true);
                        if (value != this._g) {
                            // unhook event handlers
                            if (this._g) {
                                this._g.draggingColumn.removeHandler(this._draggingColumn);
                                this._g.sortedColumn.removeHandler(this.invalidate);
                                this._g.itemsSourceChanged.removeHandler(this._itemsSourceChanged);
                                this._g.columns.collectionChanged.removeHandler(this._itemsSourceChanged); // TFS 125386
                            }

                            // update grid property
                            this._g = value;

                            // attach event handlers
                            if (this._g) {
                                this._g.draggingColumn.addHandler(this._draggingColumn, this);
                                this._g.sortedColumn.addHandler(this.invalidate, this);
                                this._g.itemsSourceChanged.addHandler(this._itemsSourceChanged, this);
                                this._g.columns.collectionChanged.addHandler(this._itemsSourceChanged, this); // TFS 125386
                            }

                            // hook up to groupDescriptions.collectionChanged
                            this._itemsSourceChanged(this._g, null);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                // ** overrides
                /**
                * Updates the panel to show the current groups.
                */
                GroupPanel.prototype.refresh = function () {
                    _super.prototype.refresh.call(this);

                    // clear div/state
                    this._divMarkers.innerHTML = '';
                    this._dragMarker = this._dragCol = null;

                    // add groups to div
                    if (this._gds) {
                        // get row to use for getting the column header and sort information
                        var row = this._g.sortRowIndex ? this._g.sortRowIndex : this._g.columnHeaders.rows.length - 1;

                        for (var i = 0; i < this._gds.length; i++) {
                            var g = this._gds[i], col = this._g.columns.getColumn(g.propertyName);
                            if (col) {
                                // create the marker
                                var mk = document.createElement('div');
                                this._g.cellFactory.updateCell(this._g.columnHeaders, row, col.index, mk);
                                mk.setAttribute('class', 'wj-cell wj-header wj-groupmarker');
                                wijmo.setCss(mk, {
                                    position: 'static',
                                    display: 'inline-block',
                                    verticalAlign: 'top',
                                    left: '',
                                    top: '',
                                    right: '',
                                    height: 'auto',
                                    width: 'auto'
                                });

                                // remove 'filter' glyph
                                var filter = mk.querySelector('[wj-filter]');
                                if (filter) {
                                    mk.removeChild(filter);
                                }

                                // add 'remove group' glyph
                                var remove = wijmo.createElement('<span wj-remove="" style="font-weight:normal;cursor:pointer">&nbsp;&times;&nbsp;</span>');
                                mk.appendChild(remove);

                                // add the marker
                                this._divMarkers.appendChild(mk);
                            }
                        }

                        // update placeholder visibility
                        if (this._divMarkers.children.length > 0) {
                            this._divPH.style.display = 'none';
                            this._divMarkers.style.display = '';
                        } else {
                            this._divPH.style.display = '';
                            this._divMarkers.style.display = 'none';
                        }
                    }
                };

                // ** implementation
                // add a group at a specific position
                GroupPanel.prototype._addGroup = function (col, e) {
                    // get index where the new group will be inserted
                    var index = this._getIndex(e), gds = this._gds;

                    for (var i = 0; i < gds.length; i++) {
                        if (gds[i].propertyName == col.binding) {
                            gds.removeAt(i);
                            if (i < index) {
                                index--;
                            }
                            break;
                        }
                    }

                    for (var i = this.maxGroups - 1; i < gds.length; i++) {
                        gds.removeAt(i);
                        if (i < index) {
                            index--;
                        }
                    }

                    // add new descriptor at the right place
                    gds.deferUpdate(function () {
                        var gd = new wijmo.collections.PropertyGroupDescription(col.binding);
                        gds.insert(index, gd);
                    });

                    // hide the column
                    if (col && this.hideGroupedColumns) {
                        col.visible = false;
                    }

                    // show changes
                    this.invalidate();
                };

                // move a group to a new position
                GroupPanel.prototype._moveGroup = function (marker, e) {
                    // get groups, indices
                    var gds = this._gds, oldIndex = this._getElementIndex(this._dragMarker), newIndex = this._getIndex(e);

                    // make the move
                    if (newIndex > oldIndex) {
                        newIndex--;
                    }
                    if (newIndex >= this._gds.length) {
                        newIndex = this._gds.length;
                    }
                    if (oldIndex != newIndex) {
                        gds.deferUpdate(function () {
                            var gd = gds[oldIndex];
                            gds.removeAt(oldIndex);
                            gds.insert(newIndex, gd);
                        });
                    }
                };

                // removes a given group
                GroupPanel.prototype._removeGroup = function (index) {
                    var binding = this._gds[index].propertyName, col = this._g.columns.getColumn(binding);

                    // remove the group
                    this._gds.removeAt(index);

                    // and show the column
                    if (col) {
                        col.visible = true;
                    }
                };

                // gets the index of the marker at a given mouse position
                GroupPanel.prototype._getIndex = function (e) {
                    var arr = this._divMarkers.children;
                    for (var i = 0; i < arr.length; i++) {
                        var rc = arr[i].getBoundingClientRect();
                        if (e.clientX < rc.left + rc.width / 2) {
                            return i;
                        }
                    }
                    return arr.length;
                };

                // gets an element's index within its parent collection
                GroupPanel.prototype._getElementIndex = function (e) {
                    if (e.parentElement) {
                        var arr = e.parentElement.children;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] == e) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };

                // ** event handlers
                // save reference to column when the user starts dragging it
                GroupPanel.prototype._draggingColumn = function (s, e) {
                    var col = this._g.columns[e.col];
                    this._dragCol = col.binding ? col : null;
                };

                // refresh markers when user changes the data source
                GroupPanel.prototype._itemsSourceChanged = function (s, e) {
                    // update event handlers for groupDescriptions changes
                    if (this._gds) {
                        this._gds.collectionChanged.removeHandler(this._groupsChanged);
                    }
                    this._gds = null;
                    if (this._g.collectionView) {
                        this._gds = this._g.collectionView.groupDescriptions;
                        this._gds.collectionChanged.addHandler(this._groupsChanged, this);
                    }

                    // and update the panel now
                    this.invalidate();
                };

                // refresh markers when groupDescriptions change
                GroupPanel.prototype._groupsChanged = function (s, e) {
                    this.invalidate();
                };

                // drag a group marker to a new position
                GroupPanel.prototype._dragStart = function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text', ''); // required in FireFox (note: text/html will throw in IE!)
                    this._dragMarker = e.target;
                    this._dragCol = null;
                };

                // accept grid columns (add group) or group markers (move group)
                GroupPanel.prototype._dragOver = function (e) {
                    // check whether we are dragging a column or a marker
                    var valid = this._dragCol || this._dragMarker;

                    // if valid, prevent default to allow drop
                    if (valid) {
                        e.dataTransfer.dropEffect = 'move';
                        e.preventDefault();
                    }
                };

                // accept grid columns (add group) or group markers (move group)
                GroupPanel.prototype._drop = function (e) {
                    if (this._dragMarker) {
                        this._moveGroup(this._dragMarker, e);
                    } else if (this._dragCol) {
                        this._addGroup(this._dragCol, e);
                    }
                };

                // finish dragging process
                GroupPanel.prototype._dragEnd = function (e) {
                    this._dragMarker = this._dragCol = null;
                };

                // click markers to sort/delete groups
                GroupPanel.prototype._click = function (e) {
                    // get the element that was clicked
                    var element = document.elementFromPoint(e.clientX, e.clientY);

                    // check for remove group glyph
                    var remove = element.getAttribute('wj-remove') != null;

                    // get marker
                    var marker = element;
                    while (marker.parentElement && !wijmo.hasClass(marker, 'wj-cell')) {
                        marker = marker.parentElement;
                    }

                    // if we got the marker, remove group or flip sort
                    if (wijmo.hasClass(marker, 'wj-cell')) {
                        var index = this._getElementIndex(marker), cv = this._g.collectionView, sds = cv.sortDescriptions;
                        if (remove) {
                            this._removeGroup(index);
                        } else if (e.ctrlKey) {
                            sds.clear();
                            this.invalidate();
                        } else {
                            var gd = this._gds[index], asc = true;
                            for (var i = 0; i < sds.length; i++) {
                                if (sds[i].property == gd.propertyName) {
                                    asc = !sds[i].ascending;
                                    break;
                                }
                            }
                            var sd = new wijmo.collections.SortDescription(gd.propertyName, asc);
                            sds.splice(0, sds.length, sd);
                            this.invalidate();
                        }
                    }
                };
                GroupPanel.controlTemplate = '<div style="cursor:default;overflow:hidden;height:100%;width:100%;min-height:1em">' + '<div wj-part="div-ph"></div>' + '<div wj-part="div-markers"></div>' + '</div>';
                return GroupPanel;
            })(wijmo.Control);
            grouppanel.GroupPanel = GroupPanel;
        })(grid.grouppanel || (grid.grouppanel = {}));
        var grouppanel = grid.grouppanel;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=GroupPanel.js.map

