
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";


coreuiForm.fields.select = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: [],
    _options: {
        type: 'select',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-select d-inline-block'
        },
        required: null,
        readonly: null,
        datalist: null,
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
        this._index   = index;
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
     * @param {bool} isReadonly
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
     * Получение значения из поля
     * @returns {array|string}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;

        } else {
            if (this._options.hasOwnProperty('attr') &&
                typeof this._options.attr === 'object' &&
                this._options.attr !== null &&
                ! Array.isArray(this._options.attr) &&
                this._options.attr.hasOwnProperty('multiple')
            ) {
                let values = [];

                $('.content-' + this._hash + ' select option:selected').each(function () {
                    values.push($(this).val());
                });

                return values;

            } else {
                return $('.content-' + this._hash + ' select option:selected').val()
            }
        }
    },


    /**
     * Установка значения в поле
     * @param {string} value
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
            $('.content-' + this._hash + ' select > option').prop('selected', false);

            if (Array.isArray(value)) {
                $('.content-' + this._hash + ' select > option').each(function (key, itemValue) {
                    $.each(value, function (key, val) {
                        if (val == $(itemValue).val()) {
                            $(itemValue).prop('selected', true);
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
        let select    = $('select', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            select.removeClass('is-invalid');
            select.removeClass('is-valid');

        } else if (isValid) {
            select.removeClass('is-invalid');
            select.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            select.removeClass('is-valid');
            select.addClass('is-invalid');

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
    },


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function () {

        let select = $('.content-' + this._hash + ' select');

        if (this._options.required && select.val() === '') {
            return false;
        }

        if (select[0]) {
            return select.is(':valid');
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

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     * Формирование контента
     * @return {*}
     * @private
     */
    _renderContent: function () {

        let that          = this;
        let options       = this.getOptions();
        let attributes    = [];
        let selectOptions = [];


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


        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            options.options !== null
        ) {
            $.each(options.options, function (key, option) {

                if (typeof option === 'string' || typeof option === 'number') {
                    selectOptions.push(that._renderOption({
                        type: 'option',
                        value: key,
                        text: option
                    }));

                } else if (typeof option === 'object') {
                    let type = option.hasOwnProperty('type') && typeof option.type === 'string'
                        ? option.type
                        : 'option';

                    if (type === 'group') {
                        let renderAttr   = [];
                        let groupAttr    = {};
                        let groupOptions = [];

                        if (option.hasOwnProperty('attr') &&
                            typeof option.attr === 'object' &&
                            option.attr !== null &&
                            ! Array.isArray(option.attr)
                        ) {
                            groupAttr = option.attr;
                        }

                        if (option.hasOwnProperty('label') && ['string', 'number'].indexOf(typeof(option.label)) >= 0) {
                            groupAttr.label = option.label;
                        }

                        $.each(groupAttr, function (name, value) {
                            renderAttr.push(name + '="' + value + '"');
                        });

                        if (Array.isArray(option.options)) {
                            $.each(option.options, function (key, groupOption) {
                                groupOptions.push(that._renderOption(groupOption));
                            });
                        }

                        selectOptions.push({
                            type: 'group',
                            attr: renderAttr.length > 0 ? (' ' + renderAttr.join(' ')) : '',
                            options: groupOptions,
                        });

                    } else {
                        selectOptions.push(that._renderOption(option));
                    }
                }
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(coreuiFormTpl['fields/select.html'], {
            field: options,
            value: this._value,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                options: selectOptions
            },
        });
    },


    /**
     *
     * @return {string}
     * @private
     */
    _renderContentReadonly: function () {

        let that            = this;
        let options         = this.getOptions();
        let selectedOptions = [];

        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            $.each(options.options, function (key, option) {
                let type = option.hasOwnProperty('type') && typeof option.type === 'string'
                    ? option.type
                    : 'option';

                if (type === 'group') {
                    if (Array.isArray(option.options)) {
                        $.each(option.options, function (key, groupOption) {
                            let optionText = groupOption.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(groupOption.text)) >= 0
                                ? groupOption.text
                                : '';

                            if ( ! optionText || optionText === '') {
                                return;
                            }

                            if (Array.isArray(that._value)) {
                                $.each(that._value, function (key, itemValue) {
                                    if (itemValue == groupOption.value) {
                                        selectedOptions.push(optionText);
                                        return false;
                                    }
                                });

                            } else if (that._value == groupOption.value) {
                                selectedOptions.push(optionText);
                            }
                        });
                    }

                } else {
                    let optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                        ? option.text
                        : '';

                    if ( ! optionText || optionText === '') {
                        return;
                    }

                    if (Array.isArray(that._value)) {
                        $.each(that._value, function (key, itemValue) {
                            if (itemValue == option.value) {
                                selectedOptions.push(optionText);
                                return false;
                            }
                        });

                    } else if (that._value == option.value) {
                        selectedOptions.push(optionText);
                    }
                }
            });
        }


        return ejs.render(coreuiFormTpl['fields/select.html'], {
            field: options,
            render: {
                selectedOptions: selectedOptions
            },
        });
    },


    /**
     * Сборка опции
     * @param option
     * @return {object}
     * @private
     */
    _renderOption: function (option) {

        let optionAttr = [];
        let optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
            ? option.text
            : '';

        $.each(option, function (name, value) {
            if (name !== 'text') {
                optionAttr.push(name + '="' + value + '"');
            }
        });


        if (Array.isArray(this._value)) {
            $.each(this._value, function (key, itemValue) {
                if (itemValue == option.value) {
                    optionAttr.push('selected="selected"');
                    return false;
                }
            });

        } else if (this._value == option.value) {
            optionAttr.push('selected="selected"');
        }

        return {
            type: 'option',
            text: optionText,
            attr: optionAttr.length > 0 ? (' ' + optionAttr.join(' ')) : ''
        };
    }
}