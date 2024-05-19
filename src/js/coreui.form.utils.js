import coreuiFormPrivate from "./coreui.form.private";

let coreuiFormUtils = {

    /**
     * Получение значения поля
     * @param {coreuiFormInstance} form
     * @param {object}             fieldOptions
     * @returns {string|number|null}
     */
    getFieldValue: function (form, fieldOptions) {

        let formRecord = form.getRecord();

        if (fieldOptions &&
            formRecord &&
            typeof fieldOptions.name === 'string' &&
            typeof formRecord === 'object' &&
            formRecord.hasOwnProperty(fieldOptions.name) &&
            ['string', 'number', 'object'].indexOf(typeof formRecord[fieldOptions.name]) >= 0
        ) {
            return formRecord[fieldOptions.name];
        }

        return '';
    },


    /**
     * Получение функции из указанного текста
     * @param functionName
     * @param context
     * @returns {null|Window}
     * @private
     */
    getFunctionByName: function(functionName, context) {

        let namespaces = functionName.split(".");
        let func       = namespaces.pop();

        context = context || window;

        for (let i = 0; i < namespaces.length; i++) {
            if (context.hasOwnProperty(namespaces[i])) {
                context = context[namespaces[i]];
            } else {
                return null;
            }
        }

        if (typeof context[func] === 'function') {
            return context[func];
        }

        return null;
    },


    /**
     * Обработка полей в полях
     * @param form
     * @param defaultOptions
     * @param fieldOptions
     */
    mergeFieldOptions: function (form, defaultOptions, fieldOptions) {

        let options = $.extend(true, {}, defaultOptions);

        if (fieldOptions) {
            if (options.hasOwnProperty('attr') && typeof options.attr === 'object' &&
                fieldOptions.hasOwnProperty('attr') && typeof fieldOptions.attr === 'object'
            ) {
                fieldOptions.attr = this.mergeAttr(options.attr, fieldOptions.attr);
            }

            options = $.extend(true, {}, options, fieldOptions);
        }

        if (options.hasOwnProperty('width')) {
            if (options.width) {
                let unit = typeof options.width === 'number' ? 'px' : '';
                options.width = options.width + unit;

            } else if (form._options.fieldWidth && options.type !== 'color') {
                let unit = typeof form._options.fieldWidth === 'number' ? 'px' : '';
                options.width = form._options.fieldWidth + unit;
            }
        }

        if (options.hasOwnProperty('labelWidth')) {
            if (options.labelWidth >= 0 && options.labelWidth !== null) {
                let unit = typeof options.labelWidth === 'number' ? 'px' : '';
                options.labelWidth = options.labelWidth + unit;

            } else if (form._options.labelWidth) {
                let unit = typeof form._options.labelWidth === 'number' ? 'px' : '';
                options.labelWidth = form._options.labelWidth + unit;
            }
        }

        return options
    },


    /**
     * Объединение атрибутов
     * @param attr1
     * @param attr2
     * @returns {object}
     */
    mergeAttr: function (attr1, attr2) {

        let mergeAttr = Object.assign({}, attr1);

        if (typeof attr2 === 'object') {
            $.each(attr2, function (name, value) {
                if (mergeAttr.hasOwnProperty(name)) {
                    if (name === 'class') {
                        mergeAttr[name] += ' ' + value;

                    } else if (name === 'style') {
                        mergeAttr[name] += ';' + value;

                    } else {
                        mergeAttr[name] = value;
                    }

                } else {
                    mergeAttr[name] = value;
                }
            });
        }

        return mergeAttr;
    },


    /**
     * Инициализация и рендер дополнительных полей
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @returns {object}
     * @private
     */
    getAttacheFields: function(form, options) {

        let fields = [];

        if (typeof options === 'object' &&
            typeof(options.fields) === 'object' &&
            Array.isArray(options.fields)
        ) {
            $.each(options.fields, function (key, field) {
                let instance = coreuiFormPrivate.initField(form, field);

                if (typeof instance !== 'object') {
                    return;
                }

                fields.push({
                    hash: instance._hash,
                    direction: options.hasOwnProperty('fieldsDirection') ? options.fieldsDirection : 'row',
                    content: instance.renderContent()
                });
            });
        }

        return fields;
    },


    /**
     * Форматирование даты
     * @param {string} value
     * @return {string}
     */
    formatDate: function (value) {

        if (value && value.length === 10) {
            let date  = new Date(value);
            let year  = date.getFullYear();
            let month = date.getMonth() + 1;
            let day   = date.getDate();

            day   = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;

            value = day + '.' + month + '.' + year;
        }

        return value;
    },


    /**
     * Форматирование даты со временем
     * @param {string} value
     * @return {string}
     */
    formatDateTime: function (value) {

        if (value && value.length >= 10) {
            let date  = new Date(value);
            let year  = date.getFullYear();
            let month = date.getMonth() + 1;
            let day   = date.getDate();
            let hour  = ("00" + date.getHours()).slice(-2);
            let min   = ("00" + date.getMinutes()).slice(-2);
            let sec   = ("00" + date.getSeconds()).slice(-2);

            day   = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;

            value = day + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
        }

        return value;
    },


    /**
     * Форматирование даты со временем
     * @param {string} value
     * @param {object} lang
     * @return {string}
     */
    formatDateMonth: function (value, lang) {

        if (value && value.length === 7) {
            let date  = new Date(value);
            let year  = date.getFullYear();
            let month = date.getMonth();

            let monthLang = lang.date_months.hasOwnProperty(month) ? lang.date_months[month] : '';

            value = monthLang + ' ' + year;
        }

        return value;
    },


    /**
     * Форматирование даты со временем
     * @param {string} value
     * @param {object} lang
     * @return {string}
     */
    formatDateWeek: function (value, lang) {

        if (value && value.length >= 7) {
            let year = value.substring(0, 4);
            let week = value.substring(6);

            value = year + ' ' + lang.date_week + ' ' + week;
        }

        return value;
    },


    /**
     * Получение значения из объекта по указанному пути
     * @param {object} obj
     * @param {string} path
     * @return {*}
     */
    getObjValue: function(obj, path) {

        path = path.split('.');

        for (let i = 0, len = path.length; i < len; i++){
            obj = obj[path[i]];
        }

        return obj;
    },


    /**
     * Проверка текста на содержимое JSON
     * @param text
     * @return {boolean}
     */
    isJson: function (text) {

        if (typeof text !== "string") {
            return false;
        }

        try {
            let json = JSON.parse(text);
            return typeof json === 'object' || Array.isArray(json);

        } catch (error) {
            return false;
        }
    },


    /**
     * Проверка на объект
     * @param value
     */
    isObject: function (value) {

        return typeof value === 'object' &&
            ! Array.isArray(value) &&
            value !== null;
    },


    /**
     * Проверка на число
     * @param num
     * @returns {boolean}
     * @private
     */
    isNumeric: function(num) {
        return (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && ! isNaN(num);
    },


    /**
     * @returns {string}
     * @private
     */
    hashCode: function() {
        return this.crc32((new Date().getTime() + Math.random()).toString()).toString(16);
    },


    /**
     * Hash crc32
     * @param str
     * @returns {number}
     * @private
     */
    crc32: function (str) {

        for (var a, o = [], c = 0; c < 256; c++) {
            a = c;
            for (var f = 0; f < 8; f++) {
                a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1
            }
            o[c] = a
        }

        for (var n = -1, t = 0; t < str.length; t++) {
            n = n >>> 8 ^ o[255 & (n ^ str.charCodeAt(t))]
        }

        return (-1 ^ n) >>> 0;
    },


    /**
     * Округление
     * @param number
     * @param precision
     * @returns {number}
     */
    round: function (number, precision) {

        precision = typeof precision !== 'undefined' ? parseInt(precision) : 0;

        if (precision === 0) {
            return Math.round(number);

        } else if (precision > 0) {
            let pow = Math.pow(10, precision);
            return Math.round(number * pow) / pow;

        } else {
            let pow = Math.pow(10, precision);
            return Math.round(number / pow) * pow;
        }
    }
}

export default coreuiFormUtils;