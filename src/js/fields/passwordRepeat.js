
import 'ejs/ejs.min';
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import coreuiForm      from "../coreui.form";


coreuiForm.fields.passwordRepeat = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _isChangeState: true,
    _value: '',
    _options: {
        type: 'password_repeat',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            type: 'password',
            class: 'form-control d-inline-block flex-shrink-0'
        },
        required: null,
        invalidText: null,
        validText: null,
        readonly: null,
        show: true,
        showBtn: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils.hashCode();
        this._value   = coreuiFormUtils.getFieldValue(form, options);
        this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);


        let that = this;

        form.on('show', function () {
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

        let result;

        if (this._options.readonly) {
            result = this._value;

        } else {
            let pass = $('.content-' + this._hash + ' input[type="password"]').eq(0);

            if (typeof pass.attr('disabled') !== 'undefined' && pass.attr('disabled') !== false) {
                result = null;
            } else {
                result = pass.val();
            }
        }

        return result;
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value ? '******' : '');
        } else {
            $('.content-' + this._hash + ' input[type="password"]').val(value);
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
        let input     = $('input[type="password"]', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback d-block">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback d-block">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function () {

        if ( ! this._isChangeState || this._options.readonly) {
            return true;
        }

        let input = $('.content-' + this._hash + ' input[type="password"]');

        if (input.eq(0).val() !== input.eq(1).val()) {
            return false;
        }

        if (input[0]) {
            return input.eq(0).is(':valid');
        }

        return null;
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
            form: this._form,
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

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     *
     * @private
     */
    _renderContent: function () {

        let attributes  = [];
        let attributes2 = [];
        let options     = this.getOptions();

        this._isChangeState = ! options.showBtn
            ? true
            : ! this._value;

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if ( ! this._isChangeState) {
            options.attr.disabled = '';
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.value = this._value ? '******' : '';

        if (options.width) {
            options.attr = coreuiFormUtils.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });
        $.each(options.attr, function (name, value) {
            if (['name', 'value'].indexOf(name) < 0) {
                attributes2.push(name + '="' + value + '"');
            }
        });

        let lang = this._form.getLang();

        return ejs.render(coreuiFormTpl['fields/passwordRepeat.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            lang: lang,
            btn_text: this._isChangeState ? lang.cancel : lang.change,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                attr2: attributes2.length > 0 ? (' ' + attributes2.join(' ')) : ''
            },
        });
    },


    /**
     *
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();

        return ejs.render(coreuiFormTpl['fields/passwordRepeat.html'], {
            field: options,
            value: this._value ? '******' : '',
            hash: this._hash
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        let that = this;

        $('.content-' + this._hash + ' .btn-password-change').click(function (e) {
            let textChange = $(this).data('change');
            let textCancel = $(this).data('cancel');

            if (that._isChangeState) {
                $('.content-' + that._hash + ' [type="password"]').attr('disabled', 'disabled');
                $(this).text(textChange);
                that._isChangeState = false;

            } else {
                $('.content-' + that._hash + ' [type="password"]').removeAttr('disabled');
                $(this).text(textCancel);
                that._isChangeState = true;
            }
        });
    }
}