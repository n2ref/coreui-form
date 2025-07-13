

let HelpersFieldsPropertiesNoSend = {

    _noSend : null,


    /**
     * Установка поля
     * @param {boolean|null} noSend
     * @return self
     */
    setNoSend(noSend = null) {

        if (noSend === null) {
            this._noSend = null;
        } else {
            this._noSend = !! noSend;
        }

        return this;
    },


    /**
     * Получение поля
     * @return {boolean|null}
     */
    getNoSend() {
        return this._noSend;
    }
}

export default HelpersFieldsPropertiesNoSend;