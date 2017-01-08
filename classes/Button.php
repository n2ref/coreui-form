<?php

namespace CoreUI\Form\Classes;
use CoreUI\Form\Classes\Button\Submit;
use CoreUI\Exception;
use CoreUI\Registry;


/**
 * Class Button
 * @package CoreUI\Form\Classes
 */
abstract class Button {

    protected $attributes   = array();
    protected $html         = null;
    protected $html_wrapper = null;
    protected $theme_src    = '';


    /**
     * @param string $title
     */
    public function __construct($title) {
        if ( ! empty($title)) {
            $this->attributes['value'] = $title;
        }

        $this->theme_src = substr(__DIR__, strlen($_SERVER['DOCUMENT_ROOT']));
    }


    /**
     * @param  string     $name
     * @param  string     $value
     * @return Button\Button|Button\Submit|Button\Reset
     * @throws Exception
     */
    public function setAttr($name, $value) {
        if (is_string($name) || is_numeric($value)) {
            $this->attributes[$name] = $value;

        } else {
            throw new Exception("Attribute not valid type. Need string");
        }

        return $this;
    }


    /**
     * @param  string     $name
     * @param  string     $value
     * @return Button\Button|Button\Submit|Button\Reset
     * @throws Exception
     */
    public function setAppendAttr($name, $value) {
        if (is_string($name) && (is_string($value) || is_numeric($value))) {
            if (isset($this->attributes[$name])) {
                $this->attributes[$name] = $value . $this->attributes[$name];
            } else {
                $this->attributes[$name] = $value;
            }

        } else {
            throw new Exception("Attribute not valid type. Need string");
        }

        return $this;
    }



    /**
     * @param  string     $name
     * @param  string     $value
     * @return Button\Button|Button\Submit|Button\Reset
     * @throws Exception
     */
    public function setPrependAttr($name, $value) {
        if (is_string($name) && (is_string($value) || is_numeric($value))) {
            if (isset($this->attributes[$name])) {
                $this->attributes[$name] = $this->attributes[$name] . $value;
            } else {
                $this->attributes[$name] = $value;
            }

        } else {
            throw new Exception("Attribute not valid type. Need string");
        }

        return $this;
    }


    /**
     * @param  array $attributes
     * @return Button\Button|Button\Submit|Button\Reset
     */
    public function setAttribs($attributes) {
        foreach ($attributes as $name => $value) {
            $this->setAttr($name, $value);
        }
        return $this;
    }


    /**
     * @param  array $attributes
     * @return Button\Button|Button\Submit|Button\Reset
     */
    public function setAppendAttribs($attributes) {
        foreach ($attributes as $name => $value) {
            $this->setAppendAttr($name, $value);
        }
        return $this;
    }


    /**
     * @param  array $attributes
     * @return Button\Button|Button\Submit|Button\Reset
     */
    public function setPrependAttribs($attributes) {
        foreach ($attributes as $name => $value) {
            $this->setPrependAttr($name, $value);
        }
        return $this;
    }


    /**
     * @param  string $html
     * @return Button\Button|Button\Submit|Button\Reset
     */
    public function setHtml($html) {
        $this->html = $html;
        return $this;
    }


    /**
     * @param  string $html
     * @return Button\Button|Button\Submit|Button\Reset
     */
    public function setHtmlWrapper($html) {
        $this->html_wrapper = $html;
        return $this;
    }


    /**
     * @param  string $name
     * @return mixed
     */
    public function getAttr($name) {
        if (array_key_exists($name, $this->attributes)) {
            return $this->attributes[$name];

        }
        return false;
    }


    /**
     * Render form control
     * @return string
     */
    public function render() {

        if ($this->html !== null) {
            $control_html = $this->html;
        } else {
            $control_html = $this->makeControl();
        }

        return $control_html;
    }


    /**
     * @return string
     */
    abstract protected function makeControl();
}