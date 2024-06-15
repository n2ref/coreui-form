

import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import Control         from "../abstract/Control";


class ControlButton extends Control {

    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}            options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'button',
            content: null,
            onClick: null,
            attr: {
                class: 'btn btn-secondary'
            }
        }, options);

        super(form, options);

        if (['function', 'string'].indexOf(typeof this._options.onClick) >= 0) {
            let that = this;

            form.on('show', function () {

                $('#coreui-form-' + that.getId() + ' > button')
                    .click(function (event) {

                        if (typeof that._options.onClick === 'function') {
                            that._options.onClick(that._form, event);
                        } else {
                            (new Function('form', 'event', that._options.onClick))(that._form, event);
                        }
                    });
            });
        }
    }


    /**
     * Блокировка
     */
    lock() {

        let button = $('#coreui-form-' + this.getId() + ' > button');

        if ( ! button.find('.spinner-border')[0]) {
            button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
        }
        if ( ! button.attr('disabled')) {
            button.attr('disabled', 'disabled');
        }
    }


    /**
     * Разблокировка
     */
    unlock () {

        let button = $('#coreui-form-' + this.getId() + ' > button');

        button.find('.spinner-border').remove();
        button.removeAttr('disabled');
    }


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render() {

        let attributes = [];
        let options    = this.getOptions();

        options.attr.type = 'button';

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return coreuiFormUtils.render(coreuiFormTpl['controls/button.html'], {
            content: this._options.content,
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
        });
    }
}

export default ControlButton;