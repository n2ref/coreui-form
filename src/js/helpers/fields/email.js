import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldEmail extends HelperFieldInput {

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'email';

        return result;
    }
}

export default HelperFieldEmail;