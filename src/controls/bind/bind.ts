/**
 * @name controls
 * @memberof plat
 * @kind namespace
 * @access public
 *
 * @description
 * Holds all classes and interfaces related to attribute control components in platypus.
 */
module plat.controls {
    'use strict';

    /**
     * @name Bind
     * @memberof plat.controls
     * @kind class
     *
     * @extends {plat.AttributeControl}
     * @implements {plat.observable.IImplementTwoWayBinding}
     *
     * @description
     * Facilitates two-way databinding for HTMLInputElements, HTMLSelectElements, and HTMLTextAreaElements.
     */
    export class Bind extends AttributeControl implements observable.IImplementTwoWayBinding {
        protected static _inject: any = {
            _parser: __Parser,
            _ContextManager: __ContextManagerStatic,
            _compat: __Compat,
            _document: __Document
        };

        /**
         * @name priority
         * @memberof plat.controls.Bind
         * @kind property
         * @access public
         *
         * @type {number}
         *
         * @description
         * The priority of {@link plat.controls.Bind|Bind} is set high to precede
         * other controls that may be listening to the same
         * event.
         */
        priority: number = 100;

        /**
         * @name _parser
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         * @static
         *
         * @type {plat.expressions.Parser}
         *
         * @description
         * Reference to the {@link plat.expressions.Parser|Parser} injectable.
         */
        protected _parser: expressions.Parser;

        /**
         * @name _ContextManager
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         * @static
         *
         * @type {plat.observable.IContextManagerStatic}
         *
         * @description
         * Reference to the {@link plat.observable.IContextManagerStatic|IContextManagerStatic} injectable.
         */
        protected _ContextManager: observable.IContextManagerStatic;

        /**
         * @name _compat
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         * @static
         *
         * @type {plat.Compat}
         *
         * @description
         * Reference to the {@link plat.Compat|Compat} injectable.
         */
        protected _compat: Compat;

        /**
         * @name _document
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         * @static
         *
         * @type {Document}
         *
         * @description
         * Reference to the Document injectable.
         */
        protected _document: Document;

        /**
         * @name _addEventType
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * The function used to add the proper event based on the input type.
         *
         * @returns {void}
         */
        protected _addEventType: () => void;

        /**
         * @name _getter
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * The function used to get the bound value.
         *
         * @returns {any} The bound value.
         */
        protected _getter: () => any;

        /**
         * @name _setter
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * The function used to set the bound value.
         *
         * @returns {void}
         */
        protected _setter: (newValue: any, oldValue?: any, firstTime?: boolean) => void;

        /**
         * @name _expression
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         *
         * @type {plat.expressions.IParsedExpression}
         *
         * @description
         * The expression to evaluate as the bound value.
         */
        protected _expression: expressions.IParsedExpression;

        /**
         * @name _contextExpression
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         *
         * @type {plat.expressions.IParsedExpression}
         *
         * @description
         * The IParsedExpression used to evaluate the context
         * of the bound property.
         */
        protected _contextExpression: expressions.IParsedExpression;

        /**
         * @name _property
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         *
         * @type {string}
         *
         * @description
         * The bound property name.
         */
        protected _property: string;

        /**
         * @name _propertyType
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         *
         * @type {string}
         *
         * @description
         * The initial type of the bound property if defined.
         */
        protected _propertyType: string;

        /**
         * @name _supportsTwoWayBinding
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         *
         * @type {boolean}
         *
         * @description
         * Whether or not {@link plat.controls.Bind|Bind} is being used in conjunction
         * with a {@link plat.ui.TemplateControl|TemplateControl} that implements the
         * interface {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding}.
         */
        protected _supportsTwoWayBinding: boolean = false;

        /**
         * @name _dateRegex
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         *
         * @type {RegExp}
         *
         * @description
         * A regular expression used to determine if the value is in HTML5 date format YYYY-MM-DD.
         */
        protected _dateRegex: RegExp = /([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;

        /**
         * @name _dateTimeLocalRegex
         * @memberof plat.controls.Bind
         * @kind property
         * @access protected
         *
         * @type {RegExp}
         *
         * @description
         * A regular expression used to determine if the value is in HTML5 datetime-local format YYYY-MM-DDTHH:MM(:ss.SSS).
         */
        protected _dateTimeLocalRegex: RegExp = /([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])T(0[1-9]|1[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]+))?)?/;

        /**
         * @name __fileSupported
         * @memberof plat.controls.Bind
         * @kind property
         * @access private
         *
         * @type {boolean}
         *
         * @description
         * Whether or not the File API is supported.
         */
        private __fileSupported: boolean = (<Compat>acquire(__Compat)).fileSupported;

        /**
         * @name __fileNameRegex
         * @memberof plat.controls.Bind
         * @kind property
         * @access private
         *
         * @type {RegExp}
         *
         * @description
         * Used to grab a filename from input[type="file"].
         */
        private __fileNameRegex: RegExp = (<expressions.Regex>acquire(__Regex)).fileNameRegex;

        /**
         * @name __isSelf
         * @memberof plat.controls.Bind
         * @kind property
         * @access private
         *
         * @type {boolean}
         *
         * @description
         * Used to denote that a property change happened from within this control.
         */
        private __isSelf: boolean = false;

