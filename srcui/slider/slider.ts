﻿/// <reference path="../references.d.ts" />

module platui {
    /**
     * @name Slider
     * @memberof platui
     * @kind class
     *
     * @extends {plat.ui.BindControl}
     * @implements {platui.IUIControl}
     *
     * @description
     * An {@link plat.ui.BindControl|BindControl} that standardizes an HTML5 input[type="range"].
     */
    export class Slider extends plat.ui.BindControl implements IUiControl {
        protected static _inject: any = {
            _document: __Document,
            _window: __Window,
            _Promise: __Promise,
            _animator: __Animator
        };

        /**
         * @name templateString
         * @memberof platui.Slider
         * @kind property
         * @access public
         *
         * @type {string}
         *
         * @description
         * The HTML template represented as a string.
         */
        templateString: string =
        '<div class="plat-slider-container">\n' +
        '    <div class="plat-slider-track">\n' +
        '        <div class="plat-knob"></div>\n' +
        '    </div>\n' +
        '</div>\n';

        /**
         * @name options
         * @memberof platui.Slider
         * @kind property
         * @access public
         *
         * @type {plat.observable.IObservableProperty<platui.ISliderOptions>}
         *
         * @description
         * The evaluated {@link plat.controls.Options|plat-options} object.
         */
        options: plat.observable.IObservableProperty<ISliderOptions>;

        /**
         * @name value
         * @memberof platui.Slider
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The current value of the {@link platui.Slider|Slider}.
         */
        value: number;

        /**
         * @name min
         * @memberof platui.Slider
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The min value of the {@link platui.Slider|Slider}.
         */
        min: number;

        /**
         * @name max
         * @memberof platui.Slider
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The max value of the {@link platui.Slider|Slider}.
         */
        max: number;

        /**
         * @name _window
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {Window}
         *
         * @description
         * Reference to the Window injectable.
         */
        protected _window: Window;

        /**
         * @name _document
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {Document}
         *
         * @description
         * Reference to the Document injectable.
         */
        protected _document: Document;

        /**
         * @name _Promise
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {plat.async.IPromise}
         *
         * @description
         * Reference to the {@link plat.async.IPromise|IPromise} injectable.
         */
        protected _Promise: plat.async.IPromise;

        /**
         * @name _animator
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {plat.ui.animations.IAnimator}
         *
         * @description
         * Reference to the {@link plat.ui.animations.Animator|Animator} injectable.
         */
        protected _animator: plat.ui.animations.Animator;

        /**
         * @name _slider
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {HTMLElement}
         *
         * @description
         * The HTMLElement representing the slider.
         */
        protected _slider: HTMLElement;

        /**
         * @name _knob
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {HTMLElement}
         *
         * @description
         * The HTMLElement representing the knob.
         */
        protected _knob: HTMLElement;

        /**
         * @name _lastTouch
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {platui.IValuePoint}
         *
         * @description
         * The last touch start recorded.
         */
        protected _lastTouch: IValuePoint;

        /**
         * @name _maxOffset
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {number}
         *
         * @description
         * The maximum slider offset.
         */
        protected _maxOffset: number;

        /**
         * @name _sliderOffset
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {number}
         *
         * @description
         * The slider's offset left.
         */
        protected _sliderOffset: number;

        /**
         * @name _increment
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {number}
         *
         * @description
         * The slider's pixel based increment value.
         */
        protected _increment: number;

        /**
         * @name _step
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {number}
         *
         * @description
         * Denotes the incremental step value of the {@link platui.Slider|Slider's} value property.
         */
        protected _step: number;

        /**
         * @name _isVertical
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {boolean}
         *
         * @description
         * Whether the control is vertical or horizontal.
         */
        protected _isVertical: boolean = false;

        /**
         * @name _reversed
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {boolean}
         *
         * @description
         * Whether the min and max positions have been reversed.
         */
        protected _reversed: boolean;

        /**
         * @name _knobOffset
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {number}
         *
         * @description
         * The current knob offset.
         */
        protected _knobOffset: number = 0;

        /**
         * @name _touchState
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {number}
         *
         * @description
         * An enum denoting the current touch state of the user.
         */
        protected _touchState: number = 0;

        /**
         * @name _lengthProperty
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {string}
         *
         * @description
         * Denotes whether we're using height or width as the length of the slider.
         */
        protected _lengthProperty: string;

