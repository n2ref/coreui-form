import coreuiForm      from "./coreui.form";
import coreuiFormUtils from "./coreui.form.utils";
import coreuiFormTpl   from "./coreui.form.templates";


let coreuiFormPrivate = {

    /**
     * Выполнение событий
     * @param {object}      form
     * @param {string}      name
     * @param {object|null} context
     * @param {Array}       params
     * @return {object}
     * @private
     */
    trigger: function(form, name, params, context) {

        params = params || [];
        let results = [];

        if (form._events[name] instanceof Object && form._events[name].length > 0) {
            for (var i = 0; i < form._events[name].length; i++) {
                let callback = form._events[name][i].callback;

                let funcContext = form._events[name][i].context || context || form;

                results.push(
                    callback.apply(funcContext, params)
                );

                if (form._events[name][i].singleExec) {
                    form._events[name].splice(i, 1);
                    i--;
                }
            }
        }

        return results;
    },


    /**
     * Инициализация поля
     * @param {object} form
     * @param {object} options
     * @return {object|null}
     * @private
     */
    initField: function (form, options) {

        if (typeof options !== 'object') {
            return null;
        }

        let type = options.hasOwnProperty('type') && typeof options.type === 'string' ? options.type : 'input';

        if (type === 'group') {
            return null;
        }

        if ( ! coreuiForm.fields.hasOwnProperty(type)) {
            type = 'input';
        }

        if (form._readonly) {
            options.readonly = true;
        }

        let index   = form._fieldsIndex++;
        let name    = options.hasOwnProperty('name') && typeof options.name === 'string' && options.name ? options.name : null;
        let fieldId = options.hasOwnProperty('id') && typeof options.id === 'string' && options.id ? options.id : null;


        if (options.hasOwnProperty('width') && options.width) {
            let unit = typeof options.width === 'number' ? 'px' : '';
            options.width = options.width + unit;

        } else if (form._options.fieldWidth && options.type !== 'color') {
            let unit = typeof form._options.fieldWidth === 'number' ? 'px' : '';
            options.width = form._options.fieldWidth + unit;
        }

        options.value     = coreuiFormUtils.getFieldValue(form, name);
        options.contentId = coreuiFormUtils.hashCode();
        options.id        = form.getId() + '-' + (fieldId || name || index);

        let fieldInstance = new coreuiForm.fields[type](form, options);

        form._fields.push(fieldInstance);

        return fieldInstance;
    },


    /**
     * Инициализация группы
     * @param {object} form
     * @param {object} options
     * @return {object|null}
     * @private
     */
    initGroup: function (form, options) {

        if (typeof options !== 'object') {
            return null;
        }

        let type = options.hasOwnProperty('type') && typeof options.type === 'string' ? options.type : '';

        if (type !== 'group') {
            return null;
        }

        let index   = form._groupsIndex++;
        let fieldId = options.hasOwnProperty('id') && typeof options.id === 'string' && options.id ? options.id : null;

        options.id = form.getId() + '-' + (fieldId || index);


        let groupInstance = new coreuiForm.fields.group(form, options);

        form._groups.push(groupInstance);

        return groupInstance;
    },


    /**
     * Инициализация контролов
     * @param {object} form
     * @param {object} options
     * @return {object|null}
     * @private
     */
    initControl: function (form, options) {

        if (typeof options !== 'object') {
            return null;
        }

        let type = options.hasOwnProperty('type') && typeof options.type === 'string' ? options.type : null;

        if ( ! type || ! coreuiForm.controls.hasOwnProperty(type)) {
            return null;
        }

        if (type === 'submit' && form._readonly) {
            options.show = false;
        }

        let index     = form._controlsIndex++;
        let name      = options.hasOwnProperty('name') && typeof options.name === 'string' && options.name ? options.name : null;
        let controlId = options.hasOwnProperty('id') && typeof options.id === 'string' && options.id ? options.id : null;

        options    = $.extend(true, {}, options);
        options.id = form.getId() + '-control-' + (controlId || name || index);

        let controlInstance = new coreuiForm.controls[type](form, options);

        form._controls.push(controlInstance);

        return controlInstance;
    },


    /**
     * Рендер группы
     * @param {FieldGroup} group
     * @return {*|null}
     */
    renderGroup: function (group) {

        let container = $(
            coreuiFormUtils.render(coreuiFormTpl['form-field-group.html'], {
                id: group.getId(),
                group: group.getOptions(),
            })
        );

        let groupContent = container.find('.coreui-form__group_content');
        let fields       = group.renderContent();

        $.each(fields, function (key, field) {
            groupContent.append(field);
        });

        return container;
    },


    /**
     * Рендер поля
     * @param {object} form
     * @param {Field}  field
     * @return {*|null}
     */
    renderField: function (form, field) {

        if ( ! field || typeof field !== 'object') {
            return null;
        }

        let fieldOptions = field.getOptions();
        let contentId    = field.getContentId();
        let attachFields = coreuiFormUtils.getAttacheFields(form, fieldOptions);
        let direction    = fieldOptions.hasOwnProperty('fieldsDirection') && typeof fieldOptions.fieldsDirection === 'string'
            ? fieldOptions.fieldsDirection
            : 'row';
        let directionClass = direction === 'column' ? 'd-block mt-2' : 'd-inline-block';


        if (fieldOptions.hasOwnProperty('labelWidth') && fieldOptions.labelWidth) {
            let unit = typeof fieldOptions.labelWidth === 'number' ? 'px' : '';
            fieldOptions.labelWidth = fieldOptions.labelWidth + unit;

        } else if (form._options.labelWidth) {
            let unit = typeof form._options.labelWidth === 'number' ? 'px' : '';
            fieldOptions.labelWidth = form._options.labelWidth + unit;
        }


        let fieldContainer = $(
            coreuiFormUtils.render(coreuiFormTpl['form-field-label.html'], {
                id: field.getId(),
                field: fieldOptions,
                contentId: contentId,
                issetAttachFields: attachFields.length > 0,
                directionClass: directionClass,
            })
        );

        let fiendContent = $('.content-' + contentId, fieldContainer);
        let content     = field.renderContent();

        if (Array.isArray(content) || content instanceof jQuery) {
            $.each(content, function (key, item) {
                fiendContent.append(item);
            });

        } else if (content) {
            fiendContent.append(content);
        }


        if (attachFields.length > 0) {
            let fiendAttachContainer = $('.coreui-form__attach-fields', fieldContainer);

            $.each(attachFields, function (i, attachField) {
                let attachContainer = $(
                    coreuiFormUtils.render(coreuiFormTpl['form-field-attach.html'], {
                        contentId     : attachField.contentId,
                        directionClass: directionClass,
                    })
                );

                attachContainer.append(attachField.content)

                fiendAttachContainer.append(attachContainer);
            });
        }

        return fieldContainer;
    }
}

export default coreuiFormPrivate;