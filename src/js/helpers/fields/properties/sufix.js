

class HelpersFieldsPropertiesSuffix {
    
    _suffix = null;


    /**
     * Установка поля
     * @param {string|null} suffix
     * @return self
     */
    setSuffix(suffix = null) {
        this._suffix = suffix;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getSuffix() {
        return this._suffix;
    }
}

export default HelpersFieldsPropertiesSuffix;