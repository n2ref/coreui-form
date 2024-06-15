
import coreuiFormTpl     from "../coreui.form.templates";
import coreuiFormPrivate from "../coreui.form.private";
import coreuiFormUtils   from "../coreui.form.utils";


class FieldGroup {

    _id = '';
    _form = null;

    _options = {
        type: 'group',
        label: '',
        show: true,
        showCollapsible: true,
        fields: [],
        column: null
    };


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

        this._form    = form;
        this._id      = options.id;
        this._options = $.extend(true, {}, this._options, options);

        let that = this;

        form.on('show', function () {
            that._initEvents();
        });
    }


    /**
     * Получение id группы
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions() {
        return $.extend(true, {}, this._options, options);
    }


    /**
     * Скрытие группы
     * @param {int} duration
     */
    collapse(duration) {

        let container = '#coreui-form-' + this._id;

        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-down');
        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-right');

        $(container + ' .coreui-form__group_content').slideUp(duration);
    }


    /**
     * Показ группы
     * @param {int} duration
     */
    expand(duration) {

        let container = '#coreui-form-' + this._id;

        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-right');
        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-down');

        $(container + ' .coreui-form__group_content').slideDown(duration);
    }


    /**
     * Формирование контента поля
     * @return {Array}
     */
    renderContent() {

        let fields = [];
        let that   = this;

        $.each(this._options.fields, function (key, field) {

            let fieldInstance = coreuiFormPrivate.initField(that._form, field);

            if (typeof fieldInstance !== 'object') {
                return;
            }

            fields.push(coreuiFormPrivate.renderField(that._form, fieldInstance));
        });

        return fields;
    }



    /**
     * Инициализация событий
     * @private
     */
    _initEvents() {

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


export default FieldGroup;