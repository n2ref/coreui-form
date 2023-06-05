
var CoreUI = typeof CoreUI !== 'undefined' ? CoreUI : {};

CoreUI.form = {

    lang: {},
    fields: {},
    controls: {},

    _instances: {},
    _settings: {
        labelWidth: 200,
        lang: 'en',
        class: '',
        errorMessageScrollOffset: 70
    },


    /**
     * Создание экземпляра формы
     * @param {object} options
     * @returns {CoreUI.form.instance}
     */
    create: function (options) {

        let instance = $.extend(true, {}, this.instance);
        instance._init(options instanceof Object ? options : {});

        let formId = instance.getId();
        this._instances[formId] = instance;

        return instance;
    },


    /**
     * Получение экземпляра формы по id
     * @param {string} id
     * @returns {CoreUI.form.instance|null}
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

        CoreUI.form._settings = $.extend({}, this._settings, settings);
    },


    /**
     * Получение значения настройки
     * @param {string} name
     */
    getSetting: function(name) {

        let value = null;

        if (CoreUI.form._settings.hasOwnProperty(name)) {
            value = CoreUI.form._settings[name];
        }

        return value;
    }
}