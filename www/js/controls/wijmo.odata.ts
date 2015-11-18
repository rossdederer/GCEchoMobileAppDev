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
 * Provides classes that support the OData protocol, including the
 * @see:ODataCollectionView class.
 *
 * OData is a standardized protocol for creating and consuming data APIs. 
 * OData builds on core protocols like HTTP and commonly accepted methodologies like REST. 
 * The result is a uniform way to expose full-featured data APIs. (http://www.odata.org/)
 */
module wijmo.odata {
    'use strict';

    /**
     * Extends the @see:CollectionView class to support loading and saving data
     * to and from OData sources.
     *
     * You can use the @see:ODataCollectionView class to load data from OData services
     * and use it as a data source for any Wijmo controls.
     *
     * In addition to full CRUD support you get all the @see:CollectionView features 
     * including sorting, filtering, paging, and grouping. The sorting, filtering, and
     * paging functions may be peformed on the server or on the client.
     *
     * The code below shows how you can instantiate an @see:ODataCollectionView that
     * selects some fields from the data source and provides sorting on the client.
     * Notice how the 'options' parameter is used to pass in initialization data,
     * which is the same approach used when initializing controls:
     *
     * <pre>var url = 'http://services.odata.org/Northwind/Northwind.svc';
     * var categories = new wijmo.odata.ODataCollectionView(url, 'Categories', {
     *   fields: ['CategoryID', 'CategoryName', 'Description'],
     *   sortOnServer: false
     * });</pre>
     */
    export class ODataCollectionView extends wijmo.collections.CollectionView {
        _url: string;
        _tbl: string;
        _count = 0;
        _fields: string[];
        _keys: string[];
        _dataTypes: any;
        _sortOnServer = true;
        _pageOnServer = true;
        _filterOnServer = true;
        _inferDataTypes = true;
        _dataTypesInferred: any;
        _filterDef: string;
        _toGetData: number;
        _loading: boolean;
        _odv: number; // OData version (e.g. 1, 2, 3, 4)

        static _odvCache = {}; // cache versions by service URL

        // regex for matching Javascript date strings
        static _rxDate = /^(\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}|\/Date\([\d\-]*?\)\/)$/;

        /**
         * Initializes a new instance of an @see:ODataCollectionView.
         *
         * @param url Url of the OData service (for example
         * 'http://services.odata.org/Northwind/Northwind.svc').
         * @param tableName Name of the table (entity) to retrieve from the service.
         * If not provided, a list of the tables (entities) available is retrieved.
         * @param options JavaScript object containing initialization data (property 
         * values and event handlers) for the @see:ODataCollectionView.
         */
        constructor(url: string, tableName: string, options?: any) {
            super();
            this._url = asString(url, false);
            this._tbl = asString(tableName);
            if (options) {
                copy(this, options);
            }

            // go get the data
            this._getData();

            // when sortDescriptions change, sort on server
            var self = this;
            this.sortDescriptions.collectionChanged.addHandler(function () {
                if (self.sortOnServer) {
                    self._getData();
                }
            });
        }

        // ** object model

        /**
         * Gets the name of the table (entity) that this collection is bound to.
         */
        get tableName(): string {
            return this._tbl;
        }
        /**
         * Gets or sets an array containing the names of the fields to retrieve from 
         * the data source.
         *
         * If this property is set to null or to an empty array, all fields are 
         * retrieved.
         *
         * For example, the code below creates an @see:ODataCollectionView that
         * gets only three fields from the 'Categories' table in the database:
         *
         * <pre>var categories = new wijmo.data.ODataCollectionView(url, 'Categories', {
         *   fields: ['CategoryID', 'CategoryName', 'Description']
         * });</pre>
         */
        get fields(): string[] {
            return this._fields;
        }
        set fields(value: string[]) {
            if (this._fields != value) {
                this._fields = asArray(value);
                this._getData();
            }
        }
        /**
         * Gets or sets an array containing the names of the key fields.
         *
         * Key fields are required for update operations (add/remove/delete).
         */
        get keys(): string[] {
            return this._keys;
        }
        set keys(value: string[]) {
            this._keys = asArray(value);
        }
        /**
         * Gets or sets a JavaScript object to be used as a map for coercing data types
         * when loading the data.
         *
         * The object keys represent the field names and the values are @see:DataType values
         * that indicate how the data should be coerced.
         *
         * For example, the code below creates an @see:ODataCollectionView and specifies
         * that 'Freight' values, which are stored as strings in the database, should be
         * converted into numbers; and that three date fields should be converted into dates:
         *
         * <pre>var orders = new wijmo.data.ODataCollectionView(url, 'Orders', {
         *   dataTypes: {
         *     Freight: wijmo.DataType.Number 
         *     OrderDate: wijmo.DataType.Date,
         *     RequiredDate: wijmo.DataType.Date,
         *     ShippedDate: wijmo.DataType.Date,
         *   }
         * });</pre>
         *
         * This property is useful when the database contains data stored in 
         * formats that do not conform to common usage.
         *
         * In most cases you don't have to provide information about the 
         * data types, because the @see:inferDataTypes property handles 
         * the conversion of Date values automatically.
         *
         * If you do provide explicit type information, the @see:inferDataTypes 
         * property is not applied. Because of this, any data type information
         * that is provided shold be complete, including all fields of type
         * Date.
         */
        get dataTypes(): any {
            return this._dataTypes;
        }
        set dataTypes(value: any) {
            this._dataTypes = value;
        }
        /**
         * Gets or sets a value that determines whether fields that contain 
         * strings that look like standard date representations should be
         * converted to dates automatically.
         *
         * This property is set to true by default, because the @see:ODataCollectionView 
         * class uses JSON and that format does not support Date objects.
         *
         * This property has no effect if specific type information is provided using
         * the @see:dataTypes property.
         */
        get inferDataTypes(): boolean {
            return this._inferDataTypes;
        }
        set inferDataTypes(value: boolean) {
            this._inferDataTypes = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether sort operations 
         * should be performed on the server or on the client.
         *
         * Use the @see:sortDescriptions property to specify how the
         * data shold be sorted.
         */
        get sortOnServer(): boolean {
            return this._sortOnServer;
        }
        set sortOnServer(value: boolean) {
            if (value != this._sortOnServer) {
                this._sortOnServer = asBoolean(value);
                this._getData();
            }
        }
        /**
         * Gets or sets a value that determines whether paging should be 
         * performed on the server or on the client.
         *
         * Use the @see:pageSize property to enable paging.
         */
        get pageOnServer(): boolean {
            return this._pageOnServer;
        }
        set pageOnServer(value: boolean) {
            if (value != this._pageOnServer) {
                this._pageOnServer = asBoolean(value);
                if (this.pageSize) {
                    this._getData();
                }
            }
        }
        /**
         * Gets or sets a value that determines whether filtering should be performed on 
         * the server or on the client.
         *
         * Use the @see:filter property to perform filtering on the client, and use the 
         * @see:filterDefinition property to perform filtering on the server.
         *
         * In some cases it may be desirable to apply independent filters on the client 
         * <b>and</b> on the server. 
         *
         * You can achieve this by setting (1) the @see:filterOnServer property to false 
         * and the @see:filter property to a  filter function (to enable client-side filtering) 
         * and (2) the @see:filterDefinition property to a filter string (to enable server-side 
         * filtering).
         */
        get filterOnServer(): boolean {
            return this._filterOnServer;
        }
        set filterOnServer(value: boolean) {
            if (value != this._filterOnServer) {
                this._filterOnServer = asBoolean(value);
                this._getData();
            }
        }
        /**
         * Gets or sets a string containing an OData filter specification to
         * be used for filtering the data on the server.
         *
         * The filter definition syntax is described in the 
         * <a href="http://www.odata.org/documentation/odata-version-2-0/uri-conventions/">OData documentation</a>.
         *
         * For example, the code below causes the server to return records where the 'CompanyName'
         * field starts with 'A' and ends with 'S':
         *
         * <pre>view.filterDefinition = "startswith(CompanyName, 'A') and endswith(CompanyName, 'B')";</pre>
         *
         * Filter definitions can be generated automatically.
         * For example, the @see:wijmo.grid.filter.FlexGridFilter component detects whether 
         * its data source is an #see:ODataCollectionView and automatically updates both the
         * @see:filter and @see:filterDefiniton properties.
         *
         * Note that the @see:filterDefinition property is applied even if the @see:filterOnServer property
         * is set to false. This allows you to apply servar and client filters to the same collection,
         * which can be useful in a number of scenarios.
         *
         * For example, the code below uses the @see:filterDefinition property to filter on the server
         * and the @see:filter property to further filter on the client. The collection will show items
         * with names that start with 'C' and have unit prices greater than 20:
         *
         * <pre>var url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
         * var data = new wijmo.odata.ODataCollectionView(url, 'Products', {
         *   oDataVersion: 4,
         *   filterDefinition: 'startswith(ProductName, \'C\')', // server filter
         *   filterOnServer: false, // client filter
         *   filter: function(product) { 
         *     return product.UnitPrice &gt; 20;
         *   },
         * });</pre>
         */
        get filterDefinition(): string {
            return this._filterDef;
        }
        set filterDefinition(value: string) {
            if (value != this._filterDef) {
                this._filterDef = asString(value);
                this._getData();
            }
        }
        /**
         * Gets or sets the OData version used by the server.
         *
         * There are currently four versions of OData services, 1.0 through 4.0.
         * Version 4.0 is used by the latest services, but there are many legacy
         * services still in operation.
         *
         * If you know what version of OData your service implements, then set the
         * @see:oDataVersion property to the appropriate value (1 through 4) when you
         * create the @see:ODataCollectionView (see example below).
         *
         * <pre>var url = 'http://services.odata.org/Northwind/Northwind.svc';
         * var categories = new wijmo.odata.ODataCollectionView(url, 'Categories', {
         *   oDataVersion: 1.0, // legacy OData source
         *   fields: ['CategoryID', 'CategoryName', 'Description'],
         *   sortOnServer: false
         * });</pre>
         *
         * If you do not know what version of OData your service implements (perhaps 
         * you are writing an OData explorer application), then do not specify the
         * version. In this case, the @see:ODataCollectionView will get this information
         * from the server. This operation requires an extra request, but only once
         * per service URL, so the overhead is small.
         */
        get oDataVersion(): number {
            return this._odv;
        }
        set oDataVersion(value: number) {
            this._odv = asNumber(value);
        }
        /**
         * Gets a value that indicates the @see:ODataCollectionView is 
         * currently loading data.
         * 
         * This property can be used to provide progress indicators.
         */
        get isLoading(): boolean {
            return this._loading;
        }
        /**
         * Occurs when the @see:ODataCollectionView starts loading data.
         */
        loading = new Event();
        /**
         * Raises the @see:loading event.
         */
        onLoading(e?: EventArgs) {
            this.loading.raise(this, e);
        }
        /**
         * Occurs when the @see:ODataCollectionView finishes loading data.
         */
        loaded = new Event();
        /**
         * Raises the @see:loaded event.
         */
        onLoaded(e?: EventArgs) {
            this.loaded.raise(this, e);
        }
        /**
         * Occurs when there is an error reading or writing data.
         */
        error = new Event();
        /**
         * Raises the @see:error event.
         *
         * By default, errors throw exceptions and trigger a data refresh. If you
         * want to prevent this behavior, set the @see:cancel parameter to true
         * in the event handler.
         *
         * @param e @see:RequestErrorEventArgs that contains information about the error.
         */
        onError(e: RequestErrorEventArgs): boolean {
            this.error.raise(this, e);
            return !e.cancel;
        }

        // ** overrides

        /**
         * Override @see:commitNew to add the new item to the database.
         */
        commitNew() {

            // commit to database
            var item = this.currentAddItem,
                self = this;
            if (item) {
                var url = this._getWriteUrl();
                httpRequest(url, {
                    method: 'POST',
                    data: this._stringifyNumbers(item),
                    requestHeaders: { // get new item back as JSON
                        'Accept': 'application/json'
                    },
                    success: function (xhr) { // update keys in the new item, refresh the view
                        var newItem = JSON.parse(xhr.response);
                        self.keys.forEach(function (key) {
                            item[key] = newItem[key];
                        });
                        self.refresh();
                    },
                    error: this._error.bind(this)
                });
            }

            // allow base class
            super.commitNew();
        }
        /**
         * Override @see:commitEdit to modify the item in the database.
         */
        commitEdit() {

            // commit to database
            var item = this.currentEditItem;
            if (item && !this.currentAddItem && !this._sameContent(item, this._edtClone)) {
                var url = this._getWriteUrl(this._edtClone);
                httpRequest(url, {
                    method: 'PUT',
                    data: this._stringifyNumbers(item),
                    error: this._error.bind(this)
                });
            }

            // allow base class
            super.commitEdit();
        }
        /**
         * Override @see:remove to remove the item from the database.
         *
         * @param item Item to be removed from the database.
         */
        remove(item: any) {

            // remove from database
            if (item && item != this.currentAddItem) {
                var url = this._getWriteUrl(item);
                httpRequest(url, {
                    method: 'DELETE',
                    error: this._error.bind(this)
                });
            }

            // allow base class
            super.remove(item);
        }
        /**
         * Gets the total number of items in the view before paging is applied.
         */
        get totalItemCount(): number {
            return this._count;
        }
        /**
         * Gets the total number of pages.
         */
        get pageCount(): number {
            return this.pageSize ? Math.ceil(this.totalItemCount / this.pageSize) : 1;
        }
        /**
         * Gets or sets the number of items to display on a page.
         */
        get pageSize(): number {
            return this._pgSz;
        }
        set pageSize(value: number) {
            if (value != this._pgSz) {
                this._pgSz = asInt(value);
                if (this.pageOnServer) {
                    this._pgIdx = clamp(this._pgIdx, 0, this.pageCount - 1); // ensure page index is valid (TFS 121226)
                    this._getData();
                } else {
                    this.refresh();
                }
            }
        }
        /**
         * Raises the @see:pageChanging event.
         *
         * @param e @see:PageChangingEventArgs that contains the event data.
         */
        onPageChanging(e: wijmo.collections.PageChangingEventArgs): boolean {
            super.onPageChanging(e);
            if (!e.cancel && this.pageOnServer) {
                this._getData();
            }
            return !e.cancel;
        }
        //
        // gets the list that corresponds to the current page
        _getPageView() {
            return this.pageOnServer
                ? this._view
                : super._getPageView();
        }
        //
        // disable sort and filter on client if we're doing it on the server
        _performRefresh() {

            // save settings
            var canFilter = this._canFilter,
                canSort = this._canSort;

            // perform refresh
            this._canFilter = !this._filterOnServer;
            this._canSort = !this._sortOnServer;
            super._performRefresh();

            // restore settings
            this._canFilter = canFilter;
            this._canSort = canSort;
        }

        // ** implementation

        // store items in the source collection
        /*protected*/ _storeItems(items: any[], append: boolean) {
            if (!append) {
                this.sourceCollection = items;
            } else {
                Array.prototype.push.apply(this.sourceCollection, items);
            }
        }

        // get url for OData read request
        /*protected*/ _getReadUrl(nextLink?: string) {
            var url = this._url;
            if (url[url.length - 1] != '/') {
                url += '/';
            }
            if (nextLink) { // continuation includes table
                url = nextLink.indexOf('http') == 0 ? nextLink : url + nextLink;
            } else if (this._tbl) { // add table if available
                url += this._tbl;
            }
            return url;
        }

        // get parameters for OData read request
        /*protected*/ _getReadParams(nextLink?: string) {

            // always require JSON
            var settings = {
                $format: 'json'
            }
            if (this._tbl && !nextLink) {

                // get page count (OData4 uses $count, earlier versions use $inlinecount)
                if (this._odv < 4) {
                    settings['$inlinecount'] = 'allpages';
                } else {
                    settings['$count'] = true;
                }

                // specifiy fields to retrieve
                if (this.fields) {
                    settings['$select'] = this.fields.join(',');
                }

                // server sort
                if (this.sortOnServer && this.sortDescriptions.length) {
                    var sort = '';
                    for (var i = 0; i < this.sortDescriptions.length; i++) {
                        var sd = this.sortDescriptions[i];
                        if (sort) sort += ',';
                        sort += sd.property;
                        if (!sd.ascending) sort += ' desc';
                    }
                    settings['$orderby'] = sort;
                }

                // server paging
                if (this.pageOnServer && this.pageSize > 0) {
                    settings['$skip'] = this.pageIndex * this.pageSize;
                    settings['$top'] = this.pageSize;
                }

                // server filter 
                // NOTE: we apply filterDefinition regardless of 'filterOnServer'; 
                // this allows filtering on the server and on the client at the same time
                if (this.filterDefinition) {
                    settings['$filter'] = this.filterDefinition;
                }
            }
            return settings;
        }

        // get the data
        /*protected*/ _getData(nextLink?: string) {

            // get the data on a timeout to avoid doing it too often
            var self = this;
            if (self._toGetData) {
                clearTimeout(self._toGetData);
            }
            self._toGetData = setTimeout(function () {

                // ensure we know what version of OData we're talking to
                if (self._odv == null) {
                    self._getSchema();
                    return;
                }

                // start loading
                self._loading = true;
                self.onLoading();

                // go get the data
                var url = self._getReadUrl(nextLink);
                httpRequest(url, {
                    data: self._getReadParams(nextLink),
                    success: function (xhr) {

                        // parse response
                        var response = JSON.parse(xhr.response),
                            arr = response.d ? response.d.results : response.value,
                            count = response.d ? response.d.__count : (response['odata.count'] || response['@odata.count']);

                        // store total item count
                        if (count != null) {
                            self._count = parseInt(count);
                        }

                        // get/infer/convert data types the first time
                        if (!nextLink) {
                            if (self.inferDataTypes && !self._dataTypesInferred) {
                                self._dataTypesInferred = self._getInferredDataTypes(arr);
                            }
                        }

                        // convert using user or inferred dataTypes
                        var dataTypes = self.dataTypes ? self.dataTypes : self._dataTypesInferred;
                        if (dataTypes) {
                            for (var i = 0; i < arr.length; i++) {
                                self._convertItem(dataTypes, arr[i]);
                            }
                        }

                        // add result to source collection
                        self._storeItems(arr, nextLink != null);
                        self.refresh();

                        // go get more if there is a next link, else finish
                        nextLink = response.d ? response.d.__next : (response['odata.nextLink'] || response['@odata.nextLink']);
                        if (nextLink) {
                            self._getData(nextLink);
                        } else {
                            self._loading = false;
                            self.onLoaded();
                        }
                    },
                    error: function (xhr) {
                        self._loading = false;
                        self.onLoaded();
                        if (self.onError(new RequestErrorEventArgs(xhr))) {
                            throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
                        }
                    }
                });
            }, 100);
        }

        // convert numbers to strings before posting to OData services
        // in versions prior to 4.0.
        // failing to do this may cause the service to throw an error:
        // 'Cannot convert a primitive value to the expected type'
        // which can in turn causes an HTTP 400 (Bad Request) error
        private _stringifyNumbers(item: any): any {
            if (this._odv >= 4) {
                return item;
            } else {
                var obj = {};
                for (var key in item) {
                    var val = item[key];
                    obj[key] = isNumber(val) ? val.toString() : val;
                }
                return obj;
            }
        }

        // convert item properties to the proper types (JSON doesn't do dates...)
        private _convertItem(dataTypes: any[], item: any) {
            for (var k in dataTypes) {
                var type = dataTypes[k],
                    value = item[k];
                if (value != undefined) {
                    if (type === DataType.Date && value && value.indexOf('/Date(') == 0) { // verbosejson
                        value = new Date(parseInt(value.substr(6)));
                    }
                    item[k] = changeType(value, type, null);
                }
            }
        }

        // infer data types to detect dates automatically
        private _getInferredDataTypes(arr: any[]): any {
            var types = null;
            if (arr.length > 0) {

                // get a combination of the first 10 items (in case there are nulls)
                var item = {};
                for (var i = 0; i < arr.length && i < 10; i++) {
                    this._extend(item, arr[i]);
                }

                // scan the combined item for dates
                for (var key in item) {
                    var val = item[key];
                    if (isString(val) && <string>val.match(ODataCollectionView._rxDate)) {
                        if (!types) types = {};
                        types[key] = DataType.Date;
                    }
                }
            }
            return types;
        }

        // get service url for OData write requests
        private _getServiceUrl() {
            var url = this._url;
            if (url[url.length - 1] != '/') {
                url += '/';
            }
            return url;
        }

        // get the schema/odata version
        private _getSchema() {
            var url = this._getServiceUrl() + '$metadata';

            // check if we have the version in the cache
            this._odv = ODataCollectionView._odvCache[url];

            // if we do, go get the data
            if (this._odv) {
                this._getData();
            } else { // if we don't, get the schema and then go get the data
                var self = this;
                httpRequest(url, {
                    success: function (xhr) {
                        var m = xhr.response.match(/<.*Version\s*=\s*"(.*)"\s*>/i),
                            odv = m ? parseFloat(m[1]) : 4;
                        ODataCollectionView._odvCache[url] = self._odv = odv;
                    },
                    error: function (xhr) {
                        // error getting metadata, assume OData 4...
                        ODataCollectionView._odvCache[url] = self._odv = 4;
                    },
                    complete: function (xhr) {
                        self._getData();
                    }
                });
            }
        }

        // get url for OData write requests
        private _getWriteUrl(item?: any) {

            // service
            var url = this._getServiceUrl();

            // table
            url += this._tbl;

            // item keys
            if (item) {
                assert(this.keys && this.keys.length > 0, 'write operations require keys.');
                var keys = [];
                this.keys.forEach(function (key) {
                    assert(item[key] != null, 'key values cannot be null.');
                    keys.push(key + '=' + item[key]);
                });
                url += '(' + keys.join(',') + ')';
            }

            // done
            return url;
        }

        // handle errors...
        private _error(xhr: XMLHttpRequest) {
            if (this.onError(new RequestErrorEventArgs(xhr))) {
                this._getData();
                throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
            }
        }
    }
}
module wijmo.odata {
    'use strict';

    /**
     * Extends the @see:ODataCollectionView class to support loading data on
     * demand, using the @see:setWindow method.
     *
     * The example below shows how you can declare an @see:ODataCollectionView 
     * and synchronize it with a @see:wijmo.grid.FlexGrid control to load the
     * data that is within the grid's viewport:
     *
     * <pre>// declare virtual collection view
     * var vcv = new wijmo.odataX.ODataVirtualCollectionView(url, 'Order_Details_Extendeds', {
     *   oDataVersion: 4
     * });
     * // use virtual collection as grid data source
     * flex.itemsSource = vcv;
     * // update data window when the grid scrolls
     * flex.scrollPositionChanged.addHandler(function () {
     *   var rng = flex.viewRange;
     *   vcv.setWindow(rng.row, rng.row2);
     * });</pre>
     *
     * The @see:ODataVirtualCollectionView class implements a 'data window' so only
     * data that is actually being displayed is loaded from the server. Items that are
     * not being displayed are added to the collection as null values until a call
     * to the @see:setWindow method causes them those items to be loaded.
     *
     * This 'on-demand' method of loading data has advantages when dealing with large
     * data sets, because it prevents the application from loading data until it is
     * required. But it does impose some limitation: sorting and filtering must be
     * done on the server; grouping and paging are not supported.
     */
    export class ODataVirtualCollectionView extends ODataCollectionView {
        _data: any[];           // source collection
        _skip: number;          // _skip and pageSize define the actual data window
        _start: number;         // last data window requested
        _end: number;
        _refresh: boolean;      // data has been refreshed, need to re-create sourceCollection
        _loadOffset: number;
        _toSetWindow: number;

        /**
         * Initializes a new instance of an @see:ODataVirtualCollectionView.
         *
         * @param url Url of the OData service (for example
         * 'http://services.odata.org/Northwind/Northwind.svc').
         * @param tableName Name of the table (entity) to retrieve from the service.
         * If not provided, a list of the tables (entities) available is retrieved.
         * @param options JavaScript object containing initialization data (property 
         * values and event handlers) for the @see:ODataVirtualCollectionView.
         */
        constructor(url: string, tableName: string, options?: any) {

            // initialize options
            if (options == null) {
                options = {};
            }

            // always page and sort on server
            options.pageOnServer = true;
            options.sortOnServer = true;

            // no grouping
            this.canGroup = false;

            // initialize actual data window
            this._skip = 0;
            if (!options.pageSize) {
                options.pageSize = 100;
            }

            // allow base class
            super(url, tableName, options);

            // initialize sourceCollection
            this._data = [];
            this.sourceCollection = this._data;

            // initialize requested data window
            this.setWindow(0, this.pageSize);
        }

        // ** object model

        /**
         * Sets the data window to ensure a range of records are loaded into the view.
         *
         * @param start Index of the first item in the data window.
         * @param end Index of the last item in the data window.
         */
        setWindow(start: number, end: number) {
            if (!this._toSetWindow) {
                setTimeout(() => {
                    this._toSetWindow = null;
                    this._performSetWindow(start, end);
                }, 50);
            }
        }

        // ** overrides

        /**
         * @see:ODataVirtualCollectionView requires @see:pageOnServer to be set to true.
         */
        get pageOnServer(): boolean {
            return true;
        }
        set pageOnServer(value: boolean) {
            if (!value) {
                throw 'ODataVirtualCollectionView requires pageOnServer = true.';
            }
        }
        /**
         * @see:ODataVirtualCollectionView requires @see:sortOnServer to be set to true.
         */
        get sortOnServer(): boolean {
            return true;
        }
        set sortOnServer(value: boolean) {
            if (!asBoolean(value)) {
                throw 'ODataVirtualCollectionView requires sortOnServer = true.';
            }
        }
        /**
         * @see:ODataVirtualCollectionView requires @see:filterOnServer to be set to true.
         */
        get filterOnServer(): boolean {
            return true;
        }
        set filterOnServer(value: boolean) {
            if (!asBoolean(value)) {
                throw 'ODataVirtualCollectionView requires filterOnServer = true.';
            }
        }
        /**
         * @see:ODataVirtualCollectionView requires @see:canGroup to be set to false.
         */
        get canGroup(): boolean {
            return this._canGroup;
        }
        set canGroup(value: boolean) {
            if (asBoolean(value)) {
                throw 'ODataVirtualCollectionView does not support grouping.';
            }
        }

        // override to refresh source collection when needed
        _performRefresh() {
            if (!this.isLoading) {
                this._refresh = true;
            }
            super._performRefresh();
        }

        // override to apply current _skip parameter
        /*protected*/ _getReadParams(nextLink?: string) {
            var params = super._getReadParams(nextLink);
            params['$skip'] = this._skip;
            params['$top'] = this.pageSize;
            return params;
        }

        // override to add items at the proper place
        /*protected*/ _storeItems(items: any[], append: boolean) {

            // re-create data source array if refreshed or number of items has changed
            if (this._refresh || this._data.length != this.totalItemCount) {
                this._data.length = this.totalItemCount;
                for (var i = 0; i < this._data.length; i++) {
                    this._data[i] = null;
                }
                this._refresh = false;
            }

            // prepare to load items starting at the _skip position
            if (!append) {
                //console.log('starting batch at ' + this._skip);
                this._loadOffset = 0;
            }

            // add items at the proper spot
            //console.log('adding ' + items.length + ' items at ' + this._skip + ' + ' + this._loadOffset);
            for (var i = 0; i < items.length; i++) {
                var index = this._loadOffset + this._skip + i;
                this._data[index] = items[i];    
            }

            // increment load starting point
            this._loadOffset += items.length;
        }

        // ** implementation

        // load records for a given window
        _performSetWindow(start: number, end: number) {

            // validate parameters
            start = asInt(start);
            end = asInt(end);
            assert(end >= start, 'Start must be smaller than end.');
            //console.log('setting window to ' + start + ' -> ' + end + '.');
            
            // save direction, new window
            var down = isNumber(this._start) && start > this._start;
            this._start = start;
            this._end = end;

            // see if we need to refresh the data
            var needData = false;
            for (var i = start; i < end && i < this._data.length && !needData; i++) {
                needData = (this._data[i] == null);
            }
            if (!needData) {
                //console.log('already got data for the window ' + start + ' -> ' + end + ', ignoring request.');
                return;
            }

            // adjust window
            var top = Math.max(0, down ? start : end - this.pageSize);
            for (var i = top; i < this._data.length && this._data[i] != null; i++) {
                top++;
            }
            
            // go get the data
            //console.log('getting data from ' + top + ' -> ' + (top + this.pageSize));
            this._skip = top;
            this._getData();
        }
   }
}
