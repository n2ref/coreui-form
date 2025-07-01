import Utils from "../../../utils";

import HelpersFieldsPropertiesWidth      from "../properties/width";
import HelpersFieldsPropertiesAttributes from "../properties/attributes";
import HelperFieldDatasetType            from "./type";

/**
 * @extends {HelpersFieldsPropertiesWidth}
 * @extends {HelpersFieldsPropertiesAttributes}
 */
class HelperFieldDatasetInput extends HelperFieldDatasetType {

    _type = null;

    /**
     * @param {string} type
     * @param {string} name
     * @param {string} title
     */
    constructor(type, name, title) {

        super(name, title);

        Utils.assign(this, HelpersFieldsPropertiesWidth);
        Utils.assign(this, HelpersFieldsPropertiesAttributes);

        this._type = type;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = super.toObject();

        result.type = this._type;

        if (this._width !== null) { result.width = this._width; }
        if (this._attr !== null)  { result.attr  = this._attr; }

        return result;
    }
}

export default HelperFieldDatasetInput;