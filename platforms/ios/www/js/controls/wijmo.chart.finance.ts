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
module wijmo.chart.finance {
    "use strict";

    // sum a set of numbers
    export function _sum(...values: number[]): number;
    export function _sum(values: number[]): number;
    export function _sum(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        return values.reduce((prev: number, curr: number) => prev + asNumber(curr), 0);
    }

    // average a set of numbers
    export function _average(...values: number[]): number;
    export function _average(values: number[]): number;
    export function _average(values: any): number {
        if (arguments.length > 1) {
            values = Array.prototype.slice.call(arguments);
        }
        asArray(values, false);
        return _sum(values) / values.length;
    }

    // simplified version of experimental Math.trunc()
    // Math.trunc() on MDN: http://mzl.la/1BY3vHE
    export function _trunc(value: number): number {
        asNumber(value, true, false);
        return value > 0 ? Math.floor(value) : Math.ceil(value);
    }

    // calculate Average True Range for a set of financial data
    export function _avgTrueRng(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
        asArray(highs, false); asArray(lows, false); asArray(closes, false);
        asInt(period, false, true);

        var trs = _trueRng(highs, lows, closes, period),
            len = Math.min(highs.length, lows.length, closes.length, trs.length),
            atrs: number[] = [];
        assert(len > period, "Average True Range period must be less than the length of the data");

        for (var i = 0; i < len; i++) {
            asNumber(highs[i], false); asNumber(lows[i], false); asNumber(closes[i], false); asNumber(trs[i], false);

            if ((i + 1) === period) {
                atrs.push(_average(trs.slice(0, period)));
            } else if ((i + 1) > period) {
                atrs.push(((period - 1) * atrs[atrs.length - 1] + trs[i]) / period);
            }
        }

        return atrs;
    }

    // calculate True Range for a set of financial data
    export function _trueRng(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
        asArray(highs, false); asArray(lows, false); asArray(closes, false);
        asInt(period, false, true);

        var len = Math.min(highs.length, lows.length, closes.length),
            trs: number[] = [];
        assert(len > period, "True Range period must be less than the length of the data");

        for (var i = 0; i < len; i++) {
            asNumber(highs[i], false); asNumber(lows[i], false); asNumber(closes[i], false);

            if (i === 0) {
                trs.push(highs[i] - lows[i]);
            } else {
                trs.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
            }
        }

        return trs;
    }
}
/**
 * Defines the @see:FinancialChart control and its associated classes.
 *
 */
module wijmo.chart.finance {
    'use strict';

    /**
     * Specifies the type of financial chart.
     */
    export enum FinancialChartType {
        /** Shows vertical bars and allows you to compare values of items across categories. */
        Column,
        /** Uses X and Y coordinates to show patterns within the data. */
        Scatter,
        /** Shows trends over a period of time or across categories. */
        Line,
        /** Shows line chart with a symbol on each data point. */
        LineSymbols,
        /** Shows line chart with area below the line filled with color. */
        Area,
        /** Presents items with high, low, open, and close values.
         * The size of the wick line is determined by the High and Low values, while
         * the size of the bar is determined by the Open and Close values. The bar is
         * displayed using different colors, depending on whether the close value is
         * higher or lower than the open value. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty".  */
        Candlestick,
        /** Displays the same information as a candlestick chart, except that opening
         * values are displayed using lines to the left, while lines to the right
         * indicate closing values. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        HighLowOpenClose,
        /** Derived from the candlestick chart and uses information from the current and
         * prior period in order to filter out the noise. These charts cannot be combined
         * with any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        HeikinAshi,
        /** Filters out noise by focusing exclusively on price changes. These charts cannot
         * be combined with any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        LineBreak,
        /** Ignores time and focuses on price changes that meet a specified amount. These
         * charts cannot be combined with any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        Renko,
        /** Ignores time and focuses on price action. These charts cannot be combined with
         * any other series objects. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "highProperty, lowProperty, openProperty, closeProperty". */
        Kagi,
        /** Identical to the standard Column chart, except that the width of each bar is
         * determined by the Volume value. The data for this chart type can be defined using the
         *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
         * following format: "yProperty, volumeProperty".  This chart type can only be used at
         * the @see:FinancialChart level, and should not be applied on
         * @see:FinancialSeries objects. Only one set of volume data is currently supported
         * per @see:FinancialChart. */
        ColumnVolume,
        /** Similar to the Candlestick chart, but shows the high and low values only.
         * In addition, the width of each bar is determined by Volume value. The data for
         * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
         * <b>binding</b> property as a comma separated value in the following format:
         * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
         * This chart type can only be used at the @see:FinancialChart level, and should not
         * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
         * supported per @see:FinancialChart. */
        EquiVolume,
        /** Identical to the standard Candlestick chart, except that the width of each
         * bar is determined by Volume value. The data for
         * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
         * <b>binding</b> property as a comma separated value in the following format:
         * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
         * This chart type can only be used at the @see:FinancialChart level, and should not
         * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
         * supported per @see:FinancialChart. */
        CandleVolume,
        /** Created by Richard Arms, this chart is a combination of EquiVolume and
         * CandleVolume chart types. The data for
         * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
         * <b>binding</b> property as a comma separated value in the following format:
         * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
         * This chart type can only be used at the @see:FinancialChart level, and should not
         * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
         * supported per @see:FinancialChart. */
        ArmsCandleVolume

    }

    /**
     * Financial charting control.
     */
    export class FinancialChart extends FlexChartCore {

        private _chartType = FinancialChartType.Line;

        private __heikinAshiPlotter = null;
        private __lineBreakPlotter = null;
        private __renkoPlotter = null;
        private __kagiPlotter = null;

        /**
         * Initializes a new instance of the @see:FlexChart control.
         *
         * @param element The DOM element that hosts the control, or a selector for the
         * host element (e.g. '#theCtrl').
         * @param options A JavaScript object containing initialization data for the
         * control.
         */
        constructor(element: any, options?) {
            super(element, options);
        }

        /**
         * Gets or sets the type of financial chart to create.
         */
        get chartType(): FinancialChartType {
            return this._chartType;
        }
        set chartType(value: FinancialChartType) {
            if (value != this._chartType) {
                this._chartType = asEnum(value, FinancialChartType);
                this.invalidate();
            }
        }

