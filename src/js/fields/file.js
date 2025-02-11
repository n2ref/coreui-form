
import FormTpl   from "../form.tpl";
import FormUtils from "../form.utils";
import Field           from "../abstract/Field";


class FieldFile extends Field {

    /**
     * Инициализация
     * @param {FormInstance} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'file',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            prefix: null,
            suffix: null,
            description: null,
            errorText: null,
            field: null,
            attr: {
                class: 'form-control d-inline-block'
            },
            required: null,
            invalidText: null,
            validText: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null
        }, options);

        super(form, options);
    }


    /**
     * Получение значения в поле
     * @returns {File[]}
     */
    getValue () {

        return this._readonly
            ? this._value
            : $('.content-' + this.getContentId() + ' input')[0].files;
    }


    /**
     * Установка значения в поле
     * @param {File|File[]} value
     */
    setValue (value) {

        if ( ! (value instanceof File) && ! (value instanceof FileList)) {
            return;
        }

        this._value = value;


        if (this._readonly) {
            $('.content-' + this.getContentId()).text('');
        } else {
            let container = new DataTransfer();

            if (value instanceof File) {
                container.items.add(value);

            } else {
                $.each(value, function (key, file) {
                    if (value instanceof File) {
                        container.items.add(file);
                    }
                });
            }

            $('.content-' + this.getContentId() + ' input')[0].files = container.files;
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
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

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

        let input = $('.content-' + this.getContentId() + ' input');

        if (input[0]) {
            return input.is(':valid');
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
     *
     * @private
     */
    _renderContent() {

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

        options.attr.type  = options.type;
        options.attr.value = this._value !== null ? this._value : '';

        if (options.width) {
            options.attr = FormUtils.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }



        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return FormUtils.render(FormTpl['fields/input.html'], {
            readonly: this._readonly,
            value: this._value !== null ? this._value : '',
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            datalistId: '',
            datalist: []
        });
    }


    /**
     *
     * @private
     */
    _renderContentReadonly() {

        let options = this.getOptions();
        let type    = 'text';
        let value   = this._value;
        let lang    = this._form.getLang();

        if (options.hasOwnProperty('type') && typeof options.type === 'string') {
            type = options.type;
        }

        try {
            switch (type) {
                case 'date':           value = FormUtils.formatDate(value); break;
                case 'datetime-local': value = FormUtils.formatDateTime(value); break;
                case 'month':          value = FormUtils.formatDateMonth(value, lang); break;
                case 'week':           value = FormUtils.formatDateWeek(value, lang); break;
            }

        } catch (e) {
            console.error(e);
            // ignore
        }

        return FormUtils.render(FormTpl['fields/input.html'], {
            readonly: this._readonly,
            value: value,
        });
    }
}

export default FieldFile;