import HelperFieldInput from "./input";


/**
 *
 */
class HelperFieldNumber extends HelperFieldInput {

    _precision = null;

    /**
     * Установка количества знаков после запятой
     * @param {int|null} precision
     * @return {HelperFieldCheckboxBtn}
     */
    setPrecision(precision) {
        this._precision = precision;
        return this;
    }


    /**
     * Получение количества знаков после запятой
     * @return {int|null}
     */
    getPrecision() {
        return this._precision;
    }


    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'number';

        if (this._precision !== null) {
            result.precision = this._precision;
        }

        return result;
    }
}

export default HelperFieldNumber;