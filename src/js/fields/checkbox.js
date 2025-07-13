
import FormTpl   from "../tpl";
import Utils from "../utils";
import Field     from "../abstract/Field";


class FieldCheckbox extends Field {


    /**
     * Инициализация
     * @param {Form} form
     * @param {object} options
     */
    constructor(form, options) {
        options = $.extend(true, {
            type: 'checkbox',
            name: null,
            label: null,
            labelWidth: null,
            inline: false,
            prefix: null,
            suffix: null,
            description: null,
            errorText: null,
            options: [],
            fields: null,
            required: null,
            readonly: null,
            show: true,
            on         : null,
        }, options);

        super(form, options);
    }


    /**
     * Получение значения в поле
     * @returns {Array}
     */
    getValue() {

        if (this._readonly) {
            return this._value;

        } else {
            let values = [];

            $('.content-' + this.getContentId() + ' input[type=checkbox]:checked').each(function () {
                values.push($(this).val());
            });

            return values;
        }
    }


    /**
     * Установка значений в поле
     * @param {object|null|string|number} value
     */
    setValue(value) {

        if (['string', 'number', 'object'].indexOf(typeof value) < 0) {
            return;
        }

        if (typeof value === 'object') {
            if (value !== null && ! Array.isArray(value)) {
                return;
            }

        } else {
            value = [ value ];
        }

        let that      = this;
        let contentId = this.getContentId();

        this._value   = [];

        if (this._readonly) {
            $('.content-' + contentId).empty();

            let fieldOptions = this.getOptions();

            if (fieldOptions.hasOwnProperty('options') &&
                typeof fieldOptions.options === 'object' &&
                Array.isArray(fieldOptions.options) &&
                Array.isArray(value)
            ) {
                let selectedItems = [];

                $.each(fieldOptions.options, function (key, option) {

                    if (option.hasOwnProperty('value')) {
                        $.each(value, function (key, val) {

                            if (option.value == val) {
                                if (option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0) {
                                    selectedItems.push(option.text);
                                }

                                that._value.push(val);
                                return false;
                            }
                        });
                    }
                });


                $('.content-' + contentId).text(selectedItems.join(', '));
            }

        } else {
            $('.content-' + contentId + ' input[type=radio]').prop('checked', false);

            if (Array.isArray(value)) {
                $('.content-' + contentId + ' input[type=radio]').each(function (key, itemValue) {
                    $.each(value, function (key, val) {
                        if (val == $(itemValue).val()) {
                            $(itemValue).prop('checked', true);
                            that._value.push(val);

                            return false;
                        }
                    });
                });
            }
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

        if (this._options.required && ! this._readonly) {
            return this.getValue().length > 0;
        }

        return true;
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let that            = this;
        let checkboxOptions = [];
        let fieldOptions    = this.getOptions();
        let selectedItems   = [];

        if (fieldOptions.hasOwnProperty('options') &&
            typeof fieldOptions.options === 'object' &&
            Array.isArray(fieldOptions.options)
        ) {
            $.each(fieldOptions.options, function (key, option) {
                let attributes = [];
                let itemAttr = {
                    type: 'checkbox',
                    class: 'form-check-input'
                };
                let optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
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

                itemAttr.id = Utils.hashCode();

                if (typeof(that._value) === 'object' &&
                    Array.isArray(that._value)
                ) {
                    $.each(that._value, function (key, itemValue) {
                        if (itemValue == option.value) {
                            itemAttr.checked = 'checked';
                            if (option.hasOwnProperty('text') && option.text) {
                                selectedItems.push(option.text);
                            }
                            return false;
                        }
                    });

                } else if (that._value == option.value) {
                    if (option.hasOwnProperty('text') && option.text) {
                        selectedItems.push(option.text);
                    }
                    itemAttr.checked = 'checked';
                }

                $.each(itemAttr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                });


                checkboxOptions.push({
                    id: itemAttr.id,
                    text: optionText,
                    attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
                })
            });
        }

        let value = typeof this._value === 'object' && Array.isArray(this._value)
            ? this._value.join(', ')
            : this._value

        let field = $(
            Utils.render(FormTpl['fields/checkbox.html'], {
                readonly: this._readonly,
                field: fieldOptions,
                value: value,
                options: checkboxOptions,
                selectedItems: selectedItems
            })
        );


        if (this._options.on && Utils.isObject(this._options.on)) {
            let input = field.find('input').addBack('input');

            for (let [eventName, callback] of Object.entries(this._options.on)) {

                if (typeof eventName === 'string' && typeof callback === 'function') {
                    input.on(eventName, function (event) {
                        callback({ field: this, event: event });
                    })
                }
            }
        }

        return field
    }
}

export default FieldCheckbox;