        /**
         * @name _removeVisibilityListener
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {plat.IRemoveListener}
         *
         * @description
         * A function that will stop listening for visibility if applicable.
         */
        protected _removeVisibilityListener: plat.IRemoveListener = noop;

        /**
         * @name _sliderVisible
         * @memberof platui.Slider
         * @kind property
         * @access protected
         *
         * @type {plat.async.IThenable<void>}
         *
         * @description
         * A Promise that indicates {@link platui.Slider|Slider} visibility.
         */
        protected _sliderVisible: plat.async.IThenable<void>;

        /**
         * @name setClasses
         * @memberof platui.Slider
         * @kind function
         * @access public
         *
         * @description
         * Sets the classes on the proper elements.
         *
         * @param {string} className? An optional, additional class name or class names to set on the control
         * in addition to its standard set.
         * @param {Element} element? The element to set the class name on. Should default to
         * the control's element if not specified.
         *
         * @returns {void}
         */
        setClasses(className?: string, element?: Element): void {
            this.dom.addClass(element || this.element, `${__Slider} ${(className || '')}`);
        }

        /**
         * @name initialize
         * @memberof platui.Slider
         * @kind function
         * @access public
         *
         * @description
         * Set the proper classes for the control.
         *
         * @returns {void}
         */
        initialize(): void {
            this.setClasses();
        }

        /**
         * @name loaded
         * @memberof platui.Slider
         * @kind function
         * @access public
         *
         * @description
         * Determine the button type and apply the proper classes.
         *
         * @returns {void}
         */
        loaded(): void {
            let element = this.element,
                slider = this._slider = <HTMLElement>element.firstElementChild.firstElementChild,
                isNumber = this.utils.isNumber,
                optionObj = this.options || <plat.observable.IObservableProperty<ISliderOptions>>{},
                options = optionObj.value || <ISliderOptions>{},
                optionValue = Number(options.value),
                optionMin = options.min,
                optionMax = options.max,
                step = options.step,
                reversed = this._reversed = (options.reverse === true),
                min = this.min = isNumber(optionMin) ? Math.floor(optionMin) : 0,
                max = this.max = isNumber(optionMax) ? Math.ceil(optionMax) : 100,
                value = isNumber(optionValue) ? Math.round(optionValue) : min,
                className = __Plat + this._validateOrientation(options.orientation);

            this._knob = <HTMLElement>slider.firstElementChild;

            if (reversed) {
                className += __Reversed;
            }

            this.dom.addClass(element, className);

            // reset value to minimum in case Bind set it to a value
            this.value = min;
            this._step = isNumber(step) ? (step > 0 ? Math.round(step) : 1) : 1;

            if (min >= max) {
                this._log.debug(`"${this.type}'s" min is greater than or equal to its max. Setting max to min + 1.`);
                this.max = min + 1;
            }

            this._setLength();
            this._initializeEvents();
            this.setValue(value);
        }

        /**
         * @name dispose
         * @memberof platui.Slider
         * @kind function
         * @access public
         *
         * @description
         * Removes the visibility listener if applicable.
         *
         * @returns {void}
         */
        dispose(): void {
            super.dispose();
            this._removeVisibilityListener();
            this._sliderVisible = null;
        }

        /**
         * @name setValue
         * @memberof platui.Slider
         * @kind function
         * @access public
         *
         * @description
         * Set the value of the {@link platui.Slider|Slider}. If an invalid value is passed in
         * nothing will happen.
         *
         * @param {number} value The value to set the {@link platui.Slider|Slider} to.
         *
         * @returns {void}
         */
        setValue(value: number): void {
            this._setValue(value, true);
        }

        /**
         * @name observeProperties
         * @memberof platui.Slider
         * @kind function
         * @access public
         * @virtual
         *
         * @description
         * A function that allows this control to observe both the bound property itself as well as
         * potential child properties if being bound to an object.
         *
         * @param {plat.observable.IImplementTwoWayBinding} binder The control that facilitates the
         * databinding.
         *
         * @returns {void}
         */
        observeProperties(binder: plat.observable.IImplementTwoWayBinding): void {
            binder.observeProperty(this._setBoundProperty);
        }

