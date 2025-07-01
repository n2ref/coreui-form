

class HelpersFieldsPropertiesDescription {

    _description = null;


    /**
     * Установка поля
     * @param {string|null} description
     * @return self
     */
    setDescription(description = null) {
        this._description = description;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getDescription() {
        return this._description;
    }
}

export default HelpersFieldsPropertiesDescription;