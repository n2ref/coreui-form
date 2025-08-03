
import Controller from './controller';
import FormTpl    from './tpl';
import Utils      from './utils';
import Private    from './private';

import HelperControlButton from "./helpers/controls/button";
import HelperControlLink   from "./helpers/controls/link";
import HelperControlSubmit from "./helpers/controls/submit";
import HelperControlCustom from "./helpers/controls/custom";

import HelperFieldInput          from "./helpers/fields/input";
import HelperFieldText           from "./helpers/fields/text";
import HelperFieldCheckbox       from "./helpers/fields/chackbox";
import HelperFieldCheckboxBtn    from "./helpers/fields/chackboxBtn";
import HelperFieldCustom         from "./helpers/fields/custom";
import HelperFieldDataset        from "./helpers/fields/dataset";
import HelperFieldFile           from "./helpers/fields/file";
import HelperFieldFileUpload     from "./helpers/fields/fileUpload";
import HelperFieldHidden         from "./helpers/fields/hidden";
import HelperFieldMask           from "./helpers/fields/mask";
import HelperFieldModal          from "./helpers/fields/modal";
import HelperFieldNumber         from "./helpers/fields/number";
import HelperFieldPasswordRepeat from "./helpers/fields/passwordRepeat";
import HelperFieldRadio          from "./helpers/fields/radio";
import HelperFieldRadioBtn       from "./helpers/fields/redioBtn";
import HelperFieldRange          from "./helpers/fields/range";
import HelperFieldSelect         from "./helpers/fields/select";
import HelperFieldSwitch         from "./helpers/fields/switch";
import HelperFieldColor          from "./helpers/fields/color";
import HelperFieldGroup          from "./helpers/fields/group";
import HelperFieldPassword       from "./helpers/fields/password";
import HelperFieldTextarea       from "./helpers/fields/textarea";
import HelperFieldWysiwyg        from "./helpers/fields/wysiwyg";
import HelperFieldDateMonth      from "./helpers/fields/dateMonth";
import HelperFieldDateWeek       from "./helpers/fields/dateWeek";
import HelperFieldDatetime       from "./helpers/fields/datetime";
import HelperFieldEmail          from "./helpers/fields/email";
import HelperFieldTime           from "./helpers/fields/time";
import HelperFieldDate           from "./helpers/fields/date";



class Form {

    _options = {
        id: null,
        title: '',
        lang: 'en',
        langList: {},
        send: {
            url: '',
            method: 'POST',
            format: 'json',
        },
        validResponse: {
            headers: null,
            dataType: null,
        },
        width: null,
        minWidth: null,
        maxWidth: null,
        labelWidth: 200,
        fieldWidth: null,
        controlsOffset: null,
        readonly: false,
        validate: false,
        successLoadUrl: '',
        errorClass: '',
        layout: '[position_default]',
        onSubmit: null,
        onSubmitSuccess: null,
        errorMessageScrollOffset: 70,
        record: {},
        fields: [],
        controls: []
    };