        /**
         * @name _setBoundProperty
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * The function called when the bindable value is set externally.
         *
         * @param {number} newValue The new value of the bindable value.
         * @param {number} oldValue The old value of the bindable index.
         * @param {void} identifier The child identifier of the property being observed.
         * @param {boolean} firstTime? Whether or not this is the first call to bind the property.
         *
         * @returns {void}
         */
        protected _setBoundProperty(newValue: number, oldValue: number, identifier: void, firstTime?: boolean): void {
            this._setValue(newValue, false);
        }

        /**
         * @name _setValue
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Sets the value of the {@link platui.Slider|Slider}.
         *
         * @param {number} value The value to set.
         * @param {boolean} propertyChanged Whether or not we need to fire a propertyChanged event.
         *
         * @returns {void}
         */
        protected _setValue(value: number, propertyChanged: boolean): void {
            let utils = this.utils;

            if (this._touchState === 1) {
                this._log.debug(`Cannot set the value of ${this.type} while the user is manipulating it.`);
                return;
            } else if (utils.isNull(value)) {
                value = this.min;
                propertyChanged = true;
            }

            if (!utils.isNumber(value)) {
                let numberVal = Number(value);
                if (utils.isNumber(numberVal)) {
                    value = numberVal;
                    propertyChanged = true;
                } else {
                    this._log.warn(`${this.type} has its value bound to a property that cannot be interpreted as a Number.`);
                    return;
                }
            }

            this._setValueProperty(value, true, propertyChanged);
        }

        /**
         * @name _initializeEvents
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Initialize the proper tracking events.
         *
         * @returns {void}
         */
        protected _initializeEvents(): void {
            let element = this.element,
                trackFn = this._track,
                touchEnd = this._touchEnd,
                track: string,
                reverseTrack: string;

            if (this._isVertical) {
                track = `${__$track}down`;
                reverseTrack = `${__$track}up`;
            } else {
                track = `${__$track}right`;
                reverseTrack = `${__$track}left`;
            }

            this.addEventListener(element, __$touchstart, this._touchStart, false);
            this.addEventListener(element, track, trackFn, false);
            this.addEventListener(element, reverseTrack, trackFn, false);
            this.addEventListener(element, __$touchend, touchEnd, false);
            this.addEventListener(element, __$trackend, touchEnd, false);
            this.addEventListener(this._window, 'resize', (): void => {
                if (!this.utils.isNull(this._sliderVisible)) {
                    return;
                }

                this._setLength();
                this._setKnob();
            }, false);
        }

        /**
         * @name _touchStart
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Log the first touch.
         *
         * @param {plat.ui.IGestureEvent} ev The touch event object.
         *
         * @returns {void}
         */
        protected _touchStart(ev: plat.ui.IGestureEvent): void {
            if (this._touchState === 1) {
                return;
            }

            this._touchState = 1;

            this._lastTouch = {
                x: ev.clientX,
                y: ev.clientY,
                value: this.value
            };

            let target = ev.target;
            if (target === this._knob) {
                return;
            }

            let offset: number;
            if (this._isVertical) {
                if (target === this.element) {
                    offset = this._reversed ? ev.offsetY - this._sliderOffset : this._maxOffset - (ev.offsetY - this._sliderOffset);
                } else if (target === this._slider) {
                    offset = this._reversed ? ev.offsetY : this._knobOffset - ev.offsetY;
                } else {
                    offset = this._reversed ? ev.offsetY : this._maxOffset - ev.offsetY;
                }
            } else {
                if (target === this.element) {
                    offset = this._reversed ? this._maxOffset - (ev.offsetX - this._sliderOffset) : ev.offsetX - this._sliderOffset;
                } else if (target === this._slider) {
                    offset = this._reversed ? this._knobOffset - ev.offsetX : ev.offsetX;
                } else {
                    offset = this._reversed ? this._maxOffset - ev.offsetX : ev.offsetX;
                }
            }

            this.utils.requestAnimationFrame((): void => {
                this._knobOffset = this._setSliderProperties(offset);
            });
        }

        /**
         * @name _touchEnd
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Set the new slider offset.
         *
         * @param {plat.ui.IGestureEvent} ev The $trackend event object.
         *
         * @returns {void}
         */
        protected _touchEnd(ev: plat.ui.IGestureEvent): void {
            if (this._touchState !== 1) {
                this._touchState = 0;
                return;
            }

            this._touchState = 2;

            let newOffset = this._calculateOffset(ev),
                maxOffset = this._maxOffset;

            this.utils.requestAnimationFrame((): void => {
                this._touchState = 0;

                if (this._lastTouch.value !== this.value) {
                    this._trigger('change');
                }

                if (newOffset < 0) {
                    this._knobOffset = 0;
                    return;
                } else if (newOffset > maxOffset) {
                    this._knobOffset = maxOffset;
                    return;
                }

                this._knobOffset = newOffset;
            });
        }

