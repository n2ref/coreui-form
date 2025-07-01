import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldRange extends HelperFieldInput {


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'range';

        return result;
    }
}

export default HelperFieldRange;