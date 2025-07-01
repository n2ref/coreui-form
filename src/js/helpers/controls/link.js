import HelperControl from "../control";

/**
 *
 */
class HelperControlLink extends HelperControl {

    _url     = null;
    _content = null;
    _onclick = null;
    _attr    = {};


    /**
     * @param {string} content
     * @param {string} url
     */
    constructor(content, url) {

        super();
        this.setContent(content);
        this.setUrl(url);
    }


    /**
     * Установка содержимого кнопки
     * @param {string} content
     * @return {HelperControlLink}
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
     * Установка ссылки
     * @param {string} url
     * @return {HelperControlLink}
     */
    setUrl(url) {
        this._url = url;
        return this;
    }


    /**
     * Получение ссылки
     * @return {string}
     */
    getUrl() {
        return this._url;
    }


    /**
     * Установка js функции выполняющейся при клике
     * @param {function|string} onclick
     * @return {HelperControlLink}
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
            type: 'link',
            id: this.getId(),
            url: this.getUrl(),
            content: this.getContent(),
            onClick: this.getOnClick(),
            attr: this._attr
        };
    }
}


export default HelperControlLink;