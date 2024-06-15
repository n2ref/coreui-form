
import coreuiFormUtils from "../coreui.form.utils";
import Field           from "../abstract/Field";


class FieldCustom extends Field {

    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

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

        super(form, options);
    }


    /**
     * Изменение режима поля только для чтения
     * @param {boolean} isReadonly
     */
    readonly(isReadonly) {
        this._readonly = !! isReadonly;
    }


    /**
     * Получение значения из поля
     * @returns {*}
     */
    getValue() {

        if (this._readonly) {
            return this._value;

        } else {
            let value  = null;
            let inputs = $('.content-' + this.getContentId() + ' input,select,textarea');

            if (inputs.length === 1) {
                value = $(inputs).val()

            } else {
                let values = {};
                inputs.each(function () {

                    let name = $(this).attr('name');
                    if (name) {
                        values[name] = $(this).val()
                    }
                });

                if (Object.keys(values).length > 0) {
                    value = values;
                }
            }

            return value;
        }
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


export default FieldCustom;