        /**
         * @name initialize
         * @memberof plat.controls.Bind
         * @kind function
         * @access public
         *
         * @description
         * Determines the type of Element being bound to
         * and sets the necessary handlers.
         *
         * @returns {void}
         */
        initialize(): void {
            this._determineType();
        }

        /**
         * @name loaded
         * @memberof plat.controls.Bind
         * @kind function
         * @access public
         *
         * @description
         * Parses and watches the expression being bound to.
         *
         * @returns {void}
         */
        loaded(): void {
            let parent = this.parent;
            if (isNull(parent) || isNull(this.element)) {
                return;
            }

            let attr = camelCase(this.type),
                _parser = this._parser,
                expression = this._expression = _parser.parse(this.attributes[attr]);

            let identifiers = expression.identifiers;

            if (identifiers.length !== 1) {
                this._log.warn('Only 1 identifier allowed in a ' + this.type + ' expression.');
                this._contextExpression = null;
                return;
            }

            let split = identifiers[0].split('.');
            this._property = split.pop();

            if (expression.aliases.length > 0) {
                let alias = expression.aliases[0],
                    resourceObj = parent.findResource(alias),
                    type: string;

                if (isObject(resourceObj)) {
                    type = resourceObj.resource.type;

                    if (type !== __OBSERVABLE_RESOURCE && type !== __LITERAL_RESOURCE) {
                        return;
                    }
                } else {
                    resourceObj = <any>{ resource: {} };
                }

                if (alias === __CONTEXT_RESOURCE || alias === __ROOT_CONTEXT_RESOURCE) {
                    this._contextExpression = _parser.parse(split.join('.'));
                } else {
                    this._property = 'value';

                    this._contextExpression = {
                        evaluate: (): ui.IResource => {
                            return resourceObj.resource;
                        },
                        aliases: [],
                        identifiers: [],
                        expression: ''
                    };
                }
            } else if (split.length > 0) {
                this._contextExpression = _parser.parse(split.join('.'));
            } else {
                this._contextExpression = {
                    evaluate: (): any => {
                        return parent.context;
                    },
                    aliases: [],
                    identifiers: [],
                    expression: ''
                };
            }

            if (this._supportsTwoWayBinding) {
                (<ui.BindControl>this.templateControl).observeProperties(this);
            }

            this._watchExpression();

            if (isNull(this._addEventType)) {
                return;
            }

            this._addEventType();
        }

        /**
         * @name contextChanged
         * @memberof plat.controls.Bind
         * @kind function
         * @access public
         *
         * @description
         * Re-observes the expression with the new context.
         *
         * @returns {void}
         */
        contextChanged(): void {
            this._watchExpression();
        }

        /**
         * @name dispose
         * @memberof plat.controls.Bind
         * @kind function
         * @access public
         *
         * @description
         * Removes all of the element's event listeners.
         *
         * @returns {void}
         */
        dispose(): void {
            this._addEventType = null;
        }

        /**
         * @name evaluate
         * @memberof plat.controls.Bind
         * @kind function
         * @access public
         *
         * @description
         * Gets the current value of the bound property.
         *
         * @returns {any} The current value of the bound property.
         */
        evaluate(): any {
            let expression = this._expression;
            if (isUndefined(expression)) {
                return;
            }

            return this.evaluateExpression(expression);
        }

        /**
         * @name observeProperty
         * @memberof plat.controls.Bind
         * @kind function
         * @access public
         * @variation 0
         *
         * @description
         * The function that allows a control implementing {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding} to observe
         * changes to the bound property and/or its child properties.
         *
         * @typeparam {any} T The type of item being observed.
         *
         * @param {plat.observable.IBoundPropertyChangedListener<T>} listener The listener to fire when the bound property or its
         * specified child changes.
         * @param {string} identifier? The identifier of the child property of the bound item.
         * @param {boolean} autocast? Will cast a primitive value to whatever it was set to in code.
         *
         * @returns {plat.IRemoveListener} A function for removing the listener.
         */
        observeProperty<T>(listener: observable.IBoundPropertyChangedListener<T>, identifier?: string, autocast?: boolean): IRemoveListener;
        /**
         * @name observeProperty
         * @memberof plat.controls.Bind
         * @kind function
         * @access public
         * @variation 1
         *
         * @description
         * The function that allows a control implementing {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding} to observe
         * changes to the bound property and/or its child properties.
         *
         * @typeparam {any} T The type of item being observed.
         *
         * @param {plat.observable.IBoundPropertyChangedListener<T>} listener The listener to fire when the bound property or its
         * specified child changes.
         * @param {number} index? The index of the child property of the bound item if the bound item is an Array.
         * @param {boolean} autocast? Will cast a primitive value to whatever it was set to in code.
         *
         * @returns {plat.IRemoveListener} A function for removing the listener.
         */
        observeProperty<T>(listener: observable.IBoundPropertyChangedListener<T>, index?: number, autocast?: boolean): IRemoveListener;
        observeProperty<T>(listener: observable.IBoundPropertyChangedListener<T>, identifier?: any, autocast?: boolean): IRemoveListener {
            return this._observeProperty(listener, identifier, autocast);
        }

