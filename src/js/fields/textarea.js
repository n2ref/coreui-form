
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldTextarea extends Field {


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'textarea',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            height: null,
            prefix: null,
            suffix: null,
            description: null,
            errorText: null,
            fields: null,
            attr: {
                class: 'form-control d-inline-block'
            },
            required: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null,
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
            : $('.content-' + this.getContentId() + ' textarea').val();
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

        if (this._readonly) {
            $('.content-' + this.getContentId()).text(value);
        } else {
            $('.content-' + this.getContentId() + ' textarea').val(value);
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
        let textarea  = $('textarea', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            textarea.removeClass('is-invalid');
            textarea.removeClass('is-valid');

        } else if (isValid) {
            textarea.removeClass('is-invalid');
            textarea.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            textarea.removeClass('is-valid');
            textarea.addClass('is-invalid');

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
     * @return {boolean}
     */
    isValid() {

        let input = $('.content-' + this.getContentId() + ' textarea');

        if (input[0]) {
            return input.is(':valid');
        }
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let attributes = [];
        let options    = this.getOptions();

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
            let unit = coreuiFormUtils.isNumeric(options.width) ? 'px' : '';
            options.attr = coreuiFormUtils.mergeAttr(
                options.attr,
                { style: 'width:' + options.width + unit }
            );
        }

        if (options.height) {
            let unit = coreuiFormUtils.isNumeric(options.height) ? 'px' : '';
            options.attr = coreuiFormUtils.mergeAttr(
                options.attr,
                { style: 'height:' + options.height + unit }
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return coreuiFormUtils.render(coreuiFormTpl['fields/textarea.html'], {
            readonly: this._readonly,
            value: this._value !== null ? this._value : '',
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
        });
    }
}


export default FieldTextarea;