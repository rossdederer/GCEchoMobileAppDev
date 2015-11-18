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
 * Defines classes that add analytics features to charts including @see:TrendLine,
 * @see:MovingAverage and @see:FunctionSeries.
 */
module wijmo.chart.analytics {
    'use strict';

    /**
     * Represents base class for various trend lines.
     */
    export class TrendLineBase extends SeriesBase {

        private _sampleCount: number;
        private _bind: string;
        private _bindX: string;
        _xValues: any[];
        _yValues: any[];
        _originXValues: any[];
        _originYValues: any[];
        
        /**
         * Initializes a new instance of a @see:TrendLineBase.
         * 
         * @param options A JavaScript object containing initialization data for the TrendLineBase Series.
         */
        constructor(options?) {
            super();
            this._chartType = ChartType.Line;
            this._initProperties(options || {});
        }
        
        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the sample count for function calculation. 
         * The property doesn't apply for MovingAverage.
         */
        get sampleCount(): number {
            return this._sampleCount;
        }
        set sampleCount(value: number) {
            if (value === this._sampleCount) {
                return;
            }
            this._sampleCount = asNumber(value, false, true);
            this._invalidate();
        }

        //--------------------------------------------------------------------------
        //** implementation


        /**
         * Gets the approximate y value from the given x value.
         * 
         * @param x The x value to be used for calculating the Y value.
         */
        approximate(x: number): number {
            return 0;
        }

        getValues(dim: number): number[]{
            var self = this,
                bind = self.binding,
                bindX = self.bindingX;

            //reset binding and bindingX to trendline base.
            if (bind !== self._bind) {
                self._bind = bind;
                self.binding = bind;
            }
            if (bindX !== self._bindX) {
                self._bindX = bindX;
                self.bindingX = bindX;
            }

            if (self._originYValues == null) {
                self._originYValues = super.getValues(0);
            }
            if (self._originXValues == null) {
                self._originXValues = super.getValues(1);
            }
            if (self._originXValues == null || self._originYValues == null) {
                return null;
            }
            super.getValues(dim);

            if (self._xValues == null || self._yValues == null) {
                self._calculateValues();
            }

            if (dim === 0) {
                //y
                return self._yValues || null;
            } else if (dim === 1) {
                //x
                return self._xValues || null;
            }
        }

        _calculateValues() {
        }

        _initProperties(o) {
            var self = this,
                key;

            self._sampleCount = 100;

            for (key in o) {
                if (self[key]) {
                    self[key] = o[key];
                }
            }
        }

        _invalidate() {
            super._invalidate();
            this._clearCalculatedValues();
        }

        _clearValues() {
            super._clearValues();

            this._originXValues = null;
            this._originYValues = null;
            this._clearCalculatedValues();
        }

        _clearCalculatedValues() {
            this._xValues = null;
            this._yValues = null;
        }

    }

}
module wijmo.chart.analytics {
    'use strict';

    class MathHelper {
        // get rounded value by given digits.
        static round(val: number, digits?: number): number {
            if (!val) {
                return 0;
            }
            var rate = Math.pow(10, digits || 2);
            return Math.round(val * rate) / rate;
        }

        // determines minimum value in array of numbers
        static min = (values: number[]) => Math.min.apply(Math, asArray(values, false));

        // determines maximum value in array of numbers
        static max = (values: number[]) => Math.max.apply(Math, asArray(values, false));

        // determines the squared value of a number
        static square = (value: number) => Math.pow(asNumber(value, false), 2);

        // determines the sum of squares from an array of numbers
        static sumOfSquares = (values: number[]) => MathHelper.sumOfPow(values, 2);

        // determines standard deviation from an array of numbers
        static stdDev = (values: number[]) => Math.sqrt(MathHelper.variance(values));

        // determines average value in array of numbers
        static avg(values: number[]): number {
            var sum = MathHelper.sum(values);
            return sum / values.length;
        }

        // determines sum of values in array of numbers
        static sum(values: number[]): number {
            values = asArray(values, false);

            return values.reduce((prev, curr) => prev + curr, 0);
        }

        // determines sum of values to specified power
        static sumOfPow(values: number[], pow: number): number {
            values = asArray(values, false);
            pow = asNumber(pow, false);

            return values.reduce((prev, curr) => prev + Math.pow(curr, pow), 0);
        }

        // determines the sum product of two or more numeric arrays of equal length
        static sumProduct(...values: number[][]): number {
            var rows = values.length,
                cols = 0,
                vals = [],
                i, val;

            values = asArray(values, false);

            values.forEach((row, idx) => {
                row = asArray(row, false);
                if (idx === 0) {
                    cols = row.length;
                } else {
                    assert(row.length === cols, 'The length of the arrays must be equal');
                }
            });

            for (i = 0; i < cols; i++) {
                val = 1;

                values.some((row, idx) => {
                    var value = row[i];
                    if (value && isNumber(value)) {
                        val *= value;
                    } else {
                        val = 0;
                        return true;
                    }
                });
                vals.push(val);
            }

            return MathHelper.sum(vals);
        }

        // determines variance of array of numbers
        static variance(values: number[]): number {
            values = asArray(values, false);

            var mean = MathHelper.avg(values),
                diffs: number[];

            diffs = values.map(v => v - mean);

            return MathHelper.sumOfSquares(diffs) / (values.length - 1);
        }

        // determines covariance based on two correlated arrays
        static covariance(values1: number[], values2: number[]): number {
            values1 = asArray(values1, false);
            values2 = asArray(values2, false);
            assert(values1.length === values2.length, 'Length of arrays must be equal');

            var mean1 = MathHelper.avg(values1),
                mean2 = MathHelper.avg(values2),
                len = values1.length,
                val: number = 0,
                i;

            for (i = 0; i < len; i++) {
                val += ((values1[i] - mean1) * (values2[i] - mean2)) / len;
            }

            return val;
        }
    }

