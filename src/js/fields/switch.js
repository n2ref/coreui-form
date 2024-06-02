
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldSwitch extends Field {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'switch',
            name: null,
            label: null,
            labelWidth: null,
            outContent: null,
            description: null,
            errorText: null,
            valueY: 'Y',
            valueN: 'N',
            fields: [],
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
    getValue () {

        let result;

        if (this._options.readonly) {
            result = this._value;
        } else {
            result = $('.content-' + this._hash + ' input').prop('checked')
                ? this._options.valueY
                : this._options.valueN
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

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input[type=checkbox]').prop('checked', value === this._options.valueY);
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

        let container       = $('.content-' + this._hash);
        let switchContainer = $('.form-switch', container);
        let inputs          = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            inputs.removeClass('is-invalid');
            inputs.removeClass('is-valid');

        } else if (isValid) {
            inputs.removeClass('is-invalid');
            inputs.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                switchContainer.append('<div class="valid-feedback">' + text + '</div>');
            }

        } else {
            inputs.removeClass('is-valid');
            inputs.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                switchContainer.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let attributes = [];
        let options    = this.getOptions();
        let itemAttr   = {
            type: 'checkbox',
            class: 'form-check-input',
            value: options.valueY
        };


        if (options.name) {
            itemAttr.name = this._options.name;
        }

        if (options.required) {
            itemAttr.required = 'required';
        }

        if (options.hasOwnProperty('attr') &&
            typeof options.attr === 'object' &&
            Array.isArray(options.attr)
        ) {
            itemAttr = coreuiFormUtils.mergeAttr(itemAttr, options.attr);
        }

        if (this._value === options.valueY) {
            itemAttr.checked = 'checked';
        }

        $.each(itemAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(coreuiFormTpl['fields/switch.html'], {
            field: options,
            value: this._value,
            lang: this._form.getLang(),
            render: {
                attr: attributes.length > 0 ? attributes.join(' ') : ''
            },
        });
    }
}

coreuiForm.fields.switch = FieldSwitch;

export default FieldSwitch;