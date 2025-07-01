import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldDateMonth extends HelperFieldInput {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'month';

        return result;
    }
}

export default HelperFieldDateMonth;