import Utils       from "../../utils";
import HelperField from "../field";

import HelpersFieldsPropertiesName             from "./properties/name";
import HelpersFieldsPropertiesLabel            from "./properties/label";
import HelpersFieldsPropertiesDescription      from "./properties/description";
import HelpersFieldsPropertiesDescriptionLabel from "./properties/descriptionLabel";
import HelpersFieldsPropertiesHelp             from "./properties/help";
import HelpersFieldsPropertiesWidth            from "./properties/width";
import HelpersFieldsPropertiesWidthLabel       from "./properties/widthLabel";
import HelpersFieldsPropertiesAttributes       from "./properties/attributes";
import HelpersFieldsPropertiesRequired         from "./properties/required";
import HelpersFieldsPropertiesInvalidText      from "./properties/invalidText";
import HelpersFieldsPropertiesValidText        from "./properties/validText";
import HelpersFieldsPropertiesPrefix           from "./properties/prefix";
import HelpersFieldsPropertiesSuffix           from "./properties/sufix";
import HelpersFieldsPropertiesShow             from "./properties/show";
import HelpersFieldsPropertiesFields           from "./properties/fields";
import HelpersFieldsPropertiesNoSend           from "./properties/noSend";

/**
 * @extends {HelpersFieldsPropertiesName}
 * @extends {HelpersFieldsPropertiesLabel}
 * @extends {HelpersFieldsPropertiesDescription}
 * @extends {HelpersFieldsPropertiesDescriptionLabel}
 * @extends {HelpersFieldsPropertiesHelp}
 * @extends {HelpersFieldsPropertiesWidth}
 * @extends {HelpersFieldsPropertiesWidthLabel}
 * @extends {HelpersFieldsPropertiesAttributes}
 * @extends {HelpersFieldsPropertiesRequired}
 * @extends {HelpersFieldsPropertiesInvalidText}
 * @extends {HelpersFieldsPropertiesValidText}
 * @extends {HelpersFieldsPropertiesPrefix}
 * @extends {HelpersFieldsPropertiesSuffix}
 * @extends {HelpersFieldsPropertiesShow}
 * @extends {HelpersFieldsPropertiesFields}
 * @extends {HelpersFieldsPropertiesNoSend}
 */
class HelperFieldFile extends HelperField {

    /**
     * @param {string} name
     * @param {string} label
     */
    constructor(name, label) {
        super();

        Utils.assign(this, HelpersFieldsPropertiesName);
        Utils.assign(this, HelpersFieldsPropertiesLabel);
        Utils.assign(this, HelpersFieldsPropertiesDescription);
        Utils.assign(this, HelpersFieldsPropertiesDescriptionLabel);
        Utils.assign(this, HelpersFieldsPropertiesHelp);
        Utils.assign(this, HelpersFieldsPropertiesWidth);
        Utils.assign(this, HelpersFieldsPropertiesWidthLabel);
        Utils.assign(this, HelpersFieldsPropertiesAttributes);
        Utils.assign(this, HelpersFieldsPropertiesRequired);
        Utils.assign(this, HelpersFieldsPropertiesInvalidText);
        Utils.assign(this, HelpersFieldsPropertiesValidText);
        Utils.assign(this, HelpersFieldsPropertiesPrefix);
        Utils.assign(this, HelpersFieldsPropertiesSuffix);
        Utils.assign(this, HelpersFieldsPropertiesShow);
        Utils.assign(this, HelpersFieldsPropertiesFields);
        Utils.assign(this, HelpersFieldsPropertiesNoSend);

        this.setName(name);
        this.setLabel(label);
    }


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = {
            type : 'file'
        };

        if (this._name !== null)             { result.name             = this._name; }
        if (this._label !== null)            { result.label            = this._label; }
        if (this._help !== null)             { result.help             = this._help; }
        if (this._description !== null)      { result.description      = this._description; }
        if (this._descriptionLabel !== null) { result.descriptionLabel = this._descriptionLabel; }
        if (this._required !== null)         { result.required         = this._required; }
        if (this._width !== null)            { result.width            = this._width; }
        if (this._widthLabel !== null)       { result.widthLabel       = this._widthLabel; }
        if (this._invalidText !== null)      { result.invalidText      = this._invalidText; }
        if (this._validText !== null)        { result.validText        = this._validText; }
        if (this._prefix !== null)           { result.prefix           = this._prefix; }
        if (this._suffix !== null)           { result.suffix           = this._suffix; }
        if (this._show !== null)             { result.show             = this._show; }
        if (this._position !== null)         { result.position         = this._position; }
        if (this._attr !== null)             { result.attr             = this._attr; }
        if (this._noSend !== null)           { result.noSend           = this._noSend; }

        if (Array.isArray(this._fields)) {
            let fields = [];

            this._fields.map(function (field) {
                if (Utils.isObject(field)) {
                    if (typeof field.toObject === 'function') {
                        fields.push(field.toObject());
                    } else {
                        fields.push(field);
                    }
                }
            });

            result.fields = fields;
        }

        return result;
    }
}

export default HelperFieldFile;