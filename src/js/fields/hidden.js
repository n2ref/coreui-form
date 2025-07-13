
import FormTpl from "../tpl";
import Field         from "../abstract/Field";
import Utils from "../utils";


class FieldHidden extends Field {

    /**
     * Инициализация
     * @param {Form} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'hidden',
            name: null,
            attr: {},
            required: null,
            on: null,
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

        let field = $(
            Utils.render(FormTpl['fields/hidden.html'], {
                readonly: this._readonly,
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
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

        return field;
    }
}

export default FieldHidden;