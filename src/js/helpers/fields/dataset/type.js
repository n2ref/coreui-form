
/**
 *
 */
class HelperFieldDatasetType {

    _name = null;
    _title = null;


    /**
     * @param {string} name
     * @param {string} title
     */
    constructor(name, title) {

        this._name  = name;
        this._title = title;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        return {
            name : this._name,
            title : this._title,
        };
    }
}

export default HelperFieldDatasetType;