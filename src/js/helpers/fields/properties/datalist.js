

class HelpersFieldsPropertiesDatalist {

    _datalist = null;


    /**
     * Установка списка значений
     * @param {Array|null} datalist - Массив значений или null для сброса
     * @return {this} Возвращает текущий экземпляр для цепочки вызовов
     */
    setDatalist(datalist = null) {

        if (datalist === null) {
            this._datalist = null;
        } else {
            const datalistItems = [];

            for (const item of datalist) {
                if (typeof item === 'string' || typeof item === 'number') {
                    datalistItems.push({ value: item });

                } else if (typeof item === 'object' && item !== null &&
                           'value' in item &&
                           (typeof item.value === 'string' || typeof item.value === 'number')
                ) {
                    const datalistItem = {
                        value: item.value
                    };

                    if ('label' in item &&
                        (typeof item.label === 'string' || typeof item.label === 'number')) {
                        datalistItem.label = item.label;
                    }

                    datalistItems.push(datalistItem);
                }
            }

            this._datalist = datalistItems.length > 0 ? datalistItems : null;
        }
        return this;
    }


    /**
     * Получение списка значений
     * @return {Array|null} Текущий список значений или null
     */
    getDatalist() {
        return this._datalist;
    }
}

export default HelpersFieldsPropertiesDatalist;