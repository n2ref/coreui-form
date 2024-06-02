
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldRadio extends Field {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'radio',
            name: null,
            label: null,
            labelWidth: null,
            inline: false,
            outContent: null,
            description: null,
            errorText: null,
            options: [],
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

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input[type=radio]:checked').val();
    }


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue(value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        if (this._options.readonly) {
            let that         = this;
            let fieldOptions = this.getOptions();

            if (fieldOptions.hasOwnProperty('options') &&
                typeof fieldOptions.options === 'object' &&
                Array.isArray(fieldOptions.options)
            ) {
                $.each(fieldOptions.options, function (key, option) {

                    if (option.hasOwnProperty('value') && option.value == value) {
                        let text = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                            ? option.text
                            : '';

                        $('.content-' + that._hash).text(text);
                        that._value = value;
                        return false;
                    }
                });
            }

        } else {
            let input = $('.content-' + this._hash + ' input[type=radio][value="' + value + '"]');

            if (input[0]) {
                input.prop('checked', true);
                this._value = value;
            }
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
        let lastInput = $('.form-check:last-child', container);
        let inputs    = $('input', container);

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
                lastInput.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            inputs.removeClass('is-valid');
            inputs.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                lastInput.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    }


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid() {

        if (this._options.required && ! this._options.readonly) {
            let value = this.getValue();
            return typeof value === 'string' && value !== '';
        }

        return true;
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let that         = this;
        let radioOptions = [];
        let fieldOptions = this.getOptions();
        let selectedItem = [];

        if (fieldOptions.hasOwnProperty('options') &&
            typeof fieldOptions.options === 'object' &&
            Array.isArray(fieldOptions.options)
        ) {
            $.each(fieldOptions.options, function (key, option) {
                let attributes = [];
                let itemAttr = {
                    type: 'radio',
                    class: 'form-check-input'
                };
                let optionText   = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                    ? option.text
                    : '';

                if (fieldOptions.name) {
                    itemAttr.name = that._options.name;
                }

                if (fieldOptions.required) {
                    itemAttr.required = 'required';
                }

                $.each(option, function (name, value) {
                    if (name !== 'text') {
                        if (name === 'class') {
                            itemAttr[name] = itemAttr[name] + ' ' + value;
                        } else {
                            itemAttr[name] = value;
                        }
                    }
                });

                itemAttr.id = coreuiFormUtils.hashCode();

                if (that._value == option.value) {
                    if (option.hasOwnProperty('text') && option.text) {
                        selectedItem.push(option.text);
                    }
                    itemAttr.checked = 'checked';
                }

                $.each(itemAttr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                });


                radioOptions.push({
                    id: itemAttr.id,
                    text: optionText,
                    attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
                })
            });
        }

        return ejs.render(coreuiFormTpl['fields/radio.html'], {
            field: fieldOptions,
            value: this._value,
            render: {
                options: radioOptions,
                selectedItem: selectedItem
            },
        });
    }
}

coreuiForm.fields.radio = FieldRadio;

export default FieldRadio;