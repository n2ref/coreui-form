
import 'ejs/ejs.min';
import 'jquery-mask-plugin/dist/jquery.mask';
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import coreuiForm      from "../coreui.form";
import FieldInput      from "../fields/input";


class FieldMask extends FieldInput {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

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

        super(form, options, index);

        let that = this;

        form.on('show', function () {
            if ( ! that._options.readonly) {
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

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input').val(value);
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

        return ejs.render(coreuiFormTpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value !== null ? this._value : '',
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    }


    /**
     *
     * @private
     */
    _renderContentReadonly() {

        let options = this.getOptions();

        return ejs.render(coreuiFormTpl['fields/input.html'], {
            field: options,
            value: this._value !== null ? this._value : ''
        });
    }


    /**
     * Инициализация событий
     * @private
     */
    _initEvents () {

        $('#coreui-form-' + this._id + ' .content-' + this._hash + ' input')
            .mask(this._options.mask, this._options.options)
    }
}


coreuiForm.fields.mask = FieldMask;

export default FieldMask;