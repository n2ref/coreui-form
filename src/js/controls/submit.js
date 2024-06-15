
import coreuiFormTpl   from "../coreui.form.templates";
import coreuiFormUtils from "../coreui.form.utils";
import ControlButton   from "./button";


class ControlSubmit extends ControlButton {


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     */
    constructor(form, options) {

        options = $.extend(true, {
            type: 'submit',
            content: null,
            onClick: null,
            show: true,
            attr: {
                class: 'btn btn-primary'
            }
        }, options);

        super(form, options);
    }


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render() {

        let attributes = [];
        let options    = this.getOptions();

        options.attr.type = 'submit';

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return coreuiFormUtils.render(coreuiFormTpl['controls/button.html'], {
            content: this._options.content,
            attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
        });
    }
}

export default ControlSubmit;