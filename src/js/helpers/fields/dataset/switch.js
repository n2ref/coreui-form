import Utils from "../../../utils";

import HelperFieldDatasetType            from "./type";
import HelpersFieldsPropertiesAttributes from "../properties/attributes";
import HelpersFieldsPropertiesValueY     from "../properties/valueY";
import HelpersFieldsPropertiesValueN     from "../properties/valueN";


/**
 * @extends {HelpersFieldsPropertiesAttributes}
 * @extends {HelpersFieldsPropertiesValueY}
 * @extends {HelpersFieldsPropertiesValueN}
 */
class HelperFieldDatasetSwitch extends HelperFieldDatasetType {

    /**
     * @param {string} type
     * @param {string} name
     * @param {string} title
     */
    constructor(type, name, title) {

        super(name, title);

        Utils.assign(this, HelpersFieldsPropertiesAttributes);
        Utils.assign(this, HelpersFieldsPropertiesValueY);
        Utils.assign(this, HelpersFieldsPropertiesValueN);
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = super.toObject();

        result.type = 'switch';

        if (this._valueY !== null) { result.valueY = this._valueY; }
        if (this._valueN !== null) { result.valueN = this._valueN; }
        if (this._attr !== null)   { result.attr   = this._attr; }

        return result;
    }
}

export default HelperFieldDatasetSwitch;