

class HelpersFieldsPropertiesName {

    _name = null;


    /**
     * Установка поля
     * @param {string|null} name
     * @return self
     */
    setName(name = null) {
        this._name = name;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getName() {
        return this._name;
    }
}

export default HelpersFieldsPropertiesName;