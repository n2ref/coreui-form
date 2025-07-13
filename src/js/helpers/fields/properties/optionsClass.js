

let HelpersFieldsPropertiesOptionsClass = {

    _optionsClass : null,


    /**
     * Установка поля
     * @param {string|null} optionsClass
     * @return self
     */
    setOptionsClass(optionsClass = null) {
        this._optionsClass = optionsClass;
        return this;
    },


    /**
     * Получение поля
     * @return {string|null}
     */
    getOptionsClass() {
        return this._optionsClass;
    }
}

export default HelpersFieldsPropertiesOptionsClass;