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
module wijmo.chart.finance.analytics {
    'use strict';

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
    export class Fibonacci extends SeriesBase {
        private _high: number;
        private _low: number;
        private _minX: any;
        private _maxX: any;
        private _actualHigh: number;
        private _actualLow: number;
        private _levels: number[] = [0, 23.6, 38.2, 50, 61.8, 100];
        private _uptrend = true;
        private _labelPosition: LabelPosition = LabelPosition.Left;

        /**
         * Initializes a new instance of a @see:Fibonacci object.
         *
         * @param options A JavaScript object containing initialization data.
         */ 
        constructor(options?) {
            super();
            if (options) {
                wijmo.copy(this, options);
            }
            this.rendering.addHandler(this._render);
        }

        /**
         * Gets or sets the low value of @see:Fibonacci tool.
         *
         * If not specified, the low value is caclulated based on data values provided by <b>itemsSource</b>.
         */
        get low(): number {
            return this._low;
        }
        set low(value: number) {
            if (value != this._low) {
                this._low = asNumber(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the high value of @see:Fibonacci tool.
         *
         * If not specified, the high value is caclulated based on 
         * data values provided by the <b>itemsSource</b>.
         */
        get high(): number {
            return this._high;
        }
        set high(value: number) {
            if (value != this._high) {
                this._high = asNumber(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the label position for levels in @see:Fibonacci tool.
         */
        get labelPosition(): LabelPosition {
            return this._labelPosition;
        }
        set labelPosition(value: LabelPosition) {
            if (value != this._labelPosition) {
                this._labelPosition= asEnum(value, LabelPosition, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets a value indicating whether to create uptrending @see:Fibonacci tool.
         *
         * Default value is true(uptrend). If the value is false, the downtrending levels are plotted.
         */
        get uptrend(): boolean {
            return this._uptrend;
        }
        set uptrend(value: boolean) {
            if (value != this._uptrend) {
                this._uptrend = asBoolean(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the array of levels for plotting.
         *
         * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
         */
        get levels(): number[] {
            return this._levels;
        }
        set levels(value: number[]) {
            if (value != this._levels) {
                this._levels = asArray(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the x minimal value of the @see:Fibonacci tool.
         * 
         * If not specified, current minimum of x-axis is used. 
         * The value can be specified as a number or Date object.
         */
        get minX(): any {
            return this._minX;
        }
        set minX(value: any) {
            if (value != this._minX) {
                this._minX = value;
                this._invalidate();
            }
        }

        /**
         * Gets or sets the x maximum value of the @see:Fibonacci tool.
         *
         * If not specified, current maximum of x-axis is used. 
         * The value can be specified as a number or Date object.
         */
        get maxX(): any {
            return this._maxX;
        }
        set maxX(value: any) {
            if (value != this._maxX) {
                this._maxX = value;
                this._invalidate();
            }
        }

        /**
         * Gets array of numeric data values for the series.
         *
         * @param dimension The dimension of data: 0 for y-values and 1 for x-values.
         */
        getValues(dimension: number): number[]{
            return null;
        }

        private _getMinX(): number {
            if (isNumber(this._minX)) {
                return this._minX;
            } else if (isDate(this._minX)) {
                return asDate(this._minX).valueOf();
            } else {
                return this._getAxisX().actualMin;
            }
        }

        private _getMaxX(): number {
            if (isNumber(this._maxX)) {
                return this._maxX;
            } else if (isDate(this._maxX)) {
                return asDate(this._maxX).valueOf();
            } else {
                return this._getAxisX().actualMax;
            }
        }

        private _updateLevels() {
            var min = undefined,
                max = undefined;
            if (this._low === undefined || this._high === undefined) {
                var vals = super.getValues(0);
                var xvals = super.getValues(1);
                if (vals) {
                    var len = vals.length;
                    var xmin = this._getMinX(),
                        xmax = this._getMaxX();

                    for (var i = 0; i < len; i++) {
                        var val = vals[i];
                        var xval = xvals ? xvals[i] : i;

                        if (xval < xmin || xval > xmax) {
                            continue;
                        }

                        if (!isNaN(val)) {
                            if (min === undefined || min > val) {
                                min = val;
                            }
                            if (max === undefined || max < val) {
                                max = val;
                            }
                        }
                    }
                }
            }

            if (this._low === undefined && min !== undefined) {
                this._actualLow = min;
            } else {
                this._actualLow = this._low;
            }

            if (this._high === undefined && max !== undefined) {
                this._actualHigh = max;
            } else {
                this._actualHigh = this._high;
            }
        }

        private _render(sender, args: RenderEventArgs) {
            var ser = <Fibonacci>sender;
            ser._updateLevels();

            var ax = ser._getAxisX();
            var ay = ser._getAxisY();
            var eng = args.engine;

            var swidth = 2,
                stroke = ser._getSymbolStroke(ser._chart.series.indexOf(ser));

            var lstyle = _BasePlotter.cloneStyle(ser.style, ['fill']);
            var tstyle = _BasePlotter.cloneStyle(ser.style, ['stroke']);

            eng.stroke = stroke;
            eng.strokeWidth = swidth;
            eng.textFill = stroke;
            
            var xmin = ser._getMinX(),
                xmax = ser._getMaxX();

            if (xmin < ax.actualMin) {
                xmin = ax.actualMin;
            }
            if (xmax > ax.actualMax) {
                xmax = ax.actualMax;
            }

            var llen = ser._levels ? ser._levels.length : 0;
            for (var i = 0; i < llen; i++) {
                var lvl = ser._levels[i];
                var x1 = ax.convert(xmin),
                    x2 = ax.convert(xmax);
                var y = ser.uptrend ?
                    ay.convert(ser._actualLow + 0.01 * lvl * (ser._actualHigh - ser._actualLow)):
                    ay.convert(ser._actualHigh - 0.01 * lvl * (ser._actualHigh - ser._actualLow));

                if (_DataInfo.isValid(x1) && _DataInfo.isValid(x2) && _DataInfo.isValid(y)) {
                    eng.drawLine(x1, y, x2, y, null, lstyle);

                    if (ser.labelPosition!= LabelPosition.None) {
                        var s = lvl.toFixed(1) + '%';
                        var va = 0;
                        if ((ser.uptrend && i == 0) || (!ser.uptrend && i == llen - 1)) {
                            va = 2;
                        } 

                        switch (ser.labelPosition) {
                            case LabelPosition.Left:
                                FlexChartCore._renderText(eng, s, new Point(x1, y), 0, va, null, null, tstyle);
                                break;
                            case LabelPosition.Center:
                                FlexChartCore._renderText(eng, s, new Point( 0.5*(x1+x2), y), 1, va, null, null, tstyle);
                                break;
                            case LabelPosition.Right:
                                FlexChartCore._renderText(eng, s, new Point(x2, y), 2, va, null, null, tstyle);
                                break;
                        }
                    }
                }
            }
        }
    }
} 