        /**
         * Gets or sets various chart options.
         *
         * The following options are supported:
         *
         * <b>kagi.fields</b>: Specifies the @see:DataFields used for
         * the Kagi chart. The default value is DataFields.Close.
         *
         * <b>kagi.rangeMode</b>: Specifies the @see:RangeMode for
         * the Kagi chart. The default value is RangeMode.Fixed.
         *
         * <b>kagi.reversalAmount</b>: Specifies the reversal amount for
         * the Kagi chart. The default value is 14.
         *
         * <pre>chart.options = {
         *   kagi: {
         *      fields: wijmo.chart.finance.DataFields.Close,
         *      rangeMode: wijmo.chart.finance.RangeMode.Fixed,
         *      reversalAmount: 14
         *   }
         * }</pre>
         *
         * <b>lineBreak.newLineBreaks</b>: Gets or sets the number of previous
         * boxes that must be compared before a new box is drawn in
         * Line Break charts. The default value is 3.
         *
         * <pre>chart.options = {
         *   lineBreak: { newLineBreaks: 3 }
         * }</pre>
         *
         * <b>renko.fields</b>: Specifies the @see:DataFields used for
         * the Renko chart. The default value is DataFields.Close.
         *
         * <b>renko.rangeMode</b>: Specifies the @see:RangeMode for
         * the Renko chart. The default value is RangeMode.Fixed.
         *
         * <b>renko.boxSize</b>: Specifies the box size for
         * the Renko chart. The default value is 14.
         *
         * <pre>chart.options = {
         *   renko: {
         *      fields: wijmo.chart.finance.DataFields.Close,
         *      rangeMode: wijmo.chart.finance.RangeMode.Fixed,
         *      boxSize: 14
         *   }
         * }</pre>
         */
        get options(): any {
            return this._options;
        }
        set options(value: any) {
            if (value != this._options) {
                this._options = value;
                this.invalidate();
            }
        }

        private get _heikinAshiPlotter(): _IPlotter {
            if (this.__heikinAshiPlotter === null) {
                this.__heikinAshiPlotter = new _HeikinAshiPlotter();
                this._initPlotter(this.__heikinAshiPlotter);
            }
            return this.__heikinAshiPlotter;
        }

        private get _lineBreakPlotter(): _IPlotter {
            if (this.__lineBreakPlotter === null) {
                this.__lineBreakPlotter = new _LineBreakPlotter();
                this._initPlotter(this.__lineBreakPlotter);
            }
            return this.__lineBreakPlotter;
        }

        private get _renkoPlotter(): _IPlotter {
            if (this.__renkoPlotter === null) {
                this.__renkoPlotter = new _RenkoPlotter();
                this._initPlotter(this.__renkoPlotter);
            }
            return this.__renkoPlotter;
        }

        private get _kagiPlotter(): _IPlotter {
            if (this.__kagiPlotter === null) {
                this.__kagiPlotter = new _KagiPlotter();
                this._initPlotter(this.__kagiPlotter);
            }
            return this.__kagiPlotter;
        }

        _getChartType(): chart.ChartType {
            var ct = null;
            switch (this.chartType) {
                case FinancialChartType.Area:
                    ct = chart.ChartType.Area;
                    break;
                case FinancialChartType.Line:
                case FinancialChartType.Kagi:
                    ct = chart.ChartType.Line;
                    break;
                case FinancialChartType.Column:
                case FinancialChartType.ColumnVolume:
                    ct = chart.ChartType.Column;
                    break;
                case FinancialChartType.LineSymbols:
                    ct = chart.ChartType.LineSymbols;
                    break;
                case FinancialChartType.Scatter:
                    ct = chart.ChartType.Scatter;
                    break;
                case FinancialChartType.Candlestick:
                case FinancialChartType.Renko:
                case FinancialChartType.HeikinAshi:
                case FinancialChartType.LineBreak:
                case FinancialChartType.EquiVolume:
                case FinancialChartType.CandleVolume:
                case FinancialChartType.ArmsCandleVolume:
                    ct = chart.ChartType.Candlestick;
                    break;
                case FinancialChartType.HighLowOpenClose:
                    ct = chart.ChartType.HighLowOpenClose;
                    break;
            }

            return ct;
        }

        _getPlotter(series: FinancialSeries): _IPlotter {
            var chartType = this.chartType,
                plotter: any = null,
                isSeries = false;

            if (series) {
                var stype = series.chartType;
                if (stype && !isUndefined(stype) && stype != chartType) {
                    chartType = stype;
                    isSeries = true;
                }
            }

            switch (chartType) {
                case FinancialChartType.HeikinAshi:
                    plotter = this._heikinAshiPlotter;
                    break;
                case FinancialChartType.LineBreak:
                    plotter = this._lineBreakPlotter;
                    break;
                case FinancialChartType.Renko:
                    plotter = this._renkoPlotter;
                    break;
                case FinancialChartType.Kagi:
                    plotter = this._kagiPlotter;
                    break;
                case FinancialChartType.ColumnVolume:
                    plotter = super._getPlotter(series);
                    plotter.isVolume = true;
                    plotter.width = 1;
                    break;
                case FinancialChartType.EquiVolume:
                    plotter = super._getPlotter(series);
                    plotter.isEqui = true;
                    plotter.isCandle = false;
                    plotter.isArms = false;
                    plotter.isVolume = true;
                    plotter.symbolWidth = "100%";
                    break;
                case FinancialChartType.CandleVolume:
                    plotter = super._getPlotter(series);
                    plotter.isEqui = false;
                    plotter.isCandle = true;
                    plotter.isArms = false;
                    plotter.isVolume = true;
                    plotter.symbolWidth = "100%";
                    break;
                case FinancialChartType.ArmsCandleVolume:
                    plotter = super._getPlotter(series);
                    plotter.isEqui = false;
                    plotter.isCandle = false;
                    plotter.isArms = true;
                    plotter.isVolume = true;
                    plotter.symbolWidth = "100%";
                    break;
                // no plotter found for FinancialChartType - try based on ChartType
                default:
                    plotter = super._getPlotter(series);
                    break;
            }

            return plotter;
        }

        _createSeries(): SeriesBase {
            return new FinancialSeries();
        }
    }
}
module wijmo.chart.finance {
    'use strict';

    /**
     * Represents a series of data points to display in the chart.
     *
     * The @see:Series class supports all basic chart types. You may define
     * a different chart type on each @see:Series object that you add to the
     * @see:FlexChart series collection. This overrides the @see:chartType
     * property set on the chart that is the default for all @see:Series objects
     * in its collection.
     */
    export class FinancialSeries extends SeriesBase {
        private _finChartType;

