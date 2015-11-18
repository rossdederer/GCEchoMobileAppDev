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
declare module wijmo.chart.interaction {
    /**
    * Range Slider.
    */
    class _RangeSlider {
        private static _HRANGESLIDER;
        private static _VRANGESLIDER;
        private static _RANGESLIDER_DECBTN;
        private static _RANGESLIDER_INCBTN;
        private static _RANGESLIDER_RANGEHANDLE;
        private static _RANGESLIDER_MINHANDLE;
        private static _RANGESLIDER_MAXHANDLE;
        private static _RANGESLIDER_HANDLE_ACTIVE;
        private _isVisible;
        private _buttonsVisible;
        private _minScale;
        private _rsContainer;
        private _rsEle;
        private _decBtn;
        private _incBtn;
        private _rsContent;
        private _minHandler;
        private _rangeHandler;
        private _maxHandler;
        private _wrapperSliderMousedown;
        private _wrapperDocMouseMove;
        private _wrapperDocMouseup;
        private _wrapperBtnMousedown;
        private _wrapperRangeSpaceMousedown;
        private _wrapperRangeMouseleave;
        private _isTouch;
        private _slidingInterval;
        private _rangeSliderRect;
        private _isHorizontal;
        private _isBtnMousedown;
        private _needSpaceClick;
        private _hasButtons;
        private _movingEle;
        private _movingOffset;
        private _range;
        private _plotBox;
        private _startPt;
        public _minPos: number;
        public _maxPos: number;
        constructor(container: HTMLElement, needSpaceClick: boolean, hasButtons?: boolean, options?: any);
        /**
        * Gets or sets the decrease button and increase button is visible or not.
        */
        public buttonsVisible : boolean;
        /**
        * Gets or sets the orientation of the range slider.
        */
        public isHorizontal : boolean;
        /**
        * Gets or sets the visibility of the range slider.
        */
        public isVisible : boolean;
        /**
        * Gets or sets the minimum range scale of the range slider.
        */
        public minScale : number;
        /**
        * Occurs after the range changed.
        */
        public rangeChanged: Event;
        /**
        * Raises the @see:rangeChanged event.
        */
        public onRangeChanged(e?: EventArgs): void;
        /**
        * Occurs while the range changing.
        */
        public rangeChanging: Event;
        /**
        * Raises the @see:rangeChanging event.
        */
        public onRangeChanging(e?: EventArgs): void;
        public _isSliding : boolean;
        public _handleWidth : number;
        private _createSlider(container);
        private _switchEvent(isOn);
        private _onSliderMousedown(e);
        private _onDocMouseMove(e);
        private _onMove(mvPt);
        private _onDocMouseup(e);
        private _onRangeSpaceMousedown(e);
        private _onRangeMouseleave(e);
        private _onBtnMousedown(e);
        public _refresh(rsRect?: any): void;
        private _updateElesPosition();
        private _refreshSlider(minCss, rangeCss, maxCss);
        private _invalidate();
        private _changeRange(offset);
        private _doSliding(offset, pt?);
        private _setSlidingInterval(offset, pt?);
        private _clearInterval();
        private _getRsRect();
    }
}

/**
* Defines classes that add interactive features to charts.
*/
declare module wijmo.chart.interaction {
    /**
    * Specifies the orientation of the range selector.
    */
    enum Orientation {
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
    class RangeSelector {
        private _isVisible;
        private _min;
        private _max;
        private _orientation;
        private _chart;
        private _rangeSelectorEle;
        private _range;
        private _rangeSlider;
        /**
        * Initializes a new instance of the @see:RangeSelector control.
        *
        * @param chart The FlexChart that displays the selected range.
        * @param options A JavaScript object containing initialization data for the control.
        */
        constructor(chart: FlexChartCore, options?: any);
        /**
        * Gets or sets the visibility of the range selector.
        */
        public isVisible : boolean;
        /**
        * Gets or sets the minimum value of the range.
        * If not set, the minimum is calculated automatically.
        */
        public min : number;
        /**
        * Gets or sets the maximum value of the range.
        * If not set, the maximum is calculated automatically.
        */
        public max : number;
        /**
        * Gets or sets the orientation of the range selector.
        */
        public orientation : Orientation;
        /**
        * Occurs after the range changes.
        */
        public rangeChanged: Event;
        /**
        * Raises the @see:rangeChanged event.
        */
        public onRangeChanged(e?: EventArgs): void;
        /**
        * Removes the range selector from the chart.
        */
        public remove(): void;
        private _createRangeSelector();
        private _switchEvent(isOn);
        private _refresh();
        private _adjustMinAndMax();
        private _changeRange();
        private _updateRange();
    }
}

