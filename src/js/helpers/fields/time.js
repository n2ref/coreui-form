import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldTime extends HelperFieldInput {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'time';

        return result;
    }
}

export default HelperFieldTime;