        /**
         * @name observeArrayChange
         * @memberof plat.observable.IImplementTwoWayBinding
         * @kind function
         * @access public
         * @variation 0
         *
         * @description
         * A function that allows a {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding} to observe both the
         * bound property itself as well as potential child properties if being bound to an object.
         *
         * @typeparam {any} T The type of items in the Array if listening for Array mutations.
         *
         * @param {(changes: Array<plat.observable.IArrayChanges<T>>, identifier: string) => void} listener The listener function.
         * @param {string} identifier? The identifier off of the bound object to listen to for changes. If undefined or empty
         * the listener will listen for changes to the bound item itself.
         * @param {boolean} arrayMutationsOnly? Whether or not to listen only for Array mutation changes.
         *
         * @returns {plat.IRemoveListener} A function to stop listening for changes.
         */
        observeArrayChange<T>(listener: (changes: Array<observable.IArrayChanges<T>>, identifier: string) => void, identifier?: string): IRemoveListener;
        /**
         * @name observeArrayChange
         * @memberof plat.observable.IImplementTwoWayBinding
         * @kind function
         * @access public
         * @variation 1
         *
         * @description
         * A function that allows a {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding} to observe both the
         * bound property itself as well as potential child properties if being bound to an object.
         *
         * @typeparam {any} T The type of items in the Array if listening for Array mutations.
         *
         * @param {(changes: Array<plat.observable.IArrayChanges<T>>, identifier: number) => void} listener The listener function.
         * @param {number} index? The index off of the bound object to listen to for changes if the bound object is an Array.
         * If undefined or empty the listener will listen for changes to the bound Array itself.
         * @param {boolean} arrayMutationsOnly? Whether or not to listen only for Array mutation changes.
         *
         * @returns {plat.IRemoveListener} A function to stop listening for changes.
         */
        observeArrayChange<T>(listener: (changes: Array<observable.IArrayChanges<T>>, identifier: number) => void, index?: number): IRemoveListener;
        observeArrayChange<T>(listener: (changes: Array<observable.IArrayChanges<T>>, identifier: any) => void, identifier?: any): IRemoveListener {
            return this._observeProperty(listener, identifier, false, true);
        }

        /**
         * @name _addTextEventListener
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Adds a text event as the event listener.
         * Used for textarea and input[type="text"].
         *
         * @returns {void}
         */
        protected _addTextEventListener(): void {
            let element = this.element,
                _compat = this._compat,
                composing = false,
                input = 'input',
                timeout: IRemoveListener,
                eventListener = (): void => {
                    if (composing) {
                        return;
                    }

                    this._propertyChanged();
                },
                postponedEventListener = (): void => {
                    if (isFunction(timeout)) {
                        return;
                    }

                    timeout = postpone((): void => {
                        eventListener();
                        timeout = null;
                    });
                };

            if (isUndefined(_compat.ANDROID)) {
                this.addEventListener(element, 'compositionstart', (): void => { composing = true; }, false);
                this.addEventListener(element, 'compositionend', (): void => {
                    composing = false;
                    eventListener();
                }, false);
            }

            if (_compat.hasEvent(input)) {
                this.addEventListener(element, input, eventListener, false);
            } else {
                this.addEventListener(element, 'keydown', (ev: KeyboardEvent): void => {
                    let key = ev.keyCode || ev.which,
                        codes = KeyCodes;

                    if (key === codes.lwk ||
                        key === codes.rwk ||
                        (key >= codes.shift && key <= codes.escape) ||
                        (key > codes.space && key <= codes.down)) {
                        return;
                    }

                    postponedEventListener();
                }, false);
                this.addEventListener(element, 'cut', postponedEventListener, false);
                this.addEventListener(element, 'paste', postponedEventListener, false);
            }

            this.addEventListener(element, 'change', eventListener, false);
        }

        /**
         * @name _addChangeEventListener
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Adds a change event as the event listener.
         * Used for select, input[type="radio"], and input[type="range"].
         *
         * @returns {void}
         */
        protected _addChangeEventListener(): void {
            this.addEventListener(this.element, 'change', this._propertyChanged, false);
        }

        /**
         * @name _addButtonEventListener
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Adds a $tap event as the event listener.
         * Used for input[type="button"] and button.
         *
         * @returns {void}
         */
        protected _addButtonEventListener(): void {
            this.addEventListener(this.element, __tap, this._propertyChanged, false);
        }

        /**
         * @name _addChangeEventListener
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Adds a change event as the event listener.
         * Used for select, input[type="radio"], and input[type="range"].
         *
         * @returns {void}
         */
        protected _addRangeEventListener(): void {
            let element = this.element,
                input = 'input';

            if (this._compat.hasEvent(input)) {
                this.addEventListener(element, input, this._propertyChanged, false);
            }

            this.addEventListener(element, 'change', this._propertyChanged, false);
        }

        /**
         * @name _getChecked
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for input[type="checkbox"] and input[type="radio"].
         *
         * @returns {boolean} Whether or not the input element is checked.
         */
        protected _getChecked(): boolean {
            return (<HTMLInputElement>this.element).checked;
        }

