
import FormTpl   from "../tpl";
import Utils from "../utils";
import Field           from "../abstract/Field";


class FieldWysiwyg extends Field {

    _editor = null;
    _editorHash = null;


    /**
     * Инициализация
     * @param {Form} form
     * @param {object} options
     * @param {int}    index Порядковый номер на форме
     */
    constructor(form, options, index) {

        options = $.extend(true, {
            type: 'wysiwyg',
            label: null,
            labelWidth: null,
            width: null,
            minWidth: null,
            maxWidth: null,
            height: null,
            minHeight: null,
            maxHeight: null,
            options: {},
            prefix: null,
            suffix: null,
            description: null,
            required: null,
            readonly: false,
            show: true,
            positions: null,
            noSend: null,
            on: null,
        }, options);

        super(form, options, index);

        this._editorHash = Utils.hashCode();

        let that = this;

        form.on('show', function () {
            if ( ! that._readonly) {
                that._initEvents();
            }
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
     * Получение значения из поля
     * @return {string|null}
     */
    getValue() {

        if (this._readonly) {
            return this._value;
        } else {
            return this._editor ? this._editor.getContent() : this._value;
        }
    }


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue(value) {

        this._value = value;

        if (this._readonly) {
            $('.content-' + this.getContentId()).text(value);
        } else {
            if (this._editor) {
                this._editor.setContent(value);
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
    renderContent() {

        let field = Utils.render(FormTpl['fields/wysiwyg.html'], {
            readonly: this._readonly,
            value: this._value !== null ? this._value : '',
            editorHash: this._editorHash
        });


        if (this._options.on && Utils.isObject(this._options.on)) {
            let input = field.find('textarea').addBack('textarea');

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

        if (this._readonly) {
            return;
        }

        let tinyMceOptions = {};
        let that           = this;
        let textareaId     = 'editor-' + this._editorHash;

        if (typeof this._options.options === 'object' &&
            ! Array.isArray(this._options.options) &&
            Object.keys(this._options.options).length > 0
        ) {
            tinyMceOptions = this._options.options;

        } else if (this._options.options === 'simple') {
            tinyMceOptions = {
                plugins: 'image lists anchor charmap',
                toolbar: 'blocks | bold italic underline | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'forecolor backcolor removeformat',
                menubar: false,
                branding: false
            }

        } else {
            tinyMceOptions = {
                promotion: false,
                branding: false,
                plugins: 'preview importcss searchreplace autolink autosave save directionality code ' +
                    'visualblocks visualchars fullscreen image link media template codesample table ' +
                    'charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                menubar: 'file edit view insert format tools table help',
                toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | ' +
                    'alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | ' +
                    'forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen ' +
                    'preview save print | insertfile image media template link anchor codesample | ltr rtl',
            }
        }

        tinyMceOptions.selector = '#editor-' + this._editorHash;

        if (['string', 'number'].indexOf(typeof this._options.width) >= 0) {
            tinyMceOptions.width = this._options.width;
        }
        if (['string', 'number'].indexOf(typeof this._options.minWidth) >= 0) {
            tinyMceOptions.min_width = this._options.minWidth;
        }
        if (['string', 'number'].indexOf(typeof this._options.maxWidth) >= 0) {
            tinyMceOptions.max_width = this._options.maxWidth;
        }
        if (['string', 'number'].indexOf(typeof this._options.height) >= 0) {
            tinyMceOptions.height = this._options.height;
        }
        if (['string', 'number'].indexOf(typeof this._options.minHeight) >= 0) {
            tinyMceOptions.min_height = this._options.minHeight;
        }
        if (['string', 'number'].indexOf(typeof this._options.maxHeight) >= 0) {
            tinyMceOptions.max_height = this._options.maxHeight;
        }

        tinymce.init(tinyMceOptions).then(function () {
            that._editor = tinymce.get(textareaId);
        });
    }
}


export default FieldWysiwyg;