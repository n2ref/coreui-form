import HelperField from "../field";
import Utils       from "../../utils";

import HelpersFieldsPropertiesName             from "./properties/name";
import HelpersFieldsPropertiesLabel            from "./properties/label";
import HelpersFieldsPropertiesDescription      from "./properties/description";
import HelpersFieldsPropertiesDescriptionLabel from "./properties/descriptionLabel";
import HelpersFieldsPropertiesHelp             from "./properties/help";
import HelpersFieldsPropertiesWidthLabel       from "./properties/widthLabel";
import HelpersFieldsPropertiesRequired         from "./properties/required";
import HelpersFieldsPropertiesReadonly         from "./properties/readonly";
import HelpersFieldsPropertiesInvalidText      from "./properties/invalidText";
import HelpersFieldsPropertiesValidText        from "./properties/validText";
import HelpersFieldsPropertiesPrefix           from "./properties/prefix";
import HelpersFieldsPropertiesSuffix           from "./properties/sufix";
import HelpersFieldsPropertiesShow             from "./properties/show";
import HelpersFieldsPropertiesFields           from "./properties/fields";
import HelpersFieldsPropertiesNoSend           from "./properties/noSend";
import HelpersFieldsPropertiesOn               from "./properties/on";

import HelperFieldFileUpFile from "./fileUpload/file";

/**
 * @extends {HelpersFieldsPropertiesName}
 * @extends {HelpersFieldsPropertiesLabel}
 * @extends {HelpersFieldsPropertiesDescription}
 * @extends {HelpersFieldsPropertiesDescriptionLabel}
 * @extends {HelpersFieldsPropertiesHelp}
 * @extends {HelpersFieldsPropertiesReadonly}
 * @extends {HelpersFieldsPropertiesRequired}
 * @extends {HelpersFieldsPropertiesWidthLabel}
 * @extends {HelpersFieldsPropertiesInvalidText}
 * @extends {HelpersFieldsPropertiesValidText}
 * @extends {HelpersFieldsPropertiesFields}
 * @extends {HelpersFieldsPropertiesPrefix}
 * @extends {HelpersFieldsPropertiesSuffix}
 * @extends {HelpersFieldsPropertiesShow}
 * @extends {HelpersFieldsPropertiesNoSend}
 * @extends {HelpersFieldsPropertiesOn}
 */
class HelperFieldFileUpload extends HelperField {

    _url          = null;
    _httpMethod   = null;
    _accept       = null;
    _showInput    = null;
    _showDropzone = null;
    _autostart    = null;
    _sizeLimit    = null;
    _filesLimit   = null;
    _templateFile = null;
    _extraFields  = null;
    _files        = null;

    /**
     * @param {string} name
     * @param {string} label
     */
    constructor(name, label) {
        super();

        Object.assign(this, HelpersFieldsPropertiesName);
        Object.assign(this, HelpersFieldsPropertiesLabel);
        Object.assign(this, HelpersFieldsPropertiesDescription);
        Object.assign(this, HelpersFieldsPropertiesDescriptionLabel);
        Object.assign(this, HelpersFieldsPropertiesHelp);
        Object.assign(this, HelpersFieldsPropertiesReadonly);
        Object.assign(this, HelpersFieldsPropertiesRequired);
        Object.assign(this, HelpersFieldsPropertiesWidthLabel);
        Object.assign(this, HelpersFieldsPropertiesInvalidText);
        Object.assign(this, HelpersFieldsPropertiesValidText);
        Object.assign(this, HelpersFieldsPropertiesFields);
        Object.assign(this, HelpersFieldsPropertiesPrefix);
        Object.assign(this, HelpersFieldsPropertiesSuffix);
        Object.assign(this, HelpersFieldsPropertiesShow);
        Object.assign(this, HelpersFieldsPropertiesNoSend);
        Object.assign(this, HelpersFieldsPropertiesOn);

        this.setName(name);
        this.setLabel(label);
    }


