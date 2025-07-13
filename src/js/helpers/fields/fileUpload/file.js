import Utils from "../../../utils";

import HelpersFieldsPropertiesName from "../properties/name";


/**
 * @extends {HelpersFieldsPropertiesName}
 */
class HelperFieldFileUpFile {

    _type        = null;
    _size        = null;
    _urlPreview  = null;
    _urlDownload = null;

    /**
     * @param {string|null} name
     */
    constructor(name) {

        Object.assign(this, HelpersFieldsPropertiesName);

        this.setName(name);
    }


    /**
     * Установка mime типа файла
     * @param {string} type
     * @return {HelperFieldFileUpFile}
     */
    setMimeType(type) {
        this._type = type;
        return this;
    }
    
    
    /**
     * Получение mime типа файла
     * @return {string}
     */
    getMimeType() {
        return this._type;
    }
    
    
    /**
     * Установка размера файлов
     * @param {int|null} bytes
     * @return {HelperFieldFileUpFile}
     */
    setSize(bytes = null) {
        this._size = bytes;
        return this;
    }
    
    
    /**
     * Получение размера файлов
     * @return int|null
     */
    getSize() {
        return this._size;
    }
    
    
    /**
     * Установка ссылки на картинку для предпросмотра
     * @param {string|null} url
     * @return {HelperFieldFileUpFile}
     */
    setUrlPreview(url = null) {
        this._urlUreview = url;
        return this;
    }
    
    
    /**
     * Получение ссылки на картинку для предпросмотра
     * @return {string|null}
     */
    getUrlPreview() {
        return this._urlUreview;
    }
    
    
    /**
     * Установка ссылки для скачивания файла
     * @param {string|null} url
     * @return {HelperFieldFileUpFile}
     */
    setUrlDownload(url = null) {
        this._urlDownload = url;
        return this;
    }
    
    
    /**
     * Получение ссылки для скачивания файла
     * @return {string|null}
     */
    getUrlDownload() {
        return this._urlDownload;
    }
    

    /**
     * Преобразование в объект
     * @return {Object}
     */
    toObject() {

        let result = {
            'name' : this._name
        };


        if (this._size !== null)        { result.size        = this._size; }
        if (this._type !== null)        { result.type        = this._type; }
        if (this._urlPreview !== null)  { result.urlPreview  = this._urlPreview; }
        if (this._urlDownload !== null) { result.urlDownload = this._urlDownload; }

        return result;
    }
}

export default HelperFieldFileUpFile;