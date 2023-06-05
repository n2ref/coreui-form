
CoreUI.form.controls.link = {

    _form: null,
    _index: null,
    _options: {
        type: 'link',
        href: null,
        content: null,
        onClick: null,
        attr: {
            class: 'btn btn-sm btn-link'
        }
    },


    /**
     * Инициализация
     * @param {CoreUI.form.instance} form
     * @param {object} options
     * @param {int} index
     */
    init: function (form, options, index) {

        this._options = $.extend({}, this._options, options);
        this._form    = form;
        this._index   = index;
        let that      = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
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
     * Показ контрола
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).show(duration || 0)
    },


    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).hide(duration || 0)
    },


    /**
     *
     */
    lock: function () {

        let button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');

        if ( ! button.find('.spinner-border')[0]) {
            button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
        }
        if ( ! button.attr('disabled')) {
            button.attr('disabled', 'disabled');
        }
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        let attributes = [];
        let options    = this.getOptions();

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return CoreUI.form.ejs.render(CoreUI.form.tpl['controls/link.html'], {
            control: this._options,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            },
        });
    },


    /**
     * Инициализация событий связанных с элементом управления
     */
    _initEvents: function () {

        let that = this;

        if (['function', 'string'].indexOf(typeof this._options.onClick) >= 0) {
            $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > a')
                .click(function (event) {

                    if (typeof that._options.onClick === 'function') {
                        that._options.onClick(that._form, event);
                    } else {
                        let callback = CoreUI.form.utils.getFunctionByName(that._options.onClick);

                        if (typeof callback === 'function') {
                            callback(that._form, event);
                        } else {
                            eval(that._options.onClick);
                        }
                    }
                });
        }
    }
}