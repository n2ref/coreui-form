

class HelpersFieldsPropertiesFields {

    _fields          = null;
    _fieldsDirection = null;



    /**
     * Установка доп полей
     * @param {Array|null} fields
     * @return self
     */
    attachFields(fields = null) {

        if ( ! Array.isArray(fields)) {
            this._fields = null;
            return;
        }

        if (this._fields === null) {
            this._fields = [];
        }

        let that = this;

        fields.map(function (field) {
            that._fields.push(field);
        });

        return this;
    }


    /**
     * Получение доп полей
     * @return {Array|null}
     */
    getAttachFields() {

        return this._fields;
    }


    /**
     * Очистка доп полей
     * @return self
     */
    clearAttachFields() {

        this._fields = null;
        return this;
    }


    /**
     * Установка поля
     * @param {string|null} direction
     * @return self
     */
    setFieldDirection(direction = null) {
        this._fieldsDirection = direction;
        return this;
    }


    /**
     * Получение поля
     * @return {string|null}
     */
    getFieldDirection() {
        return this._fieldsDirection;
    }
}

export default HelpersFieldsPropertiesFields;