        /**
         * @name _getValue
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for input[type="text"], input[type="range"],
         * textarea, and select.
         *
         * @returns {string} The input value.
         */
        protected _getValue(): string {
            return (<HTMLInputElement>this.element).value;
        }

        /**
         * @name _getTextContent
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for button.
         *
         * @returns {string} The button textContent.
         */
        protected _getTextContent(): string {
            return (<HTMLInputElement>this.element).textContent;
        }

        /**
         * @name _getDate
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for input[type="date"].
         *
         * @returns {any} A date object if browser supports HTML5 format YYYY-MM-DD
         * and the user didn't initially bind to a valid string value else just the string value.
         */
        protected _getDate(): any {
            let value = (<HTMLInputElement>this.element).value,
                regex = this._dateRegex;

            if (this._propertyType !== 'string' && regex.test(value)) {
                let exec = regex.exec(value);
                if (exec.length === 4) {
                    return new Date(Number(exec[1]), Number(exec[2]) - 1, Number(exec[3]));
                }
            }

            return <any>value;
        }

        /**
         * @name _getDateTimeLocal
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for input[type="datetime-local"].
         *
         * @returns {any} A date object if browser supports HTML5 format YYYY-MM-DDTHH:MM(:ss.SSS)
         * and the user didn't initially bind to a valid string value else just the string value.
         */
        protected _getDateTimeLocal(): Date {
            let value = (<HTMLInputElement>this.element).value,
                regex = this._dateTimeLocalRegex;

            if (this._propertyType !== 'string' && regex.test(value)) {
                let exec = regex.exec(value);
                if (exec.length === 8) {
                    if (isNull(exec[6])) {
                        return new Date(Number(exec[1]), Number(exec[2]) - 1, Number(exec[3]), Number(exec[4]), Number(exec[5]));
                    } else if (isNull(exec[7])) {
                        return new Date(Number(exec[1]), Number(exec[2]) - 1, Number(exec[3]), Number(exec[4]), Number(exec[5]), Number(exec[6]));
                    }

                    return new Date(Number(exec[1]), Number(exec[2]) - 1, Number(exec[3]), Number(exec[4]), Number(exec[5]), Number(exec[6]), Number(exec[7]));
                }
            }

            return <any>value;
        }

        /**
         * @name _getFile
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for input[type="file"]. Creates a partial IFile
         * element if file is not supported.
         *
         * @returns {plat.controls.IFile} The input file.
         */
        protected _getFile(): IFile {
            let element = <HTMLInputElement>this.element,
                value = element.value;

            if (this.__fileSupported) {
                if (element.files.length > 0) {
                    return <IFile>element.files[0];
                }

                return null;
            }

            return <any>{
                name: value.replace(this.__fileNameRegex, ''),
                path: value,
                lastModifiedDate: undefined,
                type: undefined,
                size: undefined,
                msDetachStream: noop,
                msClose: noop,
                slice: (): Blob => <Blob>{ }
            };
        }

        /**
         * @name _getFiles
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for input[type="file"]-multiple.
         *
         * @returns {Array<plat.controls.IFile>} The input files.
         */
        protected _getFiles(): Array<IFile> {
            let element = <HTMLInputElement>this.element;

            if (this.__fileSupported) {
                return Array.prototype.slice.call(element.files);
            }

            // this case should never be hit since ie9 does not support multi-file uploads,
            // but kept in here for now for consistency's sake
            let filelist = element.value.split(/,|;/g),
                length = filelist.length,
                files: Array<IFile> = [],
                fileValue: string,
                blobSlice = (): Blob => <Blob>{};

            for (let i = 0; i < length; ++i) {
                fileValue = filelist[i];
                files.push(<any>{
                    name: fileValue.replace(this.__fileNameRegex, ''),
                    path: fileValue,
                    lastModifiedDate: undefined,
                    type: undefined,
                    size: undefined,
                    msDetachStream: noop,
                    msClose: noop,
                    slice: blobSlice
                });
            }

            return files;
        }

        /**
         * @name _getSelectedValues
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Getter for select-multiple.
         *
         * @returns {Array<string>} The selected values.
         */
        protected _getSelectedValues(): Array<string> {
            let options = (<HTMLSelectElement>this.element).options,
                length = options.length,
                option: HTMLOptionElement,
                selectedValues: Array<string> = [];

            for (let i = 0; i < length; ++i) {
                option = <HTMLOptionElement>options[i];
                if (option.selected) {
                    selectedValues.push(option.value);
                }
            }

            return selectedValues;
        }

