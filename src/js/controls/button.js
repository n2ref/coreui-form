
import '../../../node_modules/ejs/ejs.min';
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import coreuiForm      from "../coreui.form";


coreuiForm.controls.button = {

    _form: null,
    _index: null,
    _options: {
        type: 'button',
        href: null,
        content: null,
        onClick: null,
        attr: {
            class: 'btn btn-secondary'
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
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        let attributes = [];
        let options    = this.getOptions();

        options.attr.type = 'button';

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
                        (new Function('form', 'event', that._options.onClick))(that._form, event);
                    }
                });
        }
    }
}