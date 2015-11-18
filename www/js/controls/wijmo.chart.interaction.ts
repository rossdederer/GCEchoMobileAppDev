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
module wijmo.chart.interaction {
    'use strict';
    
    /**
     * Range Slider.
     */
    export class _RangeSlider {
        // Static class
        private static _HRANGESLIDER = 'wj-chart-hrangeslider';
        private static _VRANGESLIDER = 'wj-chart-vrangeslider';
        private static _RANGESLIDER_DECBTN = 'wj-rangeslider-decbtn';
        private static _RANGESLIDER_INCBTN = 'wj-rangeslider-incbtn';
        private static _RANGESLIDER_RANGEHANDLE = 'wj-rangeslider-rangehandle';
        private static _RANGESLIDER_MINHANDLE = 'wj-rangeslider-minhandle';
        private static _RANGESLIDER_MAXHANDLE = 'wj-rangeslider-maxhandle';
        private static _RANGESLIDER_HANDLE_ACTIVE = 'wj-rangeslider-handle-active';

        // fields
        private _isVisible: boolean = true;
        private _buttonsVisible: boolean = true;
        private _minScale: number = 0;

        // elements
        private _rsContainer: HTMLElement = null;
        private _rsEle: HTMLElement = null;
        private _decBtn: HTMLElement = null;
        private _incBtn: HTMLElement = null;
        private _rsContent: HTMLElement = null;
        private _minHandler: HTMLElement = null;
        private _rangeHandler: HTMLElement = null;
        private _maxHandler: HTMLElement = null;

        // event
        private _wrapperSliderMousedown = null;
        private _wrapperDocMouseMove = null;
        private _wrapperDocMouseup = null;
        private _wrapperBtnMousedown = null;
        private _wrapperRangeSpaceMousedown = null;
        private _wrapperRangeMouseleave = null;

        // helper field
        private _isTouch: boolean = false;
        private _slidingInterval = null;
        private _rangeSliderRect = null;
        private _isHorizontal: boolean = true;
        private _isBtnMousedown: boolean = false;
        private _needSpaceClick: boolean = false;
        private _hasButtons: boolean = true;
        private _movingEle: HTMLElement = null;
        private _movingOffset: Rect = null;
        private _range: number = null;
        private _plotBox;
        private _startPt: Point = null;

        _minPos: number = 0;
        _maxPos: number = 1;

        constructor(container: HTMLElement, needSpaceClick: boolean, hasButtons?: boolean, options?) {
            if (!container) {
                assert(false, 'The container cannot be null.');
            }

            this._isTouch = 'ontouchstart' in window; //isTouchDevice();

            this._needSpaceClick = needSpaceClick; // whether has space click function
            this._hasButtons = hasButtons;  //whether has dec and inc buttons
            wijmo.copy(this, options);
            this._createSlider(container);
        }

        /**
         * Gets or sets the decrease button and increase button is visible or not.
         */
        get buttonsVisible(): boolean {
            return this._buttonsVisible;
        }
        set buttonsVisible(value: boolean) {
            if (value != this._buttonsVisible) {
                this._buttonsVisible = asBoolean(value);

                if (!this._rsContainer || !this._hasButtons) {
                    return;
                }
                this._refresh();
            }
        }

        /**
         * Gets or sets the orientation of the range slider.
         */
        get isHorizontal(): boolean {
            return this._isHorizontal;
        }
        set isHorizontal(value: boolean) {
            if (value != this._isHorizontal) {
                this._isHorizontal = asBoolean(value);
                if (!this._rsContainer) {
                    return;
                }
                this._invalidate();
            }
        }

        /**
         * Gets or sets the visibility of the range slider.
         */
        get isVisible(): boolean {
            return this._isVisible;
        }
        set isVisible(value: boolean) {
            if (value != this._isVisible) {
                this._isVisible = asBoolean(value);
                if (!this._rsContainer) {
                    return;
                }
                this._rsContainer.style.visibility = this._isVisible ? 'visible' : 'hidden';
            }
        }

        /**
         * Gets or sets the minimum range scale of the range slider.
         */
        get minScale(): number {
            return this._minScale;
        }
        set minScale(value: number) {
            if (value >= 0 && value != this._minScale) {
                this._minScale = asNumber(value);           
            }
        }

