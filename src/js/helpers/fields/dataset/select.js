import Utils from "../../../utils";

import HelperFieldDatasetType             from "./type";
import HelpersFieldsPropertiesAttributes  from "../properties/attributes";
import HelpersFieldsPropertiesOptionsList from "../properties/optionsList";
import HelpersFieldsPropertiesWidth       from "../properties/width";


/**
 * @extends {HelpersFieldsPropertiesAttributes}
 * @extends {HelpersFieldsPropertiesOptionsList}
 * @extends {HelpersFieldsPropertiesWidth}
 */
class HelperFieldDatasetSelect extends HelperFieldDatasetType {

    /**
     * @param {string} type
     * @param {string} name
     * @param {string} title
     */
    constructor(type, name, title) {

        super(name, title);

        Object.assign(this, HelpersFieldsPropertiesAttributes);
        Object.assign(this, HelpersFieldsPropertiesOptionsList);
        Object.assign(this, HelpersFieldsPropertiesWidth);
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = super.toObject();

        result.type = 'select';

        if (this._optionsList !== null) { result.items = this._optionsList; }
        if (this._width !== null)       { result.width = this._width; }
        if (this._attr !== null)        { result.attr  = this._attr; }

        return result;
    }
}

export default HelperFieldDatasetSelect;