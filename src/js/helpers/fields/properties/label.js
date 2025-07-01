

class HelpersFieldsPropertiesLabel {

    _label = null;


    /**
     * Установка поля
     * @param {string|null} label
     * @return self
     */
    setLabel(label = null) {
        this._label = label;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getLabel() {
        return this._label;
    }
}

export default HelpersFieldsPropertiesLabel;