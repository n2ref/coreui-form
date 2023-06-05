
CoreUI.form.fields.alphanumeric = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'alphanumeric',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-control form-control-sm d-inline-block'
        },
        required: null,
        readonly: null,
        datalist: null,
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
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._value   = CoreUI.form.utils.getFieldValue(form, options);
        this._options = CoreUI.form.utils.mergeFieldOptions(form, this._options, options);
        this._hash    = CoreUI.form.utils.hashCode();
        let that      = this;

        form.on('shown.coreui.form', function () {
            if ( ! that._options.readonly) {
                that._initEvents();
            }
        });
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

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
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
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

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
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
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
            attachFields: attachFields,
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     *
     * @return {*}
     * @private
     */
    _renderContent: function () {

        let attributes = [];
        let datalist   = [];
        let options    = this.getOptions();
        let datalistId = CoreUI.form.utils.hashCode();

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
        options.attr.value = this._value;

        if (options.width) {
            options.attr = CoreUI.form.utils.mergeAttr(
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

        return CoreUI.form.ejs.render(CoreUI.form.tpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    },


    /**
     *
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();

        return CoreUI.form.ejs.render(CoreUI.form.tpl['fields/input.html'], {
            field: options,
            value: this._value
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        $('#coreui-form-' + this._id + ' .content-' + this._hash + ' input').keydown(function (e) {
            let k = e.keyCode || e.which;
            let ok = k >= 65 && k <= 90 || // A-Z
                k >= 96 && k <= 105 || // 0-9
                k >= 35 && k <= 40 || // arrows
                k === 9 || //tab
                k === 46 || //del
                k === 8 || // backspaces
                ( ! e.shiftKey && k >= 48 && k <= 57); // only 0-9 (ignore SHIFT options)

            if ( ! ok || (e.ctrlKey && e.altKey)) {
                e.preventDefault();
            }
        });

        $('#coreui-form-' + this._id + ' .content-' + this._hash + ' input').change(function (e) {
            $(this).val($(this).val().replace(/[^\d\w]/g, ''))
        });
    }
}