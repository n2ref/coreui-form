

class HelpersFieldsPropertiesMultiple {

    _multiple = null;


    /**
     * Установка поля
     * @param {boolean|null} multiple
     * @return self
     */
    setMultiple(multiple = null) {

        if (multiple === null) {
            this._multiple = null;
        } else {
            this._multiple = !! multiple;
        }

        return this;
    }


    /**
     * Получение поля
     * @return {boolean|null}
     */
    getMultiple() {
        return this._multiple;
    }
}

export default HelpersFieldsPropertiesMultiple;