import Control from "../abstract/Control";


class ControlCustom extends Control {

    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'custom',
            content: null
        }, options);

        super(form, options);
    }


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render() {

        return this._options.content;
    }
}

export default ControlCustom;