    /**
     * Specifies the fit type of the trendline series.
     */
    export enum TrendLineFitType {
        /**
         * A straight line that most closely approximates the data.  Y(x) = a * x + b.
         */
        Linear,
        /**
         * Regression fit to the equation Y(x) = a * exp(b*x).
         */
        Exponential,
        /**
         * Regression fit to the equation Y(x) = a * ln(x) + b.
         */
        Logarithmic,
        /**
         * Regression fit to the equation Y(x) = a * pow(x, b).
         */
        Power,
        /**
         * Regression fit to the equation Y(x) = a + b * cos(x) + c * sin(x) + d * cos(2*x) + e * sin(2*x) + ...
         */
        Fourier,
        /**
         * Regression fit to the equation Y(x) = a * x^n + b * x^n-1 + c * x^n-2 + ... + z.
         */
        Polynomial,
        /** 
         * The minimum X-value. 
         */
        MinX,
        /** 
         * The minimum Y-value. 
         */
        MinY,
        /** 
         * The maximum X-value. 
         */
        MaxX,
        /** 
         * The maximum Y-value. 
         */
        MaxY,
        /** 
         * The average X-value. 
         */
        AverageX,
        /** 
         * The average Y-value.
         */
        AverageY
    }

    /**
     * Represents a trend line for @see:FlexChart and @see:FinancialChart.
     * 
     * A trendline is a line superimposed on a chart revealing the overall direction
     * of data.
     * You may define a different fit type for each @see:TrendLine object that you 
     * add to the @see:FlexChart series collection by setting the fitType property.
     */
    export class TrendLine extends TrendLineBase {

        private _fitType: TrendLineFitType;
        private _order: number;
        private _helper: ITrendHelper;

        /**
         * Initializes a new instance of a @see:TrendLine object.
         * 
         * @param options A JavaScript object containing initialization data for 
         * the TrendLine Series.
         */
        constructor(options?) {
            super(options);
        }
        
        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the fit type of the trendline.
         */
        get fitType(): TrendLineFitType {
            return this._fitType;
        }
        set fitType(value: TrendLineFitType) {
            if (value === this._fitType) {
                return;
            }
            this._fitType = asEnum(value, TrendLineFitType, false);
            this._invalidate();
        }
        
        /**
         * Gets or sets the number of terms in a polynomial or fourier equation.
         *
         * Set this value to an integer greater than 1. 
         * It gets applied when the fitType is set to 
         * wijmo.chart.analytics.TrendLineFitType.Polynomial or 
         * wijmo.chart.analytics.TrendLineFitType.Fourier. 
         */
        get order(): number {
            return this._order;
        }
        set order(value: number) {
            if (value === this._order) {
                return;
            }
            this._order = asNumber(value, false, true);
            this._invalidate();
        }
        
        /**
         * Gets the coefficients of the equation.
         */
        get coefficients(): number[]{
            return this._helper ? this._helper.coefficients : null;
        }

        //--------------------------------------------------------------------------
        //** implementation
        _initProperties(o) {
            this._fitType = TrendLineFitType.Linear;
            this._order =  2;

            super._initProperties(o);
        }

        _calculateValues() {
            var self = this,
                helper: ITrendHelper,
                fitType, vals;

            fitType = TrendLineFitType[self._fitType];
            if (TrendLineHelper[fitType]) {
                helper = new TrendLineHelper[fitType](self._originYValues, self._originXValues, self.sampleCount, self.order);
                vals = helper.calculateValues();
                self._yValues = vals[0];
                self._xValues = vals[1];
                self._helper = helper;
            }
        }
        
        /**
         * Gets the approximate y value from the given x value.
         * 
         * @param x The x value to be used for calculating the Y value.
         */
        approximate(x: number): number {
            return this._helper.approximate(x);
        }

        /**
         * Gets the formatted equation string for the coefficients.
         * 
         * @param fmt The formatting function for the coefficients. Returns formatted 
         * string on the basis of coefficients. This parameter is optional.
         */
        getEquation(fmt?: Function) {
            var self = this,
                coeffs = self.coefficients,
                len = coeffs.length,
                equation = '';

            if (self._helper == null) {
                return '';
            }
            return self._helper.getEquation(fmt);
        }
    }

    //store calculated values.
    class Calculator {
        private _x: number[];
        private _logX: number[];
        private _y: number[];
        private _logY: number[];
        private _minX: number;
        private _minY: number;
        private _maxX: number;
        private _maxY: number;
        private _averageX: number;
        private _averageY: number;
        private _sumX: number;
        private _sumY: number;
        private _sumProduct: number;
        private _sumOfSquareX: number;
        private _sumOfSquareY: number;
        private _sumLogX: number;
        private _sumLogY: number;
        private _sumOfSquareLogX: number;
        private _sumOfSquareLogY: number;

        constructor(x: number[], y: number[]) {
            this._x = x;
            this._y = y;
        }

        get x(): number[] {
            return this._x;
        }

        get y(): number[]{
            return this._y;
        }

        get minX(): number {
            var self = this;

            if (self._minX == null) {
                self._minX = MathHelper.min(self._x);
            }
            return self._minX;
        }

        get minY(): number {
            var self = this;

            if (self._minY == null) {
                self._minY = MathHelper.min(self._y);
            }
            return self._minY;
        }

        get maxX(): number {
            var self = this;

            if (self._maxX == null) {
                self._maxX = MathHelper.max(self._x);
            }
            return self._maxX;
        }

        get maxY(): number {
            var self = this;

            if (self._maxY == null) {
                self._maxY = MathHelper.max(self._y);
            }
            return self._maxY;
        }

        get averageX(): number {
            var self = this;

            if (self._averageX == null) {
                self._averageX = MathHelper.avg(self._x);
            }
            return self._averageX;
        }

