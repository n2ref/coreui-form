import HelperControl from "../control";

/**
 *
 */
class HelperControlSubmit extends HelperControl {

    _content = null;
    _onclick = null;
    _attr    = {};


    /**
     * @param {string} content
     */
    constructor(content) {

        super();
        this.setContent(content);
    }


    /**
     * Установка содержимого кнопки
     * @param {string} content
     * @return {HelperControlButton}
     */
    setContent(content) {
        this._content = content;
        return this;
    }


    /**
     * Получение содержимого кнопки
     * @return {string}
     */
    getContent() {
        return this._content;
    }


    /**
     * Установка js функции выполняющейся при клике
     * @param {function|string} onclick
     * @return {HelperControlButton}
     */
    setOnClick(onclick) {
        this._onclick = onclick;
        return this;
    }


    /**
     * Получение js функции выполняющейся при клике
     * @return {string}
     */
    getOnClick() {
        return this._onclick;
    }


    /**
     * Set multiple attributes
     * @param {Object} attr
     */
    setAttr(attr) {
        for (const [name, value] of Object.entries(attr)) {
            this._attr[name] = value;
        }
        return this;
    }


    /**
     * Получение значения атрибута
     * @param {string} name
     * @return {string|null}
     */
    getAttr(name) {
        return this._attr[name] || null;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {
        return {
            type: 'submit',
            id: this.getId(),
            content: this.getContent(),
            onClick: this.getOnClick(),
            attr: this._attr
        };
    }
}


export default HelperControlSubmit;