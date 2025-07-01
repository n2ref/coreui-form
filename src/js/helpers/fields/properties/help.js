

class HelpersFieldsPropertiesHelp {

    _help = null;


    /**
     * Установка поля
     * @param {string|null} help
     * @return self
     */
    setHelp(help = null) {
        this._help = help;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getHelp() {
        return this._help;
    }
}

export default HelpersFieldsPropertiesHelp;