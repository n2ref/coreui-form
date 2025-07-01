import HelperFieldPassword from "./password";


/**
 *
 */
class HelperFieldPasswordRepeat extends HelperFieldPassword {

    _showBtn = null;


    /**
     * Установка признака отображения кнопки
     * @param {boolean|null} showBtn
     * @return {HelperFieldCheckboxBtn}
     */
    setShowBtn(showBtn) {
        this._showBtn = showBtn;
        return this;
    }


    /**
     * Получение признака отображения кнопки
     * @return {boolean|null}
     */
    getShowBtn() {
        return this._showBtn;
    }


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = super.toObject();
        result.type = 'passwordRepeat';

        if (this._showBtn !== null) {
            result.showBtn = this._showBtn;
        }

        return result;
    }
}

export default HelperFieldPasswordRepeat;