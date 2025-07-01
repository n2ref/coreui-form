import Utils from "../../../utils";


class HelpersFieldsPropertiesAttributes {

    _attributes = null;


    /**
     * Установка поля
     * @param {object|null} attributes
     * @return self
     */
    setAttr(attributes = null) {

        if (Utils.isObject(attributes)) {
            this._attributes = $.extend(true, this._attributes, attributes);

        } else if (attributes === null) {
            this._attributes = null;
        }

        return this;
    }


    /**
     * Получение поля
     * @return {object|null}
     */
    getAttr() {
        return this._attributes;
    }
}

export default HelpersFieldsPropertiesAttributes;