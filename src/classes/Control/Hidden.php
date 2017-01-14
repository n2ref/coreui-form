<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;

require_once __DIR__ . '/../Control.php';



/**
 * Class Hidden
 * @package CoreUI\Form\Control
 */
class Hidden extends Control {

    protected $attributes = array(
        'type' => 'hidden',
    );


    /**
     * @param string $label
     * @param string $name
     */
    public function __construct($label, $name) {
        parent::__construct($label, $name);
    }


    /**
     * @return string
     */
    protected function makeWrapper() {
        return '[CONTROL]';
    }


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = file_get_contents(__DIR__ . '/../../html/form/controls/hidden.html');

        $attributes = array();

        if ( ! empty($this->attributes)) {
            foreach ($this->attributes as $attr_name => $value) {
                $attributes[] = "$attr_name=\"$value\"";
            }
        }

        if ($this->required) {
            $attributes[] = 'required="required"';

            if ($this->required_message) {
                $attributes[] = "data-required-message=\"{$this->required_message}\"";
            }
        }

        $tpl = str_replace('[ATTRIBUTES]', implode(' ', $attributes), $tpl);

        return $tpl;
    }
}