
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import FieldRadio      from "../fields/radio";


class FieldRadioBtn extends FieldRadio {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'radioBtn',
            name: null,
            label: null,
            labelWidth: null,
            optionsClass: 'btn btn-outline-secondary',
            inline: false,
            prefix: null,
            suffix: null,
            description: null,
            errorText: null,
            options: [],
            fields: [],
            required: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null,
        }, options);

        super(form, options);
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let that         = this;
        let radioOptions = [];
        let fieldOptions = this.getOptions();
        let selectedItem = [];

        if (fieldOptions.hasOwnProperty('options') &&
            typeof fieldOptions.options === 'object' &&
            Array.isArray(fieldOptions.options)
        ) {
            $.each(fieldOptions.options, function (key, option) {
                let attributes = [];
                let itemAttr = {
                    type: 'radio',
                    class: 'btn-check',
                    autocomplete: 'off',
                };

                let optionText   = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                    ? option.text
                    : '';

                if (fieldOptions.name) {
                    itemAttr.name = that._options.name;
                }

                if (fieldOptions.required) {
                    itemAttr.required = 'required';
                }

                $.each(option, function (name, value) {
                    if (name !== 'text') {
                        if (name === 'class') {
                            itemAttr[name] = itemAttr[name] + ' ' + value;
                        } else {
                            itemAttr[name] = value;
                        }
                    }
                });

                itemAttr.id = coreuiFormUtils.hashCode();

                if (that._value == option.value) {
                    if (option.hasOwnProperty('text') && option.text) {
                        selectedItem.push(option.text);
                    }
                    itemAttr.checked = 'checked';
                }

                $.each(itemAttr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                });


                radioOptions.push({
                    id: itemAttr.id,
                    text: optionText,
                    attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
                })
            });
        }

        return coreuiFormUtils.render(coreuiFormTpl['fields/radio-btn.html'], {
            readonly: this._readonly,
            inline: fieldOptions.inline,
            optionsClass: fieldOptions.optionsClass,
            value: this._value,
            options: radioOptions,
            selectedItem: selectedItem,
        });
    }
}


export default FieldRadioBtn;