    field = {
        input:          function (name, label, type) { return new HelperFieldInput(name, label, type); },
        text:           function (name, label)       { return new HelperFieldText(name, label); },
        checkbox:       function (name, label)       { return new HelperFieldCheckbox(name, label); },
        checkboxBtn:    function (name, label)       { return new HelperFieldCheckboxBtn(name, label); },
        color:          function (name, label)       { return new HelperFieldColor(name, label); },
        date:           function (name, label)       { return new HelperFieldDate(name, label); },
        dateMonth:      function (name, label)       { return new HelperFieldDateMonth(name, label); },
        dateWeek:       function (name, label)       { return new HelperFieldDateWeek(name, label); },
        datetime:       function (name, label)       { return new HelperFieldDatetime(name, label); },
        time:           function (name, label)       { return new HelperFieldTime(name, label); },
        custom:         function (name, label)       { return new HelperFieldCustom(name, label); },
        email:          function (name, label)       { return new HelperFieldEmail(name, label); },
        dataset:        function (name, label)       { return new HelperFieldDataset(name, label); },
        file:           function (name, label)       { return new HelperFieldFile(name, label); },
        fileUpload:     function (name, label)       { return new HelperFieldFileUpload(name, label); },
        group:          function (label)             { return new HelperFieldGroup(label); },
        hidden:         function (name)              { return new HelperFieldHidden(name); },
        mask:           function (name, label)       { return new HelperFieldMask(name, label); },
        modal:          function (name, label)       { return new HelperFieldModal(name, label); },
        number:         function (name, label)       { return new HelperFieldNumber(name, label); },
        password:       function (name, label)       { return new HelperFieldPassword(name, label); },
        passwordRepeat: function (name, label)       { return new HelperFieldPasswordRepeat(name, label); },
        radio:          function (name, label)       { return new HelperFieldRadio(name, label); },
        radioBtn:       function (name, label)       { return new HelperFieldRadioBtn(name, label); },
        range:          function (name, label)       { return new HelperFieldRange(name, label); },
        select:         function (name, label)       { return new HelperFieldSelect(name, label); },
        switch:         function (name, label)       { return new HelperFieldSwitch(name, label); },
        textarea:       function (name, label)       { return new HelperFieldTextarea(name, label); },
        wysiwyg:        function (name, label)       { return new HelperFieldWysiwyg(name, label); },
    };

    control = {
        submit: function (content)    { return new HelperControlSubmit(content); },
        link: function (content, url) { return new HelperControlLink(content, url); },
        button: function (content)    { return new HelperControlButton(content); },
        custom: function (content)    { return new HelperControlCustom(content); },
    }

    _controller = null;
    _lock = false;
    _readonly = false;
    _fieldsIndex = 0;
    _groupsIndex = 0;
    _controlsIndex = 0;
    _groups = [];
    _fields = [];
    _controls = [];
    _events = {};


    /**
     * Инициализация
     * @param {object} options
     * @private
     */
    constructor(options) {

        this._options = $.extend(true, this._options, options);

        if ( ! this._options.id) {
            this._options.id = Utils.hashCode();
        }
    }


    /**
     * Инициализация событий
     */
    initEvents() {

        let that          = this;
        let formContainer = '#coreui-form-' + this._options.id + ' > form';

        $(formContainer).on('submit', function () {
            setTimeout(function () {
                that.send.apply(that)
            }, 0);
            return false;
        });

        if (window.hasOwnProperty('bootstrap') && bootstrap.hasOwnProperty('Tooltip')) {
            $('.coreui-form__field_label_help', formContainer).each(function () {
                new bootstrap.Tooltip(this);
            });
        }

        Private.trigger(this, 'show');
    }


    /**
     * Получение id формы
     * @return {string|null}
     */
    getId() {

        return this._options.hasOwnProperty('id') ? this._options.id : null;
    }


    /**
     * Установка опций
     * @param {Object} options
     */
    setOptions(options) {

        if ( ! Utils.isObject(options)) {
            return;
        }

        this._options = $.extend(true, this._options, options);
    }


    /**
     * Установка функции выполняемой при запросе на сохранение
     * @param {function} callback
     */
    onSubmit(callback) {

        if (typeof callback !== 'function') {
            return;
        }

        this._options.onSubmit = callback;
    }


    /**
     * Установка функции выполняемой при успешном запросе на сохранение
     * @param {function} callback
     */
    onSubmitSuccess(callback) {

        if (typeof callback !== 'function') {
            return;
        }

        this._options.onSubmitSuccess = callback;
    }


    /**
     * Установка адреса и способа используемого для отправки данных с формы
     * @param {string} url
     * @param {string} httpMethod
     * @param {string} formatData
     */
    setHandler(url, httpMethod, formatData) {

        if (typeof url !== 'string') {
            return;
        }

        this._options.send.url = url;

        if (typeof httpMethod === 'string' && httpMethod) {
            this._options.send.method = httpMethod;
        }

        if (typeof formatData === 'string' && formatData) {
            this._options.send.format = formatData;
        }
    }


    /**
     * Установка ожидаемых, валидных заголовков от сервера после сохранения
     * @param {object} headers
     */
    setValidResponseHeaders(headers) {

        if ( ! Utils.isObject(headers)) {
            return;
        }


        this._options.validResponse.headers = headers;
    }