        /**
         * @name _setText
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for textarea, input[type="text"],
         * and input[type="button"], and select.
         *
         * @param {any} newValue The new value to set
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setText(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            }

            if (isNull(newValue)) {
                newValue = '';

                if (firstTime === true) {
                    if (isNull((<HTMLInputElement>this.element).value)) {
                        this._setValue(newValue);
                    }
                    this._propertyChanged();
                    return;
                }
            }

            this._setValue(newValue);
        }

        /**
         * @name _setRange
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for input[type="range"].
         *
         * @param {any} newValue The new value to set
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setRange(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            }

            if (isEmpty(newValue)) {
                newValue = newValue === '' ? '0' : 0;

                if (firstTime === true) {
                    if (isEmpty((<HTMLInputElement>this.element).value)) {
                        this._setValue(newValue);
                    }
                    this._propertyChanged();
                    return;
                }
            }

            this._setValue(newValue);
        }

        /**
         * @name _setHidden
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for input[type="hidden"].
         *
         * @param {any} newValue The new value to set
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setHidden(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            }

            if (isEmpty(newValue)) {
                newValue = '';

                if (firstTime === true) {
                    if (isEmpty((<HTMLInputElement>this.element).value)) {
                        this._setValue(newValue);
                    }
                    this._propertyChanged();
                    return;
                }
            }

            this._setValue(newValue);
        }

        /**
         * @name _setValue
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Sets the value on an element.
         *
         * @param {any} newValue The new value to set
         *
         * @returns {void}
         */
        protected _setValue(newValue: any): void {
            let element = <HTMLInputElement>this.element;

            if (!isString(newValue)) {
                if (isNumber(newValue)) {
                    this._propertyType = 'number';
                    newValue = newValue.toString();
                } else if (isBoolean(newValue)) {
                    this._propertyType = 'boolean';
                    newValue = newValue.toString();
                }
            }

            if (element.value === newValue) {
                return;
            }

            element.value = newValue;
        }

        /**
         * @name _setChecked
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for input[type="checkbox"]
         *
         * @param {any} newValue The new value to set
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setChecked(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            } else if (!isBoolean(newValue)) {
                newValue = !!newValue;
                if (firstTime === true) {
                    (<HTMLInputElement>this.element).checked = newValue;
                    this._propertyChanged();
                    return;
                }
            }

            (<HTMLInputElement>this.element).checked = newValue;
        }

        /**
         * @name _setRadio
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for input[type="radio"]
         *
         * @param {any} newValue The new value to set
         *
         * @returns {void}
         */
        protected _setRadio(newValue: any): void {
            let element = <HTMLInputElement>this.element;
            if (this.__isSelf) {
                return;
            } else if (isNull(newValue)) {
                if (element.checked) {
                    this._propertyChanged();
                }
                return;
            } else if (!isString(newValue)) {
                if (isNumber(newValue)) {
                    this._propertyType = 'number';
                    newValue = newValue.toString();
                } else if (isBoolean(newValue)) {
                    this._propertyType = 'boolean';
                    newValue = newValue.toString();
                }
            }

            element.checked = (element.value === newValue);
        }

        /**
         * @name _setDate
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for input[type="date"]
         *
         * @param {any} newValue The new value to set in the form YYYY-MM-DD
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setDate(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            }

            if (!isDate(newValue)) {
                if (this._dateRegex.test(newValue)) {
                    this._propertyType = 'string';
                    this._setValue(newValue);
                    return;
                }

                this._setValue('');

                if (firstTime === true) {
                    this._propertyChanged();
                }

                return;
            }

            let day = (`0${newValue.getDate()}`).slice(-2),
                month = (`0${(newValue.getMonth() + 1)}`).slice(-2);

            this._setValue(`${newValue.getFullYear()}-${month}-${day}`);
        }

        /**
         * @name _setDateTimeLocal
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for input[type="datetime-local"]
         *
         * @param {any} newValue The new value to set in the form YYYY-MM-DD
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setDateTimeLocal(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            }

            if (!isDate(newValue)) {
                if (this._dateTimeLocalRegex.test(newValue)) {
                    this._propertyType = 'string';
                    this._setValue(newValue);
                    return;
                }

                this._setValue('');

                if (firstTime === true) {
                    this._propertyChanged();
                }

                return;
            }

            let day = (`0${newValue.getDate()}`).slice(-2),
                month = (`0${(newValue.getMonth() + 1)}`).slice(-2),
                hour = (`0${newValue.getHours()}`).slice(-2),
                minutes = (`0${newValue.getMinutes()}`).slice(-2),
                seconds = (`0${newValue.getSeconds()}`).slice(-2),
                ms = newValue.getMilliseconds();

            this._setValue(`${newValue.getFullYear()}-${month}-${day}T${hour}:${minutes}:${seconds}.${ms}`);
        }

        /**
         * @name _setSelectedIndex
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for select
         *
         * @param {any} newValue The new value to set
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setSelectedIndex(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            }

            let element = <HTMLSelectElement>this.element,
                value = element.value;

            if (isNull(newValue)) {
                if (firstTime === true || !this._document.body.contains(element)) {
                    this._propertyChanged();
                    return;
                }
                element.selectedIndex = -1;
                return;
            } else if (!isString(newValue)) {
                if (isNumber(newValue)) {
                    this._propertyType = 'number';
                    newValue = newValue.toString();
                } else if (isBoolean(newValue)) {
                    this._propertyType = 'boolean';
                    newValue = newValue.toString();
                } else {
                    this._log.info('Trying to bind an invalid value to a <select> element using a ' + this.type + '.');
                }
            }

            if (value === newValue) {
                return;
            } else if (!this._document.body.contains(element)) {
                element.value = newValue;
                if (element.value !== newValue) {
                    element.value = value;
                    this._propertyChanged();
                }
                return;
            }

            element.value = newValue;
            // check to make sure the user changed to a valid value
            // second boolean argument is an ie fix for inconsistency
            if (element.value !== newValue || element.selectedIndex === -1) {
                element.selectedIndex = -1;
            }
        }

        /**
         * @name _setSelectedIndices
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Setter for select-multiple
         *
         * @param {any} newValue The new value to set
         * @param {any} oldValue The previously bound value
         * @param {boolean} firstTime? The context is being evaluated for the first time and
         * should thus change the property if null
         *
         * @returns {void}
         */
        protected _setSelectedIndices(newValue: any, oldValue: any, firstTime?: boolean): void {
            if (this.__isSelf) {
                return;
            }

            let options = (<HTMLSelectElement>this.element).options,
                length = isNull(options) ? 0 : options.length,
                option: HTMLOptionElement,
                nullValue = isNull(newValue);

            if (nullValue || !isArray(newValue)) {
                if (firstTime === true) {
                    this._propertyChanged();
                }
                // unselects the options unless a match is found
                while (length-- > 0) {
                    option = <HTMLOptionElement>options[length];
                    if (!nullValue && option.value === '' + newValue) {
                        option.selected = true;
                        return;
                    }

                    option.selected = false;
                }
                return;
            }

            let value: any,
                numberValue: number,
                index: number,
                highestIndex = Infinity;

            while (length-- > 0) {
                option = <HTMLOptionElement>options[length];
                value = option.value;

                if (newValue.indexOf(value) !== -1) {
                    option.selected = true;
                    continue;
                }

                numberValue = Number(value);
                if (isNumber(numberValue) && (index = newValue.indexOf(numberValue)) !== -1) {
                    if (index < highestIndex) {
                        this._propertyType = 'number';
                        highestIndex = index;
                    }
                    option.selected = true;
                    continue;
                } else if ((value === 'true' && (index = newValue.indexOf(true)) !== -1) ||
                    value === 'false' && (index = newValue.indexOf(false)) !== -1) {
                    if (index < highestIndex) {
                        this._propertyType = 'boolean';
                        highestIndex = index;
                    }
                    option.selected = true;
                    continue;
                }

                option.selected = false;
            }
        }

