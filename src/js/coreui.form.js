
import coreuiFormInstance from './coreui.form.instance';
import coreuiFormUtils    from "./coreui.form.utils";

var coreuiForm = {

    lang: {},
    fields: {},
    controls: {},

    _instances: {},
    _settings: {
        labelWidth: 200,
        lang: 'en',
        class: '',
        sendDataFormat: 'form',
        errorMessageScrollOffset: 70
    },


    /**
     * Создание экземпляра формы
     * @param {object} options
     * @returns {coreuiFormInstance}
     */
    create: function (options) {

        if ( ! options.hasOwnProperty('lang')) {
            options.lang = this.getSetting('lang');
        }

        let langList     = this.lang.hasOwnProperty(options.lang) ? this.lang[options.lang] : {};
        options.langList = options.hasOwnProperty('langList') && coreuiFormUtils.isObject(options.langList)
            ? $.extend(true, {}, langList, options.langList)
            : langList;

        let instance = $.extend(true, {}, coreuiFormInstance);
        instance._init(this, options instanceof Object ? options : {});

        let formId = instance.getId();
        this._instances[formId] = instance;

        return instance;
    },


    /**
     * Получение экземпляра формы по id
     * @param {string} id
     * @returns {coreuiFormInstance|null}
     */
    get: function (id) {

        if ( ! this._instances.hasOwnProperty(id)) {
            return null;
        }

        if ($('#coreui-form-' + this._instances[id])[0]) {
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

export default coreuiForm;