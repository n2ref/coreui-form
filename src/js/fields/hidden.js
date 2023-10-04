
import '../../../node_modules/ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";


coreuiForm.fields.hidden = {

    _id: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'hidden',
        name: null,
        attr: {},
        required: null,
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
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('#coreui-form-' + this._id).val();
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

        if ( ! this._options.readonly) {
            $('#coreui-form-' + this._id).val(value);
        }
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        return ejs.render(coreuiFormTpl['form-field-content.html'], {
            content: this.renderContent(),
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let attributes = [];
        let options    = this.getOptions();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }


        options.attr.id = 'coreui-form-' + this._id;

        if (options.name) {
            options.attr.name = options.name;
        }

        options.attr.type  = 'hidden';
        options.attr.value = this._value !== null ? this._value : '';


        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(coreuiFormTpl['fields/hidden.html'], {
            value: this._value !== null ? this._value : '',
            field: options,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            },
        });
    }
}