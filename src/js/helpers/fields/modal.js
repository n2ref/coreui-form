import Utils       from "../../utils";
import HelperField from "../field";

import HelpersFieldsPropertiesName             from "./properties/name";
import HelpersFieldsPropertiesLabel            from "./properties/label";
import HelpersFieldsPropertiesDescription      from "./properties/description";
import HelpersFieldsPropertiesDescriptionLabel from "./properties/descriptionLabel";
import HelpersFieldsPropertiesHelp             from "./properties/help";
import HelpersFieldsPropertiesWidth            from "./properties/width";
import HelpersFieldsPropertiesWidthLabel       from "./properties/widthLabel";
import HelpersFieldsPropertiesAttributes       from "./properties/attributes";
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

/**
 * @extends {HelpersFieldsPropertiesName}
 * @extends {HelpersFieldsPropertiesLabel}
 * @extends {HelpersFieldsPropertiesDescription}
 * @extends {HelpersFieldsPropertiesDescriptionLabel}
 * @extends {HelpersFieldsPropertiesHelp}
 * @extends {HelpersFieldsPropertiesWidth}
 * @extends {HelpersFieldsPropertiesWidthLabel}
 * @extends {HelpersFieldsPropertiesAttributes}
 * @extends {HelpersFieldsPropertiesRequired}
 * @extends {HelpersFieldsPropertiesReadonly}
 * @extends {HelpersFieldsPropertiesInvalidText}
 * @extends {HelpersFieldsPropertiesValidText}
 * @extends {HelpersFieldsPropertiesPrefix}
 * @extends {HelpersFieldsPropertiesSuffix}
 * @extends {HelpersFieldsPropertiesShow}
 * @extends {HelpersFieldsPropertiesFields}
 * @extends {HelpersFieldsPropertiesNoSend}
 * @extends {HelpersFieldsPropertiesOn}
 */
class HelperFieldModal extends HelperField {

    _title     = null;
    _size      = null;
    _url       = null;
    _onHidden = null;
    _onClear  = null;
    _onChange = null;
    
    size = {
        SM   : 'sm',
        MD   : '',
        LG   : 'lg',
        XL   : 'xl',
        FULL : 'fullscreen',
    };
    
    
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
        Object.assign(this, HelpersFieldsPropertiesWidth);
        Object.assign(this, HelpersFieldsPropertiesWidthLabel);
        Object.assign(this, HelpersFieldsPropertiesAttributes);
        Object.assign(this, HelpersFieldsPropertiesRequired);
        Object.assign(this, HelpersFieldsPropertiesReadonly);
        Object.assign(this, HelpersFieldsPropertiesInvalidText);
        Object.assign(this, HelpersFieldsPropertiesValidText);
        Object.assign(this, HelpersFieldsPropertiesPrefix);
        Object.assign(this, HelpersFieldsPropertiesSuffix);
        Object.assign(this, HelpersFieldsPropertiesShow);
        Object.assign(this, HelpersFieldsPropertiesFields);
        Object.assign(this, HelpersFieldsPropertiesNoSend);
        Object.assign(this, HelpersFieldsPropertiesOn);

        this.setName(name);
        this.setLabel(label);
    }



    /**
     * Установка ссылки
     * @param {string} url
     * @return {HelperFieldModal}
     */
    setUrl(url) {

        this._url = url;
        return this;
    }
    
    
    /**
     * Получение ссылки
     * @return string
     */
    getUrl() {
    
        return this._url;
    }
    
    
    /**
     * Установка размера модала
     * @param {string} size
     * @return {HelperFieldModal}
     */
    setSize(size) {
    
        this._size = size;
        return this;
    }
    
    
    /**
     * Получение размера модала
     * @return string
     */
    getSize() {
        return this._size;
    }
    
    
    /**
     *  Установка заголовка модала
     * @param {string} title
     * @return {HelperFieldModal}
     */
    setTitle(title) {
    
        this._title = title;
        return this;
    }
    
    
    /**
     * Получение заголовка модала
     * @return string
     */
    getTitle() {
        return this._title;
    }
    
    
    /**
     * Установка события на закрытие
     * @param {string|null} onHidden
     * @return {HelperFieldModal}
     */
    setOnHidden(onHidden = null) {
    
        this._onHidden = onHidden;
        return this;
    }
    
    
    /**
     * Получение события на закрытие
     * @return {string|null}
     */
    getOnHidden() {
    
        return this._onHidden;
    }
    
    
    /**
     * Установка события на очистку значения
     * @param {string|null} onClear
     * @return {HelperFieldModal}
     */
    setOnClear(onClear = null) {
    
        this._onClear = onClear;
        return this;
    }
    
    
    /**
     * Получение события на очистку значения
     * @return {string|null}
     */
    getOnClear() {
    
        return this._onClear;
    }
    
    
    /**
     * Установка события на изменение значения
     * @param {string|null} onChange
     * @return {HelperFieldModal}
     */
    setOnChange(onChange = null) {
    
        this._onChange = onChange;
        return this;
    }
    
    
    /**
     * Получение события на изменение значения
     * @return {string|null}
     */
    getOnChange() {
    
        return this._onChange;
    }
    

    /**
     * Преобразование в объект
     * @return {Array}
     */
    toObject() {

        let result = {
            type : 'modal',
            options: {
                title : this._title,
                size  : this._size,
                url   : this._url,
            }
        };

        if (this._onHidden !== null) { result.onHidden = this._onHidden; }
        if (this._onClear !== null)  { result.onClear  = this._onClear; }
        if (this._onChange !== null) { result.onChange = this._onChange; }


        if (this._name !== null)             { result.name             = this._name; }
        if (this._label !== null)            { result.label            = this._label; }
        if (this._help !== null)             { result.help             = this._help; }
        if (this._description !== null)      { result.description      = this._description; }
        if (this._descriptionLabel !== null) { result.descriptionLabel = this._descriptionLabel; }
        if (this._required !== null)         { result.required         = this._required; }
        if (this._readonly !== null)         { result.readonly         = this._readonly; }
        if (this._width !== null)            { result.width            = this._width; }
        if (this._widthLabel !== null)       { result.widthLabel       = this._widthLabel; }
        if (this._invalidText !== null)      { result.invalidText      = this._invalidText; }
        if (this._validText !== null)        { result.validText        = this._validText; }
        if (this._prefix !== null)           { result.prefix           = this._prefix; }
        if (this._suffix !== null)           { result.suffix           = this._suffix; }
        if (this._show !== null)             { result.show             = this._show; }
        if (this._position !== null)         { result.position         = this._position; }
        if (this._options !== null)          { result.options          = this._options; }
        if (this._attr !== null)             { result.attr             = this._attr; }
        if (this._noSend !== null)           { result.noSend           = this._noSend; }
        if (this._on !== null)               { result.on               = this._on; }

        if (this._multiple !== null) {
            if ( ! Utils.isObject(result.attr)) {
                result.attr = {};
            }
            result.attr.multiple = 'multiple';
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

export default HelperFieldModal;