import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldDateWeek extends HelperFieldInput {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'week';

        return result;
    }
}

export default HelperFieldDateWeek;