        get averageY(): number {
            var self = this;

            if (self._averageY == null) {
                self._averageY = MathHelper.avg(self._y);
            }
            return self._averageY;
        }

        get sumX(): number {
            var self = this;

            if (self._sumX == null) {
                self._sumX = MathHelper.sum(self._x);
            }
            return self._sumX;
        }

        get sumY(): number {
            var self = this;

            if (self._sumY == null) {
                self._sumY = MathHelper.sum(self._y);
            }
            return self._sumY;
        }

        get LogX(): number[] {
            var self = this;

            if (self._logX == null) {
                self._logX = self._x.map(val => Math.log(val));
            }
            return self._logX;
        }

        get LogY(): number[] {
            var self = this;

            if (self._logY == null) {
                self._logY = self._y.map(val => Math.log(val));
            }
            return self._logY;
        }

        get sumLogX(): number {
            var self = this;

            if (self._sumLogX == null) {
                self._sumLogX = MathHelper.sum(self.LogX);
            }
            return self._sumLogX;
        }

        get sumLogY(): number {
            var self = this;

            if (self._sumLogY == null) {
                self._sumLogY = MathHelper.sum(self.LogY);
            }
            return self._sumLogY;
        }

        get sumOfSquareX(): number {
            var self = this;

            if (self._sumOfSquareX == null) {
                self._sumOfSquareX = MathHelper.sumOfSquares(self._x);
            }
            return self._sumOfSquareX;
        }

        get sumOfSquareY(): number {
            var self = this;

            if (self._sumOfSquareY == null) {
                self._sumOfSquareY = MathHelper.sumOfSquares(self._y);
            }
            return self._sumOfSquareY;
        }

        get sumOfSquareLogX(): number {
            var self = this;

            if (self._sumOfSquareLogX == null) {
                self._sumOfSquareLogX = MathHelper.sumOfSquares(self.LogX);
            }
            return self._sumOfSquareLogX;
        }

        get sumOfSquareLogY(): number {
            var self = this;

            if (self._sumOfSquareLogY == null) {
                self._sumOfSquareLogY = MathHelper.sumOfSquares(self.LogY);
            }
            return self._sumOfSquareLogY;
        }

        sumProduct(x, y): number {
            var self = this;
            
            // In current cases, sumProduct get same x and y in each TrendHelpers, so use only one variable to store value.
            if (self._sumProduct == null) {
                self._sumProduct = MathHelper.sumProduct(x, y);
            }
            return self._sumProduct;
        }
    }

    // Simple interface for trend line helpers.
    interface ITrendHelper {
        y: number[];
        x: number[];
        count: number;
        xMin: number;
        xMax: number;
        coefficients: number[];

        calculateValues(): number[][];
        approximate(x: number): number;
        getEquation(fmt?: Function): string;
    }

    // Base class for calculating trend line calculations.
    // Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
    class TrendHelperBase implements ITrendHelper {
        private _y: number[];
        private _x: number[];
        private _count: number;
        private _xMin: number;
        private _xMax: number;
        private _calculator: Calculator;
        _coefficients: number[];

        get calculator(): Calculator {
            return this._calculator;
        }

        get y(): number[] {
            return this._y;
        }
        set y(value: number[]) {
            if (value !== this.y) {
                this._y = asArray(value, false);
            }
        }

        get x(): number[] {
            return this._x;
        }
        set x(value: number[]) {
            if (value !== this.x) {
                this._x = asArray(value, false);
            }
        }

        get count(): number {
            return this._count;
        }
        set count(value: number) {
            if (value !== this.count) {
                this._count = asInt(value, false, true);
            }
        }

        get xMin(): number {
            return this._xMin;
        }
        set xMin(value: number) {
            if (value !== this.xMin) {
                this._xMin = asNumber(value, false);
            }
        }

        get xMax(): number {
            return this._xMax;
        }
        set xMax(value: number) {
            if (value !== this.xMax) {
                this._xMax = asNumber(value, false);
            }
        }

        get coefficients(): number[]{
            return this._coefficients;
        }

        constructor(y: number[], x: number[], count?: number) {
            var self = this;

            self._coefficients = [];
            self.y = y;
            self.x = x;
            assert(self.y.length === self.x.length, 'Length of X and Y arrays are not equal');

            self.count = count || y.length;
            self._calculator = new Calculator(x, y);
            self.xMin = self._calculator.minX;
            self.xMax = self._calculator.maxX;
            self._calculateCoefficients();
        }

        _calculateCoefficients() {
            var self = this,
                a, b;

            b = self.calcB();
            a = self.calcA(b);
            self._coefficients.push(a, b);
        }

        calculateValues(): number[][] {
            var self = this,
                delta = (self.xMax - self.xMin) / (self.count - 1),
                values: number[][] = [[], []],
                xv: number, yv: number;

            for (var i = 0; i < self.count; i++) {
                xv = self.xMin + delta * i;
                yv = self.calcY(xv);

                values[0].push(yv);
                values[1].push(xv);
            }

            return values;
        }

        // Calculates the y-offset.
        calcA(b?): number {
            var self = this,
                n = self.y.length,
                Ex = self.calculator.sumX,
                Ey = self.calculator.sumY,
                b = b ? b : self.calcB();

            return (Ey - (b * Ex)) / n;
        }

        // Calculates the slope.
        calcB(): number {
            var self = this,
                n = self.y.length,
                calc = self.calculator,
                Exy = calc.sumProduct(calc.x, calc.y),
                Ex = calc.sumX,
                Ey = calc.sumY,
                Exsq = calc.sumOfSquareX;

            return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
        }

        calcY(xval: number): number {
            var coeffs = this.coefficients;

            return coeffs[0] + (coeffs[1] * xval);
        }