        /**
        * Occurs after the range changed.
        */
        rangeChanged = new Event();

        /**
         * Raises the @see:rangeChanged event.
         */
        onRangeChanged(e?: EventArgs) {
            this.rangeChanged.raise(this, e);
        }

        /**
        * Occurs while the range changing.
        */
        rangeChanging = new Event();

        /**
         * Raises the @see:rangeChanging event.
         */
        onRangeChanging(e?: EventArgs) {
            this.rangeChanging.raise(this, e);
        }

        get _isSliding() {
            return this._startPt !== null;
        }

        get _handleWidth(): number {
            return this._minHandler.offsetWidth;
        }

        private _createSlider(container: HTMLElement) {
            var sCss = this._isHorizontal ? _RangeSlider._HRANGESLIDER : _RangeSlider._VRANGESLIDER,
                decBtnCss = this._isHorizontal ? 'wj-glyph-left' : 'wj-glyph-down',
                incBtnCss = this._isHorizontal ? 'wj-glyph-right' : 'wj-glyph-up',
                off, box;

            this._rsContainer = container;
            this._rsContainer.style.visibility = this._isVisible ? 'visible' : 'hidden';
            this._rsEle = createElement('<div class="wj-chart-rangeslider ' + sCss + '"></div>');
            this._rsContainer.appendChild(this._rsEle);

            if (this._hasButtons) {
                 //decrease button
                this._decBtn = createElement(
                    '<button class="wj-rangeslider-decbtn wj-btn wj-btn-default" type="button" tabindex="-1">' +
                    '<span class="' + decBtnCss + ' ' + _RangeSlider._RANGESLIDER_DECBTN + '"></span>' +
                    '</button>');
                this._rsEle.appendChild(this._decBtn);

                //increase button
                this._incBtn = createElement(
                    '<button class="wj-rangeslider-incbtn wj-btn wj-btn-default" type="button" tabindex="-1">' +
                    '<span class="' + incBtnCss + ' ' + _RangeSlider._RANGESLIDER_INCBTN + '"></span>' +
                    '</button>');
                this._rsEle.appendChild(this._incBtn);
            }

            //creating range slider
            this._rsContent = createElement('<div class="wj-rangeslider-content">' +
                '<div class="wj-rangeslider-rangehandle"></div>' +
                '<div class="wj-rangeslider-minhandle"></div>' +
                '<div class="wj-rangeslider-maxhandle"></div>');
            this._rsEle.appendChild(this._rsContent);

            this._minHandler = <HTMLElement>this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_MINHANDLE);
            this._rangeHandler = <HTMLElement>this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_RANGEHANDLE);
            this._maxHandler = <HTMLElement>this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_MAXHANDLE);

            //bind event
            this._wrapperSliderMousedown = this._onSliderMousedown.bind(this);
            this._wrapperDocMouseMove = this._onDocMouseMove.bind(this);
            this._wrapperDocMouseup = this._onDocMouseup.bind(this);
            this._wrapperRangeSpaceMousedown = this._onRangeSpaceMousedown.bind(this);
            this._wrapperRangeMouseleave = this._onRangeMouseleave.bind(this);
            this._wrapperBtnMousedown = this._onBtnMousedown.bind(this);
            this._switchEvent(true);
        }

        private _switchEvent(isOn: boolean) {
            var eventListener = isOn ? 'addEventListener' : 'removeEventListener',
                eventHandler = isOn ? 'addHandler' : 'removeHandler';

            if (this._rsContainer) {
                if (this._needSpaceClick) {
                    this._rsEle[eventListener]('mousedown', this._wrapperRangeSpaceMousedown);
                }
                this._rsEle[eventListener]('mouseleave', this._wrapperRangeMouseleave);
                this._rsContent[eventListener]('mousedown', this._wrapperSliderMousedown);

                if (this._hasButtons) {
                    this._decBtn[eventListener]('mousedown', this._wrapperBtnMousedown);
                    this._incBtn[eventListener]('mousedown', this._wrapperBtnMousedown);
                }

                document[eventListener]('mousemove', this._wrapperDocMouseMove);
                document[eventListener]('mouseup', this._wrapperDocMouseup);

                if ('ontouchstart' in window) {
                    if (this._needSpaceClick) {
                        this._rsEle[eventListener]('touchstart', this._wrapperRangeSpaceMousedown);
                    }
                    this._rsContent[eventListener]('touchstart', this._wrapperSliderMousedown);

                    if (this._hasButtons) {
                        this._decBtn[eventListener]('touchstart', this._wrapperBtnMousedown);
                        this._incBtn[eventListener]('touchstart', this._wrapperBtnMousedown);
                    }

                    document[eventListener]('touchmove', this._wrapperDocMouseMove);
                    document[eventListener]('touchend', this._wrapperDocMouseup);
                }
            }
        }

        private _onSliderMousedown(e) {
            if (!this._isVisible) {
                return;
            }

            this._movingEle = e.srcElement || e.target;
            this._startPt = e instanceof MouseEvent ?
            new wijmo.Point(e.pageX, e.pageY) :
            new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
            wijmo.removeClass(this._minHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
            wijmo.removeClass(this._maxHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
            this._movingOffset = wijmo.getElementRect(this._movingEle);
            if (this._movingEle != this._rangeHandler) {
                if (this._isHorizontal) {
                    this._movingOffset.left += 0.5 * this._movingEle.offsetWidth;
                } else {
                    this._movingOffset.top += 0.5 * this._movingEle.offsetHeight;
                }
                wijmo.addClass(this._movingEle, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
            } else {
                this._range = this._maxPos - this._minPos;
            }

            e.preventDefault();
        }

        private _onDocMouseMove(e) {
            if (!this._isVisible || !this._startPt) {
                return;
            }

            var movingPt = e instanceof MouseEvent ?
                new wijmo.Point(e.pageX, e.pageY) :
                new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);

            this._onMove(movingPt);
            //e.preventDefault();
        }

        private _onMove(mvPt: wijmo.Point) {
            var self = this,
                strPt = this._startPt, movingOffset = this._movingOffset,
                plotBox = this._plotBox, range = this._range, moving = this._movingEle,
                left = this._minHandler, middle = this._rangeHandler, right = this._maxHandler,
                x, y, pos;

            if (strPt && movingOffset) {
                if (this._isHorizontal) {
                    x = movingOffset.left + mvPt.x - strPt.x;
                    pos = (x - plotBox.x) / plotBox.width;
                } else {
                    y = movingOffset.top + mvPt.y - strPt.y;
                    pos = 1 - (y - plotBox.y) / plotBox.height;
                }

                if (pos < 0) {
                    pos = 0;
                } else if (pos > 1) {
                    pos = 1;
                } 

                if (moving === left) {
                    if (pos > this._maxPos - this._minScale) {
                        pos = this._maxPos - this._minScale;
                    }
                    this._minPos = pos;
                } else if (moving === right) {
                    if (pos < this._minPos + this._minScale) {
                        pos = this._minPos + this._minScale;
                    }
                    this._maxPos = pos;
                } else if (moving === middle) {
                    if (this._isHorizontal) {
                        this._minPos = pos;
                        this._maxPos = this._minPos + range;
                        if (this._maxPos >= 1) {
                            this._maxPos = 1;
                            this._minPos = this._maxPos - range;
                        }
                    } else {
                        this._maxPos = pos;
                        this._minPos = this._maxPos - range;
                        if (this._minPos <= 0) {
                            this._minPos = 0;
                            this._maxPos = this._minPos + range;
                        }
                    }
                }
                this._updateElesPosition();
                this.onRangeChanging();
            }
        }

        private _onDocMouseup(e) {
            var chart, axis, actualMin, actualMax, range;

            if (!this._isVisible) {
                return;
            }

            // fire event
            this._clearInterval();            
            this._isBtnMousedown = false;
            if (this._startPt) {
                this.onRangeChanged();
                this._startPt = null;
                this._movingOffset = null;
            }
        }

        private _onRangeSpaceMousedown(e) {
            var pt = e instanceof MouseEvent ?
                new wijmo.Point(e.pageX, e.pageY) :
                new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY),
                sOffset = wijmo.getElementRect(this._rsContent),
                rOffset = wijmo.getElementRect(this._rangeHandler),
                clickEle = e.srcElement || e.target,
                offset = 0;

            e.stopPropagation();
            e.preventDefault();
            if (clickEle !== this._rsContent && clickEle !== this._rsEle) {
                return;
            }

            if (this._isHorizontal) {
                offset = rOffset.width / sOffset.width;
                if (pt.x < rOffset.left) {
                    offset = -1 * offset;
                } else if (pt.x > rOffset.left + rOffset.width) {
                    offset = 1 * offset;
                }
            } else {
                offset = rOffset.height / sOffset.height;
                if (pt.y < rOffset.top) {
                    offset = 1 * offset;
                } else if (pt.y > rOffset.top + rOffset.height) {
                    offset = -1 * offset;
                }
            }

            if (offset !== 0) {
                this._doSliding(offset, pt);
            }
        }

        private _onRangeMouseleave(e) {
            e.stopPropagation();
            e.preventDefault();

            if (!this._isBtnMousedown) {
                return;
            }
            //fire event
            this._clearInterval();
            this.onRangeChanged();
        }

        private _onBtnMousedown(e) {
            var targetEle = e.srcElement || e.target, offset = 0;

            e.stopPropagation();
            e.preventDefault();

            if (hasClass(targetEle, _RangeSlider._RANGESLIDER_DECBTN)) {
                if (this._minPos === 0) {
                    return;
                }
                offset = -0.05;
            } else if (hasClass(targetEle, _RangeSlider._RANGESLIDER_INCBTN)) {
                if (this._maxPos === 1) {
                    return;
                }
                offset = 0.05;
            }

            this._isBtnMousedown = true;
            if (offset !== 0) {
                this._doSliding(offset);
            }
        }

        _refresh(rsRect?) {
            var sliderOffset = 0, containerOffset = 0,
                slbarCss, rangeSliderEleCss,
                rOffset = wijmo.getElementRect(this._rsContainer);

            if (rsRect) {
                this._rangeSliderRect = rsRect;
            }

            if (!this._rangeSliderRect) {
                return;
            }

            if (this._hasButtons && this._buttonsVisible) {
                this._decBtn.style.display = 'block';
                this._incBtn.style.display = 'block';
                sliderOffset = this._isHorizontal ? this._decBtn.offsetWidth + this._minHandler.offsetWidth / 2 :
                this._decBtn.offsetHeight + this._minHandler.offsetHeight / 2;
            } else {
                if (this._hasButtons) {
                    this._decBtn.style.display = 'none';
                    this._incBtn.style.display = 'none';
                }
                sliderOffset = this._isHorizontal ? this._minHandler.offsetWidth / 2 : this._minHandler.offsetHeight / 2;
            }

            slbarCss = this._getRsRect();
            if (this._isHorizontal) {               
                slbarCss.left -= this._minHandler.offsetWidth / 2;
                slbarCss.width += this._minHandler.offsetWidth;       
                rangeSliderEleCss = { left: sliderOffset, width: slbarCss.width - sliderOffset * 2 };     
            } else {
                //slbarCss.left -= this._minHandler.offsetWidth;
                slbarCss.top -= this._minHandler.offsetHeight/2;
                slbarCss.height += this._minHandler.offsetHeight;
                rangeSliderEleCss = { top: sliderOffset, height: slbarCss.height - sliderOffset * 2 };
            }

            wijmo.setCss(this._rsEle, slbarCss);
            wijmo.setCss(this._rsContent, rangeSliderEleCss);

            rOffset = wijmo.getElementRect(this._rsContent);
            this._plotBox = { x: rOffset.left, y: rOffset.top, width: rOffset.width, height: rOffset.height };
            this._updateElesPosition();
        }

        private _updateElesPosition() {
            var minHandle = this._minHandler, rangeHandle = this._rangeHandler,
                maxHandle = this._maxHandler, box = this._plotBox,
                rangeCss, minCss, rangeCss, maxCss,
                isHorizontal = this._isHorizontal;

            if (box) {
                minCss = isHorizontal ?
                { left: this._minPos * box.width - 0.5 * minHandle.offsetWidth } :
                { top: (1 - this._minPos) * box.height - 0.5 * maxHandle.offsetHeight };

                rangeCss = isHorizontal ?
                { left: this._minPos * box.width, width: (this._maxPos - this._minPos) * box.width } :
                { top: (1 - this._maxPos) * box.height, height: (this._maxPos - this._minPos) * box.height };

                maxCss = isHorizontal ?
                { left: this._maxPos * (box.width) - 0.5 * maxHandle.offsetWidth } :
                { top: (1 - this._maxPos) * box.height - 0.5 * minHandle.offsetHeight };

                this._refreshSlider(minCss, rangeCss, maxCss);
            }
        }

        private _refreshSlider(minCss, rangeCss, maxCss) {
            wijmo.setCss(this._minHandler, minCss);
            wijmo.setCss(this._rangeHandler, rangeCss);
            wijmo.setCss(this._maxHandler, maxCss);
        }

        private _invalidate() {
            var addClass, rmvClass;

            if (!this._rsContainer) {
                return;
            }
            //get needed adding and removing class
            addClass = this._isHorizontal ?
            _RangeSlider._HRANGESLIDER : _RangeSlider._VRANGESLIDER;
            rmvClass = this._isHorizontal?
            _RangeSlider._VRANGESLIDER : _RangeSlider._HRANGESLIDER;

            wijmo.removeClass(this._rsEle, rmvClass);
            wijmo.addClass(this._rsEle, addClass);
      
            //clear inline style
            [this._rsEle, this._rsContent, this._minHandler,
                this._maxHandler, this._rangeHandler].forEach((ele) => {
                ele.removeAttribute("style");
            })
            this._refresh();
        }

        private _changeRange(offset) {
            var range = this._maxPos - this._minPos;

            if ((offset < 0 && this._minPos === 0) || ((offset > 0 && this._maxPos === 1))) {
                return;
            }
            if (offset < 0) {
                this._minPos += offset;
                this._minPos = this._minPos < 0 ? 0 : this._minPos;
                this._maxPos = this._minPos + range;
            } else {
                this._maxPos += offset;
                this._maxPos = this._maxPos > 1 ? 1 : this._maxPos;
                this._minPos = this._maxPos - range;
            }

            this._updateElesPosition();
        }

        private _doSliding(offset, pt?: Point) {
            var sOffset = wijmo.getElementRect(this._rsContent),
                rOffset = wijmo.getElementRect(this._rangeHandler);

            this._clearInterval();

            this._startPt = new Point();
            this._changeRange(offset);
            this.onRangeChanged();
            this._setSlidingInterval(offset, pt);
        }

        private _setSlidingInterval(offset, pt?: Point) {
            var self = this,
                sOffset, rOffset;
           
            this._slidingInterval = window.setInterval(function () {
                if (pt) {
                    //clear the interval when the rangeslider is on mouse position.
                    sOffset = wijmo.getElementRect(self._rsContent);
                    rOffset = wijmo.getElementRect(self._rangeHandler);
                    if (self._isHorizontal) {
                        if (pt.x >= rOffset.left && pt.x <= rOffset.left + rOffset.width) {
                            self._clearInterval();
                            return;
                        }
                    } else {
                        if (pt.y >= rOffset.top && pt.y <= rOffset.top + rOffset.height) {
                            self._clearInterval();
                            return;
                        }
                    }
                }
                self._changeRange(offset);
                self.onRangeChanged();            
            }, 200);
        }

        private _clearInterval() {
            if (this._slidingInterval) {
                window.clearInterval(this._slidingInterval);
            }
        }

        private _getRsRect() {
            var rsRect = this._rangeSliderRect, rect = {};
            if (!rsRect) {
                return;
            }
            ['left', 'top', 'width', 'height'].forEach(function (key) {
                if (rsRect[key]) {
                    rect[key] = rsRect[key];
                }
            })
            return rect;
        }
    }
}
/**
 * Defines classes that add interactive features to charts.
 */
