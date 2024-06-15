
import 'jquery-mask-plugin/dist/jquery.mask';
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import FieldInput      from "../fields/input";


class FieldMask extends FieldInput {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'mask',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
            attr: {
                class: 'form-control d-inline-block'
            },
            required: null,
            readonly: null,
            datalist: null,
            show: true,
            position: null,
            noSend: null,
        }, options);

        super(form, options);

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
     * Установка значения в поле
     * @param {string} value
     */
    setValue(value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        value = value.replace(/[^\d\w]/g, '');

        this._value = value;

        if (this._readonly) {
            $('.content-' + this.getContentId()).text(value);
        } else {
            $('.content-' + this.getContentId() + ' input').val(value);
        }
    }


    /**
     *
     * @return {*}
     * @private
     */
    _renderContent() {

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

        options.attr.type  = 'text';
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
            datalist: datalist,
        });
    }


    /**
     *
     * @private
     */
    _renderContentReadonly() {

        let options = this.getOptions();

        return coreuiFormUtils.render(coreuiFormTpl['fields/input.html'], {
            readonly: this._readonly,
            value: this._value !== null ? this._value : ''
        });
    }


    /**
     * Инициализация событий
     * @private
     */
    _initEvents () {

        $('#coreui-form-' + this.getId() + ' .content-' + this.getContentId() + ' input')
            .mask(this._options.mask, this._options.options)
    }
}


export default FieldMask;