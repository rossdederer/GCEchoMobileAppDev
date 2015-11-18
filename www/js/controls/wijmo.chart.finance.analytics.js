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
    (function (chart) {
        (function (finance) {
            /**
            * Analytics extensions for @see:FinancialChart.
            */
            (function (analytics) {
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
                var Fibonacci = (function (_super) {
                    __extends(Fibonacci, _super);
                    /**
                    * Initializes a new instance of a @see:Fibonacci object.
                    *
                    * @param options A JavaScript object containing initialization data.
                    */
                    function Fibonacci(options) {
                        _super.call(this);
                        this._levels = [0, 23.6, 38.2, 50, 61.8, 100];
                        this._uptrend = true;
                        this._labelPosition = 1 /* Left */;
                        if (options) {
                            wijmo.copy(this, options);
                        }
                        this.rendering.addHandler(this._render);
                    }
                    Object.defineProperty(Fibonacci.prototype, "low", {
                        /**
                        * Gets or sets the low value of @see:Fibonacci tool.
                        *
                        * If not specified, the low value is caclulated based on data values provided by <b>itemsSource</b>.
                        */
                        get: function () {
                            return this._low;
                        },
                        set: function (value) {
                            if (value != this._low) {
                                this._low = wijmo.asNumber(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Fibonacci.prototype, "high", {
                        /**
                        * Gets or sets the high value of @see:Fibonacci tool.
                        *
                        * If not specified, the high value is caclulated based on
                        * data values provided by the <b>itemsSource</b>.
                        */
                        get: function () {
                            return this._high;
                        },
                        set: function (value) {
                            if (value != this._high) {
                                this._high = wijmo.asNumber(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Fibonacci.prototype, "labelPosition", {
                        /**
                        * Gets or sets the label position for levels in @see:Fibonacci tool.
                        */
                        get: function () {
                            return this._labelPosition;
                        },
                        set: function (value) {
                            if (value != this._labelPosition) {
                                this._labelPosition = wijmo.asEnum(value, chart.LabelPosition, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Fibonacci.prototype, "uptrend", {
                        /**
                        * Gets or sets a value indicating whether to create uptrending @see:Fibonacci tool.
                        *
                        * Default value is true(uptrend). If the value is false, the downtrending levels are plotted.
                        */
                        get: function () {
                            return this._uptrend;
                        },
                        set: function (value) {
                            if (value != this._uptrend) {
                                this._uptrend = wijmo.asBoolean(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Fibonacci.prototype, "levels", {
                        /**
                        * Gets or sets the array of levels for plotting.
                        *
                        * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
                        */
                        get: function () {
                            return this._levels;
                        },
                        set: function (value) {
                            if (value != this._levels) {
                                this._levels = wijmo.asArray(value, true);
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Fibonacci.prototype, "minX", {
                        /**
                        * Gets or sets the x minimal value of the @see:Fibonacci tool.
                        *
                        * If not specified, current minimum of x-axis is used.
                        * The value can be specified as a number or Date object.
                        */
                        get: function () {
                            return this._minX;
                        },
                        set: function (value) {
                            if (value != this._minX) {
                                this._minX = value;
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Fibonacci.prototype, "maxX", {
                        /**
                        * Gets or sets the x maximum value of the @see:Fibonacci tool.
                        *
                        * If not specified, current maximum of x-axis is used.
                        * The value can be specified as a number or Date object.
                        */
                        get: function () {
                            return this._maxX;
                        },
                        set: function (value) {
                            if (value != this._maxX) {
                                this._maxX = value;
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });

                    /**
                    * Gets array of numeric data values for the series.
                    *
                    * @param dimension The dimension of data: 0 for y-values and 1 for x-values.
                    */
                    Fibonacci.prototype.getValues = function (dimension) {
                        return null;
                    };

                    Fibonacci.prototype._getMinX = function () {
                        if (wijmo.isNumber(this._minX)) {
                            return this._minX;
                        } else if (wijmo.isDate(this._minX)) {
                            return wijmo.asDate(this._minX).valueOf();
                        } else {
                            return this._getAxisX().actualMin;
                        }
                    };

                    Fibonacci.prototype._getMaxX = function () {
                        if (wijmo.isNumber(this._maxX)) {
                            return this._maxX;
                        } else if (wijmo.isDate(this._maxX)) {
                            return wijmo.asDate(this._maxX).valueOf();
                        } else {
                            return this._getAxisX().actualMax;
                        }
                    };

                    Fibonacci.prototype._updateLevels = function () {
                        var min = undefined, max = undefined;
                        if (this._low === undefined || this._high === undefined) {
                            var vals = _super.prototype.getValues.call(this, 0);
                            var xvals = _super.prototype.getValues.call(this, 1);
                            if (vals) {
                                var len = vals.length;
                                var xmin = this._getMinX(), xmax = this._getMaxX();

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
                    };

                    Fibonacci.prototype._render = function (sender, args) {
                        var ser = sender;
                        ser._updateLevels();

                        var ax = ser._getAxisX();
                        var ay = ser._getAxisY();
                        var eng = args.engine;

                        var swidth = 2, stroke = ser._getSymbolStroke(ser._chart.series.indexOf(ser));

                        var lstyle = chart._BasePlotter.cloneStyle(ser.style, ['fill']);
                        var tstyle = chart._BasePlotter.cloneStyle(ser.style, ['stroke']);

                        eng.stroke = stroke;
                        eng.strokeWidth = swidth;
                        eng.textFill = stroke;

                        var xmin = ser._getMinX(), xmax = ser._getMaxX();

                        if (xmin < ax.actualMin) {
                            xmin = ax.actualMin;
                        }
                        if (xmax > ax.actualMax) {
                            xmax = ax.actualMax;
                        }

                        var llen = ser._levels ? ser._levels.length : 0;
                        for (var i = 0; i < llen; i++) {
                            var lvl = ser._levels[i];
                            var x1 = ax.convert(xmin), x2 = ax.convert(xmax);
                            var y = ser.uptrend ? ay.convert(ser._actualLow + 0.01 * lvl * (ser._actualHigh - ser._actualLow)) : ay.convert(ser._actualHigh - 0.01 * lvl * (ser._actualHigh - ser._actualLow));

                            if (chart._DataInfo.isValid(x1) && chart._DataInfo.isValid(x2) && chart._DataInfo.isValid(y)) {
                                eng.drawLine(x1, y, x2, y, null, lstyle);

                                if (ser.labelPosition != 0 /* None */) {
                                    var s = lvl.toFixed(1) + '%';
                                    var va = 0;
                                    if ((ser.uptrend && i == 0) || (!ser.uptrend && i == llen - 1)) {
                                        va = 2;
                                    }

                                    switch (ser.labelPosition) {
                                        case 1 /* Left */:
                                            chart.FlexChartCore._renderText(eng, s, new wijmo.Point(x1, y), 0, va, null, null, tstyle);
                                            break;
                                        case 5 /* Center */:
                                            chart.FlexChartCore._renderText(eng, s, new wijmo.Point(0.5 * (x1 + x2), y), 1, va, null, null, tstyle);
                                            break;
                                        case 3 /* Right */:
                                            chart.FlexChartCore._renderText(eng, s, new wijmo.Point(x2, y), 2, va, null, null, tstyle);
                                            break;
                                    }
                                }
                            }
                        }
                    };
                    return Fibonacci;
                })(chart.SeriesBase);
                analytics.Fibonacci = Fibonacci;
            })(finance.analytics || (finance.analytics = {}));
            var analytics = finance.analytics;
        })(chart.finance || (chart.finance = {}));
        var finance = chart.finance;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Fibonacci.js.map

