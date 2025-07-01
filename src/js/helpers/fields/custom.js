import Utils from "../../utils";
import HelperField from "../field";
import HelpersFieldsPropertiesName             from "./properties/name";
import HelpersFieldsPropertiesLabel            from "./properties/label";
import HelpersFieldsPropertiesDescription      from "./properties/description";
import HelpersFieldsPropertiesDescriptionLabel from "./properties/descriptionLabel";
import HelpersFieldsPropertiesHelp             from "./properties/help";
import HelpersFieldsPropertiesWidthLabel       from "./properties/widthLabel";
import HelpersFieldsPropertiesRequired         from "./properties/required";
import HelpersFieldsPropertiesShow             from "./properties/show";
import HelpersFieldsPropertiesFields           from "./properties/fields";
import HelpersFieldsPropertiesNoSend           from "./properties/noSend";


/**
 * @extends {HelpersFieldsPropertiesName}
 * @extends {HelpersFieldsPropertiesLabel}
 * @extends {HelpersFieldsPropertiesDescription}
 * @extends {HelpersFieldsPropertiesDescriptionLabel}
 * @extends {HelpersFieldsPropertiesHelp}
 * @extends {HelpersFieldsPropertiesWidthLabel}
 * @extends {HelpersFieldsPropertiesRequired}
 * @extends {HelpersFieldsPropertiesShow}
 * @extends {HelpersFieldsPropertiesFields}
 * @extends {HelpersFieldsPropertiesNoSend}
 */
class HelperFieldCustom extends HelperField {

    _content = null;

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
        Utils.assign(this, HelpersFieldsPropertiesWidthLabel);
        Utils.assign(this, HelpersFieldsPropertiesRequired);
        Utils.assign(this, HelpersFieldsPropertiesShow);
        Utils.assign(this, HelpersFieldsPropertiesFields);
        Utils.assign(this, HelpersFieldsPropertiesNoSend);

        this.setName(name);
        this.setLabel(label);
    }


    /**
     * Установка содержимого поля
     * @param {Array|Object|string|number|null} content
     * @return self
     */
    setContent(content = null) {
        this._content = content;
        return this;
    }


    /**
     * Получение содержимого поля
     * @return {Array|Object|string|number|null}
     */
    getContent() {
        return this._content;
    }



    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = {
            type : 'custom'
        };

        if (this._name !== null)             { result.name             = this._name; }
        if (this._label !== null)            { result.label            = this._label; }
        if (this._help !== null)             { result.help             = this._help; }
        if (this._description !== null)      { result.description      = this._description; }
        if (this._descriptionLabel !== null) { result.descriptionLabel = this._descriptionLabel; }
        if (this._required !== null)         { result.required         = this._required; }
        if (this._widthLabel !== null)       { result.widthLabel       = this._widthLabel; }
        if (this._show !== null)             { result.show             = this._show; }
        if (this._position !== null)         { result.position         = this._position; }
        if (this._noSend !== null)           { result.noSend           = this._noSend; }
        if (this._content !== null)          { result.content          = this._content; }

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

export default HelperFieldCustom;