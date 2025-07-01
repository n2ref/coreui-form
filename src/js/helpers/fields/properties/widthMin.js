

class HelpersFieldsPropertiesWidthMin {

    _widthMin = null;


    /**
     * Установка поля
     * @param {number|null} widthMin
     * @return self
     */
    setWidthMin(widthMin = null) {
        this._widthMin = widthMin;
        return this;
    }


    /**
     * Получение поля
     * @return {number|null}
     */
    getWidthMin() {
        return this._widthMin;
    }
}

export default HelpersFieldsPropertiesWidthMin;