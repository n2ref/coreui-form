
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldNumber extends Field {


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'number',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
            attr: {
                class: 'form-control d-inline-block',
                step: 'any'
            },
            required: null,
            readonly: null,
            datalist: null,
            show: true,
            position: null,
            precision: null,
            noSend: null,
        }, options);

        super(form, options);

        // Установка точности
        if (this._options.precision === null) {
            let precision = 0;
            if (this._options.attr.hasOwnProperty('step') &&
                this._options.attr.step !== 'any' &&
                ['string', 'number'].indexOf(typeof this._options.attr.step) >= 0
            ) {
                let match = $.trim(this._options.attr.step.toString()).match(/\.(\d+)$/);

                if (match && match.hasOwnProperty(1)) {
                    precision = match ? match[1].length : precision;
                }
            }

            this._options.precision = precision
        }


        let that = this;

        form.on('show', function () {
            if ( ! that._readonly) {
                that._initEvents();
            }
        });
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
     * @returns {string}
     */
    getValue() {

        return this._readonly
            ? this._value
            : $('.content-' + this.getContentId() + ' input').val();
    }


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue(value) {

        if (['string', 'number'].indexOf(typeof value) < 0 ||
            ! value.toString().match(/^\-?\d+\.?\d*$/)
        ) {
            return;
        }

        if (this._options.precision >= 0) {
            value = coreuiFormUtils.round(value, this._options.precision);
        }

        if (this._options.attr.hasOwnProperty('min')) {
            value = value < Number(this._options.attr.min)
                ? Number(this._options.attr.min)
                : value;
        }

        if (this._options.attr.hasOwnProperty('max')) {
            value = value > Number(this._options.attr.max)
                ? Number(this._options.attr.max)
                : value;
        }

        this._value = value;

        if (this._readonly) {
            $('.content-' + this.getContentId()).text(value);
        } else {
            $('.content-' + this.getContentId() + ' input').val(value);
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
     * @return {boolean}
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

        let attributes = [];
        let datalist   = [];
        let options    = this.getOptions();
        let datalistId = coreuiFormUtils.hashCode();


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

        options.attr.type  = 'number';
        options.attr.value = this._value !== null ? this._value : '';

        if (options.width) {
            options.attr = coreuiFormUtils.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                })
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });


        return coreuiFormUtils.render(coreuiFormTpl['fields/input.html'], {
            readonly: this._readonly,
            value: this._value !== null ? this._value : '',
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            datalistId: datalistId,
            datalist: datalist
        });
    }


    /**
     * Инициализация событий
     * @private
     */
    _initEvents() {

        let contentId = this.getContentId();

        $('.content-' + contentId + ' input').keydown(function (e) {
            let k = e.keyCode || e.which;
            let ok = k >= 35 && k <= 40 ||      // arrows
                k >= 96 && k <= 105 ||     // 0-9 numpad
                k === 189 || k === 109 ||  // minus
                k === 110 || k === 190 ||  // dot
                k === 9 ||  //tab
                k === 46 || //del
                k === 8 ||  // backspaces
                ( ! e.shiftKey && k >= 48 && k <= 57); // only 0-9 (ignore SHIFT options)

            if ( ! ok || (e.ctrlKey && e.altKey)) {
                e.preventDefault();
            }
        });

        let that = this;

        $('.content-' + contentId + ' input').blur(function (e) {
            let value = $(this).val();

            if (that._options.precision >= 0) {
                value = coreuiFormUtils.round(value, that._options.precision);
            }

            if (that._options.attr.hasOwnProperty('min')) {
                value = value < Number(that._options.attr.min)
                    ? Number(that._options.attr.min)
                    : value;
            }

            if (that._options.attr.hasOwnProperty('max')) {
                value = value > Number(that._options.attr.max)
                    ? Number(that._options.attr.max)
                    : value;
            }

            $(this).val(value);
        });
    }
}

export default FieldNumber;