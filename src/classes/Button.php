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
    protected $control_html = null;
    protected $readonly     = false;
    protected $theme_src    = '';


    /**
     * @param string $title
     */
    public function __construct($title) {
        if ( ! empty($title)) {
            $this->attributes['value'] = $title;
        }

        $this->theme_src = substr(realpath(__DIR__ . '/../html'), strlen($_SERVER['DOCUMENT_ROOT']));
    }


    /**
     * @param bool $readonly
     * @return self
     */
    public function setReadonly($readonly) {
        $this->readonly = (bool)$readonly;
        return $this;
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
    public function setControlHtml($html) {
        $this->control_html = $html;
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
     * @return bool
     */
    public function isReadonly() {
        return $this->readonly;
    }


    /**
     * Render form control
     * @return string
     */
    public function render() {

        if ($this->control_html !== null) {
            $control_html = $this->control_html;
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