        /**
         * Gets or sets the chart type for a specific series, overriding the chart type
         * set on the overall chart. Please note that ColumnVolume, EquiVolume,
         * CandleVolume and ArmsCandleVolume chart types are not supported and should be
         * set on the @see:FinancialChart.
         */
        get chartType(): FinancialChartType {
            return this._finChartType;
        }
        set chartType(value: FinancialChartType) {
            if (value != this._finChartType) {
                this._finChartType = asEnum(value, FinancialChartType, true);
                this._invalidate();
            }
        }

        _getChartType(): chart.ChartType {
            var ct = null;
            switch (this.chartType) {
                case FinancialChartType.Area:
                    ct = chart.ChartType.Area;
                    break;
                case FinancialChartType.Line:
                case FinancialChartType.Kagi:
                    ct = chart.ChartType.Line;
                    break;
                case FinancialChartType.Column:
                case FinancialChartType.ColumnVolume:
                    ct = chart.ChartType.Column;
                    break;
                case FinancialChartType.LineSymbols:
                    ct = chart.ChartType.LineSymbols;
                    break;
                case FinancialChartType.Scatter:
                    ct = chart.ChartType.Scatter;
                    break;
                case FinancialChartType.Candlestick:
                case FinancialChartType.Renko:
                case FinancialChartType.HeikinAshi:
                case FinancialChartType.LineBreak:
                case FinancialChartType.EquiVolume:
                case FinancialChartType.CandleVolume:
                case FinancialChartType.ArmsCandleVolume:
                    ct = chart.ChartType.Candlestick;
                    break;
                case FinancialChartType.HighLowOpenClose:
                    ct = chart.ChartType.HighLowOpenClose;
                    break;
            }

            return ct;
        }
    }
}
module wijmo.chart.finance {
    "use strict";

    // represents a common return value for calculator implementations
    //  no need for concrete type
    export interface _IFinanceItem {
        high: number;   // max value of start/end
        low: number;    // min value of start/end
        open: number;   // i.e. range start
        close: number;  // i.e. range end
        x: number;
        pointIndex: number; // serves as the original (current) point index
    }

    // common interface for all calculators
    export interface _IFinancialCalculator {
        highs: number[];
        lows: number[];
        opens: number[];
        closes: number[];
        xs?: number[];  // all but heikin-ashi
        size?: number;  // all but heikin-ashi
        unit?: RangeMode; // renko and kagi
        fields?: DataFields; // renko and kagi
        calculate(): any;
    }

    // abstract base class for range based calculators
    export class _BaseCalculator implements _IFinancialCalculator {
        highs: number[];
        lows: number[];
        opens: number[];
        closes: number[];

        constructor(highs: number[], lows: number[], opens: number[], closes: number[]) {
            this.highs = highs;
            this.lows = lows;
            this.opens = opens;
            this.closes = closes;
        }

        calculate(): any { }
    }

    // calculator for Heikin-Ashi plotter - http://bit.ly/1BY55tc
    export class _HeikinAshiCalculator extends _BaseCalculator {
        constructor(highs: number[], lows: number[], opens: number[], closes: number[]) {
            super(highs, lows, opens, closes);
        }

        calculate(): _IFinanceItem[] {
            var len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                haHigh: number, haLow: number, haOpen: number, haClose: number,
                retvals: _IFinanceItem[] = [];

            if (len <= 0) { return retvals; }

            for (var i = 0; i < len; i++) {
                haClose = _average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]);

                if (i === 0) {
                    haOpen = _average(this.opens[i], this.closes[i]);
                    haHigh = this.highs[i];
                    haLow = this.lows[i];
                } else {
                    haOpen = _average(retvals[i - 1].open, retvals[i - 1].close);
                    haHigh = Math.max(this.highs[i], haOpen, haClose);
                    haLow = Math.min(this.lows[i], haOpen, haClose);
                }

                retvals.push({
                    high: haHigh,
                    low: haLow,
                    close: haClose,
                    open: haOpen,
                    pointIndex: i,
                    x: null
                });
            }

