

class HelpersFieldsPropertiesValidText {

    _validTextText = null;


    /**
     * Установка поля
     * @param {string|null} validTextText
     * @return self
     */
    setValidTextText(validTextText = null) {
        this._validTextText = validTextText;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getValidTextText() {
        return this._validTextText;
    }
}

export default HelpersFieldsPropertiesValidText;