import HelperField from "../field";
import Utils       from "../../utils";

import HelpersFieldsPropertiesName       from "./properties/name";
import HelpersFieldsPropertiesAttributes from "./properties/attributes";
import HelpersFieldsPropertiesNoSend     from "./properties/noSend";


/**
 * @extends {HelpersFieldsPropertiesName}
 * @extends {HelpersFieldsPropertiesAttributes}
 * @extends {HelpersFieldsPropertiesNoSend}
 */
class HelperFieldHidden extends HelperField {

    /**
     * @param {string} name
     * @param {string} label
     */
    constructor(name, label) {
        super();

        Utils.assign(this, HelpersFieldsPropertiesName);
        Utils.assign(this, HelpersFieldsPropertiesAttributes);
        Utils.assign(this, HelpersFieldsPropertiesNoSend);

        this.setName(name);
        this.setLabel(label);
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = super.toObject();

        result.type = 'hidden';

        if (this._name !== null)   { result.name   = this._name; }
        if (this._attr !== null)   { result.attr   = this._attr; }
        if (this._noSend !== null) { result.noSend = this._noSend; }


        return result;
    }
}

export default HelperFieldHidden;