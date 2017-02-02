<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;

require_once __DIR__ . '/../Control.php';


/**
 * Class Textarea
 * @package CoreUI\Form\Control
 */
class Textarea extends Control {

    protected $value      = '';
    protected $attributes = array(
        'class' => 'combine-form-control',
    );


    /**
     * @param  string $string
     * @return $this
     */
    public function setValue($string) {
        $this->value = htmlspecialchars($string);
        return $this;
    }


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/textarea.html');

        if ($this->readonly) {
            $tpl->readonly->assign('[VALUE]', $this->value);

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
            $tpl->control->assign('[VALUE]',      $this->value);
        }

        return $tpl->render();
    }
}