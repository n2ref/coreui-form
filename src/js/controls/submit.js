
import '../../../node_modules/ejs/ejs.min';
import coreuiFormTpl from "../coreui.form.templates";
import coreuiForm    from "../coreui.form";

coreuiForm.controls.submit = {

    _form: null,
    _index: null,
    _options: {
        type: 'submit',
        href: null,
        content: null,
        onClick: null,
        show: true,
        attr: {
            class: 'btn btn-sm btn-primary'
        }
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
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
     *
     */
    unlock: function () {

        let button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');

        button.find('.spinner-border').remove();
        button.removeAttr('disabled');
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        let attributes = [];
        let options    = this.getOptions();

        options.attr.type = 'submit';

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(coreuiFormTpl['controls/button.html'], {
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
            $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button')
                .click(function (event) {

                    if (typeof that._options.onClick === 'function') {
                        that._options.onClick(that._form, event);
                    } else {
                        let callback = coreuiFormUtils.getFunctionByName(that._options.onClick);

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