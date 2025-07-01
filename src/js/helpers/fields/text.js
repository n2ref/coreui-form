import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldText extends HelperFieldInput {

    /**
     * Установка шаблона для валидации
     * @param {string} pattern
     * @return {HelperFieldText}
     */
    setValidPattern(pattern) {

        this.setAttr({'pattern' : pattern});
        return this;
    }


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'text';

        return result;
    }
}

export default HelperFieldText;