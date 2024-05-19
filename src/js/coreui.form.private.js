import coreuiForm from "./coreui.form";


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
     * @param {object} field
     * @return {object|null}
     * @private
     */
    initField: function (form, field) {

        if (typeof field !== 'object') {
            return null;
        }

        let type = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : 'input';

        if (type === 'group') {
            return null;
        }

        if ( ! coreuiForm.fields.hasOwnProperty(type)) {
            type = 'input';
        }

        if (form._options.readonly) {
            field.readonly = true;
        }


        let fieldInstance = $.extend(true, {
            render:        function () {},
            renderContent: function () {},
            init:          function () {},
            getValue:      function () {},
            setValue:      function () {},
            getOptions:    function () {},
            show:          function () {},
            hide:          function () {},
            readonly:      function () {},
            validate:      function () {},
            isValid:       function () {},
        }, coreuiForm.fields[type]);

        fieldInstance.init(form, field, form._fieldsIndex++);

        form._fields.push(fieldInstance);

        return fieldInstance;
    },


    /**
     * Инициализация группы
     * @param {object} form
     * @param {object} group
     * @return {object|null}
     * @private
     */
    initGroup: function (form, group) {

        if (typeof group !== 'object') {
            return null;
        }

        let type = group.hasOwnProperty('type') && typeof group.type === 'string' ? group.type : '';

        if (type !== 'group') {
            return null;
        }

        let groupInstance = $.extend(true, {
            render:     function () {},
            init:       function () {},
            getOptions: function () {},
            expand:     function () {},
            collapse:   function () {},
        }, coreuiForm.fields[type]);

        groupInstance.init(form, group, form._groupsIndex++);

        form._groups.push(groupInstance);

        return groupInstance;
    },


    /**
     * Инициализация контролов
     * @param {object} form
     * @param {object} control
     * @return {object|null}
     * @private
     */
    initControl: function (form, control) {

        if (typeof control !== 'object') {
            return null;
        }

        let type = control.hasOwnProperty('type') && typeof control.type === 'string' ? control.type : null;

        if ( ! type || ! coreuiForm.controls.hasOwnProperty(type)) {
            return null;
        }

        if (type === 'submit' && form._options.readonly) {
            control.show = false;
        }


        let controlInstance = $.extend(true, {
            render:     function () {},
            init:       function () {},
            getOptions: function () {},
            show:       function () {},
            hide:       function () {},
        }, coreuiForm.controls[type]);

        controlInstance.init(form, control, form._controlsIndex++);

        form._controls.push(controlInstance);

        return controlInstance;
    }
}

export default coreuiFormPrivate;