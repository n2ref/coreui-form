

let HelpersFieldsPropertiesWidthLabel = {

    _widthLabel : null,


    /**
     * Установка поля
     * @param {string|number|null} widthLabel
     * @return self
     */
    setWidthLabel(widthLabel = null) {
        this._widthLabel = widthLabel;
        return this;
    },


    /**
     * Получение поля
     * @return {string|number|null}
     */
    getWidthLabel() {
        return this._widthLabel;
    }
}

export default HelpersFieldsPropertiesWidthLabel;