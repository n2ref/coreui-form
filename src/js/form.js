
import FormInstance from './form.instance';
import FormUtils    from "./form.utils";

let Form = {

    lang: {},
    fields: {},
    controls: {},
    abstract: {},

    _instances: {},
    _settings: {
        labelWidth: 200,
        lang: 'en',
        class: '',
        sendDataFormat: 'json',
        errorMessageScrollOffset: 70
    },


    /**
     * Создание экземпляра формы
     * @param {object} options
     * @returns {FormInstance}
     */
    create: function (options) {

        if ( ! FormUtils.isObject(options)) {
            options = {};
        }

        options = $.extend(true, {}, options);

        if ( ! options.hasOwnProperty('lang')) {
            options.lang = this.getSetting('lang');
        }

        let langList     = this.lang.hasOwnProperty(options.lang) ? this.lang[options.lang] : {};
        options.langList = options.hasOwnProperty('langList') && FormUtils.isObject(options.langList)
            ? $.extend(true, {}, langList, options.langList)
            : langList;

        options.errorMessageScrollOffset = options.hasOwnProperty('errorMessageScrollOffset') && FormUtils.isNumeric(options.errorMessageScrollOffset)
            ? options.errorMessageScrollOffset
            : this.getSetting('errorMessageScrollOffset');

        options.labelWidth = options.hasOwnProperty('labelWidth')
            ? options.labelWidth
            : this.getSetting('labelWidth');

        options.errorClass = options.hasOwnProperty('errorClass') && typeof options.errorClass === 'string'
            ? options.errorClass
            : this.getSetting('errorClass');

        if ( ! options.hasOwnProperty('send') ||
             ! FormUtils.isObject(options.send) ||
             ! options.send.hasOwnProperty('format') ||
            typeof options.send.format !== 'string'
        ) {
            if ( ! options.hasOwnProperty('send') || ! FormUtils.isObject(options.send)) {
                options.send = {};
            }

            options.send.format = this.getSetting('sendDataFormat');
        }


        let instance = new FormInstance(options);

        let formId = instance.getId();
        this._instances[formId] = instance;

        return instance;
    },


    /**
     * Получение экземпляра формы по id
     * @param {string} id
     * @returns {FormInstance|null}
     */
    get: function (id) {

        if ( ! this._instances.hasOwnProperty(id)) {
            return null;
        }

        if ( ! $('#coreui-form-' + id)[0]) {
            delete this._instances[id];
            return null;
        }

        return this._instances[id];
    },


    /**
     * Установка настроек
     * @param {object} settings
     */
    setSettings: function(settings) {

        this._settings = $.extend({}, this._settings, settings);
    },


    /**
     * Получение значения настройки
     * @param {string} name
     */
    getSetting: function(name) {

        let value = null;

        if (this._settings.hasOwnProperty(name)) {
            value = this._settings[name];
        }

        return value;
    }
}

export default Form;