

let HelpersFieldsPropertiesHeight = {

    _height: null,


    /**
     * Установка поля
     * @param {number|null} height
     * @return self
     */
    setHeight(height = null) {
        this._height = height;
        return this;
    },


    /**
     * Получение поля
     * @return {number|null}
     */
    getHeight() {
        return this._height;
    }
}

export default HelpersFieldsPropertiesHeight;