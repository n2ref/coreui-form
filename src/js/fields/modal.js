
import FormTpl     from "../tpl";
import Utils   from "../utils";
import Private from "../private";
import Field           from "../abstract/Field";


class FieldModal extends Field {

    _text = '';


    /**
     * Инициализация
     * @param {Form} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'modal',
            name: null,
            label: null,
            labelWidth: null,
            width: null,
            prefix: null,
            suffix: null,
            description: null,
            errorText: null,
            fields: [],
            options: {
                title: '',
                size: 'lg',
                url: '',
                onHidden: null,
                onClear: null,
                onChange: null,
            },
            required: null,
            readonly: null,
            show: true,
            position: null,
            noSend: null,
            on: null,
        }, options);

        super(form, options);

        let formRecord = form.getRecord();

        if (typeof options.name === 'string' &&
            formRecord.hasOwnProperty(options.name) &&
            ['object'].indexOf(typeof formRecord[options.name]) >= 0
        ) {
            let record = formRecord[options.name];

            this._value = record.hasOwnProperty('value') && ['number', 'string'].indexOf(typeof(record.value)) >= 0 ? record.value : '';
            this._text  = record.hasOwnProperty('text') && ['number', 'string'].indexOf(typeof(record.text)) >= 0 ? record.text : '';
        }


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

        super.readonly(isReadonly);

        if ( ! isReadonly) {
            this._initEvents();
        }
    }


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue() {

        return this._readonly
            ? this._value
            : $('.content-' + this.getContentId() + ' input.coreui-form-modal-value').val();
    }


    /**
     * Установка значения в поле
     * @param {object} value
     */
    setValue(value) {

        if ( ! Utils.isObject(value)) {
            return;
        }

        let text      = value.hasOwnProperty('text') && typeof value.text === 'string' ? value.text : '';
        let contentId = this.getContentId();

        value = value.hasOwnProperty('value') && typeof value.value === 'string' ? value.value : '';

        this._value = value;

        if (this._readonly) {
            $('.content-' + contentId).text(text);

        } else {
            let elementValue = $('.content-' + contentId + ' .coreui-form-modal-value');
            let elementText  = $('.content-' + contentId + ' .coreui-form-modal-text');
            let oldValue     = elementValue.val();

            elementValue.val(value);
            elementText.val(text);


            if (oldValue != value) {
                let modal = this._options.hasOwnProperty('options') && typeof (this._options.options) === 'object'
                    ? this._options.options
                    : {};

                if (modal.hasOwnProperty('onChange')) {
                    if (typeof(modal.onChange) === 'function') {
                        modal.onChange(this);

                    } else if (typeof(modal.onChange) === 'string') {
                        (new Function('modal', modal.onChange))(this);
                    }
                }

                Private.trigger(this._form, 'change-modal.coreui.form', [this], this);
            }
        }
    }


