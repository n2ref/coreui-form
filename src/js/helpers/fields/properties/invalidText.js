

class HelpersFieldsPropertiesInvalidText {

    _invalidText = null;


    /**
     * Установка поля
     * @param {string|null} invalidText
     * @return self
     */
    setInvalidText(invalidText = null) {
        this._invalidText = invalidText;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getInvalidText() {
        return this._invalidText;
    }
}

export default HelpersFieldsPropertiesInvalidText;