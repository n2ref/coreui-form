
import 'ejs/ejs.min';
import coreuiForm        from "../coreui.form";
import coreuiFormTpl     from "../coreui.form.templates";
import coreuiFormPrivate from "../coreui.form.private";


coreuiForm.fields.group = {

    _id: '',
    _form: null,
    _index: 0,
    _options: {
        type: 'group',
        label: '',
        show: true,
        showCollapsible: true,
        fields: [],
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
        this._index   = index;
        this._id      = form.getId() + "-group-" + index;
        this._options = $.extend(true, {}, this._options, options);

        let that = this;

        form.on('show', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options, options);
    },


    /**
     * Скрытие группы
     * @param {int} duration
     */
    collapse: function (duration) {

        let container = '#coreui-form-' + this._id;

        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-down');
        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-right');

        $(container + ' .coreui-form__group_content').slideUp(duration);
    },


    /**
     * Показ группы
     * @param {int} duration
     */
    expand: function (duration) {

        let container = '#coreui-form-' + this._id;

        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-right');
        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-down');

        $(container + ' .coreui-form__group_content').slideDown(duration);
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let container = $(
            ejs.render(coreuiFormTpl['form-field-group.html'], {
                id: this._id,
                form:  this._form,
                group: this._options,
            })
        );

        let fields       = this.renderContent();
        let groupContent = container.find('.coreui-form__group_content');

        $.each(fields, function (key, field) {
            groupContent.append(field);
        });

        return container;
    },


    /**
     * Формирование контента поля
     * @return {Array}
     */
    renderContent: function () {

        let fields = [];
        let that   = this;

        $.each(this._options.fields, function (key, field) {

            let fieldInstance = coreuiFormPrivate.initField(that._form, field);

            if (typeof fieldInstance !== 'object') {
                return;
            }

            fields.push(fieldInstance.render());
        });

        return fields;
    },



    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        if (this._options.showCollapsible) {
            let that      = this;
            let container = '#coreui-form-' + this._id;

            $(container + ' > .coreui-form__group_label .btn-collapsible').click(function () {

                if ($(container + ' > .coreui-form__group_content').is(':visible')) {
                    that.collapse(80);
                } else {
                    that.expand(80);
                }
            });
        }
    }
}