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
    (function (chart) {
        (function (finance) {
            "use strict";

            

            function _sum(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                return values.reduce(function (prev, curr) {
                    return prev + wijmo.asNumber(curr);
                }, 0);
            }
            finance._sum = _sum;

            

            function _average(values) {
                if (arguments.length > 1) {
                    values = Array.prototype.slice.call(arguments);
                }
                wijmo.asArray(values, false);
                return _sum(values) / values.length;
            }
            finance._average = _average;

            // simplified version of experimental Math.trunc()
            // Math.trunc() on MDN: http://mzl.la/1BY3vHE
            function _trunc(value) {
                wijmo.asNumber(value, true, false);
                return value > 0 ? Math.floor(value) : Math.ceil(value);
            }
            finance._trunc = _trunc;

            // calculate Average True Range for a set of financial data
            function _avgTrueRng(highs, lows, closes, period) {
                if (typeof period === "undefined") { period = 14; }
                wijmo.asArray(highs, false);
                wijmo.asArray(lows, false);
                wijmo.asArray(closes, false);
                wijmo.asInt(period, false, true);

                var trs = _trueRng(highs, lows, closes, period), len = Math.min(highs.length, lows.length, closes.length, trs.length), atrs = [];
                wijmo.assert(len > period, "Average True Range period must be less than the length of the data");

                for (var i = 0; i < len; i++) {
                    wijmo.asNumber(highs[i], false);
                    wijmo.asNumber(lows[i], false);
                    wijmo.asNumber(closes[i], false);
                    wijmo.asNumber(trs[i], false);

                    if ((i + 1) === period) {
                        atrs.push(_average(trs.slice(0, period)));
                    } else if ((i + 1) > period) {
                        atrs.push(((period - 1) * atrs[atrs.length - 1] + trs[i]) / period);
                    }
                }

                return atrs;
            }
            finance._avgTrueRng = _avgTrueRng;

            // calculate True Range for a set of financial data
            function _trueRng(highs, lows, closes, period) {
                if (typeof period === "undefined") { period = 14; }
                wijmo.asArray(highs, false);
                wijmo.asArray(lows, false);
                wijmo.asArray(closes, false);
                wijmo.asInt(period, false, true);

                var len = Math.min(highs.length, lows.length, closes.length), trs = [];
                wijmo.assert(len > period, "True Range period must be less than the length of the data");

                for (var i = 0; i < len; i++) {
                    wijmo.asNumber(highs[i], false);
                    wijmo.asNumber(lows[i], false);
                    wijmo.asNumber(closes[i], false);

                    if (i === 0) {
                        trs.push(highs[i] - lows[i]);
                    } else {
                        trs.push(Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1])));
                    }
                }

                return trs;
            }
            finance._trueRng = _trueRng;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Utils.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        /**
        * Defines the @see:FinancialChart control and its associated classes.
        *
        */
        (function (finance) {
            'use strict';

            /**
            * Specifies the type of financial chart.
            */
            (function (FinancialChartType) {
                /** Shows vertical bars and allows you to compare values of items across categories. */
                FinancialChartType[FinancialChartType["Column"] = 0] = "Column";

                /** Uses X and Y coordinates to show patterns within the data. */
                FinancialChartType[FinancialChartType["Scatter"] = 1] = "Scatter";

                /** Shows trends over a period of time or across categories. */
                FinancialChartType[FinancialChartType["Line"] = 2] = "Line";

                /** Shows line chart with a symbol on each data point. */
                FinancialChartType[FinancialChartType["LineSymbols"] = 3] = "LineSymbols";

                /** Shows line chart with area below the line filled with color. */
                FinancialChartType[FinancialChartType["Area"] = 4] = "Area";

                /** Presents items with high, low, open, and close values.
                * The size of the wick line is determined by the High and Low values, while
                * the size of the bar is determined by the Open and Close values. The bar is
                * displayed using different colors, depending on whether the close value is
                * higher or lower than the open value. The data for this chart type can be defined using the
                *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                * following format: "highProperty, lowProperty, openProperty, closeProperty".  */
                FinancialChartType[FinancialChartType["Candlestick"] = 5] = "Candlestick";

                /** Displays the same information as a candlestick chart, except that opening
                * values are displayed using lines to the left, while lines to the right
                * indicate closing values. The data for this chart type can be defined using the
                *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["HighLowOpenClose"] = 6] = "HighLowOpenClose";

                /** Derived from the candlestick chart and uses information from the current and
                * prior period in order to filter out the noise. These charts cannot be combined
                * with any other series objects. The data for this chart type can be defined using the
                *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["HeikinAshi"] = 7] = "HeikinAshi";

                /** Filters out noise by focusing exclusively on price changes. These charts cannot
                * be combined with any other series objects. The data for this chart type can be defined using the
                *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["LineBreak"] = 8] = "LineBreak";

                /** Ignores time and focuses on price changes that meet a specified amount. These
                * charts cannot be combined with any other series objects. The data for this chart type can be defined using the
                *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["Renko"] = 9] = "Renko";

                /** Ignores time and focuses on price action. These charts cannot be combined with
                * any other series objects. The data for this chart type can be defined using the
                *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                * following format: "highProperty, lowProperty, openProperty, closeProperty". */
                FinancialChartType[FinancialChartType["Kagi"] = 10] = "Kagi";

                /** Identical to the standard Column chart, except that the width of each bar is
                * determined by the Volume value. The data for this chart type can be defined using the
                *  @see:FinancialChart or @see:FinancialSeries <b>binding</b> property as a comma separated value in the
                * following format: "yProperty, volumeProperty".  This chart type can only be used at
                * the @see:FinancialChart level, and should not be applied on
                * @see:FinancialSeries objects. Only one set of volume data is currently supported
                * per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["ColumnVolume"] = 11] = "ColumnVolume";

                /** Similar to the Candlestick chart, but shows the high and low values only.
                * In addition, the width of each bar is determined by Volume value. The data for
                * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
                * <b>binding</b> property as a comma separated value in the following format:
                * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
                * This chart type can only be used at the @see:FinancialChart level, and should not
                * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
                * supported per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["EquiVolume"] = 12] = "EquiVolume";

                /** Identical to the standard Candlestick chart, except that the width of each
                * bar is determined by Volume value. The data for
                * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
                * <b>binding</b> property as a comma separated value in the following format:
                * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
                * This chart type can only be used at the @see:FinancialChart level, and should not
                * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
                * supported per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["CandleVolume"] = 13] = "CandleVolume";

                /** Created by Richard Arms, this chart is a combination of EquiVolume and
                * CandleVolume chart types. The data for
                * this chart type can be defined using the  @see:FinancialChart or @see:FinancialSeries
                * <b>binding</b> property as a comma separated value in the following format:
                * "highProperty, lowProperty, openProperty, closeProperty, volumeProperty".
                * This chart type can only be used at the @see:FinancialChart level, and should not
                * be applied on @see:FinancialSeries objects. Only one set of volume data is currently
                * supported per @see:FinancialChart. */
                FinancialChartType[FinancialChartType["ArmsCandleVolume"] = 14] = "ArmsCandleVolume";
            })(finance.FinancialChartType || (finance.FinancialChartType = {}));
            var FinancialChartType = finance.FinancialChartType;

            /**
            * Financial charting control.
            */
            var FinancialChart = (function (_super) {
                __extends(FinancialChart, _super);
                /**
                * Initializes a new instance of the @see:FlexChart control.
                *
                * @param element The DOM element that hosts the control, or a selector for the
                * host element (e.g. '#theCtrl').
                * @param options A JavaScript object containing initialization data for the
                * control.
                */
                function FinancialChart(element, options) {
                    _super.call(this, element, options);
                    this._chartType = 2 /* Line */;
                    this.__heikinAshiPlotter = null;
                    this.__lineBreakPlotter = null;
                    this.__renkoPlotter = null;
                    this.__kagiPlotter = null;
                }
                Object.defineProperty(FinancialChart.prototype, "chartType", {
                    /**
                    * Gets or sets the type of financial chart to create.
                    */
                    get: function () {
                        return this._chartType;
                    },
                    set: function (value) {
                        if (value != this._chartType) {
                            this._chartType = wijmo.asEnum(value, FinancialChartType);
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FinancialChart.prototype, "options", {
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
                    get: function () {
                        return this._options;
                    },
                    set: function (value) {
                        if (value != this._options) {
                            this._options = value;
                            this.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FinancialChart.prototype, "_heikinAshiPlotter", {
                    get: function () {
                        if (this.__heikinAshiPlotter === null) {
                            this.__heikinAshiPlotter = new finance._HeikinAshiPlotter();
                            this._initPlotter(this.__heikinAshiPlotter);
                        }
                        return this.__heikinAshiPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FinancialChart.prototype, "_lineBreakPlotter", {
                    get: function () {
                        if (this.__lineBreakPlotter === null) {
                            this.__lineBreakPlotter = new finance._LineBreakPlotter();
                            this._initPlotter(this.__lineBreakPlotter);
                        }
                        return this.__lineBreakPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FinancialChart.prototype, "_renkoPlotter", {
                    get: function () {
                        if (this.__renkoPlotter === null) {
                            this.__renkoPlotter = new finance._RenkoPlotter();
                            this._initPlotter(this.__renkoPlotter);
                        }
                        return this.__renkoPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(FinancialChart.prototype, "_kagiPlotter", {
                    get: function () {
                        if (this.__kagiPlotter === null) {
                            this.__kagiPlotter = new finance._KagiPlotter();
                            this._initPlotter(this.__kagiPlotter);
                        }
                        return this.__kagiPlotter;
                    },
                    enumerable: true,
                    configurable: true
                });

                FinancialChart.prototype._getChartType = function () {
                    var ct = null;
                    switch (this.chartType) {
                        case 4 /* Area */:
                            ct = 5 /* Area */;
                            break;
                        case 2 /* Line */:
                        case 10 /* Kagi */:
                            ct = 3 /* Line */;
                            break;
                        case 0 /* Column */:
                        case 11 /* ColumnVolume */:
                            ct = 0 /* Column */;
                            break;
                        case 3 /* LineSymbols */:
                            ct = 4 /* LineSymbols */;
                            break;
                        case 1 /* Scatter */:
                            ct = 2 /* Scatter */;
                            break;
                        case 5 /* Candlestick */:
                        case 9 /* Renko */:
                        case 7 /* HeikinAshi */:
                        case 8 /* LineBreak */:
                        case 12 /* EquiVolume */:
                        case 13 /* CandleVolume */:
                        case 14 /* ArmsCandleVolume */:
                            ct = 7 /* Candlestick */;
                            break;
                        case 6 /* HighLowOpenClose */:
                            ct = 8 /* HighLowOpenClose */;
                            break;
                    }

                    return ct;
                };

                FinancialChart.prototype._getPlotter = function (series) {
                    var chartType = this.chartType, plotter = null, isSeries = false;

                    if (series) {
                        var stype = series.chartType;
                        if (stype && !wijmo.isUndefined(stype) && stype != chartType) {
                            chartType = stype;
                            isSeries = true;
                        }
                    }

                    switch (chartType) {
                        case 7 /* HeikinAshi */:
                            plotter = this._heikinAshiPlotter;
                            break;
                        case 8 /* LineBreak */:
                            plotter = this._lineBreakPlotter;
                            break;
                        case 9 /* Renko */:
                            plotter = this._renkoPlotter;
                            break;
                        case 10 /* Kagi */:
                            plotter = this._kagiPlotter;
                            break;
                        case 11 /* ColumnVolume */:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isVolume = true;
                            plotter.width = 1;
                            break;
                        case 12 /* EquiVolume */:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = true;
                            plotter.isCandle = false;
                            plotter.isArms = false;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        case 13 /* CandleVolume */:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = false;
                            plotter.isCandle = true;
                            plotter.isArms = false;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;
                        case 14 /* ArmsCandleVolume */:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            plotter.isEqui = false;
                            plotter.isCandle = false;
                            plotter.isArms = true;
                            plotter.isVolume = true;
                            plotter.symbolWidth = "100%";
                            break;

                        default:
                            plotter = _super.prototype._getPlotter.call(this, series);
                            break;
                    }

                    return plotter;
                };

                FinancialChart.prototype._createSeries = function () {
                    return new finance.FinancialSeries();
                };
                return FinancialChart;
            })(chart.FlexChartCore);
            finance.FinancialChart = FinancialChart;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FinancialChart.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        (function (finance) {
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
            var FinancialSeries = (function (_super) {
                __extends(FinancialSeries, _super);
                function FinancialSeries() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(FinancialSeries.prototype, "chartType", {
                    /**
                    * Gets or sets the chart type for a specific series, overriding the chart type
                    * set on the overall chart. Please note that ColumnVolume, EquiVolume,
                    * CandleVolume and ArmsCandleVolume chart types are not supported and should be
                    * set on the @see:FinancialChart.
                    */
                    get: function () {
                        return this._finChartType;
                    },
                    set: function (value) {
                        if (value != this._finChartType) {
                            this._finChartType = wijmo.asEnum(value, finance.FinancialChartType, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                FinancialSeries.prototype._getChartType = function () {
                    var ct = null;
                    switch (this.chartType) {
                        case 4 /* Area */:
                            ct = 5 /* Area */;
                            break;
                        case 2 /* Line */:
                        case 10 /* Kagi */:
                            ct = 3 /* Line */;
                            break;
                        case 0 /* Column */:
                        case 11 /* ColumnVolume */:
                            ct = 0 /* Column */;
                            break;
                        case 3 /* LineSymbols */:
                            ct = 4 /* LineSymbols */;
                            break;
                        case 1 /* Scatter */:
                            ct = 2 /* Scatter */;
                            break;
                        case 5 /* Candlestick */:
                        case 9 /* Renko */:
                        case 7 /* HeikinAshi */:
                        case 8 /* LineBreak */:
                        case 12 /* EquiVolume */:
                        case 13 /* CandleVolume */:
                        case 14 /* ArmsCandleVolume */:
                            ct = 7 /* Candlestick */;
                            break;
                        case 6 /* HighLowOpenClose */:
                            ct = 8 /* HighLowOpenClose */;
                            break;
                    }

                    return ct;
                };
                return FinancialSeries;
            })(chart.SeriesBase);
            finance.FinancialSeries = FinancialSeries;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FinancialSeries.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        (function (finance) {
            "use strict";

            

            

            // abstract base class for range based calculators
            var _BaseCalculator = (function () {
                function _BaseCalculator(highs, lows, opens, closes) {
                    this.highs = highs;
                    this.lows = lows;
                    this.opens = opens;
                    this.closes = closes;
                }
                _BaseCalculator.prototype.calculate = function () {
                };
                return _BaseCalculator;
            })();
            finance._BaseCalculator = _BaseCalculator;

            // calculator for Heikin-Ashi plotter - http://bit.ly/1BY55tc
            var _HeikinAshiCalculator = (function (_super) {
                __extends(_HeikinAshiCalculator, _super);
                function _HeikinAshiCalculator(highs, lows, opens, closes) {
                    _super.call(this, highs, lows, opens, closes);
                }
                _HeikinAshiCalculator.prototype.calculate = function () {
                    var len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), haHigh, haLow, haOpen, haClose, retvals = [];

                    if (len <= 0) {
                        return retvals;
                    }

                    for (var i = 0; i < len; i++) {
                        haClose = finance._average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]);

                        if (i === 0) {
                            haOpen = finance._average(this.opens[i], this.closes[i]);
                            haHigh = this.highs[i];
                            haLow = this.lows[i];
                        } else {
                            haOpen = finance._average(retvals[i - 1].open, retvals[i - 1].close);
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
                };
                return _HeikinAshiCalculator;
            })(_BaseCalculator);
            finance._HeikinAshiCalculator = _HeikinAshiCalculator;

            // abstract base class for range based calculators
            var _BaseRangeCalculator = (function (_super) {
                __extends(_BaseRangeCalculator, _super);
                function _BaseRangeCalculator(highs, lows, opens, closes, xs, size, unit, fields) {
                    _super.call(this, highs, lows, opens, closes);
                    this.xs = xs;
                    this.size = size;
                    this.unit = unit;
                    this.fields = fields;
                }
                // based on "fields" member, return the values to be used for calculations
                //  DataFields.HighLow must be handled in the calculate() method
                _BaseRangeCalculator.prototype._getValues = function () {
                    var values = [], len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), i;

                    switch (this.fields) {
                        case 1 /* High */: {
                            values = this.highs;
                            break;
                        }
                        case 2 /* Low */: {
                            values = this.lows;
                            break;
                        }
                        case 3 /* Open */: {
                            values = this.opens;
                            break;
                        }
                        case 5 /* HL2 */: {
                            for (i = 0; i < len; i++) {
                                values.push(finance._average(this.highs[i], this.lows[i]));
                            }
                            break;
                        }
                        case 6 /* HLC3 */: {
                            for (i = 0; i < len; i++) {
                                values.push(finance._average(this.highs[i], this.lows[i], this.closes[i]));
                            }
                            break;
                        }
                        case 7 /* HLOC4 */: {
                            for (i = 0; i < len; i++) {
                                values.push(finance._average(this.highs[i], this.lows[i], this.opens[i], this.closes[i]));
                            }
                            break;
                        }
                        case 0 /* Close */:
                        default: {
                            values = this.closes;
                            break;
                        }
                    }

                    return values;
                };

                _BaseRangeCalculator.prototype._getSize = function () {
                    var atrs = this.unit === 1 /* ATR */ ? finance._avgTrueRng(this.highs, this.lows, this.closes, this.size) : null;
                    return this.unit === 1 /* ATR */ ? atrs[atrs.length - 1] : this.size;
                };
                return _BaseRangeCalculator;
            })(_BaseCalculator);
            finance._BaseRangeCalculator = _BaseRangeCalculator;

            // calculator for Line Break plotter
            var _LineBreakCalculator = (function (_super) {
                __extends(_LineBreakCalculator, _super);
                function _LineBreakCalculator(highs, lows, opens, closes, xs, size) {
                    _super.call(this, highs, lows, opens, closes, xs, size);
                }
                _LineBreakCalculator.prototype.calculate = function () {
                    var hasXs = this.xs !== null && this.xs.length > 0, len = this.closes.length, retvals = [], rangeValues = [[], []];

                    if (len <= 0) {
                        return retvals;
                    }

                    var tempRngs = [], basePrice, x, close, lbLen, lbIdx, max, min;

                    for (var i = 1; i < len; i++) {
                        lbLen = retvals.length;
                        lbIdx = lbLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        close = this.closes[i];

                        if (lbIdx === -1) {
                            basePrice = this.closes[0];
                            if (basePrice === close) {
                                continue;
                            }
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
                };

                _LineBreakCalculator.prototype._trendExists = function (vals) {
                    if (vals[1].length < this.size) {
                        return false;
                    }

                    var retval = false, t, temp = vals[1].slice(-this.size);

                    for (t = 1; t < this.size; t++) {
                        retval = temp[t] > temp[t - 1];
                        if (!retval) {
                            break;
                        }
                    }

                    // detect falling trend
                    if (!retval) {
                        for (t = 1; t < this.size; t++) {
                            retval = temp[t] < temp[t - 1];
                            if (!retval) {
                                break;
                            }
                        }
                    }

                    return retval;
                };
                return _LineBreakCalculator;
            })(_BaseRangeCalculator);
            finance._LineBreakCalculator = _LineBreakCalculator;

            // calculator for Kagi plotter
            var _KagiCalculator = (function (_super) {
                __extends(_KagiCalculator, _super);
                function _KagiCalculator(highs, lows, opens, closes, xs, size, unit, field) {
                    _super.call(this, highs, lows, opens, closes, xs, size, unit, field);
                }
                _KagiCalculator.prototype.calculate = function () {
                    var reversal = this._getSize(), len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), values = this._getValues(), hasXs = this.xs !== null && this.xs.length > 0, retvals = [], rangeValues = [[], []];

                    if (len <= 0) {
                        return retvals;
                    }

                    var basePrice, x, current, rLen, rIdx, min, max, diff, extend, pointIndex;

                    for (var i = 1; i < len; i++) {
                        rLen = retvals.length;
                        rIdx = rLen - 1;
                        x = hasXs ? this.xs[i] : i;
                        pointIndex = i;
                        extend = false;

                        // set current value
                        if (this.fields === 4 /* HighLow */) {
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
                        if (this.unit === 2 /* Percentage */) {
                            reversal = current * this.size;
                        }

                        // set base price value
                        if (rIdx === -1) {
                            x = hasXs ? this.xs[0] : 0;
                            pointIndex = 0;
                            if (this.fields === 4 /* HighLow */) {
                                basePrice = this.highs[0];
                            } else {
                                basePrice = values[0];
                            }
                            diff = Math.abs(basePrice - current);
                            if (diff < reversal) {
                                continue;
                            }
                        } else {
                            diff = rangeValues[1][rIdx] - rangeValues[0][rIdx];
                            max = Math.max(rangeValues[0][rIdx], rangeValues[1][rIdx]);
                            min = Math.min(rangeValues[0][rIdx], rangeValues[1][rIdx]);

                            if (diff > 0) {
                                if (current > max) {
                                    extend = true;
                                } else {
                                    diff = max - current;
                                    if (diff >= reversal) {
                                        basePrice = max;
                                    } else {
                                        continue;
                                    }
                                }
                            } else {
                                if (current < min) {
                                    extend = true;
                                } else {
                                    diff = current - min;
                                    if (diff >= reversal) {
                                        basePrice = min;
                                    } else {
                                        continue;
                                    }
                                }
                            }
                        }

                        if (extend) {
                            rangeValues[1][rIdx] = current;

                            retvals[rIdx].close = current;
                            retvals[rIdx].high = Math.max(retvals[rIdx].open, retvals[rIdx].close);
                            retvals[rIdx].low = Math.min(retvals[rIdx].open, retvals[rIdx].close);
                        } else {
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
                };
                return _KagiCalculator;
            })(_BaseRangeCalculator);
            finance._KagiCalculator = _KagiCalculator;

            // calculator for Renko plotter
            var _RenkoCalculator = (function (_super) {
                __extends(_RenkoCalculator, _super);
                function _RenkoCalculator(highs, lows, opens, closes, xs, size, unit, field, rounding) {
                    if (typeof rounding === "undefined") { rounding = false; }
                    _super.call(this, highs, lows, opens, closes, xs, size, unit, field);

                    // internal only
                    this.rounding = rounding;
                }
                _RenkoCalculator.prototype.calculate = function () {
                    var size = this._getSize(), len = Math.min(this.highs.length, this.lows.length, this.opens.length, this.closes.length), hasXs = this.xs !== null && this.xs.length > 0, values = this._getValues(), retvals = [], rangeValues = [[], []];

                    if (len <= 0) {
                        return retvals;
                    }

                    var basePrice, x, current, rLen, rIdx, min, max, diff;

                    for (var i = 1; i < len; i++) {
                        rLen = retvals.length;
                        rIdx = rLen - 1;
                        x = hasXs ? this.xs[i] : i;

                        // todo: not working correctly, figure out
                        // set basePrice and current for DataFields == HighLow
                        if (this.fields === 4 /* HighLow */) {
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
                        } else {
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
                        if (Math.abs(diff) < size) {
                            continue;
                        }

                        // determine number of boxes to add
                        diff = finance._trunc(diff / size);

                        for (var j = 0; j < Math.abs(diff); j++) {
                            var rng = {};

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
                };

                // internal only - for StockCharts rounding
                _RenkoCalculator.prototype._round = function (value, size) {
                    return Math.round(value / size) * size;
                };
                return _RenkoCalculator;
            })(_BaseRangeCalculator);
            finance._RenkoCalculator = _RenkoCalculator;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_IFinancialCalculator.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        (function (finance) {
            "use strict";

            // Plotter for Heikin-Ashi FinancialChartType
            var _HeikinAshiPlotter = (function (_super) {
                __extends(_HeikinAshiPlotter, _super);
                function _HeikinAshiPlotter() {
                    _super.call(this);
                    this._symFactor = 0.7;
                    this.clear();
                }
                _HeikinAshiPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._haValues = null;
                    this._calculator = null;
                };

                _HeikinAshiPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    var _this = this;
                    this._calculate(series);

                    var ser = wijmo.asType(series, chart.SeriesBase), si = this.chart.series.indexOf(series), xs = series.getValues(1), sw = this._symFactor;

                    var len = this._haValues.length, hasXs = true;

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
                        xs = new Array(len);
                    } else {
                        len = Math.min(len, xs.length);
                    }

                    var swidth = this._DEFAULT_WIDTH, fill = ser._getSymbolFill(si), altFill = ser._getAltSymbolFill(si) || "transparent", stroke = ser._getSymbolStroke(si), altStroke = ser._getAltSymbolStroke(si) || stroke, symSize = sw, dt = series.getDataType(1) || series.chart._xDataType;

                    engine.strokeWidth = swidth;

                    var xmin = ax.actualMin, xmax = ax.actualMax, itemIndex = 0, currentFill, currentStroke, x, dpt, hi, lo, open, close;

                    for (var i = 0; i < len; i++) {
                        x = hasXs ? xs[i] : i;

                        if (chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
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
                                var hti = new chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(hi)), 8 /* SeriesSymbol */);
                                hti._setData(ser, i);
                                hti._setDataPoint(dpt);

                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                                });
                            } else {
                                this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                            }
                            engine.endGroup();

                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                };

                // modified variation of FinancialPlotter's implementation - added optional _DataPoint parameter
                _HeikinAshiPlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, fill, w, x, hi, lo, open, close, dpt, dt) {
                    var area, y0 = null, y1 = null, x1 = null, x2 = null, half = dt === 4 /* Date */ ? 43200000 : 0.5;

                    x1 = ax.convert(x - half * w);
                    x2 = ax.convert(x + half * w);
                    if (x1 > x2) {
                        var tmp = x1;
                        x1 = x2;
                        x2 = tmp;
                    }
                    x = ax.convert(x);

                    if (chart._DataInfo.isValid(open) && chart._DataInfo.isValid(close)) {
                        open = ay.convert(open);
                        close = ay.convert(close);
                        y0 = Math.min(open, close);
                        y1 = y0 + Math.abs(open - close);

                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);

                        area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                    if (chart._DataInfo.isValid(hi)) {
                        hi = ay.convert(hi);
                        if (y0 !== null) {
                            engine.drawLine(x, y0, x, hi);
                        }
                    }
                    if (chart._DataInfo.isValid(lo)) {
                        lo = ay.convert(lo);
                        if (y1 !== null) {
                            engine.drawLine(x, y1, x, lo);
                        }
                    }
                };

                // generates _DataPoint for hit test support
                _HeikinAshiPlotter.prototype._getDataPoint = function (seriesIndex, pointIndex, x, series) {
                    var dpt = new chart._DataPoint(seriesIndex, pointIndex, x, this._haValues[pointIndex].high), item = series._getItem(pointIndex), bndHigh = series._getBinding(0), bndLow = series._getBinding(1), bndOpen = series._getBinding(2), bndClose = series._getBinding(3), ay = series._getAxisY();

                    // set item related data and maintain original binding
                    dpt["item"] = chart._BasePlotter.cloneStyle(item, []);
                    dpt["item"][bndHigh] = this._haValues[pointIndex].high;
                    dpt["item"][bndLow] = this._haValues[pointIndex].low;
                    dpt["item"][bndOpen] = this._haValues[pointIndex].open;
                    dpt["item"][bndClose] = this._haValues[pointIndex].close;

                    // set y related data
                    dpt["y"] = this._haValues[pointIndex].high;
                    dpt["yfmt"] = ay._formatValue(this._haValues[pointIndex].high);

                    // don't set "x" or "xfmt" values - can use default behavior
                    return dpt;
                };

                _HeikinAshiPlotter.prototype._calculate = function (series) {
                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3);

                    this._calculator = new finance._HeikinAshiCalculator(highs, lows, opens, closes);
                    this._haValues = this._calculator.calculate();
                    if (this._haValues === null || wijmo.isUndefined(this._haValues)) {
                        this._init();
                    }
                };

                _HeikinAshiPlotter.prototype._init = function () {
                    this._haValues = [];
                };
                return _HeikinAshiPlotter;
            })(chart._FinancePlotter);
            finance._HeikinAshiPlotter = _HeikinAshiPlotter;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_HeikinAshiPlotter.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        (function (finance) {
            "use strict";

            // Abstract plotter for range based FinancialChartTypes
            var _BaseRangePlotter = (function (_super) {
                __extends(_BaseRangePlotter, _super);
                function _BaseRangePlotter() {
                    _super.call(this);
                    this._symFactor = 0.7;
                    this.clear();
                }
                _BaseRangePlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._rangeValues = null;
                    this._rangeXLabels = null;
                    this._calculator = null;
                };

                _BaseRangePlotter.prototype.unload = function () {
                    _super.prototype.unload.call(this);

                    var series, ax;

                    for (var i = 0; i < this.chart.series.length; i++) {
                        series = this.chart.series[i];
                        if (!series) {
                            continue;
                        }
                        ax = series._getAxisX();

                        // reset AxisX.itemsSource
                        if (ax && ax.itemsSource) {
                            ax.itemsSource = null;
                        }
                    }
                };

                // todo: possibly add support for multiple series *later* (i.e. overlays/indicators)
                // todo: better way to adjust x limits?
                _BaseRangePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                    var series, arrTemp, xTemp, xmin = 0, xmax = 0, ymin = 0, ymax = 0, ax, padding = this.chart._xDataType === 4 /* Date */ ? 0.5 : 0;

                    // only one supported at the moment - possibly remove later for overlays & indicators
                    wijmo.assert(this.chart.series.length <= 1, "Current FinancialChartType only supports a single series");

                    for (var i = 0; i < this.chart.series.length; i++) {
                        series = this.chart.series[i];
                        this._calculate(series);

                        if (this._rangeValues.length <= 0 || this._rangeXLabels.length <= 0) {
                            continue;
                        }

                        // create temporary array for calculating ymin & ymax
                        arrTemp = this._rangeValues.map(function (value) {
                            return value.open;
                        });
                        arrTemp.push.apply(arrTemp, this._rangeValues.map(function (value) {
                            return value.close;
                        }));

                        // create temp array for xmin & xmax
                        xTemp = this._rangeXLabels.map(function (current) {
                            return current.value;
                        });

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
                    return new wijmo.Rect(xmin, ymin, xmax - xmin + padding, ymax - ymin);
                };

                _BaseRangePlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    var _this = this;
                    this._calculate(series);

                    var si = this.chart.series.indexOf(series), len = this._rangeValues.length, xmin = ax.actualMin, xmax = ax.actualMax, strWidth = this._DEFAULT_WIDTH, symSize = this._symFactor, fill = series._getSymbolFill(si), altFill = series._getAltSymbolFill(si) || "transparent", stroke = series._getSymbolStroke(si), altStroke = series._getAltSymbolStroke(si) || stroke;

                    engine.strokeWidth = strWidth;

                    var itemIndex = 0, x, start, end, dpt;

                    for (var i = 0; i < len; i++) {
                        x = i;
                        if (chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
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
                                var hti = new chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(end)), 8 /* SeriesSymbol */);
                                hti._setData(series, i);
                                hti._setDataPoint(dpt);

                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                                });
                            } else {
                                this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                            }

                            engine.endGroup();

                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                };

                _BaseRangePlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, w, x, start, end, dpt) {
                    var y0, y1, x1, x2, area;

                    x1 = ax.convert(x - 0.5 * w);
                    x2 = ax.convert(x + 0.5 * w);
                    if (x1 > x2) {
                        var tmp = x1;
                        x1 = x2;
                        x2 = tmp;
                    }

                    //x = ax.convert(x);
                    if (chart._DataInfo.isValid(start) && chart._DataInfo.isValid(end)) {
                        start = ay.convert(start);
                        end = ay.convert(end);
                        y0 = Math.min(start, end);
                        y1 = y0 + Math.abs(start - end);

                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);

                        area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                };

                // generates _DataPoint for hit test support
                _BaseRangePlotter.prototype._getDataPoint = function (seriesIndex, pointIndex, series, dataY) {
                    var x = pointIndex, dpt = new chart._DataPoint(seriesIndex, pointIndex, x, dataY), item = series._getItem(this._rangeValues[pointIndex].pointIndex), bndX = series.bindingX || this.chart.bindingX, bndHigh = series._getBinding(0), bndLow = series._getBinding(1), bndOpen = series._getBinding(2), bndClose = series._getBinding(3), ay = series._getAxisY();

                    // set item related data and maintain original bindings
                    dpt["item"] = chart._BasePlotter.cloneStyle(item, []);
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
                };

                // initialize variables for calculations
                _BaseRangePlotter.prototype._init = function () {
                    this._rangeValues = [];
                    this._rangeXLabels = [];
                };

                // abstract method
                _BaseRangePlotter.prototype._calculate = function (series) {
                };

                // generates new labels for the x-axis based on derived data
                _BaseRangePlotter.prototype._generateXLabels = function (series) {
                    var _this = this;
                    var textVal, ax = series._getAxisX(), dataType = series.getDataType(1) || this.chart._xDataType;

                    // todo: find a better way and/or separate
                    this._rangeValues.forEach(function (value, index) {
                        var val = value.x;
                        if (dataType === 4 /* Date */) {
                            textVal = wijmo.Globalize.format(chart.FlexChart._fromOADate(val), ax.format || "d");
                        } else if (dataType === 2 /* Number */) {
                            textVal = ax._formatValue(val);
                        } else if ((dataType === null || dataType === 1 /* String */) && _this.chart._xlabels) {
                            textVal = _this.chart._xlabels[val];
                        } else {
                            textVal = val.toString();
                        }

                        // _text property will be used as a backup for the text property
                        // there could be cases, like Renko, where text is cleared
                        _this._rangeXLabels.push({ value: index, text: textVal, _text: textVal });
                    }, this);
                };

                // provides access to any value within FlexChartCore's "options" property
                _BaseRangePlotter.prototype.getOption = function (name, parent) {
                    var options = this.chart.options;
                    if (parent) {
                        options = options ? options[parent] : null;
                    }
                    if (options && !wijmo.isUndefined(options[name]) && options[name] !== null) {
                        return options[name];
                    }
                    return undefined;
                };
                return _BaseRangePlotter;
            })(chart._BasePlotter);
            finance._BaseRangePlotter = _BaseRangePlotter;

            /**
            * Specifies which fields are to be used for calculation. Applies to Renko and Kagi chart types.
            */
            (function (DataFields) {
                /** Close values are used for calculations. */
                DataFields[DataFields["Close"] = 0] = "Close";

                /** High values are used for calculations. */
                DataFields[DataFields["High"] = 1] = "High";

                /** Low values are used for calculations. */
                DataFields[DataFields["Low"] = 2] = "Low";

                /** Open values are used for calculations. */
                DataFields[DataFields["Open"] = 3] = "Open";

                /** High-Low method is used for calculations. DataFields.HighLow is currently not
                * supported with Renko chart types. */
                DataFields[DataFields["HighLow"] = 4] = "HighLow";

                /** Average of high and low values is used for calculations. */
                DataFields[DataFields["HL2"] = 5] = "HL2";

                /** Average of high, low, and close values is used for calculations. */
                DataFields[DataFields["HLC3"] = 6] = "HLC3";

                /** Average of high, low, open, and close values is used for calculations. */
                DataFields[DataFields["HLOC4"] = 7] = "HLOC4";
            })(finance.DataFields || (finance.DataFields = {}));
            var DataFields = finance.DataFields;

            /**
            * Specifies the unit for Kagi and Renko chart types.
            */
            (function (RangeMode) {
                /** Uses a fixed, positive number for the Kagi chart's reversal amount
                * or Renko chart's box size. */
                RangeMode[RangeMode["Fixed"] = 0] = "Fixed";

                /** Uses the current Average True Range value for Kagi chart's reversal amount
                * or Renko chart's box size. When ATR is used, the reversal amount or box size
                * option of these charts must be an integer and will be used as the period for
                * the ATR calculation. */
                RangeMode[RangeMode["ATR"] = 1] = "ATR";

                /** Uses a percentage for the Kagi chart's reversal amount. RangeMode.Percentage
                * is currently not supported with Renko chart types. */
                RangeMode[RangeMode["Percentage"] = 2] = "Percentage";
            })(finance.RangeMode || (finance.RangeMode = {}));
            var RangeMode = finance.RangeMode;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_BaseRangePlotter.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        (function (finance) {
            "use strict";

            // Plotter for Line Break FinancialChartType
            var _LineBreakPlotter = (function (_super) {
                __extends(_LineBreakPlotter, _super);
                function _LineBreakPlotter() {
                    _super.call(this);
                }
                _LineBreakPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._newLineBreaks = null;
                };

                _LineBreakPlotter.prototype._calculate = function (series) {
                    this._init();

                    var closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;

                    this._calculator = new finance._LineBreakCalculator(null, null, null, closes, xs, this._newLineBreaks);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }

                    // always regenerate x-axis labels at the end of each calculation cycle
                    this._generateXLabels(series);
                };

                _LineBreakPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);

                    // NewLineBreaks
                    this._newLineBreaks = wijmo.asInt(this.getNumOption("newLineBreaks", "lineBreak"), true, true) || 3;
                    wijmo.assert(this._newLineBreaks >= 1, "Value must be greater than 1");
                };
                return _LineBreakPlotter;
            })(finance._BaseRangePlotter);
            finance._LineBreakPlotter = _LineBreakPlotter;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_LineBreakPlotter.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        (function (finance) {
            "use strict";

            // Plotter for Renko FinancialChartType
            var _RenkoPlotter = (function (_super) {
                __extends(_RenkoPlotter, _super);
                function _RenkoPlotter() {
                    _super.call(this);
                }
                _RenkoPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._boxSize = null;
                    this._rangeMode = null;
                };

                _RenkoPlotter.prototype._calculate = function (series) {
                    this._init();

                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;

                    this._calculator = new finance._RenkoCalculator(highs, lows, opens, closes, xs, this._boxSize, this._rangeMode, this._fields, this._rounding);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }

                    // always regenerate x-axis labels at the end of each calculation cycle
                    this._generateXLabels(series);
                };

                _RenkoPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);

                    // BoxSize
                    this._boxSize = this.getNumOption("boxSize", "renko") || 14;

                    // RangeMode
                    this._rangeMode = this.getOption("rangeMode", "renko") || 0 /* Fixed */;
                    this._rangeMode = wijmo.asEnum(this._rangeMode, finance.RangeMode, true);
                    wijmo.assert(this._rangeMode !== 2 /* Percentage */, "RangeMode.Percentage is not supported");

                    // DataFields
                    this._fields = this.getOption("fields", "renko") || 0 /* Close */;
                    this._fields = wijmo.asEnum(this._fields, finance.DataFields, true);

                    // todo: figure out HighLow
                    wijmo.assert(this._fields !== 4 /* HighLow */, "DataFields.HighLow is not supported");

                    // rounding - internal only
                    this._rounding = wijmo.asBoolean(this.getOption("rounding", "renko"), true);
                };

                _RenkoPlotter.prototype._generateXLabels = function (series) {
                    var _this = this;
                    _super.prototype._generateXLabels.call(this, series);

                    // bricks may have duplicate x-labels - prevent that behavior
                    this._rangeXLabels.forEach(function (value, index) {
                        // compare current item's text property to the previous item's _text property (backup for text)
                        if (index > 0 && _this._rangeXLabels[index - 1]._text === value.text) {
                            value.text = "";
                        }
                    }, this);
                };
                return _RenkoPlotter;
            })(finance._BaseRangePlotter);
            finance._RenkoPlotter = _RenkoPlotter;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_RenkoPlotter.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        (function (finance) {
            "use strict";

            // Plotter for Kagi FinancialChartType
            var _KagiPlotter = (function (_super) {
                __extends(_KagiPlotter, _super);
                function _KagiPlotter() {
                    _super.call(this);
                }
                _KagiPlotter.prototype._calculate = function (series) {
                    this._init();

                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;

                    this._calculator = new finance._KagiCalculator(highs, lows, opens, closes, xs, this._reversalAmount, this._rangeMode, this._fields);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }

                    // always regenerate x-axis labels at the end of each calculation cycle
                    this._generateXLabels(series);
                };

                _KagiPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    this._calculate(series);

                    var si = this.chart.series.indexOf(series), len = this._rangeValues.length, xmin = ax.actualMin, xmax = ax.actualMax, strWidth = this._DEFAULT_WIDTH, stroke = series._getSymbolStroke(si), altStroke = series._getAltSymbolStroke(si) || stroke, dx = [], dy = [];

                    engine.stroke = stroke;
                    engine.strokeWidth = strWidth;

                    var itemIndex = 0, x, start, end, min, max, area, dpt;

                    engine.startGroup();
                    for (var i = 0; i < len; i++) {
                        x = i;
                        if (chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
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
                            } else if (engine.strokeWidth === strWidth) {
                                if (end > start) {
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
                                } else {
                                    engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                }
                            } else if ((engine.strokeWidth / 2) === strWidth) {
                                if (end < start) {
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
                                } else {
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
                            area = new chart._CircleArea(new wijmo.Point(ax.convert(x), ay.convert(end)), 0.5 * engine.strokeWidth);
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
                    this.hitTester.add(new chart._LinesArea(dx, dy), si);
                };

                _KagiPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);

                    // ReversalAmount
                    this._reversalAmount = this.getNumOption("reversalAmount", "kagi") || 14;

                    // RangeMode
                    this._rangeMode = this.getOption("rangeMode", "kagi") || 0 /* Fixed */;
                    this._rangeMode = wijmo.asEnum(this._rangeMode, finance.RangeMode, true);

                    // DataFields
                    this._fields = this.getOption("fields", "kagi") || 0 /* Close */;
                    this._fields = wijmo.asEnum(this._fields, finance.DataFields, true);
                };

                _KagiPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._reversalAmount = null;
                    this._rangeMode = null;
                };
                return _KagiPlotter;
            })(finance._BaseRangePlotter);
            finance._KagiPlotter = _KagiPlotter;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_KagiPlotter.js.map

