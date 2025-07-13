

let HelpersFieldsPropertiesWidth = {

    _width : null,


    /**
     * Установка поля
     * @param {number|null} width
     * @return self
     */
    setWidth(width = null) {
        this._width = width;
        return this;
    },


    /**
     * Получение поля
     * @return {number|null}
     */
    getWidth() {
        return this._width;
    }
}

export default HelpersFieldsPropertiesWidth;