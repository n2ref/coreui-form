
import FormTpl from "../form.tpl";
import Field         from "../abstract/Field";
import FormUtils from "../form.utils";


class FieldHidden extends Field {

    /**
     * Инициализация
     * @param {FormInstance} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'hidden',
            name: null,
            attr: {},
            required: null
        }, options);

        super(form, options);
    }


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue() {

        return this._readonly
            ? this._value
            : $('#coreui-form-' + this.getId()).val();
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

        if ( ! this._readonly) {
            $('#coreui-form-' + this.getId()).val(value);
        }
    }


    /**
     * Формирование поля
     * @returns {string}
     */
    render() {

        return this.renderContent();
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


        options.attr.id = 'coreui-form-' + this.getId();

        if (options.name) {
            options.attr.name = options.name;
        }

        options.attr.type  = 'hidden';
        options.attr.value = this._value !== null ? this._value : '';


        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return FormUtils.render(FormTpl['fields/hidden.html'], {
            readonly: this._readonly,
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
        });
    }
}

export default FieldHidden;