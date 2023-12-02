
import '../../../node_modules/ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";


coreuiForm.fields.switch = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
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
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
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
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        let result;

        if (this._options.readonly) {
            result = this._value;
        } else {
            result = $('.content-' + this._hash + ' input').prop('checked')
                ? this._options.valueY
                : this._options.valueN
        }

        return result;
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input[type=checkbox]').prop('checked', value === this._options.valueY);
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
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

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