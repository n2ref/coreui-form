

class HelpersFieldsPropertiesWidthMax {

    _widthMax = null;


    /**
     * Установка поля
     * @param {number|null} widthMax
     * @return self
     */
    setWidthMax(widthMax = null) {
        this._widthMax = widthMax;
        return this;
    }


    /**
     * Получение поля
     * @return {number|null}
     */
    getWidthMax() {
        return this._widthMax;
    }
}

export default HelpersFieldsPropertiesWidthMax;