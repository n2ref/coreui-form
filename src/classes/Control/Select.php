<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;

require_once __DIR__ . '/../Control.php';



/**
 * Class Select
 * @package CoreUI\Form\Control
 */
class Select extends Control {

    protected $options    = array();
    protected $selected   = null;
    protected $attributes = array(
        'class' => 'combine-form-control',
    );


    /**
     * @param  array $options
     * @param  mixed $selected
     * @return self
     */
    public function setOptions($options, $selected = null) {
        $this->options  = $options;
        $this->selected = $selected;
        return $this;
    }


    /**
     * @param  mixed $selected
     * @return self
     */
    public function setSelected($selected) {
        $this->selected = $selected;
        return $this;
    }


    /**
     * @return mixed
     */
    public function getSelected() {
        return $this->selected;
    }



    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/select.html');

        if ($this->readonly) {
            if ( ! empty($this->options)) {
                foreach ($this->options as $value => $option) {
                    if (is_array($option)) {
                        foreach ($option as $val => $opt) {
                            if ($this->selected !== null &&
                                ((is_array($this->selected) &&
                                in_array((string)$val, $this->selected)) ||
                                (string)$val === $this->selected)
                            ) {
                                $tpl->readonly->assign('[OPTION]', $opt);
                                $tpl->readonly->reassign();
                            }
                        }

                    } else {
                        if ($this->selected !== null &&
                            ((is_array($this->selected) &&
                            in_array((string)$value, $this->selected)) ||
                            (string)$value === $this->selected)
                        ) {
                            $tpl->readonly->assign('[OPTION]', $option);
                            $tpl->readonly->reassign();
                        }
                    }
                }
            }

        } else {
            $attributes = [];

            if ( ! empty($this->attributes)) {
                foreach ($this->attributes as $attr_name => $value) {
                    $attributes[] = "$attr_name=\"$value\"";
                }
            }

            if ($this->required) {
                $attributes[] = 'required="required"';
            }

            $options = '';
            if ( ! empty($this->options)) {
                foreach ($this->options as $value => $option) {
                    if (is_array($option)) {
                        $options .= "<optgroup label=\"{$value}\">";
                        foreach ($option as $val => $opt) {
                            if ($this->selected !== null &&
                                ((is_array($this->selected) &&
                                in_array((string)$val, $this->selected)) ||
                                (string)$val === $this->selected)
                            ) {
                                $sel = 'selected="selected" ';
                            } else {
                                $sel = '';
                            }
                            $options .= "<option {$sel}value=\"{$val}\">{$opt}</option>";
                        }
                        $options .= '</optgroup>';

                    } else {
                        if ($this->selected !== null &&
                            ((is_array($this->selected) &&
                            in_array((string)$value, $this->selected)) ||
                            (string)$value === $this->selected)
                        ) {
                            $sel = 'selected="selected" ';
                        } else {
                            $sel = '';
                        }
                        $options .= "<option {$sel}value=\"{$value}\">{$option}</option>";
                    }
                }
            }


            $tpl->control->assign('[OPTIONS]',    $options);
            $tpl->control->assign('[ATTRIBUTES]', implode(' ', $attributes));
        }

        return $tpl->render();
    }
}