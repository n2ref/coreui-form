
import 'ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import FieldInput      from "../fields/input";


class FieldColor extends FieldInput {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'color',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
            attr: {
                class: 'form-control form-control-color d-inline-block'
            },
            required: null,
            readonly: null,
            datalist: null,
            show: true,
            position: null,
            noSend: null,
        }, options);

        super(form, options, index);
    }


    /**
     *
     * @return {*}
     * @private
     */
    _renderContent() {

        let attributes   = [];
        let datalist     = [];
        let options      = this.getOptions();
        let datalistId   = coreuiFormUtils.hashCode();

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
        options.attr.value = this._value;

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

        return ejs.render(coreuiFormTpl['fields/color.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist,
            },
        });
    }


    /**
     *
     * @return {*}
     * @private
     */
    _renderContentReadonly () {

        let options = this.getOptions();

        return ejs.render(coreuiFormTpl['fields/color.html'], {
            field: options,
            value: this._value
        });
    }
}

coreuiForm.fields.color = FieldColor;

export default FieldColor;