        /**
         * @name _determineType
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Determines the type of Element being bound to
         * and sets the necessary handlers.
         *
         * @returns {void}
         */
        protected _determineType(): void {
            if (this._observingBindableProperty()) {
                return;
            }

            let element = this.element;
            if (isNull(element)) {
                return;
            }

            switch (element.nodeName.toLowerCase()) {
                case 'input':
                    switch ((<HTMLInputElement>element).type) {
                        case 'button':
                        case 'submit':
                        case 'reset':
                        case 'image':
                            this._addEventType = this._addButtonEventListener;
                            this._getter = this._getValue;
                            break;
                        case 'checkbox':
                            this._addEventType = this._addChangeEventListener;
                            this._getter = this._getChecked;
                            this._setter = this._setChecked;
                            break;
                        case 'radio':
                            this._initializeRadio();
                            break;
                        case 'range':
                            this._addEventType = this._addRangeEventListener;
                            this._getter = this._getValue;
                            this._setter = this._setRange;
                            break;
                        case 'date':
                            this._propertyType = 'nullable';
                            this._addEventType = this._addChangeEventListener;
                            this._getter = this._getDate;
                            this._setter = this._setDate;
                            break;
                        case 'datetime-local':
                            this._propertyType = 'nullable';
                            this._addEventType = this._addChangeEventListener;
                            this._getter = this._getDateTimeLocal;
                            this._setter = this._setDateTimeLocal;
                            break;
                        case 'file':
                            this._propertyType = 'nullable';
                            let multi = (<HTMLInputElement>element).multiple;
                            this._addEventType = this._addChangeEventListener;
                            this._getter = multi ? this._getFiles : this._getFile;
                            break;
                        case 'hidden':
                            this._getter = this._getValue;
                            this._setter = this._setHidden;
                            break;
                        case 'number':
                            this._propertyType = 'number';
                        default:
                            this._addEventType = this._addTextEventListener;
                            this._getter = this._getValue;
                            this._setter = this._setText;
                            break;
                    }
                    break;
                case 'textarea':
                    this._addEventType = this._addTextEventListener;
                    this._getter = this._getValue;
                    this._setter = this._setText;
                    break;
                case 'select':
                    this._initializeSelect();
                    break;
                case 'button':
                    this._addEventType = this._addButtonEventListener;
                    this._getter = this._getTextContent;
                    break;
            }
        }

