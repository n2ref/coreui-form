import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldDate extends HelperFieldInput {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'date';

        return result;
    }
}

export default HelperFieldDate;