

class HelpersFieldsPropertiesDescriptionLabel {

    _descriptionLabel = null;


    /**
     * Установка поля
     * @param {string|null} descriptionLabel
     * @return self
     */
    setDescriptionLabel(descriptionLabel = null) {
        this._descriptionLabel = descriptionLabel;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getDescriptionLabel() {
        return this._descriptionLabel;
    }
}

export default HelpersFieldsPropertiesDescriptionLabel;