        approximate(x: number): number {
            return this.calcY(x);
        }

        getEquation(fmt?: Function): string {
            var fmt = fmt ? fmt : this._defaultEquationFmt;

            return this._getEquation(fmt);
        }

        _getEquation(fmt: Function): string {
            var coeffs = this.coefficients,
                equations = [];

            coeffs.forEach(coeff => {
                equations.push(fmt(coeff));
            });
            return this._concatEquation(equations);
        }

        _concatEquation(equations: string[]): string {
            return '';
        }

        _defaultEquationFmt(coefficient: number): string {
            var val, len,
                coeff = Math.abs(coefficient),
                concatLen = 0;
            if (coeff >= 1e5) {
                len = String(Math.round(coeff)).length - 1;

                val = Math.round(coefficient / Number('1e' + len));
                return val + 'e' + len;
            } else if (coeff < 1e-4) {
                len = String(coeff).match(/\.0+/)[1].length - 1;

                val = Math.round(coefficient * Number('1e' + len));
                return val + 'e-' + len;
            } else {
                if (coefficient > 0) { 
                    concatLen = 6;
                } else {
                    concatLen = 7;
                }
                if (coeff >= 1e4) {
                    concatLen--;
                }
                //use + to convert string to number to remove last '0' characters.
                return String(+(String(coefficient).substring(0, concatLen)));
            }
            return '';
        }
    }

    // y = a * x + b
    // Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
    class LinearHelper extends TrendHelperBase {
        private _yOffset: number;

        get yOffset(): number {
            return this._yOffset;
        }
        set yOffset(value: number) {
            if (value !== this.yOffset) {
                this._yOffset = asNumber(value, true);
            }
        }

        constructor(y: number[], x: number[], count?: number, yOffset?: number) {
            super(y, x, count);
            this.yOffset = yOffset;
        }

        calcA(b?): number {
            return this.yOffset != null ? this.yOffset : super.calcA(b);
        }

        calcB(): number {
            return this.yOffset != null ? this._calculateBSimple() : super.calcB();
        }

        private _calculateBSimple(): number {
            var self = this,
                calc = self.calculator,
                Exy = calc.sumProduct(calc.x, calc.y),
                Ex = calc.sumX,
                Exsq = calc.sumOfSquareX;

            return (Exy - self.yOffset * Ex) / Exsq;
        }

        _calculateCoefficients() {
            var self = this,
                a, b;

            b = self.calcB();
            a = self.calcA(b);
            self.coefficients.push(b, a);
        }

        calcY(xval: number): number {
            var coeffs = this.coefficients;
            return (coeffs[0] * xval) + coeffs[1];
        }

        _concatEquation(equations: string[]): string {
            return 'y=' + equations[0] + 'x' + (this.coefficients[1] >= 0 ? '+' : '' ) + equations[1];
        }
    }

    // y = a * lnx + b.
    // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingLogarithmic.html
    class LogHelper extends TrendHelperBase {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calcA(b?) {
            var self = this,
                n = self.y.length,
                calc = self.calculator,
                Ey = calc.sumY,
                Ex = calc.sumLogX,
                b = b ? b : self.calcB();

            return (Ey - (b * Ex)) / n;
        }

        calcB() {
            var self = this,
                n = self.y.length,
                calc = self.calculator,
                Exy = calc.sumProduct(calc.y, calc.LogX),
                Ey = calc.sumY,
                Ex = calc.sumLogX,
                Exsq = calc.sumOfSquareLogX;

            return ((n * Exy) - (Ey * Ex)) / ((n * Exsq) - MathHelper.square(Ex));
        }

        _calculateCoefficients() {
            var self = this,
                a, b;

            b = self.calcB();
            a = self.calcA(b);
            self.coefficients.push(b, a);
        }

        calcY(xval: number): number {
            var coeffs = this.coefficients;

            return (Math.log(xval) * coeffs[0]) + coeffs[1];
        }

        _concatEquation(equations: string[]): string {
            return 'y=' + equations[0] + 'ln(x)' + (this.coefficients[1] >= 0 ? '+' : '') + equations[1];
        }
    }

    // y = a * e ^ (b * x)
    // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
    class ExpHelper extends TrendHelperBase {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calcA(): number {
            var self = this,
                n = self.y.length,
                calc = self.calculator,
                Ey = calc.sumLogY,
                Exsq = calc.sumOfSquareX,
                Ex = calc.sumX,
                Exy = calc.sumProduct(calc.x, calc.LogY);

            return Math.exp(((Ey * Exsq) - (Ex * Exy)) / ((n * Exsq) - MathHelper.square(Ex)));
        }

        calcB(): number {
            var self = this,
                n = self.y.length,
                calc = self.calculator,
                Ey = calc.sumLogY,
                Exsq = calc.sumOfSquareX,
                Ex = calc.sumX,
                Exy = calc.sumProduct(calc.x, calc.LogY);

            return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
        }

        calcY(xval: number): number {
            var coeffs = this.coefficients;

            return coeffs[0] * Math.exp(coeffs[1] * xval);
        }

        _concatEquation(equations: string[]): string {
            return 'y=' + equations[0] + 'e<sup>' + equations[1] + 'x</sup>';
        }
    }

    // y = a * x ^ b
    // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html
    class PowerHelper extends TrendHelperBase {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calcA(b?): number {
            var self = this,
                calc = self.calculator,
                n = self.y.length,
                Ex = calc.sumLogX,
                Ey = calc.sumLogY,
                b = b ? b : self.calcB();

            return Math.exp((Ey - (b * Ex)) / n);
        }

        calcB(): number {
            var self = this,
                n = self.y.length,
                calc = self.calculator,
                Exy = calc.sumProduct(calc.LogX, calc.LogY),
                Ex = calc.sumLogX,
                Ey = calc.sumLogY,
                Exsq = calc.sumOfSquareLogX;

            return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
        }

