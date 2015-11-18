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
* Analytics extensions for @see:FinancialChart.
*/
declare module wijmo.chart.finance.analytics {
    /**
    * Represents a Fibonacci tool for @see:FinancialChart.
    
    * The tool enables the calculation and plotting of various alert levels that are
    * useful in financial charts.
    *
    * To add Fibonacci tool to a @see:FinancialChart control, create an instance
    * of the @see:Fibonacci and add it to the <b>series</b> collection of the chart.
    * For example:
    *
    * <pre>
    * // create chart
    * var chart = new wijmo.chart.finance.FinancialChart('#chartElement');
    * // create Fibonacci tool
    * var ftool = new wijmo.chart.finance.analytics.Fibonacci();
    * chart.series.push(ftool);
    * </pre>
    */ 
    class Fibonacci extends SeriesBase {
        private _high;
        private _low;
        private _minX;
        private _maxX;
        private _actualHigh;
        private _actualLow;
        private _levels;
        private _uptrend;
        private _labelPosition;
        /**
        * Initializes a new instance of a @see:Fibonacci object.
        *
        * @param options A JavaScript object containing initialization data.
        */ 
        constructor(options?: any);
        /**
        * Gets or sets the low value of @see:Fibonacci tool.
        *
        * If not specified, the low value is caclulated based on data values provided by <b>itemsSource</b>.
        */
        public low : number;
        /**
        * Gets or sets the high value of @see:Fibonacci tool.
        *
        * If not specified, the high value is caclulated based on
        * data values provided by the <b>itemsSource</b>.
        */
        public high : number;
        /**
        * Gets or sets the label position for levels in @see:Fibonacci tool.
        */
        public labelPosition : LabelPosition;
        /**
        * Gets or sets a value indicating whether to create uptrending @see:Fibonacci tool.
        *
        * Default value is true(uptrend). If the value is false, the downtrending levels are plotted.
        */
        public uptrend : boolean;
        /**
        * Gets or sets the array of levels for plotting.
        *
        * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
        */
        public levels : number[];
        /**
        * Gets or sets the x minimal value of the @see:Fibonacci tool.
        *
        * If not specified, current minimum of x-axis is used.
        * The value can be specified as a number or Date object.
        */
        public minX : any;
        /**
        * Gets or sets the x maximum value of the @see:Fibonacci tool.
        *
        * If not specified, current maximum of x-axis is used.
        * The value can be specified as a number or Date object.
        */
        public maxX : any;
        /**
        * Gets array of numeric data values for the series.
        *
        * @param dimension The dimension of data: 0 for y-values and 1 for x-values.
        */
        public getValues(dimension: number): number[];
        private _getMinX();
        private _getMaxX();
        private _updateLevels();
        private _render(sender, args);
    }
}

