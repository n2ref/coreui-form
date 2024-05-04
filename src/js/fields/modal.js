
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";


coreuiForm.fields.modal = {

    _id: '',
    _hash: '',
    _form: null,
    _value: '',
    _text: '',
    _options: {
        type: 'modal',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        fields: [],
        options: {
            title: '',
            size: 'lg',
            url: '',
            onHidden: null,
            onClear: null,
            onChange: null,
        },
        required: null,
        readonly: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        let formRecord = form.getRecord();

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
        this._hash    = coreuiFormUtils.hashCode();

        if (typeof options.name === 'string' &&
            formRecord.hasOwnProperty(options.name) &&
            ['object'].indexOf(typeof formRecord[options.name]) >= 0
        ) {
            let record = formRecord[options.name];

            this._value = record.hasOwnProperty('value') && ['number', 'string'].indexOf(typeof(record.value)) >= 0 ? record.value : '';
            this._text  = record.hasOwnProperty('text') && ['number', 'string'].indexOf(typeof(record.text)) >= 0 ? record.text : '';
        }


        let that = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input.coreui-form-modal-value').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     * @param {string} text
     */
    setValue: function (value, text) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(text);

        } else {
            let elementValue = $('.content-' + this._hash + ' .coreui-form-modal-value');
            let elementText  = $('.content-' + this._hash + ' .coreui-form-modal-text');
            let oldValue     = elementValue.val();

            elementValue.val(value);
            elementText.val(text);


            if (oldValue != value) {
                let modal = this._options.hasOwnProperty('options') && typeof (this._options.options) === 'object'
                    ? this._options.options
                    : {};

                if (modal.hasOwnProperty('onChange')) {
                    if (typeof(modal.onChange) === 'function') {
                        modal.onChange(this);

                    } else if (typeof(modal.onChange) === 'string') {
                        (new Function('modal', modal.onChange))(this);
                    }
                }

                this._form._trigger('change-modal.coreui.form', this, [this]);
            }
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);

        container.find('.text-success').remove();
        container.find('.text-danger').remove();

        if (isValid === null) {
            return;
        }

        if (isValid) {
            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-success">' + text + '</div>');
            }

        } else {
            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-danger">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            return !! this.getValue();
        }

        return true;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils.getAttacheFields(this._form, options);

        return ejs.render(coreuiFormTpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let fieldOptions = this.getOptions();
        let attributes   = [];
        let textAttr     = {
            type: 'text',
            readonly: 'readonly',
            class: 'form-control coreui-form-modal-text',
            value: this._text !== null ? this._text : ''
        };

        if (fieldOptions.required) {
            textAttr.required = 'required';
        }

        if (fieldOptions.hasOwnProperty('attr') &&
            typeof fieldOptions.attr === 'object' &&
            Array.isArray(fieldOptions.attr)
        ) {
            textAttr = coreuiFormUtils.mergeAttr(textAttr, fieldOptions.attr);
        }

        $.each(textAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(coreuiFormTpl['fields/modal.html'], {
            field: fieldOptions,
            value: this._value !== null ? this._value : '',
            text: this._text !== null ? this._text : '',
            lang: this._form.getLang(),
            render: {
                width: this._options.width,
                attr: attributes.length > 0 ? attributes.join(' ') : ''
            },
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        let that  = this;
        let modal = this._options.hasOwnProperty('options') && typeof(this._options.options) === 'object'
            ? this._options.options
            : {};


        // Очистка
        $('.content-' + this._hash + ' .btn-modal-clear').click(function (e) {
            if (modal.hasOwnProperty('onClear')) {
                if (typeof(modal.onClear) === 'function') {
                    modal.onClear(that);

                } else if (typeof(modal.onClear) === 'string') {
                    (new Function('field', modal.onClear))(that);
                }
            }

            that._form._trigger('clear-modal.coreui.form', that, [ that, e ]);

            that.setValue('', '');
        });

        // Выбор
        $('.content-' + this._hash + ' .btn-modal-select').click(function (e) {
            let title = modal.hasOwnProperty('title') && typeof(modal.title) === 'string'
                ? modal.title
                : '';

            let size = modal.hasOwnProperty('size') && typeof(modal.size) === 'string'
                ? modal.size
                : 'lg';

            let url = modal.hasOwnProperty('url') && typeof(modal.url) === 'string'
                ? modal.url
                : '';

            if ( ! url) {
                return;
            }


            let modalId      = coreuiFormUtils.hashCode();
            let modalLoading = ejs.render(coreuiFormTpl['fields/modal-loading.html'], {
                lang: that._form.getLang(),
            });


            if (CoreUI.hasOwnProperty('modal')) {
                let onShow   = null;
                let onHidden = null;

                if (modal.hasOwnProperty('onHidden')) {
                    if (typeof(modal.onHidden) === 'function') {
                        onHidden = modal.onHidden;

                    } else if (typeof(modal.onHidden) === 'string') {
                        onHidden = new Function(modal.onHidden);
                    }
                }

                if (modal.hasOwnProperty('onShow')) {
                    if (typeof(modal.onShow) === 'function') {
                        onShow = modal.onShow;

                    } else if (typeof(modal.onShow) === 'string') {
                        onShow = new Function(modal.onShow)
                    }
                }

                CoreUI.modal.show(title, modalLoading, {
                    id: modalId,
                    size: size,
                    onShow: onShow,
                    onHidden: onHidden
                });
            }

            $.ajax({
                url: url,
                method: 'GET',
                beforeSend: function(xhr) {
                    that._form._trigger('before-load-modal.coreui.form', that, [ that, xhr ]);
                },
                success: function (result) {
                    $('#modal-' + modalId + ' .modal-body').html(result);
                    that._form._trigger('success-load-modal.coreui.form', that, [ that, result ]);
                },
                error: function(xhr, textStatus, errorThrown) {
                    that._form._trigger('error-load-modal.coreui.form', that, [ that, xhr, textStatus, errorThrown ]);
                },
                complete: function(xhr, textStatus) {
                    that._form._trigger('complete-load-modal.coreui.form', that, [ that, xhr, textStatus ]);
                },
            });


            that._form._trigger('select-modal.coreui.form', that, [ that, e ]);
        });
    }
}