        calcY(xval: number): number {
            var coeffs = this.coefficients;

            return coeffs[0] * Math.pow(xval, coeffs[1]);
        }

        _concatEquation(equations: string[]): string {
            return 'y=' + equations[0] + 'x<sup>' + equations[1] + '</sup>';
        }
    }

    //For Polynomial/Fourier
    class LeastSquaresHelper extends TrendHelperBase {

        private _basis: number[][];
        private _order: number;

        constructor(y: number[], x: number[], count?: number, order?: number) {
            this._order = order == null ? 2 : order;
            this._basis = [];
            super(y, x, count);
            this._createBasis();
        }

        get basis(): number[][] {
            return this._basis;
        }

        get order(): number {
            return this._order;
        }
        set order(value: number) {
            if (value !== this.order) {
                this._order = asNumber(value, true);
            }
        }

        _calculateCoefficients() {
            var self = this;

            self._coefficients.length = self.order;
            self._createBasis();
            self._normalizeAndSolveGauss();
        }

        _createBasis() {
            var len = this.x.length,
                order = this.order;

            if (len < 2) {
                throw "Incompatible data: Less than 2 data points.";
            }
            if (order < 1) {
                throw "Incompatible data: Less than 1 coefficient in the fit";
            }
            if (order > len) {
                throw "Incompatible data: Number of data points less than number of terms";
            }
        }

        _normalizeAndSolveGauss() {
            var a = [];
            this._computeNormalEquations(a);
            this._genDefValForArray(a, 0);

            if (!this._solveGauss(a)) {
                throw 'Incompatible data: No solution.';
            }
        }

        private _genDefValForArray(a: number[][], def: number) {
            var len = a.length + 1;

            a.forEach(v => {
                for (var i = 0; i < len; i++) {
                    if (v[i] == null) {
                        v[i] = def;
                    }
                }
            });
        }

        // transform the least square task to the normal equation
        //  a * solution = c
        // where
        //   a = basis_transposed * basis
        //   c = basis_transposed * y 
        // 
        // here right part
        //   a[i][nt] = c[i]
        //
        _computeNormalEquations(a: number[][]) {
            var self = this,
                y = self.y,
                bas = self.basis,
                order = self.order,
                len = y.length,
                col, row, sum, i;

            for (col = 0; col < order; col++) {
                sum = 0;
                if (a[col] == null) {
                    a[col] = [];
                }
                y.forEach((v, i) => {
                    sum += v * bas[i][col];
                });
                a[col][order] = sum;

                for (row = col; row < order; row++) {
                    sum = 0;

                    for (i = 0; i < len; i++) {
                        sum += bas[i][row] * bas[i][col];
                    }
                    if (a[row] == null) {
                        a[row] = [];
                    }
                    a[row][col] = sum;
                    a[col][row] = sum;
                }
            }
        }
        
        // A[n][n]*x = A[n+1]
        _solveGauss(a: number[][]) {
            var n = a.length,
                epsilon = 0,
                coeffs = this._coefficients,
                result = true,
                i, j;

            if (coeffs.length < n || a[0].length < n + 1) {
                throw 'Dimension of matrix is not correct.';
            }

            a.some((v, i) => {
                var k = i,
                    m = Math.abs(v[i]),
                    val, _temp;

                for (j = i + 1; j < n; j++) {
                    val = Math.abs(a[j][i]);
                    if (m < val) {
                        m = val;
                        k = j;
                    }
                }

                if (m > epsilon) {
                    for (j = i; j <= n; j++) {
                        _temp = a[i][j];
                        a[i][j] = a[k][j];
                        a[k][j] = _temp;
                    }

                    for (k = i + 1; k < n; k++) {
                        _temp = a[k][i] / v[i];
                        a[k][i] = 0;

                        for (j = i + 1; j <= n; j++)
                            a[k][j] -= _temp * v[j];
                    }
                } else {
                    result = false;
                    return true;
                }
            });

            if (result) {
                for (i = n - 1; i >= 0; i--) {
                    coeffs[i] = a[i][n];

                    for (j = i + 1; j < n; j++) {
                        coeffs[i] -= a[i][j] * coeffs[j];
                    }

                    coeffs[i] = coeffs[i] / a[i][i];
                }
            }
            return result;
        }

    }

    class PolyHelper extends LeastSquaresHelper {

        constructor(y: number[], x: number[], count?: number, order?: number) {
            super(y, x, count, order);
        }

        get coefficients(): number[] {
            return this._coefficients.slice(0).reverse();
        }

        calcY(xval: number): number {
            var coeffs = this._coefficients,
                yval = 0,
                pow = 1;

            coeffs.forEach((v, i) => {
                if (i > 0) {
                    pow *= xval;
                }
                yval += v * pow;
            });
            return yval;
        }

        _calculateCoefficients() {
            var coeffs = this._coefficients,
                zero = false,
                i;

            this.order++;
            if (zero) {
                coeffs.pop();
            }
            super._calculateCoefficients();
            if (zero) {
            }
            this.order--;
        }

        //f0 = 1, f1 = x, f2 = x^2...
        _createBasis() {
            super._createBasis();

            var self = this,
                x = self.x,
                bas = self.basis,
                order = self.order;

            x.forEach((v, row) => {
                var col;

                bas[row] = [1];

                for (col = 1; col <= order; col++) {
                    bas[row][col] = v * bas[row][col - 1];
                }
            });
        }

        _concatEquation(equations: string[]): string {
            var str = 'y=',
                len = equations.length,
                coeffs = this.coefficients;
            equations.forEach(function (val, idx) {
                var pow = len - 1 - idx,
                    operator;
                if (pow === 0) {
                    str += val;
                } else if (pow === 1) {
                    operator = coeffs[idx + 1] >= 0 ? '+' : '';
                    str += val + 'x' + operator;
                } else {
                    operator = coeffs[idx + 1] >= 0 ? '+' : '';
                    str += val + 'x<sup>' + pow + '</sup>' + operator;
                }
            });
            return str;
        }
    }

