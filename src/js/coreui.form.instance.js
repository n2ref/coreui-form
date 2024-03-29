
import '../../node_modules/ejs/ejs.min';
import coreuiFormTpl   from './coreui.form.templates';
import coreuiFormUtils from './coreui.form.utils';
import coreuiForm      from "./coreui.form";



let coreuiFormInstance = {

    _options: {
        id: null,
        title: '',
        lang: 'en',
        send: {
            url: '',
            method: 'POST',
            format: 'form',
        },
        width: null,
        validResponse: {
            headers: null,
            dataType: null,
        },
        minWidth: null,
        maxWidth: null,
        labelWidth: 200,
        controlsOffset: null,
        readonly: false,
        validate: false,
        successLoadUrl: '',
        errorClass: '',
        layout: '[column_default]',
        onSubmit: null,
        onSubmitSuccess: null,
        record: {},
        fields: [],
        controls: []
    },

    _lock: false,
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

        this._options.labelWidth    = coreuiForm.getSetting('labelWidth');
        this._options.lang          = coreuiForm.getSetting('lang');
        this._options.errorClass    = coreuiForm.getSetting('errorClass');
        this._options.send.format = coreuiForm.getSetting('sendDataFormat');

        this._options = $.extend(true, {}, this._options, options);

        if ( ! this._options.id) {
            this._options.id = coreuiFormUtils.hashCode();
        }

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
     *
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

        this._trigger('shown.coreui.form');
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
        let layout     = this._options.layout;
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



        // Поля
        if (typeof this._options.fields === 'object' &&
            Array.isArray(this._options.fields) &&
            this._options.fields.length > 0 &&
            layout &&
            typeof layout === 'string'
        ) {
            let matches        = Array.from(layout.matchAll(/\[column_([\w_\d]+)\]/g));
            let columns        = [];
            let columnsContent = {};

            if (matches.length > 0) {
                $.each(matches, function (key, match) {
                    columns.push(match[1]);
                });
            }

            if (columns.length > 0) {
                $.each(this._options.fields, function (key, field) {
                    let column = field.hasOwnProperty('column') && (typeof field.column === 'string' || typeof field.column === 'number')
                        ? (columns.indexOf(field.column) >= 0 ? field.column : null)
                        : 'default';

                    if (typeof column !== 'string') {
                        return;
                    }

                    let type     = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : '';
                    let instance = null;

                    if (type === 'group') {
                        instance = that.initGroup(field);

                    } else {
                        instance = that.initField(field);
                    }


                    if ( ! instance || typeof instance !== 'object') {
                        return;
                    }

                    if ( ! columnsContent.hasOwnProperty(column)) {
                        columnsContent[column] = [];
                    }
                    columnsContent[column].push(instance.render());
                });
            }

            if (Object.keys(columnsContent).length >= 0) {
                $.each(columnsContent, function (name, fieldContents) {

                    layout = layout.replace('[column_' + name + ']', fieldContents.join(''));
                });
            }
        }


        // Элементы управления
        if (typeof this._options.controls === 'object' &&
            Array.isArray(this._options.controls) &&
            this._options.controls.length > 0
        ) {
            $.each(this._options.controls, function (key, control) {
                let instance = that.initControl(control);

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


        let html = ejs.render(coreuiFormTpl['form.html'], {
            form: this._options,
            formAttr: formAttr ? ' ' + formAttr.join(' ') : '',
            widthSizes: widthSizes,
            layout: layout,
            controls: controls,
        });

        if (element === undefined) {
            return html;
        }

        // Dom element
        let domElement = {};

        if (typeof element === 'string') {
            domElement = document.getElementById(element);

            if ( ! domElement) {
                return '';
            }

        } else if (element instanceof HTMLElement) {
            domElement = element;
        }


        domElement.innerHTML = html;

        this.initEvents();
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


        let results    = this._trigger('send.coreui.form', this, [ this, data ]);
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

            $.each(data, function (name, value) {
                if (value instanceof File) {
                    dataFormat.append(name, value, value.name);

                } else if (value instanceof FileList) {
                    $.each(value, function (key, file) {
                        dataFormat.append(name, file, file.name);
                    });

                } else {
                    dataFormat.append(name, value);
                }
            });
        }


        /**
         * Запрос выполнился успешно
         * @param result
         */
        let successSend = function (result) {

            that.hideError();

            that._trigger('success-send.coreui.form', that, [ that, result ]);

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
            that._trigger('error-send.coreui.form', that, [ that, xhr, textStatus, errorThrown ]);
        }

        $.ajax({
            url: this._options.send.url,
            method: this._options.send.method,
            data: dataFormat,
            contentType: contentType,
            processData: false,
            beforeSend: function(xhr) {
                that._trigger('start-send.coreui.form', that, [ that, xhr ]);
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
                that._trigger('end-send.coreui.form', that, [ that, xhr, textStatus ]);
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
     * Получение поля
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
            ejs.render(coreuiFormTpl['form-error.html'], {
                message: message,
                options: errorOptions,
            })
        );


        if ( ! options.hasOwnProperty('scroll') || options.scroll) {
            let scrollOffset = coreuiForm.getSetting('errorMessageScrollOffset');

            $('html,body').animate({
                scrollTop : formContainer.offset().top - scrollOffset
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
     * @param eventName
     * @param callback
     * @param context
     * @param singleExec
     */
    on: function(eventName, callback, context, singleExec) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: !! singleExec,
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
     * Инициализация поля
     * @param field
     * @return {object|null}
     * @private
     */
    initField: function (field) {

        if (typeof field !== 'object') {
            return null;
        }

        let type = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : 'input';

        if (type === 'group') {
            return null;
        }

        if ( ! coreuiForm.fields.hasOwnProperty(type)) {
            type = 'input';
        }

        if (this._options.readonly) {
            field.readonly = true;
        }


        let fieldInstance = $.extend(true, {
            render:        function () {},
            renderContent: function () {},
            init:          function () {},
            getValue:      function () {},
            setValue:      function () {},
            getOptions:    function () {},
            show:          function () {},
            hide:          function () {},
            readonly:      function () {},
            validate:      function () {},
            isValid:       function () {},
        }, coreuiForm.fields[type]);

        fieldInstance.init(this, field, this._fieldsIndex++);

        this._fields.push(fieldInstance);

        return fieldInstance;
    },


    /**
     * Инициализация группы
     * @param group
     * @return {object|null}
     * @private
     */
    initGroup: function (group) {

        if (typeof group !== 'object') {
            return null;
        }

        let type = group.hasOwnProperty('type') && typeof group.type === 'string' ? group.type : '';

        if (type !== 'group') {
            return null;
        }

        let groupInstance = $.extend(true, {
            render:     function () {},
            init:       function () {},
            getOptions: function () {},
            expand:     function () {},
            collapse:   function () {},
        }, coreuiForm.fields[type]);

        groupInstance.init(this, group, this._groupsIndex++);

        this._groups.push(groupInstance);

        return groupInstance;
    },


    /**
     * Инициализация контролов
     * @param control
     * @return {object|null}
     * @private
     */
    initControl: function (control) {

        if (typeof control !== 'object') {
            return null;
        }

        let type = control.hasOwnProperty('type') && typeof control.type === 'string' ? control.type : null;

        if ( ! type || ! coreuiForm.controls.hasOwnProperty(type)) {
            return null;
        }

        if (type === 'submit' && this._options.readonly) {
            control.show = false;
        }


        let controlInstance = $.extend(true, {
            render:     function () {},
            init:       function () {},
            getOptions: function () {},
            show:       function () {},
            hide:       function () {},
        }, coreuiForm.controls[type]);

        controlInstance.init(this, control, this._controlsIndex++);

        this._controls.push(controlInstance);

        return controlInstance;
    },


    /**
     * Получение настроек языка
     * @private
     */
    getLang: function () {

        return coreuiForm.lang.hasOwnProperty(this._options.lang)
            ? coreuiForm.lang[this._options.lang]
            : coreuiForm.lang['ru'];
    },


    /**
     * @param name
     * @param context
     * @param params
     * @return {object}
     * @private
     */
    _trigger: function(name, context, params) {

        params = params || [];
        let results = [];

        if (this._events[name] instanceof Object && this._events[name].length > 0) {
            for (var i = 0; i < this._events[name].length; i++) {
                let callback = this._events[name][i].callback;

                context = context || this._events[name][i].context;

                results.push(
                    callback.apply(context, params)
                );

                if (this._events[name][i].singleExec) {
                    this._events[name].splice(i, 1);
                }
            }
        }

        return results;
    },


    /**
     * @param {object} control
     * @return {string}
     * @private
     */
    _renderControl: function (control) {

        let content = '';
        let type    = control.hasOwnProperty('type') && typeof control.type === 'string' ? control.type : 'text';

        if (coreuiForm.control.hasOwnProperty(type)) {
            content = coreuiForm.control[type].render(control);
        }

        return content;
    }
}


export default coreuiFormInstance;