

let HelpersFieldsPropertiesRequired = {

    _required : null,


    /**
     * Установка поля
     * @param {boolean|null} required
     * @return self
     */
    setRequired(required = null) {

        if (required === null) {
            this._required = null;
        } else {
            this._required = !! required;
        }

        return this;
    },


    /**
     * Получение поля
     * @return {boolean|null}
     */
    getRequired() {
        return this._required;
    }
}

export default HelpersFieldsPropertiesRequired;