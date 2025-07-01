

class HelpersFieldsPropertiesPrefix {

    _prefix = null;


    /**
     * Установка поля
     * @param {string|null} prefix
     * @return self
     */
    setPrefix(prefix = null) {
        this._prefix = prefix;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getPrefix() {
        return this._prefix;
    }
}

export default HelpersFieldsPropertiesPrefix;