        /**
         * @name _track
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Track the knob movement.
         *
         * @param {plat.ui.IGestureEvent} ev The $track event object.
         *
         * @returns {void}
         */
        protected _track(ev: plat.ui.IGestureEvent): void {
            if (this._touchState === 0) {
                return;
            }

            this.utils.requestAnimationFrame((): void => {
                this._setSliderProperties(this._calculateOffset(ev));
            });
        }

        /**
         * @name _setSliderProperties
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Set the {@link platui.Slider|Slider's} knob position and corresponding value.
         *
         * @param {number} position The position value to set the knob to prior to
         * normalization.
         *
         * @returns {number} The normalized position value.
         */
        protected _setSliderProperties(position: number): number {
            let maxOffset = this._maxOffset,
                value: number;

            if (position <= 0) {
                value = this.min;
                position = 0;
                if (value - this.value >= 0) {
                    return position;
                }
            } else if (position >= maxOffset) {
                value = this.max;
                position = maxOffset;
                if (value - this.value <= 0) {
                    return position;
                }
            } else {
                value = this._calculateValue(position);
            }

            this._setValueProperty(value, false, true);
            this._slider.style[<any>this._lengthProperty] = `${position}px`;

            return position;
        }

        /**
         * @name _calculateValue
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Calculates the current value based on knob position and slider width.
         *
         * @param {number} width The current width of the slider.
         *
         * @returns {number} The current value of the {link platui.Slider|Slider}.
         */
        protected _calculateValue(width: number): number {
            let step = this._step;
            return (this.min + Math.round(width / this._increment / step) * step);
        }

        /**
         * @name _calculateKnobPosition
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Calculates knob position based on current value.
         *
         * @param {number} value The current value of the {link platui.Slider|Slider}.
         *
         * @returns {number} The current position of the knob in pixels.
         */
        protected _calculateKnobPosition(value: number): number {
            return (value - this.min) * this._increment;
        }

        /**
         * @name _calculateOffset
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Calculates the new offset of the slider based on the old offset and the distance moved.
         *
         * @param {plat.ui.IGestureEvent} ev The $track or $trackend event object.
         *
         * @returns {number} The current position of the knob in pixels.
         */
        protected _calculateOffset(ev: plat.ui.IGestureEvent): number {
            if (this._isVertical) {
                return this._reversed ?
                    (this._knobOffset + ev.clientY - this._lastTouch.y) :
                    (this._knobOffset + this._lastTouch.y - ev.clientY);
            } else {
                return this._reversed ?
                    (this._knobOffset + this._lastTouch.x - ev.clientX) :
                    (this._knobOffset + ev.clientX - this._lastTouch.x);
            }
        }

        /**
         * @name _setLength
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Sets the property to use for length and sets the max length of the slider.
         *
         * @returns {void}
         */
        protected _setLength(): void {
            let el = this._slider.parentElement;

            if (this._isVertical) {
                this._lengthProperty = 'height';
                this._maxOffset = el.clientHeight;
                this._sliderOffset = el.offsetTop;
            } else {
                this._lengthProperty = 'width';
                this._maxOffset = el.clientWidth;
                this._sliderOffset = el.offsetLeft;
            }

            if (!this._maxOffset) {
                this._sliderVisible = new this._Promise<void>((resolve) => {
                    this._removeVisibilityListener = this.dom.whenVisible((): void => {
                        this._sliderVisible = null;
                        this._setLength();
                        resolve();
                    }, el);
                });
                return;
            }

            this._setIncrement();
        }

        /**
         * @name _setIncrement
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Sets the increment for sliding the {link platui.Slider|Slider}.
         *
         * @returns {number} The slider's increment value.
         */
        protected _setIncrement(): number {
            return (this._increment = this._maxOffset / (this.max - this.min));
        }

