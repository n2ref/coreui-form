

let HelpersFieldsPropertiesPosition = {

    _position: null,


    /**
     * Установка поля
     * @param {string|null} position
     * @return self
     */
    setPosition(position = null) {
        this._position = position;
        return this;
    },


    /**
     * Получение поля
     * @return {string|null}
     */
    getPosition() {
        return this._position;
    }
}

export default HelpersFieldsPropertiesPosition;