        /**
         * @name _watchExpression
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Observes the expression to bind to.
         *
         * @returns {void}
         */
        protected _watchExpression(): void {
            let contextExpression = this._contextExpression,
                context = this.evaluateExpression(contextExpression);

            if (!isObject(context)) {
                if (isNull(context) && contextExpression.identifiers.length > 0) {
                    context = this._createContext(contextExpression.identifiers[0]);
                } else {
                    this._log.warn(this.type + ' is trying to index into a primitive type. ' +
                        this._contextExpression.expression + ' is already defined and not ' +
                        'an object when trying to evaluate ' + this.type + '="' +
                        this._expression.expression + '"');
                    return;
                }
            }

            let property: string;
            if (!isFunction(this._setter)) {
                return;
            } else if (this._setter === this._setSelectedIndices) {
                property = this._property;
                if (isNull(context[property])) {
                    context[property] = [];
                }
                this.observeArray((arrayInfo: Array<observable.IArrayChanges<string>>): void => {
                    this._setter(arrayInfo[0].object, null, true);
                }, contextExpression + '.' + property);
            }

            let expression = this._expression;
            this.observeExpression((newValue: any, oldValue: any): void => {
                this._setter(newValue, oldValue);
            }, expression);
            this._setter(this.evaluateExpression(expression), undefined, true);
        }

        /**
         * @name _createContext
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Handles creating context with an identifier.
         *
         * @param {string} identifier The identifier to base the created context off of.
         *
         * @returns {any} The created context.
         */
        protected _createContext(identifier: string): any {
            let split = identifier.split('.'),
                start = split.shift().slice(1),
                parent = this.parent;

            if (start === __ROOT_CONTEXT_RESOURCE) {
                identifier = split.join('.');
                parent = this.parent.root;
            } else if (start === __CONTEXT) {
                identifier = split.join('.');
            }

            return this._ContextManager.createContext(parent, identifier);
        }

        /**
         * @name _castProperty
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Handles casting the bound property back to its initial type if necessary.
         *
         * @param {any} value The value to cast.
         * @param {any} type? The optional type to cast the value to.
         *
         * @returns {any} The bound property casted to the proper type.
         */
        protected _castProperty(value: any, type?: any): any {
            let castValue: any;

            type = type || this._propertyType;

            if (isNull(type)) {
                return value;
            } else if (isObject(value)) {
                if (isArray(value)) {
                    let length = value.length;

                    castValue = [];

                    for (let i = 0; i < length; ++i) {
                        castValue.push(this._castProperty(value[i], type));
                    }
                } else if (isDate(value) || isFile(value) || isPromise(value) || isWindow(value) || isNode(value)) {
                    castValue = value;
                } else {
                    let keys = Object.keys(value),
                        key: string;

                    castValue = {};

                    while (keys.length > 0) {
                        key = keys.pop();
                        castValue[key] = value[key];
                    }
                }
            } else {
                switch (type) {
                    case 'string':
                        if (isString(value)) {
                            castValue = value;
                        } else if (isFunction(value.toString)) {
                            castValue = value.toString();
                        } else {
                            castValue = Object.prototype.toString.call(value);
                        }
                        break;
                    case 'number':
                        castValue = isEmpty(value) ? null : Number(value);
                        break;
                    case 'boolean':
                        switch (value) {
                            case 'true':
                                castValue = true;
                                break;
                            case 'false':
                            case '0':
                            case 'null':
                            case 'undefined':
                                castValue = false;
                                break;
                            default:
                                castValue = !!value;
                                break;
                        }
                        break;
                    case 'nullable':
                        if (isEmpty(value)) {
                            castValue = null;
                        }
                        break;
                    default:
                        castValue = value;
                        break;
                }
            }

            return castValue;
        }

        /**
         * @name _propertyChanged
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Sets the context property being bound to when the
         * element's property is changed.
         *
         * @returns {void}
         */
        protected _propertyChanged(): void {
            if (isNull(this._contextExpression)) {
                return;
            }

            let context = this.evaluateExpression(this._contextExpression);

            if (!isObject(context)) {
                return;
            }

            let property = this._property,
                newValue = this._castProperty(this._getter());

            if (context[property] === newValue) {
                return;
            }

            // set flag to let setter functions know we changed the property
            this.__isSelf = true;
            context[property] = newValue;
            this.__isSelf = false;
        }

        /**
         * @name _initializeRadio
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Normalizes input[type="radio"] for cross-browser compatibility.
         *
         * @returns {void}
         */
        protected _initializeRadio(): void {
            let element = this.element;

            this._addEventType = this._addChangeEventListener;
            this._getter = this._getValue;
            this._setter = this._setRadio;

            if (!element.hasAttribute('name')) {
                let attr = camelCase(this.type),
                    expression = this.attributes[attr];

                element.setAttribute('name', expression);
            }

            if (element.hasAttribute('value')) {
                return;
            }

            element.setAttribute('value', '');
        }

        /**
         * @name _initializeSelect
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Normalizes HTMLSelectElements for cross-browser compatibility.
         *
         * @returns {void}
         */
        protected _initializeSelect(): void {
            let element = <HTMLSelectElement>this.element,
                multiple = element.multiple,
                options = element.options,
                length = options.length,
                option: HTMLOptionElement;

            this._addEventType = this._addChangeEventListener;
            if (multiple) {
                this._getter = this._getSelectedValues;
                this._setter = this._setSelectedIndices;
            } else {
                this._getter = this._getValue;
                this._setter = this._setSelectedIndex;
            }

            for (let i = 0; i < length; ++i) {
                option = <HTMLOptionElement>options[i];
                if (!option.hasAttribute('value')) {
                    option.setAttribute('value', option.textContent);
                }
            }
        }

