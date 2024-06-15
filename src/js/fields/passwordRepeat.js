
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldPasswordRepeat extends Field {

    _isChangeState = true;


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'password_repeat',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
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
            position: null,
            noSend: null
        }, options);

        super(form, options);

        let that = this;

        form.on('show', function () {
            that._initEvents();
        });
    }


    /**
     * Изменение режима поля только для чтения
     * @param {boolean} isReadonly
     */
    readonly(isReadonly) {

        super.readonly(isReadonly);

        if ( ! isReadonly) {
            this._initEvents();
        }
    }


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue () {

        let result;

        if (this._readonly) {
            result = this._value;

        } else {
            let pass = $('.content-' + this.getContentId() + ' input[type="password"]').eq(0);

            if (typeof pass.attr('disabled') !== 'undefined' && pass.attr('disabled') !== false) {
                result = null;
            } else {
                result = pass.val();
            }
        }

        return result;
    }


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue(value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._readonly) {
            $('.content-' + this.getContentId()).text(value ? '******' : '');
        } else {
            $('.content-' + this.getContentId() + ' input[type="password"]').val(value);
        }
    }


    /**
     * Установка валидности поля
     * @param {boolean|null} isValid
     * @param {text} text
     */
    validate(isValid, text) {

        if (this._readonly) {
            return;
        }

        let container = $('.content-' + this.getContentId());
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
    }


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid() {

        if ( ! this._isChangeState || this._readonly) {
            return true;
        }

        let input = $('.content-' + this.getContentId() + ' input[type="password"]');

        if (input.eq(0).val() !== input.eq(1).val()) {
            return false;
        }

        if (input[0]) {
            return input.eq(0).is(':valid');
        }

        return null;
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        return this._readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    }


    /**
     *
     * @private
     */
    _renderContent() {

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

        return coreuiFormUtils.render(coreuiFormTpl['fields/passwordRepeat.html'], {
            readonly: this._readonly,
            value: this._value !== null ? this._value : '',
            lang: lang,
            showBtn: options.showBtn,
            btn_text: this._isChangeState ? lang.cancel : lang.change,
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            attr2: attributes2.length > 0 ? (' ' + attributes2.join(' ')) : ''
        });
    }


    /**
     *
     * @private
     */
    _renderContentReadonly() {

        return coreuiFormUtils.render(coreuiFormTpl['fields/passwordRepeat.html'], {
            readonly: this._readonly,
            value: this._value ? '******' : ''
        });
    }


    /**
     * Инициализация событий
     * @private
     */
    _initEvents() {

        let that   = this;
        let noSend = that._options.noSend;

        $('.content-' + this.getContentId() + ' .btn-password-change').click(function (e) {
            let textChange = $(this).data('change');
            let textCancel = $(this).data('cancel');

            if (that._isChangeState) {
                $('.content-' + that.getContentId() + ' [type="password"]').attr('disabled', 'disabled');
                $(this).text(textChange);
                that._isChangeState  = false;
                that._options.noSend = true;

            } else {
                $('.content-' + that.getContentId() + ' [type="password"]').removeAttr('disabled');
                $(this).text(textCancel);
                that._isChangeState = true;
                that._options.noSend = noSend;
            }
        });
    }
}

export default FieldPasswordRepeat;