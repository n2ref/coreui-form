
import coreuiForm        from './coreui.form';
import coreuiFormTpl     from './coreui.form.templates';
import coreuiFormUtils   from './coreui.form.utils';
import coreuiFormPrivate from './coreui.form.private';



let coreuiFormInstance = {

    _options: {
        id: null,
        title: '',
        lang: 'en',
        langList: {},
        send: {
            url: '',
            method: 'POST',
            format: 'form',
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
    },

    _lock: false,
    _readonly: false,
    _fieldsIndex: 0,
    _groupsIndex: 0,
    _controlsIndex: 0,
    _groups: [],
    _fields: [],
    _controls: [],
    _events: {},


    /**
     * Инициализация
     * @param {object} options
     * @private
     */
    _init: function (options) {

        this._options = $.extend(true, {}, this._options, options);

        if ( ! this._options.id) {
            this._options.id = coreuiFormUtils.hashCode();
        }

        this._readonly = options.hasOwnProperty('readonly') && typeof options.readonly === 'boolean' ? options.readonly : false;

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
    },


    /**
     * Инициализация событий
     */
    initEvents: function () {

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

        coreuiFormPrivate.trigger(this, 'show');
    },


    /**
     * Получение id формы
     * @return {string|null}
     */
    getId: function () {

        return this._options.hasOwnProperty('id') ? this._options.id : null;
    },


    /**
     *
     * @param element
     * @returns {*}
     */
    render: function(element) {

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
            $.each(positionMatches, function (key, match) {
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
                $.each(this._options.fields, function (key, field) {
                    let position = field.hasOwnProperty('position') && (typeof field.position === 'string' || typeof field.position === 'number')
                        ? (positions.indexOf(field.position) >= 0 ? field.position : null)
                        : 'default';

                    if (typeof position !== 'string') {
                        return;
                    }

                    let type    = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : '';
                    let content = null;

                    if (type === 'group') {
                        let instance = coreuiFormPrivate.initGroup(that, field);
                        content      = coreuiFormPrivate.renderGroup(instance);

                    } else {
                        let instance = coreuiFormPrivate.initField(that, field);
                        content      = coreuiFormPrivate.renderField(that, instance);
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
            $.each(this._options.controls, function (key, control) {
                let instance = coreuiFormPrivate.initControl(that, control);

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
            coreuiFormUtils.render(coreuiFormTpl['form.html'], {
                form: this._options,
                formAttr: formAttr ? ' ' + formAttr.join(' ') : '',
                widthSizes: widthSizes,
                controls: controls,
            })
        );

        containerElement.find('.coreui-form__fields').append(layoutObj);

        let formId = this.getId();

        $.each(controls, function (key, control) {
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
    },


    /**
     *
     */
    lock: function () {

        this._lock = true;

        $.each(this._controls, function (key, control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                control.lock();
            }
        });
    },


    /**
     * Разблокировка
     */
    unlock: function () {

        this._lock = false;

        $.each(this._controls, function (key, control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                control.unlock();
            }
        });
    },


    /**
     * Отправка данных формы
     */
    send: function () {

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

        $.each(this._fields, function (key, field) {
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
            let func = coreuiFormUtils.getFunctionByName(this._options.onSubmit);

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


        let results    = coreuiFormPrivate.trigger(this, 'send', [ this, data ]);
        let isStopSend = false;

        $.each(results, function(key, result) {
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
                (Array.isArray(data) || coreuiFormUtils.isObject(data))
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

            coreuiFormPrivate.trigger(that, 'send_success', [ that, result ]);

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
                    $.each(jsonResponse.scripts, function (key, script) {
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
                    that._options.onSubmitSuccess();

                } else if (typeof that._options.onSubmitSuccess === 'string') {
                    (new Function(that._options.onSubmitSuccess))();
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
                        $.each(urlParams, function (param, path) {
                            let value = coreuiFormUtils.getObjValue(jsonResponse, path);
                            value = typeof value !== 'undefined' ? value : '';

                            successLoadUrl = successLoadUrl.replace(
                                new RegExp(param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                                value
                            );
                        });
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
            coreuiFormPrivate.trigger(that, 'send_error', [ that, xhr, textStatus, errorThrown ]);
        }

        $.ajax({
            url: this._options.send.url,
            method: this._options.send.method,
            data: dataFormat,
            contentType: contentType,
            processData: false,
            beforeSend: function(xhr) {
                coreuiFormPrivate.trigger(that, 'send_start', [ that, xhr ]);
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
                                    ! coreuiFormUtils.isJson(result)
                                ) {
                                    isValidResponse = false;
                                }
                            }

                        } else if (Array.isArray(that._options.validResponse.dataType)) {
                            $.each(that._options.validResponse.dataType, function (key, dataType) {

                                if (dataType === 'json') {
                                    if (typeof result !== 'object' &&
                                        ! Array.isArray(result) &&
                                        ! coreuiFormUtils.isJson(result)
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
                coreuiFormPrivate.trigger(that, 'send_end', [ that, xhr, textStatus ]);
            },
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return this._options;
    },


    /**
     * Получение записи
     * @returns {object}
     */
    getRecord: function () {

        if (this._options.hasOwnProperty('record') && typeof this._options.record === 'object') {
            return this._options.record;
        }

        return {};
    },


    /**
     * Получение данных с формы
     * @returns {object}
     */
    getData: function () {

        let data = {};

        $.each(this._fields, function (key, field) {
            let fieldOptions = field.getOptions();

            if (fieldOptions.hasOwnProperty('name') && fieldOptions.name) {
                let value = field.getValue();

                if (value !== null) {
                    data[fieldOptions.name] = value;
                }
            }
        });

        return data;
    },


    /**
     * Получение полей
     * @returns {object}
     */
    getFields: function () {
        return this._fields;
    },


    /**
     * Получение элементов управления
     * @returns {object}
     */
    getControls: function () {
        return this._controls;
    },


    /**
     * Получение групп полей
     * @returns {object}
     */
    getGroups: function () {
        return this._groups;
    },


    /**
     * Получение поля по имени
     * @param {string} name
     * @returns {object}
     */
    getField: function (name) {

        let field = {};

        $.each(this._fields, function (key, fieldInstance) {
            let fieldOptions = fieldInstance.getOptions();

            if (fieldOptions.hasOwnProperty('name') && fieldOptions.name === name) {
                field = fieldInstance;
            }
        });

        return field;
    },


    /**
     * Смена состояний полей формы
     */
    readonly: function (isReadonly) {

        $.each(this._fields, function (key, fieldInstance) {
            fieldInstance.readonly(isReadonly);
        });


        $.each(this._controls, function (key, control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                if (isReadonly) {
                    control.hide();
                } else {
                    control.show();
                }
            }
        });
    },


    /**
     * Показ всех элементов управления
     */
    showControls: function () {

        $.each(this._controls, function (key, control) {
            control.show();
        });
    },


    /**
     * Скрытие всех элементов управления
     */
    hideControls: function () {

        $.each(this._controls, function (key, control) {
            control.hide();
        });
    },


    /**
     * Валидация полей
     * @return {boolean}
     */
    validate: function () {

        let isValid = true;

        $.each(this._fields, function (key, field) {

            if (field.isValid() === false) {
                field.validate(false);
                isValid = false;

            } else {
                field.validate(null);
            }
        });

        return isValid;
    },


    /**
     * Показ сообщения с ошибкой
     * @param {string} message
     * @param {object} options
     */
    showError: function (message, options) {

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
            coreuiFormUtils.render(coreuiFormTpl['form-error.html'], {
                message: message,
                options: errorOptions,
            })
        );


        if ( ! options.hasOwnProperty('scroll') || options.scroll) {
            $('html,body').animate({
                scrollTop : formContainer.offset().top - options.errorMessageScrollOffset
            }, 'fast');
        }
    },


    /**
     * Скрытие сообщения с ошибкой
     */
    hideError: function () {

        $('#coreui-form-' + this._options.id + ' > form > .coreui-form__error').remove();
    },


    /**
     * Подписка на событие
     * @param {string}      eventName
     * @param {function}    callback
     * @param {object|null} context
     */
    on: function(eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: false
        });
    },


    /**
     * Подписка на событие таким образом, что оно будет выполнено один раз
     * @param {string}      eventName
     * @param {function}    callback
     * @param {object|null} context
     */
    one: function(eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: true,
        });
    },


    /**
     * Удаление формы
     */
    destruct: function () {

        $('#coreui-form-' + this._options.id).remove();
        delete coreuiForm._instances[this.getId()];
    },


    /**
     * Получение настроек языка
     * @private
     */
    getLang: function () {

        return $.extend(true, {}, this._options.langList);
    }
}


export default coreuiFormInstance;