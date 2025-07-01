

class HelpersFieldsPropertiesContent {

    _content = null;


    /**
     * Установка поля
     * @param {string|null} content
     * @return self
     */
    setContent(content = null) {
        this._content = content;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getContent() {
        return this._content;
    }
}

export default HelpersFieldsPropertiesContent;