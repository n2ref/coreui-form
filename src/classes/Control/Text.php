<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;


require_once __DIR__ . '/../Control.php';



/**
 * Class Text
 * @package CoreUI\Form\Control
 */
class Text extends Control {

    protected $attributes = array(
        'type'  => 'text',
        'class' => 'combine-form-control',
    );


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/text.html');

        if ($this->readonly) {
            $text = '';
            if ( ! empty($this->attributes['value'])) {
                $text = $this->attributes['value'];
            }

            $tpl->readonly->assign('[VALUE]', $text);

        } else {
            $attributes = array();

            if ( ! empty($this->attributes)) {
                foreach ($this->attributes as $attr_name => $value) {
                    $attributes[] = "$attr_name=\"$value\"";
                }
            }

            if ($this->required) {
                $attributes[] = 'required="required"';
            }


            $tpl->control->assign('[ATTRIBUTES]', implode(' ', $attributes));
        }

        return $tpl->render();
    }
}