    class FourierHelper extends LeastSquaresHelper {
        constructor(y: number[], x: number[], count?: number, order?: number) {
            order = order == null ? x.length : order;
            super(y, x, count, order);
        }

        //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
        _createBasis() {
            super._createBasis();

            var self = this,
                x = self.x,
                bas = self.basis,
                order = self.order;

            x.forEach((v, row) => {
                var col, n;

                bas[row] = [1];
                for (col = 1; col < order; col++) {
                    n = Math.floor((col + 1) / 2);
                    if (col % 2 === 1) {
                        bas[row].push(Math.cos(n * v));
                    } else {
                        bas[row].push(Math.sin(n * v));
                    }
                }
            });
        }

        calcY(xval: number): number {
            var coeffs = this._coefficients,
                yval;

            coeffs.forEach((v, i) => {
                var k = Math.floor((i + 1) / 2),
                    val;

                if (i === 0) {
                    yval = v;
                } else {
                    val = k * xval;
                    if ((i % 2) === 1) {
                        yval += v * Math.cos(val);
                    } else {
                        yval += v * Math.sin(val);
                    }
                }

            });
            return yval;
        }

        _concatEquation(equations: string[]): string {
            //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
            var str = 'y=',
                len = equations.length,
                coeffs = this.coefficients;
            equations.forEach(function (val, idx) {
                var operator = idx === len - 1 ? '' : (coeffs[idx + 1] >= 0 ? '+' : ''),
                    sincos = '',
                    x = Math.ceil(idx / 2);

                if (idx === 0) {
                    str += val + operator;
                } else {
                    if (idx % 2 === 1) {
                        sincos = 'cos';
                    } else {
                        sincos = 'sin';
                    }
                    sincos += '(' + (x === 1 ? '' : String(x)) + 'x)';
                    str += val + sincos + operator;
                }
            });
            return str;
        }
    }

    class SimpleTrendHelper extends TrendHelperBase {
        private _val: number;

        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        _setVal(val?: number) {
            this._val = val;
        }

        calcY(xval: number): number {
            return this._val;
        }
    }

    class MinXHelper extends SimpleTrendHelper {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calculateValues(): number[][]{
            var self = this,
                xMin = self.xMin,
                yMin = MathHelper.min(self.y),
                yMax = MathHelper.max(self.y),
                valsX, valsY;

            valsX = [xMin, xMin];
            valsY = [yMin, yMax];
            self._setVal(xMin);
            return [valsY, valsX];
        }

        getEquation(fmt: Function): string {
            var xMin = this.xMin;

            if (fmt) {
                xMin = fmt(xMin);
            }

            return 'x=' + xMin;
        }
    }

    class MinYHelper extends SimpleTrendHelper {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calculateValues(): number[][] {
            var self = this,
                xMin = self.xMin,
                xMax = self.xMax,
                yMin = MathHelper.min(self.y),
                valsX, valsY;

            valsX = [xMin, xMax];
            valsY = [yMin, yMin];
            self._setVal(yMin);
            return [valsY, valsX];
        }

        getEquation(fmt: Function): string {
            var yMin = MathHelper.min(this.y);

            if (fmt) {
                yMin = fmt(yMin);
            }

            return 'y=' + yMin;
        }
    }

    class MaxXHelper extends SimpleTrendHelper {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calculateValues(): number[][] {
            var self = this,
                xMax = self.xMax,
                yMin = MathHelper.min(self.y),
                yMax = MathHelper.max(self.y),
                valsX, valsY;

            valsX = [xMax, xMax];
            valsY = [yMin, yMax];
            self._setVal(xMax);
            return [valsY, valsX];
        }

        getEquation(fmt: Function): string {
            var xMax = this.xMax;

            if (fmt) {
                xMax = fmt(xMax);
            }

            return 'x=' + xMax;
        }
    }

    class MaxYHelper extends SimpleTrendHelper {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calculateValues(): number[][] {
            var self = this,
                xMin = self.xMin,
                xMax = self.xMax,
                yMax = MathHelper.max(self.y),
                valsX, valsY;

            valsX = [xMin, xMax];
            valsY = [yMax, yMax];
            self._setVal(yMax);
            return [valsY, valsX];
        }

        getEquation(fmt: Function): string {
            var yMax = MathHelper.max(this.y);

            if (fmt) {
                yMax = fmt(yMax);
            }

            return 'y=' + yMax;
        }
    }

    class AverageXHelper extends SimpleTrendHelper {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calculateValues(): number[][] {
            var self = this,
                xAverage = MathHelper.avg(self.x),
                yMin = MathHelper.min(self.y),
                yMax = MathHelper.max(self.y),
                valsX, valsY;

            valsX = [xAverage, xAverage];
            valsY = [yMin, yMax];
            self._setVal(xAverage);
            return [valsY, valsX];
        }

        _getEquation(fmt: Function): string {
            var xAverage = fmt(MathHelper.avg(this.x));

            return 'x=' + xAverage;
        }

        _defaultEquationFmt(coefficient: number): string {
            if (Math.abs(coefficient) < 1e5) {
                return super._defaultEquationFmt(coefficient);
            }
            return '' + MathHelper.round(coefficient, 2);
        }
    }

    class AverageYHelper extends SimpleTrendHelper {
        constructor(y: number[], x: number[], count?: number) {
            super(y, x, count);
        }

        calculateValues(): number[][] {
            var self = this,
                yAverage = MathHelper.avg(self.y),
                xMin = self.xMin,
                xMax = self.xMax,
                valsX, valsY;

            valsX = [xMin, xMax];
            valsY = [yAverage, yAverage];
            self._setVal(yAverage);
            return [valsY, valsX];
        }

