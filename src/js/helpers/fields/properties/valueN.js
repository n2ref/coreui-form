

let HelpersFieldsPropertiesValueN = {

    _valueN : null,


    /**
     * Установка поля
     * @param {string|null} valueN
     * @return self
     */
    setValueN(valueN = null) {
        this._valueN = valueN;
        return this;
    },


    /**
     * Получение поля
     * @return {string|null}
     */
    getValueN() {
        return this._valueN;
    }
}

export default HelpersFieldsPropertiesValueN;