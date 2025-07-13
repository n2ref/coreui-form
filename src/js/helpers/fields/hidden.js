import HelperField from "../field";
import Utils       from "../../utils";

import HelpersFieldsPropertiesName       from "./properties/name";
import HelpersFieldsPropertiesAttributes from "./properties/attributes";
import HelpersFieldsPropertiesNoSend     from "./properties/noSend";
import HelpersFieldsPropertiesOn         from "./properties/on";


/**
 * @extends {HelpersFieldsPropertiesName}
 * @extends {HelpersFieldsPropertiesAttributes}
 * @extends {HelpersFieldsPropertiesNoSend}
 * @extends {HelpersFieldsPropertiesOn}
 */
class HelperFieldHidden extends HelperField {

    /**
     * @param {string} name
     * @param {string} label
     */
    constructor(name, label) {
        super();

        Object.assign(this, HelpersFieldsPropertiesName);
        Object.assign(this, HelpersFieldsPropertiesAttributes);
        Object.assign(this, HelpersFieldsPropertiesNoSend);
        Object.assign(this, HelpersFieldsPropertiesOn);

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
        if (this._on !== null)     { result.on     = this._on; }


        return result;
    }
}

export default HelperFieldHidden;