module wijmo.chart.interaction {
    'use strict';

    /**
    * Specifies the orientation of the range selector.
    */
    export enum Orientation {
        /** Horizontal, x-data range. */
        X = 0,
        /** Vertical, y-data range. */
        Y = 1,
    }

    /**
     * The @see:RangeSelector control displays a range selector that allows the user to
     * choose the range of data to display on the specified @see:FlexChart.
     *
     * To use the @see:RangeSelector control, specify the @see:FlexChart
     * control on which to display the selected range of data.
     *
     * The @see:rangeChanged event fires when the min or max value changes.
     * For example:
     * <pre>
     *  var rangeSelector = new wijmo.chart.interaction.RangeSelector(chart);
     *  rangeSelector.rangeChanged.addHandler(function () {
     *     // perform related updates
     *     // e.g. modify displayed range of another chart
     *     update(rangeSelector.min, rangeSelector.max);
     *   });
     * </pre>
     */
    export class RangeSelector {
        // fields
        private _isVisible = true;                              // range selector is visible or not
        private _min: number = null;                            // minimum value
        private _max: number = null;                            // maximum value
        private _orientation: Orientation = Orientation.X;      // range selector's orientation

        private _chart: wijmo.chart.FlexChartCore = null;       // chart host
        private _rangeSelectorEle: HTMLElement = null;          // range selector div element

