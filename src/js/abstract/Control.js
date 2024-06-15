
import coreuiFormUtils from "../coreui.form.utils";


class Control {

    _id      = null;
    _form    = null;
    _options = {
        type: '',
        id: ''
    };


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     */
    constructor(form, options) {

        this._form    = form;
        this._id      = options.id || '';
        this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    }


    /**
     * Получение id поля
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
        return $.extend(true, {}, this._options);
    }


    /**
     * Показ контрола
     * @param {int} duration
     */
    show(duration) {
        $('#coreui-form-' + this.getId()).show(duration || 0)
    }


    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide(duration) {
        $('#coreui-form-' + this.getId()).hide(duration || 0)
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    render() {
        return null;
    }
}

export default Control;