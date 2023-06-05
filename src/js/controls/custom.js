
CoreUI.form.controls.custom = {

    _form: null,
    _index: null,
    _options: {
        type: 'custom',
        content: null
    },


    /**
     * Инициализация
     * @param {CoreUI.form.instance} form
     * @param {object} options
     * @param {int} index
     */
    init: function (form, options, index) {

        this._options = $.extend({}, this._options, options);
        this._form   = form;
        this._index   = index;
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

        $('#coreui-form-' + form.getId() + '-control-' + this._index).show(duration || 0)
    },


    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + form.getId() + '-control-' + this._index).hide(duration || 0)
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        return this._options.content;
    }
}