        private _range;                                         // range

        private _rangeSlider: _RangeSlider = null;

        /**
         * Initializes a new instance of the @see:RangeSelector control.
         *
         * @param chart The FlexChart that displays the selected range.
         * @param options A JavaScript object containing initialization data for the control.
         */
        constructor(chart: wijmo.chart.FlexChartCore, options?) {
            if (!chart) {
                assert(false, 'The FlexChart cannot be null.');
            }

            this._chart = chart;
            wijmo.copy(this, options);
            this._createRangeSelector();
        }

        /**
         * Gets or sets the visibility of the range selector.
         */
        get isVisible(): boolean {
            return this._isVisible;
        }
        set isVisible(value: boolean) {
            if (value != this._isVisible) {
                this._isVisible = asBoolean(value);
                if (!this._rangeSlider) {
                    return;
                }
                this._rangeSlider.isVisible = value;
            }
        }

        /**
         * Gets or sets the minimum value of the range.
         * If not set, the minimum is calculated automatically.
         */
        get min(): number {
            return this._min;
        }
        set min(value: number) {
            if (value !== this._min) {
                this._min = asNumber(value, true, false);
                if (!this._rangeSlider) {
                    return;
                }
                this._changeRange();
            }
        }

        /**
         * Gets or sets the maximum value of the range.
         * If not set, the maximum is calculated automatically.
         */
        get max(): number {
            return this._max;
        }
        set max(value: number) {
            if (value !== this._max) {
                this._max = asNumber(value, true, false);
                if (!this._rangeSlider) {
                    return;
                }
                this._changeRange();
            }
        }

