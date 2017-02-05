<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;


require_once __DIR__ . '/../Control.php';


/**
 * Class Date
 * @package CoreUI\Form\Control
 */
class Date extends Control {

    protected $attributes = array(
        'type' => 'hidden'
    );

    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/date.html');

        if ($this->readonly) {
            $text = '';
            if ( ! empty($this->attributes['value'])) {
                $text = $this->attributes['value'];
            }

            $tpl->readonly->assign('[VALUE]', $text);

        } else {
            $id = crc32(uniqid('d', true));
            $attributes = array(
                "id=\"{$id}\""
            );

            if ( ! empty($this->attributes)) {
                foreach ($this->attributes as $attr_name => $value) {
                    if (trim($attr_name) != 'id') {
                        $attributes[] = "$attr_name=\"$value\"";
                    }
                }
            }

            if ($this->required) {
                $attributes[] = 'required="required"';
            }


            $tpl->control->assign('[ATTRIBUTES]', implode(' ', $attributes));
            $tpl->control->assign('[TPL_DIR]',    $this->theme_src);
            $tpl->control->assign('[ID]',         $id);
        }

        return $tpl->render();
    }
}