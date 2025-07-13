
import FormTpl   from "../tpl";
import Utils from "../utils";
import Field           from "../abstract/Field";


class FieldSelect extends Field {

    _selectOptions = [];

    /**
     * Инициализация
     * @param {Form} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'select',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            prefix: null,
            suffix: null,
            description: null,
            errorText: null,
            fields: null,
            attr: {
                class: 'form-select d-inline-block'
            },
            required: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null,
            on: null,
        }, options);

        let selectOptions = [];

        if (options.hasOwnProperty('options') &&
            (Array.isArray(options.options) || Utils.isObject(options.options))
        ) {
            selectOptions   = options.options;
            options.options = [];
        }

        super(form, options);

        this._selectOptions = selectOptions
    }


    /**
     * Получение значения из поля
     * @returns {array|string}
     */
    getValue() {

        if (this._readonly) {
            return this._value;

        } else {
            if (this._options.hasOwnProperty('attr') &&
                typeof this._options.attr === 'object' &&
                this._options.attr !== null &&
                ! Array.isArray(this._options.attr) &&
                this._options.attr.hasOwnProperty('multiple')
            ) {
                let values = [];

                $('.content-' + this.getContentId() + ' select option:selected').each(function () {
                    values.push($(this).val());
                });

                return values;

            } else {
                return $('.content-' + this.getContentId() + ' select option:selected').val()
            }
        }
    }


    /**
     * Установка значения в поле
     * @param {string} value
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

            if (Array.isArray(this._selectOptions) &&
                Array.isArray(value)
            ) {
                let selectedItems = [];

                $.each(this._selectOptions, function (key, option) {

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
            $('.content-' + contentId + ' select > option').prop('selected', false);

            if (Array.isArray(value)) {
                $('.content-' + contentId + ' select > option').each(function (key, itemValue) {
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
    }


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid() {

        let select = $('.content-' + this.getContentId() + ' select');

        if (this._options.required && select.val() === '') {
            return false;
        }

        if (select[0]) {
            return select.is(':valid');
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
     * Формирование контента
     * @return {*}
     * @private
     */
    _renderContent() {

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
            options.attr = Utils.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }


        $.each(this._selectOptions, function (key, option) {

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

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        let field = $(
            Utils.render(FormTpl['fields/select.html'], {
                readonly: false,
                options: selectOptions,
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            })
        );


        if (this._options.on && Utils.isObject(this._options.on)) {
            let input = field.find('select').addBack('select');
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


    /**
     *
     * @return {string}
     * @private
     */
    _renderContentReadonly() {

        let that            = this;
        let selectedOptions = [];

        $.each(this._selectOptions, function (key, option) {
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


        return Utils.render(FormTpl['fields/select.html'], {
            readonly: true,
            readonlyOptions: selectedOptions
        });
    }


    /**
     * Сборка опции
     * @param option
     * @return {object}
     * @private
     */
    _renderOption(option) {

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


export default FieldSelect;