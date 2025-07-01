

class Field {

    _id        = null;
    _form      = null;
    _contentId = '';
    _readonly  = null;
    _value     = null;

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
     * @param {Form} form
     * @param {object} options
     */
    constructor(form, options) {

        this._form      = form;
        this._id        = options.hasOwnProperty('id') && typeof options.id === 'string' ? options.id : '';
        this._contentId = options.hasOwnProperty('contentId') && typeof options.contentId === 'string' ? options.contentId : '';
        this._readonly  = options.hasOwnProperty('readonly') && typeof options.readonly === 'boolean' ? options.readonly : false;
        this._value     = options.hasOwnProperty('value') && ['string', 'number', 'object'].indexOf(typeof options.value) >= 0 ? options.value : null;
        this._options   = $.extend(true, this._options, options);
    }


    /**
     * Получение id поля
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Получение id контентаполя
     * @return {string}
     */
    getContentId() {
        return this._contentId;
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

        $('#coreui-form-' + this.getId())
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

        $('#coreui-form-' + this.getId())
            .animate({
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

        this._value    = this.getValue();
        this._readonly = !! isReadonly;

        $('.content-' + this._contentId).html(
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
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {
        return '';
    }
}

export default Field;