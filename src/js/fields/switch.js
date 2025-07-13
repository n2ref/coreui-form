
import FormTpl   from "../tpl";
import Utils from "../utils";
import Field           from "../abstract/Field";


class FieldSwitch extends Field {

    /**
     * Инициализация
     * @param {Form} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'switch',
            name: null,
            label: null,
            labelWidth: null,
            prefix: null,
            suffix: null,
            description: null,
            errorText: null,
            valueY: 1,
            valueN: 0,
            fields: [],
            required: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null,
            on: null,
        }, options);

        super(form, options);
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
            result = $('.content-' + this.getContentId() + ' input').prop('checked')
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

        if (this._readonly) {
            $('.content-' + this.getContentId()).text(value);
        } else {
            $('.content-' + this.getContentId() + ' input[type=checkbox]').prop('checked', value === this._options.valueY);
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

        let container       = $('.content-' + this.getContentId());
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
            itemAttr = Utils.mergeAttr(itemAttr, options.attr);
        }

        if (this._value === options.valueY) {
            itemAttr.checked = 'checked';
        }

        $.each(itemAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        let field = $(
            Utils.render(FormTpl['fields/switch.html'], {
                readonly: this._readonly,
                valueY: options.valueY,
                value: this._value,
                lang: this._form.getLang(),
                attr: attributes.length > 0 ? attributes.join(' ') : ''
            })
        );


        if (this._options.on && Utils.isObject(this._options.on)) {
            let input = field.find('input').addBack('input');
            let that  = this;

            for (let [eventName, callback] of Object.entries(this._options.on)) {

                if (typeof eventName === 'string' && typeof callback === 'function') {
                    input.on(eventName, function (event) {
                        callback({ field: that, event: event });
                    })
                }
            }
        }

        return field;
    }
}


export default FieldSwitch;