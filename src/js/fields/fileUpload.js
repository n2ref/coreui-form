
import 'ejs/ejs.min';
import fileUp          from 'fileup-js/src/js/main';
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import coreuiForm      from "../coreui.form";
import Field           from "../abstract/Field";


class FieldFileUpload extends Field {

    _fileUp = null;


    /**
     * Инициализация
     * @param {object} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'fileUpload',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            outContent: null,
            description: null,
            errorText: null,
            fields: null,
            required: null,
            invalidText: null,
            validText: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null,
            options: {
                url: '',
                httpMethod: 'post',
                fieldName: 'file',
                showButton: true,
                showDropzone: false,
                autostart: true,
                extraFields: true,
                accept: null,
                timeout: null,
                filesLimit: null,
                sizeLimit: null,
                templateFile: null,
            }
        }, options);

        super(form, options, index);

        let that = this;

        form.on('show', function () {
            that._initEvents();
        });
    }


    /**
     * Изменение режима поля только для чтения
     * @param {boolean} isReadonly
     */
    readonly(isReadonly) {

        this._value            = this._getFiles();
        this._options.readonly = !! isReadonly;

        if (this._fileUp) {
            this._fileUp.destruct();
        }

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        this._initEvents();
    }


    /**
     * Получение значения из поля
     * @returns {Array}
     */
    getValue() {

        let files = this._getFiles();

        $.each(files, function (key, file) {
            if (file.hasOwnProperty('urlPreview')) {
                delete file.urlPreview;
            }
            if (file.hasOwnProperty('urlDownload')) {
                delete file.urlDownload;
            }
        });

        return files;
    }


    /**
     * Установка значения в поле
     * @param {Array} value
     */
    setValue(value) {

        if ( ! Array.isArray(value)) {
            return;
        }

        let that = this;

        this._fileUp.removeAll();

        $.each(value, function (key, item) {
            if (item instanceof File) {
                that._fileUp.appendFile(item);

            } else if (coreuiFormUtils.isObject(item)) {
                that._fileUp.appendFileByData(item);
            }
        });
    }


    /**
     * Установка валидности поля
     * @param {boolean|null} isValid
     * @param {text} text
     */
    validate(isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);

        container.find('> .validate-content').remove();

        if (isValid) {
            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="validate-content text-success">' + text + '</div>');
            }

        } else if (isValid === false) {
            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="validate-content text-danger">' + text + '</div>');
            }
        }
    }


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid() {

        if (this._options.required && this._fileUp) {
            return this._getFiles().length > 0;
        }

        return null;
    }


    /**
     * Получение экземпляра fileUp
     * @return {null}
     */
    getFileUp() {

        return this._fileUp;
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent() {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    }


    /**
     * Сборка содержимого
     * @private
     */
    _renderContent() {

        let lang          = this._form.getLang();
        let fileUpOptions = coreuiFormUtils.isObject(this._options.options) ? this._options.options : {};
        let isMultiple    = ! (coreuiFormUtils.isNumeric(fileUpOptions.filesLimit) && Number(fileUpOptions.filesLimit) === 1);
        let accept        = typeof fileUpOptions.accept === 'string' && fileUpOptions.accept ? fileUpOptions.accept : null;

        return ejs.render(coreuiFormTpl['fields/file-upload.html'], {
            id: this._hash,
            showButton: !! fileUpOptions.showButton,
            showDropzone: !! fileUpOptions.showDropzone,
            isMultiple: isMultiple,
            accept: accept,
            lang: lang,
        });
    }


    /**
     * Сборка содержимого только для просмотра
     * @private
     */
    _renderContentReadonly() {

        let lang          = this._form.getLang();
        let fileUpOptions = coreuiFormUtils.isObject(this._options.options) ? this._options.options : {};
        let isMultiple    = ! (coreuiFormUtils.isNumeric(fileUpOptions.filesLimit) && Number(fileUpOptions.filesLimit) === 1);
        let accept        = typeof fileUpOptions.accept === 'string' && fileUpOptions.accept ? fileUpOptions.accept : null;

        return ejs.render(coreuiFormTpl['fields/file-upload.html'], {
            id: this._hash,
            showButton: false,
            showDropzone: false,
            isMultiple: isMultiple,
            accept: accept,
            lang: lang,
        });
    }


    /**
     * Инициализация событий
     * @private
     */
    _initEvents() {

        let options     = coreuiFormUtils.isObject(this._options.options) ? this._options.options : {};
        let formOptions = this._form.getOptions();
        let queue       = $('#fileup-' + this._hash + '-queue');

        let createOptions = {
            url: typeof options.url === 'string' ? options.url : '',
            input: 'fileup-' + this._hash,
            queue: queue
        };

        if (formOptions.showDropzone) {
            createOptions.dropzone = 'fileup-' + this._hash + '-dropzone';
        }
        if (typeof formOptions.lang === 'string') {
            createOptions.lang = formOptions.lang;
        }
        if (typeof options.fieldName === 'string') {
            createOptions.fieldName = options.fieldName;
        }
        if (typeof options.httpMethod === 'string') {
            createOptions.httpMethod = options.httpMethod;
        }
        if (coreuiFormUtils.isObject(options.extraFields)) {
            createOptions.extraFields = options.extraFields;
        }
        if (coreuiFormUtils.isNumeric(options.sizeLimit)) {
            createOptions.sizeLimit = options.sizeLimit;
        }
        if (coreuiFormUtils.isNumeric(options.filesLimit)) {
            createOptions.filesLimit = options.filesLimit;
        }
        if (coreuiFormUtils.isNumeric(options.timeout)) {
            createOptions.timeout = options.timeout;
        }
        if (typeof options.autostart === 'boolean') {
            createOptions.autostart = options.autostart;
        }
        if (typeof options.templateFile === 'string') {
            createOptions.templateFile = options.templateFile;
        }
        if (this._options.readonly) {
            createOptions.showRemove = false;
        }
        if (Array.isArray(this._value)) {
            createOptions.files = this._value;
        }


        this._fileUp = fileUp.create(createOptions);

        if (Array.isArray(this._value) && this._value.length > 0) {
            queue.addClass('mt-2');
        }

        this._fileUp.on('select', function (file) {
            queue.addClass('mt-2');
        });

        this._fileUp.on('remove', function (file) {

            if (Object.keys(this.getFiles()).length === 0) {
                setTimeout(function () {
                    queue.removeClass('mt-2');
                }, 150);
            }
        });


        this._fileUp.on('load_success', function (file, response) {
            let data = null;

            if (response) {
                try {
                    data = JSON.parse(response);

                } catch (e) {
                    file.showError('Incorrect response JSON format');
                }
            }

            if (data) {
                file.setOption('upload', data);
            }
        });
    }


    /**
     * Получение текущего списка файлов
     * @return {*[]}
     * @private
     */
    _getFiles() {

        if ( ! this._fileUp) {
            return [];
        }

        let files  = this._fileUp.getFiles();
        let results = [];

        if (Object.keys(files).length > 0) {
            $.each(files, function (key, file) {
                let fileBinary = file.getFile();
                let result     = file.getOptions();

                result.name = file.getName();
                result.size = file.getSize();

                if (fileBinary && fileBinary instanceof File) {
                    result.type = fileBinary.type;
                }

                results.push(result);
            });
        }

        return results;
    }
}

coreuiForm.fields.fileUpload = FieldFileUpload;

export default FieldFileUpload;