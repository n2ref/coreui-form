

class HelpersFieldsPropertiesHeightMax {

    _heightMax = null;


    /**
     * Установка поля
     * @param {number|null} heightMax
     * @return self
     */
    setHeightMax(heightMax = null) {
        this._heightMax = heightMax;
        return this;
    }


    /**
     * Получение поля
     * @return {number|null}
     */
    getHeightMax() {
        return this._heightMax;
    }
}

export default HelpersFieldsPropertiesHeightMax;