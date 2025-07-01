

class HelpersFieldsPropertiesReadonly {

    _readonly = null;


    /**
     * Установка поля
     * @param {boolean|null} readonly
     * @return self
     */
    setReadonly(readonly = null) {

        if (readonly === null) {
            this._readonly = null;
        } else {
            this._readonly = !! readonly;
        }

        return this;
    }


    /**
     * Получение поля
     * @return {boolean|null}
     */
    getReadonly() {
        return this._readonly;
    }
}

export default HelpersFieldsPropertiesReadonly;