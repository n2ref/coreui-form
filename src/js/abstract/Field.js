import coreuiFormUtils from "../coreui.form.utils";
import coreuiForm      from "../coreui.form";
import coreuiFormTpl from "../coreui.form.templates";



class Field {

    _id      = null;
    _form    = null;
    _index   = 0;
    _hash    = '';
    _value   = null;
    _options = {
        type: '',
        name: null,
        noSend: null,
        required: null,
        show: true,
        position: null,
        readonly: null,
    };


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils.hashCode();
        this._value   = coreuiFormUtils.getFieldValue(form, options);
        this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    }


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions() {
        return $.extend(true, {}, this._options);
    }


    /**
     * Показ поля
     * @param {int} duration
     */
    show(duration) {

        $('#coreui-form-' + this._id)
            .addClass('d-flex')
            .removeClass('d-none')
            .css('opacity', 0)
            .animate({
                opacity: 1,
            }, duration || 200, function () {
                $(this).css('opacity', '');
            });
    }


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide(duration) {

        $('#coreui-form-' + this._id).animate({
            opacity: 0,
        }, duration || 200, function () {
            $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
        });
    }


    /**
     * Изменение режима поля только для чтения
     * @param {boolean} isReadonly
     */
    readonly(isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
                this.renderContent()
        );
    }


    /**
     * Получение значения из поля
     * @returns {*}
     */
    getValue() {
        return null;
    }


    /**
     * Установка значения в поле
     * @param {*} value
     */
    setValue(value) {}


    /**
     * Установка валидности поля
     * @param {boolean|null} isValid
     * @param {text}         text
     */
    validate(isValid, text) {}


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid() {
        return null;
    }


    /**
     * Проверка на то, что поле можно отправлять
     * @return {boolean}
     */
    isAlloySend() {
        return ! this._options.noSend;
    }


    /**
     * Формирование поля
     * @returns {string|HTMLElement|jQuery}
     */
    render() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils.getAttacheFields(this._form, options);

        return ejs.render(coreuiFormTpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields,
        });
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {
        return '';
    }
}

coreuiForm.abstract.field = Field;

export default Field;