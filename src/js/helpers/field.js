import Utils                           from "../utils";
import HelpersFieldsPropertiesPosition from "./fields/properties/position";


/**
 * @extends {HelpersFieldsPropertiesPosition}
 */
class HelperField {

    _id = null;


    /**
     *
     */
    constructor() {

        Object.assign(this, HelpersFieldsPropertiesPosition);
    }


    /**
     * Получение id поля
     * @return {string}
     */
    getId() {
        return this._id;
    }


    /**
     * Установка ID поля
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
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = {
            id : this._id
        };

        if (this._position !== null) { result.position = this._position; }

        return result;
    }
}

export default HelperField;