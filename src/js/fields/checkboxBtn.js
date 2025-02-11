
import FormTpl   from "../form.tpl";
import FormUtils from "../form.utils";
import FieldCheckbox   from "../fields/checkbox";


class FieldCheckboxBtn extends FieldCheckbox {


    /**
     * Инициализация
     * @param {FormInstance} form
     * @param {object} options
     */
    constructor(form, options) {
        options = $.extend(true, {
            type: 'checkboxBtn',
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
            fields: null,
            required: null,
            readonly: null,
            show: true,
        }, options);

        super(form, options);
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        let that            = this;
        let checkboxOptions = [];
        let fieldOptions    = this.getOptions();
        let selectedItems   = [];

        if (fieldOptions.hasOwnProperty('options') &&
            typeof fieldOptions.options === 'object' &&
            Array.isArray(fieldOptions.options)
        ) {
            $.each(fieldOptions.options, function (key, option) {
                let attributes = [];
                let itemAttr = {
                    type: 'checkbox',
                    class: 'btn-check',
                    autocomplete: 'off',
                };
                let optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
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

                itemAttr.id = FormUtils.hashCode();

                if (typeof(that._value) === 'object' &&
                    Array.isArray(that._value)
                ) {
                    $.each(that._value, function (key, itemValue) {
                        if (itemValue == option.value) {
                            itemAttr.checked = 'checked';
                            if (option.hasOwnProperty('text') && option.text) {
                                selectedItems.push(option.text);
                            }
                            return false;
                        }
                    });

                } else if (that._value == option.value) {
                    if (option.hasOwnProperty('text') && option.text) {
                        selectedItems.push(option.text);
                    }
                    itemAttr.checked = 'checked';
                }

                $.each(itemAttr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                });


                checkboxOptions.push({
                    id: itemAttr.id,
                    text: optionText,
                    attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
                })
            });
        }

        let value = typeof this._value === 'object' && Array.isArray(this._value)
            ? this._value.join(', ')
            : this._value

        return FormUtils.render(FormTpl['fields/checkbox-btn.html'], {
            readonly: this._readonly,
            field: fieldOptions,
            value: value,
            options: checkboxOptions,
            selectedItems: selectedItems
        });
    }
}

export default FieldCheckboxBtn;