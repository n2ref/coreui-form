

class HelperControl {

    _id = null;

    /**
     * Инициализация
     * @param {string} id
     */
    constructor(id) {

        this.setId(id);
    }


    /**
     * Установка ID контрола
     * @param {string} id
     * @return {HelperControl}
     */
    setId(id) {

        if (typeof id === 'string' && id) {
            this._id = id;
        }
        return this;
    }


    /**
     * Получение ID контрола
     * @return {string}
     */
    getId() {
        return this._id;
    }
}

export default HelperControl;