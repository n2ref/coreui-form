import HelperFieldRadio from "./radio";


/**
 *
 */
class HelperFieldCheckbox extends HelperFieldRadio {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'checkbox';

        return result;
    }
}

export default HelperFieldCheckbox;