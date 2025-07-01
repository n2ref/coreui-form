import HelperControl from "../control";

/**
 *
 */
class HelperControlCustom extends HelperControl {

    _content = null;


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
     * @return {HelperControlCustom}
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
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {
        return {
            type: 'custom',
            id: this.getId(),
            content: this.getContent()
        };
    }
}


export default HelperControlCustom;