        /**
         * Gets or sets the orientation of the range selector.
         */
        get orientation(): Orientation {
            return this._orientation;
        }
        set orientation(value: Orientation) {
            if (value !== this._orientation) {
                this._orientation = asEnum(value, Orientation);
                if (!this._rangeSlider) {
                    return;
                }
                this._rangeSlider.isHorizontal = value === Orientation.X;
            }
        }

        /**
         * Occurs after the range changes.
         */
        rangeChanged = new Event();

        /**
         * Raises the @see:rangeChanged event.
         */
        onRangeChanged(e?: EventArgs) {
            this.rangeChanged.raise(this, e);
        }

        /**
         * Removes the range selector from the chart.
         */
        remove() {
            if (this._rangeSelectorEle) {
                this._chart.hostElement.removeChild(this._rangeSelectorEle);
                this._switchEvent(false);
                this._rangeSelectorEle = null;
                this._rangeSlider = null;
            }
        }

        private _createRangeSelector() {
            var chart = this._chart,
                chartHostEle = chart.hostElement,
                isHorizontal = this._orientation === Orientation.X;

            this._rangeSelectorEle = createElement('<div class="wj-chart-rangeselector-container"></div>');
            this._rangeSlider = new _RangeSlider(this._rangeSelectorEle,
                false, //no range click
                false, //no buttons
                {
                    //options settings
                    isHorizontal: isHorizontal,
                    isVisible: this._isVisible
                }
                );
            chartHostEle.appendChild(this._rangeSelectorEle);

            this._switchEvent(true);
        }

