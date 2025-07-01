import HelperFieldInput from "./input";
import Utils            from "../../utils";


/**
 *
 */
class HelperFieldMask extends HelperFieldInput {

    _mask = null;
    _options = null;


    /**
     * Установка маски поля
     * @param {string|null} mask
     * @return self
     */
    setMask(mask = null) {
        this._mask = mask;
        return this;
    }
    
    
    /**
     * Получение маски поля
     * @return {string|null}
     */
    getMask() {
        return this._mask;
    }
    
    
    /**
     * Установка опции placeholder
     * @param {string|null} placeholder
     * @return self
     */
    setMaskPlaceholder(placeholder = null) {
    
        if (this._options === null) {
            this._options = {};
        }
    
        this._options.placeholder = placeholder;
        return this;
    }
    
    
    /**
     * Установка опции reverse
     * @param {boolean|null} reverse
     * @return self
     */
    setMaskReverse(reverse = null) {

        if (this._options === null) {
            this._options = {};
        }
    
        this._options.reverse = reverse;
        return this;
    }
    
    
    /**
     * Установка опции translation
     * @param {string} char
     * @param {array}  options
     * @return self
     */
    setMaskTranslation(char, options) {

        if (this._options === null) {
            this._options = {};
        }
        if ( ! Utils.isObject(this._options.translation)) {
            this._options.translation = {};
        }
    
        this._options.translation[char] = options;
        return this;
    }
    
    
    /**
     * Установка опции clearIfNotMatch
     * @param {boolean|null} isClear
     * @return self
     */
    setMaskClearIfNotMatch(isClear = null) {

        if (this._options === null) {
            this._options = {};
        }
    
        this._options.clearIfNotMatch = isClear;
        return this;
    }
    
    
    /**
     * Установка опции selectOnFocus
     * @param {boolean|null} isSelect
     * @return self
     */
    setMaskSelectOnFocus(isSelect = null) {

        if (this._options === null) {
            this._options = {};
        }
    
        this._options.selectOnFocus = isSelect;
        return this;
    }
    
    
    /**
     * Установка настроек маски
     * @param {Array|null} options
     * @return self
     */
    setMaskOptions(options = null) {
    
        this._options = options;
        return this;
    }
    
    
    /**
     * Получение настроек маски
     * @return {Array|null}
     */
    getMaskOptions() {
        return this._options;
    }


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'mask';

        if (this._mask !== null)    { result.mask    = this._mask; }
        if (this._options !== null) { result.options = this._options; }

        return result;
    }
}

export default HelperFieldMask;