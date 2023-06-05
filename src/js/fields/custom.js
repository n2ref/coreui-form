
CoreUI.form.fields.custom = {

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
     * @param {CoreUI.form.instance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._value   = CoreUI.form.utils.getFieldValue(form, options);
        this._options = CoreUI.form.utils.mergeFieldOptions(form, this._options, options);
        this._hash    = CoreUI.form.utils.hashCode();
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

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
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
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = CoreUI.form.utils.getAttacheFields(this._form, options);

        return CoreUI.form.ejs.render(CoreUI.form.tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let options         = this.getOptions();
        let content         = '';
        let alloyComponents = [
            'coreui.table',
            'coreui.layout',
            'coreui.panel',
            'coreui.tabs',
            'coreui.alert',
            'coreui.chart',
        ];

        if (typeof options.content === 'string') {
            content = options.content;

        } else if (options.content instanceof Object) {
            if ( ! Array.isArray(options.content)) {
                options.content = [ options.content ];
            }

            let components = [];

            for (let i = 0; i < options.content.length; i++) {
                if (typeof options.content[i] === 'string') {
                    components.push(options.content[i]);

                } else if ( ! Array.isArray(options.content[i]) &&
                        options.content[i].hasOwnProperty('component') &&
                        alloyComponents.indexOf(options.content[i].component) >= 0
                ) {
                    let name = options.content[i].component.split('.')[1];

                    if (CoreUI.hasOwnProperty(name) &&
                        typeof CoreUI[name] === "object" &&
                        CoreUI[name] !== null &&
                        ! Array.isArray(CoreUI[name])
                    ) {
                        let instance = CoreUI[name].create(options.content[i]);
                        components.push(instance.render());

                        this._form.on('shown.coreui.form', instance.initEvents, instance, true);
                    }
                }
            }

            content = components.join('');
        }


        return CoreUI.form.ejs.render(CoreUI.form.tpl['fields/custom.html'], {
            content: content
        });
    }
}