        _getEquation(fmt: Function): string {
            var yAverage = fmt(MathHelper.avg(this.y));

            return 'y=' + yAverage;
        }

        _defaultEquationFmt(coefficient: number): string {
            if (Math.abs(coefficient) < 1e5) {
                return super._defaultEquationFmt(coefficient);
            }
            return '' + MathHelper.round(coefficient, 2);
        }
    }

    var TrendLineHelper = {
        TrendHelperBase: TrendHelperBase,
        Linear: LinearHelper,
        Exponential: ExpHelper,
        Logarithmic: LogHelper,
        Power: PowerHelper,
        Polynomial: PolyHelper,
        Fourier: FourierHelper,
        MinX: MinXHelper,
        MinY: MinYHelper,
        MaxX: MaxXHelper,
        MaxY: MaxYHelper,
        AverageX: AverageXHelper,
        AverageY: AverageYHelper
    }
} 
module wijmo.chart.analytics {
    'use strict';

    /**
     * Represents a base class of function series for @see:wijmo.chart.FlexChart.
     */
    export class FunctionSeries extends TrendLineBase {
        private _min: number;
        private _max: number;

        /**
         * Initializes a new instance of a @see:FunctionSeries object.
         * 
         * @param options A JavaScript object containing initialization data for the 
         * FunctionSeries.
         */
        constructor(options?) {
            super(options);

            if (this.itemsSource == null) {
                this.itemsSource = [new Point(0, 0)];
            }
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the minimum value of the parameter for calculating a function. 
         */
        get min(): number {
            return this._min;
        }
        set min(value: number) {
            if (this._min !== value) {
                this._min = asNumber(value, false);
                this._invalidate();
            }
        }
        
        /**
         * Gets or sets the maximum value of the parameter for calculating a function.
         */
        get max(): number {
            return this._max;
        }
        set max(value: number) {
            if (this._max !== value) {
                this._max = asNumber(value, false);
                this._invalidate();
            }
        }

        //--------------------------------------------------------------------------
        //** implementation

        getValues(dim: number): number[] {
            var self = this;

            if (self._xValues == null || self._yValues == null) {
                self._calculateValues();
            }

            if (dim === 0) {
                //y
                return self._yValues || null;
            } else if (dim === 1) {
                //x
                return self._xValues || null;
            }
        }

        _initProperties(o) {
            this._min = 0;
            this._max = 1;
            super._initProperties(o);
        }

        _calculateValues() {
            var self = this,
                npts = self.sampleCount,
                x: number[] = [],
                y: number[] = [],
                delta = (self.max - self.min) / (npts - 1),
                t: number;

            for (var i = 0; i < npts; i++) {
                t = i === npts - 1 ? this.max : this.min + delta * i;

                x[i] = self._calculateX(t);
                y[i] = self._calculateY(t);
            }

            self._yValues = y;
            self._xValues = x;
        }

        // performs simple validation of data value
        _validateValue(value: number): number {
            return isFinite(value) ? value : Number.NaN;
        }

        // calculate the value of the function
        _calculateValue(func: Function, parameter: number): number {
            var value: number;

            try {
                value = func(parameter);
            }
            catch (ex) {
                value = Number.NaN;
            }

            return this._validateValue(value);
        }

        _calculateX(value: number): number {
            return 0;
        }

        _calculateY(value: number): number {
            return 0;
        }
    }


    /**
     * Represents a Y function series of @see:wijmo.chart.FlexChart.
     *
     * The @see::YFunctionSeries allows to plot a function defined by formula y=f(x). 
     */
    export class YFunctionSeries extends FunctionSeries {
        private _func: Function;

        /**
         * Initializes a new instance of a @see:YFunctionSeries object.
         * 
         * @param options A JavaScript object containing initialization data for the
         * YFunctionSeries.
         */
        constructor(options?) {
            super(options);
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the function used to calculate Y value. 
         */
        get func(): Function {
            return this._func;
        }
        set func(value: Function) {
            if (value && this._func !== value) {
                this._func = asFunction(value, false);
                this._invalidate();
            }
        }
        
        //--------------------------------------------------------------------------
        //** implementation
        _calculateX(value: number): number {
            return value;
        }

        _calculateY(value: number): number {
            return this._calculateValue(this.func, value);
        }

        /**
         * Gets the approximate y value from the given x value.
         * 
         * @param x The x value to be used for calculating the Y value.
         */
        approximate(x: number): number {
            return this._calculateValue(this.func, x);
        }
    }

    /**
     * Represents a parametric function series for @see:wijmo.chart.FlexChart.
     * 
     * The @see::ParametricFunctionSeries allows to plot a function defined by formulas
     * x=f(t) and y=f(t).
     * The x and y values are calcluated by the given xFunc and yFunc.
     */
    export class ParametricFunctionSeries extends FunctionSeries {
        private _xFunc: Function;
        private _yFunc: Function;