        private _switchEvent(isOn: boolean) {
            var eventHandler = isOn ? 'addHandler' : 'removeHandler';

            if (this._chart.hostElement) {
                this._rangeSlider.rangeChanged[eventHandler](this._updateRange, this);
                this._chart.rendered[eventHandler](this._refresh, this);
            }
        }

        private _refresh() {
            var chartHostEle = this._chart.hostElement,
                pa, pOffset, plotBox, rOffset = wijmo.getElementRect(this._rangeSelectorEle);

            pa = chartHostEle.querySelector('.' + FlexChart._CSS_PLOT_AREA);
            pOffset = wijmo.getElementRect(pa);
            plotBox = pa.getBBox();

            this._adjustMinAndMax();

            // position and sized rangeslider
            this._rangeSlider._refresh(
                {
                    left: plotBox.x,
                    top: pOffset.top - rOffset.top,
                    width: plotBox.width,
                    height: plotBox.height
                });
        }

        private _adjustMinAndMax() {
            var self = this, chart = self._chart, rangeSlider = self._rangeSlider,
                min = self._min, max = self._max,
                axis = self._orientation === Orientation.X ? chart.axisX : chart.axisY,
                actualMin = isDate(axis.actualMin) ? axis.actualMin.valueOf() : axis.actualMin,
                actualMax = isDate(axis.actualMax) ? axis.actualMax.valueOf() : axis.actualMax,
                range = actualMax - actualMin;

            self._min = (min === null || isNaN(min) || min === undefined || min < actualMin || min > actualMax) ? actualMin : min;
            self._max = (max === null || isNaN(max) || max === undefined || max < actualMin || max > actualMax) ? actualMax : max;

            // removed
            //rangeSlider._minPos = (self._min - actualMin) / range;
            //rangeSlider._maxPos = (self._max - actualMin) / range;
            //
            // The previous code is only for regular(linear) axis.
            // Take into account non-linear axis:
            var plotRect = this._chart._plotRect;
            if (!plotRect) {
                return;
            }
            if (this._orientation === Orientation.X) {
                var minPos = (axis.convert(self._min) - plotRect.left) / plotRect.width;
                rangeSlider._minPos = minPos;
                var maxPos = (axis.convert(self._max) - plotRect.left) / plotRect.width;
                rangeSlider._maxPos = maxPos;
            } else {
                var minPos = (plotRect.top - axis.convert(self._min)) / plotRect.height + 1;
                rangeSlider._minPos = minPos;
                var maxPos = (plotRect.top - axis.convert(self._max)) / plotRect.height + 1;
                rangeSlider._maxPos = maxPos;
            }
        }