    /**
     * Установка ожидаемого, валидного типа данных в ответе от сервера
     * @param {Array} dataTypes
     */
    setValidResponseType(dataTypes) {

        if ( ! Array.isArray(dataTypes)) {
            return;
        }

        this._options.validResponse.dataType = dataTypes;
    }


    /**
     * Установка объекта для редактирования
     * @param {object} record
     */
    setRecord(record) {

        if ( ! Utils.isObject(record)) {
            return;
        }

        this._options.record = record;
    }


    /**
     * Добавлен полей формы
     * @param {Array} fields
     */
    addFields(fields) {

        if ( ! Array.isArray(fields)) {
            return;
        }

        if ( ! Array.isArray(this._options.fields)) {
            this._options.fields = [];
        }


        let that = this;

        fields.map(function (field) {

            if (field && field.constructor) {
                if (field.constructor.name && typeof field.toObject === 'function') {
                    that._options.fields.push(field.toObject());
                }

            } else if (Utils.isObject(field)) {
                that._options.fields.push(field);
            }
        });
    }


    /**
     * Добавлен контролов на форму
     * @param {Array} controls
     */
    addControls(controls) {

        if ( ! Array.isArray(controls)) {
            return;
        }

        if ( ! Array.isArray(this._options.controls)) {
            this._options.controls = [];
        }


        let that = this;

        controls.map(function (control) {

            if (control && control.constructor) {
                if (control.constructor.name && typeof control.toObject === 'function') {
                    that._options.controls.push(control.toObject());
                }

            } else if (Utils.isObject(control)) {
                that._options.controls.push(control);
            }
        });
    }


