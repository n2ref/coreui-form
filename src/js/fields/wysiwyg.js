
import '../../../node_modules/ejs/ejs.min';
import coreuiForm      from "../coreui.form";
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";


coreuiForm.fields.wysiwyg = {

    _id: '',
    _hash: '',
    _form: null,
    _value: null,
    _editor: null,
    _editorHash: null,
    _options: {
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
        outContent: null,
        description: null,
        required: null,
        readonly: false,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form       = form;
        this._index      = index;
        this._id         = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash       = coreuiFormUtils.hashCode();
        this._editorHash = coreuiFormUtils.hashCode();
        this._value      = coreuiFormUtils.getFieldValue(form, options);
        this._options    = coreuiFormUtils.mergeFieldOptions(form, this._options, options);

        let that = this;

        form.on('shown.coreui.form', function () {
            if ( ! that._options.readonly) {
                that._initEvents();
            }
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration || 0);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration || 0);
    },


    /**
     * Получение значения из поля
     * @return {string|null}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;
        } else {
            return this._editor ? this._editor.getContent() : this._value;
        }
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            if (this._editor) {
                this._editor.setContent(value);
            }
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);

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
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            return !! this.getValue();
        }

        return true;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils.getAttacheFields(this._form, options);

        return ejs.render(coreuiFormTpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let options = this.getOptions();

        return ejs.render(coreuiFormTpl['fields/wysiwyg.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            editorHash: this._editorHash
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        if (this._options.readonly) {
            return;
        }

        let tinyMceOptions = {};
        let than           = this;
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
            than._editor = tinymce.get(textareaId);
        });
    }
}