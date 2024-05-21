
import 'ejs/ejs.min';
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import coreuiForm      from "../coreui.form";


coreuiForm.fields.checkbox = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: [],
    _options: {
        type: 'checkbox',
        name: null,
        label: null,
        labelWidth: null,
        inline: false,
        outContent: null,
        description: null,
        errorText: null,
        options: [],
        fields: null,
        required: null,
        readonly: null,
        show: true,
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
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils.hashCode();
        this._value   = coreuiFormUtils.getFieldValue(form, options);
        this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
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
     * @param {boolean} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).animate({
            opacity: 0,
        }, duration || 200, function () {
            $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
        });
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id)
            .addClass('d-flex')
            .removeClass('d-none')
            .css('opacity', 0)
            .animate({
                opacity: 1,
            }, duration || 200, function () {
                $(this).css('opacity', '');
            });
    },


    /**
     * Получение значения в поле
     * @returns {object}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;

        } else {
            let values = [];

            $('.content-' + this._hash + ' input[type=checkbox]:checked').each(function () {
                values.push($(this).val());
            });

            return values;
        }
    },


    /**
     * Установка значений в поле
     * @param {object|null|string|number} value
     */
    setValue: function (value) {

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

        let that    = this;
        this._value = [];

        if (this._options.readonly) {
            $('.content-' + that._hash).empty();

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


                $('.content-' + that._hash).text(selectedItems.join(', '));
            }

        } else {
            $('.content-' + this._hash + ' input[type=radio]').prop('checked', false);

            if (Array.isArray(value)) {
                $('.content-' + this._hash + ' input[type=radio]').each(function (key, itemValue) {
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
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            return this.getValue().length > 0;
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
            field: this._options,
            content: this.renderContent(),
            attachFields: attachFields,
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

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

                itemAttr.id = coreuiFormUtils.hashCode();

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

        return ejs.render(coreuiFormTpl['fields/checkbox.html'], {
            field: fieldOptions,
            value: value,
            render: {
                options: checkboxOptions,
                selectedItems: selectedItems
            },
        });
    }
}