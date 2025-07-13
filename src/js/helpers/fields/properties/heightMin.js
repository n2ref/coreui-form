

let HelpersFieldsPropertiesHeightMin = {

    _heightMin : null,


    /**
     * Установка поля
     * @param {number|null} heightMin
     * @return self
     */
    setHeightMin(heightMin = null) {
        this._heightMin = heightMin;
        return this;
    },


    /**
     * Получение поля
     * @return {number|null}
     */
    getHeightMin() {
        return this._heightMin;
    }
}

export default HelpersFieldsPropertiesHeightMin;