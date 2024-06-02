
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldCustom extends Field {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'custom',
            label: null,
            labelWidth: null,
            width: null,
            content: '',
            outContent: null,
            description: null,
            required: null,
            show: true
        }, options);

        super(form, options, index);
    }


    /**
     * Изменение режима поля только для чтения
     * @param {boolean} isReadonly
     */
    readonly(isReadonly) {

    }


    /**
     * Формирование поля
     * @returns {object}
     */
    render() {

        let that         = this;
        let options      = this.getOptions();
        let attachFields = coreuiFormUtils.getAttacheFields(this._form, options);

        let field = $(
            ejs.render(coreuiFormTpl['form-field-label.html'], {
                id: this._id,
                form:  this._form,
                hash: this._hash,
                field: options,
                content: '',
                attachFields: attachFields
            })
        );

        $.each(this.renderContent(), function (i, content) {
            field.find(".content-" + that._hash).append(content);
        });

        return field;
    }


    /**
     * Формирование контента поля
     * @return {Array}
     */
    renderContent() {

        let content = this.getOptions().content;
        let result  = [];

        if (typeof content === 'string') {
            result.push(content);

        } else if (content instanceof Object) {
            if ( ! Array.isArray(content)) {
                content = [ content ];
            }

            for (let i = 0; i < content.length; i++) {
                if (typeof content[i] === 'string') {
                    result.push(content[i]);

                } else if ( ! Array.isArray(content[i]) &&
                    content[i].hasOwnProperty('component') &&
                    typeof content[i].component === 'string' &&
                    content[i].component.substring(0, 6) === 'coreui'
                ) {
                    let name = content[i].component.split('.')[1];

                    if (CoreUI.hasOwnProperty(name) &&
                        coreuiFormUtils.isObject(CoreUI[name])
                    ) {
                        let instance = CoreUI[name].create(content[i]);
                        result.push(instance.render());

                        this._form.on('show', instance.initEvents, instance, true);
                    }
                } else {
                    result.push(JSON.stringify(content[i]));
                }
            }
        }

        return result;
    }
}


coreuiForm.fields.custom = FieldCustom;

export default FieldCustom;