    /**
     * @param element
     * @returns {*}
     */
    render(element) {

        this._controller = Controller;

        if ( ! this._options.hasOwnProperty('lang')) {
            this._options.lang = this._controller.getSetting('lang');
        }

        let langList           = this._controller.lang.hasOwnProperty(this._options.lang) ? this._controller.lang[this._options.lang] : {};
        this._options.langList = this._options.hasOwnProperty('langList') && Utils.isObject(this._options.langList)
            ? $.extend(true, {}, langList, this._options.langList)
            : langList;

        this._options.errorMessageScrollOffset = this._options.hasOwnProperty('errorMessageScrollOffset') && Utils.isNumeric(this._options.errorMessageScrollOffset)
            ? this._options.errorMessageScrollOffset
            : this._controller.getSetting('errorMessageScrollOffset');

        this._options.labelWidth = this._options.hasOwnProperty('labelWidth')
            ? this._options.labelWidth
            : this._controller.getSetting('labelWidth');

        this._options.errorClass = this._options.hasOwnProperty('errorClass') && typeof this._options.errorClass === 'string'
            ? this._options.errorClass
            : this._controller.getSetting('errorClass');

        if ( ! this._options.hasOwnProperty('send') ||
            ! Utils.isObject(this._options.send) ||
            ! this._options.send.hasOwnProperty('format') ||
            typeof this._options.send.format !== 'string'
        ) {
            if ( ! this._options.hasOwnProperty('send') || ! Utils.isObject(this._options.send)) {
                this._options.send = {};
            }

            this._options.send.format = this._controller.getSetting('sendDataFormat');
        }

        this._readonly = this._options.hasOwnProperty('readonly') && typeof this._options.readonly === 'boolean' ? this._options.readonly : false;

        if (this._options.hasOwnProperty('labelWidth')) {
            if (this._options.labelWidth >= 0 && this._options.labelWidth !== null) {
                let unit = typeof this._options.labelWidth === 'number' ? 'px' : '';
                this._options.labelWidth = this._options.labelWidth + unit;
            }
        }

        if ( ! this._options.hasOwnProperty('controlsOffset') || this._options.controlsOffset === null) {
            this._options.controlsOffset = this._options.labelWidth;
        } else {
            if (this._options.controlsOffset >= 0) {
                let unit = typeof this._options.controlsOffset === 'number' ? 'px' : '';
                this._options.controlsOffset = this._options.controlsOffset + unit;
            }
        }


        let that       = this;
        let widthSizes = [];
        let layout     = this._options.layout && typeof this._options.layout === 'string' ? this._options.layout : '[position_default]';
        let controls   = [];
        let formAttr   = [];



        if (this._options.width) {
            let unit = typeof this._options.width === 'number' ? 'px' : '';
            widthSizes.push('width:' + this._options.width + unit);
        }

        if (this._options.minWidth) {
            let unit = typeof this._options.minWidth === 'number' ? 'px' : '';
            widthSizes.push('min-width:' + this._options.minWidth + unit);
        }

        if (this._options.maxWidth) {
            let unit = typeof this._options.maxWidth === 'number' ? 'px' : '';
            widthSizes.push('max-width:' + this._options.maxWidth + unit);
        }


        let positions       = [];
        let positionMatches = Array.from(layout.matchAll(/\[position_([\w_\d]+)\]/g));

        if (positionMatches.length > 0) {
            positionMatches.map(function (match) {
                positions.push(match[1]);
                layout = layout.replace('[position_' + match[1] + ']', '<div class="coreui-form-position-' + match[1] + '"></div>');
            });
        }

        let layoutObj = $(layout);

        // Поля
        if (typeof this._options.fields === 'object' &&
            Array.isArray(this._options.fields) &&
            this._options.fields.length > 0
        ) {
            let positionsContent = {};

            if (positions.length > 0) {
                this._options.fields.map(function (field) {
                    let position = field.hasOwnProperty('position') && (typeof field.position === 'string' || typeof field.position === 'number')
                        ? (positions.indexOf(field.position) >= 0 ? field.position : null)
                        : 'default';

                    if (typeof position !== 'string') {
                        return;
                    }

                    let type    = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : '';
                    let content = null;

                    if (type === 'group') {
                        let instance = Private.initGroup(that, field);
                        content      = Private.renderGroup(instance);

                    } else {
                        let instance = Private.initField(that, field);
                        content      = Private.renderField(that, instance);
                    }


                    if ( ! positionsContent.hasOwnProperty(position)) {
                        positionsContent[position] = [];
                    }
                    positionsContent[position].push(content);
                });
            }

            if (Object.keys(positionsContent).length >= 0) {
                $.each(positionsContent, function (name, fieldContents) {
                    $.each(fieldContents, function (key, fieldContent) {
                        let container = layoutObj.closest('.coreui-form-position-' + name);

                        if ( ! container[0]) {
                            container = layoutObj.find('.coreui-form-position-' + name);
                        }

                        container.append(fieldContent);
                    });
                });
            }
        }


        // Элементы управления
        if (typeof this._options.controls === 'object' &&
            Array.isArray(this._options.controls) &&
            this._options.controls.length > 0
        ) {
            this._options.controls.map(function (control) {
                let instance = Private.initControl(that, control);

                if ( ! instance || typeof instance !== 'object') {
                    return;
                }

                controls.push({
                    show: ! control.hasOwnProperty('show') || control.show,
                    index: that._controlsIndex - 1,
                    content: instance.render()
                });
            });
        }

        if (typeof this._options.validate === 'boolean' && this._options.validate) {
            formAttr.push('novalidate');
        }


        let containerElement = $(
            Utils.render(FormTpl['form.html'], {
                form: this._options,
                formAttr: formAttr ? ' ' + formAttr.join(' ') : '',
                widthSizes: widthSizes,
                controls: controls,
            })
        );

        containerElement.find('.coreui-form__fields').append(layoutObj);

        let formId = this.getId();

        controls.map(function (control) {
            containerElement.find('#coreui-form-' + formId + '-control-' + control.index).append(control.content);
        });


        if (element === undefined) {
            return containerElement;
        }

        // Dom element
        let domElement = null;

        if (typeof element === 'string') {
            domElement = document.getElementById(element);

        } else if (element instanceof HTMLElement) {
            domElement = element;
        }

        if (domElement) {
            $(domElement).html(containerElement);
            this.initEvents();
        }
    }


