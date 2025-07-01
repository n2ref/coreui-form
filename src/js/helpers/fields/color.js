import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldColor extends HelperFieldInput {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'color';

        return result;
    }
}

export default HelperFieldColor;