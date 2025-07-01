

class HelpersFieldsPropertiesOnclick {

    _onclick = null;


    /**
     * Установка поля
     * @param {function|null} onclick
     * @return self
     */
    setOnclick(onclick = null) {

        if (typeof onclick === 'function') {
            this._onclick = onclick;
        }

        return this;
    }


    /**
     * Получение поля
     * @return {function|null}
     */
    getOnclick() {
        return this._onclick;
    }
}

export default HelpersFieldsPropertiesOnclick;