        /**
         * Initializes a new instance of a @see:ParametricFunctionSeries object.
         * 
         * @param options A JavaScript object containing initialization data for the 
         * ParametricFunctionSeries.
         */
        constructor(options?) {
            super(options);
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the function used to calculate the x value. 
         */
        get xFunc(): Function {
            return this._xFunc;
        }
        set xFunc(value: Function) {
            if (value && this._xFunc !== value) {
                this._xFunc = asFunction(value, false);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the function used to calculate the y value. 
         */
        get yFunc(): Function {
            return this._yFunc;
        }
        set yFunc(value: Function) {
            if (value && this._yFunc !== value) {
                this._yFunc = asFunction(value, false);
                this._invalidate();
            }
        }

        //--------------------------------------------------------------------------
        //** implementation
        _calculateX(value: number): number {
            return this._calculateValue(this.xFunc, value);
        }

        _calculateY(value: number): number {
            return this._calculateValue(this.yFunc, value);
        }

        /**
         * Gets the approximate x and y from the given value.
         * 
         * @param value The value to calculate.
         */
        approximate(value: number) {
            var self = this,
                x = this._calculateValue(this.xFunc, value),
                y = this._calculateValue(this.yFunc, value);
            //add <any> for compiling error.
            return <any>new Point(x, y);
        }
    }
}
module wijmo.chart.analytics {
    'use strict';

    /**
     * Specifies the type of MovingAverage Series.
     */
    export enum MovingAverageType {
        /** 
         * An average of the last n values.
         */
        Simple,
        /**
         * Weighted average of the last n values, 
         * where the weightage decreases by 1 with each previous value.
         */
        Weighted,
        /**
         * Weighted average of the last n values, 
         * where the weightage decreases exponentially with each previous value.
         */
        Exponential,
        /**
         * Weighted average of the last n values, 
         * whose result is equivalent to a double smoothed simple moving average. 
         */
        Triangular 
    }
    
    /**
     * Represents a moving average trendline for @see:FlexChart and @see:FinancialChart.
     * It is a calculation to analyze data points by creating a series of averages of
     * different subsets of the full data set. You may define a different type on each
     * @see:MovingAverage object by setting the type property on the MovingAverage itself.
     * The MovingAverage class has a period property that allows you to set the number of
     * periods for computing the average value.
     */
    export class MovingAverage extends TrendLineBase {
        //http://daytrading.about.com/od/indicators/a/Triangular.htm
        //http://daytrading.about.com/od/indicators/a/MovingAverages.htm
        //http://en.wikipedia.org/wiki/Moving_average

        private _period: number;
        private _type: MovingAverageType;

        /**
         * Initializes a new instance of a @see:MovingAverage object.
         * 
         * @param options A JavaScript object containing initialization data for the MovingAverage Series.
         */
        constructor(options?) {
            super(options);
            this._chartType = ChartType.Line;
        }

        //--------------------------------------------------------------------------
        //** object model

        /**
         * Gets or sets the type of the moving average series.
         */
        get type(): MovingAverageType {
            return this._type;
        }
        set type(value: MovingAverageType) {
            if (value === this._type) {
                return;
            }
            this._type = asEnum(value, MovingAverageType, false);
            this._invalidate();
        }

        /**
         * Gets or sets the period of the moving average series.
         * It should be set to integer value greater than 1. 
         */
        get period(): number {
            return this._period;
        }
        set period(value: number) {
            if (value === this._period) {
                return;
            }
            this._period = asNumber(value, false, true);
            this._invalidate();
        }

        //--------------------------------------------------------------------------
        //** implementation

        _initProperties(o) {
            this._period = 2;
            this._type = MovingAverageType.Simple;

            super._initProperties(o);
        }

        _checkPeriod() {
            var period = this.period,
                oriXVals = this._originXValues;

            if (period <= 1) {
                assert(false, "period must be greater than 1.");
            }
            if (oriXVals && oriXVals.length && period >= oriXVals.length) {
                assert(false, "period must be less than itemSource's length.");
            }
        }

        _calculateValues() {
            var self = this,
                type = self._type,
                funcName = "_calculate" + MovingAverageType[self._type],
                x = [], y = [];

            self._checkPeriod();
            if (self[funcName]) {
                self[funcName].call(self, x, y);
            }

            self._yValues = y;
            self._xValues = x;
        }

        private _calculateSimple(x, y, forTMA: boolean = false) {
            var self = this,
                ox = self._originXValues,
                oy = self._originYValues,
                len = ox.length,
                p = self._period,
                i, total = 0;

            for (i = 0; i < len; i++) {
                total += oy[i];
                if (i >= p) {
                    total -= oy[i - p];
                }
                if (i >= p - 1) {
                    x.push(ox[i]);
                    y.push(total / p);
                } else if (forTMA) {
                    x.push(ox[i]);
                    y.push(total / (i + 1));
                }
            }
        }

        private _calculateWeighted(x, y) {
            var self = this,
                ox = self._originXValues,
                oy = self._originYValues,
                len = ox.length,
                p = self._period,
                denominator = p * (p + 1) / 2,
                i, total = 0, numerator = 0;

            for (i = 0; i < len; i++) {
                if (i > 0) {
                    total += oy[i - 1];
                }
                if (i > p) {
                    total -= oy[i - p - 1];
                }

                if (i < p - 1) {
                    numerator += oy[i] * (i + 1);
                } else {
                    numerator += oy[i] * p;
                    if (i > p - 1) {
                        numerator -= total;
                    }
                    x.push(ox[i]);
                    y.push(numerator / denominator);
                }
            }
        }

        private _calculateExponential(x, y) {
            var self = this,
                ox = self._originXValues,
                oy = self._originYValues,
                len = ox.length,
                p = self._period,
                i, ema = 0;

            for (i = 0; i < len; i++) {
                if (i <= p - 2) {
                    ema += oy[i];
                    if (i === p - 2) {
                        ema /= p - 1;
                    }
                    continue;
                }

                ema = ema + (2 / (p + 1)) * (oy[i] - ema);
                x.push(ox[i]);
                y.push(ema);
            }
        }

        private _calculateTriangular(x, y) {
            var self = this,
                p = self._period,
                ox = [], oy = [],
                i, len, total = 0;

            self._calculateSimple(ox, oy, true);

            for (i = 0, len = ox.length; i < len; i++) {
                total += oy[i];
                if (i >= p) {
                    total -= oy[i - p];
                }
                if (i >= p - 1) {
                    x.push(ox[i]);
                    y.push(total / p);
                }
            }
        }
    }

}

