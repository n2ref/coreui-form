
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";


coreuiForm.fields.custom = {

    _id: '',
    _hash: '',
    _form: null,
    _value: null,
    _options: {
        type: 'custom',
        label: null,
        labelWidth: null,
        width: null,
        content: '',
        outContent: null,
        description: null,
        required: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._value   = coreuiFormUtils.getFieldValue(form, options);
        this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
        this._hash    = coreuiFormUtils.hashCode();
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).animate({
            opacity: 0,
        }, duration || 200, function () {
            $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
        });
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id)
            .addClass('d-flex')
            .removeClass('d-none')
            .css('opacity', 0)
            .animate({
                opacity: 1,
            }, duration || 200, function () {
                $(this).css('opacity', '');
            });
    },


    /**
     * Получение значения из поля
     */
    getValue: function () {

    },


    /**
     * Установка значения в поле
     * @param {object} value
     */
    setValue: function (value) {

    },


    /**
     * Формирование поля
     * @returns {object}
     */
    render: function() {

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
    },


    /**
     * Формирование контента поля
     * @return {Array}
     */
    renderContent: function () {

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