    /**
     * Установка адреса для загружаемых файлов
     * @param {string|null} url
     * @return {HelperFieldFileUpload}
     */
    setUrl(url = null) {
        this._url = url;
        return this;
    }
    
    
    /**
     * Получение адреса для загружаемых файлов
     * @return {string|null}
     */
    getUrl() {
        return this._url;
    }
    
    
    /**
     * Установка http метода для загружаемых файлов
     * @param {string|null} httpMethod
     * @return {HelperFieldFileUpload}
     */
    setHttpMethod(httpMethod = null) {
        this._httpMethod = httpMethod;
        return this;
    }
    
    
    /**
     * Получение http метода для загружаемых файлов
     * @return {string|null}
     */
    getHttpMethod() {
        return this._httpMethod;
    }
    
    
    /**
     * Установка шаблона загружаемых файлов
     * @param {string|null} template
     * @return {HelperFieldFileUpload}
     */
    setFileTemplate(template = null) {
        this._templateFile = template;
        return this;
    }
    
    
    /**
     * Получение шаблона загружаемых файлов
     * @return {string|null}
     */
    getFileTemplate() {
        return this._templateFile;
    }
    
    
    /**
     * Установка свойства с ограничением по типу загружаемых файлов
     * @param {string|null} accept
     * @return {HelperFieldFileUpload}
     */
    setAccept(accept = null) {
        this._accept = accept;
        return this;
    }
    
    
    /**
     * Установка свойства с возможностью загружать только картинки
     * @return {HelperFieldFileUpload}
     */
    setAcceptImage() {
        this._accept = 'image/*';
        return this;
    }
    
    
    /**
     * Установка свойства с возможностью загружать только видео
     * @return {HelperFieldFileUpload}
     */
    setAcceptVideo() {
        this._accept = 'video/*';
        return this;
    }
    
    
    /**
     * Установка свойства с возможностью загружать только аудио
     * @return {HelperFieldFileUpload}
     */
    setAcceptAudio() {
        this._accept = 'audio/*';
        return this;
    }
    
    
    /**
     * Установка свойства с возможностью загружать только PDF
     * @return {HelperFieldFileUpload}
     */
    setAcceptPDF() {
        this._accept = 'application/pdf';
        return this;
    }
    
    
    /**
     * Установка свойства с возможностью загружать только zip
     * @return {HelperFieldFileUpload}
     */
    setAcceptZip() {
        this._accept = 'application/zip, application/zip-compressed, application/x-zip-compressed, multipart/x-zip, application/octet-stream';
        return this;
    }
    
    
    /**
     * Получение свойства с ограничением по типу загружаемых файлов
     * @return {string|null}
     */
    getAccept() {
        return this._accept;
    }
    
    
    /**
     * Установка лимита в количестве загружаемых файлов
     * @param {int|null} count
     * @return this
     */
    setFilesLimit(count = null) {
        this._filesLimit = count;
        return this;
    }
    
    
    /**
     * Получение лимита в количестве загружаемых файлов
     * @return {int|null}
     */
    getFilesLimit() {
    
        return this._filesLimit;
    }
    
    
    /**
     * Установка лимита в размере загружаемых файлов
     * @param {int|null} bytes
     * @return this
     */
    setSizeLimit(bytes = null) {
    
        this._sizeLimit = bytes;
        return this;
    }
    
    
    /**
     * Получение лимита в размере загружаемых файлов
     * @return {int|null}
     */
    getSizeLimit() {
    
        return this._sizeLimit;
    }
    
    
    /**
     * Установка признака автоматической загрузки файлов
     * @param {boolean|null} isAutostart
     * @return this
     */
    setAutostart(isAutostart = null) {
        this._autostart = isAutostart;
        return this;
    }
    
    
    /**
     * Получение признака автоматической загрузки файлов
     * @return {boolean|null}
     */
    getAutostart() {
        return this._autostart;
    }
    
    
    /**
     * Установка признака для отображения поля для выбора файла
     * @param {boolean|null} show
     * @return this
     */
    setShowInput(show = null) {
        this._showInput = show;
        return this;
    }
    
    
    /**
     * Получение признака для отображения поля для выбора файла
     * @return {boolean|null}
     */
    getShowInput() {
    
        return this._showInput;
    }
    
    
    /**
     * Установка признака для отображения dropzone
     * @param {boolean|null} show
     * @return this
     */
    setShowDropzone(show = null) {
        this._showDropzone = show;
        return this;
    }
    
    
    /**
     * Получение признака для отображения dropzone
     * @return {boolean|null}
     */
    getShowDropzone() {
    
        return this._showDropzone;
    }
    
    
    /**
     * Установка дополнительных полей которые будут отправлены на сервер вместе с файлом
     * @param {Array|null} fields
     * @return this
     */
    setExtraFields(fields = null) {
        this._extraFields = fields;
        return this;
    }
    
    
    /**
     * Получение дополнительных полей которые будут отправлены на сервер вместе с файлом
     * @return array|null
     */
    getExtraFields() {
    
        return this._extraFields;
    }
    
    
    /**
     * Добавление загруженного ранее файла для отображения его в списке
     * @param {string} name
     * @return {HelperFieldFileUpFile}
     */
    addFile(name) {
    
        let file = new HelperFieldFileUpFile(name);

        if ( ! Array.isArray(this._files)) {
            this._files = [];
        }

        this._files.push(file);
    
        return file;
    }
    
    
    /**
     * Добавление загруженных ранее файлов для отображения их в списке
     * @param {Array} files
     * @return {HelperFieldFileUpload}
     */
    addFiles(files) {

        if ( ! Array.isArray(files)) {
            return this;
        }

        let that = this;

        files.map(function (fileData) {
            if ( ! Utils.isObject(fileData) || ! fileData.name) {
                return;
            }
    
            let file = new HelperFieldFileUpFile(fileData.name);
    
            if (fileData.size && Utils.isNumeric(fileData.size)) {
                file.setSize(fileData.size);
            }
            if (fileData.type && typeof fileData.type === 'string') {
                file.setMimeType(fileData.type);
            }
            if (fileData.urlPreview && typeof fileData.urlPreview === 'string') {
                file.setUrlPreview(fileData.urlPreview);
            }
            if (fileData.urlDownload && typeof fileData.urlDownload === 'string') {
                file.setUrlDownload(fileData.urlDownload);
            }

            that._files.push(file);
        });
    
        return this;
    }
    
    
    /**
     * Очистка ранее добавленных файлов
     * @return {HelperFieldFileUpload}
     */
    clearFiles() {
    
        this._files = [];
        return this;
    }


    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = {
            type : 'fileUpload'
        };

