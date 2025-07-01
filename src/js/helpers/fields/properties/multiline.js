

class HelpersFieldsPropertiesMultiline {

    _multiline = null;


    /**
     * Установка поля
     * @param {boolean|null} multiline
     * @return self
     */
    setMultiline(multiline = null) {

        if (multiline === null) {
            this._multiline = null;
        } else {
            this._multiline = !! multiline;
        }

        return this;
    }


    /**
     * Получение поля
     * @return {boolean|null}
     */
    getMultiline() {
        return this._multiline;
    }
}

export default HelpersFieldsPropertiesMultiline;