

let HelpersFieldsPropertiesOn = {

    _on: null,

    /**
     * Событие выполняемое для поля
     * @param {string}   eventName
     * @param {function} callback
     * @return {HelperField}
     */
    on(eventName, callback) {

        if (eventName &&
            callback &&
            typeof eventName === 'string' &&
            typeof callback === 'function'
        ) {
            if (this._on === null) {
                this._on = {};
            }
            this._on[eventName] = callback;
        }

        return this;
    }
}

export default HelpersFieldsPropertiesOn;