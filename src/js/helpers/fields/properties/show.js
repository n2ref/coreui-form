

class HelpersFieldsPropertiesShow {

    _show = null;


    /**
     * Установка поля
     * @param {boolean|null} show
     * @return self
     */
    setShow(show = null) {

        if (show === null) {
            this._show = null;
        } else {
            this._show = !! show;
        }

        return this;
    }


    /**
     * Получение поля
     * @return {boolean|null}
     */
    getShow() {
        return this._show;
    }
}

export default HelpersFieldsPropertiesShow;