import Utils from "../../utils";

import HelperFieldCheckbox                 from "./chackbox";
import HelpersFieldsPropertiesOptionsClass from "./properties/optionsClass";


/**
 * @extends {HelpersFieldsPropertiesOptionsClass}
 */
class HelperFieldCheckboxBtn extends HelperFieldCheckbox {

    /**
     * @param {string} name
     * @param {string} label
     */
    constructor(name, label) {
        super();

        Utils.assign(this, HelpersFieldsPropertiesOptionsClass);

        this.setName(name);
        this.setLabel(label);
    }


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'checkboxBtn';


        if (this._optionsClass !== null) {
            result.optionsClass = this._optionsClass;
        }

        return result;
    }
}

export default HelperFieldCheckboxBtn;