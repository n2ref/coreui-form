<?php
namespace CoreUI\Form\Classes;
use CoreUI\Registry;
use CoreUI\Exception;
use CoreUI\Utils\Mtpl;
use CoreUI\Utils\Session\SessionNamespace;



/**
 * Class Cell
 * @package CoreUI\Form
 */
abstract class Control {

    protected $label        = '';
    protected $name         = '';
    protected $resource     = '';
    protected $attributes   = array();
    protected $out          = '';
    protected $readonly     = false;
    protected $required     = false;
    protected $control_html = null;
    protected $wrapper_html = null;
    protected $lang         = 'en';
    protected $theme_src    = '';
    protected $scripts_js  = array();
    protected $scripts_css = array();


    /**
     * @param string $label
     * @param string $name
     */
    public function __construct($label, $name = '') {
        $this->label = $label;
        $this->name  = $name;

        if ( ! empty($this->name)) {
            $this->attributes['name'] = $this->name;
        }

        $this->lang      = Registry::getLanguage();
        $this->theme_src = substr(realpath(__DIR__ . '/../html'), strlen($_SERVER['DOCUMENT_ROOT']));
    }


    /**
     * @param string $resource
     * @return self
     */
    public function setResource($resource) {
        $this->resource = $resource;
        return $this;
    }


    /**
     * @param  string     $name
     * @param  string     $value
     * @return self
     * @throws Exception
     */
    public function setAttr($name, $value) {
        if (is_string($name) && (is_scalar($value) || $value == null)) {
            $this->attributes[$name] = $value;

        } else {
            throw new Exception("Attribute not valid type. Need string");
        }

        return $this;
    }


    /**
     * @param  string     $name
     * @param  string     $value
     * @return self
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
     * @return self
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
     * @return self
     */
    public function setAttribs($attributes) {
        foreach ($attributes as $name => $value) {
            $this->setAttr($name, $value);
        }
        return $this;
    }


    /**
     * @param  array $attributes
     * @return self
     */
    public function setAppendAttribs($attributes) {
        foreach ($attributes as $name => $value) {
            $this->setAppendAttr($name, $value);
        }
        return $this;
    }


    /**
     * @param  array $attributes
     * @return self
     */
    public function setPrependAttribs($attributes) {
        foreach ($attributes as $name => $value) {
            $this->setPrependAttr($name, $value);
        }
        return $this;
    }


    /**
     * @param  string $message
     * @return self
     */
    public function setRequired() {
        $this->required = true;
        return $this;
    }


    /**
     * @param  string $out
     * @return self
     */
    public function setOut($out) {
        $this->out = $out;
        return $this;
    }


    /**
     * @param  mixed $data
     * @return self
     */
    public function setData($data) {
        $this->data = $data;
        return $this;
    }


    /**
     * @param  string     $html
     * @return self
     */
    public function setControlHtml($html) {
        $this->control_html = $html;
        return $this;
    }


    /**
     * @param  string $html
     * @return self
     */
    public function setWrapperHtml($html) {
        $this->wrapper_html = $html;
        return $this;
    }


    /**
     * @param bool $readonly
     * @return self
     */
    public function setReadonly($readonly = true) {
        $this->readonly = (bool)$readonly;
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
     * @return string
     */
    public function getName() {
        return $this->name;
    }


    /**
     * @return array
     */
    public function getJs() {
        return $this->scripts_js;
    }


    /**
     * @return array
     */
    public function getCss() {
        return $this->scripts_css;
    }


    /**
     * @return bool
     */
    public function isRequired() {
        return $this->required;
    }


    /**
     * @return bool
     */
    public function isReadonly() {
        return $this->readonly;
    }


    /**
     * @param string $src
     * @param bool   $is_cached
     */
    public function addCss($src, $is_cached = false) {
        $this->scripts_css[$src] = $is_cached;
    }


    /**
     * @param string $src
     * @param bool   $is_cached
     */
    public function addJs($src, $is_cached = false) {
        $this->scripts_js[$src] = $is_cached;
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

        if ($this->control_html !== null) {
            $wrapper_html = $this->control_html;
        } else {
            $wrapper_html = $this->makeWrapper();
        }

        $wrapper_html = str_replace('[CONTROL]', $control_html, $wrapper_html);

        return $wrapper_html;
    }


    /**
     * @return string
     */
    protected function makeWrapper() {

        $tpl = new Mtpl(__DIR__ . '/../html/form/wrappers/control.html');

        if ( ! empty($this->attributes['id'])) {
            $label_for = ' for="' . $this->attributes['id'] . '"';

        } else {
            $label_for = '';
        }
        $name = ! empty($this->attributes['name']) ? $this->attributes['name'] : '';
        $tpl->assign('[RESOURCE]',  strtolower($this->resource));
        $tpl->assign('[NAME]',      $name);
        $tpl->assign('[LABEL_FOR]', $label_for);
        $tpl->assign('[LABEL]',     $this->label);

        if ($this->required) {
            $tpl->touchBlock('req');
        }

        if ( ! empty($this->out)) {
            $tpl->out->assign('[OUT]', $this->out);
        }

        return $tpl->render();
    }


    /**
     * @return string
     */
    abstract protected function makeControl();
}