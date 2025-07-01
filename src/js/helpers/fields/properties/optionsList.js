

class HelpersFieldsPropertiesOptionsList {

    _optionsList = null;


    /**
     * Установка списка опций
     * @param {Array|null} options - Массив опций или null для сброса
     * @return {this} Возвращает текущий экземпляр для цепочки вызовов
     */
    setOptions(options = null) {

        if (options === null) {
            this._optionsList = null;

        } else {
            const optionsItems = [];

            for (const [key, option] of Object.entries(options)) {
                if (typeof option === 'string' || typeof option === 'number') {
                    optionsItems.push({
                        value: key,
                        text: String(option)
                    });

                } else if (typeof option === 'object' && option !== null &&
                    'value' in option &&
                    (typeof option.value === 'string' || typeof option.value === 'number')
                ) {

                    // Копируем объект опции, чтобы избежать мутаций исходного объекта
                    optionsItems.push({...option});
                }
            }

            this._optionsList = optionsItems.length > 0 ? optionsItems : null;
        }
        return this;
    }

    /**
     * Получение списка опций
     * @return {Array|null} Текущий список опций или null
     */
    getOptions() {
        return this._optionsList;
    }
}

export default HelpersFieldsPropertiesOptionsList;