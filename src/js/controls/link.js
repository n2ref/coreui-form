
import FormTpl   from "../form.tpl";
import FormUtils from "../form.utils";
import ControlButton   from "./button";


class ControlLink extends ControlButton {

    /**
     * Инициализация
     * @param {FormInstance} form
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

        if (['function', 'string'].indexOf(typeof this._options.onClick) >= 0) {
            let that = this;

            form.on('show', function () {

                $('#coreui-form-' + that.getId() + ' > a')
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

        return FormUtils.render(FormTpl['controls/link.html'], {
            url    : this._options.url,
            content: this._options.content,
            attr   : attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
        });
    }
}

export default ControlLink;