        /**
         * @name _setValueProperty
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Sets the value of the {@link platui.Slider|Slider}.
         *
         * @param {number} newValue The new value to set.
         * @param {boolean} setKnob Whether or not we need to set the knob position.
         * @param {boolean} propertyChanged Whether or not we need to fire a propertyChanged event.
         *
         * @returns {void}
         */
        protected _setValueProperty(newValue: number, setKnob: boolean, propertyChanged: boolean): void {
            let value = this.value;
            if (newValue === value) {
                return;
            } else if (newValue >= this.max) {
                newValue = this.max;
            } else if (newValue <= this.min) {
                newValue = this.min;
            } else if (Math.abs(newValue - value) < this._step) {
                return;
            }

            this.value = (<any>this.element).value = newValue;

            if (setKnob) {
                this._setKnob();
            }

            if (propertyChanged) {
                this.inputChanged(newValue, value);
            }

            this._trigger('input');
        }

        /**
         * @name _setKnob
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Animates and sets the knob position.
         *
         * @param {number} value? The value to use to calculate the knob position. If no value is
         * specified, the current {@link platui.Slider|Slider's} value will be used.
         *
         * @returns {void}
         */
        protected _setKnob(value?: number): void {
            this._Promise.resolve(this._sliderVisible).then((): void => {
                let animationOptions: plat.IObject<string> = {},
                    length = this._calculateKnobPosition((value || this.value));

                if (length === this._knobOffset) {
                    return;
                }

                animationOptions[this._lengthProperty] = `${length}px`;
                this._animator.animate(this._slider, __Transition, {
                    properties: animationOptions
                });

                this._knobOffset = length;
            });
        }

        /**
         * @name _trigger
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Triggers an event starting from this control's element.
         *
         * @param {string} event The event name to trigger.
         *
         * @returns {void}
         */
        protected _trigger(event: string): void {
            let domEvent: plat.ui.DomEvent = plat.acquire(__DomEventInstance);
            domEvent.initialize(this.element, event);
            domEvent.trigger();
        }

        /**
         * @name _validateOrientation
         * @memberof platui.Slider
         * @kind function
         * @access protected
         *
         * @description
         * Checks the orientation of the control and ensures it is valid.
         * Will default to "horizontal" if invalid.
         *
         * @param {string} orientation The element to base the length off of.
         *
         * @returns {string} The orientation to be used.
         */
        protected _validateOrientation(orientation: string): string {
            if (this.utils.isUndefined(orientation)) {
                return 'horizontal';
            }

            let validOrientation: string;
            if (orientation === 'horizontal') {
                validOrientation = orientation;
            } else if (orientation === 'vertical') {
                validOrientation = orientation;
                this._isVertical = true;
            } else {
                this._log.debug(`Invalid orientation "${orientation}" for ${this.type}. Defaulting to "horizontal."`);
                validOrientation = 'horizontal';
            }

            return validOrientation;
        }
    }

    plat.register.control(__Slider, Slider);

    /**
     * @name ISliderOptions
     * @memberof platui
     * @kind interface
     *
     * @description
     * The available {@link plat.controls.Options|options} for the {@link platui.Slider|Slider} control.
     */
    export interface ISliderOptions {
        /**
         * @name orientation
         * @memberof platui.ISliderOptions
         * @kind property
         * @access public
         *
         * @type {string}
         *
         * @description
         * The orientation of the {@link platui.Slider|Slider}.
         * Defaults to "horizontal".
         *
         * @remarks
         * - "horizontal" - horizontal control.
         * - "vertical" - vertical control.
         */
        orientation?: string;

        /**
         * @name reverse
         * @memberof platui.ISliderOptions
         * @kind property
         * @access public
         *
         * @type {boolean}
         *
         * @description
         * Whether or not the min and max positions are reversed.
         * Defaults to false.
         */
        reverse?: boolean;

        /**
         * @name value
         * @memberof platui.ISliderOptions
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The current value of the {@link platui.Slider|Slider}.
         */
        value?: number;

        /**
         * @name min
         * @memberof platui.ISliderOptions
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The minimum value of the {@link platui.Slider|Slider}.
         */
        min?: number;

        /**
         * @name max
         * @memberof platui.ISliderOptions
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The maximum value of the {@link platui.Slider|Slider}.
         */
        max?: number;

        /**
         * @name step
         * @memberof platui.ISliderOptions
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The incremental step value of the {@link platui.Slider|Slider}.
         */
        step?: number;
    }
}
