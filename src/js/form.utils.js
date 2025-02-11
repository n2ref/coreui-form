import 'ejs/ejs.min';
import FormPrivate from "./form.private";


let FormUtils = {

    _templates: {},


    /**
     * Получение значения поля
     * @param {FormInstance} form
     * @param {string} name
     * @returns {string|number|null}
     */
    getFieldValue: function (form, name) {

        let formRecord = form.getRecord();

        if (formRecord &&
            typeof name === 'string' &&
            formRecord.hasOwnProperty(name) &&
            ['string', 'number', 'object'].indexOf(typeof formRecord[name]) >= 0
        ) {
            return formRecord[name];
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
     * @param {FormInstance} form
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
                let instance = FormPrivate.initField(form, field);

                if (typeof instance !== 'object') {
                    return;
                }

                fields.push({
                    contentId: instance.getContentId(),
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
    },


    /**
     * Рендер шаблона
     * @param {string} template
     * @param {object} options
     * @returns {string}
     */
    render: function (template, options) {

        let tplName = this.crc32(template);

        if ( ! this._templates.hasOwnProperty(tplName)) {
            this._templates[tplName] = ejs.compile(template)
        }

        return this._templates[tplName](options);
    }
}

export default FormUtils;