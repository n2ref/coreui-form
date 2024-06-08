
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldDataset extends Field {

    _renderOptions = [];


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'dataset',
            name: null,
            label: null,
            labelWidth: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
            required: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null
        }, options);

        super(form, options, index);

        let that = this;

        form.on('show', function () {
            if ( ! that._options.readonly) {
                that._initEvents();
            }
        });

        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            $.each(options.options, function (key, option) {
                let name = option.hasOwnProperty('name') && ['string', 'number'].indexOf(typeof option.name) >= 0
                    ? option.name
                    : '';
                let type = option.hasOwnProperty('type') && typeof option.type === 'string'
                    ? option.type
                    : 'text';
                let attributes = option.hasOwnProperty('attr') && typeof option.attr === 'object' && ! Array.isArray(option.attr)
                    ? option.attr
                    : {};
                let items = option.hasOwnProperty('items') && typeof option.items === 'object' && Array.isArray(option.items)
                    ? option.items
                    : [];
                let valueY = option.hasOwnProperty('valueY') && ['string', 'number'].indexOf(typeof option.valueY) >= 0
                    ? option.valueY
                    : 'Y';
                let valueN = option.hasOwnProperty('valueN') && ['string', 'number'].indexOf(typeof option.valueN) >= 0
                    ? option.valueN
                    : 'N';
                let width = option.hasOwnProperty('width') && ['string', 'number'].indexOf(typeof option.width) >= 0
                    ? option.width
                    : null;

                if (name) {
                    attributes.name = name;
                }
                if (options.required) {
                    attributes.required = 'required';
                }

                if (type === 'select') {
                    attributes.class = attributes.hasOwnProperty('class')
                        ? 'form-select ' + attributes.class
                        : 'form-select';

                } else if (type === 'switch') {
                    attributes.class = attributes.hasOwnProperty('class')
                        ? 'form-check-input ' + attributes.class
                        : 'form-check-input';

                    attributes.type = 'checkbox';
                    attributes.value = valueY;

                } else {
                    attributes.class = attributes.hasOwnProperty('class')
                        ? 'form-control ' + attributes.class
                        : 'form-control';

                    attributes.type = type;
                }


                that._renderOptions.push({
                    type  : type,
                    name  : name,
                    attr  : attributes,
                    items : items,
                    valueY: valueY,
                    valueN: valueN,
                    width:  width,
                });
            });
        }
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
     * @returns {array}
     */
    getValue () {

        if (this._options.readonly) {
            return this._value;

        } else {
            let container = $('.content-' + this._hash);
            let data      = [];

            $('.coreui-form__field-dataset-list .coreui-form__field-dataset-item', container).each(function () {
                let items = {};

                $.each($(this).find('input, select').serializeArray(), function (key, item) {
                    if (item.name) {
                        items[item.name] = item.value;
                    }
                });

                data.push(items);
            })

            return data;
        }
    }


    /**
     * Установка значения в поле
     * @param {object} value
     */
    setValue(value) {

        if ( ! coreuiFormUtils.isObject(value)) {
            return;
        }

        this._value.push(value);

        if (this._options.readonly) {
            $('.content-' + this._hash + ' .coreui-form__field-dataset-list').append(
                this._renderRowReadonly(value)
            );
        } else {
            this._eventAdd(value);
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

        container.find('.text-success').remove();
        container.find('.text-danger').remove();

        if (isValid === null) {
            return;
        }

        if (isValid) {
            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-success">' + text + '</div>');
            }

        } else {
            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-danger">' + text + '</div>');
            }
        }
    }


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid() {

        if (this._options.required && ! this._options.readonly) {
            return this.getValue().length > 0;
        }

        return true;
    }


    /**
     * Удаление всех строк
     */
    removeItems() {

        $('#coreui-form-' + this._id + ' .content-' + this._hash + ' .coreui-form__field-dataset-list').empty();
    }


    /**
     * Удаление строки по id
     * @param {int} itemId
     */
    removeItem(itemId) {

        let element = '#coreui-form-' + this._id + ' .content-' + this._hash;

        $('#' + itemId).hide('fast', function () {
            $('#' + itemId).remove();

            if ($(element + ' .coreui-form__field-dataset-item').length === 0) {
                $(element + ' .coreui-form__field-dataset-container').hide();
            }
        });
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    _renderContent() {

        let options = this.getOptions();
        let rows    = [];
        let headers = [];
        let that    = this;


        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            // Заголовок
            $.each(options.options, function (key, option) {
                let title = option.hasOwnProperty('title') && ['string', 'number'].indexOf(typeof(option.title)) >= 0
                    ? option.title
                    : '';

                headers.push({
                    title: title
                });
            });

            // Строки
            if (typeof this._value === 'object' && Array.isArray(this._value)) {
                $.each(this._value, function (key, row) {
                    if (typeof row !== 'object' || Array.isArray(row)) {
                        return;
                    }

                    rows.push(that._renderRow(row));
                });
            }
        }

        return ejs.render(coreuiFormTpl['fields/dataset.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            lang: this._form.getLang(),
            render: {
                headers: headers,
                rows: rows,
            },
        });
    }


    /**
     *
     * @private
     */
    _renderContentReadonly () {

        let options = this.getOptions();
        let rows    = [];
        let headers = [];
        let that    = this;


        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            // Заголовок
            $.each(options.options, function (key, option) {
                let title = option.hasOwnProperty('title') && ['string', 'number'].indexOf(typeof(option.title)) >= 0
                    ? option.title
                    : '';

                headers.push({
                    title: title
                });
            });

            // Строки
            if (typeof this._value === 'object' && Array.isArray(this._value)) {
                $.each(this._value, function (key, row) {
                    if (typeof row !== 'object' || Array.isArray(row)) {
                        return;
                    }

                    rows.push(that._renderRowReadonly(row));
                });
            }
        }

        return ejs.render(coreuiFormTpl['fields/dataset.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            lang: this._form.getLang(),
            render: {
                headers: headers,
                rows: rows,
            },
        });
    }


    /**
     * Инициализация событий
     * @private
     */
    _initEvents() {

        let that    = this;
        let element = '#coreui-form-' + this._id + ' .content-' + this._hash;

        // Кнопка удаления
        $(element + ' .btn-dataset-remove').click(function () {
            that.removeItem($(this).data('item-id'));
        });

        // Кнопка добавления
        $(element + ' .btn-dataset-add').click(function () {
            that._eventAdd();
        });
    }


    /**
     * Событие добавления
     */
    _eventAdd(row) {

        let that    = this;
        let element = '#coreui-form-' + this._id + ' .content-' + this._hash;
        row = row || {};

        if ($(element + ' .coreui-form__field-dataset-item').length === 0) {
            $(element + ' .coreui-form__field-dataset-container').show();
        }

        $(element + ' .coreui-form__field-dataset-list').append(this._renderRow(row));
        $(element + ' .coreui-form__field-dataset-item:last-child .btn-dataset-remove').click(function () {
            that.removeItem($(this).data('item-id'))
        });
    }


    /**
     * Формирование строки
     * @param {object} row
     * @private
     */
    _renderRow(row) {

        let rowOptions  = [];
        let itemOptions = [];

        $.each(this._renderOptions, function (key, option) {

            let cellValue = row.hasOwnProperty(option.name) ? row[option.name] : '';

            if (option.type === 'select') {
                $.each(option.items, function (key, item) {
                    let text = item.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof item.text) >= 0
                        ? item.text
                        : '';
                    let itemValue = item.hasOwnProperty('value') && ['string', 'number'].indexOf(typeof item.value) >= 0
                        ? item.value
                        : '';
                    let itemAttr = {};


                    $.each(item, function (name, value) {
                        if (name !== 'text') {
                            itemAttr[name] = value;
                        }
                    });


                    if (typeof(cellValue) === 'object' && Array.isArray(cellValue)) {
                        $.each(cellValue, function (key, cellItemValue) {
                            if (cellItemValue == itemValue) {
                                itemAttr.selected = 'selected';
                                return false;
                            }
                        });

                    } else if (cellValue == item.value) {
                        itemAttr.selected = 'selected';
                    }

                    let attributes = [];
                    $.each(itemAttr, function (name, value) {
                        attributes.push(name + '="' + value + '"');
                    });

                    itemOptions.push({
                        attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                        text: text
                    })
                });

            } else if (option.type === 'switch') {
                if (cellValue == option.valueY) {
                    option.attr.checked = 'checked';
                }

            } else {
                if (['string', 'number'].indexOf(typeof(cellValue)) >= 0) {
                    option.attr.value = cellValue !== null ? cellValue : '';
                }
            }

            if (option.width > 0 && option.width !== null) {
                let unit     = typeof option.width === 'number' ? 'px' : '';
                let widthVal = option.width + unit;

                option.attr = coreuiFormUtils.mergeAttr(
                    option.attr || {},
                    { style: 'width:' + widthVal }
                );
            }

            let attributes = [];

            $.each(option.attr, function (name, value) {
                attributes.push(name + '="' + value + '"');
            });

            rowOptions.push({
                type: option.type,
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                items: itemOptions
            });
        });

        return ejs.render(coreuiFormTpl['fields/dataset-row.html'], {
            hashItem: coreuiFormUtils.hashCode(),
            options: rowOptions,
        });
    }


    /**
     * Формирование строки
     * @param {object} row
     * @private
     */
    _renderRowReadonly(row) {

        let rowOptions = [];
        let lang       = this._form.getLang();

        $.each(this._renderOptions, function (key, option) {

            let optionValue = '';
            let cellValue   = row.hasOwnProperty(option.name) ? row[option.name] : '';

            if (option.type === 'select') {
                let itemOptions = [];

                $.each(option.items, function (key, item) {
                    let text = item.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof item.text) >= 0
                        ? item.text
                        : '';
                    let itemValue = item.hasOwnProperty('value') && ['string', 'number'].indexOf(typeof item.value) >= 0
                        ? item.value
                        : '';

                    if (Array.isArray(cellValue)) {
                        $.each(cellValue, function (key, cellItemValue) {
                            if (cellItemValue == itemValue) {
                                itemOptions.push(text);
                                return false;
                            }
                        });

                    } else if (cellValue == itemValue) {
                        itemOptions.push(text);
                    }
                });

            } else if (option.type === 'switch') {
                let valueY = 'Y';

                if (option.hasOwnProperty('valueY')) {
                    valueY = option.valueY;
                }

                optionValue = cellValue == valueY
                    ? lang.switch_yes
                    : lang.switch_no;

            } else {
                if (['string', 'number'].indexOf(typeof(cellValue)) >= 0) {
                    optionValue = cellValue;

                    switch (option.type) {
                        case 'date':           optionValue = coreuiFormUtils.formatDate(optionValue); break;
                        case 'datetime-local': optionValue = coreuiFormUtils.formatDateTime(optionValue); break;
                        case 'month':          optionValue = coreuiFormUtils.formatDateMonth(optionValue, lang); break;
                        case 'week':           optionValue = coreuiFormUtils.formatDateWeek(optionValue, lang); break;
                        default: optionValue = cellValue;
                    }
                }
            }

            rowOptions.push({
                value: optionValue
            });
        });

        return ejs.render(coreuiFormTpl['fields/dataset-row-readonly.html'], {
            options: rowOptions,
        });
    }
}

coreuiForm.fields.dataset = FieldDataset;

export default FieldDataset;