        if (this._name !== null)             { result.name             = this._name; }
        if (this._label !== null)            { result.label            = this._label; }
        if (this._help !== null)             { result.help             = this._help; }
        if (this._description !== null)      { result.description      = this._description; }
        if (this._descriptionLabel !== null) { result.descriptionLabel = this._descriptionLabel; }
        if (this._required !== null)         { result.required         = this._required; }
        if (this._readonly !== null)         { result.readonly         = this._readonly; }
        if (this._widthLabel !== null)       { result.widthLabel       = this._widthLabel; }
        if (this._invalidText !== null)      { result.invalidText      = this._invalidText; }
        if (this._validText !== null)        { result.validText        = this._validText; }
        if (this._prefix !== null)           { result.prefix           = this._prefix; }
        if (this._suffix !== null)           { result.suffix           = this._suffix; }
        if (this._show !== null)             { result.show             = this._show; }
        if (this._position !== null)         { result.position         = this._position; }
        if (this._noSend !== null)           { result.noSend           = this._noSend; }
        if (this._on !== null)               { result.on               = this._on; }



        result.options = {};

        if (this._url !== null)          { result.options.url          = this._url; }
        if (this._httpMethod !== null)   { result.options.httpMethod   = this._httpMethod; }
        if (this._accept !== null)       { result.options.accept       = this._accept; }
        if (this._filesLimit !== null)   { result.options.filesLimit   = this._filesLimit; }
        if (this._sizeLimit !== null)    { result.options.sizeLimit    = this._sizeLimit; }
        if (this._showInput !== null)    { result.options.showInput    = this._showInput; }
        if (this._showDropzone !== null) { result.options.showDropzone = this._showDropzone; }
        if (this._extraFields !== null)  { result.options.extraFields  = this._extraFields; }
        if (this._autostart !== null)    { result.options.autostart    = this._autostart; }
        if (this._templateFile !== null) { result.options.templateFile = this._templateFile; }


        if (Array.isArray(this._files)) {
            result.options.files = [];

            this._files.map(function (file) {
                if (Utils.isObject(file)) {
                    if (typeof file.toObject === 'function') {
                        result.options.files.push(file.toObject());
                    } else {
                        result.options.files.push(file);
                    }
                }
            });
        }


        if (Array.isArray(this._fields)) {
            let fields = [];

            this._fields.map(function (field) {
                if (Utils.isObject(field)) {
                    if (typeof field.toObject === 'function') {
                        fields.push(field.toObject());
                    } else {
                        fields.push(field);
                    }
                }
            });

            result.fields = fields;
        }

        return result;
    }
}

export default HelperFieldFileUpload;