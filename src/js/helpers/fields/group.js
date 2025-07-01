import HelperField from "../field";
import Utils       from "../../utils";
import HelpersFieldsPropertiesLabel  from "./properties/label";
import HelpersFieldsPropertiesShow   from "./properties/show";
import HelpersFieldsPropertiesFields from "./properties/fields";


/**
 * @extends {HelpersFieldsPropertiesLabel}
 * @extends {HelpersFieldsPropertiesShow}
 * @extends {HelpersFieldsPropertiesFields}
 */
class HelperFieldGroup extends HelperField {

    _showCollapsible = null;


    /**
     * @param {string} label
     */
    constructor(label) {
        super();

        Utils.assign(this, HelpersFieldsPropertiesLabel);
        Utils.assign(this, HelpersFieldsPropertiesShow);
        Utils.assign(this, HelpersFieldsPropertiesFields);

        this.setLabel(label);
    }


    /**
     * Установка отображения поля
     * @param {boolean|null} show
     * @return {HelperFieldText}
     */
    setShowCollapsible(show) {

        if (show !== null) {
            this._showCollapsible = show;
        } else {
            this._showCollapsible = null;
        }

        return this;
    }


    /**
     * Получение отображения поля
     * @return {boolean|null}
     */
    getShowCollapsible() {
        return this._showCollapsible;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'group';

        if (this._label !== null)           { result.label            = this._label; }
        if (this._show !== null)            { result.show            = this._show; }
        if (this._showCollapsible !== null) { result.showCollapsible = this._showCollapsible; }
        if (this._position !== null)        { result.position = this._position; }

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

export default HelperFieldGroup;