            return retvals;
        }
    }

    // abstract base class for range based calculators
    export class _BaseRangeCalculator extends _BaseCalculator {
        xs: number[];
        size: number;
        unit: RangeMode;
        fields: DataFields;

        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit?: RangeMode, fields?: DataFields) {
            super(highs, lows, opens, closes);
            this.xs = xs;
            this.size = size;
            this.unit = unit;
            this.fields = fields;
        }

        // based on "fields" member, return the values to be used for calculations
        //  DataFields.HighLow must be handled in the calculate() method
        _getValues(): number[] {
            var values: number[] = [],
                len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                i: number;

            switch (this.fields) {
                case DataFields.High: {
                    values = this.highs;
                    break;
                }
                case DataFields.Low: {
                    values = this.lows;
                    break;
                }
                case DataFields.Open: {
                    values = this.opens;
                    break;
                }
                case DataFields.HL2: {
                    for (i = 0; i < len; i++) {
                        values.push(_average(this.highs[i], this.lows[i]));
                    }
                    break;
                }
                case DataFields.HLC3: {
                    for (i = 0; i < len; i++) {
                        values.push(_average(this.highs[i], this.lows[i], this.closes[i]));
                    }
                    break;
                }
                case DataFields.HLOC4: {
                    for (i = 0; i < len; i++) {
                        values.push(_average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]));
                    }
                    break;
                }
                case DataFields.Close:
                default: {
                    values = this.closes;
                    break;
                }
            }

            return values;
        }

        _getSize(): number {
            var atrs = this.unit === RangeMode.ATR ? _avgTrueRng(this.highs, this.lows, this.closes, this.size) : null;
            return this.unit === RangeMode.ATR ? atrs[atrs.length - 1] : this.size;
        }
    }

    // calculator for Line Break plotter
    export class _LineBreakCalculator extends _BaseRangeCalculator {
        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number) {
            super(highs, lows, opens, closes, xs, size);
        }

        calculate(): _IFinanceItem[] {
            var hasXs = this.xs !== null && this.xs.length > 0,
                len = this.closes.length,
                retvals: _IFinanceItem[] = [],
                rangeValues: number[][] = [[], []];

            if (len <= 0) { return retvals; }

            var tempRngs: number[] = [],
                basePrice: number,
                x: number, close: number,
                lbLen: number, lbIdx: number,
                max: number, min: number;

            // start at index of one
            for (var i = 1; i < len; i++) {
                lbLen = retvals.length;
                lbIdx = lbLen - 1;
                x = hasXs ? this.xs[i] : i;
                close = this.closes[i];

                if (lbIdx === -1) {
                    basePrice = this.closes[0];
                    if (basePrice === close) { continue; }
                } else {
                    if (this._trendExists(rangeValues) || this.size === 1) {
                        tempRngs = rangeValues[0].slice(-this.size).concat(rangeValues[1].slice(-this.size));
                    } else {
                        tempRngs = rangeValues[0].slice(1 - this.size).concat(rangeValues[1].slice(1 - this.size));
                    }

                    max = Math.max.apply(null, tempRngs);
                    min = Math.min.apply(null, tempRngs);

                    if (close > max) {
                        basePrice = Math.max(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                    } else if (close < min) {
                        basePrice = Math.min(rangeValues[0][lbIdx], rangeValues[1][lbIdx]);
                    } else {
                        continue;
                    }
                }

                rangeValues[0].push(basePrice);
                rangeValues[1].push(close);

                retvals.push({
                    high: Math.max(basePrice, close),
                    low: Math.min(basePrice, close),
                    open: basePrice,
                    close: close,
                    x: x,
                    pointIndex: i
                });
            }

            return retvals;
        }

        private _trendExists(vals: number[][]) {
            if (vals[1].length < this.size) { return false; }

            var retval = false,
                t: number,
                temp = vals[1].slice(-this.size);   // get subset of "current" values based on _newLineBreaks

            // detect rising trend
            for (t = 1; t < this.size; t++) {
                retval = temp[t] > temp[t - 1];
                if (!retval) { break; }
            }
            // detect falling trend
            if (!retval) {
                for (t = 1; t < this.size; t++) {
                    retval = temp[t] < temp[t - 1];
                    if (!retval) { break; }
                }
            }

            return retval;
        }
    }

    // calculator for Kagi plotter
    export class _KagiCalculator extends _BaseRangeCalculator {
        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit: RangeMode, field: DataFields) {
            super(highs, lows, opens, closes, xs, size, unit, field);
        }

        calculate(): _IFinanceItem[] {
            var reversal = this._getSize(),
                len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                values = this._getValues(),
                hasXs = this.xs !== null && this.xs.length > 0,
                retvals: _IFinanceItem[] = [],
                rangeValues: number[][] = [[], []];

            if (len <= 0) { return retvals; }

            var basePrice: number,
                x: number, current: number,
                rLen: number, rIdx: number,
                min: number, max: number,
                diff: number, extend: boolean,
                pointIndex: number;

            for (var i = 1; i < len; i++) {
                rLen = retvals.length;
                rIdx = rLen - 1;
                x = hasXs ? this.xs[i] : i;
                pointIndex = i;
                extend = false;

                // set current value
                if (this.fields === DataFields.HighLow) {
                    if (rIdx === -1) {
                        if (this.highs[i] > this.highs[0]) {
                            current = this.highs[i];
                        } else if (this.lows[i] < this.lows[0]) {
                            current = this.lows[i];
                        } else {
                            continue;
                        }
                    } else {
                        diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                        if (diff > 0) {
                            if (this.highs[i] > rangeValues[1][rIdx]) {
                                current = this.highs[i];
                            } else if (this.lows[i] < rangeValues[1][rIdx]) {
                                current = this.lows[i];
                            } else {
                                continue;
                            }
                        } else {
                            if (this.lows[i] < rangeValues[1][rIdx]) {
                                current = this.lows[i];
                            } else if (this.highs[i] > rangeValues[1][rIdx]) {
                                current = this.highs[i];
                            } else {
                                continue;
                            }
                        }
                    }
                } else {
                    current = values[i];
                }

                // set reversal for percentage-based charts
                if (this.unit === RangeMode.Percentage) {
                    reversal = current * this.size;
                }

                // set base price value
                if (rIdx === -1) {
                    x = hasXs ? this.xs[0] : 0;
                    pointIndex = 0;
                    if (this.fields === DataFields.HighLow) {
                        basePrice = this.highs[0];
                    } else {
                        basePrice = values[0];
                    }
                    diff = Math.abs(basePrice - current);
                    if (diff < reversal) { continue; }
                } else {
                    diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                    max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                    min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);

                    if (diff > 0) { // up
                        if (current > max) {
                            extend = true;
                        } else {
                            diff = max - current;
                            if (diff >= reversal) { // back down
                                basePrice = max;
                            } else {
                                continue;
                            }
                        }
                    } else {    // down
                        if (current < min) {
                            extend = true;
                        } else {
                            diff = current - min;
                            if (diff >= reversal) { // back up
                                basePrice = min;
                            } else {
                                continue;
                            }
                        }
                    }
                }

                if (extend) {   // extend the current range
                    rangeValues[1][rIdx] = current;

                    retvals[rIdx].close = current;
                    retvals[rIdx].high = Math.max(retvals[rIdx].open, retvals[rIdx].close);
                    retvals[rIdx].low = Math.min(retvals[rIdx].open, retvals[rIdx].close);
                } else {    // new range
                    rangeValues[0].push(basePrice);
                    rangeValues[1].push(current);

                    retvals.push({
                        high: Math.max(basePrice, current),
                        low: Math.min(basePrice, current),
                        open: basePrice,
                        close: current,
                        x: x,
                        pointIndex: pointIndex
                    });
                }
            }

            return retvals;
        }
    }

    // calculator for Renko plotter
    export class _RenkoCalculator extends _BaseRangeCalculator {
        rounding: boolean;
        constructor(highs: number[], lows: number[], opens: number[], closes: number[], xs: number[], size: number, unit: RangeMode, field: DataFields, rounding: boolean = false) {
            super(highs, lows, opens, closes, xs, size, unit, field);

            // internal only
            this.rounding = rounding;
        }

        calculate(): _IFinanceItem[] {
            var size = this._getSize(),
                len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length),
                hasXs = this.xs !== null && this.xs.length > 0,
                values = this._getValues(),
                retvals: _IFinanceItem[] = [],
                rangeValues: number[][] = [[], []];

            if (len <= 0) { return retvals; }

            var basePrice: number,
                x: number, current: number,
                rLen: number, rIdx: number,
                min: number, max: number,
                diff: number;

            // start at index of one
            for (var i = 1; i < len; i++) {
                rLen = retvals.length;
                rIdx = rLen - 1;
                x = hasXs ? this.xs[i] : i;

                // todo: not working correctly, figure out
                // set basePrice and current for DataFields == HighLow
                if (this.fields === DataFields.HighLow) {
                    if (rIdx === -1) {
                        if (this.highs[i] - this.highs[0] > size) {
                            basePrice = this.highs[0];
                            current = this.highs[i];
                        } else if (this.lows[0] - this.lows[i] > size) {
                            basePrice = this.lows[0];
                            current = this.lows[i];
                        } else {
                            continue;
                        }
                    } else {
                        min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        if ((this.highs[i] - max) > size) {
                            basePrice = max;
                            current = this.highs[i];
                        } else if ((min - this.lows[i]) > size) {
                            basePrice = min;
                            current = this.lows[i];
                        } else {
                            continue;
                        }
                    }
                } else {    // set basePrice & current for
                            // DataFields != HighLow
                    // current price
                    current = values[i];

                    // set "base price"
                    if (rIdx === -1) {
                        basePrice = values[0];
                    } else {
                        min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                        if (current > max) {
                            basePrice = max;
                        } else if (current < min) {
                            basePrice = min;
                        } else {
                            continue;
                        }
                    }
                }

                diff = current - basePrice;
                if (Math.abs(diff) < size) { continue; }

                // determine number of boxes to add
                diff = _trunc(diff / size);

                // append ranges and x's
                for (var j = 0; j < Math.abs(diff); j++) {
                    var rng: any = {};

                    // note StockCharts adjusts based on size
                    if (this.rounding) {
                        basePrice = this._round(basePrice, size);
                    }

                    rangeValues[0].push(basePrice);
                    rng.open = basePrice;

                    basePrice = diff > 0 ? basePrice + size : basePrice - size;
                    rangeValues[1].push(basePrice);
                    rng.close = basePrice;

                    rng.x = x;
                    rng.pointIndex = i;
                    rng.high = Math.max(rng.open, rng.close);
                    rng.low = Math.min(rng.open, rng.close);

                    retvals.push(rng);
                }
            }

            return retvals;
        }

        // internal only - for StockCharts rounding
        _round(value: number, size: number): number {
            return Math.round(value / size) * size;
        }
    }
}
module wijmo.chart.finance {
    "use strict";

