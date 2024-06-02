
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldTextarea extends Field {


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'textarea',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
            attr: {
                class: 'form-control d-inline-block'
            },
            required: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null,
        }, options);

        super(form, options, index);
    }


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue() {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' textarea').val();
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

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' textarea').val(value);
        }
    }


    /**
     * Установка валидности поля
     * @param {boolean|null} isValid
     * @param {text} text
     */
    validate(isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let textarea  = $('textarea', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            textarea.removeClass('is-invalid');
            textarea.removeClass('is-valid');

        } else if (isValid) {
            textarea.removeClass('is-invalid');
            textarea.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            textarea.removeClass('is-valid');
            textarea.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    }


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid() {

        let input = $('.content-' + this._hash + ' textarea');

        if (input[0]) {
            return input.is(':valid');
        }
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let attributes = [];
        let options    = this.getOptions();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

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

        return ejs.render(coreuiFormTpl['fields/textarea.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
            },
        });
    }
}

coreuiForm.fields.textarea = FieldTextarea;

export default FieldTextarea;