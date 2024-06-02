
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldRange extends Field {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'range',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
            attr: {
                class: 'form-range d-inline-block pt-1'
            },
            required: null,
            readonly: null,
            datalist: null,
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
            : $('.content-' + this._hash + ' input').val();
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
            $('.content-' + this._hash + ' input').val(value);
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
        let input     = $('input', container);

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
                container.append('<div class="valid-feedback">' + text + '</div>');
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
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    }


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid() {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let attributes = [];
        let datalist   = [];
        let options    = this.getOptions();
        let datalistId = coreuiFormUtils.hashCode();

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

        options.attr.type  = 'range';
        options.attr.value = this._value;

        if (options.width) {
            options.attr = coreuiFormUtils.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }
        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                })
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(coreuiFormTpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    }
}

coreuiForm.fields.range = FieldRange;

export default FieldRange;