    // Plotter for Heikin-Ashi FinancialChartType
    export class _HeikinAshiPlotter extends _FinancePlotter {
        private _haValues: _IFinanceItem[];
        private _calculator: _BaseCalculator;
        private _symFactor = 0.7;

        constructor() {
            super();
            this.clear();
        }

        clear(): void {
            super.clear();
            this._haValues = null;
            this._calculator = null;
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: FinancialSeries, palette: _IPalette, iser: number, nser: number): void {
            this._calculate(series);

            var ser: SeriesBase = asType(series, SeriesBase),
                si = this.chart.series.indexOf(series),
                xs = series.getValues(1),
                sw = this._symFactor;

            var len = this._haValues.length,
                hasXs = true;

            if (!xs) {
                xs = this.dataInfo.getXVals();
            } else {
                // find mininmal distance between point and use it as column width
                var delta = this.dataInfo.getDeltaX();
                if (delta > 0) {
                    sw *= delta;
                }
            }

            if (!xs) {
                hasXs = false;
                xs = new Array<number>(len);
            } else {
                len = Math.min(len, xs.length);
            }

            var swidth = this._DEFAULT_WIDTH,
                fill = ser._getSymbolFill(si),
                altFill = ser._getAltSymbolFill(si) || "transparent",
                stroke = ser._getSymbolStroke(si),
                altStroke = ser._getAltSymbolStroke(si) || stroke,
                //symSize = ser._getSymbolSize(),
                //symStyle = series.symbolStyle,
                symSize = sw,
                dt = series.getDataType(1) || series.chart._xDataType;

            engine.strokeWidth = swidth;

            var xmin = ax.actualMin,
                xmax = ax.actualMax,
                itemIndex = 0,
                currentFill: string, currentStroke: string,
                x: any, dpt: _DataPoint,
                hi: number, lo: number, open: number, close: number;

            for (var i = 0; i < len; i++) {
                x = hasXs ? xs[i] : i;

                if (_DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                    hi = this._haValues[i].high;
                    lo = this._haValues[i].low;
                    open = this._haValues[i].open;
                    close = this._haValues[i].close;

                    currentFill = open < close ? altFill : fill;
                    currentStroke = open < close ? altStroke : stroke;
                    engine.fill = currentFill;
                    engine.stroke = currentStroke;

                    engine.startGroup();

                    // manually specify values for HitTestInfo
                    dpt = this._getDataPoint(si, i, x, series);

                    if (this.chart.itemFormatter) {
                        var hti = new HitTestInfo(this.chart, new Point(ax.convert(x), ay.convert(hi)), ChartElement.SeriesSymbol);
                        hti._setData(ser, i);
                        hti._setDataPoint(dpt);

                        this.chart.itemFormatter(engine, hti,() => {
                            this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                        });
                    } else {
                        this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                    }
                    engine.endGroup();

                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        }

        // modified variation of FinancialPlotter's implementation - added optional _DataPoint parameter
        _drawSymbol(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, si: number, pi: number, fill: any, w: number,
                    x: number, hi: number, lo: number, open: number, close: number, dpt?: _DataPoint, dt?: DataType) {
            var area: _RectArea,
                y0 = null, y1 = null,
                x1 = null, x2 = null,
                half = dt === DataType.Date ? 43200000 : 0.5;   // todo: better way?

            x1 = ax.convert(x - half * w);
            x2 = ax.convert(x + half * w);
            if (x1 > x2) {
                var tmp = x1; x1 = x2; x2 = tmp;
            }
            x = ax.convert(x);

            if (_DataInfo.isValid(open) && _DataInfo.isValid(close)) {
                open = ay.convert(open);
                close = ay.convert(close);
                y0 = Math.min(open, close);
                y1 = y0 + Math.abs(open - close);

                engine.drawRect(x1, y0, x2 - x1, y1 - y0);

                area = new _RectArea(new Rect(x1, y0, x2 - x1, y1 - y0));
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
            if (_DataInfo.isValid(hi)) {
                hi = ay.convert(hi);
                if (y0 !== null) {
                    engine.drawLine(x, y0, x, hi);
                }
            }
            if (_DataInfo.isValid(lo)) {
                lo = ay.convert(lo);
                if (y1 !== null) {
                    engine.drawLine(x, y1, x, lo);
                }
            }
        }

        // generates _DataPoint for hit test support
        _getDataPoint(seriesIndex: number, pointIndex: number, x: any, series: SeriesBase): _DataPoint {
            var dpt = new _DataPoint(seriesIndex, pointIndex, x, this._haValues[pointIndex].high),
                item = series._getItem(pointIndex),
                bndHigh = series._getBinding(0),
                bndLow = series._getBinding(1),
                bndOpen = series._getBinding(2),
                bndClose = series._getBinding(3),
                ay = series._getAxisY();

            // set item related data and maintain original binding
            dpt["item"] = _BasePlotter.cloneStyle(item, []);
            dpt["item"][bndHigh] = this._haValues[pointIndex].high;
            dpt["item"][bndLow] = this._haValues[pointIndex].low;
            dpt["item"][bndOpen] = this._haValues[pointIndex].open;
            dpt["item"][bndClose] = this._haValues[pointIndex].close;

            // set y related data
            dpt["y"] = this._haValues[pointIndex].high;
            dpt["yfmt"] = ay._formatValue(this._haValues[pointIndex].high);
            // don't set "x" or "xfmt" values - can use default behavior

            return dpt;
        }

        private _calculate(series: FinancialSeries): void {
            var highs = series._getBindingValues(0),
                lows = series._getBindingValues(1),
                opens = series._getBindingValues(2),
                closes = series._getBindingValues(3);

            this._calculator = new _HeikinAshiCalculator(highs, lows, opens, closes);
            this._haValues = this._calculator.calculate();
            if (this._haValues === null || isUndefined(this._haValues)) {
                this._init();
            }
        }

        private _init(): void {
            this._haValues = [];
        }
    }
}
module wijmo.chart.finance {
    "use strict";

    // Abstract plotter for range based FinancialChartTypes
    export class _BaseRangePlotter extends _BasePlotter {
        private _symFactor = 0.7;

        // used for calculating derived data set
        _calculator: _BaseRangeCalculator;

        // storage for derived data set
        _rangeValues: _IFinanceItem[];

        // acts as itemsSource for X-Axis based on derived data set
        _rangeXLabels: any[];

        constructor() {
            super();
            this.clear();
        }

        clear(): void {
            super.clear();
            this._rangeValues = null;
            this._rangeXLabels = null;
            this._calculator = null;
        }

        unload(): void {
            super.unload();

            var series: SeriesBase,
                ax: Axis;

            for (var i = 0; i < this.chart.series.length; i++) {
                series = this.chart.series[i];
                if (!series) { continue; }
                ax = series._getAxisX();

                // reset AxisX.itemsSource
                if (ax && ax.itemsSource) {
                    ax.itemsSource = null;
                }
            }
        }

        // todo: possibly add support for multiple series *later* (i.e. overlays/indicators)
        // todo: better way to adjust x limits?
        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
            var series: FinancialSeries,
                arrTemp: number[], xTemp: number[],
                xmin = 0, xmax = 0,
                ymin = 0, ymax = 0,
                ax: Axis,
                padding = this.chart._xDataType === DataType.Date ? 0.5 : 0;

            // only one supported at the moment - possibly remove later for overlays & indicators
            assert(this.chart.series.length <= 1, "Current FinancialChartType only supports a single series");

            // looping for future - will need adjusted (see above)
            for (var i = 0; i < this.chart.series.length; i++) {
                series = this.chart.series[i];
                this._calculate(series);

                if (this._rangeValues.length <= 0 || this._rangeXLabels.length <= 0) { continue; }

                // create temporary array for calculating ymin & ymax
                arrTemp = this._rangeValues.map((value: _IFinanceItem) => value.open);
                arrTemp.push.apply(arrTemp, this._rangeValues.map((value: _IFinanceItem) => value.close));

                // create temp array for xmin & xmax
                xTemp = this._rangeXLabels.map((current) => current.value);

                // update y-axis
                ymin = Math.min.apply(null, arrTemp);
                ymax = Math.max.apply(null, arrTemp);

                // update x-axis and set itemsSource
                xmin = Math.min.apply(null, xTemp);
                xmax = Math.max.apply(null, xTemp);
                ax = series._getAxisX();
                ax.itemsSource = this._rangeXLabels;
            }

            xmin -= padding;
            return new Rect(xmin, ymin, xmax - xmin + padding, ymax - ymin);
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: FinancialSeries, palette: _IPalette, iser: number, nser: number): void {
            this._calculate(series);

            var si = this.chart.series.indexOf(series),
                len = this._rangeValues.length,
                xmin = ax.actualMin,
                xmax = ax.actualMax,
                strWidth = this._DEFAULT_WIDTH,
                symSize = this._symFactor,
                fill = series._getSymbolFill(si),
                altFill = series._getAltSymbolFill(si) || "transparent",
                stroke = series._getSymbolStroke(si),
                altStroke = series._getAltSymbolStroke(si) || stroke;

            engine.strokeWidth = strWidth;

            var itemIndex = 0,
                x: number, start: number, end: number,
                dpt: _DataPoint;

            for (var i = 0; i < len; i++) {
                x = i;
                if (_DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                    start = this._rangeValues[i].open;
                    end = this._rangeValues[i].close;

                    // symbol fill and stroke
                    engine.fill = start > end ? fill : altFill;
                    engine.stroke = start > end ? stroke : altStroke;

                    // manaully specify values for HitTestInfo
                    // for Bars - dataY should be the top of the bar
                    dpt = this._getDataPoint(si, i, series, Math.max(start, end));

                    engine.startGroup();

                    if (this.chart.itemFormatter) {
                        var hti = new HitTestInfo(this.chart, new Point(ax.convert(x), ay.convert(end)), ChartElement.SeriesSymbol);
                        hti._setData(series, i);
                        hti._setDataPoint(dpt);

                        this.chart.itemFormatter(engine, hti, () => {
                            this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                        });
                    } else {
                        this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                    }

                    engine.endGroup();

                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        }

        _drawSymbol(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, si: number, pi: number, w: number, x: number, start: number, end: number, dpt: _DataPoint): void {
            var y0: number, y1: number,
                x1: number, x2: number,
                area: _IHitArea;

            x1 = ax.convert(x - 0.5 * w);
            x2 = ax.convert(x + 0.5 * w);
            if (x1 > x2) {
                var tmp = x1; x1 = x2; x2 = tmp;
            }
            //x = ax.convert(x);

            if (_DataInfo.isValid(start) && _DataInfo.isValid(end)) {
                start = ay.convert(start);
                end = ay.convert(end);
                y0 = Math.min(start, end);
                y1 = y0 + Math.abs(start - end);

                engine.drawRect(x1, y0, x2 - x1, y1 - y0);

                area = new _RectArea(new Rect(x1, y0, x2 - x1, y1 - y0));
                area.tag = dpt;
                this.hitTester.add(area, si);
            }
        }

        // generates _DataPoint for hit test support
        _getDataPoint(seriesIndex: number, pointIndex: number, series: SeriesBase, dataY: number): _DataPoint {
            var x = pointIndex,
                dpt = new _DataPoint(seriesIndex, pointIndex, x, dataY),
                item = series._getItem(this._rangeValues[pointIndex].pointIndex),
                bndX = series.bindingX || this.chart.bindingX,
                bndHigh = series._getBinding(0),
                bndLow = series._getBinding(1),
                bndOpen = series._getBinding(2),
                bndClose = series._getBinding(3),
                ay = series._getAxisY();

            // set item related data and maintain original bindings
            dpt["item"] = _BasePlotter.cloneStyle(item, []);
            dpt["item"][bndHigh] = this._rangeValues[pointIndex].high;
            dpt["item"][bndLow] = this._rangeValues[pointIndex].low;
            dpt["item"][bndOpen] = this._rangeValues[pointIndex].open;
            dpt["item"][bndClose] = this._rangeValues[pointIndex].close;

            // set x & y related data
            dpt["y"] = this._rangeValues[pointIndex].close;
            dpt["yfmt"] = ay._formatValue(this._rangeValues[pointIndex].close);
            dpt["x"] = dpt["item"][bndX];
            dpt["xfmt"] = this._rangeXLabels[pointIndex]._text;

            return dpt;
        }

        // initialize variables for calculations
        _init(): void {
            this._rangeValues = [];
            this._rangeXLabels = [];
        }

        // abstract method
        _calculate(series: FinancialSeries): void { }

        // generates new labels for the x-axis based on derived data
        _generateXLabels(series: FinancialSeries): void {
            var textVal: string,
                ax = series._getAxisX(),
                dataType = series.getDataType(1) || this.chart._xDataType;

            // todo: find a better way and/or separate
            this._rangeValues.forEach((value: _IFinanceItem, index: number) => {
                var val = value.x;
                if (dataType === DataType.Date) {
                    textVal = Globalize.format(FlexChart._fromOADate(val), ax.format || "d");
                } else if (dataType === DataType.Number) {
                    textVal = ax._formatValue(val);
                } else if ((dataType === null || dataType === DataType.String) && this.chart._xlabels) {
                    textVal = this.chart._xlabels[val];
                } else {
                    textVal = val.toString();
                }

                // _text property will be used as a backup for the text property
                // there could be cases, like Renko, where text is cleared
                this._rangeXLabels.push({ value: index, text: textVal, _text: textVal });
            }, this);
        }

        // provides access to any value within FlexChartCore's "options" property
        getOption(name: string, parent?: string): any {
            var options = this.chart.options;
            if (parent) {
                options = options ? options[parent] : null;
            }
            if (options && !isUndefined(options[name]) && options[name] !== null) {
                return options[name];
            }
            return undefined;
        }
    }

    /**
     * Specifies which fields are to be used for calculation. Applies to Renko and Kagi chart types.
     */
    export enum DataFields {
        /** Close values are used for calculations. */
        Close,
        /** High values are used for calculations. */
        High,
        /** Low values are used for calculations. */
        Low,
        /** Open values are used for calculations. */
        Open,
        /** High-Low method is used for calculations. DataFields.HighLow is currently not
         * supported with Renko chart types. */
        HighLow,
        /** Average of high and low values is used for calculations. */
        HL2,
        /** Average of high, low, and close values is used for calculations. */
        HLC3,
        /** Average of high, low, open, and close values is used for calculations. */
        HLOC4
    }

    /**
     * Specifies the unit for Kagi and Renko chart types.
     */
    export enum RangeMode {
        /** Uses a fixed, positive number for the Kagi chart's reversal amount
         * or Renko chart's box size. */
        Fixed,
        /** Uses the current Average True Range value for Kagi chart's reversal amount
         * or Renko chart's box size. When ATR is used, the reversal amount or box size
         * option of these charts must be an integer and will be used as the period for 
         * the ATR calculation. */
        ATR,
        /** Uses a percentage for the Kagi chart's reversal amount. RangeMode.Percentage
         * is currently not supported with Renko chart types. */
        Percentage
    }
}
module wijmo.chart.finance {
    "use strict";

    // Plotter for Line Break FinancialChartType
    export class _LineBreakPlotter extends _BaseRangePlotter {
        // specifies number of lines that need to be broken in order for a reversal to occur
        private _newLineBreaks: number;

        constructor() {
            super();
        }

        clear(): void {
            super.clear();
            this._newLineBreaks = null;
        }

        _calculate(series: FinancialSeries): void {
            this._init();

            var closes = series._getBindingValues(3),
                xs = series.getValues(1) || this.chart._xvals;

            this._calculator = new _LineBreakCalculator(null, null, null, closes, xs, this._newLineBreaks);
            this._rangeValues = this._calculator.calculate();
            if (this._rangeValues === null || isUndefined(this._rangeValues)) {
                this._rangeValues = [];
            }

            // always regenerate x-axis labels at the end of each calculation cycle
            this._generateXLabels(series);
        }

        _init(): void {
            super._init();

            // NewLineBreaks
            this._newLineBreaks = asInt(this.getNumOption("newLineBreaks", "lineBreak"), true, true) || 3;
            assert(this._newLineBreaks >= 1, "Value must be greater than 1");
        }
    }
}
module wijmo.chart.finance {
    "use strict";

    // Plotter for Renko FinancialChartType
    export class _RenkoPlotter extends _BaseRangePlotter {
        // brick size or period - based on units
        private _boxSize: number;

        // mode for brick size
        private _rangeMode: RangeMode;

        // fields(s) to use in calculations
        private _fields: DataFields;

        // for stockcharts rounding
        private _rounding: boolean;

        constructor() {
            super();
        }

        clear(): void {
            super.clear();
            this._boxSize = null;
            this._rangeMode = null;
        }

        _calculate(series: FinancialSeries): void {
            this._init();

            var highs = series._getBindingValues(0),
                lows = series._getBindingValues(1),
                opens = series._getBindingValues(2),
                closes = series._getBindingValues(3),
                xs = series.getValues(1) || this.chart._xvals;

            this._calculator = new _RenkoCalculator(highs, lows, opens, closes, xs, this._boxSize, this._rangeMode, this._fields, this._rounding);
            this._rangeValues = this._calculator.calculate();
            if (this._rangeValues === null || isUndefined(this._rangeValues)) {
                this._rangeValues = [];
            }

            // always regenerate x-axis labels at the end of each calculation cycle
            this._generateXLabels(series);
        }

        _init(): void {
            super._init();

            // BoxSize
            this._boxSize = this.getNumOption("boxSize", "renko") || 14;

            // RangeMode
            this._rangeMode = this.getOption("rangeMode", "renko") || RangeMode.Fixed;
            this._rangeMode = asEnum(this._rangeMode, RangeMode, true);
            assert(this._rangeMode !== RangeMode.Percentage, "RangeMode.Percentage is not supported");

            // DataFields
            this._fields = this.getOption("fields", "renko") || DataFields.Close;
            this._fields = asEnum(this._fields, DataFields, true);
            // todo: figure out HighLow
            assert(this._fields !== DataFields.HighLow, "DataFields.HighLow is not supported");

            // rounding - internal only
            this._rounding = asBoolean(this.getOption("rounding", "renko"), true);
        }

        _generateXLabels(series: FinancialSeries): void {
            super._generateXLabels(series);

            // bricks may have duplicate x-labels - prevent that behavior
            this._rangeXLabels.forEach((value: any, index: number) => {
                // compare current item's text property to the previous item's _text property (backup for text)
                if (index > 0 && this._rangeXLabels[index - 1]._text === value.text) {
                    value.text = "";
                }
            }, this);
        }
    }
}
module wijmo.chart.finance {
    "use strict";

    // Plotter for Kagi FinancialChartType
    export class _KagiPlotter extends _BaseRangePlotter {
        // reversal amount, period, or percentage - based on unit
        private _reversalAmount: number;

        // unit for reversal
        private _rangeMode: RangeMode;

        // fields(s) to use in calculations
        private _fields: DataFields;

        constructor() {
            super();
        }

        _calculate(series: FinancialSeries): void {
            this._init();

            var highs = series._getBindingValues(0),
                lows = series._getBindingValues(1),
                opens = series._getBindingValues(2),
                closes = series._getBindingValues(3),
                xs = series.getValues(1) || this.chart._xvals;

            this._calculator = new _KagiCalculator(highs, lows, opens, closes, xs, this._reversalAmount, this._rangeMode, this._fields);
            this._rangeValues = this._calculator.calculate();
            if (this._rangeValues === null || isUndefined(this._rangeValues)) {
                this._rangeValues = [];
            }

            // always regenerate x-axis labels at the end of each calculation cycle
            this._generateXLabels(series);
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: FinancialSeries, palette: _IPalette, iser: number, nser: number): void {
            this._calculate(series);

            var si = this.chart.series.indexOf(series),
                len = this._rangeValues.length,
                xmin = ax.actualMin,
                xmax = ax.actualMax,
                strWidth = this._DEFAULT_WIDTH,
                stroke = series._getSymbolStroke(si),
                altStroke = series._getAltSymbolStroke(si) || stroke,
                dx: number[] = [], dy: number[] = [];

            engine.stroke = stroke;
            engine.strokeWidth = strWidth;

            var itemIndex = 0, x: number,
                start: number, end: number,
                min: number, max: number,
                area: _IHitArea, dpt: _DataPoint;

            engine.startGroup();
            for (var i = 0; i < len; i++) {
                x = i;
                if (_DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                    start = this._rangeValues[i].open;
                    end = this._rangeValues[i].close;

                    // main (vertical) line
                    if (i === 0) {
                        min = Math.min(start, end);
                        max = Math.max(start, end);

                        // determine thinkness
                        engine.strokeWidth = start > end ? strWidth : strWidth * 2;

                        // determine stroke
                        engine.stroke = start > end ? stroke : altStroke;

                        // main line
                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));

                        // initial inflection line
                        engine.drawLine(ax.convert(x - 1) - (engine.strokeWidth / 2), ay.convert(start), ax.convert(x) + (engine.strokeWidth / 2), ay.convert(start));
                    } else if (engine.strokeWidth === strWidth) {   // currently yin/thin/down
                        if (end > start) {  // up
                            if (end > max) {
                                // change in thickness
                                engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(max));
                                engine.strokeWidth = strWidth * 2;
                                engine.stroke = altStroke;
                                engine.drawLine(ax.convert(x), ay.convert(max), ax.convert(x), ay.convert(end));

                                // new min
                                min = start;
                            } else {
                                // maintain current thickness
                                engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                            }

                            // new max
                            max = end;
                        } else {  // down
                            engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                        }
                    } else if ((engine.strokeWidth / 2) === strWidth) { // currently yang/thick/up
                        if (end < start) {  // down
                            if (end < min) {
                                // change in thickness
                                engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(min));
                                engine.strokeWidth = strWidth;
                                engine.stroke = stroke;
                                engine.drawLine(ax.convert(x), ay.convert(min), ax.convert(x), ay.convert(end));

                                // new max
                                max = start;
                            } else {
                                // maintain thickness
                                engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                            }

                            // new min
                            min = end;
                        } else {  // up
                            engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                        }
                    }

                    // inflection (horizontal) line
                    if (i < (len - 1)) {
                        // x needs to account for engine.strokeWidth, after conversion, to prevent corner gaps
                        // where horizontal and vertical lines meet
                        engine.drawLine(ax.convert(x) - (engine.strokeWidth / 2), ay.convert(end), ax.convert(x + 1) + (engine.strokeWidth / 2), ay.convert(end));
                    }

                    // manaully specify values for HitTestInfo
                    dpt = this._getDataPoint(si, i, series, end);

                    // add item to HitTester
                    area = new _CircleArea(new Point(ax.convert(x), ay.convert(end)), 0.5 * engine.strokeWidth);
                    area.tag = dpt;
                    this.hitTester.add(area, si);

                    // point index
                    series._setPointIndex(i, itemIndex);
                    itemIndex++;

                    // append x/y values to collection for _LinesArea which
                    // is needed for selection
                    dx.push(ax.convert(x));
                    dy.push(ay.convert(start));
                    dx.push(ax.convert(x));
                    dy.push(ay.convert(end));
                }
            }
            engine.endGroup();

            // add _LinesArea for selection
            this.hitTester.add(new _LinesArea(dx, dy), si);
        }

        _init(): void {
            super._init();

            // ReversalAmount
            this._reversalAmount = this.getNumOption("reversalAmount", "kagi") || 14;

            // RangeMode
            this._rangeMode = this.getOption("rangeMode", "kagi") || RangeMode.Fixed;
            this._rangeMode = asEnum(this._rangeMode, RangeMode, true);

            // DataFields
            this._fields = this.getOption("fields", "kagi") || DataFields.Close;
            this._fields = asEnum(this._fields, DataFields, true);
        }

        clear(): void {
            super.clear();
            this._reversalAmount = null;
            this._rangeMode = null;
        }
    }
}