        /**
         * @name _observingBindableProperty
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Checks if the associated {@link plat.ui.TemplateControl|TemplateControl} is implementing
         * {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding} and initializes all listeners accordingly.
         *
         * @returns {boolean} Whether or not the associated {@link plat.ui.TemplateControl|TemplateControl}
         * is implementing {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding}.
         */
        protected _observingBindableProperty(): boolean {
            let templateControl = <ui.BindControl>this.templateControl;

            if (isObject(templateControl) && isFunction(templateControl.onInput) && isFunction(templateControl.observeProperties)) {
                templateControl.onInput((newValue: any): void => {
                    this._getter = (): any => newValue;
                    this._propertyChanged();
                });

                return (this._supportsTwoWayBinding = true);
            }

            return false;
        }

        /**
         * @name _observeProperty
         * @memberof plat.observable.IImplementTwoWayBinding
         * @kind function
         * @access protected
         *
         * @description
         * A function that allows a {@link plat.observable.ISupportTwoWayBinding|ISupportTwoWayBinding} to observe either the
         * bound property specified by the identifier (as well as potential child properties if being bound to an object) or
         * Array mutations.
         *
         * @param {Function} listener The listener function.
         * @param {any} identifier? The index off of the bound object to listen to for changes if the bound object is an Array.
         * If undefined or empty the listener will listen for changes to the bound Array itself.
         * @param {boolean} autocast? Will cast a primitive value to whatever it was set to in code.
         * @param {boolean} arrayMutations? Whether or not this is for Array mutation changes.
         *
         * @returns {plat.IRemoveListener} A function to stop listening for changes.
         */
        protected _observeProperty(listener: Function, identifier?: any, autocast?: boolean, arrayMutations?: boolean): IRemoveListener {
            let parsedIdentifier: string;
            if (isEmpty(identifier)) {
                parsedIdentifier = this._expression.expression;
            } else if (isNumber(identifier)) {
                parsedIdentifier = this._expression.expression + '.' + identifier;
            } else {
                let _parser = this._parser,
                    identifierExpression = _parser.parse(identifier),
                    identifiers = identifierExpression.identifiers;

                if (identifiers.length !== 1) {
                    this._log.warn('Only 1 identifier path allowed when observing changes to a bound property\'s child with a control ' +
                        'implementing observable.ISupportTwoWayBinding and working with ' + this.type);
                    return;
                }

                let expression = _parser.parse(this._expression.expression + '.' + identifiers[0]);

                parsedIdentifier = expression.identifiers[0];

                let split = parsedIdentifier.split('.');
                split.pop();

                let contextExpression = split.join('.'),
                    context = this.evaluateExpression(contextExpression);

                if (!isObject(context)) {
                    if (isNull(context)) {
                        context = this._ContextManager.createContext(this.parent, contextExpression);
                    } else {
                        this._log.warn('A control implementing observable.ISupportTwoWayBinding is trying to index into a primitive type ' +
                            'when trying to evaluate ' + this.type + '="' + this._expression.expression + '"');
                        return;
                    }
                }
            }

            listener = listener.bind(this.templateControl);
            autocast = autocast === true;

            let removeListener: IRemoveListener;
            if (arrayMutations === true) {
                removeListener = this.observeArray((changes: Array<observable.IArrayChanges<any>>): void => {
                    listener(changes, identifier);
                }, parsedIdentifier);
            } else {
                removeListener = this.observe((newValue: any, oldValue: any): void => {
                    if (this.__isSelf || newValue === oldValue) {
                        return;
                    } else if (autocast) {
                        this._propertyType = this._getPropertyType(newValue);
                    }

                    listener(newValue, oldValue, identifier);
                }, parsedIdentifier);

                let value = this.evaluateExpression(parsedIdentifier);
                if (autocast) {
                    this._propertyType = this._getPropertyType(value);
                }

                listener(value, undefined, identifier, true);
            }

            return removeListener;
        }

        /**
         * @name _getPropertyType
         * @memberof plat.controls.Bind
         * @kind function
         * @access protected
         *
         * @description
         * Gets the property type of the passed in argument.
         *
         * @param {any} value The value to grab the property type from.
         *
         * @returns {any} The property type.
         */
        protected _getPropertyType(value: any): any {
            if (isObject(value)) {
                return value;
            } else if (isString(value)) {
                return 'string';
            } else if (isNumber(value)) {
                return 'number';
            } else if (isBoolean(value)) {
                return 'boolean';
            }
        }
    }

    register.control(__Bind, Bind);

    /**
     * @name IFile
     * @memberof plat.controls
     * @kind interface
     *
     * @extends {File}
     *
     * @description
     * A file interface for browsers that do not support the
     * File API.
     */
    export interface IFile extends File {
        /**
         * @name string
         * @memberof plat.controls.IFile
         * @kind property
         * @access public
         * @readonly
         *
         * @type {string}
         *
         * @description
         * An absolute path to the file. The property is not added to
         * File types.
         */
        path?: string;
    }
}