    /**
     *
     */
    lock() {

        this._lock = true;

        this._controls.map(function (control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                control.lock();
            }
        });
    }


    /**
     * Разблокировка
     */
    unlock() {

        this._lock = false;

        this._controls.map(function (control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                control.unlock();
            }
        });
    }


    /**
     * Отправка данных формы
     */
    send() {

        if (this._lock) {
            return;
        }


        if (typeof this._options.validate === 'boolean' && this._options.validate) {
            let isValid = this.validate();

            if ( ! isValid) {
                return;
            }
        }


        let onsubmit = null;
        let data     = this.getData();

        this._fields.map(function (field) {
            if ( ! field.isAlloySend()) {
                let fieldOptions = field.getOptions();
                if (fieldOptions.hasOwnProperty('name') &&
                    fieldOptions.name &&
                    data.hasOwnProperty(fieldOptions.name)
                ) {
                    delete data[fieldOptions.name];
                }
            }
        });


        if (typeof this._options.onSubmit === 'function') {
            onsubmit = this._options.onSubmit;

        } else if (typeof this._options.onSubmit === 'string' && this._options.onSubmit) {
            let func = Utils.getFunctionByName(this._options.onSubmit);

            if (typeof func === 'function') {
                onsubmit = func;
            } else if (typeof this._options.onSubmit === 'string') {
                onsubmit = new Function('form', 'data', this._options.onSubmit);
            }
        }

        if (typeof onsubmit === 'function') {
            let onSubmitResult = onsubmit(this, data);

            if (onSubmitResult === false) {
                return;
            }
        }


        let results    = Private.trigger(this, 'send', [this, data ]);
        let isStopSend = false;

        results.map(function(result) {
            if (result === false) {
                isStopSend = true;
                return false;
            }
        });

        if (isStopSend) {
            return;
        }


        /**
         * Сборка данных формы для отправки
         * @param {FormData} formData
         * @param {object}   data
         * @param {string}   parentKey
         */
        function buildFormData(formData, data, parentKey) {

            if (data &&
                (Array.isArray(data) || Utils.isObject(data))
            ) {
                Object.keys(data).forEach(function (key) {
                    buildFormData(formData, data[key], parentKey ? parentKey + '[' + key + ']' : key);
                });

            } else {
                formData.append(parentKey, data == null ? '' : data);
            }
        }



        this.lock();

        let that       = this;
        let sendFormat = ['form', 'json'].indexOf(this._options.send.format) >= 0
            ? this._options.send.format
            : 'form';

        let dataFormat  = null;
        let contentType = null;

        if (sendFormat === 'json') {
            contentType = "application/json; charset=utf-8";
            dataFormat  = JSON.stringify(data);

        } else {
            contentType = false;
            dataFormat  = new FormData();

            buildFormData(dataFormat, data);
        }


        /**
         * Запрос выполнился успешно
         * @param result
         */
        let successSend = function (result) {

            that.hideError();

            Private.trigger(that, 'send_success', [that, result ]);

            let jsonResponse = null;

            if (typeof result === 'string') {
                try {
                    let parsedResponse = JSON.parse(result);
                    if (typeof parsedResponse === 'object' &&
                        parsedResponse !== null &&
                        ! Array.isArray(parsedResponse)
                    ) {
                        jsonResponse = parsedResponse;
                    }

                } catch (e) {
                    // ignore
                }
            } else {
                jsonResponse = result;
            }

            if (jsonResponse !== null && typeof jsonResponse === 'object') {
                if (jsonResponse.hasOwnProperty('scripts') &&
                    Array.isArray(jsonResponse.scripts)
                ) {
                    jsonResponse.scripts.map(function (script) {
                        if (typeof script === 'string') {
                            (new Function(script))();
                        }
                    })
                }

                if (jsonResponse.hasOwnProperty('loadUrl') &&
                    typeof jsonResponse.loadUrl === 'string'
                ) {
                    location.href = jsonResponse.loadUrl;
                }
            }

            if (that._options.hasOwnProperty('onSubmitSuccess')) {
                if (typeof that._options.onSubmitSuccess === 'function') {
                    that._options.onSubmitSuccess(jsonResponse);

                } else if (typeof that._options.onSubmitSuccess === 'string') {
                    (new Function(that._options.onSubmitSuccess))(jsonResponse);
                }
            }

            if (that._options.hasOwnProperty('successLoadUrl') &&
                typeof that._options.successLoadUrl === 'string' &&
                that._options.successLoadUrl !== ''
            ) {
                let successLoadUrl = that._options.successLoadUrl;

                // Замена параметров
                if (jsonResponse !== null && typeof jsonResponse === 'object') {
                    const regx      = new RegExp('\\[response\\.([\\d\\w\\.]+)\\]', 'uig');
                    let   urlParams = {};

                    while (result = regx.exec(successLoadUrl)) {
                        urlParams[result[0]] = result[1];
                    }

                    if (Object.keys(urlParams).length > 0) {
                        for (const [param, path] of Object.entries(urlParams)) {
                            let value = Utils.getObjValue(jsonResponse, path);
                            value = typeof value !== 'undefined' ? value : '';

                            successLoadUrl = successLoadUrl.replace(
                                new RegExp(param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                                value
                            );
                        }
                    }
                }


                let equalHash = location.hash === successLoadUrl;

                location.href = successLoadUrl;

                if (equalHash) {
                    window.onhashchange();
                }
            }
        }


        /**
         * Запрос с ошибкой
         * @param xhr
         * @param textStatus
         * @param errorThrown
         */
        let errorSend = function(xhr, textStatus, errorThrown) {

            let errorMessage = that.getLang().send_error || '';
            let data         = {};

            try {
                let parsedResponse = JSON.parse(xhr.responseText);
                if (typeof parsedResponse === 'object' &&
                    parsedResponse !== null &&
                    ! Array.isArray(parsedResponse)
                ) {
                    data = parsedResponse;
                }

            } catch (e) {
                // ignore
            }

            if (data.hasOwnProperty('error_message') &&
                typeof data.error_message === 'string' &&
                data.error_message !== ''
            ) {
                errorMessage = data.error_message;
            }

            that.showError(errorMessage);
            Private.trigger(that, 'send_error', [that, xhr, textStatus, errorThrown ]);
        }

        $.ajax({
            url: this._options.send.url,
            method: this._options.send.method,
            data: dataFormat,
            contentType: contentType,
            processData: false,
            beforeSend: function(xhr) {
                Private.trigger(that, 'send_start', [that, xhr ]);
            },
            success: function (result, textStatus, xhr) {

                let isValidResponse = true;

                if (typeof that._options.validResponse === 'object') {
                    if (Array.isArray(that._options.validResponse.headers)) {
                        $.each(that._options.validResponse.headers, function (header, headerValues) {
                            if (typeof headerValues === 'string') {
                                if (xhr.getResponseHeader(header) != headerValues) {
                                    isValidResponse = false;
                                    return false;
                                }

                            } else if (Array.isArray(headerValues)) {
                                if (headerValues.indexOf(xhr.getResponseHeader(header)) < 0) {
                                    isValidResponse = false;
                                    return false;
                                }
                            }
                        });
                    }

                    if (isValidResponse) {
                        if (typeof that._options.validResponse.dataType === 'string') {
                            if (that._options.validResponse.dataType === 'json') {
                                if (typeof result !== 'object' &&
                                    ! Array.isArray(result) &&
                                    ! Utils.isJson(result)
                                ) {
                                    isValidResponse = false;
                                }
                            }

                        } else if (Array.isArray(that._options.validResponse.dataType)) {
                            $.each(that._options.validResponse.dataType, function (key, dataType) {

                                if (dataType === 'json') {
                                    if (typeof result !== 'object' &&
                                        ! Array.isArray(result) &&
                                        ! Utils.isJson(result)
                                    ) {
                                        isValidResponse = false;
                                        return false;
                                    }
                                }
                            });
                        }
                    }
                }

                if (isValidResponse) {
                    successSend(result);
                } else {
                    errorSend(xhr, textStatus);
                }
            },
            error: errorSend,
            complete: function(xhr, textStatus) {
                that.unlock();
                Private.trigger(that, 'send_end', [that, xhr, textStatus ]);
            },
        });
    }


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions() {
        return this._options;
    }


    /**
     * Получение записи
     * @returns {object}
     */
    getRecord() {

        if (this._options.hasOwnProperty('record') && typeof this._options.record === 'object') {
            return this._options.record;
        }

        return {};
    }


    /**
     * Получение данных с формы
     * @returns {object}
     */
    getData() {

        let data = {};

        this._fields.map(function (field) {
            let fieldOptions = field.getOptions();

            if (fieldOptions.hasOwnProperty('name') && fieldOptions.name) {
                let value = field.getValue();

                if (value !== null) {
                    data[fieldOptions.name] = value;
                }
            }
        });

        return data;
    }


    /**
     * Получение полей
     * @returns {object}
     */
    getFields() {
        return this._fields;
    }


    /**
     * Получение элементов управления
     * @returns {object}
     */
    getControls() {
        return this._controls;
    }


    /**
     * Получение групп полей
     * @returns {object}
     */
    getGroups() {
        return this._groups;
    }


    /**
     * Получение поля по имени
     * @param {string} name
     * @returns {object}
     */
    getField(name) {

        let field = {};

        this._fields.map(function (fieldInstance) {
            let fieldOptions = fieldInstance.getOptions();

            if (fieldOptions.hasOwnProperty('name') && fieldOptions.name === name) {
                field = fieldInstance;
            }
        });

        return field;
    }


    /**
     * Смена состояний полей формы
     */
    readonly(isReadonly) {

        this._fields.map(function (fieldInstance) {
            fieldInstance.readonly(isReadonly);
        });


        this._controls.map(function (control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                if (isReadonly) {
                    control.hide();
                } else {
                    control.show();
                }
            }
        });
    }


    /**
     * Показ всех элементов управления
     */
    showControls() {

        this._controls.map(function (control) {
            control.show();
        });
    }


    /**
     * Скрытие всех элементов управления
     */
    hideControls() {

        this._controls.map(function (control) {
            control.hide();
        });
    }


    /**
     * Валидация полей
     * @return {boolean}
     */
    validate() {

        let isValid = true;

        this._fields.map(function (field) {

            if (field.isValid() === false) {
                field.validate(false);
                isValid = false;

            } else {
                field.validate(null);
            }
        });

        return isValid;
    }


    /**
     * Показ сообщения с ошибкой
     * @param {string} message
     * @param {object} options
     */
    showError(message, options) {

        let formContainer = $('#coreui-form-' + this._options.id + ' > form');
        let formError     = formContainer.find('> .coreui-form__error');

        if (formError[0]) {
            formError.remove();
        }

        options = typeof options === 'object' && ! Array.isArray(options) && options !== null ? options : {};

        if (typeof this._options.errorClass === 'string' && this._options.errorClass !== '') {
            options.class = options.hasOwnProperty('class') ? options.class : '';
            options.class += ' ' + this._options.errorClass;
        }

        let errorOptions = {
            class:   options.hasOwnProperty('class') && typeof options.class === 'string' ? options.class : '',
            dismiss: options.hasOwnProperty('dismiss') ? !! options.dismiss : true,
        };

        formContainer.prepend(
            Utils.render(FormTpl['form-error.html'], {
                message: message,
                options: errorOptions,
            })
        );


        if ( ! options.hasOwnProperty('scroll') || options.scroll) {
            $('html,body').animate({
                scrollTop : formContainer.offset().top - options.errorMessageScrollOffset
            }, 'fast');
        }
    }


    /**
     * Скрытие сообщения с ошибкой
     */
    hideError() {

        $('#coreui-form-' + this._options.id + ' > form > .coreui-form__error').remove();
    }


    /**
     * Подписка на событие
     * @param {string}      eventName
     * @param {function}    callback
     * @param {object|null} context
     */
    on(eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: false
        });
    }


    /**
     * Подписка на событие таким образом, что оно будет выполнено один раз
     * @param {string}      eventName
     * @param {function}    callback
     * @param {object|null} context
     */
    one(eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: true,
        });
    }


    /**
     * Удаление формы
     */
    destruct () {

        $('#coreui-form-' + this._options.id).remove();
        delete Controller._instances[this.getId()];
    }


    /**
     * Получение настроек языка
     * @private
     */
    getLang() {

        return $.extend(true, {}, this._options.langList);
    }
}


export default Form;