    /**
     * Установка валидности поля
     * @param {boolean|null} isValid
     * @param {text} text
     */
    validate(isValid, text) {

        if (this._readonly) {
            return;
        }

        let container = $('.content-' + this.getContentId());

        container.find('.text-success').remove();
        container.find('.text-danger').remove();

        if (isValid === null) {
            return;
        }

        if (isValid) {
            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-success">' + text + '</div>');
            }

        } else {
            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-danger">' + text + '</div>');
            }
        }
    }


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid() {

        if (this._options.required && ! this._readonly) {
            return !! this.getValue();
        }

        return true;
    }


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent () {

        let fieldOptions = this.getOptions();
        let attributes   = [];
        let textAttr     = {
            type: 'text',
            readonly: 'readonly',
            class: 'form-control coreui-form-modal-text',
            value: this._text !== null ? this._text : ''
        };

        if (fieldOptions.required) {
            textAttr.required = 'required';
        }

        if (fieldOptions.hasOwnProperty('attr') &&
            typeof fieldOptions.attr === 'object' &&
            Array.isArray(fieldOptions.attr)
        ) {
            textAttr = Utils.mergeAttr(textAttr, fieldOptions.attr);
        }

        $.each(textAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        let field = $(
            Utils.render(FormTpl['fields/modal.html'], {
                readonly: this._readonly,
                required: fieldOptions.required,
                name: fieldOptions.name,
                value: this._value !== null ? this._value : '',
                text: this._text !== null ? this._text : '',
                lang: this._form.getLang(),width: this._options.width,
                attr: attributes.length > 0 ? attributes.join(' ') : '',
            })
        );


        if (this._options.on && Utils.isObject(this._options.on)) {
            let input = field.find('input').addBack('input');

            for (let [eventName, callback] of Object.entries(this._options.on)) {

                if (typeof eventName === 'string' && typeof callback === 'function') {
                    input.on(eventName, function (event) {
                        callback({ field: this, event: event });
                    })
                }
            }
        }

        return field;
    }


    /**
     * Инициализация событий
     * @private
     */
    _initEvents() {

        let that      = this;
        let contentId = this.getContentId();
        let modal     = this._options.hasOwnProperty('options') && typeof(this._options.options) === 'object'
            ? this._options.options
            : {};


        // Очистка
        $('.content-' + contentId + ' .btn-modal-clear').click(function (e) {
            if (modal.hasOwnProperty('onClear')) {
                if (typeof(modal.onClear) === 'function') {
                    modal.onClear(that);

                } else if (typeof(modal.onClear) === 'string') {
                    (new Function('field', modal.onClear))(that);
                }
            }

            Private.trigger(that._form, 'modal_clear', [that, e ], that);

            that.setValue({value: '', text: ''});
        });

        // Выбор
        $('.content-' + contentId + ' .btn-modal-select').click(function (e) {
            let title = modal.hasOwnProperty('title') && typeof(modal.title) === 'string'
                ? modal.title
                : '';

            let size = modal.hasOwnProperty('size') && typeof(modal.size) === 'string'
                ? modal.size
                : 'lg';

            let url = modal.hasOwnProperty('url') && typeof(modal.url) === 'string'
                ? modal.url
                : '';

            if ( ! url) {
                return;
            }


            let modalId      = Utils.hashCode();
            let modalLoading = Utils.render(FormTpl['fields/modal-loading.html'], {
                lang: that._form.getLang(),
            });


            if (CoreUI.hasOwnProperty('modal')) {
                let onShow   = null;
                let onHidden = null;

                if (modal.hasOwnProperty('onHidden')) {
                    if (typeof(modal.onHidden) === 'function') {
                        onHidden = modal.onHidden;

                    } else if (typeof(modal.onHidden) === 'string') {
                        onHidden = new Function(modal.onHidden);
                    }
                }

                if (modal.hasOwnProperty('onShow')) {
                    if (typeof(modal.onShow) === 'function') {
                        onShow = modal.onShow;

                    } else if (typeof(modal.onShow) === 'string') {
                        onShow = new Function(modal.onShow)
                    }
                }

                CoreUI.modal.show(title, modalLoading, {
                    id: modalId,
                    size: size,
                    onShow: onShow,
                    onHidden: onHidden
                });
            }

            $.ajax({
                url: url,
                method: 'GET',
                beforeSend: function(xhr) {
                    Private.trigger(that._form, 'modal_load_before', [that, xhr ], that);
                },
                success: function (result) {
                    $('#modal-' + modalId + ' .modal-body').html(result);
                    Private.trigger(that._form, 'modal_load_success', [that, result ], that);
                },
                error: function(xhr, textStatus, errorThrown) {
                    Private.trigger(that._form, 'modal_load_error', [that, xhr, textStatus, errorThrown ], that);
                },
                complete: function(xhr, textStatus) {
                    Private.trigger(that._form, 'modal_load_complete', [that, xhr, textStatus ], that);
                },
            });


            Private.trigger(that._form, 'modal_select', [that, e ], that);
        });
    }
}

export default FieldModal;