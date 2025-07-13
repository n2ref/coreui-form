
import 'jquery-mask-plugin/dist/jquery.mask';
import FormTpl   from "../tpl";
import Utils from "../utils";
import FieldInput      from "../fields/input";


class FieldMask extends FieldInput {

    /**
     * Инициализация
     * @param {Form} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'mask',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            prefix     : null,
            suffix     : null,
            description: null,
            errorText  : null,
            fields     : null,
            attr       : {
                class: 'form-control d-inline-block'
            },
            required   : null,
            readonly   : null,
            datalist  : null,
            show       : true,
            position   : null,
            noSend     : null,
            on: null,
        }, options);

        super(form, options);

        let that = this;
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
        let datalistId = Utils.hashCode();

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
            options.attr = Utils.mergeAttr(
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

        let field = Utils.render(FormTpl['fields/input.html'], {
            readonly  : this._readonly,
            value     : this._value !== null ? this._value : '',
            attr      : attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            datalistId: datalistId,
            datalist : datalist,
        });

        $('#coreui-form-' + this.getId() + ' .content-' + this.getContentId() + ' input')
            .mask(this._options.mask, this._options.options)

        if (this._options.on && Utils.isObject(this._options.on)) {
            let input = field.find('input').addBack('input');
            let that  = this;

            for (let [eventName, callback] of Object.entries(this._options.on)) {

                if (typeof eventName === 'string' && typeof callback === 'function') {
                    input.on(eventName, function (event) {
                        callback({ field: that, event: event });
                    })
                }
            }
        }

        return field;
    }


    /**
     *
     * @private
     */
    _renderContentReadonly() {

        return Utils.render(FormTpl['fields/input.html'], {
            readonly: this._readonly,
            value: this._value !== null ? this._value : ''
        });
    }
}


export default FieldMask;