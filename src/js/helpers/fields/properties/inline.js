

let HelpersFieldsPropertiesInline = {

    _inline : null,


    /**
     * Установка поля
     * @param {boolean|null} inline
     * @return self
     */
    setInline(inline = null) {

        if (inline === null) {
            this._inline = null;
        } else {
            this._inline = !! inline;
        }

        return this;
    },


    /**
     * Получение поля
     * @return {boolean|null}
     */
    getInline() {
        return this._inline;
    }
}

export default HelpersFieldsPropertiesInline;