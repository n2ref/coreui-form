
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import ControlButton   from "./button";


class ControlLink extends ControlButton {

    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type   : 'link',
            url    : null,
            content: null,
            onClick: null,
            attr   : {
                class: 'btn btn-link'
            }
        }, options);

        super(form, options);
    }


    /**
     * Блокировка
     */
    lock() {

        let link = $('#coreui-form-' + this.getId() + ' > a');

        if ( ! link.find('.spinner-border')[0]) {
            link.prepend('<span class="spinner-border spinner-border-sm"></span> ');
        }
        if ( ! link.attr('disabled')) {
            link.attr('disabled', 'disabled');
        }
    }


    /**
     * Разблокировка
     */
    unlock () {

        let link = $('#coreui-form-' + this.getId() + ' > a');

        link.find('.spinner-border').remove();
        link.removeAttr('disabled');
    }


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render() {

        let attributes = [];
        let options    = this.getOptions();

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return coreuiFormUtils.render(coreuiFormTpl['controls/link.html'], {
            url    : this._options.url,
            content: this._options.content,
            attr   : attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
        });
    }
}

export default ControlLink;