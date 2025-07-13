import Utils                               from "../../utils";
import HelperFieldRadio                    from "./radio";
import HelpersFieldsPropertiesOptionsClass from "./properties/optionsClass";


/**
 * @extends {HelpersFieldsPropertiesOptionsClass}
 */
class HelperFieldRadioBtn extends HelperFieldRadio {

    /**
     * @param {string} name
     * @param {string} label
     */
    constructor(name, label) {
        super();

        Object.assign(this, HelpersFieldsPropertiesOptionsClass);

        this.setName(name);
        this.setLabel(label);
    }


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'radioBtn';

        if (this._optionsClass !== null) { result.optionsClass = this._optionsClass; }

        return result;
    }
}

export default HelperFieldRadioBtn;