        private _changeRange() {
            this._adjustMinAndMax();

            if (!this._rangeSelectorEle) {
                return;
            }

            this._rangeSlider._refresh();
            this.onRangeChanged();
        }

        private _updateRange() {
            var rangeSlider = this._rangeSlider,
                chart, axis, actualMin, actualMax, range;
            chart = this._chart;
            axis = this._orientation === Orientation.X ? chart.axisX : chart.axisY,
            actualMin = isDate(axis.actualMin) ? axis.actualMin.valueOf() : axis.actualMin,
            actualMax = isDate(axis.actualMax) ? axis.actualMax.valueOf() : axis.actualMax;
            range = actualMax - actualMin;
            //raise event

            // removed
            // this._min = actualMin + this._minPos * range;
            // this._max = actualMin + this._maxPos * range;
            //
            // The previous code is only for regular(linear) axis.
            // take into account non-linear axis

            var plotRect = this._chart._plotRect;
            if (this._orientation === Orientation.X) {
                var xmin = plotRect.left + rangeSlider._minPos * plotRect.width;
                this._min = axis.convertBack(xmin);
                var xmax = plotRect.left + rangeSlider._maxPos * plotRect.width;
                this._max = axis.convertBack(xmax);
            } else {
                var ymin = plotRect.top + (1 - rangeSlider._minPos) * plotRect.height;
                this._min = axis.convertBack(ymin);
                var ymax = plotRect.top + (1 - rangeSlider._maxPos) * plotRect.height;
                this._max = axis.convertBack(ymax);
            }
            this.onRangeChanged();
        }
    }
}
