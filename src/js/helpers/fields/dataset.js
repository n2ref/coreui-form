
import Utils                                   from "../../utils";
import HelperField                             from "../field";
import HelpersFieldsPropertiesName             from "./properties/name";
import HelpersFieldsPropertiesLabel            from "./properties/label";
import HelpersFieldsPropertiesDescription      from "./properties/description";
import HelpersFieldsPropertiesDescriptionLabel from "./properties/descriptionLabel";
import HelpersFieldsPropertiesHelp             from "./properties/help";
import HelpersFieldsPropertiesWidthLabel       from "./properties/widthLabel";
import HelpersFieldsPropertiesRequired         from "./properties/required";
import HelpersFieldsPropertiesReadonly         from "./properties/readonly";
import HelpersFieldsPropertiesInvalidText      from "./properties/invalidText";
import HelpersFieldsPropertiesValidText        from "./properties/validText";
import HelpersFieldsPropertiesPrefix           from "./properties/prefix";
import HelpersFieldsPropertiesSuffix           from "./properties/sufix";
import HelpersFieldsPropertiesShow             from "./properties/show";
import HelpersFieldsPropertiesFields           from "./properties/fields";
import HelpersFieldsPropertiesNoSend           from "./properties/noSend";
import HelpersFieldsPropertiesOn               from "./properties/on";

import HelperFieldDatasetInput     from "./dataset/input";
import HelperFieldDatasetText      from "./dataset/text";
import HelperFieldDatasetNumber    from "./dataset/number";
import HelperFieldDatasetDate      from "./dataset/date";
import HelperFieldDatasetDateWeek  from "./dataset/dateWeek";
import HelperFieldDatasetDateMonth from "./dataset/dateMonth";
import HelperFieldDatasetDatetime  from "./dataset/datetime";
import HelperFieldDatasetSwitch    from "./dataset/switch";
import HelperFieldDatasetSelect    from "./dataset/select";


/**
 * @extends {HelpersFieldsPropertiesName}
 * @extends {HelpersFieldsPropertiesLabel}
 * @extends {HelpersFieldsPropertiesDescription}
 * @extends {HelpersFieldsPropertiesDescriptionLabel}
 * @extends {HelpersFieldsPropertiesHelp}
 * @extends {HelpersFieldsPropertiesWidthLabel}
 * @extends {HelpersFieldsPropertiesRequired}
 * @extends {HelpersFieldsPropertiesReadonly}
 * @extends {HelpersFieldsPropertiesInvalidText}
 * @extends {HelpersFieldsPropertiesValidText}
 * @extends {HelpersFieldsPropertiesPrefix}
 * @extends {HelpersFieldsPropertiesSuffix}
 * @extends {HelpersFieldsPropertiesShow}
 * @extends {HelpersFieldsPropertiesFields}
 * @extends {HelpersFieldsPropertiesNoSend}
 * @extends {HelpersFieldsPropertiesOn}
 */
class HelperFieldDataset extends HelperField {

    _options = null;

    options = {
        input:     function (type, name, title) { new HelperFieldDatasetInput(type, name, title); },
        text:      function (name, title) { new HelperFieldDatasetText(name, title); },
        number:    function (name, title) { new HelperFieldDatasetNumber(name, title); },
        date:      function (name, title) { new HelperFieldDatasetDate(name, title); },
        dateWeek:  function (name, title) { new HelperFieldDatasetDateWeek(name, title); },
        dateMonth: function (name, title) { new HelperFieldDatasetDateMonth(name, title); },
        datetime:  function (name, title) { new HelperFieldDatasetDatetime(name, title); },
        switch:    function (name, title) { new HelperFieldDatasetSwitch(name, title); },
        select:    function (name, title) { new HelperFieldDatasetSelect(name, title); },
    };


    /**
     * @param {string} name
     * @param {string} label
     */
    constructor(name, label) {
        super();

        Object.assign(this, HelpersFieldsPropertiesName);
        Object.assign(this, HelpersFieldsPropertiesLabel);
        Object.assign(this, HelpersFieldsPropertiesDescription);
        Object.assign(this, HelpersFieldsPropertiesDescriptionLabel);
        Object.assign(this, HelpersFieldsPropertiesHelp);
        Object.assign(this, HelpersFieldsPropertiesWidthLabel);
        Object.assign(this, HelpersFieldsPropertiesRequired);
        Object.assign(this, HelpersFieldsPropertiesReadonly);
        Object.assign(this, HelpersFieldsPropertiesInvalidText);
        Object.assign(this, HelpersFieldsPropertiesValidText);
        Object.assign(this, HelpersFieldsPropertiesPrefix);
        Object.assign(this, HelpersFieldsPropertiesSuffix);
        Object.assign(this, HelpersFieldsPropertiesShow);
        Object.assign(this, HelpersFieldsPropertiesFields);
        Object.assign(this, HelpersFieldsPropertiesNoSend);
        Object.assign(this, HelpersFieldsPropertiesOn);

        this.setName(name);
        this.setLabel(label);
    }


    /**
     * Установка полей датасета
     * @param {Array|null} options
     * @return {HelperFieldDataset}
     */
    addOptions(options = null) {

        if (Array.isArray(options)) {
            if (this._options === null) {
                this._options = [];
            }

            let that = this;

            options.map(function (option) {
                if (Utils.isObject(option)) {
                    that._options.push(option);
                }
            });

        } else {
            this._options = null;
        }

        return this;
    }


    /**
     * Получение полей датасета
     * @return {Array|null}
     */
    getOptions() {
        return this._options;
    }


    /**
     * Очистка установленных полей датасета
     * @return {HelperFieldDataset}
     */
    clearOptions() {
        this._options = null;

        return this;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = {
            type : 'dataset'
        };

        if (this._name !== null)             { result.name             = this._name; }
        if (this._label !== null)            { result.label            = this._label; }
        if (this._help !== null)             { result.help             = this._help; }
        if (this._description !== null)      { result.description      = this._description; }
        if (this._descriptionLabel !== null) { result.descriptionLabel = this._descriptionLabel; }
        if (this._required !== null)         { result.required         = this._required; }
        if (this._readonly !== null)         { result.readonly         = this._readonly; }
        if (this._widthLabel !== null)       { result.widthLabel       = this._widthLabel; }
        if (this._invalidText !== null)      { result.invalidText      = this._invalidText; }
        if (this._validText !== null)        { result.validText        = this._validText; }
        if (this._prefix !== null)           { result.prefix           = this._prefix; }
        if (this._suffix !== null)           { result.suffix           = this._suffix; }
        if (this._show !== null)             { result.show             = this._show; }
        if (this._position !== null)         { result.position         = this._position; }
        if (this._noSend !== null)           { result.noSend           = this._noSend; }
        if (this._on !== null)               { result.on               = this._on; }

        if (Array.isArray(this._options)) {
            let options = [];

            this._options.map(function (option) {
                if (Utils.isObject(option)) {
                    if (typeof option.toObject === 'function') {
                        options.push(option.toObject());
                    } else {
                        options.push(option);
                    }
                }
            });

            result.options = options;
        }


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

export default HelperFieldDataset;