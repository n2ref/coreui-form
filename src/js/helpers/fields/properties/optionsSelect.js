import Utils from "../../../utils";


let HelpersFieldsPropertiesOptionsSelect = {

    _optionsSelect : null,

    /**
     * Установка списка значений с поддержкой групп опций
     * @param {Array|null} options - Массив опций или null для сброса
     * @return {this} Возвращает текущий экземпляр для цепочки вызовов
     */
    setOptions(options = null) {

        if (options === null) {
            this._optionsSelect = null;

        } else {
            const datalistItems = [];

            for (const [key, option] of Object.entries(options)) {
                // Простые строковые/числовые значения
                if (typeof option === 'string' || typeof option === 'number') {
                    datalistItems.push({
                        value: key,
                        text: String(option)
                    });
                }
                // Обработка массива/объекта
                else if (Utils.isObject(option)) {
                    // Обработка группы опций
                    if (option.type === 'group' && Array.isArray(option.options)) {
                        // Копируем всю группу, если есть подопции
                        datalistItems.push({...option});
                    }
                    // Обработка обычного элемента
                    else if (option.value !== undefined &&
                        (typeof option.value === 'string' || typeof option.value === 'number')) {
                        // Копируем объект опции
                        datalistItems.push({...option});
                    }
                }
            }

            this._optionsSelect = datalistItems.length > 0 ? datalistItems : null;
        }
        return this;
    },


    /**
     * Получение списка значений
     * @return {Array|null} Текущий список опций или null
     */
    getOptions() {
        return this._optionsSelect;
    }
}

export default HelpersFieldsPropertiesOptionsSelect;