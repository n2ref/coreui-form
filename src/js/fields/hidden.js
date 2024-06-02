
import 'ejs/ejs.min';
import coreuiForm    from "../coreui.form";
import coreuiFormTpl from "../coreui.form.templates";
import Field         from "../abstract/Field";


class FieldHidden extends Field {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'hidden',
            name: null,
            attr: {},
            required: null
        }, options);

        super(form, options, index);
    }


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue() {

        return this._options.readonly
            ? this._value
            : $('#coreui-form-' + this._id).val();
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

        if ( ! this._options.readonly) {
            $('#coreui-form-' + this._id).val(value);
        }
    }


    /**
     * Формирование поля
     * @returns {string}
     */
    render() {

        return ejs.render(coreuiFormTpl['form-field-content.html'], {
            content: this.renderContent(),
        });
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent () {

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

coreuiForm.fields.hidden = FieldHidden;

export default FieldHidden;