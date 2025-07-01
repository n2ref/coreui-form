import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldDatetime extends HelperFieldInput {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'datetime-local';

        return result;
    }
}

export default HelperFieldDatetime;