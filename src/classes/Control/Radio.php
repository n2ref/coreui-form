<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;


require_once __DIR__ . '/../Control.php';


/**
 * Class Text
 * @package CoreUI\Form\Control
 */
class Radio extends Control {

    protected $options    = array();
    protected $checked    = null;
    protected $position   = 'horizontal';
    protected $attributes = array(
        'type' => 'radio',
    );


    /**
     * @param  array $options
     * @param  mixed $checked
     * @return self
     */
    public function setOptions($options, $checked = null) {
        $this->options = $options;
        $this->checked = $checked;
        return $this;
    }


    /**
     * @param  mixed $checked
     * @return self
     */
    public function setChecked($checked) {
        $this->checked = $checked;
        return $this;
    }


    /**
     * @return mixed
     */
    public function getChecked() {
        return $this->checked;
    }


    /**
     * @param  string $position
     * @return self
     */
    public function setPosition($position) {
        $this->position = $position;
        return $this;
    }


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/radio.html');

        if ( ! empty($this->options)) {
            foreach ($this->options as $key => $name) {
                if ($this->readonly) {
                    if ($this->checked !== null) {
                        if ((is_array($this->checked) && in_array($key, $this->checked)) ||
                            $this->checked == $key
                        ) {
                            if ($this->position == 'vertical') {
                                $tpl->readonly->vertical->assign('[NAME]', $name);
                                $tpl->readonly->vertical->reassign();
                            } else {
                                $tpl->readonly->horizontal->assign('[NAME]', $name);
                                $tpl->readonly->horizontal->reassign();
                            }
                        }
                    }

                } else {
                    $attributes = array(
                        "value=\"{$key}\""
                    );

                    if ($this->checked !== null) {
                        if (is_array($this->checked) && in_array($key, $this->checked)) {
                            $attributes[] = 'checked="checked"';

                        } elseif ($this->checked === $key) {
                            $attributes[] = 'checked="checked"';
                        }
                    }

                    if ( ! empty($this->attributes)) {
                        foreach ($this->attributes as $attr_name => $value) {
                            if (trim($attr_name) != 'value') {
                                $attributes[] = "$attr_name=\"$value\"";
                            }
                        }
                    }

                    if ($this->required) {
                        $attributes[] = 'required="required"';
                    }


                    $tpl->radio->assign('[ATTRIBUTES]', implode(' ', $attributes));
                    $tpl->radio->assign('[NAME]',       $name);
                    $tpl->radio->reassign();
                }
            }
        }

        return $tpl->render();
    }
}