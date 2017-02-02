<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;


require_once __DIR__ . '/../Control.php';



/**
 * Class Custom
 * @package CoreUI\Form\Control
 */
class Custom extends Control {

    /**
     * @return string
     */
    public function makeControl() {
        return $this->control_html;
    }
}